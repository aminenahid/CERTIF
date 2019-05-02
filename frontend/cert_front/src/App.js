import React, {Component} from 'react';
//import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/About'
import Verify from './components/Verify'
import SignIn from './components/SignIn'
import Publish from './components/Publish'
import { BrowserRouter, Route } from 'react-router-dom'


class App extends Component {
  render(){
    return (
      
      <BrowserRouter>
       <div className="App">
         <Navbar />
         <Route exact path='/' component={Home} />
         <Route path="/verify" component={Verify} />
         <Route path='/about' component={About} />
         <Route path='/sign_in' component={SignIn} />
         <Route path='/publish' component={Publish} />
      </div>
      </BrowserRouter>
    ); 
  }
}
export default App;
