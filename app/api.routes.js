const router = require('express').Router();
const path = require('path');
const {setIpAddress,getSettings} = require('./api.controllers');

router.get('/loader',(req,res,next)=>{
    res.status(200).sendFile(path.resolve(__dirname,'public/loader.html'));
});

router.patch('/settings',setIpAddress);
router.get('/settings',getSettings);

module.exports = router;