
package com.ronsoft.books.nio.appendix;

import java.lang.reflect.*;
import java.util.*;
import java.util.regex.*;
import java.io.*;

/**
 * Extract information about a class.  This class was used to generate
 * the quick reference for the NIO book for O'Reilly.  It's kind of ugly
 * and there are a lot of hacks in here.  The most obvious one is the
 * wrapping of <emphasis> tags around class and member names in the
 * toString() output.
 * With a little work this could be made into a generic class introspector,
 * but it currently has some warts on it.
 *
 * Created May 2002
 * @author Ron Hitchens (ron@ronsoft.com)
 * @version $Id: ClassInfo.java,v 1.2 2002/05/31 04:16:13 ron Exp $
 */
public class ClassInfo
{
	private static final String SRC_DIR = "/usr/local/java/java1.4/src";

	private Package packg;
	private Class thisClass;
	private Class superClass;
	private Class declaringClass;
	private Class [] interfaces;
	private Field [] fields;
	private Constructor [] constructors;
	private Method [] methods;
	private Class [] classes;
	private ClassInfo [] internalClasses;
	private int mods = Modifier.PUBLIC;

	public ClassInfo (String className)
		throws Exception
	{
		this (Class.forName (className));
	}

	public ClassInfo (String className, boolean prot)
		throws Exception
	{
		this (Class.forName (className),
			(prot) ? Modifier.PUBLIC | Modifier.PROTECTED : Modifier.PUBLIC);
	}

	public ClassInfo (Class clas)
		throws Exception
	{
		this (clas, Modifier.PUBLIC);
	}

	public ClassInfo (Class clas, int mods)
		throws Exception
	{
		thisClass = clas;
		packg = clas.getPackage();
		superClass = clas.getSuperclass();
		interfaces = clas.getInterfaces();
		declaringClass = clas.getDeclaringClass();
		fields = trimFields (clas.getDeclaredFields(), mods);
		constructors = trimConstructors (clas.getConstructors(), mods);
		methods = trimMethods (clas.getDeclaredMethods(), mods);
		classes = trimClasses (clas.getDeclaredClasses(), mods);

		if (classes.length == 0) {
			internalClasses = new ClassInfo [0];
		} else {
			List list = new LinkedList();

			for (int i = 0; i < classes.length; i++) {
				list.add (new ClassInfo (classes [i]));
			}

			internalClasses = new ClassInfo [list.size()];
			list.toArray (internalClasses);
		}
	}

	// ---------------------------------------------------------------

	public boolean isInterface()
	{
		return (thisClass.isInterface());
	}

	public Class getSuperClass()
	{
		if ((superClass == null) || (superClass == Object.class)) {
			return (null);
		}

		return (superClass);
	}

	// ---------------------------------------------------------------
	// Given an array of Class or Member, return a new array containing
	// only those elements with the matching modifier bits set.
	// This is to filter out private and protected methods for example.

	private Field [] trimFields (Field [] item, int mods)
	{
		List list = new LinkedList();

		for (int i = 0; i < item.length; i++) {
			if ((item [i].getModifiers() & mods) != 0) {
				list.add (item [i]);
			}
		}

		Field [] trimmed = new Field [list.size()];

		list.toArray (trimmed);
		Arrays.sort (trimmed, comper);

		return (trimmed);
	}

	private Constructor [] trimConstructors (Constructor [] item, int mods)
	{
		List list = new LinkedList();

		for (int i = 0; i < item.length; i++) {
			if ((item [i].getModifiers() & mods) != 0) {
				list.add (item [i]);
			}
		}

		Constructor [] trimmed = new Constructor [list.size()];

		list.toArray (trimmed);
		Arrays.sort (trimmed, comper);

		return (trimmed);
	}

	private Method [] trimMethods (Method [] item, int mods)
	{
		List list = new LinkedList();

		for (int i = 0; i < item.length; i++) {
			if ((item [i].getModifiers() & mods) != 0) {
				list.add (item [i]);
			}
		}

		Method [] trimmed = new Method [list.size()];

		list.toArray (trimmed);
		Arrays.sort (trimmed, comper);

		return (trimmed);
	}

