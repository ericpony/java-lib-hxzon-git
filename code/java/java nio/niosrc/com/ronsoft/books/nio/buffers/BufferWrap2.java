
package com.ronsoft.books.nio.buffers;

import java.nio.CharBuffer;

public class BufferWrap2
{
	public static void main (String [] argv)
		throws Exception
	{
		char [] chars = new char [60];

		CharBuffer cb = CharBuffer.wrap (chars, 12, 42);

		System.out.println ("pos=" + cb.position() + ", limit=" + cb.limit() + ", cap=" + cb.capacity());

		cb.put ("This is a test String");

		cb.flip();

		System.out.println ("pos=" + cb.position() + ", limit=" + cb.limit() + ", cap=" + cb.capacity());

		cb.clear();

		cb.put ("Foobar");

		System.out.println ("pos=" + cb.position() + ", limit=" + cb.limit() + ", cap=" + cb.capacity());

		for (int i = 0; i < 20; i++) {
			System.out.println ("[" + i + "] = " + chars [i]);
		}
	}
}
