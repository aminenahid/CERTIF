const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;

//listen for the app to be ready 

app.on('ready', function(){
    //create new window
    mainWindow=new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true
        }
    });
    //load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //insert menu
    Menu.setApplicationMenu(mainMenu);
});
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
  })
//create menu template
const mainMenuTemplate =[
    {
        label :'Accueil',
        click(){
            mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file:',
                slashes: true
            }));
        }
    },
    {
        label :'Génération d\'un diplôme',
        click(){
            mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'form_filler.html'),
                protocol: 'file:',
                slashes: true
            }));
        }
    },
    {
        label :'Publication',
        click(){
            mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'publisher.html'),
                protocol: 'file:',
                slashes: true
            }));
        }
    },
    {
        label :'Configuration',
        click(){
            mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'configure.html'),
                protocol: 'file:',
                slashes: true
            }));
        }
    }
];
if(process.platform =='darwin'){
    //If mac, add empty item to menu for clean look
    mainMenuTemplate.unshift({});
}

if(process.env.NODE_ENV !=='production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        click(item, mainWindow){
            mainWindow.toggleDevTools();
        }
    });
    mainMenuTemplate.push({
        label: 'Refresh',
        click(item, mainWindow){
            mainWindow.reload();
        }
    })
}