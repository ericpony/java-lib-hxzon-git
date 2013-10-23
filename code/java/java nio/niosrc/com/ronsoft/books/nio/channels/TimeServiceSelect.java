
package com.ronsoft.books.nio.channels;

import java.nio.ByteBuffer;
import java.nio.channels.DatagramChannel;
import java.nio.channels.Selector;
import java.nio.channels.SelectionKey;
import java.net.InetSocketAddress;


public class TimeServiceSelect extends TimeService
{
	private Selector selector;
	private long giveup;

	public TimeServiceSelect (int port, long timeout)
		throws Exception
	{
		super (port);

		this.giveup = System.currentTimeMillis() + timeout;
		this.selector = selector.open();

		this.channel.configureBlocking (false);
		this.channel.register (this.selector, SelectionKey.OP_READ);
	}

	// this version never times out
	protected InetSocketAddress receivePacket (DatagramChannel channel,
		ByteBuffer buffer)
		throws Exception
	{
System.out.println ("In TimerServiceSelect receivePacket");
		buffer.clear();

		while (true) {
			InetSocketAddress sa;

			sa = (InetSocketAddress) channel.receive (buffer);

			if (sa != null) {
				return (sa);
			}

			long sleepTime = giveup - System.currentTimeMillis();

			if (sleepTime < 1) {
				return (null);	// time's up
			}

System.out.println ("Selecting for " + (sleepTime / 1000) + " seconds");
			selector.select (sleepTime);
		}
	}

	public static TimeService newInstance (int listenPort)
		throws Exception
	{
System.out.println ("in newInstance");
		return (new TimeServiceSelect (listenPort, 5));
	}
}
