import requests, base64, urllib.parse, gitlab, re, pickle, os, time, json
from bs4 import BeautifulSoup
import pandas as pd
from urllib.parse import urljoin
from load_model_and_classify import Classifier

GL = gitlab.Gitlab('https://gitlab.fabcloud.org', api_version=4)
VALID_EXTENSOINS = ["html", "txt", "md"]
ALL_LAB_SUBGROUP_IDS = {
    2024: 11038,
    2023: 8145,
    2022: 3632,
    2021: 2917,
    2020: 2140,
    2019: 1619,
    2018: 852
}

YEAR_SCRAPING_RANGE = [2024]

CHARACTERS_EACH_DIRECTION_TOPIC_DETECTION = 1000
TOPICS = [
    "Prefab",
    "Computer-Aided Design",
    "Computer-Controlled Cutting",
    "Embedded Programing",
    "3D Scanning and Printing",
    "Electronics Design",
    "Computer-Controlled Machining",
    "Electronics Production",
    "Mechanical Design, Machine Design",
    "Input Devices",
    "Moulding and Casting",
    "Output Devices",
    "Embedded Networking and Communications",
    "Interface and Application Programming",
    "Wildcard Week",
    "Applications and Implications",
    "Invention, Intellectual Property and Business Models",
    "Final Project",
    "Other"
]

TOPIC_SEARCH_TERMS = [
    [],
    ["Computer-Aided Design", "freecad"], 
    ["Laser Cut", "CCC week", "Computer-Controlled Cutting"],
    ["Embedded Programming", "MicroPython", "C\+\+", "python" "cpp", "ino", "Arduino IDE", "programming week"], 
    ["3D Printing", "3D Scanning", "TPU", "PETG", "filament", "Prusa", "3d printing week", "polyCAM", "3D Scanning and Printing", "3d printers", "3d printer"], # not PLA because in too many other words
    ["EagleCAD", "Eagle", "KiCAD", "Routing", "Auto-Route", "Trace", "Footprint", "electronic design", "Electronics Design"],
    ["CNC", "Shopbot", "Computer-Controlled Machining"],
    ["Mill", "Milling", "copper", "electronic production", "Electronics Production"],
    ["Machine week", "actuation and automation", "Mechanical Design, Machine Design"],
    ["Input Devices", "Input Device", "Inputs Devices", "Electronic input", "sensor", "Input Devices"],
    ["Part A", "Part B", "pot time", "pottime", "molding", "moulding", "casting", "cast", "Moulding and Casting"],
    ["Output Device", "Outputs Devices", "Outputs Device", "Servo", "motor", "Output Devices"],
    ["SPI", "UART", "I2C", "RX", "TX", "SCL", "networking week", "networking", "network", "networking and communications", "Embedded Networking and Communications"],
    ["Interfacing Week", "interface week", "Interface and Application Programming"],
    ["Wildcard Week"],
    ["Applications and Implications", "Bill-of-Materials", "Bill of materials"],
    ["Patent", "trademark", "Invention, Intellectual Property and Business Models"],
    ["Final Project"],
    []

] 

# returns file content from a repo
def get_file_content(file_path, project_id, default_branch_name):
    #print(f"Getting file content: {file_path}, {project_id}")
    safe_url = f"https://gitlab.fabcloud.org/api/v4/projects/{project_id}/repository/files/{urllib.parse.quote(file_path, safe='')}?ref={default_branch_name}"
    #print(safe_url)
    while True:
        try:
            response = requests.get(safe_url).json()
            break
        except requests.exceptions.ConnectTimeout:
            pass
        except requests.exceptions.ReadTimeout:
            pass
    if 'message' in response:
        if '404' in response['message']:
            print(f"404 ERROR from {safe_url}")
            return
    encrypted_blob = response['content']

    decrypted_text = base64.b64decode(encrypted_blob)
    return decrypted_text

# get name of GitLab repo
def get_repo_name(project_id):
    if save_exists("repo_names", f"{project_id}"):
        return load_obj("repo_names", f"{project_id}")
    safe_url = f"https://gitlab.fabcloud.org/api/v4/projects/{project_id}"
    #print(safe_url)
    try:
        response = requests.get(safe_url).json()
    except:
        print(requests.get(safe_url), safe_url)
        quit()
    web_url = response['web_url']
    if 'message' in response:
        if '404' in response['message']:
            print(f"404 ERROR from {safe_url}")
            return

    to_return = response['name'], gitlab_url_to_site_url(f"{web_url}/") # / to make it consistent with the name lists with urljoin and the a's hrefs

    save_obj("repo_names", to_return, f"{project_id}")

    return to_return

