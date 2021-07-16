import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import AppC from './client/components/App';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppC />
      </BrowserRouter>
    </div>
  );
}

export default App;
