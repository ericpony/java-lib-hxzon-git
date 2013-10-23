
package com.ronsoft.books.nio.channels;

import java.nio.channels.SocketChannel;
import java.net.InetSocketAddress;

/**
 * Demonstrate asynchronous connection of a SocketChannel.
 *
 * Created: April 2002
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: ConnectAsync.java,v 1.2 2002/04/28 01:47:58 ron Exp $
 */
public class ConnectAsync
{
	public static void main (String [] argv)
		throws Exception
	{
		String host = "localhost";
		int port = 80;

		if (argv.length == 2) {
			host = argv [0];
			port = Integer.parseInt (argv [1]);
		}

		InetSocketAddress addr = new InetSocketAddress (host, port);
		SocketChannel sc = SocketChannel.open();

		sc.configureBlocking (false);

		System.out.println ("initiating connection");

		sc.connect (addr);

		while ( ! sc.finishConnect()) {
			doSomethingUseful();
		}

		System.out.println ("connection established");

		// Do something with the connected socket
		// The SocketChannel is still non-blocking

		sc.close();
	}

	private static void doSomethingUseful()
	{
		System.out.println ("doing something useless");
	}
}
