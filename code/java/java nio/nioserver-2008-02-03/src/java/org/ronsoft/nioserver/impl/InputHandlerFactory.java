package org.ronsoft.nioserver.impl;

import org.ronsoft.nioserver.InputHandler;

/**
 * Created by IntelliJ IDEA.
 * User: ron
 * Date: Mar 18, 2007
 * Time: 5:47:51 PM
 */
public interface InputHandlerFactory
{
	InputHandler newHandler() throws IllegalAccessException, InstantiationException;
}
