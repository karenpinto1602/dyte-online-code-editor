/* Libraries and Packages*/
import React, { Component } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import Pusher from "pusher-js";
import pushid from "pushid";
import Toggle from 'react-toggle';
import 'react-toggle/style.css';

/* Icons from Material-ui */
import { Brightness5, NightsStay } from '@material-ui/icons';

/* Stylesheet */
import "./editor.css";

/* External stylying */
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/3024-day.css";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/css/css";
import "codemirror/mode/javascript/javascript";


class Editor extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      html: "",
      css: "",
      js: "",
      lang: 'HTML',
      push: true
    };

    this.handleLang = this.handleLang.bind(this);
    this.checkLang = this.checkLang.bind(this);
    this.saveCode = this.saveCode.bind(this);
    this.downloadCode = this.downloadCode.bind(this);

    /* Pusher helps maintain Real-time communication */
    /* Below credentials are mine - Karen Pinto */
    this.pusher = new Pusher("ee9caf5c6e760f9f1595", {
      cluster: "ap2",
      forceTLS: true
    });
    this.channel = this.pusher.subscribe("editor");
  }

  /* Selecting and Checking the Language [html,css,javascript] */
  handleLang(event) {
    this.setState({
      lang: event.target.value
    });
  }
  checkLang(value) {
    if (value === this.state.lang) {
      return true;
    }
    else {
      return false;
    }
  }

  componentDidUpdate() {
    this.liveCode();
  }

  componentDidMount() {
    this.setState({
      id: pushid()
    });

    this.channel.bind("text-update", data => {
      const { id } = this.state;
      if (data.id === id) return;

      this.setState({
        html: data.html,
        css: data.css,
        js: data.js
      });
    });
  }

  /* Pastebin start Developer */
  saveCode() {
    /* var express = require('express');
    var app = express();
    var cors = require('cors');
    //var fs = require('fs');
    app.use(cors()); */
    console.log("Save funct called");

    var request = new XMLHttpRequest();

    console.log(request);
    request.open("POST", "https://pastebin.com/api/api_post.php", true);
    request.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    request.send("api_dev_key=P6pexxhBcg0FhTro-sMy6mFJNzYWceZE&api_option=paste&api_paste_private=0&api_paste_expire_date=10M&api_paste_format=javascript&api_paste_code=hello");



    /*  var PastebinAPI = require('pastebin-js');
     var pastebin = new PastebinAPI({
       'api_dev_key': 'P6pexxhBcg0FhTro-sMy6mFJNzYWceZE',
       'api_user_name': 'karenpinto1602',
       'api_user_password': 'Pastebin@123'
     });
     pastebin
       .createPaste("heuooo", "pastebin-js test", null, 0, "1H")
       .then(function (d) {
         console.log("Data: " + d); //stores the id
       })
       .catch(function (err) {
         console.log("Error: " + err);
       })
  */

  }
  /* Pastebin End Developer */

  /* Live Code Updated here */
  liveCode = () => {
    const { html, css, js } = this.state;
    const ifr = this.refs.ifr;
    const liveDocument = ifr.contentDocument;
    const documentCodeHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Document</title>
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script type="text/javascript">
          ${js}
        </script>
      </body>
      </html>
    `;
    liveDocument.open();
    liveDocument.write(documentCodeHTML);
    liveDocument.close();
  };

  /* Download code with extenxion .html */
  downloadCode() {
    const { html, js, css } = this.state;
    var text = `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Dyte Placements</title>
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script type="text/javascript">
          ${js}
        </script>
      </body>
      </html>
    `;
    var filename = "kp_dyte.html";
    this.downloadHTML(filename, text);
  }

  downloadHTML = (file, text) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8, '
      + encodeURIComponent(text));
    element.setAttribute('download', file);

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  /********* Website *********/
  render() {
    const { html, js, css } = this.state;
    const styleSetCodeMirror = {
      lineWrapping: true,
      lineNumbers: true,
      border: '1px solid black',
      theme: this.state.push ? "material" : "3024-day"
    };

    return (
      <div className="editor-body">
        <div className="editor-code" style={this.state.push ? { backgroundColor: '#1E1E2C' } : { backgroundColor: 'aliceblue' }}>
          <div className="editor-file-explorer" style={this.state.push ? { color: 'white' } : { color: 'black' }}>
            <div>
              <label>File Explorer: </label>
              <select
                value={this.state.lang}
                onChange={this.handleLang}>
                <option value="HTML">HTML</option>
                <option value="CSS">CSS</option>
                <option value="JavaScript">JavaScript</option>
              </select>
            </div>
            <div className="editor-file-explorer-toggle">
              <label> Theme
                {
                  this.state.push ?
                    <Toggle defaultChecked={false} icons={{ unchecked: <Brightness5 style={{ fontSize: '16px', color: 'yellow', margin: '-3px 0 0 -1px' }} /> }} className="settings-symbol" onClick={() => this.setState({ push: !this.state.push })} />
                    :
                    <Toggle defaultChecked={true} icons={{ checked: <NightsStay style={{ fontSize: '16px', color: 'black', margin: '-3px -1px 0 0' }} /> }} className="settings-symbol" onClick={() => this.setState({ push: !this.state.push })} />
                }
              </label>
            </div>
          </div>

          <div className="editor-save-code" onClick={() => this.saveCode()} style={this.state.push ? { color: 'white' } : { color: 'black' }}>
            <button onClick={() => this.downloadCode()}>Download Code</button>
            <button>Save Code</button>
          </div>

          <div style={this.checkLang("HTML") ? null : { display: 'none' }} >
            <div className="editor-header" style={this.state.push ? { color: 'white' } : { color: 'black' }}>HTML</div>
            <CodeMirror
              className="editor-CodeMirror"
              value={html}
              options={{
                mode: "htmlmixed",
                ...styleSetCodeMirror
              }}
              onBeforeChange={(editor, data, html) => {
                this.setState({ html });
              }}
            />
          </div>

          <div style={this.checkLang("CSS") ? null : { display: 'none' }}>
            <div className="editor-header" style={this.state.push ? { color: 'white' } : { color: 'black' }} >CSS</div>
            <CodeMirror
              className="editor-CodeMirror"
              value={css}
              options={{
                mode: "css",
                ...styleSetCodeMirror
              }}
              onBeforeChange={(editor, data, css) => {
                this.setState({ css });
              }}
            />
          </div>

          <div style={this.checkLang("JavaScript") ? null : { display: 'none' }}>
            <div className="editor-header" style={this.state.push ? { color: 'white' } : { color: 'black' }}>JavaScript</div>
            <CodeMirror
              className="editor-CodeMirror"
              value={js}
              options={{
                mode: "javascript",
                ...styleSetCodeMirror
              }}
              onBeforeChange={(editor, data, js) => {
                this.setState({ js });
              }}
            />
          </div>
        </div>
        <div className="editor-result">
          <iframe title="liveResult" className="result-iframe" ref="ifr" />
        </div>
      </div>
    );
  }
}

export default Editor;
