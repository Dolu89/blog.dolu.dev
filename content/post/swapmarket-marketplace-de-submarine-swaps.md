---
author: Dolu
date: '2021-11-15T14:00:50.699Z'
title: Swapmarket - Place de marché de Submarine swaps
description: Une solution P2P pour l'échange de bitcoins onchain/offchain
tags:
    - bitcoin
    - submarine swap
    - swapmarket
    - lightning network
slug: swapmarket-place-de-marche-de-submarine-swaps
---

## Submarine swap
Concept à la base dévéloppé par [Alex Bosworth](https://twitter.com/alexbosworth/status/964276161902624768 "Twitter d'Alex Bosworth") en 2018, il s'agit d'une manière d'échanger des bitcoins onchain avec des bitcoins offchain (sur le Lightning network) de manière sécurisée et sans tiers de confiance.

## Cas d'usage
- Pour un opérateur de noeud Lightning, cela permet d'injecter de la nouvelle liquidité sortante (outboud) dans ses canaux, sans pour autant ouvrir de nouveaux canaux
- Un client peut vouloir payer un bien ou un service avec ses bitcoins onchain tandis que le marchand n'accepte que du bitcoin en utilisant le Lightning network
- Se débarasser d'une UTXO et récupérer la somme quasi-équivalente sur le Lightning network

## Comment ça fonctionne ?
> L'exemple suivant est simplifié et omet certains détails. Pour connaitre tous les détails du déroulement d'un Submarine swap, voir [l'article de ION radar](https://wiki.ion.radar.tech/tech/research/submarine-swap)

Prenons un exemple avec Alice et Bob. 

**Alice**, cliente, possède du BTC onchain. **Bob**, swap provider, possède du BTC sur le Lightning network.

Lorsqu'Alice souhaite échanger ses bitcoins onchain, elle va pouvoir faire appel aux services de Bob pour effectuer un échange.

1. Alice va générer une facture (bolt11) pour recevoir 0.001 bitcoins (100k sats) offchain. *Une facture possède un `payment_hash` qui est le résultat du hash SHA256 d'un secret appelé `pre_image`.*
2. Alice fourni sa facture à Bob
3. Bob construit le contrat Bitcoin, génère l'adresse Bitcoin associée au contrat et signale à Alice qu'elle doit payer 100k sats + des frais pour couvrir les frais de minage, sur l'adresse du contrat
4. Alice paye 100.500 sats (dans le cas de 0.5% de frais) à l'adresse
5. Une fois la transaction minée, Bob peut payer la facture d'Alice et ainsi découvrir la `pre_image` de la facture
6. Bob construit une transaction avec le secret pour débloquer les fonds détenus à l'adresse du contrat

#### Cas particulier : Bob ne paye jamais la facture d'Alice

Le contrat est construit d'une telle manière que si Bob (le swap provider) ne paye pas la facture du client, Alice peut débloquer ses bitcoins détenus sur le contrat au bout d'un certains nombre de blocs minés (modulo les frais de transaction)

## Plateformes de swap

Il n'existe à ce jour et à ma connaissance que 2 plateformes permettant de faire de réels Submarine swaps.
- [boltz.exchange](https://boltz.exchange/)
- [submarineswaps.org](https://submarineswaps.org/)

Ces 2 plateteformes fonctionnent très bien, sont fiables et appliquent des frais relativement *faibles*. Mais que se passera-t-il si elles décident d'augmenter considérablement leurs frais, ou bien si elles disparaissaient, comme d'autres avant elles ?

En effet, ces 2 plateformes fournissent leur propre service et il est difficile pour un opérateur de noeud Lightning network de mettre en place son propre service de Submarine swap.

## Une solution : Swapmarket

C'est en me renseignant un peu sur les différentes solutions existantes d'échanges de bitcoins onchain/offchain que m'est venu l'idée d'une plateforme de swaps "P2P".

L'architecture du projet sera la suivante ![Swapmarket architecture](/swapmarket-marketplace-de-submarine-swaps/schema_swapmarket.png)

Comme "n'importe qui" peut se connecter en tant que swap provider et pour éviter tout problème d'arnaque, les contrats Bitcoin sont créés par la plateforme Swapmarket.org et non pas par les swap providers concernés par un swap.

### Démonstration vidéo du projet (Proof of concept)

{{< youtube "https://www.youtube.com/embed/GxAF7gh4EkY" >}}

La plateforme est encore en cours de développement et le code sera disponible en open source sous peu.
