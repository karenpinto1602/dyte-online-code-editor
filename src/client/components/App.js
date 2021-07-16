import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
/* import Header from './Header';
import Footer from './Footer';*/
import Home from './Home'; 
import Editor from './Editor';

function App() {
    return (
      <div>
          hiiiiii app
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/editor" component={Editor} />
            </Switch>
        </BrowserRouter> 
      </div>
    );
  }
  
  export default App;