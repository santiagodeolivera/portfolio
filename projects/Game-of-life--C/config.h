#pragma once

#ifdef BOOL_TYPE
	#error BOOL_TYPE already defined
#endif

#define BOOL_TYPE int

#ifdef MATRIX_INDEX_TYPE
	#error MATRIX_INDEX_TYPE already defined
#endif

#define MATRIX_INDEX_TYPE unsigned int
