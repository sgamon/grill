#!/bin/bash
if [ $# -ne 1 ]; then
  echo "Usage: $0 <output file>";
  exit -1;
fi
#
FILENAME="$1";
/bin/rm -f ${FILENAME}.txt;
touch ${FILENAME}.txt;
echo "/*****************************************************" >> ${FILENAME}.txt;
echo "AUTO GENERATED BY RUNNING THE FOLLOWING SHELL COMMAND:" >> ${FILENAME}.txt;
echo "    ${0} $@" >> ${FILENAME}.txt;
echo "" >> ${FILENAME}.txt;
echo "*****************************************************/" >> ${FILENAME}.txt;
#
echo "use tsdb;" >> ${FILENAME}.txt;
echo "" >> ${FILENAME}.txt;
for file in `ls *.sql | sort -tV -k 2,2n` # Check out this kick-ass sort options
do 
  echo "-- $file --" >> ${FILENAME}.txt; 
  echo "" >> ${FILENAME}.txt;
  cat "$file" >> ${FILENAME}.txt; 
  echo "" >> ${FILENAME}.txt;
done
#
cat ${FILENAME}.txt | perl -pe 's/\xEF\xBB\xBF//' > t.sql;
/bin/mv -f t.sql ${FILENAME};

