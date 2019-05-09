#CERT'IF

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
issuer=$(bitcoin-cli getnewaddress)
privkey=$(bitcoin-cli dumpprivkey $issuer)
bitcoin-cli sendtoaddress $issuer 5
```
Vous serez à présent l'authentique possesseur de 5 (faux) bitcoin.

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

Vous écrirez dans un fichier intitulé *pk_issuer.txt* situé sur une clef usb votre clef privée ```$privkey```.

### Postgres

Vous aurez besoin d'une base de donnée postgres en localhost (ou ailleurs si ça vous plaît) intitulée _certificatif_.
Pensez en conséquence à modifier le fichier *certificatif/certificatif/settings.py* afin d'y modifier les lignes suivantes :

># Database
># https://docs.djangoproject.com/en/2.0/ref/settings/#databases
>
>DATABASES = {
>    'default': {
>        'ENGINE': 'django.db.backends.postgresql',
>        'NAME': 'certificatif',
>        'USER': 'nom_utilisateur_postgres',
>        'PASSWORD': 'mot_de_passe_utilisateur',
>        'HOST': '127.0.0.1',
>        'PORT': '5433',
>    }
>}

### Démarrer les applications

Il faut démarrer les 3 applications : client web, back web et client lourd. Voici les commandes respectives :

+ *client web (frontend/cert_front)*
	+ ```yarn install && yarn start```
	+ L'adresse pour vous connecter au client est localhost:3000
+ *back web (certificatif)*
	+ ```python manage.py makemigrations certificatif && python manage.py migrate && python manage.py runserver```
+ *client lourd (frontend/cert_desktop)*
	+ ```yarn install && yarn start```

## Remarques générales

Lors de la publication de diplome part *cert_desktop*, les diplômes signés se trouvent dans le dossier *frontend/cert_desktop/issue/blockchain_certificates*, à moins que vous ne changiez ce chemin dans *frontend/cert_desktop/conf.ini*.

Vous aurez besoin d'un template de diplôme pour en générer avec *frontend/cert_desktop*. Ce template se trouve dans le dossier *diplomes* et est intitulé *template_insa.json*

## Liens pratiques

La documentation sur cert-issuer : [repo officiel](https://github.com/blockchain-certificates/cert-issuer)