# get a list of the subgroups of a GitLab project
def get_file_repo_list(id):
    all_file_paths = []
    project = GL.projects.get(id)
    all_directories = project.repository_tree(recursive=True, all=True, per_page=200) # pagination bug patched
    #print("Where")
    for item in all_directories:
        #print(item)
        path = item['path']
        if path.split('.')[-1].lower().strip() in VALID_EXTENSOINS:
            all_file_paths.append(path)
    #print("here")
    return all_file_paths

# get the IDs of the subgroups of a GitLab project
def get_subgroup_ids(group_id):
    safe_url = f"https://gitlab.fabcloud.org/api/v4/groups/{group_id}/subgroups?per_page=999999" # pagination bug patched
    response = None
    while response is None:
        try:
            response = requests.get(safe_url).json()
        except Exception as e:
            print(f"Server timeout- {e}")
            time.sleep(10)
    p_ids = []
    for item in response:
        try:
            p_ids.append(item['id'])
        except:
            print("Error finding subgroups -- skipping")
    return p_ids

# get the IDs of subgprojects of a GitLab project
def get_subproject_ids(group_id):
    safe_url = f"https://gitlab.fabcloud.org/api/v4/groups/{group_id}/projects?per_page=99999" # pagination bug patched
    response = requests.get(safe_url).json()
    p_ids = []
    for item in response:
        p_ids.append(item['id'])
    return p_ids

def name_split_char(year):
    return "." if year < 2021 else " "

# convert a URL to a GitLab repo to a URL to the hosted website
def gitlab_url_to_site_url(gitlab_url):
    return f"https://fabacademy.org/{gitlab_url.split('https://gitlab.fabcloud.org/academany/fabacademy/')[-1]}"

# format student's name to create a unique identifier for each student
def format_name(name_url_tup, year, tup=True):
    if tup:
        name, web_url = name_url_tup
        return f'{"-".join(name.lower().strip().split(name_split_char(year)))};{web_url}' 
    else:
        print("Warning: name generated without URL")
        name = name_url_tup
        return "-".join(name.lower().strip().split(name_split_char(year)))

# remove all links to websites that are not students' repos
def filter_only_student_repos(all_student_repo_ids, all_student_names, year):
    filtered_ids = []
    all_student_urls = [name.split(";")[1].strip() for name in all_student_names]
    for i, id_list in all_student_repo_ids:
        for id in id_list:
            _, web_url = get_repo_name(id)
            if web_url.strip()[:-1] in all_student_urls or web_url.strip() in all_student_urls: # [:-1] to remove ending slash
                filtered_ids.append((i, id))
    return filtered_ids

# get the repo IDs of all fab Academy students
def get_all_student_repo_ids(year, year_subgroup_id, all_student_names):
    if save_exists("student_repo_id_saves", year):
        return load_obj("student_repo_id_saves", year)
    all_student_repo_ids = []
    all_lab_ids = get_subgroup_ids(year_subgroup_id)
    for id in all_lab_ids:
        print(all_lab_ids.index(id)/len(all_lab_ids))
        for sub_id in get_subgroup_ids(id):
            #print(sub_id)
            all_student_repo_ids.append((id, get_subproject_ids(sub_id))) # ((i, get_subproject_ids(sub_id)))
    #print("ALL STUDENT REPO IDs", all_student_repo_ids)
    #print(all_student_repo_ids)
    to_return = filter_only_student_repos(all_student_repo_ids, all_student_names, year)
    #print("FILTERED", to_return)
    save_obj("student_repo_id_saves", to_return, year)
    return to_return

def save_exists(folder_name, name):
    return os.path.exists(f"{folder_name}/{name}.obj")

def load_obj(folder_name, name):
    with open(f"{folder_name}/{name}.obj", "rb") as filehandler:
        return pickle.load(filehandler)

def save_obj(folder_name, obj, name):
    with open(f"{folder_name}/{name}.obj", 'wb') as filehandler: 
        pickle.dump(obj, filehandler)

# go to fabacademy.org website to find student roster and all students' names and links to their websites
def get_all_people(year):
    if save_exists("people_saves", year):
        return load_obj("people_saves", year)

    base_url = f"https://fabacademy.org/{year}/people.html"
    soup = BeautifulSoup(requests.get(base_url).content, 'html.parser')

    if year > 2018:
        lab_divs = soup.find_all("div", {"class": "lab"})

        names = []

        for lab_div in lab_divs:
            lis = lab_div.find_all("li")

            As = [li.find("a") for li in lis]

            names += [f"{a.text.strip().lower().replace(' ', '-')};{urljoin(base_url, a['href'])}" for a in As]        
    else:
        lis = soup.find_all("li")
        names = [f"{li.find('a').text.strip().lower().replace(' ', '-')};{urljoin(base_url, li.find('a')['href'])}" for li in lis]

    save_obj("people_saves", names, year)

    return names

