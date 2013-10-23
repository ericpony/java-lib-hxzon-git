
package com.ronsoft.books.nio.charset;

import java.nio.charset.Charset;
import java.nio.charset.spi.CharsetProvider;
import java.util.Set;
import java.util.HashSet;
import java.util.Iterator;

/**
 * A CharsetProvider class which makes available the charsets
 * provided by Ronsoft.  Currently there is only one, namely the X-ROT13
 * charset.  This is not a registered IANA charset, so it's
 * name begins with "X-" to avoid name clashes with offical charsets.
 *
 * To activate this CharsetProvider, it's necessary to add a file to
 * the classpath of the JVM runtime at the following location:
 *   META-INF/services/java.nio.charsets.spi.CharsetProvider
 *
 * That file must contain a line with the fully qualified name of
 * this class on a line by itself:
 *   com.ronsoft.books.nio.charset.RonsoftCharsetProvider
 *
 * See the javadoc page for java.nio.charsets.spi.CharsetProvider
 * for full details.
 *
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: RonsoftCharsetProvider.java,v 1.6 2002/05/20 07:24:31 ron Exp $
 * Created: January, 2002
 */
public class RonsoftCharsetProvider extends CharsetProvider
{
	// The name of the charset we provide
	private static final String CHARSET_NAME = "X-ROT13";

	// A handle to the Charset object
	private Charset rot13 = null;

	/**
	 * Constructor, instantiate a Charset object and save the reference.
	 */
	public RonsoftCharsetProvider()
	{
		this.rot13 = new Rot13Charset (CHARSET_NAME, new String [0]);
	}

	/**
	 * Called by Charset static methods to find a particular named
	 * Charset.  If it's the name of this charset (we don't have
	 * any aliases) then return the Rot13 Charset, else return null.
	 */
	public Charset charsetForName (String charsetName)
	{
		if (charsetName.equalsIgnoreCase (CHARSET_NAME)) {
			return (rot13);
		}

		return (null);
	}

	/**
	 * Return an Iterator over the set of Charset objects we provide.
	 * @return An Iterator object containing references to all the
	 *  Charset objects provided by this class.
	 */
	public Iterator charsets()
	{
		HashSet set = new HashSet (1);

		set.add (rot13);

		return (set.iterator());
	}
}

