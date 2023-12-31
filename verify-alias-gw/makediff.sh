#!/bin/sh
paste $1.name.body $2.name.body | $GNU_AWK '{print $1 == $2}' | paste - $1.name $2.name | grep ^0 | cut -f 2-3
