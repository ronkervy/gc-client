const fs = require('fs');
const path = require('path');

module.exports = (filePath,ipadd,cb)=>{
    const rawFile = fs.readFileSync(filePath);
    let fileContent = JSON.parse(rawFile);
    
    fileContent.settings.address = ipadd;

    let stringFileContent = JSON.stringify(fileContent,null,2);

    fs.writeFileSync(path.resolve(__dirname,'default.json'),stringFileContent);
    
    console.log(fileContent);
    
    return cb;    
}