const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8082;

app.use(express.static(path.join(__dirname,'../build')));
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

app.use('/',(req,res)=>{
    res.sendFile(__dirname,'/index.html');
});

app.listen(PORT);