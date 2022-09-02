const faceapi = require('face-api.js');

exports.faceDetectionOptions = (net) => {
    // SsdMobilenetv1Options
    const minConfidence = 0.5

    // TinyFaceDetectorOptions
    const inputSize = 408
    const scoreThreshold = 0.5
    return net === faceapi.nets.ssdMobilenetv1
        ? new faceapi.SsdMobilenetv1Options({ minConfidence })
        : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
}

module.exports = {
    faceDetectionNet: faceapi.nets.ssdMobilenetv1
}