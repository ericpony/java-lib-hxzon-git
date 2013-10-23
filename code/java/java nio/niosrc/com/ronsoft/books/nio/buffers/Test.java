
package com.ronsoft.books.nio.buffers;

import java.nio.Buffer;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;

public class Test
{
	public static void main (String argv[])
	{
		ByteBuffer bb = ByteBuffer.allocate (100);

		bb.mark();
		bb.position(5);
		bb.reset();

		bb.mark().position(5).reset();

		char [] myBuffer = new char [100];

		CharBuffer cb = CharBuffer.wrap (myBuffer);
		cb.position(12).limit(21);

		CharBuffer sliced = cb.slice();

		System.out.println ("Sliced: offset=" + sliced.arrayOffset()
			+ ", capacity=" + sliced.capacity());
	}
}
