# CERT'IF

Projet libre de vérification de diplômes académiques basé sur blockcert.
Ce projet est constitué de deux parties :
+ *Emission de diplôme* : cette application permet de générer un diplômr à partir d'un template, puis de l'émettre sur la blockchain.
+ Vérification de diplôme : cette application, quant à elle, permet à n'importe quel individu de vérifier un diplôme quelconque sur la blockchain.

*Remarque* : Nous intégrons dans la partie vérification un service de stockage des diplômes accessible aux étudiants. Cette solution est/sera payante, mais reste non nécessaire pour émettre et vérifier un diplôme.


## Contenu du repo

3 dossiers indépendants se trouvent dans ce repo et possèdent leur rôle :
+ *frontend/cert_front* : application web front pouvant vérifier un diplôme, ainsi que gérer le compte d'un étudiant (gestion de ses diplômes).
+ *certificatif* : back Django de l'application web *frontend/cert_front*.
+ *frontend/cert_desktop* client lourd servant à générer des diplômes à partir d'un template, ainsi que les émettre sur la blockchain.

## Installer l'environnement

L'ensemble de l'installation est écrite de sorte à tester le système sur une blockchain de test.

**Remarque** : Le système, dans sa version actuelle ne peut tourner que sur un système linux. (La partie cert_desktop, du moins).

### Dépendances Python

Il vous faudra installer dans un premier temps l'ensemble des dépendances python :
```bash
pip install -r requirements.txt
cd cert-issuer && pip install .
cd ../cert-tools && pip install .
```

Assurez-vous également de faire tourner le système avec python 3.6 ou plus ! Le système peut tout à fait fonctionner en 3.5, mais la génération de pdf ne fonctionnera pas, et par conséquent la vérification de diplôme.

### Bitcoin

1. _Démarrer bitcoin_

Nous fournissons avec notre code un docker permettant de faire tourner bitcoin en mode regtest (il s'agit d'une chaîne de blocs virtuelle où l'on possède un contrôle intégral). Nous allons le démarrer de la manière suivante :
```bash
docker build -t certif_regtest .
docker run -it --network "host" certif_regtest
```

2. _Créer une identité_

Une fois le docker démarré, nous allons chercher à créer un nouvel utilisateur bitcoin (couple clef publique/clef privée) et lui donner un peu d'argent. Dans le bash du docker :

```bash
bitcoin-cli generate 101
issuer=mtT7JjAKq3eNJ2LxA5DjMTaPRJBYjbFLaB
bitcoin-cli importaddress $issuer
bitcoin-cli sendtoaddress $issuer 5
```

Vous serez à présent l'authentique possesseur de 5 (faux) bitcoin.

**Remarque 1** : vous pouvez vérifier si vous êtes sur une blockchain test (regtest) ou non (mainnet) en regardant le premier caractère des clefs publiques. S'ils s'agit d'un 'm' ou un 'n', alors vous êtes en test. S'il s'agit d'un '1', alors vous allez réellement sur bitcoin.

**Remarque 2** : Afin que la démo tourne, nous vous fournissons déjà un couple clef publique/clef privée. (La clef privée se trouve dans *pk_issuer.txt*). Si jamais vous choisissez de créer vos propres identifiant, exécutez les commandes suivantes. Vous aurez en revanche à modifier plus tard certains paramètres de la base de données.
```bash
issuer=$(bitcoin-cli getnewaddress)
privkey=$(bitcoin-cli dumpprivkey $issuer)
bitcoin-cli sendtoaddress $issuer 5
```


3. _Paramétrer l'émetter bitcoin_

Rendez-vous dans le fichier *frontend/cert_desktop/conf.ini* et modifiez-le ainsi :

> issuing_address=<votre clef publique ($issuer) ici>
> 
> chain=bitcoin_regtest
> bitcoind
> 
> #Ne modifier que ces deux chemins
> usb_name=/chemin/vers/clef_usb
> key_file=pk_issuer.txt
>
> unsigned_certificates_dir=./issuer/unsigned_certificates
> blockchain_certificates_dir=./issue/blockchain_certificates
> work_dir=./issue/work
>
> #no_safe_mode

Vous devrez copier-coller le fichier *pk_issuer.txt* dans une clef usb.
Si vous avez choisi de générer vos identifiants bitcoin, vous écrirez dans un fichier intitulé *pk_issuer.txt* situé sur une clef usb votre clef privée ```$privkey```.

### Postgres

Vous aurez besoin d'une base de donnée postgres en localhost (ou ailleurs si ça vous plaît) intitulée _certificatif_. Nous fournissons pour cela un docker contenant une base de donnée toute prête :
```bash
docker run --network="host" -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=root hex4404/postgres
```

### Démarrer les applications

Il faut démarrer les 3 applications : client web, back web et client lourd. Voici les commandes respectives :

+ *client web (frontend/cert_front)*
	+ ```yarn install && yarn start```
	+ L'adresse pour vous connecter au client est localhost:3000
+ *back web (certificatif)*
	+ ```python manage.py makemigrations certificatif && python manage.py migrate && python manage.py runserver```
+ *client lourd (frontend/cert_desktop)*
	+ ```yarn install && yarn start```

### Peupler la base de donnée

Selon l'état du docker, il est possible que la base postgres ne soit pas peuplée. Afin d'y accéder, il va falloir créer un super utilisateur administrateur de django.
```bash
python manage.py createsuperuser
```
Ensuite, il faudra vous connecter à l'adresse : localhost:8000/admin grâce à vos identifiants super utilisateur. Si la base est remplie, vous devriez trouver un objetU Universitys et un objet Authorisations. Laissez les tels quels.
Dans le cas où cette base n'est pas peuplé, voici les champs à remplir :

1. Nouvelle university

+ Name : Institut National des Sciences Appliquées de Lyon
+ Short Name : INSA Lyon
+ Public key : mtT7JjAKq3eNJ2LxA5DjMTaPRJBYjbFLaB

2. Nouvelle authorisation

+ University : University object (1)
+ Law : L. 642-1, L. 642-12, D. 642-1, R. 642-10
+ Authorisation Year : 2019
+ Expiry Year : 2020
+ Diploma type : Diplome d'ingenieur - grade de Master

**Remarque 1** : Il est tout à fait possible de mettre une autre clef publique pour l'université, par exemple celle générée auparavant : $issuer. Il faudra cependant veiller à ce qu'elle corresponde bien aux clefs publiques/privées utilisées pour l'émission d'un diplôme via *frontend/cert_desktop*0
**Remarque 2**: Il est important de copier au caractère près les champs _Name_, _Public key_ et _Diploma Type_ au caractère près, sans quoi la vérification ne fonctionnera pas.

## Remarques générales

Lors de la publication de diplome part *cert_desktop*, les diplômes signés se trouvent dans le dossier *frontend/cert_desktop/issue/blockchain_certificates*, à moins que vous ne changiez ce chemin dans *frontend/cert_desktop/conf.ini*.

Vous aurez besoin d'un template de diplôme pour en générer avec *frontend/cert_desktop*. Ce template se trouve dans le dossier *diplomes* et est intitulé *template_insa.json*

## Liens pratiques

La documentation sur cert-issuer : [repo officiel](https://github.com/blockchain-certificates/cert-issuer)
