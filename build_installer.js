const { MSICreator } = require('electron-wix-msi');
const path = require('path');

// Step 1: Instantiate the MSICreator
const msiCreator = new MSICreator({
  appDirectory: path.resolve(__dirname,'./out/gc-client-win32-x64'),
  description: 'GC Client Application',
  exe: 'gc-client',
  name: 'GC CLIENT APP',
  manufacturer: 'KVM Tech',
  version: '1.2.1',
  appIconPath : path.resolve(__dirname,'./app/logo.ico'),
  features : {
    autoLaunch : true
  },
  outputDirectory: path.resolve(__dirname,'./msi'),
  ui : {
      chooseDirectory : true
  }
});

// Step 2: Create a .wxs template file
msiCreator.create().then(()=>{
    msiCreator.compile();
});