	private Class [] trimClasses (Class [] item, int mods)
	{
		List list = new LinkedList();

		for (int i = 0; i < item.length; i++) {
			if ((item [i].getModifiers() & mods) != 0) {
				list.add (item [i]);
			}
		}

		Class [] trimmed = new Class [list.size()];

		list.toArray (trimmed);
		Arrays.sort (trimmed, comper);

		return (trimmed);
	}

	private Comper comper = new Comper();

	private class Comper implements Comparator
	{
		public int compare (Object o1, Object o2)
		{
			if (o1 instanceof Class) {
				Class c1 = (Class) o1;
				Class c2 = (Class) o2;
				String n1 = c1.getName();
				String n2 = c2.getName();

				if (c1.isArray()) {
					n1 = c1.getComponentType().getName();
				}
				if (c2.isArray()) {
					n2 = c2.getComponentType().getName();
				}

				return (n1.compareTo (n2));
			}

			Member m1 = (Member) o1;
			Member m2 = (Member) o2;
			String n1 = m1.getName();
			String n2 = m2.getName();

			if (( ! n1.equals (n2)) || (m1 instanceof Field)) {
				return (n1.compareTo (n2));
			}

			if (m1 instanceof Constructor) {
				return (compareArgs (
					((Constructor) m1).getParameterTypes(),
					((Constructor) m2).getParameterTypes()));
			}

			return (compareArgs (((Method) m1).getParameterTypes(),
				((Method) m2).getParameterTypes()));
		}

		private int compareArgs (Class [] p1, Class [] p2)
		{
			int n = p1.length - p2.length;

			if (n != 0) {
				return (n);
			}

			for (int i = 0; i < p1.length; i++) {
				n = comper.compare (p1 [i], p2 [i]);

				if (n != 0) {
					return (n);
				}
			}

			return (0);
		}

		public boolean equals (Object o1)
		{
			return (false);
		}
	}

	// ---------------------------------------------------------------

	public String getSimpleClassName (String name)
	{
		String rep = name.replace ('$', '.');
		int n = rep.lastIndexOf (".");

		if (n == -1) {
			return (rep);
		}

		return (rep.substring (n + 1));
	}

	public String getSimpleClassName (Class clas)
	{
		return (getSimpleClassName (clas.getName()));
	}


	public String getClassName (String name)
	{
		String pkgname = packg.getName();

		if (name.startsWith ("java.lang")) {
			return (name.substring ("java.lang".length() + 1));
		}

		if (name.startsWith (pkgname)) {
			String simple = name.substring (pkgname.length() + 1);

			// is the package name the whole prefix?
			if (simple.indexOf (".") == -1) {
				return (simple.replace ('$', '.'));
			}
		}

		return (name.replace ('$', '.'));
	}

	public String getClassName (Class clas)
	{
		return (getClassName (clas.getName()));
	}

	public String getClassName()
	{
		return (getClassName (thisClass));
	}

	public String getModifierNames (int mods)
	{
		if (thisClass.isInterface()) {
			mods &= ~Modifier.ABSTRACT;
		}

		return (Modifier.toString (mods));
	}

	public String getModifierNames()
	{
		return (getModifierNames (thisClass.getModifiers()));
	}

	private void indent (StringBuffer sb, String indent, int level)
	{
		for (int i = 0; i < level; i++) {
			sb.append (indent);
		}
	}

	// ---------------------------------------------------------------

	public String toString()
	{
		return (toString ("\t"));
	}

	public String toString (String indent)
	{
		return (toString (indent, true));
	}

	public String toString (String indent, boolean listPackage)
	{
		StringBuffer sb = new StringBuffer();

		stringify (sb, indent, 0, listPackage);

		return (sb.toString());
	}

