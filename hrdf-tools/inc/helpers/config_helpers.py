import os
import yaml

def load_yaml_config(config_path: str, app_path: str):
    config_file_handler = open(config_path)

    config_s = config_file_handler.read()
    config_s = config_s.replace('[APP_PATH]', app_path)
    config = yaml.safe_load(config_s)
  
    config_file_handler.close()

    return config