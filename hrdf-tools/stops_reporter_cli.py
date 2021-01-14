import argparse
import os
import re
import sys

from inc.HRDF.Stops_Reporter.stops_reporter import HRDF_Stops_Reporter
from inc.HRDF.HRDF_Parser.hrdf_helpers import compute_formatted_date_from_hrdf_db_path

parser = argparse.ArgumentParser(description = 'Generate stops report from HRDF DB')
parser.add_argument('-p', '--path', help='Path to HRDF DB')

args = parser.parse_args()
db_path = args.path

if db_path is None:
    print("ERROR, use with --path")
    sys.exit(1)

db_path = os.path.abspath(db_path)

formatted_date = compute_formatted_date_from_hrdf_db_path(db_path)
stops_report_filename = f"stops_report_{formatted_date}" # without extension

dir_path = os.path.dirname(os.path.realpath(__file__))
sr_json_path = os.path.abspath(dir_path + f"/tmp/{stops_report_filename}.json")
sr_csv_path = os.path.abspath(dir_path + f"/tmp/{stops_report_filename}.csv")

sr = HRDF_Stops_Reporter(db_path)
stops_report_json = sr.generate_json(sr_json_path)
sr.generate_csv(stops_report_json, sr_csv_path)