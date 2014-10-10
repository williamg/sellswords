# Sellswords

This is my second attempt at creating sellwords, a mideval multiplayer rpg
platformer.

## Core Game Mechanics

### Gameplay

4 human-controlled players are involved in each game. At the start of each game,
each player has 1/4 of a key that unlocks some sort of treasure-chest/door/prize.
Upon death, a player drops all keys in his possession which can then be collected
by other players. Once a player has a complete key, he can use it to access the
prize at the end of the level thus winning the round.

In addition to collecting the prize, players collect gold by exploring parts of
the map and defeating AI enemies. In addition to gold, players collect XP by
defeating enemies and winning rounds.

Players can choose from a variety of different classes. Each class has a unique
set of abilities that are available to it and emphasize a particular style of play.

### Item Shop

When not completing quests as decribed above, players can use their ammassed gold
to buy new gear and abilities.

### Skill Tree

XP can be used to level up skills which makes a player's chacter stronger.

## Implementation

Game is heavily event-based.

### Game

- Game state
- Level
- Entities

### Entity

- State
  - Position
  - Velocity
  - Effects
  - Size
  - Attributes

