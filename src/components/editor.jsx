import React, { Component } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import Pusher from "pusher-js";
import pushid from "pushid";
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { Brightness5, NightsStay } from '@material-ui/icons';
/* import axios from "axios"; */
/* import express from "express";
import cors from "cors"; */

import "./editor.css";
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

    this.pusher = new Pusher("ee9caf5c6e760f9f1595", {
      cluster: "ap2",
      forceTLS: true
    });
    this.channel = this.pusher.subscribe("editor");
  }



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
    this.runCode();
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

  syncUpdates = () => {
    /* const data = { ...this.state }; */

    /* axios
      .post("http://localhost:5000", data)
      .catch(console.error); */
  };

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

  runCode = () => {
    const { html, css, js } = this.state;

    const iframe = this.refs.iframe;
    const document = iframe.contentDocument;
    const documentContents = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
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

    document.open();
    document.write(documentContents);
    document.close();
  };

  render() {
    const { html, js, css } = this.state;
    const codeMirrorOptions = {
      theme: this.state.push ? "material" : "3024-day",
      lineNumbers: true,
      scrollbarStyle: null,
      lineWrapping: true,

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
            <button>Download Code</button>
            <button>SAVE CODE</button>
          </div>
          <div className="code-editor html-code" style={this.checkLang("HTML") ? null : { display: 'none' }} >
            <div className="editor-header" style={this.state.push ? { color: 'white' } : { color: 'black' }}>HTML</div>
            <CodeMirror
              className="CodeMirror"
              value={html}
              options={{
                mode: "htmlmixed",
                ...codeMirrorOptions
              }}
              onBeforeChange={(editor, data, html) => {
                this.setState({ html }, () => this.syncUpdates());
              }}
            />
          </div>
          <div className="code-editor css-code" style={this.checkLang("CSS") ? null : { display: 'none' }}>
            <div className="editor-header" style={this.state.push ? { color: 'white' } : { color: 'black' }} >CSS</div>
            <CodeMirror
              value={css}
              options={{
                mode: "css",
                ...codeMirrorOptions
              }}
              onBeforeChange={(editor, data, css) => {
                this.setState({ css }, () => this.syncUpdates());
              }}
            />
          </div>
          <div className="code-editor js-code" style={this.checkLang("JavaScript") ? null : { display: 'none' }}>
            <div className="editor-header" style={this.state.push ? { color: 'white' } : { color: 'black' }}>JavaScript</div>
            <CodeMirror
              value={js}
              options={{
                mode: "javascript",
                ...codeMirrorOptions
              }}
              onBeforeChange={(editor, data, js) => {
                this.setState({ js }, () => this.syncUpdates());
              }}
            />
          </div>
        </div>
        <div className="editor-result">
          <iframe title="result" className="iframe" ref="iframe" />
        </div>
      </div>
    );
  }
}

export default Editor;
