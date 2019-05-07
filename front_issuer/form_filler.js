var uniqueFields;
var uniqueIds;

function generateForm(){
    //Access the file and find every possible element
    var file =document.getElementById("filepath").files[0];
    console.log(file);
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
    var fileString = evt.target.result;
    // We need to find every possible field that is needed.
    var result=fileString.match(/[*].+?[*]/g);
    uniqueIds=Array.from(new Set(result));
    uniqueFields=uniqueIds.slice();
    for(var i=0; i<uniqueFields.length; i++){
        uniqueFields[i]=uniqueFields[i].substr(2, uniqueFields[i].length-4);
    }
    var zoneFormulaire=document.getElementById("form_template");
    zoneFormulaire.innerHTML="<form id=\"diploma_form\" action=\"\">";
    uniqueFields.forEach(element => {
        text=element.replace(/_/g, " ");
        text=text.charAt(0)+text.slice(1).toLowerCase();
        zoneFormulaire.innerHTML+="<br>"+text+" : <input name=\""+element+"\" type=\""+getType(text)+"\">";
    });
    zoneFormulaire.innerHTML+="<br><input type=\"button\" onclick=\"generateDiplomaJSON();\" value=\"Générer le diplôme\">"
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
    } else if (text.search(/number/i)!=-1 || text.search(/no/i)!=-1){
        return "number";
    }
    return "text";
}

function generateDiplomaJSON(){
    console.log(uniqueFields);
    console.log(uniqueIds);
    var ok=true;
    for (var i=0; i<uniqueFields.length; i++){
        ok=ok&&is_valid(document.getElementById(uniqueFields[i]).value);
    }
    console.log(ok);
}

function is_valid(value){
    switch(getType(value)){
        case "text":
            return value.replace(/ /g,"")!="" && !value===null;
        case "number":
            try{
                number=Number(value);
                return number>0;
            } catch(err){
                return false;
            }
            break;
        case "date":
            try{
                date=new Date(value);
                return true;
            } catch(err){
                return false;
            }
            break;
        default:
            return false;
    }
}