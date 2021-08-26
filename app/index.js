const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8082;
const apiRoutes = require('./api.routes');
const cors = require('cors');
const helmet = require('helmet');

app.use(express.static(path.join(__dirname,'../build')));
app.use('/static',express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

app.use(helmet());
app.use(cors());
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