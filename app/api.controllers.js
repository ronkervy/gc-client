const createHttpError = require('http-errors');
const path = require('path');
const fs = require('fs');

module.exports = {
    setIpAddress : async (req,res,next)=>{
        try{
            const filePath = process.env.REACT_APP_MODE === 'development' ? path.join(__dirname,'..','/config/default.json') : path.join(__dirname,'..','/config/default.json').replace('app.asar','app.asar.unpacked');

            const rawFile = await fs.promises.readFile(filePath);
            let settingsJSON = JSON.parse(rawFile);
            const { address,port,number } = req.body;

            settingsJSON.settings.address = address;
            settingsJSON.settings.port = port !== undefined ? port : 8081;
            settingsJSON.settings.number = number !== undefined ? number : '';
            let settingsSTR = JSON.stringify(settingsJSON,null,2);
            await fs.promises.writeFile(filePath,settingsSTR);

            return res.status(200).json(settingsJSON);
        }catch(err){
            return next(createHttpError.InternalServerError({
                message : err.message
            }));
        }
    },
    getSettings : async(req,res,next)=>{
        try{

            const filePath = process.env.REACT_APP_MODE === 'development' ? path.join(__dirname,'..','/config/default.json') : path.join(__dirname,'..','/config/default.json').replace('app.asar','app.asar.unpacked');

            const rawFile = await fs.promises.readFile(filePath);
            let settingsJSON = JSON.parse(rawFile);

            return res.status(200).json(settingsJSON);

        }catch(err){
            console.log(err.message);
            return next(createHttpError.InternalServerError({
                message : err.message
            }));
        }
    }
}