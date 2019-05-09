var nb = 1;
var ind = true;

function publish() {
    
    document.getElementById('filepath').className = "btn disabled";
    document.getElementById('publisher').className = "btn disabled";

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
            document.getElementById('progress').innerHTML = "<div class = 'indeterminate'></div>";

            if(alpha == "WARNING - Turn off your internet and plug in your USB to continue...\n"){
                document.getElementById('progress').innerHTML = ""; 
                if(ind === true){
                    nb++;
                    ind = false;
                }
                document.getElementById('usbInfos').innerHTML = " <div class= 'card deep-orange darken-3' > <div class='card-content white-text'>Etape "+nb +"/5 </br> Pour continuer, merci de couper votre connexion Internet puis d'insérer votre support USB contenant votre clé... </div></div>"
            }else if(alpha == "WARNING - Turn on your internet and unplug your USB to continue...\n"){
                document.getElementById('progress').innerHTML = ""; 
                document.getElementById('usbInfos').innerHTML = "<div class= 'card light-green darken-1' > <div class='card-content white-text'>Etape "+nb +"/5 </br> Pour continuer, merci de retirer votre support USB contenant votre clé puis de relancer votre connexion Internet... </div></div>";
                if(ind === true){
                    nb++;
                    ind = false;
                }
            }else {
                ind = true;
                document.getElementById('progress').innerHTML = "<div class = 'indeterminate'></div>";
                document.getElementById('usbInfos').innerHTML = " <div class= 'card grey lighten-1' > <div class='card-content white-text'>Etape "+nb+"/5 </div></div>";
            }
            console.log('stderr: ' + alpha);
        });
        
        command.on('exit', function(data){
            document.getElementById('usbInfos').innerHTML = "<div class= 'card green darken-3' > <div class='card-content white-text'>Etape 5/5 </br> Diplôme certifié ! </div></div>";
            document.getElementById('progress').innerHTML = ""; 
            nb = 1;
            var rem = exec('rm '+unsigned_dir+'/'+file.name, null,
                (error, stdout, stderr) => {
                    if(error) throw error;
                    console.log(stdout);
                    console.log(stderr);
                });
            document.getElementById('filepath').className = "btn active";
            document.getElementById('publisher').className = "btn active";
        });
    }else{
        document.getElementById('warning').innerHTML = " <div class= 'card orange darken-2' > <div class='card-content white-text'> Merci de choisir un fichier pour le publier </div>  </div>";   
    }
    
};

function getPathInConfFile(file){
    var fs = require('fs');
    var content = fs.readFileSync(file, {"encoding": "utf-8"});
    return content.match(/unsigned[_]certificates[_]dir[=][a-z0-9_/.]*/i)[0].split('=')[1];
}