	void stringify (StringBuffer sb, String indent,
		int indentLevel, boolean listPackage)
	{
		if (listPackage) {
			indent (sb, indent, indentLevel);
			sb.append ("package ").append (packg.getName());
			sb.append ("\n\n");
		}

		indent (sb, indent, indentLevel);
		sb.append (getModifierNames());

		if (thisClass.isInterface()) {
			sb.append (" ");
		} else {
			sb.append (" class ");
		}

		// HACK!  This should be better parameterized
		sb.append ("<emphasis>");
		sb.append (getClassName());
		sb.append ("</emphasis>");

		Class sc = getSuperClass();

		if (sc != null) {
			sb.append ("\n");
			indent (sb, indent, indentLevel);
			sb.append (indent).append ("extends ");
			sb.append (getClassName (sc));
		}

		if (interfaces.length > 0) {
			sb.append ("\n");
			indent (sb, indent, indentLevel);

			sb.append (indent);

			if (isInterface()) {
				sb.append ("extends ");
			} else {
				sb.append ("implements ");
			}

			for (int i = 0; i < interfaces.length; i++) {
				if (i != 0) {
					sb.append (", ");
				}

				sb.append (getClassName (interfaces [i]));
			}
		}

		sb.append ("\n");
		indent (sb, indent, indentLevel);
		sb.append ("{");
		sb.append ("\n");

		boolean needsep = false;

		if (fields.length > 0) {
			printMembers (sb, fields, indent, indentLevel + 1);
			needsep = true;
		}

		if (constructors.length > 0) {
			if (needsep) sb.append ("\n");
			printMembers (sb, constructors, indent, indentLevel + 1);
			needsep = true;
		}

		if (methods.length > 0) {
			if (needsep) sb.append ("\n");
			printMembers (sb, methods, indent, indentLevel + 1);
			needsep = true;
		}

		if (internalClasses.length > 0) {
			if (needsep) sb.append ("\n");

			for (int i = 0; i < internalClasses.length; i++) {
				if ( ! Modifier.isPublic (classes [i].getModifiers())) {
					continue;
				}

				if (i != 0) sb.append ("\n");

				internalClasses [i].stringify (sb, indent, indentLevel + 1, false);
				// nl is suppressed at end of classes
				sb.append ("\n");
			}
		}

		indent (sb, indent, indentLevel);
		sb.append ("}");
	}

	private void printType (StringBuffer sb, Class type)
	{
		if (type.isArray()) {
			sb.append (getClassName (type.getComponentType()));
			sb.append (" []");
		} else {
			sb.append (getClassName (type));
		}
	}

	private void printMembers (StringBuffer sb, Member [] members,
		String indent, int indentLevel)
	{
		for (int i = 0; i < members.length; i++) {
			Member member = members [i];
			int mods = member.getModifiers();

			if (Modifier.isPrivate (mods)) {
				continue;
			}

			if (( ! Modifier.isPublic (mods)) &&
				(! Modifier.isProtected (mods)))
			{
				continue;	// package private
			}

			indent (sb, indent, indentLevel);
			sb.append (getModifierNames (mods));

			if (member instanceof Field) {
				Field field = (Field) member;

				sb.append (" ");
				printType (sb, field.getType());
			}

			if (member instanceof Method) {
				Method method = (Method) member;

				sb.append (" ");
				printType (sb, method.getReturnType());
			}

			sb.append (" ");
			sb.append ("<emphasis>");
			sb.append (getClassName (member.getName()));
			sb.append ("</emphasis>");

			if ((member instanceof Constructor) ||
				(member instanceof Method))
			{
				printArgs (sb, member);
				printExcept (sb, member, indent, indentLevel);
			}

			if (Modifier.isAbstract (mods)) {
				sb.append (";");
			}

			sb.append ("\n");
		}
	}

	private void printArgs (StringBuffer sb, Member member)
	{
		Class [] paramTypes = null;

		if (member instanceof Constructor) {
			Constructor c = (Constructor) member;
			paramTypes = c.getParameterTypes();
		}

		if (member instanceof Method) {
			Method m = (Method) member;
			paramTypes = m.getParameterTypes();
		}

		if ((paramTypes == null) || (paramTypes.length == 0)) {
			sb.append ("()");
			return;
		}

		sb.append (" (");

		String [] names = getArgNames (member, paramTypes);

		for (int i = 0; i < paramTypes.length; i++) {
			Class p = paramTypes [i];

			if (i != 0) {
				sb.append (", ");
			}

			printType (sb, p);

			if (names == null) {
				sb.append (" XXX");
			} else {
				sb.append (" ").append (names [i]);
			}
		}

		sb.append (")");
	}

