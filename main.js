const { app,BrowserWindow,ipcMain } = require('electron');
const server = require('./app/index');
const exec = require('child_process').exec;
const config = require('electron-node-config');

if (require('electron-squirrel-startup')) return app.quit();
// const { default : installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');

let win,splashscreen;

let ipadd = config.get('settings');

const createWindow = ()=>{

    win = new BrowserWindow({
        width : 1024,  
        height : 750,
        hasShadow : true,
        useContentSize : true,
        // backgroundColor : "#121421",
        transparent : true,
        webPreferences : {
            nodeIntegration : true,
            contextIsolation: false,
            devTools : true,
        },
        autoHideMenuBar : true,
        resizable : false,
        frame : false,
        show : false
    });

    splashscreen = new BrowserWindow({
        width : 450,
        height : 350,
        hasShadow : true,
        alwaysOnTop : true,
        frame : false,
        transparent : true,
        resizable : false
    });
    
    splashscreen.loadURL('http://localhost:8082/api/loader');

    win.loadURL('http://localhost:8082');

    win.once('ready-to-show', () => {    
        setTimeout(()=>{
            splashscreen.hide();  
            splashscreen.close();
            splashscreen = null;            
        },4000);
        
        setTimeout(()=>{
            win.show();
        },5000);
    });

    win.webContents.on('dom-ready',()=>{
        win.webContents.send('get-ip',ipadd);        
    },);

    win.on('show',()=>{
        win.minimize();
        win.focus();
    });

    win.on('closed',()=>{
        win = null;
    });
    
}

const execute = (cmd,cb)=>{
    exec(cmd,(error,stdout,stderr)=>{
        if(error) return cb(stderr);
        return cb(stdout);
    });
}

app.whenReady().then(()=>{

    // installExtension(REDUX_DEVTOOLS)
    // .then((name) => console.log(`Added Extension:  ${name}`))
    // .catch((err) => console.log('An error occurred: ', err));
    createWindow()
});

app.on('window-all-closed',()=>{
    if( process.platform !== 'darwin' ){
        app.quit()
    }
});

// app.on('activate',()=>{
//     if( BrowserWindow.getAllWindows().length === 0 || win === null ){
//         createWindow();
//     }
// });

ipcMain.handle('close',(e, args)=>{
    app.quit()
});


ipcMain.handle('min',(e, args)=>{
    win.minimize();
});

