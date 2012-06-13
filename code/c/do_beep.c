void do_beep(BOOL on) {
	int fd;
	char buf[4];
	const char *name="/proc/cpld/beep";
	fd = open(name, O_RDWR );
	if (fd < 0) {
		lprintf("can not open beep file:%s\n", name);
		return;
	}
	if (on) {
		strcpy(buf, "1");
	} else {
		strcpy(buf, "0");
	}
	if (write(fd, buf, 1) < 0) {
		lprintf("can not write beep File:%s\n", name);
	}
	close(fd);
}