import React from "react";

function LanguageSelector(props) {

    function handleChange(e) {
        props.handleLanguageChange(e.target.value);
    }

    return (
        <form>
            <label>
                Language:
                <select value={props.language} onChange={(e) => handleChange(e)}>
                    <option value="java">Java</option>
                    <option value="c">C</option>
                    <option value="c++">C++</option>
                    <option value="python">Python 3</option>
                    <option value="rust">Rust</option>
                    <option value="go">Go</option>
                    <option value="bash">Bash</option>
                    <option value="javascript">Javascript</option>
                </select>
            </label>
        </form>
    );
}

export default LanguageSelector;