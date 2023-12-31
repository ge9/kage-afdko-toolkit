config_dir=../config
include $(config_dir)/config.mk

%.ttf:
	otf2ttf ../makefont/$*.otf
	mv ../makefont/$*.ttf ./$*.ttf
	fontforge -script `$(GET_PATH_FOR_FONTFORGE) addhint.pe` `$(GET_PATH_FOR_FONTFORGE) $*.ttf`
clean:
	rm -f *.ttf