from main import repo_name_to_student_name
import pandas as pd
import re

df = pd.read_csv("final_data.csv", header=[0, 1], index_col=0)

STUDENTS = list(df.iloc[:, 0].keys())

regexes = {}

normal_chars = "abcdefghijklmnopqrstuvwxyz- ABCDEFGHIJKLMNOPQRSTUVWXYZ"

# convert a char from a character with an accent/dialectic into unicode
def accent_to_code(char):
    return format(ord(char), "#06x").replace("0x", "\\u")

# convert a char from unicode into a character with an accent/dialectic
def code_to_accent(code):
    return chr(int(code.replace("\\u", "0x"), 16))

def uppercase_char(txt): # making string like \u00e1restofthisword into \u00c1... (capital vs lowercase "a" with accent mark)
    return re.sub('.', lambda x: r'\u%04X' % ord(x.group()), bytes(txt[:6],"utf-8").decode('unicode-escape').encode('utf-8').decode().upper()).lower() + txt[6:]

# takes a name, converts it to a list of chars, then converts all characters with accents/dialectics to unicode
def non_letters_into_codes(name):
    lst = [_ for _ in name]
    for i in range(len(lst)):
        char = lst[i]
        if char.lower() not in normal_chars:
            lst[i] = accent_to_code(char)
    return "".join(lst)

if __name__ == "__main__":
    # create a dictionary where keys are regexes of the student's previous names as standard text and as text where diacritics/accents are replaced with unicode, and values are the corrected names
    for student in STUDENTS:
        val = ";".join(repo_name_to_student_name(student.split(";")))
        #if student == "Tin Valetic;https://fabacademy.org/2020/labs/bottrop/students/tin-valetic/" or student == 'tin-valetic;https://fabacademy.org/2020/labs/bottrop/students/tin-valetic/':
        #    print(non_letters_into_codes(student.split(";")[0].replace("-"," ").title()) + ";" + student.split(";")[1])
        regexes["\""+student+"\""] = "\""+val+"\""
        regexes["\""+non_letters_into_codes(student.split(";")[0]) + ";" + student.split(";")[1]+"\""] = "\""+val+"\""
        regexes["\""+non_letters_into_codes(student.split(";")[0].replace("-"," ").title()) + ";" + student.split(";")[1]+"\""] = "\""+val+"\""
        regexes["\""+non_letters_into_codes(val.split(";")[0]) + ";" + student.split(";")[1]+"\""] = "\""+val+"\""
        #regexes[" ".join([_.capitalize() if _[0] != "\\" else uppercase_char(_) for _ in non_letters_into_codes(student.split(";")[0]).replace("-"," ").split(" ")]) + ";" + student.split(";")[1]] = val

    # run the regex on final_data.json (literally replace the text, don't load as an object)
    with open('final_data.json', 'r') as file:
        content = file.read()
        for key in regexes:
            content = re.sub(re.escape(key), regexes[key], content)

    # store the corrected data
    with open('final_data_name_fixed.json', 'w', encoding='utf-8') as file: # encoding='utf-8' so that special characters in names can be written without UnicodeEncodeError
        file.write(content)
