GNU_SED=sed
GNU_GREP=grep
GNU_AWK=awk
GET_PATH_FOR_FONTFORGE := echo
ifneq ($(OS),Windows_NT)
    UNAME_OS := $(shell uname -s)
    ifeq ($(UNAME_OS),Darwin)
        GNU_SED=gsed
        GNU_GREP=ggrep
        GNU_AWK=gawk
    endif
    # fontforge AppImage doesn't see the current directory https://github.com/fontforge/fontforge/issues/5067
    GET_PATH_FOR_FONTFORGE := sh -c 'echo $$(pwd)/$$1' --
endif
GWV=gwv
UNICODE_VERSION = 15.1.0
#最新は15.1.0
#最新の花園は10.0.0
IVD_VERSION = 2022-09-13
#最新は2022-09-13
#最新の花園は2016-08-15
PREFER_SOURCE = 
#!j, !g!など。あるいは空文字列にすれば無印グリフ使用