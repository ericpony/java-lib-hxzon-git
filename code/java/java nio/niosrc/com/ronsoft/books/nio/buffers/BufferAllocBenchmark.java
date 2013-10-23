
package com.ronsoft.books.nio.buffers;

import java.nio.*;
import java.nio.channels.*;
import java.io.IOException;


public class BufferAllocBenchmark
{
	public static long doAlloc (int size, int count, boolean direct)
	{
		long start = System.currentTimeMillis();

		for (int i = 0; i < count; i++)  {
			ByteBuffer buf;

			if (direct) {
				buf = ByteBuffer.allocateDirect (size * 1024);
			} else {
				buf = ByteBuffer.allocate (size * 1024);
			}

		}

		return (System.currentTimeMillis() - start);
	}

	public static long [] doLoop (int count, boolean direct)
	{
		long [] times = new long [count];

		for (int i = 0; i < times.length; i++) {
			times [i] = doAlloc (i * 8, 100, direct);
//			System.gc();
		}

		return (times);
	}

	public static void printResults (long [] nonDirect, long [] direct)
	{
		System.out.println ("Size\talloc\tallocDirect");

		for (int i = 0; i < nonDirect.length; i++) {
			System.out.println ("" + ((i + 1) * 8) + "\t"
				+ nonDirect [i] + "\t" + direct [i]);
		}
	}

	public static void main (String [] argv)
		throws IOException
	{
		long [] nonDirect;
		long [] direct;

		System.out.println ("Pre-running");
		doLoop (2, false);
		doLoop (2, true);

		System.gc();
		System.out.println ("allocating non-direct buffers");
		nonDirect = doLoop (25, false);

		System.gc();
		System.out.println ("allocating direct buffers");
		direct = doLoop (25, true);

		System.gc();
		System.out.println ("done");
		printResults (nonDirect, direct);
        }
}
