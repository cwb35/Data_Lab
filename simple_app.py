# -*- coding: utf-8 -*-
"""
Created on Fri Jan 20 23:23:44 2017

@author: Colin
"""

from flask import Flask, request, abort
import sqlite3
import pandas as pd
from json import dumps

app = Flask(__name__)
unh_buildings = pd.read_csv(r'./Data/Building_Locations.csv')
list_buildings = unh_buildings['building_names'].tolist()

def get_paths(wifi_df, start_building=None):
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
    if start_building != None:
        path_list = [(key[0], key[1], value) for key, value in paths.items() 
                        if (value != 0) & (key[0] == start_building)]
    else:
        path_list = [(key[0], key[1], value) for key, value in paths.items() if value!=0]
    return pd.DataFrame(path_list, columns=['start', 'end', 'count']).sort(columns=['count'],
                        ascending=False)

@app.route('/api/wifi')
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
        data_paths = get_paths(data, request.args.get('Building')).to_json(orient='records')
        return dumps(data_paths)#dumps(data.to_json(orient='records'))
    else:
        return "NO ARGUMENTS GIVEN!"    
    
if __name__ == "__main__":
    app.run(port=8000, debug=True)