---
title: Comment estimer les fees sur Bitcoin ?
description: 'Ce post à pour but de démontrer comment je m''y prends pour faire passer une transaction prioritaire (dans le prochain bloc miné) avec les frais les plus bas.'
date: 2021-01-26T21:12:56.755Z
slug: comment-estimer-les-fees-sur-bitcoin
tags:
    - fees
    - projet
    - transaction
---

Lorsque l'on doit faire une transaction sur la blockchain Bitcoin, il est important de bien savoir comment calculer les frais.
Tout d'abord, il faut se demander si sa transaction doit être validée absolument au plus tôt, ou si ça peut attendre plusieurs heures, voire jours.

**Ce post à pour but de démontrer comment je m'y prends pour faire passer une transaction prioritaire (dans le prochain bloc miné) avec les frais les plus bas.**

Pour cela, il faut, soit faire confiance à son wallet et à son calculateur de frais, soit avoir une vision du mempool à cet instant.
Jusqu'à maintenant, je me basais sur le site [mempool.space](https://mempool.space) pour visualiser l'état du mempool. Ce site a comme avantage de pouvoir visualiser très facilement et rapidement à quels frais il vaut mieux faire passer une transaction.

![Mempool next block](/calculer-frais-transaction-bitcoin/mempool.jpg)

Sur cette image, on peut analyser que si je souhaite inclure ma transaction dans le prochain bloc, il faudrait que mes frais soit d'au moins *11 sat/vB*.
Je pourrais me laisser tenter par ce *tarif* attractif, mais si j'analyse un peu plus les données qui m'entourent, je peux voir que le dernier bloc miné n'est agé que de seulement 2 minutes.

**Qu'est-ce que cela veut dire ?**

Il faut prendre en considération le temps du dernier bloc miné. Etant donné qu'il reste *environ* 8 minutes pour que le prochain bloc soit miné, ça laisse *environ* 8 minutes à d'autres pour voler ma place dans le prochain bloc.

En effet, si j'envoie ma transaction à seulement 11 sat/vB, il y a de forte chance qu'il y ait eu quelques dizaines ou centaines de nouvelles transactions à 11 sat/vB. Si je veux m'assurer que ma transaction passera dans le prochain bloc, je vais devoir augmenter un petit peu les frais. On peut imaginer dans ce cas que 13 ou 14 sat/vB devrait suffire.

Si le dernier bloc miné datait en revanche d'environ 10 minutes, j'aurais tenté d'envoyer tout de même ma transaction 11.5 sat/vB.

*Pour résumer, plus le dernier bloc miné est proche des 10 minutes de vie, plus je peux tenter de me rapprocher de la borne basse des frais de transactions*

## Comment automatiser ce processus d'analyse ?

Même s'il n'est pas forcément difficile de faire cette analyse par soi même, ça peut en revanche être fastidieux de garder les yeux rivés sur l'interface du site [mempool.space](https://mempool.space) (bien que je la trouve très jolie). Pour cela, j'ai décidé de me servir des différentes API de mempool.space pour calculer les frais *parfaits*, selon moi, pour qu'une transaction soit validée dès le prochain bloc miné.

Il s'agit de [btcfees.dolu.dev](https://btcfees.dolu.dev/)

Ce site propose une interface minimaliste qui expose en temps réel les frais à adopter selon mon analyse. Pour fournir ces données à mon interface, j'ai développé une api [btcfees-api.dolu.dev](https://btcfees-api.dolu.dev/) disponible en HTTP et en Websocket [wss://btcfees-api.dolu.dev](wss://btcfees-api.dolu.dev/)

**Ce projet en est encore à l'état de POC. Il y a encore beaucoup d'optimisations à faire**

---

Le code source du projet est disponible sur Github : 
- https://github.com/dolu89/btc-fees-front
- https://github.com/dolu89/btc-fees-api
