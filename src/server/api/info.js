const path = require('path');
const fs = require('fs-extra');

module.exports = function (app) {

    app.get('/languagePreview/:language', (req, res) => {
        const language = req.params['language'];
        let fileName;
        switch (language) {
            case 'java':
                fileName = 'Main.java';
                break;
            case 'c':
                fileName = 'HelloWorld.c';
                break;
            case 'python':
                fileName = 'primes.py';
                break;
            case 'rust':
                fileName = 'largestString.rs';
                break;
            case 'c++':
                fileName = 'decimalToBinary.cpp';
                break;
            case 'go':
                fileName = 'sum.go';
                break;
            case 'javascript':
                fileName = 'WTF.js';
                break;
            case 'bash':
                fileName = 'christmasTrees.sh';
                break;
            default: preview = 'No preview available.';
        }
        console.log('sending preview for language: ' + language);
        preview = fs.readFileSync(path.join(__basedir, 'files', 'languagePreviews', fileName), 'utf-8');
        res.status(200).send({
            preview: preview,
            fileName: fileName
        });
    });

}