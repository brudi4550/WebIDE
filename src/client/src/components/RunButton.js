import React from 'react';

function RunButton(props) {

    return (
        <button className='btn btn-primary' onClick={props.handleRunCommand}>Compile & Run</button>
    )

}

export default RunButton;