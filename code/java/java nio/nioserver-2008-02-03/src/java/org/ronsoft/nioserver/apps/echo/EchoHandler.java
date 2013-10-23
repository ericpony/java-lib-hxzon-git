/*
 * Copyright (c) 2004-2006 Ronsoft Technologies (http://ronsoft.com)
 * Contact Ron Hitchens (ron@ronsoft.com) with questions about this code.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * The use of the Apache License does not indicate that this project is
 * affiliated with the Apache Software Foundation.
 */

package org.ronsoft.nioserver.apps.echo;

import org.ronsoft.nioserver.InputHandler;
import org.ronsoft.nioserver.ChannelFacade;
import org.ronsoft.nioserver.InputQueue;

import java.nio.ByteBuffer;

/**
 * Created by IntelliJ IDEA.
 * User: ron
 * Date: Apr 8, 2006
 * Time: 5:49:36 PM
 */
public class EchoHandler implements InputHandler
{
	public ByteBuffer nextMessage (ChannelFacade channelFacade)
	{
		InputQueue inputQueue = channelFacade.inputQueue();
		int nlPos = inputQueue.indexOf ((byte) '\n');

		if (nlPos == -1) return (null);

		return (inputQueue.dequeueBytes (nlPos + 1));
	}

	public void handleInput (ByteBuffer message, ChannelFacade channelFacade)
	{
		channelFacade.outputQueue().enqueue (message);
	}


	public void starting (ChannelFacade channelFacade)
	{
		// nothing
	}

	public void started (ChannelFacade channelFacade)
	{
		// nothing
	}

	public void endOfInput (ChannelFacade channelFacade)
	{
		// nothing
	}

	public void stopping (ChannelFacade channelFacade)
	{
		// nothing
	}

	public void stopped (ChannelFacade channelFacade)
	{
		// nothing
	}
}
