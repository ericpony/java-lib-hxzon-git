
package com.ronsoft.books.nio.channels;

import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.io.File;
import java.io.RandomAccessFile;
import java.io.IOException;

/**
 * Create a file with holes in it.
 *
 * Created April 2002
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: FileHole.java,v 1.2 2002/05/19 04:55:45 ron Exp $
 */
public class FileHole
{
	public static void main (String [] argv)
		throws IOException
	{
		// create a temp file, open for writing and get a FileChannel
		File temp = File.createTempFile ("holy", null);
		RandomAccessFile file = new RandomAccessFile (temp, "rw");
		FileChannel channel = file.getChannel();
		// create a working buffer
		ByteBuffer byteBuffer = ByteBuffer.allocateDirect (100);

		putData (0, byteBuffer, channel);
		putData (5000000, byteBuffer, channel);
		putData (50000, byteBuffer, channel);

		// Size will report the largest position written, but
		// there are two holes in this file.  This file will
		// not consume 5MB on disk (unless the filesystem is
		// extremely brain-damaged).
		System.out.println ("Wrote temp file '" + temp.getPath()
			+ "', size=" + channel.size());

		channel.close();
		file.close();
	}

	private static void putData (int position, ByteBuffer buffer,
		FileChannel channel)
		throws IOException
	{
		String string = "*<-- location " + position;

		buffer.clear();
		buffer.put (string.getBytes ("US-ASCII"));
		buffer.flip();

		channel.position (position);
		channel.write (buffer);
	}
}
