import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import NavBar from './components/NavBar';
import OutputWindow from './components/OutputWindow/OutputWindow';
import FileNameChooser from './components/FileNameChooser';

function App(props) {
  const [language, setLanguage] = useState('java');
  const [fileName, setFileName] = useState('Main.java');
  const [editor, setEditor] = useState(null);
  const [output, setOutput] = useState('');
  const [intervalID, setIntervalID] = useState(null);

  function switchOnOutputReceiver() {
    const id = setInterval(async () => {
      let res = await axios.post('/receiveBufferedOutput');
      setOutput(output => output + res.data.output);
      res = await axios.get('/isProgramRunning');
      if (res.data.isRunning === false) {
        switchOffOutputReceiver();
      }
    }, 1000);
    setIntervalID(id);
  }

  async function receiveErrorOutput() {
    const res = await axios.post('/receiveBufferedOutput');
    if (res.data.output === '') {
      setOutput(output => output + '\nSomething went wrong during compilation.')
    } else {
      setOutput(output => output + res.data.output);
    }
  }

  function switchOffOutputReceiver() {
    clearInterval(intervalID);
    setIntervalID(null);
  }

  async function handleEditorDidMount(editor, monaco) {
    const [, preview] = await getLanguagePreview(language);
    setEditor(editor);
    updateEditorValue(editor, preview);
  }

  async function handleLanguageChange(language) {
    const [fileName, preview] = await getLanguagePreview(language);
    updateEditorValue(editor, preview);
    setLanguage(language);
    setFileName(fileName);
  }

  async function getLanguagePreview(language) {
    const res = await axios.get('/languagePreview/' + language);
    return [res.data.fileName, res.data.preview];
  }

  function updateEditorValue(editor, value) {
    editor.getModel().setValue(value);
  }

  function handleFileNameChange(fileName) {
    setFileName(fileName);
  }

  async function handleRunCommand() {
    setOutput('');
    await axios({
      method: 'post',
      url: '/sendCode',
      data: {
        code: editor.getValue(),
        language: language,
        fileName: fileName
      }
    });
    let compileFailed = false;
    await axios.post('/compile/' + fileName)
      .catch((err) => {
        compileFailed = true;
        receiveErrorOutput();
      });
    if (!compileFailed) {
      await axios.post('/run/' + fileName);
      switchOnOutputReceiver();
    }
  }

  async function handleStopCommand() {
    setOutput(output => output + '\nStopped program.')
    switchOffOutputReceiver();
    await axios({
      method: 'post',
      url: '/stopProgram',
    })
  }

  return (
    <div className="App">
      <div className="container">
        <NavBar language={language}
          handleLanguageChange={handleLanguageChange}
          handleRunCommand={handleRunCommand}
          handleStopCommand={handleStopCommand} />
        <FileNameChooser fileName={fileName} handleFileNameChange={handleFileNameChange}></FileNameChooser>
        <Editor language={language}
          height="60vh"
          onMount={handleEditorDidMount} />
        <OutputWindow output={output} />
      </div>
    </div>
  )
}

export default App;