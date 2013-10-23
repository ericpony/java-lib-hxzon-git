
package com.ronsoft.books.nio.channels;

import java.nio.ByteBuffer;
import java.nio.channels.Selector;
import java.nio.channels.SelectionKey;
import java.nio.channels.SelectableChannel;
import java.nio.channels.ReadableByteChannel;
import java.util.Iterator;

public class TestStdin
{
	public static void main (String [] argv)
		throws Exception
	{
		Selector selector = Selector.open();
		SystemInPipe stdinPipe = new SystemInPipe();
		SelectableChannel stdin = stdinPipe.getStdinChannel();
		ByteBuffer buffer = ByteBuffer.allocate (32);

		stdin.register (selector, SelectionKey.OP_READ);
		stdinPipe.start();

		System.out.println ("Entering select(), type something:");

		while (true) {
			selector.select (2000);

			Iterator it = selector.selectedKeys().iterator();

			if ( ! it.hasNext()) {
				System.out.println ("I'm waiting");
				continue;
			}

			SelectionKey key = (SelectionKey) it.next();

			it.remove();
			buffer.clear();

			ReadableByteChannel channel =
				(ReadableByteChannel) key.channel();
			int count = channel.read (buffer);

			if (count < 0) {
				System.out.println ("EOF, bye");

				channel.close();
				break;
			}

			buffer.flip();

			System.out.println ("Hey, read " + count + " chars:");

			while (buffer.hasRemaining()) {
				System.out.print ((char) buffer.get());
			}

			System.out.println();
		}
		
	}
}
