---
author: Dolu
date: '2022-07-25T10:00:50.699Z'
title: Nostr - Les bases
description: Un protocole de communication pour contrer la censure
tags:
    - nostr
slug: nostr-les-bases
---

## Qu'est-ce que Nostr ?
Nostr est un protocole de transmissions d'informations client/relai avec pour but de contrer la censure.
Son nom est la contraction de **Notes and Other Stuff Transmitted by Relays**.
La force de ce protocole est sa simplicité. Il ne s'agit pas d'une "blockchain", il n'y a pas de mineurs/validateurs et ne contient pas de token.
Comme son nom l'indique, Nostr peut être utilisé pour n'importe quels types d'applications. Cela peut aussi bien être du réseau social comme Twitter, que des applications plus poussées comme un clone d'Uber.

> Un message peut être du texte ou une instruction quelconque pouvant être exécutée par les clients recevant ce message

Un client souhaitant persister un **message** peut envoyer ce message à autant de relais qu'il souhaite. Ces relais devront vérifier l'authenticité cryptographique du message (détaillée dans partie suivante) et ensuite les stocker dans une simple base de données.
Un client  souhaitant récupérer un ou plusieurs **messages** peut envoyer une ou plusieurs requêtes aux différents relais qui devront retourner les messages correspondant à la requête.

En partant du principe que le  message est enregistré dans plusieurs relais, si un relai décide de censurer le message en le supprimant, ou si le relais rencontre une panne, le client pourra toujours récupérer son message depuis les autres relais.
*Un relai ne peut en revanche **PAS** modifier le contenu d'un message sans être en possession de la clé privé du client l'ayant envoyé.

## Comment ça fonctionne ?
La base principale du protocole utilise la signature et vérification cryptographique.
Un client possède une paire de clés cryptographiques et les opérations sont faites [selon la norme de signature Schnorr pour la courbe elliptique secp256k1](https://bips.xyz/340).

Un message sera toujours constitué suivant la structure JSON suivante

``` JSON
{
  "id": <32-bytes sha256 of the the serialized event data>
  "pubkey": <32-bytes hex-encoded public key of the event creator>,
  "created_at": <unix timestamp in seconds>,
  "kind": <integer>,
  "tags": [
    ["e", <32-bytes hex of the id of another event>, <recommended relay URL>],
    ["p", <32-bytes hex of the key>, <recommended relay URL>],
    ... // other kinds of tags may be included later
  ],
  "content": <arbitrary string>,
  "sig": <64-bytes signature of the sha256 hash of the serialized event data, which is the same as the "id" field>
}
```

Le champ **id** est le hash (SHA256) des informations suivantes
``` JSON
[
  0,
  <pubkey, as a (lowercase) hex string>,
  <created_at, as a number>,
  <kind, as a number>,
  <tags, as an array of arrays of non-null strings>,
  <content, as a string>
]
```
Le champ **sig** est la signature Schnorr du champ **id** au format hexadécimal, calculée avec la clé privée de l'utilisateur.

Pour résumer, avant d'envoyer un message à un relai, le client devra construire cet objet JSON.
Le relai quant à lui devra vérifier l'authenticité de l'objet en recalculant le hash du champ **id** à partir des informations de l'objet ainsi qu'en vérifiant la signature du champ **sig** avec la **pubkey** de l'utilisateur et le contenu du message étant **id**.

>La communication entre les clients et les relais est faite en utilisant Websocket.

C'est grâce à ce système qu'il est impossible pour un relai de modifier le contenu d'un message.
En modifiant une information, cela reviendrait à devoir recalculer le champ **id** et invaliderait la signature contenue dans le champ **sig**.

---

Plus d'informations sur les spécifications du procotole sur https://github.com/nostr-protocol/nostr
