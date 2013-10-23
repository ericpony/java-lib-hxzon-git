
package com.ronsoft.books.nio.channels;

import java.nio.ByteBuffer;
import java.nio.channels.SocketChannel;
import java.nio.channels.SelectionKey;
import java.util.List;
import java.util.LinkedList;
import java.io.IOException;

/**
 * Specialization of the SelectSockets class which uses a thread pool
 * to service channels.  The thread pool is an ad-hoc implementation
 * quicky lashed togther in a few hours for demonstration purposes.
 * It's definitely not production quality.
 *
 * Created May 2002
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: SelectSocketsThreadPool.java,v 1.5 2002/05/20 07:24:29 ron Exp $
 */
public class SelectSocketsThreadPool extends SelectSockets
{
	private static final int MAX_THREADS = 5;

	private ThreadPool pool = new ThreadPool (MAX_THREADS);

	// -------------------------------------------------------------

	public static void main (String [] argv)
		throws Exception
	{
		new SelectSocketsThreadPool().go (argv);
	}

	// -------------------------------------------------------------

	/**
	 * Sample data handler method for a channel with data ready to read.
	 * This method is invoked from the go() method in the parent class.
	 * This handler delegates to a worker thread in a thread pool to
	 * service the channel, then returns immediately.
	 * @param key A SelectionKey object representing a channel
	 *  determined by the selector to be ready for reading.  If the
	 *  channel returns an EOF condition, it is closed here, which
	 *  automatically invalidates the associated key.  The selector
	 *  will then de-register the channel on the next select call.
	 */
	protected void readDataFromSocket (SelectionKey key)
		throws Exception
	{
		WorkerThread worker = pool.getWorker();

		if (worker == null) {
			// No threads available, do nothing, the selection
			// loop will keep calling this method until a
			// thread becomes available.  This design could
			// be improved.
			return;	
		}

		// invoking this wakes up the worker thread then returns
		worker.serviceChannel (key);
	}

	// ---------------------------------------------------------------

	/**
	 * A very simple thread pool class.  The pool size is set at
	 * construction time and remains fixed.  Threads are cycled
	 * through a FIFO idle queue.
	 */
	private class ThreadPool
	{
		List idle = new LinkedList();

		ThreadPool (int poolSize)
		{
			// fill up the pool with worker threads
			for (int i = 0; i < poolSize; i++) {
				WorkerThread thread = new WorkerThread (this);

				// set thread name for debugging, start it
				thread.setName ("Worker" + (i + 1));
				thread.start();

				idle.add (thread);
			}
		}

		/**
		 * Find an idle worker thread, if any.  Could return null.
		 */
		WorkerThread getWorker()
		{
			WorkerThread worker = null;

			synchronized (idle) {
				if (idle.size() > 0) {
					worker = (WorkerThread) idle.remove (0);
				}
			}

			return (worker);
		}

		/**
		 * Called by the worker thread to return itself to the
		 * idle pool.
		 */
		void returnWorker (WorkerThread worker)
		{
			synchronized (idle) {
				idle.add (worker);
			}
		}
	}

	/**
	 * A worker thread class which can drain channels and echo-back
	 * the input.  Each instance is constructed with a reference to
	 * the owning thread pool object. When started, the thread loops
	 * forever waiting to be awakened to service the channel associated
	 * with a SelectionKey object.
	 * The worker is tasked by calling its serviceChannel() method
	 * with a SelectionKey object.  The serviceChannel() method stores
	 * the key reference in the thread object then calls notify()
	 * to wake it up.  When the channel has been drained, the worker
	 * thread returns itself to its parent pool.
	 */
	private class WorkerThread extends Thread
	{
		private ByteBuffer buffer = ByteBuffer.allocate (1024);
		private ThreadPool pool;
		private SelectionKey key;

		WorkerThread (ThreadPool pool)
		{
			this.pool = pool;
		}

		// loop forever waiting for work to do
		public synchronized void run()
		{
			System.out.println (this.getName() + " is ready");

			while (true) {
				try {
					// sleep and release object lock
					this.wait();
				} catch (InterruptedException e) {
					e.printStackTrace();
					// clear interrupt status
					this.interrupted();
				}

				if (key == null) {
					continue;	// just in case
				}

				System.out.println (this.getName()
					+ " has been awakened");

				try {
					drainChannel (key);
				} catch (Exception e) {
					System.out.println ("Caught '"
						+ e + "' closing channel");

					// close channel and nudge selector
					try {
						key.channel().close();
					} catch (IOException ex) {
						ex.printStackTrace();
					}

					key.selector().wakeup();
				}

				key = null;

				// done, ready for more, return to pool
				this.pool.returnWorker (this);
			}
		}

		/**
		 * Called to initiate a unit of work by this worker thread
		 * on the provided SelectionKey object.  This method is
		 * synchronized, as is the run() method, so only one key
		 * can be serviced at a given time.
		 * Before waking the worker thread, and before returning
		 * to the main selection loop, this key's interest set is
		 * updated to remove OP_READ.  This will cause the selector
		 * to ignore read-readiness for this channel while the
		 * worker thread is servicing it.
		 */
		synchronized void serviceChannel (SelectionKey key)
		{
			this.key = key;

			key.interestOps (key.interestOps() & (~SelectionKey.OP_READ));

			this.notify();		// awaken the thread
		}

		/**
		 * The actual code which drains the channel associated with
		 * the given key.  This method assumes the key has been
		 * modified prior to invocation to turn off selection
		 * interest in OP_READ.  When this method completes it
		 * re-enables OP_READ and calls wakeup() on the selector
		 * so the selector will resume watching this channel.
		 */
		void drainChannel (SelectionKey key)
			throws Exception
		{
			SocketChannel channel = (SocketChannel) key.channel();
			int count;

			buffer.clear();			// make buffer empty

			// loop while data available, channel is non-blocking
			while ((count = channel.read (buffer)) > 0) {
				buffer.flip();		// make buffer readable

				// send the data, may not go all at once
				while (buffer.hasRemaining()) {
					channel.write (buffer);
				}
				// WARNING: the above loop is evil.
				// See comments in superclass.

				buffer.clear();		// make buffer empty
			}

			if (count < 0) {
				// close channel on EOF, invalidates the key
				channel.close();
				return;
			}

			// resume interest in OP_READ
			key.interestOps (key.interestOps() | SelectionKey.OP_READ);

			// cycle the selector so this key is active again
			key.selector().wakeup();
		}
	}
}
