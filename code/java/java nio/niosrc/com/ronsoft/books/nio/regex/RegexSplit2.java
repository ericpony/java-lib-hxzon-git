
package com.ronsoft.books.nio.regex;

import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

/**
 * Test regex splitting with arbitrary regexs.
 * Remember to quote the input args.
 *
 * @author Ron Hitchens
 * @version $Id: RegexSplit2.java,v 1.1 2002/05/07 02:21:08 ron Exp $
 */
public class RegexSplit2
{
	public static void main (String [] argv)
	{
		Pattern pattern = null;

		try {
			pattern = Pattern.compile (argv [0]);
		} catch (PatternSyntaxException e) {
			System.out.println ("The regular expression '"
				+ argv [0] + "' contains a "
				+ "syntax error: " + e.getMessage());
		}

		String [] tokens = pattern.split (argv [1]);

		for (int i = 0; i < tokens.length; i++) {
			System.out.println ("" + i + ": " + tokens [i]);
		}
	}
}
