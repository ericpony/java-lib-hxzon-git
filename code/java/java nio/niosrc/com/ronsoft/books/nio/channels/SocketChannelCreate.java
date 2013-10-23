
package com.ronsoft.books.nio.channels;

import java.net.*;
import java.nio.channels.*;
import java.io.IOException;

/**
 * Test creation of SocketChannels.
 * Created and tested: Dec 31, 2001
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: SocketChannelCreate.java,v 1.1 2002/01/22 21:09:28 ron Exp $
 */
public class SocketChannelCreate
{
	public static void main (String [] argv)
		throws IOException
	{
		SocketChannel sc;
		Socket sock;

		sc = SocketChannel.open();
		sock = sc.socket();

		print ("SocketChannel.open()", sc, sock);

		sock = new Socket();
		sc = sock.getChannel();

		print ("SocketChannel.open()", sc, sock);
	}

	private static void print (String msg, SocketChannel sc, Socket sock)
	{
		boolean hasChannel = (sc != null);
		boolean hasSocket = (sock != null);

		System.out.println (msg + ": channel=" + hasChannel
			+ ", socket=" + hasSocket);
	}
}
