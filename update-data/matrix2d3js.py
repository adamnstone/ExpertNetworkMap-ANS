import pandas as pd
import numpy as np
import json

INPUT_FILE = "final_data.csv"
OUTPUT_FILE = "final_data.json"

df = pd.read_csv(INPUT_FILE, header=[0, 1], index_col=0)

STUDENTS = list(df.iloc[:, 0].keys())
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

def get_value(df, referencer_student, referenced_student, topic):
    return df.loc[referencer_student, (referenced_student, topic)]

def generate_node_obj(name, group):
    return {
        "id": name,
        "group": group
    }

def generate_link_obj(name_from, name_to, strength, topic):
    return {
        "source": name_from,
        "target": name_to,
        "value": strength,
        "topic": topic
    }

final_data = {
    "nodes": [ ],
    "links": [ ]
}

def split_name(name):
    return name.split(";")

if __name__ == "__main__":
    # create `nodes` object in final JSON
    for student in STUDENTS:
        student_name, student_link = split_name(student)
        final_data['nodes'].append(generate_node_obj(student, 1))

    # for each link between students, add a link object in the final JSON under the `links` object
    for referencer_student in STUDENTS:
        referencer_student_name, referencer_student_link = split_name(referencer_student)
        for referenced_student in STUDENTS:
            referenced_student_name, referenced_student_link = split_name(referenced_student)
            for topic in TOPICS:
                val = get_value(df, referencer_student, referenced_student, topic)

                if val == 0 or np.isnan(val): continue

                final_data['links'].append(generate_link_obj(referencer_student, referenced_student, val, topic))

    with open("final_data.json", "w") as outfile:
        json.dump(final_data, outfile)