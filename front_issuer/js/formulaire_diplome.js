function complete_form() {
    var identity=$("#identity")[0].value;
    var firstnames=$("#firstname")[0].value;
    var lastnames=$("#lastname")[0].value;
    var birthday=new Date($("#birthday")[0].value);
    var bcity=$("#bcity")[0].value;
    var bregion=$("#bregion")[0].value;
    var bcountry=$("#bcountry")[0].value;
    var studentno=Number($("#studentno")[0].value);
    var department=$("#department")[0].value;
    console.log(birthday.getDate());
    if (!(is_valid_string(firstnames) &&
            is_valid_string(lastnames) &&
            is_valid_string(bcity) &&
            is_valid_string(bregion) &&
            is_valid_string(bcountry) &&
            studentno>0)){
        alert("Le formulaire est mal complété");
        return false;
    }
    /*var today=Date.now();
    var annee=today.getFullYear();
    var anneeUniversitaire=string.concat(annne-1,"/",annee);
    console.log("L'annee est : "+anneeUniversitaire);*/
    $.ajax({
        type:"POST",
        url:"../formfiller.py",
        data:{
            identity:identity,
            firstnams:firstnames,
            lastnames:lastnames,
            birthday:birthday,
            bcity:bcity,
            bregion:bregion,
            bcountry:bcountry,
            studentno:studentno,
            department:department
        }
    }).done(function(o){
        //What do I do ?
    })
    return false;
}

function is_valid_string(value){
    if (value.replace(/\s/g,'')=="" || value===null){
        return false;
    }
    return true;
}

function is_valid_date(value){
    return true;
}