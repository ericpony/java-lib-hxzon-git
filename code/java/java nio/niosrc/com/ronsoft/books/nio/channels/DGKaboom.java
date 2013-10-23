
package com.ronsoft.books.nio.channels;

import java.nio.ByteBuffer;
import java.nio.channels.DatagramChannel;
import java.net.SocketAddress;
import java.net.InetSocketAddress;
import java.net.InetAddress;

/**
 * Tickle DatagramChannel send() bug.  Attempting to send a datagram
 * to a SocketAddress which does not resolve to a real address causes
 * the JVM to crash (tested on linux and solaris 8).
 *
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: DGKaboom.java,v 1.2 2002/04/25 23:26:55 ron Exp $
 */
public class DGKaboom
{
	// first arg, if present, is host name to send to.
	// second arg, if present, is port number to send to
	public static void main (String [] argv)
		throws Exception
	{
		String host = "foo.bar";
		int port = 37;

		if (argv.length > 0) {
			host = argv [0];
		}

		if (argv.length > 1) {
			port = Integer.parseInt (argv [1]);
		}

		DatagramChannel dc = DatagramChannel.open();
		ByteBuffer bb = ByteBuffer.allocate (4);
		InetSocketAddress sa = new InetSocketAddress (host, port);
		InetAddress inetaddr = sa.getAddress();

		if (inetaddr == null) {
			System.out.println ("No address resolved for " + host);
		} else {
			System.out.println ("Address of " + host
				+ " is " + inetaddr);
		}

		System.out.println ("Attempting send to " + sa);

		// if sa does not resolve to an address, kablooey
		dc.send (bb, sa);

		System.out.println ("Sent OK");

		dc.close();
	}
}
