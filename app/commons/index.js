const commons = {};
const faceDetection = require("./faceDetection");
commons.canvas = require("./env").canvas;
commons.faceDetectionNet = faceDetection.faceDetectionNet;
commons.faceDetectionOptions = faceDetection.faceDetectionOptions;
commons.saveFile = require("./saveFile").saveFile;

module.exports = commons;