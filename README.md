# Test technique
# Objectif gobal
L'objectif de ce test est de vérifier votre capacité à mettre en place des systèmes ainsi que les bonnes pratiques liées.

# Prérequis
vous aurez besoin uniquement d'un terminal, de git, de docker et de docker-compose installés.
Obtenir docker : https://docs.docker.com/get-docker/

# Exercice
Vous devrez mettre en place une API en Express, avec une route qui ira télécharger et parser un fichier volumineux, et l'importera dans une base de donnée afin de traiter les informations contenues.

Observez bien la structure de donnée du CSV, celle de la BDD, et traitez les informations en conséquences.

### Création de la migration
Rédigez la migration SQL dans le fichier `dump.sql` avec la structure correspondante.

### Route d'importation

**Route :** `/import`

**methode :** GET

**response :** 
```json
{
    "status": "done", 
    "time": "0.465ms",
    "importedRows": 1000
}
```

Cette route, une fois requêtée, devra importer le fichier csv, traiter les données, et importer le tout dans une base de donnée locale.

### Route d'affichage des données

**Route :** `/user/:id`

**methode :** GET

**response :** 
```json
{
    "id": 1, 
    "name": "Jean Dupont",
    "email": "jean.dupont@email.com",
    "registredAt": "February 1st 2021, 6:47:58 pm",
    "gender": "Male"

}
```
(https://momentjs.com/ pour la gestion de dates ;) )

Cette route devras afficher les informations d'un user importé a partir de son ID

# Bonus

### Middleware d'authentification
La mise en place d'un Middleware d'authentification utilisant le header `Authorization` doit protéger les deux routes ci-dessus. 
La route d'import, devras utiliser un token administrateur. (voir token plus bas)

# Annexes
### How to
lancer le projet : 
`docker-compose up -d`

Connection à la BDD : 
`docker exec -it test_technique_db_1 mysql -uroot -proot`

Creation de la base de donnée : 
`docker exec -it test_technique_db_1 mysql -uroot -proot < dump.sql`

### Ressources
**Token administrateur : **
```eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoyNTE2MjM5MDIyfQ.SOPGUnIALZD4lXfxeL1v0n_i9DaO0jcwjNhSmtKAumg```

**Token utilisateur :** 
```eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoyNTE2MjM5MDIyfQ.kggx5ylVTJWq_-c7mW8hRehry-ikLBQNNeW33k8nKbQ```

**Fichier CSV à importer :**
https://abbeal.s3.fr-par.scw.cloud/datas.csv

- Base de donnée :

**Host :** 0.0.0.0:3306

**Database :** test

**table :** user

**structure :**

```
id (integer), 
login (string), 
name (string), 
email (string), 
registeredAt (date now), 
gender (enum('male', 'female', 'other'))
```
