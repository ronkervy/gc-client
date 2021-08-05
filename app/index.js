const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8082;
const apiRoutes = require('./api.routes');

app.use(express.static(path.join(__dirname,'../build')));
app.use('/static',express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

app.use('/api',apiRoutes);

app.use('/',(req,res)=>{
    res.sendFile(__dirname,'/index.html');
});

app.use((req,res,next)=>{
    next(createHttpError.NotFound());
});

app.use((err,req,res,next)=>{
    res.status(err.status || 500);
    res.json({
        error : {
            status : err.status,
            message : err.message
        }
    });
});

app.listen(PORT);