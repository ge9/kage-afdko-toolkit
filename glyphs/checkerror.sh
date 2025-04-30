#!/bin/sh
# fails with error if the given file contains "error" line
! grep '^****error' $1 || (rm $1 && echo [[ERROR]]: An error glyph found. Please check the GlyphWiki data. && false)
