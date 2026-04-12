cd `dirname $0`
rm -rf ./work-*
for charset in kanjidebug kanjisample 45-ucs-SHSans 99-extB-F
do
    for weightstr in Light Regular Medium #DemiBold
    do
        make $weightstr.$charset.simpl.svg
        mv $weightstr.$charset.simpl.svg $weightstr.$charset.final.svg
    done
    # don't use fontforge simplification for "Classic" 
    make Classic.$charset.nosimpl.svg
    mv Classic.$charset.nosimpl.svg Classic.$charset.final.svg
done
