
package com.ronsoft.books.nio.channels;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.channels.DatagramChannel;
import java.net.InetSocketAddress;
import java.util.Date;
import java.util.List;
import java.util.LinkedList;
import java.util.Iterator;

/**
 * Request time service, per RFC 868.  RFC 868
 * (http://www.ietf.org/rfc/rfc0868.txt) is a very simple time protocol
 * whereby one system can request the current time from another system.
 * Most Linux, BSD and Solaris systems provide RFC 868 time service
 * on port 37.  This simple program will inter-operate with those.
 * The National Institute of Standards and Technology (NIST) operates
 * a public time server at time.nist.gov.
 *
 * The RFC 868 protocol specifies a 32 bit unsigned value be sent,
 * representing the number of seconds since Jan 1, 1900.  The Java
 * epoch begins on Jan 1, 1970 (same as unix) so an adjustment is
 * made by adding or subtracting 2,208,988,800 as appropriate.  To
 * avoid shifting and masking, a four-byte slice of an
 * eight-byte buffer is used to send/recieve.  But getLong()
 * is done on the full eight bytes to get a long value.
 *
 * When run, this program will issue time requests to each hostname
 * given on the command line, then enter a loop to receive packets.
 * Note that some requests or replies may be lost, which means
 * this code could block forever.
 *
 * Created: April 2002
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: TimeClient.java,v 1.2 2002/04/28 22:07:43 ron Exp $
 */
public class TimeClient
{
	private static final int DEFAULT_TIME_PORT = 37;
	private static final long DIFF_1900 = 2208988800L;

	// --------------------------------------------------------------

	protected int port = DEFAULT_TIME_PORT;
	protected List remoteHosts;
	protected DatagramChannel channel;

	public TimeClient (String [] argv) throws Exception
	{
		if (argv.length == 0) {
			throw new Exception ("Usage: [ -p port ] host ...");
		}

		parseArgs (argv);

		this.channel = DatagramChannel.open();
	}

	// this version never times out
	protected InetSocketAddress receivePacket (DatagramChannel channel,
		ByteBuffer buffer)
		throws Exception
	{
		buffer.clear();

		// receive an unsigned 32-bit, big-endian value
		return ((InetSocketAddress) channel.receive (buffer));
	}

	// send time requests to all the supplied hosts
	protected void sendRequests()
		throws Exception
	{
		ByteBuffer buffer = ByteBuffer.allocate (1);
		Iterator it = remoteHosts.iterator();

		while (it.hasNext()) {
			InetSocketAddress sa = (InetSocketAddress) it.next();

			System.out.println ("Requesting time from "
				+ sa.getHostName() + ":" + sa.getPort());

			// make it empty, see RFC868
			buffer.clear().flip();
			// fire and forget
			channel.send (buffer, sa);
		}
	}

	// receive any replies that arrive
	public void getReplies() throws Exception
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
		int expect = remoteHosts.size();
		int replies = 0;

		System.out.println ("");
		System.out.println ("Waiting for replies...");

		while (true) {
			InetSocketAddress sa;

			sa = receivePacket (channel, buffer);

			if (sa == null) {
				// only get here if receivePacket timed out
				System.out.println ("Time's up, "
					+ (expect - replies)
					+ " replies never arrived");
				break;
			}

			buffer.flip();
			replies++;

			printTime (longBuffer.getLong (0), sa);

			if (replies == expect) {
				System.out.println ("All packets answered");

				break;
			}

			// some replies haven't shown up yet
			System.out.println ("Received " + replies
				+ " of " + expect + " replies");
		}
	}

	// print info about a received time reply
	protected void printTime (long remote1900, InetSocketAddress sa)
	{
		// local time as seconds since Jan 1, 1970
		long local = System.currentTimeMillis() / 1000;
		// remote time as seconds since Jan 1, 1970
		long remote = remote1900 - DIFF_1900;
		Date remoteDate = new Date (remote * 1000);
		Date localDate = new Date (local * 1000);
		long skew = remote - local;

		System.out.println ("Reply from "
			+ sa.getHostName() + ":" + sa.getPort());
		System.out.println ("  there: " + remoteDate);
		System.out.println ("   here: " + localDate);
		System.out.print ("   skew: ");

		if (skew == 0) {
			System.out.println ("none");
		} else if (skew > 0) {
			System.out.println (skew + " seconds ahead");
		} else {
			System.out.println ((-skew) + " seconds behind");
		}
	}

	protected void parseArgs (String [] argv)
	{
		remoteHosts = new LinkedList();

		for (int i = 0; i < argv.length; i++) {
			String arg = argv [i];

			// send client requests to the given port
			if (arg.equals ("-p")) {
				i++;
				this.port = Integer.parseInt (argv [i]);
				continue;
			}

			// create an address object for the host name
			InetSocketAddress sa = new InetSocketAddress (arg, port);

			// validate that it has an address
			if (sa.getAddress() == null) {
				System.out.println ("Cannot resolve address: "
					+ arg);

				continue;
			}

			remoteHosts.add (sa);
		}
	}

	// --------------------------------------------------------------

	public static void main (String [] argv)
		throws Exception
	{
		TimeClient client = new TimeClient (argv);

		client.sendRequests();
		client.getReplies();
	}
}

