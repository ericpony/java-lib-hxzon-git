
package com.ronsoft.books.nio.channels;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.channels.DatagramChannel;
import java.net.SocketAddress;
import java.net.InetSocketAddress;
import java.net.SocketException;

/**
 * Provide RFC 868 time service (http://www.ietf.org/rfc/rfc0868.txt).
 * This code implements an RFC 868 listener to provide time
 * service.  The defined port for time service is 37.  On most
 * unix systems, root privilege is required to bind to ports
 * below 1024.  You can either run this code as root or
 * provide another port number on the command line.  Use
 * "-p port#" with TimeClient if you choose an alternate port.
 *
 * Note: The familiar rdate command on unix will probably not work
 * with this server.  Most versions of rdate use TCP rather than UDP
 * to request the time.
 *
 * Created: April 2002
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: TimeServer.java,v 1.1 2002/04/28 22:07:43 ron Exp $
 */
public class TimeServer
{
	private static final int DEFAULT_TIME_PORT = 37;
	private static final long DIFF_1900 = 2208988800L;

	// --------------------------------------------------------------

	protected DatagramChannel channel;

	public TimeServer (int port)
		throws Exception
	{
		this.channel = DatagramChannel.open();
		this.channel.socket().bind (new InetSocketAddress (port));

		System.out.println ("Listening on port " + port
			+ " for time requests");
	}

	public void listen() throws Exception
	{
		// allocate a buffer to hold a long value
		ByteBuffer longBuffer = ByteBuffer.allocate (8);

		// assure big-endian (network) byte order
		longBuffer.order (ByteOrder.BIG_ENDIAN);
		// zero the whole buffer to be sure
		longBuffer.putLong (0, 0);
		// position to first byte of the low-order 32 bits
		longBuffer.position (4);

		// slice the buffer, gives view of the low-order 32 bits
		ByteBuffer buffer = longBuffer.slice();	

		while (true) {
			buffer.clear();

			SocketAddress sa = this.channel.receive (buffer);

			if (sa == null) {
				continue;	// defensive programming
			}
			// ignore content of recived datagram per rfc 868

			System.out.println ("Time request from " + sa);

			buffer.clear();		// sets pos/limit correctly

			// set 64-bit value, slice buffer sees low 32 bits
			longBuffer.putLong (0,
				(System.currentTimeMillis() / 1000) + DIFF_1900);

			this.channel.send (buffer, sa);
		}
	}

	// --------------------------------------------------------------

	public static void main (String [] argv)
		throws Exception
	{
		int port = DEFAULT_TIME_PORT;

		if (argv.length > 0) {
			port = Integer.parseInt (argv [0]);
		}

		try {
			TimeServer server = new TimeServer (port);

			server.listen();
		} catch (SocketException e) {
			System.out.println ("Can't bind to port " + port
				+ ", try a different one");
			
		}
	}
}

