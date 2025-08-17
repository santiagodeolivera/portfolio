#ifdef DEF_POINTER_ADD
	#error POINTER_ADD already defined
#endif

#define DEF_POINTER_ADD(name, type) \
	void* name(void *prev, type dx) { \
		return (void*) ((char*) prev + dx); \
	}

DEF_POINTER_ADD(pointer_add, unsigned int)

#undef DEF_POINTER_ADD
