#!/bin/sh

class() {
	echo "<class name=\"$1\">"
	echo "	<desc><classname>$1</classname> is thrown when</desc>"
	echo "</class>"
	echo ""
}

for i in $* ; do
	class $i
done
