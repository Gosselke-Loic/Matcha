1. Ajouter un dossier "secrets" avec un fichier "db_password.txt" et le mot de passe dedant.

2. Dans le dossier "certs" lancer cette commande -> openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt
   - Pour des fake certs pour Dev.
