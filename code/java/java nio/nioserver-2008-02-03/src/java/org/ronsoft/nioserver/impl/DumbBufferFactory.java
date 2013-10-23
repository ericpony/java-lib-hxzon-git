package org.ronsoft.nioserver.impl;

import org.ronsoft.nioserver.BufferFactory;

import java.nio.ByteBuffer;

/**
 * Created by IntelliJ IDEA.
 * User: ron
 * Date: Mar 19, 2007
 * Time: 2:59:03 PM
 */
public class DumbBufferFactory implements BufferFactory
{
	private int capacity;

	public DumbBufferFactory (int capacity)
	{
		this.capacity = capacity;
	}

	public ByteBuffer newBuffer()
	{
		return (ByteBuffer.allocate (capacity));
	}

	public void returnBuffer (ByteBuffer buffer)
	{
		// do nothing
	}
}
