#!/bin/sh
cat $1 | sed -r 's/(.*)\t(.*)/,[[\1]],[[\2]]/'