const path = require('path');
const fs = require('fs-extra');
const { exec, spawn, execSync } = require('child_process');

let cmd = null;

function getFileEndingFromFile(fileName) {
    return fileName.split('.').pop();
}

function cleanup() {
    fs.emptyDirSync(path.join(__basedir, '/files/compiled'));
    fs.emptyDirSync(path.join(__basedir, '/files/uncompiled'));
    fs.truncateSync(path.join(__basedir, '/files/outputBuffer.txt'), 0);
}

module.exports = function (app) {

    app.post('/sendCode', (req, res) => {
        cleanup();
        const fileName = req.body.fileName;
        const language = req.body.language;
        const code = req.body.code;
        console.log('Receiving code:');
        console.log('Filename: ' + fileName);
        console.log('Language: ' + language);
        console.log('Code: ' + code);
        fs.writeFileSync(path.join(__basedir, '/files/uncompiled', fileName), code);
        console.log('created file ' + fileName);
        res.status(200).send({
            message: 'Received code and saved it in a file'
        });
    });

    app.post('/compile/:fileName', async (req, res) => {
        function compileCallback(err, stdout, stderr) {
            const bufferFile = path.join(__basedir, '/files/outputBuffer.txt');
            const stream = fs.createWriteStream(bufferFile, { flags: 'a' });
            if (err) {
                stream.write(err.message);
            }
            if (stderr) {
                stream.write(stderr);
            }
            if (err || stderr) {
                res.status(500).send({ message: 'Compilation of ' + fileName + ' not successful.' });
            } else {
                stream.write(stdout);
                res.status(200).send({
                    message: 'Compilation of ' + fileName + ' successful.'
                });
            }
        }
        const fileName = req.params['fileName'];
        console.log('Request to compile ' + fileName);
        const fileEnding = getFileEndingFromFile(fileName);
        const className = fileName.substring(0, fileName.indexOf('.'));
        const filePath = path.join(__basedir, '/files/uncompiled', fileName);
        const destDir = path.join(__basedir, '/files/compiled/');
        switch (fileEnding) {
            case 'java':
                exec('javac -d ' + destDir + ' ' + filePath, compileCallback);
                break;
            case 'py':
                console.log('Ignoring request to compile .py file');
                fs.moveSync(path.join(__basedir, '/files/uncompiled', fileName), path.join(__basedir, '/files/compiled', fileName));
                res.status(200).send({
                    message: 'Request to compile .py file has been ignored.'
                })
                break;
            case 'cpp':
                exec('g++ ' +
                    path.join(__basedir, '/files/uncompiled', fileName) +
                    ' -o ' + path.join(__basedir, '/files/compiled', fileName),
                    compileCallback);
                break;
            case 'c':
                exec('gcc ' +
                    path.join(__basedir, '/files/uncompiled', fileName) +
                    ' -o ' + path.join(__basedir, '/files/compiled', fileName),
                    compileCallback);
                break;
            case 'rs':
                exec('rustc ' +
                    path.join(__basedir, '/files/uncompiled', fileName) +
                    ' -o ' + path.join(__basedir, '/files/compiled', fileName),
                    compileCallback);
                break;
            case 'go':
                console.log('Ignoring request to compile .go file');
                fs.moveSync(path.join(__basedir, '/files/uncompiled', fileName), path.join(__basedir, '/files/compiled', fileName));
                res.status(200).send({
                    message: 'Request to compile .go file has been ignored.'
                })
                break;
            case 'sh':
                console.log('Ignoring request to compile .sh file');
                fs.moveSync(path.join(__basedir, '/files/uncompiled', fileName), path.join(__basedir, '/files/compiled', fileName));
                res.status(200).send({
                    message: 'Request to compile .sh file has been ignored.'
                })
                break;
            case 'js':
                console.log('Ignoring request to compile .js file');
                fs.moveSync(path.join(__basedir, '/files/uncompiled', fileName), path.join(__basedir, '/files/compiled', fileName));
                res.status(200).send({
                    message: 'Request to compile .js file has been ignored.'
                })
                break;
            default:
                return res.status(500).send({
                    message: 'Language not supported',
                })
        }
    });

    app.post('/run/:fileName', async (req, res) => {
        cmd = 'give temp value';
        const fileName = req.params['fileName'];
        console.log('Request to run ' + fileName);
        const fileEnding = getFileEndingFromFile(fileName);
        const className = fileName.substring(0, fileName.indexOf('.'));
        const bufferFile = path.join(__basedir, '/files/outputBuffer.txt');
        switch (fileEnding) {
            case 'java':
                cmd = spawn('java', ['-cp', path.join(__basedir, '/files/compiled'), className]);
                break;
            case 'py':
                cmd = spawn('python3', [path.join(__basedir, '/files/compiled', fileName)]);
                break;
            case 'cpp':
            case 'rs':
            case 'c':
                cmd = spawn(path.join(__basedir, '/files/compiled', fileName));
                break;
            case 'go':
                cmd = spawn('go', ['run', path.join(__basedir, '/files/compiled', fileName)]);
                break;
            case 'sh':
                filePath = path.join(__basedir, 'files', 'compiled', fileName);
                execSync('chmod -R a+rwx ' + filePath);
                cmd = spawn(path.join(__basedir, '/files/compiled', fileName));
                break;
            case 'js':
                cmd = spawn('node', [path.join(__basedir, '/files/compiled', fileName)]);
                break;
            default:
                return res.status(500).send({
                    message: 'Language not supported',
                })
        }
        const stream = fs.createWriteStream(bufferFile, { flags: 'a' });
        cmd.stdout.on('data', (data) => {
            stream.write(data.toString('ascii'));
        });
        cmd.stderr.on('data', (data) => {
            stream.write(data.toString('ascii'));
        });
        cmd.on('close', () => {
            cmd = null;
            stream.write('\nProgram finished.');
        });
        res.status(200).send({
            message: 'Running program, use /receiveBufferedOutput to stream response'
        });
    });

    app.post('/receiveBufferedOutput', (req, res) => {
        const bufferFile = path.join(__basedir, '/files/outputBuffer.txt');
        const output = fs.readFileSync(bufferFile, { encoding: 'utf-8' });
        fs.truncateSync(bufferFile, 0);
        res.status(200).send({
            output: output
        })
    });

    app.post('/stopProgram', (req, res) => {
        if (cmd != null) {
            cmd.kill();
            res.status(200).send({ message: 'Successfully stopped program.' });
        } else {
            res.status(200).send({ message: 'No program currently running.' });
        }
    });

    app.get('/isProgramRunning', (req, res) => {
        res.status(200).send({ isRunning: cmd != null });
    });

    app.post('/cleanup/:fileName', (req, res) => {
        const fileName = req.params['fileName'];
        fs.rmSync(path.join(__basedir, '/files/uncompiled', fileName));
        fs.rmSync(path.join(__basedir, '/files/compiled', fileName));
    });

    app.get('/getSupportedLanguages', (req, res) => {
        res.json({
            "languages": [
                { value: "c", label: "C" },
                { value: "java", label: "Java" },
                { value: "rust", label: "Rust" },
                { value: "python", label: "python" },
            ]
        })
    });

}