	private void printExcept (StringBuffer sb, Member member,
		String indent, int indentLevel)
	{
		Class [] exs = null;

		if (member instanceof Constructor) {
			exs = ((Constructor) member).getExceptionTypes();
		}

		if (member instanceof Method) {
			exs = ((Method) member).getExceptionTypes();
		}

		if (exs.length == 0) {
			return;
		}

		sb.append ("\n");
		indent (sb, indent, indentLevel + 1);
		sb.append ("throws ");

		for (int i = 0; i < exs.length; i++) {
			if (i != 0) {
				sb.append (", ");
			}

			sb.append (getClassName (exs [i]));
		}
	}

	// ---------------------------------------------------------------

	private String [] zeroStringArray = new String [0];

	private String [] getArgNames (Member member, Class [] params)
	{
		if (params.length == 0) {
			return (zeroStringArray);
		}

		CharSequence cs = null;

		try {
			// This is inefficient, the file is loaded for
			// each constructor/method.  The source file should
			// be loaded in the constructor and re-used.
			cs = loadFile (srcFileName (thisClass.getName()));
		} catch (Exception e) {
			System.out.println ("Can't open file: " + e);
			return (null);
		}

		boolean isMethod = (member instanceof Method);
		StringBuffer sb = new StringBuffer();
		String s;

		sb.append ("(?ms)^\\s*");

		s = getModifierNames (member.getModifiers());
		sb.append (s.replaceAll ("\\s+", "\\\\s+"));
		sb.append ("\\s+");

		if (isMethod) {
			Method method = (Method) member;

			appendRegexType (sb, method.getReturnType());

			sb.append ("\\s+");
		}

		sb.append (getSimpleClassName (member.getName()));

		sb.append ("\\s*\\(");

		for (int i = 0; i < params.length; i++) {
			if (i != 0) {
				sb.append (",\\s*");
			}
			sb.append ("\\s*\\w*?\\s*");

			Class p = params [i];

			appendRegexType (sb, p);

			sb.append ("\\s+");
			sb.append ("(\\w+)\\s*");
		}

		sb.append ("\\)");

		String regex = sb.toString();
		Pattern pat = Pattern.compile (regex);
		Matcher matcher = pat.matcher (cs);

		if ( ! matcher.find()) {
			System.out.println (getSimpleClassName (thisClass) + ": no match='" + regex + "'");
			return (null);
		}

		int count = matcher.groupCount();
		String [] names = new String [count];

		for (int i = 0; i < count; i++) {
			names [i] = matcher.group (i + 1);
		}

		return (names);
	}

	private void appendRegexType (StringBuffer sb, Class t)
	{
		if (t.isArray()) {
			sb.append (getSimpleClassName (t.getComponentType()));
			sb.append ("\\s*\\[\\]\\s*");
		} else {
			sb.append (getSimpleClassName (t));
		}

	}

	private String srcFileName (String className)
	{
		return (SRC_DIR + "/" + className.replaceAll ("\\.", "/") + ".java");
	}

	private CharSequence loadFile (String name)
		throws Exception
	{
		BufferedReader in = new BufferedReader (new FileReader (name));
		StringBuffer sb = new StringBuffer();
		String s;

		while ((s = in.readLine()) != null) {
			sb.append (s);
			sb.append ("\n");
		}

		in.close();

		return sb;
	}
	// ---------------------------------------------------------------

	public static void main (String[] argv)
		throws Exception
	{
		for (int i = 0; i < argv.length; i++) {
			ClassInfo ci = new ClassInfo (argv [i]);

			System.out.println (new ClassInfo (argv [i]).toString());
		}
	}
}

