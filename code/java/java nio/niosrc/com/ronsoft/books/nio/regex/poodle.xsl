<?xml version='1.0'?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

<!--
	XSL stylesheet to transform the simple XML output of Poodle.java
	to HTML for display in a browser.  Use an XSL processor such as
	xalan with this stylesheet to convert the XML to HTML.

	@author Ron Hitchens (ron@ronsoft.com)
  -->

<xsl:output method="html"/>

<xsl:template match="/">
	<html><head><title>Poodle Doo</title></head><body>
	<xsl:apply-templates/>
	</body></html>
</xsl:template>

<xsl:template match="table">
	<table align="center" border="1" cellpadding="5">
	<xsl:apply-templates/>
	</table>
</xsl:template>

<xsl:template match="row">
	<tr>
	<xsl:apply-templates/>
	</tr>
</xsl:template>

<xsl:template match="entry">
	<td>
	<xsl:apply-templates/>
	</td>
</xsl:template>

<xsl:template match="head">
	<th>
	<xsl:apply-templates/>
	</th>
</xsl:template>

<xsl:template match="entry/value">
	<xsl:if test="position() != 1">
		<xsl:text>, </xsl:text>
	</xsl:if>
	<xsl:call-template name="simplequote"/>
</xsl:template>

<xsl:template name="simplequote" match="value">
	<code>
	<xsl:text>&quot;</xsl:text>
	<xsl:apply-templates/>
	<xsl:text>&quot;</xsl:text>
	</code>
</xsl:template>

</xsl:stylesheet>
