const router = require('express').Router();
const path = require('path');

router.get('/loader',(req,res,next)=>{
    res.status(200).sendFile(path.resolve(__dirname,'public/loader.html'));
});

module.exports = router;