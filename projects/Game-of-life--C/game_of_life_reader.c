#include <stdio.h>
#include "./game_of_life.h"
#include "./matrix.h"

#include "./config.h"

typedef char (*CharFunc)(void*);

typedef struct {
    MATRIX_INDEX_TYPE width;
    MATRIX_INDEX_TYPE height;
    CharFunc charFunc;
    void *ctx;
} GameOfLife_Reader;

char GameOfLife_Reader_new(
    MATRIX_INDEX_TYPE width,
    MATRIX_INDEX_TYPE height,
    CharFunc charFunc,
    void *ctx,
    GameOfLife_Reader *dst
) {
    dst->width = width;
    dst->height = height;
    dst->charFunc = charFunc;
    dst->ctx = ctx;
    return 1;
}

static void fn1(MATRIX_INDEX_TYPE x, MATRIX_INDEX_TYPE y, void* dst, void* ctx) {
	*((BOOL_TYPE*) dst) = (BOOL_TYPE) 0;
}

char GameOfLife_Reader_read(GameOfLife_Reader *self, GameOfLife *dst) {
    Matrix matrix;
    if (!Matrix_new(sizeof(BOOL_TYPE), self->width, self->height, fn1, NULL, &matrix)) {
        return 0;
    }

    MATRIX_INDEX_TYPE x = 0;
    MATRIX_INDEX_TYPE y = 0;
    while(1) {
        char newChar = (self->charFunc)(self->ctx);
        if (newChar == '.') {
            BOOL_TYPE *pointer = (BOOL_TYPE*) Matrix_at(&matrix, x, y);
            if (pointer != NULL) *pointer = 1;
            x += 1;
        } else if (newChar == ' ') {
            x += 1;
        } else if (newChar == '\n') {
            x = 0;
            y += 1;
        } else if (newChar == EOF) {
            break;
        }
    }

    if (!GameOfLife_fromMatrix(matrix, dst)) {
        return 0;
    }

    return 1;
}
