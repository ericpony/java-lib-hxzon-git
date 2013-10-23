
package com.ronsoft.books.nio.regex;

import java.util.regex.Pattern;
import java.util.regex.Matcher;

/**
 * Test the appendReplacement() and appendTail() methods of the
 * java.util.regex.Matcher class.
 * Created: Dec 28, 2001
 *
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: RegexAppend.java,v 1.5 2002/04/11 02:58:04 ron Exp $
 */
public class RegexAppend
{
	public static void main (String [] argv)
	{
		String input = "Thanks, thanks very much";
		String regex = "([Tt])hanks";
		Pattern pattern = Pattern.compile (regex);
		Matcher matcher = pattern.matcher (input);
		StringBuffer sb = new StringBuffer();

		// loop while matches are encountered
		while (matcher.find()) {
			if (matcher.group(1).equals ("T")) {
				matcher.appendReplacement (sb, "Thank you");
			} else {
				matcher.appendReplacement (sb, "thank you");
			}
		}

		// complete the transfer to the StringBuffer
		matcher.appendTail (sb);

		// print the result
		System.out.println (sb.toString());

		// Let's try that again, using the $n escape in the replacement
		sb.setLength (0);
		matcher.reset();

		String replacement = "$1hank you";

		// loop while matches are encountered
		while (matcher.find()) {
			matcher.appendReplacement (sb, replacement);
		}

		// complete the transfer to the StringBuffer
		matcher.appendTail (sb);

		// print the result
		System.out.println (sb.toString());

		// And once more, the easy way (because this example is simple)
		System.out.println (matcher.replaceAll (replacement));

		// One last time, using only the String
		System.out.println (input.replaceAll (regex, replacement));
		
	}
}
