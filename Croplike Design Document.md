---
title: Croplike Design Document
category: Game Design
tags:
- Game Design
dir: ltr
description: >
  A roguelike about farming and letting go.
---
# Overview
## Theme / Setting / Genre
Letting go
South Stories
Sci-fi Fantasy
## Core Gameplay Mechanics Brief
Farm / Craft
  * Materials for NPCS
  * Items / Buffs
  * Weapons and Armor
  * Mech Pieces
  * Farm Pieces
Collect resources from farm for fuel and repairs.
  * Random dungeon based on farm setup.
  * Player only - fast
Leave farm to gather materials to farm and craft.
  * Random open map, survival / hunt.
  * Player + mech - slower
## Targeted platforms
Browser
## Monetization model (Brief/Document)
How do you plan too monetize the game? 
  * /fuck you
## Project Scope
Game Time Scale
  * 50$ a year for the moment.
  * 2 years to prototype given current pace 12/25/21
Software cost has been purchased. 
  * Aseprite 
  * GarageBand 
  * Deepdwn
If this cost more than $2500, I am going back in time and stopping it.
## The Elevator Pitch
A rogue-like about farming and letting go.
## Project Description (Brief)
Players forage for supplies. Harvested flora, fauna, and geology.

Harvest can crafted into equipment, potions, and planted.

The player will find a massive old mech with a farm growing at the top.

They can leave the farm and hunt for supplies on foot or in a smaller mech-like suits once repaired.

On foot, there are large creatures that are multi tiled. This is the need for the smaller mech-like suits.

The farm, is harvested inside the Goliath farming mech. This is a procedural dungeon based on the farm's make up.

The farm can move. Giving access to a different over world outside the mech and hunts.
## Project Description (Detailed)
>Players forage for supplies. Harvested flora, fauna, and geology.
Harvest can crafted into equipment, potions, and planted.
On foot, there are large creatures that are multi tiled. This is the need for the smaller mech-like suits.

Hunted flora and fauna yield parts. These, planted or modified into equipment. They may also develop into resources for NPCs and help maintain the farm. It can upgrade by creating equipment to further develop production.

Large monster, geographic anomalies, and plants are broke down into resources. Sometimes their size requires a suit.

There are multi tiled objects. For example and 4 legged monster with a tail would take up 15-20 tiles. The player may become strong enough to engage or move these massive obstacles. But a suit is required for most engagements.

The equipment and hunting system causes reactions with each other. Weapons / Suits can tell stories of kills. A player can lose these. Death from hunts, creates a stronger monster that patrols the players corpse. Making lost equipment difficult to reacquire.

>The player will find a massive old mech with a farm growing at the top.
They can leave the farm and hunt for supplies on foot or in a smaller mech-like suits once repaired.
The farm, is harvested inside the Goliath farming mech. This is a procedural dungeon based on the farm's make up.
The farm can move. Giving access to a different over world outside the mech and hunts.

The farm serves as a hub for game. The players can manage their farm, equipment, supplies, and deal with NPCs that may visit.

Once a crop is ready for harvest, the players will enter the farming mech to gather resources. This dungeon's content is story related. These dungeons are on foot only and the layout of the map based on the farming mech setup.

Successful completion provides fuel to move the farm and power equipment. A loss will return player to the farm with some of the gathered materials.
# Story and Gameplay
## Story (Brief)
A player's journey to attempt to revive a loved one.
## Story (Detailed)
N/A
## Gameplay (Brief)
TB Monster Hunter / Farming rogue-like with mechs.
## Gameplay (Detailed)
### Croplike Site
Landing Page
  * The landing page contains basic info. If the player is returning, their farm game engagement stats will display as well.
FAQ / About 
  * The FAQ will cover questions I determine important. The about section will cover advance details on Croplike. The game will remain free with donations optional. A battered woman's shelter will receive any proceeds.
Wiki 
  * As a player encounters entities or anomalies in the game, the wiki entry for that item unlocks. This will need research into enjoyable UX/UI for scientific and lore data.
Game 
  * The game portal will have a button to start the game. Like pressing power on a game console. A loading screen will display while the game initializes.
### Character Creation Site
  * This section is very brief and requires 2 inputs. There will be no stat allocation. A player name and identity are all that is currently planned for.
  * How the player identifies will have reference effects only. He She They Them. The main narrative uses characters from the story. The player is an actor in the world during the events, not a participant.
  * Access to player object. Currently located in the $gameStore. Recommendation to create $localHost storage utility. Contains a _type property that checks version. Text input for player name and identity drop down. Simple black screen, white text, no border.
