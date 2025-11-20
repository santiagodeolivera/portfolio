#include "./matrix.h"

#include "./config.h"

typedef struct {
	Matrix data;
	Matrix backup;
} GameOfLife;

char GameOfLife_new(
	unsigned int width,
	unsigned int height,
	BOOL_TYPE (*func)(unsigned int, unsigned int, void*),
	void *funcCtx,
	GameOfLife *dst
);

void GameOfLife_print(GameOfLife *self);

void GameOfLife_update(GameOfLife *self);

void GameOfLife_destroy(GameOfLife *self);

