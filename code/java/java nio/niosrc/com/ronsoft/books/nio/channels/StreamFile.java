
package com.ronsoft.books.nio.channels;

import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.io.FileInputStream;

/**
 * Test behavior of FileChannel on stream devices.
 * Per MR at Sun, this is officially not supported.
 * FileChannel should not work with non-files, it's
 * a "hole in the spec" and will be closed in the
 * future.
 *
 * @author Ron Hitchens
 * @version $Id: StreamFile.java,v 1.2 2002/05/20 07:24:29 ron Exp $
 */
public class StreamFile
{
	public static void main (String [] argv)
		throws Exception
	{
		String name = "/dev/tty";

		if (argv.length > 0) {
			name = argv [0];
		}

		FileInputStream fis = new FileInputStream (name);
		FileChannel channel = fis.getChannel();

		try {
			System.out.println ("position=" + channel.position());
			System.out.println ("Attempting seek 100");
			channel.position (100);
			System.out.println ("position=" + channel.position());
			System.out.println ("Attempting seek 10");
			channel.position (10);
			System.out.println ("position=" + channel.position());
		} catch (Exception e) {
			System.out.println ("Caught: " + e);
		}

		try {
			System.out.println ("Attempting truncate");
			channel.truncate (100);
		} catch (Exception e) {
			System.out.println ("Caught: " + e);
		}

		try {
			System.out.println ("Attempting force");
			channel.force (true);
		} catch (Exception e) {
			System.out.println ("Caught: " + e);
		}

		try {
			System.out.println ("Attempting size");
			long size = channel.size();
			System.out.println ("size=" + size);
		} catch (Exception e) {
			System.out.println ("Caught: " + e);
		}

		try {
			ByteBuffer bb = ByteBuffer.allocate (10);
			System.out.println ("Attempting rel read");
			int bytes = channel.read (bb);
			System.out.println ("read=" + bytes);
			System.out.println ("Attempting abs read");
			bb.clear();
			bytes = channel.read (bb, 100);
			System.out.println ("read=" + bytes);
		} catch (Exception e) {
			System.out.println ("Caught: " + e);
		}
	}
}
