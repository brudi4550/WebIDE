const express = require('express');
const app = express();
const fs = require('fs-extra');
const bodyParser = require('body-parser')
app.use(bodyParser.json());
require('dotenv').config({ path: __dirname + '/.env' })
global.__basedir = __dirname;
const PORT = process.env.PORT || 3000;

const filesDir = __basedir + '/files';
if (!fs.existsSync(filesDir)){
  fs.mkdirSync(filesDir);
}

const bufferFile = filesDir + '/outputBuffer.txt';
if (!fs.existsSync(bufferFile)) {
  fs.createFileSync(bufferFile);
}

const uncompiledDir = __basedir + '/files/uncompiled';
if (!fs.existsSync(uncompiledDir)){
  fs.mkdirSync(uncompiledDir);
} else {
  fs.emptyDirSync(uncompiledDir);
}

const compiledDir = __basedir + '/files/compiled';
if (!fs.existsSync(compiledDir)){
  fs.mkdirSync(compiledDir);
} else {
  fs.emptyDirSync(compiledDir);
}

require('./api/api.js')(app);
require('./api/info.js')(app);

app.listen(PORT, () => {
  console.log(`WebIDE backend running on ${PORT}`);
});
