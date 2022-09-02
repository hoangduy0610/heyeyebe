const faceapi = require('face-api.js');
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const { canvas, faceDetectionNet, faceDetectionOptions, saveFile } = require('../commons');
const uploadPath = path.join(__dirname, '../../uploads/');
fse.ensureDir(uploadPath);
exports.recog = async (req, res, next) => {
    await faceDetectionNet.loadFromDisk('app/ML_Models/weights')
    await faceapi.nets.faceLandmark68Net.loadFromDisk('app/ML_Models/weights')
    await faceapi.nets.faceExpressionNet.loadFromDisk('app/ML_Models/weights')
    await faceapi.nets.faceRecognitionNet.loadFromDisk('app/ML_Models/weights')

    const labeledFaceDescriptors = await readPretrained()
    var content = JSON.parse(labeledFaceDescriptors)
    if (!content.length) res.status(400).send({ message: "No data pretrained" })
    for (var x = 0; x < Object.keys(content).length; x++) {
        for (var y = 0; y < Object.keys(content[x].descriptors).length; y++) {
            if (content[x].descriptors[y].length) {
                var resultsz = Object.values(content[x].descriptors[y]);
                content[x].descriptors[y] = new Float32Array(resultsz);
            } else {
                content[x].descriptors[y] = null;
            }
        }
    }
    const faceMatcher = await createFaceMatcher(content);

    req.pipe(req.busboy);

    req.busboy.on('file', (fieldname, file, info) => {
        console.log(`Upload of '${info.filename}' started`);

        const fstream = fse.createWriteStream(path.join(uploadPath, info.filename));
        file.pipe(fstream);

        fstream.on('close', async () => {
            console.log(`Upload of '${info.filename}' finished`);
            const img = await canvas.loadImage(path.join(uploadPath, info.filename));
            const results = await faceapi.detectAllFaces(img, faceDetectionOptions)
                .withFaceLandmarks()
                .withFaceExpressions()
                .withFaceDescriptors()

            const results2 = results.map(d => faceMatcher.findBestMatch(d.descriptor));

            const out = faceapi.createCanvasFromMedia(img);
            faceapi.draw.drawDetections(out, results.map(dd => dd.detection))
            faceapi.draw.drawFaceExpressions(out, results)

            const ret = results.map(ddd => ddd.expressions);
            ret.map((re, ri) => Object.keys(re).forEach(async function (key, index) {
                re[key] = Math.floor((re[key] + Number.EPSILON) * 1000) / 1000;
                re.name = results2[ri].label;
                const name_path = info.filename.split(".")
                const tp = new Date();
                const dt = tp.getFullYear() + "-" + tp.getMonth() + "-" + tp.getDate() + " " + tp.getHours() + "-" + tp.getMinutes() + "-" + tp.getSeconds();
                await fse.move(path.join(uploadPath, info.filename), path.join(uploadPath, re.name + "_" + dt + "." + name_path[name_path.length - 1])).catch((e) => { });
            }));
            await res.send(ret)
        });
    });

    // saveFile('faceExpressionRecognition.jpg', out.toBuffer('image/jpeg'))
    // console.log('done, saved results to out/faceExpressionRecognition.jpg')
}

exports.train = async (req, res, next) => {
    await faceDetectionNet.loadFromDisk('app/ML_Models/weights')
    await faceapi.nets.faceLandmark68Net.loadFromDisk('app/ML_Models/weights')
    await faceapi.nets.faceExpressionNet.loadFromDisk('app/ML_Models/weights')
    await faceapi.nets.faceRecognitionNet.loadFromDisk('app/ML_Models/weights')
    let willBeTraining = await getDirectories('app/ML_Models/datasets');
    let obj_trained = JSON.parse(await readPretrained());
    const trained = await obj_trained.map(e => {
        if (e) return {
            label: e.label,
            dataSets: e.descriptors.length
        }
        return;
    });
    willBeTraining = willBeTraining.filter((el) => {
        const numOfDataSets = getFiles(`app/ML_Models/datasets/${el}`).length;
        return !Boolean(trained.find(x => x.label == el && x.dataSets == numOfDataSets))
    });
    const labeledFaceDescriptors = await loadLabeledImages(willBeTraining)
    if (willBeTraining.length) {
        obj_trained = obj_trained.filter(el => {
            return !Boolean(willBeTraining.find(x => x == el.label))
        })
        await saveFile('pretrained.ds', JSON.stringify([...obj_trained, ...labeledFaceDescriptors]))
    }

    await res.send({ message: "Successfully trained " + willBeTraining.length + " labels" })
}

function readPretrained() {
    try {
        return fs.readFileSync('app/ML_Models/output/pretrained.ds', 'utf8');
    } catch (err) {
        if (err.code === 'ENOENT') {
            return '[]'
        } else {
            throw err;
        }
    }
}

function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory();
    });
}

function getFiles(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isFile();
    });
}

function loadLabeledImages(labels) {
    // const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark']
    return Promise.all(
        labels.map(async label => {
            const descriptions = []
            const files_train = await getFiles(`app/ML_Models/datasets/${label}`);
            for (let i = 0; i < files_train.length; i++) {
                const img = await canvas.loadImage(`app/ML_Models/datasets/${label}/${files_train[i]}`);
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                if (!detections) {
                    fs.unlinkSync(`app/ML_Models/datasets/${label}/${files_train[i]}`);
                    console.log(`Train Failed app/ML_Models/datasets/${label}/${files_train[i]}`);
                    continue;
                }
                descriptions.push(detections?.descriptor || new Float32Array([]))
            }

            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}

async function createFaceMatcher(data) {
    const labeledFaceDescriptors = await Promise.all(data.map(className => {
        const descriptors = [];
        for (var i = 0; i < className.descriptors.length; i++) {
            if (className.descriptors[i]) descriptors.push(className.descriptors[i]);
        }
        return new faceapi.LabeledFaceDescriptors(className.label, descriptors);
    }))
    return new faceapi.FaceMatcher(labeledFaceDescriptors);
}