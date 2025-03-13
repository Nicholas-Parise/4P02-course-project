import json
from datetime import datetime
import time
import sys
import os.path

report_dir = sys.argv[1]

report_filenamme = sys.argv[2]

file_to_process = report_dir+report_filenamme

history_max_size = int(sys.argv[3])

history_filename = "recent_report_history"

# e.g. tests/test_auth.py::test_create_account
# return "Auth" and "Create Account"
def getNames(string):
    split = string.split("/")[-1][5:].split("::")
    return split[0][:-3].title(), split[1][5:].replace("_", " ").title()

now = datetime.now()

with open(file_to_process) as f:
    data = json.load(f)

    passed_tests = data["summary"]["passed"]
    total_tests = data["summary"]["total"]
    if total_tests == 0: total_tests = 1

    out_data = {}

    out_data["time"] = now.strftime("%I:%M%p, %B %d, %Y")

    modules = {}

    for module in data["collectors"][2:]:
        modules[module["nodeid"].split("/")[-1][5:-3].title()] = []


    outcome_summary = {
        "passed":0,
        "error":0,
        "failed":0
    } 
    for test in data["tests"]:
        module, test_name = getNames(test["nodeid"])
        test_summary = {}
        test_summary["name"] = test_name
        test_summary["outcome"] = test["outcome"]
        outcome_summary[test["outcome"]] = outcome_summary[test["outcome"]] + 1

        modules[module].append(test_summary)
        
    out_data["summary"] = outcome_summary
    out_data["modules"] = []

    for key, value in modules.items():
        out_data["modules"].append({
            "name":key,
            "tests":value
        })

    # Update history
    history = []

    history_entry = {
        "time":now.strftime("%I:%M%p, %B %d, %Y"),
        "testsPassedPercent":float("{:.2f}".format(passed_tests / total_tests * 100))
    }

    if os.path.isfile(report_dir+history_filename):
        with open(report_dir+history_filename) as history_file:
            history = json.load(history_file)
            history.insert(0, history_entry)
    else:
        history.append(history_entry)

    current_history = history[:history_max_size]

    with open(report_dir+history_filename, 'w') as history_file:
        json.dump(current_history, history_file, indent=2)

    out_data["history"] = current_history

    out_file_name = report_dir+"processed_report_0"

    with open(out_file_name, 'w') as out_file:
        json.dump(out_data, out_file, indent=2)