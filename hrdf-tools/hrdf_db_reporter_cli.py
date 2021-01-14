import argparse
import os
import re
import sys

from inc.HRDF.Stops_Reporter.stops_reporter import HRDF_Stops_Reporter
from inc.HRDF.HRDF_Parser.hrdf_helpers import compute_formatted_date_from_hrdf_db_path
from inc.HRDF.db_helpers import compute_db_tables_report

parser = argparse.ArgumentParser(description = 'Generate stops report from HRDF DB')
parser.add_argument('-p', '--path', help='Path to HRDF DB')

args = parser.parse_args()
db_path = args.path

if db_path is None:
    print("ERROR, use with --path")
    sys.exit(1)

compute_db_tables_report(db_path=db_path)