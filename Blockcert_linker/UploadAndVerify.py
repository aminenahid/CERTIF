
######################NORMAL IMPORT
import json
import os
from io import StringIO

######################BLOCKCERTS IMPORT
import cert_issuer as cissuer
import cert_verifier as cverifier
from cert_issuer import issue_certificates, config
from cert_verifier import verifier

DIR=os.getcwd()
FILENAME="toUpload.json"
VERIFYFILE="toVerify.json"


def issueToBlockChain(pubKey, privKey, schema):
    """Issue to the blockchain a blockcert schema.
    @param pubKey (str): the public key of the issuer
    @param privKey (str) : the private key of the issuer
    @param schema (json) : the json containing the cert-schema to issue on the blockchain
    @return a tuple containing first hand a boolean indicating whether the issue was successful or not, and second hand the transaction id of the issue if successful. It also provides the fully uploaded (i.e. real) schema.
       """
    config.PATH=DIR
    try:
        #We need to write the private key in the appropriate file
        parsedConfig = config.get_config()
        with open(os.path.join(parsedConfig.usb_name,parsedConfig.key_file),"w+") as privKeyFile:
            privKeyFile.write(privKey)
        #Now, let's write the cert-schema in file as pointed out by the conf.ini file
        with open(os.path.join(parsedConfig.unsigned_certificates_dir,FILENAME), "w+") as certificateFile:
            certificateFile.write(str(schema))
        #We can now set the address of the issuer
        parsedConfig.issuing_address=pubKey
        #Let's go
        txID = issue_certificates.main(parsedConfig)
        #Of course, remove the useless files
        os.remove(os.path.join(parsedConfig.usb_name,parsedConfig.key_file))
        os.remove(os.path.join(parsedConfig.unsigned_certificates_dir,FILENAME))
        #Now, let's return the real signed file
        finalFile=""
        with open(os.path.join(parsedConfig.blockchain_certificates_dir,FILENAME), "r") as uploaded:
               finalFile=uploaded.read()
        return True, txID, finalFile
    except Exception as error:
        print(error)
        return False, "", None

def verifyOnBlockChain(jsonContent, transaction_id=None):
    certificate_json=json.loads(jsonContent.decode('utf-8'))
    certificate_model = ccore.to_certificate_model(certificate_json=certificate_json,
                                                    txid=transaction_id,
                                                    certificate_bytes=jsonFile)
    result = verifier.verify_certificate(certificate_model, options)
    return result

def verifyOnBlockChain_v2(schema, transaction_id=None):
    try:
        with open(VERIFYFILE,"w+") as toVerify:
            toVerify.write(schema)
    except Exception as error:
            print(error)
    res = verifier.verify_certificate_file(VERIFYFILE, transaction_id)
    #Now, let's check if everything is passed !
    passed= (len(res)==len([x for x in res if "passed" in x["status"]]))
    os.remove(VERIFYFILE)
    return passed
