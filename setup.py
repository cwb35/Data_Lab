# -*- coding: utf-8 -*-
"""
Created on Fri Jan 20 18:17:30 2017

@author: Colin

This script reads in all csv files in the /test_data/ directory to a pandas 
DataFrame, performs feature extraction on the datetime column to extract 
the hour, minute, and weekday, then creates a SQLite database, and saves the
DataFrame to a table called wifi_09_19. After creating the table it then
indexes the columns to provide quicker lookup times for queries.
"""

import sqlite3
import pandas as pd
from dateutil.parser import parse
import os
import pyprind
import warnings
import time
warnings.filterwarnings('ignore')

DATA_PATH = "./Data/WiFi_Data/"
CONVERT_TIME = lambda x: parse(x.replace('+00', ''))

def run():
    
    t0 = time.time()
    file_names = [name for name in os.listdir(DATA_PATH) if name.endswith('.csv')]
    
    print('---------------------------------------------------')
    print('-----------------Reading in files:-----------------')
    print('---------------------------------------------------')
    p = pyprind.ProgBar(50, width=200)
    
    wifi_df = pd.DataFrame()
    for name in file_names:
        
        df = pd.read_csv(DATA_PATH+name, names=['MAC_Address', 'Time', 'Building'],
                         converters={'Time':CONVERT_TIME}, header=0)
        wifi_df = pd.concat([wifi_df, df])
        p.update(iterations=50/len(file_names))
        
    print('---------------------------------------------------')
    print('-----------------Extracting Time:-----------------')
    print('---------------------------------------------------')
    p = pyprind.ProgBar(50, width=200)
    
    wifi_df['Hour'] = [time.hour for time in wifi_df.Time]
    p.update(iterations=16)
    wifi_df['Weekday'] = [time.weekday() for time in wifi_df.Time]
    p.update(iterations=17)
    wifi_df['Minutes'] = [time.minute for time in wifi_df.Time]
    p.update(iterations=18)
    wifi_df = wifi_df.sort(columns='Time')
    
    print('---------------------------------------------------')
    print('-----------------Creating Database:-----------------')
    print('---------------------------------------------------')
    p = pyprind.ProgBar(50, width=200)
    
    con = sqlite3.connect(r'./WiFi_database.sqlite')
    wifi_df.to_sql('wifi_09_19', con)
    p.update(iterations=50)
    
    
    print('---------------------------------------------------')
    print('-----------------Creating Indexes:-----------------')
    print('---------------------------------------------------')
    p = pyprind.ProgBar(50, width=200)
    
    c = con.cursor()
    for column in ['Hour', 'Weekday', 'Building']:
        c.execute('CREATE INDEX {ix} on {tn}({cn})'\
            .format(ix=column+'_index', tn='wifi_09_19', cn=column))
        p.update(iterations=17)
    con.close()
    
    print("Finished Running Script in {} Seconds!".format(round(time.time() - t0),2))
if __name__ == "__main__":
    
    run()
    



