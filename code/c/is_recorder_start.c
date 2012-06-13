int is_recorder_start()
{
    char line[128];
    FILE *file;
    char *key_ptr;
    int started = 0;
    char *key = "record_start";
    file = fopen("/dev/shm/analyzer_statistics","r");
    if(file == NULL){
        return 0;
    }
    while(fgets(line,sizeof(line),file)){
        if((key_ptr = strstr(line,key)) != NULL){
            started = strtol(key_ptr + strlen(key) + 1,NULL,0);
//            printf("line=%s,started=%d\n",line,started);
            break;
        }
    }
    fclose(file);
    return started;
}