const faceapi = require('face-api.js');
const fs = require('fs');
const { canvas, faceDetectionNet, faceDetectionOptions, saveFile } = require('../commons');

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
            var resultsz = Object.values(content[x].descriptors[y]);
            content[x].descriptors[y] = new Float32Array(resultsz);
        }
    }
    const faceMatcher = await createFaceMatcher(content);
    const img = await canvas.loadImage('temp/test_images/3.jpg')
    const results = await faceapi.detectAllFaces(img, faceDetectionOptions)
        .withFaceLandmarks()
        .withFaceExpressions()
        .withFaceDescriptors()

    const results2 = results.map(d => faceMatcher.findBestMatch(d.descriptor));

    const out = faceapi.createCanvasFromMedia(img);
    faceapi.draw.drawDetections(out, results.map(dd => dd.detection))
    faceapi.draw.drawFaceExpressions(out, results)

    const ret = results.map(ddd => ddd.expressions);
    ret.map((re, ri) => Object.keys(re).forEach(function (key, index) {
        re[key] = Math.floor((re[key] + Number.EPSILON) * 1000) / 1000;
        re.name = results2[ri].label;
    }));
    await res.send(ret)
    // saveFile('faceExpressionRecognition.jpg', out.toBuffer('image/jpeg'))
    // console.log('done, saved results to out/faceExpressionRecognition.jpg')
}

exports.train = async (req, res, next) => {
    await faceDetectionNet.loadFromDisk('app/ML_Models/weights')
    await faceapi.nets.faceLandmark68Net.loadFromDisk('app/ML_Models/weights')
    await faceapi.nets.faceExpressionNet.loadFromDisk('app/ML_Models/weights')
    await faceapi.nets.faceRecognitionNet.loadFromDisk('app/ML_Models/weights')
    let willBeTraining = await getDirectories('app/ML_Models/datasets');
    const obj_trained = JSON.parse(await readPretrained());
    const trained = await obj_trained.map(e => {
        if (e) return e.label
        return;
    });
    willBeTraining = willBeTraining.filter((el) => !trained.includes(el));
    const labeledFaceDescriptors = await loadLabeledImages(willBeTraining)
    if (willBeTraining.length) await saveFile('pretrained.ds', JSON.stringify([...obj_trained, ...labeledFaceDescriptors]))

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

function loadLabeledImages(labels) {
    // const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark']
    return Promise.all(
        labels.map(async label => {
            const descriptions = []
            for (let i = 1; i <= 2; i++) {
                // const img = await faceapi.fetchImage(`labeled_images/${label}/${i}.jpg`)
                const img = await canvas.loadImage(`app/ML_Models/datasets/${label}/${i}.jpg`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                descriptions.push(detections.descriptor)
            }

            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}

async function createFaceMatcher(data) {
    const labeledFaceDescriptors = await Promise.all(data.map(className => {
        const descriptors = [];
        for (var i = 0; i < className.descriptors.length; i++) {
            descriptors.push(className.descriptors[i]);
        }
        return new faceapi.LabeledFaceDescriptors(className.label, descriptors);
    }))
    return new faceapi.FaceMatcher(labeledFaceDescriptors);
}