* Implementation: Svelte component
### Context Based UI
* The game screen will only display the actions or reactions available. If a player cannot move left, the left button will not be visible. If the player can attack, the option to do so will display.
* Implementation: Svelte component
### Turn Schedule
* This game will develop its own system of scheduling. While there is procedural work involved, only one map will be available at a time. Entity population controlled by the player actions.
* All entities will need tracking during a dungeon. Therefor a custom scheduler is being developed. The only time the player input matters, is when it is their turn to act / react.
* It is possible, entities could chain actions and reactions before another entity acts. Each time the player makes an action or reaction, a tick occurs. Each tick progresses the day and night cycle.
* Implementation: Schedule.js class generating script
### Tutorial
* The player starts in a constructed tutorial map.
* There are no multi tiled creatures. There are multi tiled objects. Broken mech suits.
* The repairs on these suits, will lead players through the game basics. The player will end up spending several days game time on this map.
* It is important to remind the player to explore and have fun, but nothing will carry over. It serves as agency to start the story and introduce players to basic game mechanics.
* This requires access to the player object, the tutorial map, and entity list. The player data, context-based UI, game map, and story / tutorial information.
### Farm Mech
* Upon completing the tutorial, the player will have access to their base of operations. A farming mech. This is a massive 4-legged platform with farm located at the top.
* This serves as the player's hub going forward. Each time the player enters a dungeon and returns, a new feature introduces itself.
* Farm, Crafting Station, Forage Dungeon, Status Panel, Harvest Dungeon, NPC Station
* This requires access to the player object, the hub map, an entity list. The player data, context-based UI, game map, and story / tutorial information.
### Farm
* Each time the player returns from a dungeon, they may work the farm. Organizing layout, working soil, planting, and trimming.
* To consult on this system: https://doubleproficiency.com/projects/herbalists-primer/
* Turn Schedule - having an accessible day and night cycle in hub, provides for narrative. Research into this providing a fun farming mechanic is ongoing. See Harvest Dungeon.
* The intention is to render this with the canvas and ascii. Exploration into using web components only.
* Further exploration required.
### Crafting Station
* Each time the player returns from a dungeon, they may have the materials to craft. Crafting has several sections. Items, equipment, suits. Each of these contain sub groups. The one remaining category is for the Farming Mech upgrades.
* Items - one time use, bait, buffs, mods
* Equipment - Utility, Defense, Offense
* Suits - Utility, Defense, Offense (parts)
* Information on crafting tied into the wiki, on unlock. There will be a cap on the number of parts and items a player may store. This explored while balancing due to stats.
* This will need access to the player object. The nature of the crafting allows for the web dev to take full effect of the UI and convey all info to the player.
* Implementation: Svelte components
### Mech Suit
* This will be a multi tiled entity. Currently a 3 x 3 grid with an entrance. The player mounts the mech suit and all visual representation should change.
* The player and suit will not represent one tile. Each tile on the map is a single representation of the 3x3 underneath.
* The suit allows powerful hunt and harvest options but is dependent on fuel early on in the game. Unlike your normal equipment, this unit is destructible and pieces are salvageable.
* While in the forage map, repairs may happen, but destroyed parts will remain lost.
* Aside of a different UI visual representation, the map should remain the same display. Actions taken by the mech, will reflect on the map when the player exits the suit.
* From a mental perspective, this is the armor in the game. It is destructible.
### Multi-Tiled Entities
* Traditional rogue-likes have a single tile for large beings. The entity contains an array of position objects. Instead of the traditional x,y position structs.
* Current development is is directed at updating positions pieces like tails. To that if the monster were to change direction and is longer than the turn, part of it will follow the entity's path. Limbs, telegraphed attacks.
* Like the mech suit, these entities may alter the terrain and move objects.
### AI
* The AI is based on a set of needs. It will hunt from the selected flora and fauna. It may hunt the player, equipment, or harvest.
* A set of needs dictates growth and the player interactions dictate the balance. The player may decide to remove one species from the current map. This has cascading effects causing other species to feed on different entities.
* The AI prototype, the mutating cave mushrooms, is from the codingCookie rogue-like tutorial.
* Using non visual anchors in the tile data for the map, I can route the AI into patrols and territorial behavior. This can do with Rot.js and entity class data.
### Hunts
* Hunts serve as quest structure, material management. The target may be flora or fauna and based off the need of the player.
* The player maybe hunted as well. This information will be showing on the Status Panel before departure. This AI is not restricted and will hunt down the player after completing its own set of needs.
* This requires access to the player object, the forage map, and entity list.
### Status Panel
* This will be a section devoted to displaying all information in the game.
* This requires access to every store.
* Implementation: Svelte component
### Multi-Tiled Objects
* The farm mech legs, large trees, buildings. These are examples. Geographic anomalies. They will provide small branching dungeons, lore, story encounters, and entity habitats.
### Harvest Dungeon
* Farming Mechanics and tie with dungeon TBD
* Once a crop is ready for harvest, the players will enter the farming mech to gather resources. This dungeon's content is story related. Further progress yields more story.
* These dungeons are on foot only and the layout of the map based on the farming mech setup.
* Successful completion provides fuel to move the farm and power equipment. A loss will return player to the farm with some of the gathered materials.
### Equipment / Part Stats and Stories
* These items will all have basic utility and features.
* Every hunted kill, adds to the story of the weapon, allowing for upgrade into another type or the same.
* Upgrades use harvested parts and therefore increase the danger of using in the forage dungeon
### NPC Encounters
* Story progression and used to manage resources and needs. Slight impact on dungeons. May visit farm and provide complications.
# Assets Needed
## 2D
* Ascii - Press Start 2P 
## Sound
* Browser, no sound.
## Code
* https://github.com/jsrco/croplike
* https://github.com/ondras/rot.js
* https://svelte.dev/docs
* https://tailwindcss.com/
## Animation
ROT.js / canvas
# Schedule
## Design Document
 EO December 2021
 Complete GDD draft
## Scheduled Work
### Update Template
* Time Scale
* Milestone 1
* Milestone 2
* Etc.
### January 31, 2022
* Interview with AWS Connect January 6 2022, new revision date
* Hired at Evident Change
* Converted docs into Deepdwn
* Began research into replacing Rot.js
* Started Three.js course
* Install required assets
### Feb 28, 2022
* Research spike yielded better Pixi.js results
* Converted format. Rot.js for map tools
### March 13, 2022
* Sunset old code
* Back to three.js due to Pixi fullscreen dev
### April 18, 2022
* Sunrise old code
* Removing Three.js and Pixi.js, may revisit. Writing own Canvas.

### April 1, 2022 
* Temp localHost user refactor
* Basic site to game connections. UI / Wiki
* Build test map.
