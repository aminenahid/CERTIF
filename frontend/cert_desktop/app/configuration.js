function createConfFile(){
        
    let ok = true;

    let pubkey = document.getElementById('pubkey').value;
    if(pubkey === null){
        ok =false;
        document.getElementById('nopubkey').innerHTML = " <div class= 'card orange darken-2' > <div class='card-content white-text'> Merci de remplir tous les champs avant d'enregistrer ! </div>  </div>";
    }

    let usb = document.getElementById('key_file').files[0].path;
    if(usb === null){
        ok =false;
        document.getElementById('nopubkey').innerHTML = " <div class= 'card orange darken-2' > <div class='card-content white-text'> Merci de remplir tous les champs avant d'enregistrer ! </div>  </div>";
    }

    let unsigned = document.getElementById('filepath_unsigned').files[0].path;
    if(unsigned === null){
        ok =false;
        document.getElementById('nopubkey').innerHTML = " <div class= 'card orange darken-2' > <div class='card-content white-text'> Merci de remplir tous les champs avant d'enregistrer ! </div>  </div>";
    }

    let signed = document.getElementById('filepath_signed').files[0].path;
    if(signed === null){
        ok =false;
        document.getElementById('nopubkey').innerHTML = " <div class= 'card orange darken-2' > <div class='card-content white-text'> Merci de remplir tous les champs avant d'enregistrer ! </div>  </div>";
    }

    let work = document.getElementById('filepath_work').files[0].path;
    if(work === null){
        ok =false;
        document.getElementById('nopubkey').innerHTML = " <div class= 'card orange darken-2' > <div class='card-content white-text'> Merci de remplir tous les champs avant d'enregistrer ! </div>  </div>";
    }

    if(ok === true){
        let text = "issuing_address="+pubkey+"\nchain=bitcoin_regtest\nbitcoind\nusb_name="+usb+
                    "\nkey_file="+usb+"\nunsigned_certificates_dir="+unsigned+
                    "\nblockchain_certificates_dir="+signed+
                    "\work_dir="+work+"\n";
        let fs = require('fs');
        fs.writeFileSync("./conf.ini", text, function(err){
            if(err) throw err;
            console.log("Configuration sauvegardée !");
            document.getElementById('nopubkey').innerHTML = " <div class= 'card green darken-3' > <div class='card-content black-text'> Configuration sauvegardée ! </div>  </div>";
        });
    }
}
