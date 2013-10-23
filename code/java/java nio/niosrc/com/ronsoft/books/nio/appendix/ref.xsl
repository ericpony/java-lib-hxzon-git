<?xml version="1.0"?>

<!--
	This stylesheet transforms the ref.xml file, which is a terse
	summary of the packages as classes, into a DBLite appendix with
	class API information.
	A Java class is invoked as an extension function to extract the
	class API information directly using the reflection API.

	Created: May 2002
  -->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	version="1.0"
	xmlns:java="http://xml.apache.org/xslt/java"
	exclude-result-prefixes="java">


<xsl:template match="appendix">
	<appendix>
		<xsl:attribute name="id">
			<xsl:value-of select="@id"/>
		</xsl:attribute>
		<xsl:apply-templates select="title"/>
	<simplesect>
		<xsl:apply-templates select="desc"/>
	</simplesect>

	<xsl:apply-templates select="package">
		<xsl:sort select="@name"/>
	</xsl:apply-templates>
	</appendix>
</xsl:template>

<xsl:template match="package">
	<sect1><title>Package <type><xsl:value-of select="@name"/></type></title>
	<xsl:apply-templates select="desc"/>
	<xsl:apply-templates select="class">
		<xsl:sort select="@name"/>
		<xsl:with-param name="pkg" select="@name"/>
	</xsl:apply-templates>
	</sect1>
</xsl:template>

<xsl:template match="class">
	<xsl:param name="pkg">java.lang</xsl:param>
	<sect2><title><type><xsl:value-of select="@name"/></type></title>
	<xsl:apply-templates select="desc"/>

	<xsl:variable name="api" select="java:com.ronsoft.books.nio.appendix.ClassXml.getClassApi($pkg, @name, @protected)"/>

	<blockquote><programlisting><xsl:value-of select="$api"/></programlisting></blockquote>

	<para>
		<xsl:apply-templates select="see">
			<xsl:sort select="text()"/>
		</xsl:apply-templates>
	</para>
	</sect2>
</xsl:template>

<xsl:template match="see">
</xsl:template>

<xsl:template match="desc">
	<para>
		<xsl:apply-templates/>
	</para>
</xsl:template>

<xsl:template match="see">
	<xsl:choose>
		<xsl:when test="position()=1">
			<emphasis>
			<xsl:text>See also: </xsl:text>
			</emphasis>
		</xsl:when>
		<xsl:otherwise>
			<xsl:text>, </xsl:text>
		</xsl:otherwise>
	</xsl:choose>
	<classname>
		<xsl:apply-templates/>
	</classname>
</xsl:template>

<xsl:template match="*">
		<xsl:copy-of select="."/>
</xsl:template>

<!--
<xsl:template match="emphasis">
	<xsl:element name="emphasis">
		<xsl:apply-templates/>
	</xsl:element>
</xsl:template>
<xsl:template match="type">
	<xsl:element name="type">
		<xsl:apply-templates/>
	</xsl:element>
</xsl:template>
-->

</xsl:stylesheet>
