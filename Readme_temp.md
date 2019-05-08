#CERT'IF

Projet libre de vérification de diplômes académiques basé sur blockcert.
Ce projet est constitué de deux parties :
+ *Emission de diplôme* : cette application permet de générer un diplômr à partir d'un template, puis de l'émettre sur la blockchain.
+ Vérification de diplôme : cette application, quant à elle, permet à n'importe quel individu de vérifier un diplôme quelconque sur la blockchain.

*Remarque* : Nous intégrons dans la partie vérification un service de stockage des diplômes accessible aux étudiants. Cette solution est/sera payante, mais reste non nécessaire pour émettre et vérifier un diplôme.

## Installer l'environnement

L'ensemble de l'installation est écrite de sorte à tester le système sur une blockchain de test. Nous décrirons plus tard comment passer sur le réseau principal bitcoin.

### Installer la partie emetteur (issuer)

Il vous faudra installer dans un premier temps [cert-issuer](https://github.com/blockchain-certificates/cert-issuer). Vous pouvez suivre les étapes de leur README, mais cela se résume à :
```
git clone https://github.com/blockchain-certificates/cert-issuer.git && cd cert-issuer
pip install .
```

Nous fournissons avec notre code un docker permettant de faire tourner bitcoin en mode regtest (il s'agit d'une chaîne de blocs virtuelle où l'on possède un contrôle intégral). Nous allons le démarrer de la manière suivante :
```
docker build -t certif_regtest .
docker run -it --network "host" certif_regtest
```
Une fois le docker démarré, nous allons chercher à créer un nouvel utilisateur bitcoin (couple clef publique/clef privée) et lui donner un peu d'argent. Dans le bash du docker :
```
bitcoin-cli generate 101
issuer=$(bitcoin-cli getnewaddress)
privkey=$(bitcoin-cli dumpprivkey $issuer)
bitcoin-cli sendtoaddress $issuer 5
```
Vous serez à présent l'authentique possesseur de 5 (faux) bitcoin. Je vous indique à copier-coller votre clef privée générée dans un fichier *pk_issuer.txt* (ou n'importe quel nom) que vous déposerez sur une clef USB. Vous allez également devoir modifier le fichier **conf.ini** se trouvant en <!-- FIXME : path to conf.ini -->. Une fois dans ce fichier, vous aller changer la valeur de *usb_name* pourqu'elle pointe vers la clef usb où est stocké votre fichier de clef privée. 