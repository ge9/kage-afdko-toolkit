cd `dirname $0`
for charset in kanjisample 45-ucs-SHSans 99-extB-F
do
    for weightstr in Light Regular Medium #DemiBold
    do
        make $weightstr.$charset.simpl.svg
        mv $weightstr.$charset.simpl.svg $weightstr.$charset.final.svg
    done
    make Classic.$charset.nosimpl.svg
    mv Classic.$charset.nosimpl.svg Classic.$charset.final.svg
done
