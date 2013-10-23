
package com.ronsoft.books.nio.buffers;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;

/**
 * Test views of long elements in a ByteBuffer.
 *
 * Created May 2002
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: BufferLongView.java,v 1.2 2002/05/16 01:45:44 ron Exp $
 */
public class BufferLongView
{
	public static void main (String [] argv)
		throws Exception
	{
		ByteBuffer bb = ByteBuffer.allocate (20);

		bb.put ((byte)0x07);
		bb.put ((byte)0x3b);
		bb.put ((byte)0xc5);
		bb.put ((byte)0x31);
		bb.put ((byte)0x5e);
		bb.put ((byte)0x94);
		bb.put ((byte)0xd6);
		bb.put ((byte)0x04);

		bb.position (1).limit(5);
		bb.mark();

		int value;

		value = bb.order (ByteOrder.BIG_ENDIAN).getInt();

		System.out.println ("" + bb.order().toString() + ": "
			+ Integer.toHexString (value));

		bb.reset();

		value = bb.order (ByteOrder.LITTLE_ENDIAN).getInt();

		System.out.println ("" + bb.order().toString() + ": "
			+ Integer.toHexString (value));

		bb.reset();

		System.out.println ("Expect an exception here");
		System.out.println ("" + bb.order().toString() + ": "
			+ bb.getLong());
	}
}

