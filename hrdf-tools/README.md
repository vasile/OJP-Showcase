### HRDF DB importer

Issue: https://github.com/openTdataCH/OJP-Showcase/issues/13

Python tool that imports a HRDF v5.40 dataset into SQLite DB.
The DB schema is specified in [hrdf-tools/inc/HRDF/hrdf_schema.yml](inc/HRDF/hrdf_schema.yml).

Usage: `hrdf_importer_cli.py [-h] [-p PATH] [-o OUTPUT]`

|Param|Long|Description|Example|
|--|--|--|--|
|-p|--path|input path to HRDF folder, relative or absolute|data/hrdf-src/opentransportdata.swiss-hrdf/current/oev_sammlung_ch_hrdf_5_40_41_2021_20201220_033904|
|-o|--output|path to output SQLite DB, relative or absolute|/tmp/foo.db|

`$ python3 hrdf_importer_cli.py -p data/hrdf-src/opentransportdata.swiss-hrdf/current/oev_sammlung_ch_hrdf_5_40_41_2021_20201220_033904`

The script tries to guess the HRDF date from the path, in the case above will create and fill `hrdf-tools/tmp/hrdf_2020-12-20.sqlite` DB.

See [hrdf-tools/docs/hrdf_importer_cli_sample_run.log](docs/hrdf_importer_cli_sample_run.log) for sample output.

### HRDF DB reporter

Issue: https://github.com/openTdataCH/OJP-Showcase/issues/13

Small tool that generates a report about tables and total number of rows in a given database.

Usage: `hrdf_db_reporter_cli.py [-h] [-p PATH]`

|Param|Long|Description|Example|
|--|--|--|--|
|-p|--path|input path to HRDF DB, relative or absolute|hrdf-tools/tmp/hrdf_2021-01-10.sqlite|

See [hrdf-tools/docs/hrdf_db_reporter_cli_sample_run.log](docs/hrdf_db_reporter_cli_sample_run.log) for sample output/

### Stops Reporter Tool

Issue: https://github.com/openTdataCH/OJP-Showcase/issues/3

Python tool that generates a CSV report for the HRDF stations, the fields are specified in the Github issue.
The CSV file is converted (manual for now) to Excel format and uploaded to[hrdf-tools/export/stops_reporter](hrdf-toolsexport/stops_reporter)

Usage: `stops_reporter_cli.py [-h] [-p PATH]`

|Param|Long|Description|Example|
|--|--|--|--|
|-p|--path|input path to HRDF DB, relative or absolute|hrdf-tools/tmp/hrdf_2021-01-10.sqlite|

`$ python3 stops_reporter_cli.py -p tmp/hrdf_2020-12-06.sqlite`
See [hrdf-tools/docs/stops_reporter_cli_sample_run.log](docs/stops_reporter_cli_sample_run.log) for sample output.

