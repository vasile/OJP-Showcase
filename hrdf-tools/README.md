### HRDF DB importer

Python tool that imports a HRDF v5.40 dataset into SQLite DB.
The DB schema is specified in [hrdf-tools/inc/HRDF/hrdf_schema.yml](inc/HRDF/hrdf_schema.yml).

Usage: `hrdf_importer_cli.py [-h] [-p PATH] [-o OUTPUT]`

|Param|Long|Description|Example|
|--|--|--|--|
|-p|--path|input path to HRDF folder, relative or absolute|data/hrdf-src/opentransportdata.swiss-hrdf/current/oev_sammlung_ch_hrdf_5_40_41_2021_20201220_033904|
|-o|--output|path to output SQLite DB, relative or absolute|/tmp/foo.db|

`$ python3 hrdf_importer_cli.py -p data/hrdf-src/opentransportdata.swiss-hrdf/current/oev_sammlung_ch_hrdf_5_40_41_2021_20201220_033904`

The script tries to guess the HRDF date from the path, in the case above will create and fill `hrdf-tools/tmp/hrdf_2020-12-20.sqlite` DB.

See [hrdf-tools/docs/hrdf_importer_cli_sample_run.log](docs/hrdf_importer_cli_sample_run.log) for sample output