# scan a repo for references to another student's documentation
def get_references(content, year, from_url):
    pattern = re.compile(f"\/20[0-9][0-9]\/labs\/[^\/]+\/students\/(\w|-)+\/")
    people_linked = {}
    for match in pattern.finditer(str(content)):
        full_url = f"https://fabacademy.org{match.group(0)}"
        #print(f"FULL URL {full_url}")
        person = format_name((match.group(0).split("/")[-2], full_url), year)

        link_label = None

        topic_search_start_ind = match.start() - CHARACTERS_EACH_DIRECTION_TOPIC_DETECTION
        if topic_search_start_ind < 0:
            topic_search_start_ind = 0
        topic_search_end_ind = match.end() + CHARACTERS_EACH_DIRECTION_TOPIC_DETECTION
        if topic_search_end_ind > len(content):
            topic_search_end_ind = len(content)
        #print(f"({match.start()}, {match.end()}) -> ({topic_search_start_ind}, {topic_search_end_ind})")
        topic_text = content.decode()[topic_search_start_ind:topic_search_end_ind].lower()

        #print("TOPIC TEXT", topic_text)
        
        for i in range(len(TOPICS)):
            topic = TOPICS[i]
            topic_search_terms = TOPIC_SEARCH_TERMS[i]
            for item in topic_search_terms:
                item_spaces = item.replace("-", " ").replace("/", " ").replace(",", " ").lower().strip()
                if re.search(re.compile(item_spaces.replace(" ",".")), topic_text) or re.search(re.compile(item_spaces.replace(" ","-")), topic_text) or re.search(re.compile(item_spaces), topic_text) or re.search(re.compile(item_spaces.replace(" ","")), topic_text):
                    link_label = topic
        
        if link_label is None:
            link_label = TOPICS[classifier.classifyItem(content)]

        if person in people_linked:
            if link_label in people_linked[person]:
                people_linked[person][link_label] += 1
        else:
            people_linked[person] = {}
            people_linked[person][link_label] = 1

    return people_linked

# combine students' dictionaries of references to other's websites
def combine_reference_dicts(reference_dict_list):
    combined_reference_dict = {}
    for dict in reference_dict_list:
        for key in dict:
            if key in combined_reference_dict:
                for topic_key in dict[key]:
                    if topic_key in combined_reference_dict[key]:
                        combined_reference_dict[key][topic_key] += dict[key][topic_key]
                    else:
                        combined_reference_dict[key][topic_key] = dict[key][topic_key]
            else:
                combined_reference_dict[key] = dict[key] 
    return combined_reference_dict

# convert data to Pandas crosstab matrix, now including subject-area
def format_data_to_matrix(data):
    students = []

    for year_info in data: # [(lab_id: (int), {"Student Name": {"student-referenced": num_references (int), ...}}), ...]
        for student_info in year_info: # (lab_id: (int), {"Student Name": {"student-referenced": num_references (int), ...}})
            lab_id = student_info[0] 
            student_name = list(student_info[1].keys())[0]
            reference_dict = student_info[1][list(student_info[1].keys())[0]]
            students.append(student_name) 

    students_links = [X.split(";")[1] for X in students]

    link_student_dict = {}

    for i in range(len(students)):
        link_student_dict[students_links[i]] = students[i]

    #print("STUDENTS", students)

    df = pd.crosstab(students, students)
    df.rename_axis("Referencing Students", axis=0, inplace=True)
    df.rename_axis("Referenced Students", axis=1, inplace=True)

    df = pd.DataFrame(df, index=df.index, columns=pd.MultiIndex.from_product([df.columns, TOPICS]))

    for student1 in students:
        for student2 in students:
            for topic_name in TOPICS:
                df.at[student1, (student2, topic_name)] = (pd.NA if student1 == student2 else 0)

    def assign_value(referencer_student, referenced_student, num_references, topic):
        if referencer_student == referenced_student or (referencer_student.split(";")[1] == "https://fabacademy.org/2019/labs/crunchlab/students/gianluca-derossi/" and referenced_student.split(";")[1] == "https://fabacademy.org/2018/labs/fablabcrunchlab/students/gianluca-derossi/") or (referenced_student.split(";")[1] == "https://fabacademy.org/2019/labs/crunchlab/students/gianluca-derossi/" and referencer_student.split(";")[1] == "https://fabacademy.org/2018/labs/fablabcrunchlab/students/gianluca-derossi/"): # Gianluca De Rossi had two websites of different years that referenced each other
            print(f"Ignoring self-referenced student {referencer_student}")
        elif referenced_student not in students:
            if referenced_student.split(";")[1] in students_links:
                assign_value(referencer_student, link_student_dict[referenced_student.split(";")[1]], num_references, topic)
            else:
                print("Referenced student isn't a student - URL matched naming convention so regex caught but wasn't checked against student list - skipping")
        else:
            df.loc[referencer_student, (referenced_student, topic)] = num_references

    def get_value(referencer_student, referenced_student, topic):
        return df.loc[referencer_student, (referenced_student, topic)]

    for year_info in data:
        for student_info in year_info:
            student_name = list(student_info[1].keys())[0]
            reference_dict = dict(student_info[1][student_name])
            for referenced_student in reference_dict:
                for reference_type in reference_dict[referenced_student]:
                    num_references = reference_dict[referenced_student][reference_type]
                    assign_value(student_name, referenced_student, num_references, reference_type)

    df.to_csv("final_data.csv", index_label="Referencing Students|Referenced Students")

    return df

