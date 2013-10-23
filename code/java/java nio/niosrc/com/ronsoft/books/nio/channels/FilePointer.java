
package com.ronsoft.books.nio.channels;

import java.nio.channels.FileChannel;
import java.io.RandomAccessFile;
import java.io.IOException;


/**
 * Test file pointer manipulation between FileChannel and RandomAccessFile
 * objects.
 *
 * Created Feb 2002
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: FilePointer.java,v 1.1 2002/02/20 03:16:33 ron Exp $
 */
public class FilePointer
{
	public static void main (String [] argv)
		throws IOException
	{
		RandomAccessFile randomAccessFile = new RandomAccessFile (argv [0], "r");

		randomAccessFile.seek (1000);

		FileChannel fileChannel = randomAccessFile.getChannel();

		// This will print "1000"
		System.out.println ("file pos: " + fileChannel.position());

		randomAccessFile.seek (500);

		// This will print "500"
		System.out.println ("file pos: " + fileChannel.position());

		fileChannel.position (200);

		// This will print "200"
		System.out.println ("file pos: " + randomAccessFile.getFilePointer());
	}
}
