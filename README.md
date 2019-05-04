# CERTIF
Project of creation of a academic credientials authentification solution

## Installation

### Démarrage du front

Aller dans le dossier *frontend/cert_front* et exécuter les commandes suivantes :
```
yarn install
yarn start
```

Si tout se passe bien, vous pourrez accéder à la page via le lien *http://localhost:3000*.

### Démarrage de postgres

Afin que le back puisse fonctionner, il est nécessaire de faire tourner une base de donnée postgres que nous peuplerons à la suite.

```
docker run --name pg-docker --env POSTGRES_PASSWORD=root --env POSTGRES_USER=postgres --env POSTGRES_DB=certificatif -p 5432:5432 -d postgres
```

**Remarque** : il est possible que docker refuse de démarrer en raison d'un _Daemonconflit_. L'erreur vous indiquera l'identifiant _id_ du docker bloquant. Vous n'aurez qu'à exécuter ```docker stop <id> && docker rm <id>``` pour corriger cela. Vous pouvez aussi exécuter ```docker stop <id> && docker rm $(docker ps -aq)``` afin de réellement supprimer tout vos docker tournant.

### Démarrage du back django & bitcoin

Cette fois, ramenez-vous à la racine du projet et exécuter les commandes suivantes :

```
docker build -t <le-nom-de-votre-docker> .
docker run --network host -p 8000:8000 -p 5432:5432 -it <le-nom-de-votre-docker>
```

**Remarque** : docker vous signalera probablement que le mapping des ports est inutile en raison de l'option _--network host_, mais ça ne fait pas de mal.

L'ensemble des commandes qui suivent s'exécuteront dans le docker django & bitcoin.

#### Avoir des sous

Comme il faut un blockchain, et des sous, pour faire tourner l'application, nous allons créer tout cela :

```
bitcoin-cli generate 101
issuer=`bitcoin-cli getnewaddress`
privKey=`bitcoin-cli dumpprivkey $issuer`
bitcoin-cli sendtoaddress $issuer 5
echo -e "$issuer\n$privKey"
```

La blockchain test est maintenant générée et l'utilisateur _issuer_ possède 5 bitcoins. À la fin de ce script sont affichés deux éléménts _issuer_ et _privKey_. Notez-les bien car il s'agit du couple clef publique/clef privée qui correspondront plus tard à un émetteur sur la blockchain.

Nous allons également générer un couple clef publique / clef privée pour l'étudiant qui se fera diplômé.
```
pubEtudiant=`bitcoin-cli getnewaddress`
privEtudiant=`bitcoin-cli dumpprivkey $pubEtudiant`
echo -e "$pubEtudiant\n$privEtudiant"
```

La clef privée de l'étudiant n'est pas forcément nécessaire pour la suite cela dit.

**Remarque** : vous pouvez vérifier si vous êtes sur une blockchain test (regtest) ou non (mainnet) en regardant le premier caractère des clefs publiques. S'ils s'agit d'un 'm' ou un 'n', alors vous êtes en test. S'il s'agit d'un '1', alors vous allez réellement sur bitcoin.

#### Démarrer django

Nous cherchons ici à faire démarrer le serveur django.

```
python3 /certificatif/manage.py makemigrations certificatif
python3 /certificatif/manage.py migrate
python3 /certificatif/manage.py createsuperuser
python3 /certificatif/manage.py runserver
```

La commande createsuperuser vous permettra de créer un administrateur pour la base de donnée postgres. Gardez bien en mémoire le username et le password attribué (prenez qqch de simple). Pour la clef publique de l'administrateur, 123 suffit. Cela n'aura pas d'importance plus tard.

## Configuration

Maintenant que l'ensemble des systèmes ont été démarrés, vous allez pouvoir les configurer (youpi !).

### Peupler la base de donnée postgres
Afin de vous connecter à la base postgres, saisissez l'addresse _http://localhost:8000/admin_. Vous devez ensuite vous connecter en tant qu'admin (les identifiants créés auparavant).
Une fois connecté, vous allez ajouter une université et un étudiant.
#### Une université
 Vous lui attribuerez comme mot de passe le même que celui de l'admin (copier-coller du hash du mdp du user admin). Complétez les données ainsi :
