# -*- coding: utf-8 -*-
"""
Created on Fri Jan 20 23:23:44 2017

@author: Colin
"""

from flask import Flask, request, abort, render_template
import sqlite3
import pandas as pd
from json import dumps
from collections import Counter

app = Flask(__name__)
unh_buildings = pd.read_csv(r'./Data/Building_Locations.csv')
list_buildings = unh_buildings['building_names'].tolist()
query_cache = pd.DataFrame()

@app.route('/api/all', methods=['GET', 'POST'])
def get_data():
    
    global query_cache    
    
    con = sqlite3.connect('WiFi_Database.sqlite')
    query_dict = {}
    data = 'no hours'
    for key in ["Hour", "Weekday"]:
        arg = request.args.get(key)
        if arg:
            query_dict[key] = ' ' + key + ' IN ({key})'.format(key=arg)
    if len(query_dict) > 0:
        query = ' AND'.join(query_dict.values())
        data = pd.read_sql_query('SELECT * FROM wifi_09_19 WHERE {}'.format(query),
                                 con)
        query_cache = data
        hour_count = Counter(data["Hour"])
        building_count = Counter(data["Building"])
        time_df = pd.DataFrame([(hour, count) for hour, count in hour_count.items()],
                            columns=["Hour", "Count"])
        bad_buildings = {"Woodman", "Craft", "DeMeritt", "Woodside", "Observatory"}
        building_df = pd.DataFrame([(building, count) for building, count in building_count.items() if building not in bad_buildings],
                            columns=["Building", "Count"])
        path_df = get_paths(data, start_building=request.args.get("Building"))
        
        json_df = {
                    "Time":time_df.to_dict(orient="records"), 
                    "Buildings":building_df.to_dict(orient="records"), 
                    "Paths":path_df.to_dict(orient="records")
                    }
        
        json_str = "["+str(json_df)+"]"
        #print(json_str.replace("'", '"'))
        return json_str.replace("'", '"')#"["+str(json_df)+"]"

def get_paths(wifi_df, start_building=None, start_buildings=None, num=10):
    """
    Returns nested dictionary of all building paths and # of people who took 
    path for specified day and hour.
    
    Keyword arguments:
    day -- day of the week (list(int))
    hour_range -- tuple of start and end hours (int 0-23, int 0-23)  
    """
    paths = {(b,c):0 for b in list_buildings for c in list_buildings if b!=c}     
    mac_add = {x:'0' for x in wifi_df['MAC_Address'].tolist()}
    
    #Loop over all MAC Addresses and corresponding buildings in subset
    for (building, mac) in zip(wifi_df['Building'].tolist(), wifi_df['MAC_Address'].tolist()):
        if mac_add[mac] == '0':#if first time 'mac' has shown up in for loop
            mac_add[mac] = building#Set 'mac' key equal to _building
        elif mac_add[mac] == building:#if 'mac' already equals _building, then pass
            pass
        else:#'mac' has moved buildings
            try:
                paths[(mac_add[mac], building)] += 1#Add 1 to the paths dict for tuple (mac_add[mac], _building)
            except KeyError:
                pass
            mac_add[mac] = building#Set mac_add[mac] current value to _building
    print("start_building: ", start_building)
    if start_building != None:
        print(start_building, "THIS IS GOOD!")
        path_list = [(key[0], key[1], value) for key, value in paths.items() 
                        if (value != 0) & (key[0] == start_building)]
    elif start_buildings != None:
        path_list = [(key[0], key[1], value) for key, value in paths.items() 
                        if (value != 0) & (key[0] in start_buildings)]
    else:
        path_list = [(key[0], key[1], value) for key, value in paths.items() if value!=0]
        
    
    return pd.DataFrame(path_list, columns=["start", "end", "count"]).sort(columns=["count"],
                        ascending=False).head(num)
                        

@app.route('/api/building_coords', methods=['GET', 'POST'])
def get_building_coords():
    df = pd.read_csv('./data/Building_Locations.csv')
    return df.to_json(orient="records")

@app.route('/api/connections', methods=['GET', 'POST'])
def get_connection_data():
    
    con = sqlite3.connect('WiFi_Database.sqlite')
    query_dict = {}
    data = 'no hours'
    for key in ['Hour', 'Weekday']:
        arg = request.args.get(key)
        if arg:
            query_dict[key] = ' ' + key + ' IN ({key})'.format(key=arg)
    if len(query_dict) > 0:
        query = ' AND'.join(query_dict.values())
        data = pd.read_sql_query('SELECT * FROM wifi_09_19 WHERE {}'.format(query),
                                 con)
        print("request.args.get('Building'): ", request.args.get("Building"))
        #df = get_connections(data, start_building=request.args.get('Building'))
        c = Counter(data['Hour'])
        df = pd.DataFrame([(hour, count) for hour, count in c.items()],
                            columns=['Hour', 'Count'])
        time_count = df.to_json(orient='records')
        return time_count
    
@app.route('/')
def index():
    Hour = request.args.get('Hour', '')
    Weekday = request.args.get('Weekday', '')
    Building = request.args.get("Building", '')
    
    return render_template('index.html', Hour=Hour, Weekday=Weekday, 
                           Building=Building)
    
@app.route('/api/cache', methods=['GET', 'POST'])
def get_cache():
    
    global query_cache
    
    building = request.args.get('Building')
    building_type = request.args.get('Type')
    if building != None:
        path_df = get_paths(query_cache, building)
        df = query_cache[query_cache['Building'] == building]
        hour_count = Counter(df['Hour'])
        time_df = pd.DataFrame([(hour, count) for hour, count in hour_count.items()],
                                columns=["Hour", "Count"])
                                
        json_df = {
                        "Time":time_df.to_dict(orient="records"), 
                        "Paths":path_df.to_dict(orient="records")
                        }
            
        json_str = "["+str(json_df)+"]"
        return json_str.replace("'", '"')
    elif building_type != None:
        
        buildings = unh_buildings[unh_buildings['building_type'] == building_type]['building_names']
        path_df = get_paths(query_cache, start_buildings=buildings.tolist())
        df = query_cache[query_cache['Building'].isin(buildings)]
        hour_count = Counter(df['Hour'])
        time_df = pd.DataFrame([(hour, count) for hour, count in hour_count.items()],
                                columns=["Hour", "Count"])
                                
        json_df = {
                        "Time":time_df.to_dict(orient="records"), 
                        "Paths":path_df.to_dict(orient="records")
                        }
            
        json_str = "["+str(json_df)+"]"
        return json_str.replace("'", '"')
    

@app.route('/api/wifi', methods=['GET', 'POST'])
def get_wifi_data():
    
    con = sqlite3.connect('WiFi_Database.sqlite')
    query_dict = {}
    data = 'no hours'
    for key in ['Hour', 'Weekday']:
        arg = request.args.get(key)
        if arg:
            query_dict[key] = ' ' + key + ' IN ({key})'.format(key=arg)
    if len(query_dict) > 0:
        query = ' AND'.join(query_dict.values())
        data = pd.read_sql_query('SELECT * FROM wifi_09_19 WHERE {}'.format(query),
                                 con)
        print("request.args.get('Building'): ", request.args.get("Building"))
        df = get_paths(data, start_building=request.args.get('Building'))
        data_paths = df.to_json(orient='records')
        df.to_json('sample.json', orient='records')
        
        return data_paths#dumps(data_paths)#dumps(data.to_json(orient='records'))
    else:
        return "NO ARGUMENTS GIVEN!"    
    
if __name__ == "__main__":
    app.run(port=8001, debug=True)