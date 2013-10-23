
package com.ronsoft.books.nio.buffers;

import java.nio.CharBuffer;

public class BufferWrap
{
	public static void main (String [] argv)
		throws Exception
	{
		CharBuffer cb = CharBuffer.allocate (100);

		cb.put ("This is a test String");

		cb.flip();

		System.out.println ("hasArray() = " + cb.hasArray());

		char [] carray = cb.array();

		System.out.print ("array=");

		for (int i = 0; i < carray.length; i++) {
			System.out.print (carray [i]);
		}

		System.out.println ("");
		System.out.flush();
	}
}
