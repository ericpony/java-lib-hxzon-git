
package com.ronsoft.books.nio.channels;

import java.nio.ByteBuffer;
import java.nio.channels.DatagramChannel;
import java.nio.channels.Selector;
import java.nio.channels.SelectionKey;
import java.net.InetSocketAddress;

public class TimeClientSelect extends TimeClient
{
	private long giveup;
	private Selector selector;

	public TimeClientSelect (String [] argv, long timeout)
		throws Exception
	{
		super (argv);

		this.selector = Selector.open();
		this.channel.configureBlocking (false);
		this.channel.register (selector, SelectionKey.OP_READ);
		this.giveup = System.currentTimeMillis() + timeout;
	}

	protected InetSocketAddress receivePacket (DatagramChannel channel,
		ByteBuffer buffer)
		throws Exception
	{
		buffer.clear();

		while (true) {
			InetSocketAddress sa;

			sa = (InetSocketAddress) channel.receive (buffer);

			if (sa != null) {
				return (sa);
			}

			long sleepTime = giveup - System.currentTimeMillis();

			if (sleepTime <= 0) {
				return (null);
			}

System.out.println ("Selecting for " + (sleepTime / 1000) + " seconds");
			selector.select (sleepTime);

		}
	}


	public static void main (String [] argv)
		throws Exception
	{
		TimeClientSelect client = new TimeClientSelect (argv, 5000);

		client.sendRequests();
		client.getReplies();
	}
	
}
