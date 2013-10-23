
package com.ronsoft.books.nio.buffers;

import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.io.RandomAccessFile;

public class BufferMap
{
	public static void main (String [] argv)
		throws Exception
	{
		if (argv.length < 1) {
			System.out.println ("Need a file name");
			return;
		}

		RandomAccessFile raf = new RandomAccessFile (argv [0], "r");
		FileChannel fc = raf.getChannel();
		MappedByteBuffer buffer = fc.map (
			FileChannel.MapMode.READ_ONLY, 0, fc.size());

		buffer.clear();
		buffer.flip();

		System.out.println ("hasArray=" + buffer.hasArray());
		System.out.println (buffer.toString());

		System.out.flush();
	}
}
