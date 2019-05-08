var uniqueFields;
var uniqueIds;
var fileString;

function generateForm(){
    //Access the file and find every possible element
    var file =document.getElementById("filepath").files[0];
    console.log(file);
    path=file.path;
    if (file){
        getAsText(file);
    } else {
        return false;
    }
    return false;
}

function getAsText(readFile) {

    var reader = new FileReader();

    // Read file into memory as UTF-16
    reader.readAsText(readFile, "UTF-8");

    // Handle progress, success, and errors
    reader.onprogress = updateProgress;
    reader.onload = loaded;
    reader.onerror = errorHandler;
}

function updateProgress(evt) {
    if (evt.lengthComputable) {
        // evt.loaded and evt.total are ProgressEvent properties
        var loaded = (evt.loaded / evt.total);
        if (loaded < 1) {
        // Increase the prog bar length
        // style.width = (loaded * 200) + "px";
        }
    }
}

function loaded(evt) {
    // Obtain the read file data
    fileString = evt.target.result;
    document.getElementById("message").style.display="none";
    // We need to find every possible field that is needed.
    var result=fileString.match(/[*].+?[*]/g);
    uniqueIds=Array.from(new Set(result));

    uniqueFields=uniqueIds.slice();
    for(var i=0; i<uniqueFields.length; i++){
        uniqueFields[i]=uniqueFields[i].substr(2, uniqueFields[i].length-4);
    }
    for(var i=0; i<uniqueIds.length; i++){
        uniqueIds[i]=uniqueIds[i].replace(/[*|]/g,"[*|]");
    }
    var zoneFormulaire=document.getElementById("form_template");
    zoneFormulaire.innerHTML="<form id=\"diploma_form\" action=\"\">";
    uniqueFields.forEach(element => {
        if (element!="TODAY"){
            text=element.replace(/_/g, " ");
            text=text.charAt(0)+text.slice(1).toLowerCase();
            zoneFormulaire.innerHTML+="<br> <div class='col s10 offset-s1'> "+text+" : <input name=\""+element+"\" id=\""+element+"\"type=\""+getType(text)+"\"> </div>";
        }
    });
    zoneFormulaire.innerHTML+="<br><div class='col s12 center-align'><div class='file-field input-field'>\
    <div class='btn'>\
        <span>Dossier d'enregistrement</span>\
        <input id='generateButton' class='btn' type='file' onchange='generateDiplomaJSON();' webkitdirectory directory>\
    </div>\
    <div class = 'file-path-wrapper'>\
    <input class = 'file-path validate' type = 'text' placeholder = 'Aucun dossier choisi' />\
    </div>\
    </div></div>"
    zoneFormulaire.innerHTML+="</form>";
    return uniqueFields;
}
 
function errorHandler(evt) {
    if(evt.target.error.name == "NotReadableError") {
        // The file could not be read
    }
}

function getType(text){
    if (text.search(/date/i)!=-1){
        return "date";
    } else if (text.search(/number/i)!=-1 || text.search(/numero/i)!=-1){
        return "number";
    }
    return "text";
}

function generateDiplomaJSON(){
    console.log(document.getElementById("generateButton"));
    path=document.getElementById("generateButton").files[0].path;

    console.log(uniqueFields);
    console.log(uniqueIds);
    var ok=true;
    for (var i=0; i<uniqueFields.length; i++){
        if(uniqueFields[i]=="TODAY"){
            continue;
        }
        var ret=is_valid(document.getElementById(uniqueFields[i]).value, getType(uniqueFields[i]));
        console.log(uniqueFields[i]);
        console.log(ret);
        ok=ok&&ret;
    }
    if (!ok){
        document.getElementById("form_info").innerHTML="<p>Le formulaire est incomplet ou mal rempli</p>";
        return false;
    }
    newFileString=fileString.slice();
    var prenom, nom;
    for (var i =0; i<uniqueFields.length; i++){
        if(uniqueFields[i]!="TODAY"){
            var value=document.getElementById(uniqueFields[i]).value;
            var regexp = new RegExp(uniqueIds[i], "gi");
            newFileString=newFileString.replace(regexp, value);

            if (uniqueFields[i]=="NOMS"){
                nom=value;
            } else if (uniqueFields[i]=="PRENOMS"){
                prenom=value;
            }
        } else {
            today = new Date();
            var regexp=new RegExp(uniqueIds[i], "gi");
            newFileString=newFileString.replace(regexp, today.toISOString().replace(/Z/,"+00:00"));
        }
    }

    const fs=require('fs');
    path=path+"/diplome_"+nom+"_"+prenom+".json";
    console.log(path);
    fs.writeFile(path, newFileString, function(err) {
        if (err){
            document.getElementById("form_info").innerHTML=err;
            return;
        }
        document.getElementById("form_info").innerHTML="Fichier écrit en : "+path;
    })
}

function is_valid(value, t){
    if (value===null){
        return false;
    }
    if (t=="text"){
        return value.replace(/ /g,"")!="";
    } else if (t=="number"){
        try{
            number=Number(value);
            return number>0;
        } catch(err){
            return false;
        }
    } else if (t=="date"){
        try{
            date=new Date(value);
            return true;
        } catch(err){
            return false;
        }

    } else {
        return false;
    }
}