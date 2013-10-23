
package com.ronsoft.books.nio.regex;

import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.Charset;
import java.util.regex.Pattern;

/**
 * Test regex splitting.  Splitting CharBuffers does not work reliably on
 * JDK 1.4.0.  Fixed in 1.4.1 release.
 *
 * @author Ron Hitchens
 * @version $Id: Split.java,v 1.1 2002/04/28 01:48:07 ron Exp $
 */
public class Split
{
	private static final String input = "GET /z.html HTTP/1.0\r\n";

	public static void main (String [] argv)
	{
		Pattern spacePat = Pattern.compile (" ");
		StringBuffer sb = new StringBuffer (input);
		CharBuffer cb = CharBuffer.wrap (sb.toString());
		String [] tokens = null;

		try {
			System.out.println ("Splitting StringBuffer");
			tokens = spacePat.split (sb);
			System.out.println ("split OK");
		} catch (Exception e) {
			System.out.println ("Caught: " + e);
			e.printStackTrace();
		}
		System.out.println ("");

		try {
			System.out.println ("Splitting CharBuffer");
			tokens = spacePat.split (cb);
			System.out.println ("split OK");
		} catch (Exception e) {
			System.out.println ("Caught: " + e);
			e.printStackTrace();
		}
		System.out.println ("");

		try {
			System.out.println ("Splitting CharBuffer.toString()");
			tokens = spacePat.split (cb.toString());
			System.out.println ("split OK");
		} catch (Exception e) {
			System.out.println ("Caught: " + e);
			e.printStackTrace();
		}
	}
}
