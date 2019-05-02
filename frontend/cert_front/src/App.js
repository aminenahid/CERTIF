import React, {Component} from 'react';
//import logo from './logo.svg';
import './App.css';

import Home from './components/Home'
import About from './components/About'
import Verify from './components/Verify'
import SignIn from './components/SignIn'
import Publish from './components/Publish'
import SignOut from './components/SignOut'
import Navbar from './components/Navbar'
import { BrowserRouter, Route } from 'react-router-dom'


class App extends Component {
  render(){
    return (
      
      <BrowserRouter>
       <div className="App">
         <Route exact path='/' component={Home} />
         <Route path="/verify" component={Verify} />
         <Route path='/about' component={About} />
         <Route path='/sign_in' component={SignIn} />
         <Route path='/publish' component={Publish} />
         <Route path='/sign_out' component={SignOut}/>
      </div>
      </BrowserRouter>
    ); 
  }
}
export default App;
