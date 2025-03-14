#!/bin/bash

REPORT_DIR="reports/"
REPORT_FILE="recent_report"
PROCESSED_REPORT="processed_report"
MAX_HISTORY_SIZE=48

cd /var/www/4P02-course-project/backend/pytest

pytest /var/www/4P02-course-project/backend/pytest --json-report --json-report-omit keywords streams root --json-report-verbosity 2 --json-report-indent 2 --json-report-file "$REPORT_DIR""$REPORT_FILE"

python3 process_test_report.py "$REPORT_DIR" "$REPORT_FILE" "$MAX_HISTORY_SIZE" 

ln -sfT "${REPORT_DIR}${PROCESSED_REPORT}_0" api_status_report

for ((i="$MAX_HISTORY_SIZE"; i>=1; i--))
do
    if [ -f "${REPORT_DIR}${PROCESSED_REPORT}_${i}" ]; then
        END=$((i+1))
        mv "${REPORT_DIR}${PROCESSED_REPORT}_${i}" "${REPORT_DIR}${PROCESSED_REPORT}_${END}"
    fi
done

END=$((MAX_HISTORY_SIZE+1))

if [ -f "${REPORT_DIR}${PROCESSED_REPORT}_${END}" ]; then
    rm "${REPORT_DIR}${PROCESSED_REPORT}_${END}"
fi


cp "${REPORT_DIR}${PROCESSED_REPORT}_0" "${REPORT_DIR}${PROCESSED_REPORT}_1"

ln -sfT "${REPORT_DIR}${PROCESSED_REPORT}_1" api_status_report
