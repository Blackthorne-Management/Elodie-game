# Jump points: `?at=` (dev server only)

Owner request (Oct 29): start the quest at any moment of the story. With the game running (`npm.cmd run dev`), open a
**private window** and type, for example, `http://localhost:5180/?at=proof` (Yari's father, Cacique Anaco, is taken
in this scene: the elders' circle, then the Crown's marines). The game plays the test route up to that point in a few
seconds, every fight won and the same choices made, and starts you there, in the middle of a scene if that is where
the point falls. `?chapter=N` still starts a chapter from its beginning.

Use a private window: the jump starts a new game, and the game autosaves over the window's saved game.

Generated from the markers in `quest/routes/zetwal-act1.json`, in story order; the place is the map you start on.


## Chapter 1, Pòdlimyè

| Type after `?at=` | Starts on |
|---|---|
| `plaza-present` | zetwal-town |
| `diagonal` | zetwal-town |
| `plaza-label` | zetwal-town |
| `study-present` | zetwal-house |
| `study-echo` | zetwal-house |
| `rope-bridge` | zetwal-town |
| `bridge-before` | zetwal-town |
| `bridge-echo` | zetwal-town |
| `bridge-after` | zetwal-town |
| `lamp-unlit` | zetwal-temple |
| `lamp-lit` | zetwal-temple |
| `island` | zetwal-temple |
| `square` | zetwal-square |
| `engraver` | zetwal-hall |
| `hall-papers` | zetwal-hall |
| `cane-road` | zetwal-road |
| `boar-won` | zetwal-road |
| `side-quests` | zetwal-road |
| `side-quests-done` | zetwal-temple |
| `end-card` | zetwal-temple (on the chapter card) |

## Chapter 2, Xaraguá

| Type after `?at=` | Starts on |
|---|---|
| `yucayeque` | xaragua-village (in a scene) |
| `caney` | xaragua-caney |
| `council` | xaragua-caney |
| `thorne` | xaragua-customs |
| `dusk-quests` | xaragua-village |
| `dusk` | xaragua-village |
| `lamp` | xaragua-village |
| `cave` | xaragua-cave |
| `cave-drained` | xaragua-cave |
| `areito` | xaragua-plaza |
| `lock` | xaragua-plaza |
| `oath` | xaragua-record |
| `proof` | xaragua-caney (in a scene) |
| `attack` | xaragua-plaza |
| `plaza-night` | xaragua-plaza |
| `patrol` | xaragua-village |
| `refuge` | xaragua-cave (on the chapter card) |
| `bark` | xaragua-conuco |
| `shutters` | xaragua-village |
| `register` | xaragua-customs |
| `cellar` | xaragua-cellar |
| `escape-plan` | xaragua-village |
| `checkpoint` | xaragua-village |
| `tonight` | xaragua-beach |
| `seacave` | xaragua-seacave |
| `thorne-boss` | zetwal-harbor (on the chapter card) |
| `chapter2-end` | zetwal-harbor (on the chapter card) |

## Chapter 3, Ardencia

| Type after `?at=` | Starts on |
|---|---|
| `ardencia` | ardencia-flats |
| `gate` | ardencia-flats |
| `audience` | ardencia-alcazar |
| `records-echo` | ardencia-alcazar |
| `tapestry` | ardencia-alcazar |
| `old-benny` | ardencia-alcazar |
| `library` | ardencia-library |
| `debate` | ardencia-lower |
| `bread-night` | ardencia-lower |
| `noon` | ardencia-town |
| `forge` | ardencia-forge |
| `forge-echo` | ardencia-forge |
| `azzy-joins` | ardencia-forge |
| `tunnel` | ardencia-tunnel |
| `bats` | ardencia-tunnel |
| `sea-road` | ardencia-flats |
| `chapter3-end` | ardencia-camp (on the chapter card) |

## Chapter 4, Al-Doria

| Type after `?at=` | Starts on |
|---|---|
| `strand` | ardencia-camp |
| `aldoria` | aldoria-quay |
| `samira` | aldoria-bazaar |
| `majlis` | aldoria-bazaar |
| `appraise` | aldoria-bazaar |
| `ledgers` | aldoria-bazaar |
| `bargain` | aldoria-bazaar |
| `sweet-water` | aldoria-bazaar |
| `cistern-echo` | aldoria-desert |
| `dusk` | aldoria-bazaar |
| `vault-echo` | aldoria-vault |
| `balance` | aldoria-vault |
| `chest` | aldoria-vault |
| `layla` | aldoria-vault |
| `caravan` | aldoria-bazaar |
| `chapter4-end` | aldoria-desert (on the chapter card) |

## Chapter 5, Eightgate

| Type after `?at=` | Starts on |
|---|---|
| `seat` | seat-gateyard (in a scene) |
| `concourse` | seat-concourse |
| `welcome` | seat-concourse |
| `petitions` | seat-hall |
| `hall-books` | seat-hall |
| `coco` | seat-hall |
| `voices` | seat-workshop |
| `deserters` | seat-concourse |
| `bell` | seat-gateyard |
| `chain` | seat-workshop |
| `sealing` | seat-archive |
| `keeper` | seat-archive |
| `parley` | seat-archive |
| `fitting` | seat-hall |
| `iron-gate` | seat-workshop |
| `chapter5-end` | seat-concourse (on the chapter card) |

## Chapter 6, Skarragol

