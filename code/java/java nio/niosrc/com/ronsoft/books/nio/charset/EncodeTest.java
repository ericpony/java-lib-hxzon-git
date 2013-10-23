
package com.ronsoft.books.nio.charset;

import java.nio.charset.Charset;
import java.nio.ByteBuffer;

/**
 * Charset encoding test.  Run the same input string, which contains
 * some non-ascii characters, through several Charset encoders and dump out
 * the hex values of the resulting byte sequences.
 *
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: EncodeTest.java,v 1.2 2002/05/11 03:23:35 ron Exp $
 */
public class EncodeTest
{
	public static void main (String [] argv)
		throws Exception
	{
		// This is the character sequence to encode
		String input = "\u00bfMa\u00f1ana?";

		// The list of charsets to encode with
		String [] charsetNames = {
			"US-ASCII", "ISO-8859-1", "UTF-8", "UTF-16BE",
			"UTF-16LE", "UTF-16",
			// "X-ROT13"	// This requires META-INF/services
		};

		for (int i = 0; i < charsetNames.length; i++) {
			doEncode (Charset.forName (charsetNames [i]), input);
		}
	}

	/**
	 * For a given Charset and input string, encode the chars
	 * and print out the resulting byte encoding in a readable form.
	 */
	private static void doEncode (Charset cs, String input)
	{
		ByteBuffer bb = cs.encode (input);

		System.out.println ("Charset: " + cs.name());
		System.out.println ("  Input: " + input);
		System.out.println ("Encoded: ");

		for (int i = 0; bb.hasRemaining(); i++) {
			int b = bb.get();
			int ival = ((int) b) & 0xff;
			char c = (char) ival;

			// keep tabular alignment pretty
			if (i < 10) System.out.print (" ");

			// print index number
			System.out.print ("  " + i + ": ");

			// Better formatted output is coming for NIO
			if (ival < 16) System.out.print ("0");

			// print the hex value of the byte
			System.out.print (Integer.toHexString (ival));

			// If the byte seems to be the value of a
			// printable character, print it.  No guarantee
			// it will be.
			if (Character.isWhitespace (c) ||
				Character.isISOControl (c))
			{
				System.out.println ("");
			} else {
				System.out.println (" (" + c + ")");
			}
		}

		System.out.println ("");
	}
}
