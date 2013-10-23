
package com.ronsoft.books.nio.channels;

import java.nio.ByteBuffer;
import java.nio.channels.InterruptibleChannel;
import java.nio.channels.FileChannel;
import java.nio.channels.ByteChannel;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.io.FileInputStream;
import java.net.InetSocketAddress;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Test interrupt and async close semantics of InterruptibleChannel objects.
 * This is test code to demonstrate bugs in the 1.4.0 implementation.
 * Use of /dev/tty with FileChannel will probably not work in future releases.
 *
 * @author Ron Hitchens (ron@ronsoft.com)
 * $Id: ChannelClose.java,v 1.3 2002/05/20 07:24:29 ron Exp $
 */
public class ChannelClose
{
	// Include a port number command line arg to use sockets, otherwise
	// /dev/tty will be used.  If you use sockets, use telnet in another
	// window to connect to the port and type some input.
	public static void main (String [] argv)
		throws Exception
	{
		int port = 0;

		if (argv.length > 0) {
			port = Integer.parseInt (argv [0]);
		}

		Thread.currentThread().setName ("Main");

		System.out.println ("--- Testing Interrupt Thread ---");
		testInterrupt (newChannel (port));

		System.out.println ("");
		System.out.println ("--- Testing Async Channel Close ---");
		testAsyncClose (newChannel (port));
	}

	// Create a new channel: if port == 0, FileChannel on /dev/tty, else
	// a SocketChannel from the first accept on the given port number
	private static ByteChannel newChannel (int netPort)
		throws Exception
	{
		if (netPort == 0) {
			FileInputStream fis = new FileInputStream ("/dev/tty");
			return (fis.getChannel());
		} else {
			ServerSocketChannel ssc = ServerSocketChannel.open();
			ssc.socket().bind (new InetSocketAddress (netPort));

			System.out.print ("Waiting for connection on port "
				+ netPort + "...");
			System.out.flush();

			ByteChannel channel = ssc.accept();
			ssc.close();
			System.out.println ("Got it");

			return (channel);
		}
	}

	private static void testInterrupt (ByteChannel channel)
		throws Exception
	{
		Sleeper sleeper = new Sleeper (channel);

		sleeper.setName ("Sleeper");

		try {
			ByteBuffer buffer = ByteBuffer.allocate (100);

			println ("starting sleeper thread");
			sleeper.start();

			println ("waiting for sleeper thread to issue read...");
			Thread.sleep (1000);

			println ("interrupting sleeper");
			sleeper.interrupt();

			Thread.sleep (100);	// avoid race with sleeper
			println ("issuing read on interrupted channel...");
			channel.read (buffer);
			println ("read completed OK");
		} catch (Throwable e) {
			println ("Caught " + e);
		} finally {
			println ("closing channel");
			channel.close();

			println ("joining sleeper "
				+ "(you may need to type something)...");
			sleeper.join();
		}
	}

	private static void testAsyncClose (ByteChannel channel)
		throws Exception
	{
		Sleeper sleeper = new Sleeper (channel);

		sleeper.setName ("Sleeper");

		try {
			ByteBuffer buffer = ByteBuffer.allocate (100);

			println ("starting sleeper thread");
			sleeper.start();

			println ("waiting for sleeper thread to issue read...");
			Thread.sleep (1000);

			println ("closing channel");
			channel.close();

			println ("joining sleeper "
				+ "(you may need to type something)...");
			sleeper.join();
		} catch (Throwable e) {
			println ("Caught " + e);
		}
	}

	// print output with a timestamp and the thread name.
	private static void println (String s)
	{
		SimpleDateFormat df = new SimpleDateFormat (
                        "HH:mm:ss.SSS");
		String ds = df.format (new Date());

		System.out.println (ds + " ("
			+ Thread.currentThread().getName()
			+ "): " + s);
	}

	// --------------------------------------------------------

	private static class Sleeper extends Thread
	{
		private ByteChannel channel;

		public Sleeper (ByteChannel channel)
		{
			super();

			this.channel = channel;
		}

		public void run()
		{
			ByteBuffer buffer = ByteBuffer.allocate (100);

			try {
				println ("issuing read...");
				int n = this.channel.read (buffer);
				println ("read complete, "
					+ "bytes read=" + n);

				System.out.print (" Buffer: '");
				buffer.flip();

				while (buffer.hasRemaining()) {
					char c = (char) buffer.get();

					switch (c) {
					case '\n':
						System.out.print ("\\n");
						break;

					case '\r':
						System.out.print ("\\r");
						break;

					default:
						System.out.print (c);
						break;
					}
				}

				System.out.println ("'");
			} catch (Throwable e) {
				println ("caught " + e);
			} finally {
				println ("exiting, "
					+ "interrupted=" + isInterrupted());
			}
		}
	}
}
