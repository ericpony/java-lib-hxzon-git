
package com.ronsoft.books.nio.buffers;

import java.nio.CharBuffer;

/**
 * Test buffer slice.
 *
 * Created May 2002
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: BufferSlice.java,v 1.1 2002/05/09 01:38:13 ron Exp $
 */
public class BufferSlice
{
	public static void main (String [] argv)
		throws Exception
	{
		CharBuffer buffer = CharBuffer.allocate (8);
		buffer.position (3).limit (5);
		CharBuffer sliceBuffer = buffer.slice();

		println (buffer);
		println (sliceBuffer);

		char [] myBuffer = new char [100];
		CharBuffer cb = CharBuffer.wrap (myBuffer);

		cb.position(12).limit(21);

		CharBuffer sliced = cb.slice();

		println (cb);
		println (sliced);
	}

	private static void println (CharBuffer cb)
	{
		System.out.println ("pos=" + cb.position() + ", limit="
			+ cb.limit() + ", capacity=" + cb.capacity()
			+ ", arrayOffset=" + cb.arrayOffset());
	}
}