| Type after `?at=` | Starts on |
|---|---|
| `skarragol` | skarragol-plateau (in a scene) |
| `ordvik-moot` | skarragol-moot |
| `ordvik-saga` | skarragol-fair |
| `ordvik-stores` | skarragol-fair |
| `ordvik-dusk` | skarragol-plateau |
| `ordvik-fjord` | skarragol-fjord |
| `ordvik-raid` | skarragol-fjord |
| `ordvik-herd` | skarragol-fjord |
| `ordvik-grimvald` | skarragol-fjord (on the chapter card) |
| `ordvik-dawn` | skarragol-fair |
| `ordvik-horn` | skarragol-moot |
| `chapter6-end` | skarragol-quay (on the chapter card) |

## Chapter 7, Kuroshi

| Type after `?at=` | Starts on |
|---|---|
| `kirinoura` | kuroshi-pier |
| `kirinoura-quarter` | kuroshi-quarter |
| `kirinoura-letter` | kuroshi-quarter |
| `kirinoura-library` | kuroshi-library |
| `kirinoura-stacks` | kuroshi-library |
| `kirinoura-dusk` | kuroshi-quarter |
| `kirinoura-haru` | kuroshi-hall |
| `kirinoura-maze` | kuroshi-fogmaze |
| `kirinoura-marsh` | kuroshi-marsh |
| `kirinoura-moths` | kuroshi-marsh |
| `kirinoura-filehouse` | kuroshi-filehouse |
| `kirinoura-screens` | kuroshi-filehouse |
| `kirinoura-fox` | kuroshi-filehouse |
| `kirinoura-dawn` | kuroshi-filehouse |
| `kirinoura-files` | kuroshi-library |
| `kirinoura-petition` | kuroshi-hall |
| `chapter7-end` | kuroshi-pier (on the chapter card) |

## Chapter 8, Jwaladesh

| Type after `?at=` | Starts on |
|---|---|
| `jwaladesh-landing` | jwaladesh-harbor (in a scene) |
| `jwaladesh-court` | jwaladesh-bazaar |
| `jwaladesh-day` | jwaladesh-court |
| `jwaladesh-salt` | jwaladesh-saltflats |
| `jwaladesh-night` | jwaladesh-court |
| `jwaladesh-tower` | jwaladesh-harbor |
| `jwaladesh-roofs` | jwaladesh-rooftops |
| `jwaladesh-flame` | jwaladesh-rooftops |
| `jwaladesh-store` | jwaladesh-harbor |
| `jwaladesh-dawn` | jwaladesh-harbor |
| `jwaladesh-price` | jwaladesh-court |
| `chapter8-end` | jwaladesh-harbor (on the chapter card) |

## Chapter 9, Aldermoor

| Type after `?at=` | Starts on |
|---|---|
| `aldermoor-landing` | aldermoor-heath (in a scene) |
| `aldermoor-cross` | aldermoor-cross |
| `aldermoor-keep` | aldermoor-keep |
| `aldermoor-day` | aldermoor-cathedral |
| `aldermoor-chapel` | aldermoor-heath |
| `aldermoor-eve` | aldermoor-cross |
| `aldermoor-keep-night` | aldermoor-keep |
| `aldermoor-archive` | aldermoor-keep |
| `aldermoor-assize` | aldermoor-keep |
| `aldermoor-dawn` | aldermoor-heath |
| `chapter9-end` | aldermoor-heath (on the chapter card) |

## Chapter 10, the Muster

| Type after `?at=` | Starts on |
|---|---|
| `muster-landing` | zetwal-harbor (in a scene) |
| `muster-camp` | zetwal-town |
| `muster-council` | zetwal-hall |
| `muster-watch` | zetwal-town |
| `muster-kitchen` | zetwal-house |
| `muster-blessing` | zetwal-temple |
| `muster-feud-temple` | zetwal-temple |
| `muster-stone` | zetwal-town |
| `muster-signing` | zetwal-town |
| `muster-feud-merchants` | zetwal-market |
| `muster-feud-crown` | zetwal-square |
| `muster-road` | zetwal-road |
| `muster-crew` | zetwal-road |
| `muster-tijak` | zetwal-road |
| `muster-cellar` | zetwal-mill |
| `muster-vote` | zetwal-hall |
| `muster-dusk` | zetwal-town |
| `muster-night` | zetwal-town |
| `muster-quay` | zetwal-harbor |
| `chapter10-end` | zetwal-harbor (on the chapter card) |

## Chapter 11, the war for Xaraguá

| Type after `?at=` | Starts on |
|---|---|
| `war-landing` | xaragua-beach |
| `war-gun-taken` | xaragua-beach |
| `war-flank-done` | xaragua-beach |
| `war-camp` | xaragua-camp |
| `war-tide-ready` | xaragua-camp |
| `war-village` | xaragua-village |
| `war-anaco-freed` | xaragua-village |
| `war-echo-pier` | xaragua-village |
| `war-chain-down` | xaragua-village |
| `war-trust` | xaragua-village |
| `war-truth` | xaragua-village |
| `war-song` | xaragua-plaza |
| `chapter11-end` | xaragua-caney (on the chapter card) |

## Chapter 12, the Claim

| Type after `?at=` | Starts on |
|---|---|
| `claim-arrival` | seat-concourse (in a scene) |
| `claim-rooms` | seat-rooms (in a scene) |
| `claim-night` | seat-concourse |
| `claim-bell` | seat-concourse |
| `claim-echo` | seat-hall |
| `claim-count` | seat-hall |
| `claim-tile` | seat-hall |
| `chapter12-end` | seat-hall (on the chapter card) |

## The Epilogue, the Hearing

| Type after `?at=` | Starts on |
|---|---|
| `hearing-arrivals` | seat-concourse (in a scene) |
| `hearing-verdict` | seat-hall |
| `the-end` | seat-hall (on the chapter card) |
