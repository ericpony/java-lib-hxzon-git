
package com.ronsoft.books.nio.buffers;

import java.nio.CharBuffer;

/**
 * Test buffer duplication.
 *
 * Created May 2002
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: BufferDupe.java,v 1.2 2002/05/20 07:24:24 ron Exp $
 */
public class BufferDupe
{
	public static void main (String [] argv)
		throws Exception
	{
		CharBuffer buffer = CharBuffer.wrap ("01234567");

		buffer.position (3).limit (6).mark().position (5);

		CharBuffer dupeBuffer = buffer.duplicate();

		buffer.clear();

		println (buffer);
		println (dupeBuffer);

		dupeBuffer.reset();
		println (dupeBuffer);

		dupeBuffer.clear();
		println (dupeBuffer);
	}

	private static void println (CharBuffer cb)
	{
		System.out.println ("pos=" + cb.position() + ", limit="
			+ cb.limit() + ", capacity=" + cb.capacity()
			+ ": '" + cb + "'");
	}
}
