
package com.ronsoft.books.nio.channels;

import java.nio.ByteBuffer;
import java.nio.channels.Pipe;
import java.nio.channels.WritableByteChannel;
import java.nio.channels.SelectableChannel;
import java.io.InputStream;
import java.io.IOException;

/**
 * Class which encapsulates System.in as a selectable channel.
 * Instantiate this class, call start() on it to run the background
 * draining thread, then call getStdinChannel() to get a SelectableChannel
 * object which can be used with a Selector object.
 *
 * @author Ron Hitchens (ron@ronsoft.com)
 * created: Jan 2003
 */
public class SystemInPipe
{
	Pipe pipe;
	CopyThread copyThread;

	public SystemInPipe (InputStream in)
		throws IOException
	{
		pipe = Pipe.open();

		copyThread = new CopyThread (in, pipe.sink());
	}

	public SystemInPipe()
		throws IOException
	{
		this (System.in);
	}

	public void start()
	{
		copyThread.start();
	}

	public SelectableChannel getStdinChannel()
		throws IOException
	{
		SelectableChannel channel = pipe.source();

		channel.configureBlocking (false);

		return (channel);
	}

	protected void finalize()
	{
		copyThread.shutdown();
	}

	// ---------------------------------------------------

	public static class CopyThread extends Thread
	{
		boolean keepRunning = true;
		byte [] bytes = new byte [128];
		ByteBuffer buffer = ByteBuffer.wrap (bytes);
		InputStream in;
		WritableByteChannel out;

		CopyThread (InputStream in, WritableByteChannel out)
		{
			this.in = in;
			this.out = out;
			this.setDaemon (true);
		}

		public void shutdown()
		{
			keepRunning = false;
			this.interrupt();
		}

		public void run()
		{
			// this could be improved

			try {
				while (keepRunning) {
					int count = in.read (bytes);

					if (count < 0) {
						break;
					}

					buffer.clear().limit (count);

					out.write (buffer);
				}

				out.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}