# get all of the reference dictionaries of different students for a given year
def get_all_reference_dicts(year, id):
    filename = f"{year}-{id}"
    if save_exists("reference_dict_saves", filename):
        #print(f"Save exists! {load_obj('reference_dict_saves', filename)}")
        return load_obj("reference_dict_saves", filename)
    reference_dict_list = []
    default_branch_name_response = requests.get(f"https://gitlab.fabcloud.org/api/v4/projects/{id}/repository/branches").json()
    default_branch_name = None
    for branch in default_branch_name_response:
        if branch['default']:
            default_branch_name = branch['name']
    if default_branch_name is None:
        print(f"Error: Default Branch Not Found (id: {id}) {default_branch_name_response} - leaving as None")
    try:
        for file in get_file_repo_list(id):
            #print(f"Checking {file}...")
            reference_dict_list.append(get_references(get_file_content(file, id, default_branch_name), year, get_repo_name(id)[1]))
        #print("Generating compiled reference dictionary...")
        compiled_reference_dict = combine_reference_dicts(reference_dict_list)
        #print(compiled_reference_dict)
        save_obj("reference_dict_saves", compiled_reference_dict, filename)
        #print(f"SAVING to {filename}")
        return compiled_reference_dict
    except gitlab.exceptions.GitlabGetError as e:
        print("Error, returning combined reference dicts:", e)
        return combine_reference_dicts(reference_dict_list)

def get_people_soup(year):
    filename = f"{year}-soup"
    if save_exists("people_saves", filename):
        return load_obj("people_saves", filename)

    base_url = f"https://fabacademy.org/{year}/people.html"
    soup = BeautifulSoup(requests.get(base_url).content, 'html.parser')

    save_obj("people_saves", soup, filename)

    return soup

def repo_name_to_student_name(name_and_web_url_tup):
    name, web_url = name_and_web_url_tup
    year = web_url.split("/")[3]
    href = f'/{"/".join(web_url.split("/")[3:])}'
    people_soup = get_people_soup(year)
    As = people_soup.find_all('a', href=True)
    a = [_ for _ in As if _['href'] == href or _['href'] == href[:-1]][0] # or to account for ending slash
    name_final = a.text.strip()
    return name_final, web_url

if __name__ == "__main__":
    classifier = Classifier()

    reference_dicts_across_years = [] # [[(lab_id: (int), {"Student Name": {"student-referenced": num_references (int), ...}}), ...], ...]

    for year in range(min(list(ALL_LAB_SUBGROUP_IDS.keys())), max(list(ALL_LAB_SUBGROUP_IDS.keys()))+1):
        #print("Loading student names...")
        all_student_names = get_all_people(year)
        #print(all_student_names)
        #print("Collecting student repo IDs...")
        all_student_repo_ids = get_all_student_repo_ids(year, ALL_LAB_SUBGROUP_IDS[year], all_student_names)
        #print(all_student_repo_ids)

        all_reference_dicts = [] # [(lab_id: (int), {"Student Name": {"student-referenced": num_references (int), ...}}), ...]

        for lab_number, id in all_student_repo_ids:
            print(id)
            if year not in YEAR_SCRAPING_RANGE:
                all_reference_dicts.append((lab_number, {format_name(get_repo_name(id), year): {}})) # necessary to keep students because otherwise references to these students will get filtered out
                continue
            """temp_i += 1
            if temp_i > 3:
                break"""
            reference_dict_list = []

            compiled_reference_dict = get_all_reference_dicts(year, id)
            #print(compiled_reference_dict)

            #print("Adding reference dictionary to database...")
            all_reference_dicts.append((lab_number, {format_name(get_repo_name(id), year): compiled_reference_dict}))
            #print(f"All reference dictionaries so far... {all_reference_dicts}")
        reference_dicts_across_years.append(all_reference_dicts)

    matrix = format_data_to_matrix(reference_dicts_across_years)