
function publish() {

    const spawn = require('child_process').spawn;
    var command = spawn('cert-issuer',['-c','conf.ini']);

    command.stdout.on('data', function(data){
        console.log('stdout: '+data.toString()); 
    });
    
    command.stderr.on('data', function(data){
        let alpha = data.toString();
        if(alpha == "WARNING - Turn off your internet and plug in your USB to continue..."){
            
        }else {
        	console.log('stderr: '+data.toString());
        }
        console.log('stderr: '+data.toString());
    });
    
    command.on('exit', function(data){
        console.log('finished: '+data.toString()); 
    });
};
