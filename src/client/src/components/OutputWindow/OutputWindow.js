import './OutputWindow.css';
import React, { useEffect } from 'react';

function OutputWindow(props) {

    useEffect(() => {
        document.getElementById("outputTextarea").scrollTop = document.getElementById("outputTextarea").scrollHeight;
    });

    return (
        <div className='m-3 OutputWindow'>
            <h6>Output:</h6>
            <textarea readOnly value={props.output} className='form-control' id='outputTextarea' />
        </div>
    )

}

export default OutputWindow;