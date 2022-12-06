import React from 'react';
import LanguageSelector from './LanguageSelector';
import RunButton from './RunButton';
import StopButton from './StopButton';

function NavBar(props) {

    return (
        <nav className="navbar navbar-expand-lg navbar-light border-bottom">
            <div className="row align-items-center justify-content-end w-100">
                <div className="col">
                    <a className="navbar-brand" href="/">WebIDE</a>
                </div>
                <div className="col ml-auto">
                    <RunButton handleRunCommand={props.handleRunCommand} />
                </div>
                <div className="col ml-auto">
                    <StopButton handleStopCommand={props.handleStopCommand} />
                </div>
                <div className="col ml-auto">
                    <LanguageSelector language={props.language}
                        handleLanguageChange={props.handleLanguageChange} />
                </div>
            </div>
        </nav>
    )

}

export default NavBar;