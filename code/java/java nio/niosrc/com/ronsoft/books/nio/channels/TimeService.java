
package com.ronsoft.books.nio.channels;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.channels.DatagramChannel;
import java.net.InetSocketAddress;
import java.util.Date;
import java.util.List;
import java.util.LinkedList;
import java.util.Iterator;

// This code is deprecated, see TimeClient and TimeServer

/**
 * Request and/or provide time service, per RFC 868.  RFC 868 
 * (http://www.ietf.org/rfc/rfc0868.txt) is a very simple time protocol
 * whereby one system can request the current time from another system.
 * It's a very simple protocol, specified nearly 20 years ago, which
 * does not take into account packet transit time or precision of less
 * than one second.  The Network Time Protocol (NTP) is superior but
 * far too complex for demonstration purposes.  
 * Most Linux, BSD and Solaris systems provide RFC 868 time service
 * on port 37.  This simple program will inter-operate with those.
 * The National Institute of Standards and Technology (NIST) operates
 * a public time server at time.nist.gov.
 *
 * This code also implements an RFC 868 listener to provide time
 * service.  On most unix systems, root privileges are required to
 * bind to ports below 1024.  You can either run this code as root
 * or provide another port number with "-l port#".  If you run this
 * server on an alternate port, you can connect from another JVM
 * by supplying the "-p" option to specify the alternate port for
 * requests.
 *
 * Note: The familiar rdate command on unix will probably not work
 * with this server.  Most versions of rdate use TCP rather than UDP
 * to request the time.
 *
 * When run, this program will issue time requests to each hostname
 * given on the command line, then enter a loop to receive packets.
 * If not acting as a server, it will exit when all expected replies
 * have arrived.  Note that some replies may be lost, which means
 * this code may block forever.  If acting as a server, time requests
 * from remote systems will be dispatched as well, in the same loop.
 *
 * The RFC 868 protocol specifies a 32 bit unsigned value be sent,
 * representing the number of seconds since Jan 1, 1900.  The Java
 * epoch begins on Jan 1, 1970 (same as unix) so an adjustment is
 * made by adding or subtracting 2,208,988,800 as appropriate.  To
 * avoid casting shifting an masking, a four-byte slice of an
 * eight-byte buffer is used send/recieve, but then get/putLong()
 * is done on the full eight bytes to get a long value.
 *
 * Created: April 2002
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: TimeService.java,v 1.4 2002/05/20 07:24:29 ron Exp $
 */
public class TimeService
{
	private static final int DEFAULT_TIME_PORT = 37;
	private static final long DIFF_1900 = 2208988800L;

	// --------------------------------------------------------------

	protected DatagramChannel channel;
	protected boolean listening = false;

	public TimeService (int port)
		throws Exception
	{
		this.channel = DatagramChannel.open();

		if (port != 0) {
			System.out.println ("Listening on port " + port
				+ " for time requests");

			channel.socket().bind (new InetSocketAddress (port));
			listening = true;
		}
	}

	// this version never times out
	protected InetSocketAddress receivePacket (DatagramChannel channel,
		ByteBuffer buffer)
		throws Exception
	{
		buffer.clear();

		// receive a 32-bit, big-endian, unsigned value
		return ((InetSocketAddress) channel.receive (buffer));
	}

	public void run (int expect)
		throws Exception
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
		int replies = 0;

		while (true) {
			InetSocketAddress sa;

			sa = receivePacket (channel, buffer);

			if (sa == null) {
				// only get here if receivePacket timed out
				if (listening) {
					continue;
				}

				System.out.println ("Time's up, "
					+ (expect - replies)
					+ " replies never arrived");

				break;
			}

			buffer.flip();

			if (buffer.remaining() == 0) {
				// empty packet, someone requesting our time
				System.out.println ("Time request from "
					+ hostInfo (sa));

				serveTimeRequest (sa);
			} else {
				// reply to a time request we sent
				replies++;
				printTime (longBuffer.getLong (0), sa);
			}

			if (expect == 0) {
				// running as pure server, carry on
				continue;
			}

			if (replies == expect) {
				// all request were answered
				System.out.println ("All packets answered");
				expect = 0;

				if ( ! listening) {
					break;
				}
			} else {
				// some haven't shown up yet
				System.out.println ("Received " + replies
					+ " of " + expect + " replies");
			}
		}
	}

	// send a time request to the given internet address
	public void requestTime (InetSocketAddress sa)
		throws Exception
	{
		ByteBuffer buffer = ByteBuffer.allocate (1);

		buffer.flip();		// make it empty, see RFC868

		// fire and forget
		channel.send (buffer, sa);
	}

	// print info about a received time reply
	protected void printTime (long remote1900, InetSocketAddress sa)
	{
		long remote = remote1900 - DIFF_1900;
		long local = currentTimeSecs();
		Date remoteDate = new Date (remote * 1000);
		Date localDate = new Date (local * 1000);
		long skew = remote - local;

		System.out.println ("Reply from " + hostInfo (sa));
		System.out.println ("  there: " + remoteDate);
		System.out.println ("   here: " + localDate);
		System.out.print ("   skew: ");

		if (skew == 0) {
			System.out.println ("none");
		} else {
			System.out.println (skew + " seconds "
				+ ((skew < 0) ? "behind" : "ahead"));
		}
	}

	// send the local time to the remote requestor
	protected void serveTimeRequest (InetSocketAddress sa)
		throws Exception
	{
		ByteBuffer buffer = ByteBuffer.allocate (8);

		buffer.clear();
		buffer.putLong (0, currentTimeSecs() + DIFF_1900);
		buffer.position (4);		// low-order 32-bit int

		this.channel.send (buffer, sa);
	}

	// get the local time as seconds since Jan 1, 1970
	public static long currentTimeSecs()
	{
		return (System.currentTimeMillis() / 1000);	// secs/1970
	}

	// convenience formatting method
	public static String hostInfo (InetSocketAddress sa)
	{
		return (sa.getHostName() + ":" + sa.getPort());
	}

	// --------------------------------------------------------------

	public static TimeService newInstance (int listenPort)
		throws Exception
	{
		return (new TimeService (listenPort));
	}

	public static void main (String [] argv)
		throws Exception
	{
		if (argv.length == 0) {
			System.out.println ("Usage: [ -s | -l port ] [ -p port ] host ...");
			return;
		}

		List hosts = new LinkedList();
		int listenPort = 0;
		int port = DEFAULT_TIME_PORT;

		for (int i = 0; i < argv.length; i++) {
			String arg = argv [i];

			// listen as a server, on the default port
			if (arg.equals ("-s")) {
				listenPort = DEFAULT_TIME_PORT;
				continue;
			}

			// listen as a server, on the given port
			if (arg.equals ("-l")) {
				i++;
				listenPort = Integer.parseInt (argv [i]);
				continue;
			}

			// send client requests to the given port
			if (arg.equals ("-p")) {
				i++;
				port = Integer.parseInt (argv [i]);
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

			hosts.add (sa);
		}

		TimeService timeService = newInstance (listenPort);

		// send time requests to all the supplied hosts
		Iterator it = hosts.iterator();

		while (it.hasNext()) {
			InetSocketAddress sa = (InetSocketAddress) it.next();

			System.out.println ("Requesting time from "
				+ hostInfo (sa));

			timeService.requestTime (sa);
		}

		System.out.println ("");
		System.out.println ("Waiting for replies...");

		timeService.run (hosts.size());
	}
}

