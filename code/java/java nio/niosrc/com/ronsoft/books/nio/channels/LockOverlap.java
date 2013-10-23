
package com.ronsoft.books.nio.channels;

import java.nio.ByteBuffer;
import java.nio.IntBuffer;
import java.nio.channels.FileChannel;
import java.nio.channels.FileLock;
import java.io.RandomAccessFile;
import java.util.Random;

/**
 * Test overlapping locks on different file channels.
 *
 * @author Ron Hitchens (ron@ronsoft.com)
 */
public class LockOverlap
{
	public static void main (String [] argv)
		throws Exception
	{
		if (argv.length == 0) {
			System.out.println ("Usage: filename");
			return;
		}

		String filename = argv [0];

		RandomAccessFile raf1 = new RandomAccessFile (filename, "rw");
		FileChannel fc1 = raf1.getChannel();

		RandomAccessFile raf2 = new RandomAccessFile (filename, "rw");
		FileChannel fc2 = raf2.getChannel();

		System.out.println ("Grabbing first lock");
		FileLock lock1 = fc1.lock (0L, Integer.MAX_VALUE, false);

		System.out.println ("Grabbing second lock");
		FileLock lock2 = fc2.lock (5, 10, false);

		System.out.println ("Exiting");
	}
}
