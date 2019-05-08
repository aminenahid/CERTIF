function publish() {

    var file =document.getElementById("filepath").files[0];

    if(file != null){

        if (file.name.search(/[.]json/)==-1){
            document.getElementById("warning").innerHTML="Erreur : ce fichier n'est pas un .json";
            return false;
        }

        console.log(file);

        let path=file.path;


        let unsigned_dir = getPathInConfFile('./conf.ini')

        console.log(unsigned_dir);

        const exec = require('child_process').exec;
        var cp = exec('cp '+path+' '+unsigned_dir, null,
            (error, stdout, stderr) => {
                if(error) throw error;
                console.log(stdout);
                console.log(stderr);
            });

        const spawn = require('child_process').spawn;
        var command = spawn('cert-issuer',['-c','conf.ini']);

        command.stdout.on('data', function(data){
            console.log('stdout: '+data.toString()); 
        });
        
        command.stderr.on('data', function(data){
            let alpha = data.toString();
            if(alpha == "WARNING - Turn off your internet and plug in your USB to continue...\n"){
                document.getElementById('usbInfos').innerHTML = " <div class= 'card deep-orange darken-3' > <div class='card-content white-text'> Pour continuer, merci de couper votre connexion Internet puis d'insérer votre support USB contenant votre clé... </div></div>"
            }else if(alpha == "WARNING - Turn on your internet and unplug your USB to continue...\n"){
                document.getElementById('usbInfos').innerHTML = "<div class= 'card light-green darken-1' > <div class='card-content white-text'>  Pour continuer, merci de retirer votre support USB contenant votre clé puis de relancer votre connexion Internet... </div></div>";
            }else {
                document.getElementById('usbInfos').innerHTML = "";
            }
            console.log('stderr: ' + alpha);
        });
        
        command.on('exit', function(data){
            console.log('finished: '+data.toString()); 
        });
    }else{
        document.getElementById('warning').innerHTML = " <div class= 'card orange darken-2' > <div class='card-content white-text'> Merci de choisir un fichier pour le publier </div>  </div>";   
    }
    
};

function getPathInConfFile(file){
    var fs = require('fs');
    var content = fs.readFileSync(file, {"encoding": "utf-8"});
    return content.match(/unsigned[_]certificates[_]dir[=][a-z0-9_/]*/i)[0].split('=')[1];
}
