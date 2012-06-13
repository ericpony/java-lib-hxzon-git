int get_analyzer_version(char *version, int len) {
	//    strcpy(version,"V6.2.1");
	//    return 0;
	char line[128];
	FILE *file;
	char *start_ptr;
	char *end_ptr;
	char *start_key = "Analyzer-";
	char *end_key = " start";
	file = fopen("/dev/shm/analyzer_statistics", "r");
	if (file == NULL) {
		return 0;
	}
	while (fgets(line, sizeof(line), file)) {
		if ((start_ptr = strstr(line, start_key)) != NULL) {
			start_ptr += strlen(start_key)-1;
			start_ptr[0]='V';
			if ((end_ptr = strstr(line, end_key)) != NULL) {
				end_ptr[0] = 0;
				strcpy(version, start_ptr);
				printf("line=%s,version=%s\n", start_ptr, version);
				break;
			}
		}
	}
	fclose(file);
	return 0;
}