+ _Email_ : eric.maurincomme@insa-lyon.fr (ce que vous voulez)
+ _Username_ : insalyon (ce que vous voulez)
+ _PublicKey_ : La clef publique que vous a généré bitcoin auparavant : ``` echo $issuer```
+ _Name_ : Institut National des Sciences Appliquées de Lyon (casse sensible, à ne surtout pas changer)
+ _Short name_ : ce-que-vous-voulez (INSA Lyon)
Cochez ensuite la case _Is authorised_ et entrez une _Autorisation expiry date_ dans un avenir quelconque.

#### Un étudiant
Complétez l'étudiant ainsi :
+ _Mot de passe_ : même manipulation que pour l'université : hash du mot de passe de l'admin.
+ _Email_ : toto@insa-lyon.fr (ou ce que vous voulez)
+ _Username_ : toto
+ _Public key_ : La clef publique que vous a généré bitcoin auparavant ```echo $pubEtudiant```
+ _Given names_ : toto (ce que vous voulez)
+ _Last name_ : zero (ce que vous voulez)

Ouf, ça y est ! La base est complétée !

### Générer le diplôme à émettre.

Vous aurez besoin de cert-tools pour créer ce diplôme, si vous ne l'avez pas, suivi le point suivant, sinon sautez-le.

#### Installation de cert-tools

Entrez tout simplement
```git clone https://github.com/blockchain-certificates/cert-tools.git && cd cert-tools
pip install .
```
Pour plus de détail, allez voir sur le [repo officiel](https://github.com/blockchain-certificates/cert-tools.git)

#### Création de votre diplôme

Exécutez la commande suivante :
```
create-certificate-template -c chemin/vers/fichier/configuration_tools_insa.ini
```

Ensuite, allez dans le dossier *cert-tools/sample_data/rosters* et ouvrez le fichier *roster_testnet.csv*. Vous allez y ajouter une ligne comprenant les informations de l'étudiant à diplômer. Voici comment :
+ _name_ : remplissez à la suite le(s) prénom(s) et nom saisis auparavant (toto zero)
+ _pubkey_ : saisissez *ecdsa-koblitz-pubkey:**votre-clef-publique-d'étudiant***. Par exemple : ecdsa-koblitz-pubkey:myyHx2f4Ag3a6xTp5ucfkkvVRGwWeeVtQD
+ _identity_ : Inscrivez ici le mail de l'étudiant. (toto@insa-lyon.fr)

Si cela vous chante, vous pouvez supprimer les autres lignes d'étudiants.

Vous pouvez maintenant exécuter :
```
instantiate-certificate-batch -c chemin/vers/fichier/configuration_tools_insa.ini
```
La commande vous indiquera dans quel dossier pêcher votre diplôme tout frais. cert-tools génére autant de diplôme que de ligne de csv, il faudra donc ouvrir éventuellement ouvrir les fichiers afin de trouver lequel vous concerne. Appelons ce fichier **diplome.json**

## Manipulation

1. Publication

Maintenant que tout est bon, c'est parti ! Connectez-vous en tant qu'université et allez sur *Publier*. Nous allons émettre sur la blockchain le fichier **diplome.json** et fournir comme clef privée celle de l'université ```echo $privKey```.

2. Récupérer le fichier publier

Si tout s'est bien passé, vous devriez avoir dans le docker django le message suivant (ou semblable)

> INFO - Your Blockchain Certificates are in /blockcert/blockchain_certificates
> [04/May/2019 08:16:26] "POST /api/issue HTTP/1.1" 200 120439

La page web devrait également afficher
> Votre diplome a bien été enregistré.

Interrompez l'exécution de django (ctrl+C) pour récupérer la main dans le docker. À l'aide de la commande ```cat /blockcert/blockchain_certificates/toUpload.json```, afficher le fichier publié sur la blockchain et copier-coller le dans un fichier **diplome_publie.json** (hors docker bien sûr).

N'oubliez surtout pas de relance django ensuite : ```python3 /certificatif/manage.py runserver``` !

3. Vérifier le diplôme publié

Cette fois, allez sur la page *Verifier un diplôme* et glissez le fichier **diplome_publie.json**. Lancez la vérification, le résultat sera valide !