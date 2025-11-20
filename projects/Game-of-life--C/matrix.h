#pragma once

#include <stddef.h>

#include "./config.h"

typedef struct {
	void *space;
	size_t elemSize;
	MATRIX_INDEX_TYPE width;
	MATRIX_INDEX_TYPE height;
} Matrix;

void* Matrix_at(Matrix *self, MATRIX_INDEX_TYPE x, MATRIX_INDEX_TYPE y);

char Matrix_new(
	size_t elemSize,
	MATRIX_INDEX_TYPE width,
	MATRIX_INDEX_TYPE height,
	void (*func)(MATRIX_INDEX_TYPE, MATRIX_INDEX_TYPE, void*, void*),
	void* funcCtx,
	Matrix *dst
);

char Matrix_clone(Matrix *self, Matrix *dst);

void Matrix_iterate(Matrix *self, void (*func)(MATRIX_INDEX_TYPE, MATRIX_INDEX_TYPE, void*, void*), void *funcCtx);

void Matrix_destroy(Matrix *self);
