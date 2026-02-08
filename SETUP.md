## Instructions:

1. Create a folder "secrets" in the root with a file named "db_password.txt" and write inside your password for your database.

2. Create a folder "certs" in the root and with a terminal run this command inside to create fake certs:
   - openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt
