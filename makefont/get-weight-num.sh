#!/bin/sh
if [ "$1" = "Light" ]; then
  echo 300
elif [ "$1" = "Medium" ]; then
  echo 500
elif [ "$1" = "DemiBold" ]; then
  echo 600
else
  echo 400
fi