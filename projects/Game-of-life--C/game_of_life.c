#include <stdio.h>
#include "./matrix.h"

#ifdef BOOL_TYPE
	#error BOOL_TYPE already defined
#endif

#define BOOL_TYPE int

typedef struct {
	Matrix data;
	Matrix backup;
} GameOfLife;

typedef BOOL_TYPE (*MatrixCellsSetFn)(unsigned int, unsigned int, void*);

typedef struct {
	MatrixCellsSetFn func;
	void *ctx;
} MatrixSetFn_ctx;

static void fn1(unsigned int x, unsigned int y, void *dst, void *ctx) {
	MatrixSetFn_ctx *ctx0 = (MatrixSetFn_ctx*) ctx;
	MatrixCellsSetFn func = ctx0->func;
	void *funcCtx = ctx0->ctx;
	
	BOOL_TYPE result = func(x, y, funcCtx);
	
	*((BOOL_TYPE*) dst) = result;
}

static void fn2(unsigned int x, unsigned int y, void* dst, void* ctx) {
	*((BOOL_TYPE*) dst) = (BOOL_TYPE) 0;
}

char GameOfLife_new(
	unsigned int width,
	unsigned int height,
	MatrixCellsSetFn func,
	void *funcCtx,
	GameOfLife *dst
) {
	#ifdef MATRIX_SET_1234
		#error MATRIX_SET_1234 already defined
	#endif
	
	#define MATRIX_SET_1234(name, func, ctx) \
		Matrix name; \
		if (!Matrix_new(sizeof(BOOL_TYPE), width, height, func, ctx, &name)) { \
			return 0; \
		}
	
	MatrixSetFn_ctx closure = {
		.func = func, .ctx = funcCtx
	};
	
	MATRIX_SET_1234(data, fn1, &closure);
	MATRIX_SET_1234(backup, fn2, NULL);
	
	#undef MATRIX_SET_1234
	
	*dst = (GameOfLife) { .data = data, .backup = backup };
	return 1;
}

static void fn3(unsigned int x, unsigned int y, void *src, void *ctx) {
	unsigned int widthMinus1 = *((unsigned int*) ctx);
	
	BOOL_TYPE value = *((BOOL_TYPE*) src);
	char* charToPrint = value ? "█" : " ";
	
	if (x == 0)
		printf("\n│%s%s", charToPrint, charToPrint);
	else if (x == widthMinus1)
		printf("%s%s│", charToPrint, charToPrint);
	else
		printf("%s%s", charToPrint, charToPrint);
}

void GameOfLife_print(GameOfLife *self) {
	unsigned int width = self->data.width;
	unsigned int widthMinus1 = width - 1;
	
	printf("┌");
	for (unsigned int i = 0; i < width; i++)
		printf("──");
	printf("┐");
	
	Matrix_iterate(&self->data, fn3, &widthMinus1);
	
	printf("\n└");
	for (unsigned int i = 0; i < width; i++)
		printf("──");
	printf("┘\n");
}

static BOOL_TYPE charAt(Matrix *data, unsigned int x, unsigned int y) {
	void *p = Matrix_at(data, x, y);
	return *((BOOL_TYPE*) p);
}

static int private_countNeighbors(Matrix *data, unsigned int x, unsigned int y) {
	unsigned int width = data->width;
	unsigned int height = data->height;
	
	int res = 0;
	
	if (x > 0) {
		if (y > 0          && charAt(data, x-1, y-1)) res++;
		if (                  charAt(data, x-1, y)) res++;
		if (y < height - 1 && charAt(data, x-1, y+1)) res++;
	}
	
	if (y > 0          && charAt(data, x, y-1)) res++;
	if (y < height - 1 && charAt(data, x, y+1)) res++;

	if (x < width - 1) {
		if (y > 0          && charAt(data, x+1, y-1)) res++;
		if (                  charAt(data, x+1, y)) res++;
		if (y < height - 1 && charAt(data, x+1, y+1)) res++;
	}
	
	return res;
}

static BOOL_TYPE fn4(int neighbors, BOOL_TYPE isAlive) {
	return (BOOL_TYPE) (neighbors == 3 || isAlive && neighbors == 2);
}

static void fn5(unsigned int x, unsigned int y, void *p, void *ctx) {
	GameOfLife *self = (GameOfLife*) ctx;
	Matrix *data = &self->data;
	Matrix *backup = &self->backup;
	
	int neighbors = private_countNeighbors(data, x, y);
	BOOL_TYPE isAlive = *((BOOL_TYPE*) p);
	
	*((BOOL_TYPE*) Matrix_at(backup, x, y)) = fn4(neighbors, isAlive);
}

void GameOfLife_update(GameOfLife *self) {
	Matrix_iterate(&self->data, fn5, self);
	
	Matrix data = self->data;
	self->data = self->backup;
	self->backup = data;
}

void GameOfLife_destroy(GameOfLife *self) {
	Matrix_destroy(&self->data);
	Matrix_destroy(&self->backup);
}

#undef BOOL_TYPE
