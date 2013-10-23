
package com.ronsoft.books.nio.buffers;

import java.nio.CharBuffer;

/**
 * Test the effects of buffer flipping.
 *
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: BufferFlip.java,v 1.1 2002/05/08 02:41:20 ron Exp $
 */
public class BufferFlip
{
	public static void main (String [] argv)
		throws Exception
	{
		CharBuffer cb = CharBuffer.allocate (15);

		cb.put ("Hello World");
		println (cb);

		cb.flip();
		println (cb);

		cb.flip();
		println (cb);

		cb.flip();
		println (cb);
	}

	private static void println (CharBuffer cb)
	{
		System.out.println ("pos=" + cb.position() + ", limit="
			+ cb.limit() + ": '" + cb + "'");
	}
}
