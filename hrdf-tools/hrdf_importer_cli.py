import argparse
import os
import sys

from inc.HRDF.db_importer import HRDF_DB_Importer
from inc.HRDF.HRDF_Parser.hrdf_helpers import compute_formatted_date_from_hrdf_folder_path

parser = argparse.ArgumentParser(description = 'Import HRDF folder into a SQLite DB')
parser.add_argument('-p', '--path', help='Path to HRDF folder')
parser.add_argument('-o', '--output', help='SQLite output filename')

args = parser.parse_args()
input_path = args.path

if input_path is None:
    print("ERROR, use with --path")
    sys.exit(1)

hrdf_path = os.path.abspath(input_path)

db_filename = None
if args.output:
    db_filename = args.output
else:
    formatted_date = compute_formatted_date_from_hrdf_folder_path(hrdf_path)
    
    if formatted_date is None:
        print(f"CANT read date from HRDF path: '{hrdf_path}'")
        print(f"Use --filename to override")
        sys.exit(1)
    
    db_filename = f"hrdf_{formatted_date}.sqlite"

dir_path = os.path.dirname(os.path.realpath(__file__))
db_path = f"{dir_path}/tmp/{db_filename}"
db_path = os.path.abspath(db_path)

print(f"IMPORT to: {db_path}")

hrdf_importer = HRDF_DB_Importer(hrdf_path, db_path)
hrdf_importer.parse_all()