
package com.ronsoft.books.nio.regex;

import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.io.FileReader;
import java.io.BufferedReader;
import java.io.IOException;

/**
 * Simple implementation of the ubiquitous grep command.
 * First argument is the regular expression to search for (remember to
 * quote and/or escape as appropriate).  All following arguments are
 * filenames to read and search for the regular expression.
 *
 * Created: April, 2002
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: SimpleGrep.java,v 1.1 2002/05/07 02:21:08 ron Exp $
 */
public class SimpleGrep
{
	public static void main (String [] argv)
		throws Exception
	{
		if (argv.length < 2) {
			System.out.println ("Usage: regex file [ ... ]");
			return;
		}

		Pattern pattern = Pattern.compile (argv [0]);
		Matcher matcher = pattern.matcher ("");

		for (int i = 1; i < argv.length; i++) {
			String file = argv [i];
			BufferedReader br = null;
			String line;

			try {
				br = new BufferedReader (new FileReader (file));
			} catch (IOException e) {
				System.err.println ("Cannot read '" + file
					+ "': " + e.getMessage());
				continue;
			}

			while ((line = br.readLine()) != null) {
				matcher.reset (line);

				if (matcher.find()) {
					System.out.println (file + ": " + line);
				}
			}

			br.close();
		}
	}
}
