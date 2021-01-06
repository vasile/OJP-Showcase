import yaml
import os

from .log_helpers import log_message

from .HRDF_Parser.parse_bitfeld import import_db_bitfeld
from .HRDF_Parser.parse_gleis import import_db_gleis

class HRDF_DB_Importer:
    def __init__(self, hrdf_path, db_path):
        self.hrdf_path = hrdf_path
        self.db_path = db_path
        self.db_schema_config = self._load_schema_config()

    def parse_all(self):
        log_message("START")
        
        import_db_bitfeld(self.hrdf_path, self.db_path, self.db_schema_config)
        import_db_gleis(self.hrdf_path, self.db_path, self.db_schema_config)

        log_message("DONE")

    # private
    def _load_schema_config(self):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        db_schema_path = os.path.abspath(dir_path + "/hrdf_schema.yml")
        db_schema_config = yaml.safe_load(open(db_schema_path))

        return db_schema_config
