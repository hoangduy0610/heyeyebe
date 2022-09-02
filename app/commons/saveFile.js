const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '../ML_Models/output')

exports.saveFile = (fileName, buf) => {
    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir)
    }

    fs.writeFileSync(path.resolve(baseDir, fileName), buf)
}