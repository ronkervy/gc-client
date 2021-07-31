const { app,BrowserWindow,ipcMain } = require('electron');
const ipc = require('./app/ipc.server');
const server = require('./app/index');
const exec = require('child_process').exec;
if (require('electron-squirrel-startup')) return app.quit();
// const { default : installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');

let win;

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
    });

    win.loadURL('http://localhost:8082');

    win.once('ready-to-show', () => {
        win.show()
    })

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
    ipc.server.start();
    createWindow()
});

app.on('window-all-closed',()=>{
    if( process.platform !== 'darwin' ){
        app.quit()
    }
});

app.on('activate',()=>{
    if( BrowserWindow.getAllWindows().length === 0 || win === null ){
        createWindow();
    }
});

ipcMain.handle('close',(e, args)=>{
    app.quit()
});


ipcMain.handle('min',(e, args)=>{
    win.minimize();
});

