
package com.ronsoft.books.nio.appendix;

public class ClassXml
{
	// This method is invoked as an XSL extension function from xalan.
	// This should be moved to ClassInfo and this class deleted.
	public static String getClassApi (String pname, String cname,
		String protFlag)
		throws Exception
	{
		boolean prot = false;

		if ((protFlag != null) && (protFlag.equals ("true"))) {
			prot = true;
		}

		ClassInfo ci = new ClassInfo (pname + "." + cname, prot);

		return (ci.toString ("    ", false));
	}

	// defunct crap
	private static String formatClass (String classname, ClassInfo ci,
		String desc)
	{
		StringBuffer sb = new StringBuffer();

		sb.append ("<sect2><title>");
		sb.append ("<classname>");
		sb.append (classname);
		sb.append ("</classname></title>\n");

		sb.append ("<para>" + desc + "</para>");

		sb.append ("<para><emphasis>");

		if (ci.isInterface()) {
			sb.append ("Interface ");
		} else {
			sb.append ("Class ");
		}

		sb.append ("Definition</emphasis></para>");

		sb.append ("<blockquote><programlisting>");

		ci.stringify (sb, "    ", 0, true);

		sb.append ("</programlisting></blockquote>");

		sb.append ("<para><emphasis>See Also: </emphasis>");

		sb.append ("</sect2>");

		return (sb.toString());
	}

	public static void main (String[] argv)
		throws Exception
	{
		for (int i = 0; i < argv.length; i++) {
			ClassInfo ci = new ClassInfo (argv [i]);

			System.out.println (formatClass (argv [i], ci, "XXX"));
		}
	}
}
