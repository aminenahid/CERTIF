import React, {Component} from 'react';
//import logo from './logo.svg';
import './App.css';

import Home from './components/Home'
import About from './components/About'
import Verify from './components/Verify'
import SignIn from './components/SignIn'
import Publish from './components/Publish'
import SignOut from './components/SignOut'
import SignUp from './components/SignUp'
import Forgotten from './components/Forgotten'
import Navbar from './components/Navbar'
import AddDiploma from './components/AddDiploma'
import Wallet from './components/Wallet'
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
         <Route path='/sign_up' component={SignUp} />
         <Route path='/publish' component={Publish} />
         <Route path='/sign_out' component={SignOut}/>
         <Route path='/forgotten' component={Forgotten}/>
         <Route path='/addDiploma' component={AddDiploma}/>
         <Route path='/wallet' component={Wallet}/>
      </div>
      </BrowserRouter>
    ); 
  }
}
export default App;
