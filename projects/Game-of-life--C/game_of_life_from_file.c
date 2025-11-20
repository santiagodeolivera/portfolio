#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <limits.h>
#include "./game_of_life.h"
#include "./game_of_life_reader.h"

#include "./config.h"

static char f1(void* ctx) {
    FILE *fptr = (FILE*) ctx;
    return fgetc(fptr);
}

static MATRIX_INDEX_TYPE get_number(FILE* fptr) {
    char line[256];

    if (fgets(line, sizeof(line), fptr) == NULL) {
        return 0;
    }

    line[strlen(line) - 1] = '\0';
    if (line[strlen(line) - 1] == '\r') {
        line[strlen(line) - 1] = '\0';
    }

    char* endptr;
    long int result = strtol(line, &endptr, 10);

    if (*endptr != '\0') {
        return 0;
    }

    // Change if MATRIX_INDEX_TYPE changes
    if (result < 0 || result > UINT_MAX) {
        return 0;
    }

    return (MATRIX_INDEX_TYPE) result;
}

char GameOfLife_fromFile(
    char *filename,
    GameOfLife *dst
) {
    FILE *fptr = fopen(filename, "r");
    if (!fptr) {
        return 0;
    }

    MATRIX_INDEX_TYPE width = get_number(fptr);
    if (width == 0) {
        fclose(fptr);
        return 0;
    }

    MATRIX_INDEX_TYPE height = get_number(fptr);
    if (height == 0) {
        fclose(fptr);
        return 0;
    }

    GameOfLife_Reader reader;
    if (!GameOfLife_Reader_new(width, height, f1, fptr, &reader)) {
        fclose(fptr);
        return 0;
    }

    if (!GameOfLife_Reader_read(&reader, dst)) {
        fclose(fptr);
        return 0;
    }

    fclose(fptr);
    return 1;
}
