import React from 'react';

function FileNameChooser(props) {

    function updateInputValue(e) {
        props.handleFileNameChange(e.target.value);
    }

    const fileName = props.fileName ? props.fileName : "";
    return (
        <div className="col-4 m-2">
            <input className="form-control" value={fileName} type="text" onChange={(e)=> updateInputValue(e)}>
            </input>
        </div>
    )

}

export default FileNameChooser;