cd `dirname $0`
if ! makeotf -h > /dev/null 2>&1; then
    echo ERROR: \"makeotf -h\" failed. AFDKO missing?
    exit 1
fi
# test make a font to build common files
make fontdebug-Classic.otf
for weightstr in Light Regular Medium Classic #DemiBold
do
make NazoMin-$weightstr.otf &
make NazoMin+-$weightstr.otf &
make fontsample-$weightstr.otf &
make fontdebug-$weightstr.otf &
done
wait
