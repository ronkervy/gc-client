const createHttpError = require('http-errors');
const path = require('path');
const fs = require('fs');

module.exports = {
    setIpAddress : async (req,res,next)=>{
        try{
            const filePath = path.join(__dirname,'..','/config/default.json');
            const rawFile = await fs.promises.readFile(filePath);
            let settingsJSON = JSON.parse(rawFile);
            const { address } = req.body;
            console.log(address);

            settingsJSON.settings.address = address;
            let settingsSTR = JSON.stringify(settingsJSON,null,2);
            await fs.promises.writeFile(filePath,settingsSTR);

            return res.status(200).json(settingsJSON);
        }catch(err){
            return next(createHttpError.Unauthorized({
                message : err
            }));
        }
    },
    getSettings : async(req,res,next)=>{
        try{
            const filePath = path.join(__dirname,'..','/config/default.json');
            const rawFile = await fs.promises.readFile(filePath);
            let settingsJSON = JSON.parse(rawFile);

            return res.status(200).json(settingsJSON);

        }catch(err){
            return next(createHttpError.Unauthorized({
                message : err
            }));
        }
    }
}