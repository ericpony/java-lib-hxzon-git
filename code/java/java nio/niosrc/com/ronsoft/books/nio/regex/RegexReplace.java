
package com.ronsoft.books.nio.regex;

import java.util.regex.Pattern;
import java.util.regex.Matcher;

/**
 * Exercise the replacement capabilities of the java.util.regex.Matcher class.
 * Run this code from the command line with three or more arguments.
 * 1) First argument is a regular expression
 * 2) Second argument is a replacement string, optionally with capture group
 *    references ($1, $2, etc)
 * 3) Any remaining arguments are treated as input strings to which the
 *    regular expression and replacement strings will be applied.
 * The effect of calling replaceFirst() and replaceAll() for each input string
 * will be listed.
 *
 * Be careful to quote the commandline arguments if they contain spaces or
 * special characters.
 *
 * Created: Jan, 2001
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: RegexReplace.java,v 1.4 2002/01/21 23:37:02 ron Exp $
 */
public class RegexReplace
{
	public static void main (String [] argv)
	{
		// sanity check, need at least three args
		if (argv.length < 3) {
			System.out.println ("usage: regex replacement input ...");
			return;
		}

		// save the regex and replacment strings with mnemonic names
		String regex = argv [0];
		String replace = argv [1];

		// Compile the expression, only need be done once.
		Pattern pattern = Pattern.compile (regex);
		// get a Matcher instance, use a dummy input string for now
		Matcher matcher = pattern.matcher ("");

		// print out for reference
		System.out.println ("         regex: '" + regex + "'");
		System.out.println ("   replacement: '" + replace + "'");

		// For each remaining arg string, apply the regex/replacment
		for (int i = 2; i < argv.length; i++) {
			System.out.println ("------------------------");

			matcher.reset (argv [i]);

			System.out.println ("         input: '"
				+ argv [i] + "'");
			System.out.println ("replaceFirst(): '"
				+ matcher.replaceFirst (replace) + "'");
			System.out.println ("  replaceAll(): '"
				+ matcher.replaceAll (replace) + "'");
		}


	}
}
