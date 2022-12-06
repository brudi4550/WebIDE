import React from 'react';

function StopButton(props) {

    return (
        <button className='btn btn-primary' onClick={props.handleStopCommand}>Stop</button>
    )

}

export default StopButton;