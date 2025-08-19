# Game of Life in C

This project runs an instance of the [game of life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life), as designed by John Conway in 1970.

## Basics

The Game of Life is a zero-player game within a 2D grid of cells, each of which can be either alive or dead.

There's also an initial configuration, which is the only input someone can give to the system.

The game operates with discreet moments in time, in which the state of the grid of each moment (except the first) depends exclusively on the previous one.

To be precise, the following rules are applied:
* If a cell is alive and has 2 or 3 neighbors, it'll survive. Otherwise, it'll die.
* If a cell is dead and has 3 neighbors, it'll revive. Otherwise, it'll stay dead.

The neighbors of a cell are the eight ones surrounding it.

Depending on the initial configuration, certain [patterns](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Examples_of_patterns) can manifest in the game, one of which is presented via this program.

## How to execute

The program has been developed to work with [gcc](https://gcc.gnu.org/). To be precise, the 14.2.0 version.

This program has the initial configuration hardcoded. Because of this, it cannot be changed without modifying the code.

To compile the program, move all files to the same folder and execute:

```gcc -o <output_file_name> main.c game_of_life.c matrix.c pointer_add.c```

The program outputs the state of the grid in each moment in time through the console, via special characters for implementing graphics in text-based user interfaces.

To advance the grid to the next moment in time, press "Enter".

To end the program, write "exit" (case-sensitive) and press "Enter".

## Other details

The configuration that's encoded in the program is the pattern known as the "gosper glider gun".

## Potential improvements

These are the potential things to improve about the program:
* Allow the initial configuration to be accessed from outside the program.
