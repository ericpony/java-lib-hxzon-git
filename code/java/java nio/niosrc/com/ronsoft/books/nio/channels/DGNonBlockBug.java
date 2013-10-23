
package com.ronsoft.books.nio.channels;

import java.nio.ByteBuffer;
import java.nio.channels.DatagramChannel;
import java.net.SocketAddress;
import java.net.InetSocketAddress;

/**
 * Test non-blocking DatagramChannel bug.
 * Sends one datagram to the "time" service on port 37 with a non-blocking
 * DatagramChannel.  Then loops for a while receiving datagrams.  The
 * first to arrive is the expected reply.  Thereafter, the same address
 * will be returned forever (or until another real datagram arrives)
 * but no data will be transferred into the buffer.
 * The channel behaves the same way if placed in non-blocking before
 * the initial datagram is sent or after.
 *
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: DGNonBlockBug.java,v 1.1 2002/04/28 20:52:17 ron Exp $
 */
public class DGNonBlockBug
{
	public static void main (String [] argv)
		throws Exception
	{
		String target = "time.nist.gov";

		if (argv.length > 0) {
			target = argv [0];
		}

		ByteBuffer buffer = ByteBuffer.allocate (4);
		buffer.flip();		// make it empty (RFC 868)

		DatagramChannel channel = DatagramChannel.open();;
		channel.configureBlocking (false);

		channel.send (buffer, new InetSocketAddress (target, 37));

		System.out.println ("Sent one Datagram to " + target);

		// would potentially loop forever
		for (int i = 0; i < 10; i++) {
			buffer.clear();
			buffer.putInt (0, 0);

			SocketAddress sa = channel.receive (buffer);

			if (sa == null) {
				System.out.println ("no datagram ready, "
					+ "sleeping one second");
				Thread.sleep (1000);
			} else {
				int value = buffer.getInt (0);
				buffer.flip();
				System.out.println ("Received datagram from "
					+ sa + ": " + buffer + ", value="
					+ Integer.toHexString (value));
			}
		}
	}
}
