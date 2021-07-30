const ipc = require('node-ipc');
const ip = require('ip');
const name = ip.address().split('.')[3];
const exec = require('child_process').exec;

const execute = (cmd,cb)=>{
    exec(cmd,(error,stdout,stderr)=>{
        if(error) return cb(stderr);
        return cb(stdout);
    });
}

ipc.config.id = 'gc-client-' + name;
ipc.config.retry= 1500;

ipc.serveNet(
    8005,
    'udp4',
    ()=>{
        ipc.server.on(
            'client-connected',
            (data)=>{    
                
                execute(`setx REACT_APP_HOST "${data.ipadd}"`,(result)=>{
                    ipc.log('got a message from ', data.ipadd ,' : ', data.message);
                    ipc.log(result);
                })            
            }
        );

        ipc.server.on(
            'ServerBroadcast',
            (data,socket)=>{
                execute(`setx REACT_APP_HOST "${data.ipadd}"`,(result)=>{
                    ipc.log('got a message from ', data.ipadd ,' : ', data.message);
                    ipc.log(result);
                }) 
            }
        );

        ipc.server.emit(
            {
                address : ipc.config.networkHost,
                port : 8001
            },
            'FindServer',
            {
                id      : ipc.config.id,
                message : 'Client send @ ' + new Date(Date.now()).toISOString().split('T')[0]
            }
        );
    }
);

module.exports = ipc;