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
                    ipc.log(data.ipadd,result);
                    ipc.log('got a message from ', data.ipadd ,' : ', data.message);
                });                
            }
        );

        ipc.server.on(
            'server-broadcast',
            (data,socket)=>{
                ipc.log('Server Replied : ', data.id ,' : ', data.message);     
                execute(`setx REACT_APP_HOST "${data.ipadd}"`,(result)=>{
                    ipc.log(data.ipadd,result);
                    ipc.log('got a message from ', data.ipadd ,' : ', data.message);
                });  
            }
        );

        ipc.server.emit(
            {
                address : 'localhost',
                port    : ipc.config.networkPort
            },
            'find-server',
            {
                id      : ipc.config.id,
                message : 'Hello'
            }
        );
    }
);

module.exports = ipc;