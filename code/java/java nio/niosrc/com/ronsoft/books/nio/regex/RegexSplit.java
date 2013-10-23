
package com.ronsoft.books.nio.regex;

import java.util.regex.Pattern;

/**
 * Test regex splitting. Remember to quote the input args.
 *
 * @author Ron Hitchens
 * @version $Id: RegexSplit.java,v 1.1 2002/05/07 02:21:08 ron Exp $
 */
public class RegexSplit
{
	public static void main (String [] argv)
	{
		Pattern spacePat = Pattern.compile ("\\s+");
		String [] tokens = spacePat.split (argv [0]);

		for (int i = 0; i < tokens.length; i++) {
			System.out.println ("" + i + ": " + tokens [i]);
		}
	}
}
