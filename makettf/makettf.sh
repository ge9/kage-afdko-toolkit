cd `dirname $0`
for weightstr in Light Regular Medium Classic #DemiBold
do
make NazoMin-$weightstr.ttf
make NazoMin+-$weightstr.ttf
make fontsample-$weightstr.ttf
done
