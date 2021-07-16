import React, { Component } from "react";
/* import "./App.css"; */
//import { BrowserRouter, Route, Switch } from "react-router-dom";

import Editor from './components/editor.jsx';
class App extends Component {
  render() {
    return (
      <div>
        {/* <BrowserRouter>
            <Switch>
             <Route path="/" exact component={Editor} />
            </Switch>
        </BrowserRouter>   */} 
         <Editor></Editor>
      </div>
    );
  }
}

export default App;