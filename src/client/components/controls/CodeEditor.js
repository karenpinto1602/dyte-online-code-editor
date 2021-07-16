import React from 'react';
import PropTypes from 'prop-types';

/* Importing Brace and Ace Editor Components */
/* import brace from 'brace'; */
import AceEditor from 'react-ace';

/* Imorting a language Mode */
import 'brace/mode/java';

/* Importing a Theme (okadia, github, xcode etc) */
import 'brace/theme/github';

const editorStyle = {
    border: '1px solid lightgray',
};

class CodeEditor extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.onChange = this.onChange.bind(this);
    }

    onChange(newValue){
        this.props.onChange(newValue);
    }

    render(){
        return(
            <AceEditor
                style={editorStyle}
                readOnly={false}
                onChange={this.onChange}
                width="100%"
                height="400px"
                mode="javascript"
                theme="github"
                name="aceCodeEditor"
                fontSize={14}
                showPrintMargin
                showGutter
                highlightActiveLine
                value={this.props.code}
                editorProps={{
                    $blockScrolling: true,
                    enableBasicAutocompletion: true,
                    enableLiveAutocomplete: true,
                    enableSnippets: true,
                }}
                setOptions={{
                    showLineNumbers: true,
                    tabSize: 2,                    
                }}
            />            
        );
    }
}

CodeEditor.propTypes = {
    code: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default CodeEditor;

