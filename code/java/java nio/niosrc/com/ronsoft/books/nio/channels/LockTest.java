
package com.ronsoft.books.nio.channels;

import java.nio.ByteBuffer;
import java.nio.IntBuffer;
import java.nio.channels.FileChannel;
import java.nio.channels.FileLock;
import java.io.RandomAccessFile;
import java.util.Random;

/**
 * Test locking with FileChannel.
 * Run one copy of this code with arguments "-w /tmp/locktest.dat"
 * and one or more copies with "-r /tmp/locktest.dat" to see the
 * interactions of exclusive and shared locks.  Note how too many
 * readers can starve out the writer.
 * Note: The filename you provide will be overwritten.  Substitute
 * an appropriate temp filename for your favorite operating system.
 *
 * Created April, 2002
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: LockTest.java,v 1.2 2002/05/19 04:55:45 ron Exp $
 */
public class LockTest
{
	private static final int SIZEOF_INT = 4;
	private static final int INDEX_START = 0;
	private static final int INDEX_COUNT = 10;
	private static final int INDEX_SIZE = INDEX_COUNT * SIZEOF_INT;

	private ByteBuffer buffer = ByteBuffer.allocate (INDEX_SIZE);
	private IntBuffer indexBuffer = buffer.asIntBuffer();
	private Random rand = new Random();

	public static void main (String [] argv)
		throws Exception
	{
		boolean writer = false;
		String filename;

		if (argv.length != 2) {
			System.out.println ("Usage: [ -r | -w ] filename");
			return;
		}

		writer = argv [0].equals ("-w");
		filename = argv [1];

		RandomAccessFile raf = new RandomAccessFile (filename,
			(writer) ? "rw" : "r");
		FileChannel fc = raf.getChannel();

		LockTest lockTest = new LockTest();

		if (writer) {
			lockTest.doUpdates (fc);
		} else {
			lockTest.doQueries (fc);
		}
	}

	// ----------------------------------------------------------------

	// Simulate a series of read-only queries while
	// holding a shared lock on the index area
	void doQueries (FileChannel fc)
		throws Exception
	{
		while (true) {
			println ("trying for shared lock...");
			FileLock lock = fc.lock (INDEX_START, INDEX_SIZE, true);
			int reps = rand.nextInt (60) + 20;

			for (int i = 0; i < reps; i++) {
				int n = rand.nextInt (INDEX_COUNT);
				int position = INDEX_START + (n * SIZEOF_INT);

				buffer.clear();
				fc.read (buffer, position);
				
				int value = indexBuffer.get (n);

				println ("Index entry " + n + "=" + value);

				// Pretend to be doing some work
				Thread.sleep (100);
			}

			lock.release();

			println ("<sleeping>");
			Thread.sleep (rand.nextInt (3000) + 500);
		}
	}

	// Simulate a series of updates to the index area
	// while holding an exclusive lock
	void doUpdates (FileChannel fc)
		throws Exception
	{
		while (true) {
			println ("trying for exclusive lock...");

			FileLock lock = fc.lock (INDEX_START,
				INDEX_SIZE, false);

			updateIndex (fc);

			lock.release();

			println ("<sleeping>");
			Thread.sleep (rand.nextInt (2000) + 500);
		}
	}

	// write new values to the index slots
	private int idxval = 1;

	private void updateIndex (FileChannel fc)
		throws Exception
	{
		// "indexBuffer" is an int view of "buffer"
		indexBuffer.clear();
		
		for (int i = 0; i < INDEX_COUNT; i++) {
			idxval++;
			println ("Updating index " + i + "=" + idxval);

			indexBuffer.put (idxval);

			// Pretend to this is really hard work
			Thread.sleep (500);
		}

		// leaves position and limit correct for whole buffer
		buffer.clear();
		fc.write (buffer, INDEX_START);
	}

	// ----------------------------------------------------------------

	private int lastLineLen = 0;

	// Specialized println which repaints the current line
	private void println (String msg)
	{
		System.out.print ("\r ");
		System.out.print (msg);

		for (int i = msg.length(); i < lastLineLen; i++) {
			System.out.print (" ");
		}

		System.out.print ("\r");
		System.out.flush();
		lastLineLen = msg.length();
	}
}
