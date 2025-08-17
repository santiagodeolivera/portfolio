#include "./matrix.h"

#ifdef BOOL_TYPE
	#error BOOL_TYPE already defined
#endif

#define BOOL_TYPE int

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

#undef BOOL_TYPE
