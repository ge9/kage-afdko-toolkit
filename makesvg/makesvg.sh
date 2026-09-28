cd `dirname $0`
rm -rf ./work-*
CHARSET="kanjidebug kanjisample 45-ucs-SHSans 99-extB-F"
for charset in $CHARSET
do
    for weightstr in Light Regular Medium #DemiBold
    do
        make $weightstr.$charset.simpl.svg &
    done
    # don't use fontforge simplification for "Classic" 
    make Classic.$charset.nosimpl.svg &
done
wait
# move
for charset in $CHARSET
do
    for weightstr in Light Regular Medium #DemiBold
    do
        mv $weightstr.$charset.simpl.svg $weightstr.$charset.final.svg
    done
    mv Classic.$charset.nosimpl.svg Classic.$charset.final.svg
done
