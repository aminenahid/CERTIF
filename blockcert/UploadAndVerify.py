
######################NORMAL IMPORT
import json
import os
import logging
from io import StringIO

######################BLOCKCERTS IMPORT
import cert_issuer as cissuer
import cert_verifier as cverifier
from cert_issuer import issue_certificates, config
from cert_verifier import verifier

PATH=os.path.realpath(__file__)
DIR=PATH[:PATH.rfind(os.sep)]
UPLOADFILE="toUpload{}.json"
VERIFYFILE="toVerify.json"
startNumber=1
fileNumber=1
config.PATH=DIR
#We need to write the private key in the appropriate file
parsedConfig = None

def _getConfig():
    logging.info("Getting configuration for blockcert-issuer")
    global parsedConfig
    if parsedConfig is None:
        try:
            configTemp=config.get_config()
            parsedConfig=configTemp
        except Exception as error:
            logging.error("Didn't succeed in retrieving the configuration for blockcert-issuer : %s", str(error))
            return None
    return parsedConfig

def addSchema(schema):
    """
    Adds a blockert-schema to the future uploaded batch transaction.
    @param schema (str) : the string containing the json file (or blockcert-schema)
    @return True if the file was added successfully.
    """
    global fileNumber
    parsedConfig=_getConfig()
    unsignedPath=os.path.join(parsedConfig.unsigned_certificates_dir,UPLOADFILE.format(fileNumber))
    try:
        with open(unsignedPath, "w+") as certificateFile:
            certificateFile.write(schema)
            fileNumber+=1
            logging.info("Wrote the certificate to the following path : %s", unsignedPath)
    except:
        logging.error("Couldn't write the certificate to the following path : %s", unsignedPath)
    return True

def issueToBlockChain(pubKey, privKey):
    """Issue to the blockchain a blockcert schema.
    @param pubKey (str): the public key of the issuer
    @param privKey (str) : the private key of the issuer
    @param schema (json) : the json containing the cert-schema to issue on the blockchain
    @return a tuple containing first hand a boolean indicating whether the issue was successful or not, and second hand the transaction id of the issue if successful. It also provides the fully uploaded (i.e. real) schema.
       """
    parsedConfig=_getConfig()
    if parsedConfig is None:
        return False, "", ""
    try:

        with open(os.path.join(parsedConfig.usb_name,parsedConfig.key_file),"w+") as privKeyFile:
            privKeyFile.write(privKey)
        
        parsedConfig.issuing_address=pubKey
        logging.info("Ready to issue")
        result=os.system("cert-issuer -c "+os.path.join(DIR,"conf.ini"))
        os.system("rm "+os.path.join(parsedConfig.unsigned_certificates_dir,UPLOADFILE.format("*")))
        #Now, let's return the real signed file
        finalFiles=[]
        blockchainPath=os.path.join(parsedConfig.blockchain_certificates_dir,UPLOADFILE)
        if result==0:
            logging.info("Files were successfully published to the blokchain.\n You may find them at : %s ", blockchainPath.format("[{}-{}]".format(startNumber, fileNumber)))
        for x in range(startNumber, fileNumber):
            with open(os.path.join(parsedConfig.blockchain_certificates_dir,UPLOADFILE.format(x)), "r") as uploaded:
                finalFile.append(uploaded.read())
        return result==0, "", finalFile
    except Exception as error:
        logging.error(error)
        return False, "", None

def verifyOnBlockChain_v2(schema, transaction_id=None):
    try:
        with open(VERIFYFILE,"w+") as toVerify:
            toVerify.write(json.dumps(schema))
    except Exception as error:
        logging.error(error)
    logging.info("Starting verification")
    res = verifier.verify_certificate_file(VERIFYFILE, transaction_id)
    passed= (len(res)==len([x for x in res if "passed" in x["status"]]))
    os.remove(VERIFYFILE)
    logging.info("Verification done")
    return passed
