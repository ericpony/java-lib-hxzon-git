
package com.ronsoft.books.nio.regex;

import java.util.regex.Pattern;

/**
 * Demonstrate Pattern.matches().
 *
 * Created: April, 2002
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: RegexMatches.java,v 1.1 2002/05/07 02:21:08 ron Exp $
 */
public class RegexMatches
{
	public static void main (String [] argv)
	{
		if (goodAnswer (argv [0])) {
			System.out.println ("Good Answer");
		} else {
			System.out.println ("Sorry, answer is no");
		}
	}

	private static boolean goodAnswer (String answer)
	{
		return (Pattern.matches ("[Yy]es|[Yy]|[Oo][Kk]|[Tt]rue", answer));
	}
}
