#ifdef DEF_POINTER_ADD
	#error DEF_POINTER_ADD already defined
#endif

#define DEF_POINTER_ADD(name, type) \
	void* name(void *prev, type dx);

DEF_POINTER_ADD(pointer_add, unsigned int)

#undef DEF_POINTER_ADD
