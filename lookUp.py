import sys
import json

# Read IP info from stdin
# ['{"robot":"137.146.188.249", "rawname":"robot1"}']
info = sys.stdin.readlines()
# info = ['{"robot":"137.146.188.249", "rawname":"robot1"}']
info = json.loads(info[0])

name = (info['robot'])

# Convert information into json string, 
# mapping integer lists to strings for easy reading
jsonstr = {}
jsonstr["name"] = name
# jsonstr["subnet"] = ".".join(map(str, net))
data = json.dumps(jsonstr)
print data