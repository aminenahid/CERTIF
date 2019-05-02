import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

const theme = createMuiTheme({
    palette: {
      primary: {
        light: red[700],
        main: red[900],
        dark: red[900]
      },
      secondary: {
        main: '#ffffff',
        dark: '#bdbdbd'
      }
    },
    spacing: 8
  });

ReactDOM.render(<MuiThemeProvider theme={theme}><App/></MuiThemeProvider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
