
package com.ronsoft.books.nio.regex;

import java.util.regex.Pattern;
import java.util.regex.Matcher;

/**
 * Demonstrate behavior of backslashes in regex patterns.
 *
 * Created: April, 2002
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: BackSlashes.java,v 1.1 2002/04/10 18:41:27 ron Exp $
 */
public class BackSlashes
{
	public static void main (String [] argv)
	{
		// substitute "a\b" for XYZ or ABC in input
		String rep = "a\\\\b";
		String input = "> XYZ <=> ABC <";
		Pattern pattern = Pattern.compile ("ABC|XYZ");
		Matcher matcher = pattern.matcher (input);

		System.out.println (matcher.replaceFirst (rep));
		System.out.println (matcher.replaceAll (rep));

		// change all newlines in input to escaped, DOS-like CR/LF
		rep = "\\\\r\\\\n";
		input = "line 1\nline 2\nline 3\n";
		pattern = Pattern.compile ("\\n");
		matcher = pattern.matcher (input);

		System.out.println ("");
		System.out.println ("Before:");
		System.out.println (input);

		System.out.println ("After (dos-ified, escaped):");
		System.out.println (matcher.replaceAll (rep));
	}
}
