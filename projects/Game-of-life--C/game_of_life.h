#include "./matrix.h"

#include "./config.h"

typedef struct {
	Matrix data;
	Matrix backup;
} GameOfLife;

char GameOfLife_new(
	MATRIX_INDEX_TYPE width,
	MATRIX_INDEX_TYPE height,
	BOOL_TYPE (*func)(MATRIX_INDEX_TYPE, MATRIX_INDEX_TYPE, void*),
	void *funcCtx,
	GameOfLife *dst
);

void GameOfLife_print(GameOfLife *self);

void GameOfLife_update(GameOfLife *self);

void GameOfLife_destroy(GameOfLife *self);

