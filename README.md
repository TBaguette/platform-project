# API Platform

-   Année : M2 IWOCS
-   Matière: WEB
-   TP : API Platform

## Auteur(s)

| Nom     | Prénom     | login     | email                                  |
| ------- | ---------- | --------  | -------------------------------------- |
| Drouard | Anne-Laure |   Lewynn  | anne-laure.drouard@etu.univ-lehavre.fr |
| Riette  | Nathan     | TBaguette | nathan.riette@etu.univ-lehavre.fr      |
| Cazade  | Alexia     |  Pepalex  | alexia.xazade@etu.univ-lehavre.fr      |
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