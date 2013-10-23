
package com.ronsoft.books.nio.channels;

import java.nio.ByteBuffer;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.channels.FileChannel.MapMode;
import java.nio.channels.GatheringByteChannel;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URLConnection;

/**
 * Dummy HTTP server using MappedByteBuffers.
 * Given a filename on the command line, pretend to be
 * a web server and generate an HTTP response containing
 * the file content preceded by appropriate headers.  The
 * data is sent with a gathering write.
 *
 * Created: April 2002
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: MappedHttp.java,v 1.3 2002/05/20 07:24:29 ron Exp $
 */
public class MappedHttp
{
	private static final String OUTPUT_FILE = "MappedHttp.out";

	private static final String LINE_SEP = "\r\n";
	private static final String SERVER_ID = "Server: Ronsoft Dummy Server";
	private static final String HTTP_HDR =
		"HTTP/1.0 200 OK" + LINE_SEP + SERVER_ID + LINE_SEP;
	private static final String HTTP_404_HDR =
		"HTTP/1.0 404 Not Found" + LINE_SEP + SERVER_ID + LINE_SEP;
	private static final String MSG_404 = "Could not open file: ";

	public static void main (String [] argv)
		throws Exception
	{
		if (argv.length < 1) {
			System.err.println ("Usage: filename");
			return;
		}

		String file = argv [0];
		ByteBuffer header = ByteBuffer.wrap (bytes (HTTP_HDR));
		ByteBuffer dynhdrs = ByteBuffer.allocate (128);
		ByteBuffer [] gather = { header, dynhdrs, null };
		String contentType = "unknown/unknown";
		long contentLength = -1;

		try {
			FileInputStream fis = new FileInputStream (file);
			FileChannel fc = fis.getChannel();
			MappedByteBuffer filedata =
				fc.map (MapMode.READ_ONLY, 0, fc.size());

			gather [2] = filedata;

			contentLength = fc.size();
			contentType = URLConnection.guessContentTypeFromName (file);
		} catch (IOException e) {
			// file could not be opened, report problem
			ByteBuffer buf = ByteBuffer.allocate (128);
			String msg = MSG_404 + e + LINE_SEP;

			buf.put (bytes (msg));
			buf.flip();

			// use the HTTP error response
			gather [0] = ByteBuffer.wrap (bytes (HTTP_404_HDR));
			gather [2] = buf;

			contentLength = msg.length();
			contentType = "text/plain";
		}

		StringBuffer sb = new StringBuffer();
		sb.append ("Content-Length: " + contentLength);
		sb.append (LINE_SEP);
		sb.append ("Content-Type: ").append (contentType);
		sb.append (LINE_SEP).append (LINE_SEP);

		dynhdrs.put (bytes (sb.toString()));
		dynhdrs.flip();

		FileOutputStream fos = new FileOutputStream (OUTPUT_FILE);
		FileChannel out = fos.getChannel();

		// all the buffers have been prepared, write 'em out
		while (out.write (gather) > 0) {
			// empty body, loop until all buffers empty
		}

		out.close();

		System.out.println ("output written to " + OUTPUT_FILE);
	}

	// convert a string to its constituent bytes 
	// from the ascii character set.
	private static byte [] bytes (String string)
		throws Exception
	{
		return (string.getBytes ("US-ASCII"));
	}
}
