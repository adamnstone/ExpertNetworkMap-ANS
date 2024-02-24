import os

def save_exists(folder_name, name):
    return os.path.exists(f"{folder_name}/{name}.obj")

save_exists("people_saves", 2018)