#include <stddef.h>
#include <string.h>
#include <stdlib.h>
#include "pointer_add.h"

#include "./config.h"

typedef struct {
	void *space;
	size_t elemSize;
	MATRIX_INDEX_TYPE width;
	MATRIX_INDEX_TYPE height;
} Matrix;

void* Matrix_at_unsafe(Matrix *self, MATRIX_INDEX_TYPE x, MATRIX_INDEX_TYPE y) {
	return pointer_add(self->space, self->elemSize * (x + y * self->width));
}

void* Matrix_at(Matrix *self, MATRIX_INDEX_TYPE x, MATRIX_INDEX_TYPE y) {
	if (x >= self->width || y >= self->height) return NULL;
	return Matrix_at_unsafe(self, x, y);
}

char Matrix_new(
	size_t elemSize,
	MATRIX_INDEX_TYPE width,
	MATRIX_INDEX_TYPE height,
	void (*func)(MATRIX_INDEX_TYPE, MATRIX_INDEX_TYPE, void*, void*),
	void* funcCtx,
	Matrix *dst
) {
	void *space = malloc(elemSize * width * height);
	if (space == NULL) {
		return 0;
	}
	
	Matrix result = {
		.space = space,
		.elemSize = elemSize,
		.width = width,
		.height = height
	};
	
	for (MATRIX_INDEX_TYPE y = 0; y < height; y++)
		for (MATRIX_INDEX_TYPE x = 0; x < width; x++)
			func(x, y, Matrix_at_unsafe(&result, x, y), funcCtx);
	
	*dst = result;
	return 1;
}

void Matrix_clone_func(MATRIX_INDEX_TYPE x, MATRIX_INDEX_TYPE y, void *p, void* ctx) {
	Matrix *self = (Matrix*) ctx;
	memmove(p, Matrix_at_unsafe(self, x, y), self->elemSize);
}

char Matrix_clone(Matrix *self, Matrix *dst) {
	size_t elemSize = self->elemSize;
	MATRIX_INDEX_TYPE width = self->width;
	MATRIX_INDEX_TYPE height = self->height;
	
	return Matrix_new(elemSize, width, height, Matrix_clone_func, (void*) self, dst);
}

void Matrix_iterate(Matrix *self, void (*func)(MATRIX_INDEX_TYPE, MATRIX_INDEX_TYPE, void*, void*), void *funcCtx) {
	void *space = self->space;
	size_t elemSize = self->elemSize;
	MATRIX_INDEX_TYPE width = self->width;
	MATRIX_INDEX_TYPE height = self->height;
	
	for (MATRIX_INDEX_TYPE y = 0; y < height; y++)
		for (MATRIX_INDEX_TYPE x = 0; x < width; x++)
			func(x, y, Matrix_at_unsafe(self, x, y), funcCtx);
}

void Matrix_destroy(Matrix *self) {
	free(self->space);
}
