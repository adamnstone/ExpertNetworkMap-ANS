# convert JSON training data to CSV

import json, string
import pandas as pd

DATA_LABELS = {
    "Prefab": 0,
    "Computer-Aided Design": 1,
    "Computer-Controlled Cutting": 2,
    "Embedded Programing": 3,
    "3D Scanning and Printing": 4,
    "Electronics Design": 5,
    "Computer-Controlled Machining": 6,
    "Electronics Production": 7,
    "Mechanical Design, Machine Design": 8,
    "Input Devices": 9,
    "Moulding and Casting": 10,
    "Output Devices": 11,
    "Embedded Networking and Communications": 12,
    "Interface and Application Programming": 13,
    "Wildcard Week": 14,
    "Applications and Implications": 15,
    "Invention, Intellectual Property and Business Models": 16,
    "Final Project": 17,
    "Other": 18
}

if __name__ == "__main__":
    txts = []
    labels = []
    tos = []
    froms = []
    with open('NLP_data/train.jsonl', 'r') as jsonl:
        for line in jsonl.readlines():
            j = json.loads(line)
            txts.append("".join([char for char in j['text'] if char in set(string.printable)])) # string.printable removes non-ASCII chars to avoid writing errors
            labels.append(DATA_LABELS[j['label']])
            tos.append(j['metadata']['to'])
            froms.append(j['metadata']['from'])

    data_dict = {
        "Text": txts,
        "Labels": labels,
        "To": tos,
        "From": froms
    }
    
    df = pd.DataFrame(data_dict)

    df.to_csv("NLP_data/train.csv")