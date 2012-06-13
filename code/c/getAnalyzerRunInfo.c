void getAnalyzerRunInfo(void) {
	AnalyzerRunInfo *prunInfo = &analyzerInfo;
	get_analyzer_version(prunInfo->version,19);

  char *s;
	char *start;
	char startTimeStr[64];
	char tmp[1024];
	memset(startTimeStr, 0, sizeof(startTimeStr));
	prunInfo->isRunning = FALSE;
	//ps -eo pid,cmd,lstart
	FILE *file = popen("ps -eo lstart,cmd", "r");
	if (file == NULL) {
		return;
	}
	//Mon Mar 28 17:26:56 2011 /ptswitch/analyzer-linux_64 -d
	//Tue May  4 03:31:33 2010
	char *token;
	while ((s = fgets(tmp, sizeof(tmp), file))) {
		token = strtok(tmp, "\n");
		while (token != NULL) {
			start = strstr(token, "analyzer");
			if (start) {
				strncpy(startTimeStr, token, start - tmp);
				prunInfo->isRunning = TRUE;
				break;
			}
			token = strtok(NULL, "\n");
		}
	}
	pclose(file);
	sprintf(prunInfo->startTime, trim(startTimeStr));
//	printf("hxzon debug,start time=%s\n",prunInfo->startTime);
	struct tm startTimeInfo;
	parseTime(prunInfo->startTime, &startTimeInfo);
	long startTime = mktime(&startTimeInfo);
	time_t t;
	time(&t);
	long span = t - startTime;
	//	printf("span time = %d\n",span);
	span = span / (3600);
//	printf("span time = %ld hour \n",span);
	prunInfo->dayDuration = span / 24;
	prunInfo->hourDuration = span % 24;
	strftime(prunInfo->startTime, 50, "%Y-%m-%d  %H:%M:%S\n", &startTimeInfo);
}