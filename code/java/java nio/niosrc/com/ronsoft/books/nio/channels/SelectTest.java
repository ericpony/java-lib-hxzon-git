
package com.ronsoft.books.nio.channels;

import java.nio.ByteBuffer;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.nio.channels.Selector;
import java.nio.channels.SelectionKey;
import java.nio.channels.SelectableChannel;

import java.net.Socket;
import java.net.ServerSocket;
import java.net.InetSocketAddress;
import java.util.Iterator;

/**
 * Test select return value.
 * Start this server, then connect to port 1234.  The incoming
 * connection will be registered with the selector but never read.
 * Type something on the conection, the selector will see the channel
 * ready but the channel is never serviced in the loop.  Select will
 * return 1 forever after.
 *
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: SelectTest.java,v 1.1 2002/05/20 07:24:29 ron Exp $
 */
public class SelectTest
{
	public static int PORT_NUMBER = 1234;

	public static void main (String [] argv)
		throws Exception
	{
		ServerSocketChannel ssc = ServerSocketChannel.open();
		Selector selector = Selector.open();

		ssc.socket().bind (new InetSocketAddress (PORT_NUMBER));
		ssc.configureBlocking (false);
		ssc.register (selector, SelectionKey.OP_ACCEPT);

		while (true) {
			int n = selector.select (1000);

			System.out.println ("selector returns: " + n);

			Iterator it = selector.selectedKeys().iterator();

			while (it.hasNext()) {
				SelectionKey key = (SelectionKey) it.next();

				// Is a new connection coming in?
				if (key.isAcceptable()) {
					ServerSocketChannel server =
						(ServerSocketChannel) key.channel();
					SocketChannel channel = server.accept();

					// set the new channel non-blocking
					channel.configureBlocking (false);

					// register it with the selector
					channel.register (selector,
						SelectionKey.OP_READ);

					it.remove();
				}

				// is there data to read on this channel?
				if (key.isReadable()) {
					System.out.println ("Channel is readable");
					// don't actually do anything
				}

				// it.remove();
			}
		}
	}
}
