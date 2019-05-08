import json
import os
from cert_verifier import verifier

VERIFYFILE="toVerify.json"

def verifyOnBlockChain(schema, transaction_id=None):
    try:
        with open(VERIFYFILE,"w+") as toVerify:
            toVerify.write(json.dumps(schema))
    except Exception as error:
            print(error)
    res = verifier.verify_certificate_file(VERIFYFILE, transaction_id)
    #Now, let's check if everything is passed !
    passed= (len(res)==len([x for x in res if "passed" in x["status"]]))
    os.remove(VERIFYFILE)
    return passed
