
package com.ronsoft.books.nio.buffers;

import java.nio.Buffer;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.ByteOrder;

/**
 * Test asCharBuffer view.
 *
 * Created May 2002
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: BufferCharView.java,v 1.2 2002/05/20 07:24:24 ron Exp $
 */
public class BufferCharView
{
	public static void main (String [] argv)
		throws Exception
	{
		ByteBuffer byteBuffer =
			ByteBuffer.allocate (7).order (ByteOrder.BIG_ENDIAN);
		CharBuffer charBuffer = byteBuffer.asCharBuffer();

		// load the ByteBuffer with some bytes
		byteBuffer.put (0, (byte)0);
		byteBuffer.put (1, (byte)'H');
		byteBuffer.put (2, (byte)0);
		byteBuffer.put (3, (byte)'i');
		byteBuffer.put (4, (byte)0);
		byteBuffer.put (5, (byte)'!');
		byteBuffer.put (6, (byte)0);

		println (byteBuffer);
		println (charBuffer);

		// now slice it differently
		byteBuffer.position (4);
		charBuffer = byteBuffer.asCharBuffer();

		println (byteBuffer);
		println (charBuffer);
	}

	// Print info about a buffer
	private static void println (Buffer buffer)
	{
		System.out.println ("pos=" + buffer.position()
			+ ", limit=" + buffer.limit()
			+ ", capacity=" + buffer.capacity()
			+ ": '" + buffer.toString() + "'");
	}
}

