#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "./game_of_life.h"
#include "./game_of_life_from_file.h"

void repeatUntilExit(void (*func)(void*), void* ctx) {
	#ifdef LEN
		#error LEN already defined
	#endif
	#define LEN 6
	
	char buffer[LEN];
	static char expected[LEN] = "exit\n";
	
	while(1) {
		if (fgets(buffer, LEN, stdin) == NULL) return;
		if (strcmp(buffer, expected) == 0) return;
		func(ctx);
	}
	
	#undef LEN
}

int custom_fn1(unsigned int x0, unsigned int y0, void *ctx) {
	int *coords = (int*) ctx;
	int x = -1;
	int y = -1;
	int i = 0;
	
	while (coords[i] != -1) {
		if (x == -1) {
			x = coords[i];
		} else {
			y = coords[i];
			if (x0 == x && y0 == y) return 1;
			x = -1;
			y = -1;
		}
		i++;
	}
	
	return 0;
}

int coords[] = {
	0, 4,
	0, 5,
	1, 4,
	1, 5,
	10, 4,
	10, 5,
	10, 6,
	11, 3,
	11, 7,
	12, 2,
	12, 8,
	13, 2,
	13, 8,
	14, 5,
	15, 3,
	15, 7,
	16, 4,
	16, 5,
	16, 6,
	17, 5,
	20, 2,
	20, 3,
	20, 4,
	21, 2,
	21, 3,
	21, 4,
	22, 1,
	22, 5,
	24, 0,
	24, 1,
	24, 5,
	24, 6,
	34, 2,
	34, 3,
	35, 2,
	35, 3,
	-1 
};

void fn1234(void *ctx) {
	GameOfLife *g = (GameOfLife*) ctx;
	GameOfLife_update(g);
	GameOfLife_print(g);
}

int main() {
	GameOfLife g;
	if (!GameOfLife_fromFile("./input.txt", &g)) {
		fprintf(stderr, "ERROR: GameOfLife could not be created\n");
		return 0;
	}

	GameOfLife_print(&g);
	
	repeatUntilExit(fn1234, &g);
	
	GameOfLife_destroy(&g);
}

/*
int main() {
	GameOfLife g;
	if (!GameOfLife_new(50, 50, custom_fn1, coords, &g)) {
		fprintf(stderr, "ERROR: GameOfLife could not be created\n");
		return 0;
	}
	
	GameOfLife_print(&g);
	
	repeatUntilExit(fn1234, &g);
	
	GameOfLife_destroy(&g);
}
*/
