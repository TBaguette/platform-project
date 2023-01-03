# API Platform

-   Année : M2 IWOCS
-   Matière: WEB
-   TP : API Platform

## Auteur(s)

| Nom     | Prénom     | login     | email                                  |
| ------- | ---------- | --------  | -------------------------------------- |
| Drouard | Anne-Laure |   Lewynn  | anne-laure.drouard@etu.univ-lehavre.fr |
| Riette  | Nathan     | TBaguette | nathan.riette@etu.univ-lehavre.fr      |
| Cazade  | Alexia     |  Pepalex  | alexia.cazade@etu.univ-lehavre.fr      |
| Vauthier| Quentin    | Quentin-V | quentin.vauthier@etu.univ-lehavre.fr      |


## Travail à réaliser

Détail du tp : <https://pigne.org/teaching/webdev2/lab/FullStackLab>

## Pour la mise en place

Pour démarrer le projet : 

```
docker compose build --pull --no-cache
docker compose up -d
``` 


Commencer par augmenter la mémoire vive :

```
docker-compose exec php \                                 
php -d memory_limit=2G \
/usr/bin/composer require doctrine/doctrine-migrations-bundle
```

Pour migrate la DB : 

```
docker compose exec php \
    bin/console doctrine:migrations:diff
docker compose exec php \
    bin/console doctrine:migrations:migrate
```

Pour ajouter les données rendez vous sur 

https://www.data.gouv.fr/fr/datasets/demandes-de-valeurs-foncieres/

Télécharger les valeurs de 2017 à 2022 et les placer dans le dossier api/resources/sales

Executer ensuite la commande : 

```
docker compose exec php bin/console doctrine:fixtures:load
```
## Mise en place pour les tests frontend
```
cd pwa/
npm install
npm test
```

## Mise en place pour les tests backend
- Executer la commande : `docker compose exec -T php bin/console -e test doctrine:database:create` pour créer la base de données de test
- Executer la commande : `docker compose exec -T php bin/console -e test doctrine:migrations:migrate --no-interaction` pour migrer la base de données de test
- Chargez les fixtures de test avec la commande : `docker compose exec php bin/console hautelook:fixtures:load --env=test`
- Lancez les tests avec la commande : `docker compose exec php bin/phpunit`

Pour afficher le coverage des tests, lancez la commande : `docker compose exec php bin/phpunit --coverage-text`

Ou pour un affichage plus complet : `docker compose exec php bin/phpunit --coverage-html coverage` puis ouvrir le fichier coverage/index.html