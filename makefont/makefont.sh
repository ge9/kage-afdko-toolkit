cd `dirname $0`
export NZM_FONT_VER=0.010
for weightstr in Light Regular Medium Classic #DemiBold
do
./fileenv ./45Nazo.env env NZM_WEIGHT_STR=$weightstr make NazoMin-$weightstr.otf
./fileenv ./99Nazo.env env NZM_WEIGHT_STR=$weightstr make NazoMin+-$weightstr.otf
./fileenv ./kanjisample.env env NZM_WEIGHT_STR=$weightstr make fontsample-$weightstr.otf
done
