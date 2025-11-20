#pragma once

#include "./game_of_life.h"

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
);

char GameOfLife_Reader_read(GameOfLife_Reader *self, GameOfLife *dst);
