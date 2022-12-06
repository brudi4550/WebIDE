import './App.css';
import React from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import NavBar from './components/NavBar';
import OutputWindow from './components/OutputWindow/OutputWindow';
import FileNameChooser from './components/FileNameChooser';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentLanguage: 'java',
      fileName: 'Main.java',
      currentlyRunning: false,
      editor: null,
      currentOutput: '',
      intervalID: null
    }
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.handleEditorDidMount = this.handleEditorDidMount.bind(this);
    this.handleRunCommand = this.handleRunCommand.bind(this);
    this.handleStopCommand = this.handleStopCommand.bind(this);
    this.receiveErrorOutput = this.receiveErrorOutput.bind(this);
    this.handleFileNameChange = this.handleFileNameChange.bind(this);
    this.switchOffOutputReceiver = this.switchOffOutputReceiver.bind(this);
    this.switchOnOutputReceiver = this.switchOnOutputReceiver.bind(this);
  }

  switchOnOutputReceiver() {
    const id = setInterval(async () => {
      let res = await axios.post('/receiveBufferedOutput');
      this.setState({ currentOutput: this.state.currentOutput + res.data.output });
      res = await axios.get('/isProgramRunning');
      if (res.data.isRunning === false) {
        this.switchOffOutputReceiver();
      }
    }, 1000);
    this.setState({ intervalID: id })
  }

  async receiveErrorOutput() {
    const res = await axios.post('/receiveBufferedOutput');
    this.setState({ currentOutput: this.state.currentOutput + res.data.output });
  }

  switchOffOutputReceiver() {
    clearInterval(this.state.intervalID);
    this.setState({ intervalID: null });
  }

  async handleEditorDidMount(editor, monaco) {
    const res = await axios.get('/getLanguagePreview/' + this.state.currentLanguage);
    editor.getModel().setValue(res.data.preview);
    this.setState({
      editor: editor,
      fileName: res.data.fileName
    });
  }

  async handleLanguageChange(language) {
    console.log('Handling language change to ' + language);
    const res = await axios.get('/getLanguagePreview/' + language);
    this.state.editor.getModel().setValue(res.data.preview);
    this.setState({
      currentLanguage: language,
      fileName: res.data.fileName
    });
  }

  handleFileNameChange(fileName) {
    this.setState({ fileName: fileName })
  }

  async handleRunCommand() {
    this.setState({ currentOutput: '' });
    await axios({
      method: 'post',
      url: '/sendCode',
      data: {
        code: this.state.editor.getValue(),
        language: this.state.currentLanguage,
        fileName: this.state.fileName
      }
    });
    let compileFailed = false;
    await axios.post('/compile/' + this.state.fileName)
      .catch((err) => {
        compileFailed = true;
        this.receiveErrorOutput();
      });
    if (!compileFailed) {
      console.log('posting run request');
      await axios.post('/run/' + this.state.fileName);
      this.switchOnOutputReceiver();
    }
  }

  async handleStopCommand() {
    this.setState({ currentOutput: this.state.currentOutput + '\nStopped program.' });
    this.switchOffOutputReceiver();
    await axios({
      method: 'post',
      url: '/stopProgram',
    })
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <NavBar language={this.state.currentLanguage}
            handleLanguageChange={this.handleLanguageChange}
            handleRunCommand={this.handleRunCommand}
            handleStopCommand={this.handleStopCommand} />
          <FileNameChooser fileName={this.state.fileName} handleFileNameChange={this.handleFileNameChange}></FileNameChooser>
          <Editor language={this.state.currentLanguage}
            height="60vh"
            onMount={this.handleEditorDidMount} />
          <OutputWindow output={this.state.currentOutput} />
        </div>
      </div>
    )
  }
}

export default App;