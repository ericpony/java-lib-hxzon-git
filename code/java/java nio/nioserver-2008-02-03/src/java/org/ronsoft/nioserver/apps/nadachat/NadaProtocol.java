package org.ronsoft.nioserver.apps.nadachat;

import org.ronsoft.nioserver.ChannelFacade;
import org.ronsoft.nioserver.InputHandler;
import org.ronsoft.nioserver.impl.InputHandlerFactory;

import java.nio.ByteBuffer;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by IntelliJ IDEA.
 * User: ron
 * Date: Mar 19, 2007
 * Time: 3:22:29 PM
 */
public class NadaProtocol implements InputHandlerFactory
{
	Map<ChannelFacade, NadaUser> users =
		Collections.synchronizedMap (new HashMap<ChannelFacade, NadaUser>());

	// --------------------------------------------------
	// Implementation of InputHandlerFactory interface

	public InputHandler newHandler() throws IllegalAccessException, InstantiationException
	{
		return new NadaHandler (this);
	}

	// --------------------------------------------------

	void newUser (ChannelFacade facade)
	{
		NadaUser user = new NadaUser (facade);

		users.put (facade, user);
		user.send (ByteBuffer.wrap ((user.getNickName() + "\n").getBytes()));
	}

	void endUser (ChannelFacade facade)
	{
		users.remove (facade);
	}

	public void handleMessage (ChannelFacade facade, ByteBuffer message)
	{
		broadcast (users.get (facade), message);
	}

	private void broadcast (NadaUser sender, ByteBuffer message)
	{
		synchronized (users) {
			for (NadaUser user : users.values()) {
				if (user != sender) {
					sender.sendTo (user, message);
				}
			}
		}
	}

	// ----------------------------------------------------

	private static class NadaUser
	{
		private final ChannelFacade facade;
		private String nickName;
		private ByteBuffer prefix = null;
	private static int counter = 1;

		public NadaUser (ChannelFacade facade)
		{
			this.facade = facade;
	setNickName ("nick-" + counter++);
		}

		public void send (ByteBuffer message)
		{
			facade.outputQueue().enqueue (message.asReadOnlyBuffer());
		}

		public void sendTo (NadaUser recipient, ByteBuffer message)
		{
			recipient.send (prefix);
			recipient.send (message);
		}

		public String getNickName ()
		{
			return nickName;
		}

		public void setNickName (String nickName)
		{
			this.nickName = nickName;

			String prefixStr = "[" + nickName + "] ";

			prefix = ByteBuffer.wrap (prefixStr.getBytes());
		}
	}
}
