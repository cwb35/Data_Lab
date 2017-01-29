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
from progress_bar import MsgBar
import warnings
warnings.filterwarnings('ignore')
#import argparse

DATA_PATH = "./Data/WiFi_Data/"
CONVERT_TIME = lambda x: parse(x.replace('+00', ''))

def run():
    file_names = [name for name in os.listdir(DATA_PATH) if name.endswith('.csv')]
    
    bar = MsgBar(message='Reading in files:', max=len(file_names))
    wifi_df = pd.DataFrame()
    for name in file_names:
        
        bar.next(message='Reading in: {:20}'.format(name))
        df = pd.read_csv(DATA_PATH+name, names=['MAC_Address', 'Time', 'Building'],
                         converters={'Time':CONVERT_TIME}, header=0)
        wifi_df = pd.concat([wifi_df, df])
        
    bar.finish()
    
    bar = MsgBar(message='Extracting Hour Column   ', max=3)
    #Appending new time columns to DataFrame
    bar.next()
    wifi_df['Hour'] = [time.hour for time in wifi_df.Time]
    bar.next(message='Extracting Weekday Column')
    wifi_df['Weekday'] = [time.weekday() for time in wifi_df.Time]
    bar.next(message='Extracting Minutes Column')
    wifi_df['Minutes'] = [time.minute for time in wifi_df.Time]
    bar.finish()
    wifi_df = wifi_df.sort(columns='Time')
    
    #print('Putting table into sqlite database!')
    bar = MsgBar(message='Creating SQLite Database:', max=1)
    con = sqlite3.connect(r'./WiFi_database.sqlite')
    wifi_df.to_sql('wifi_09_19', con)
    bar.next()
    bar.finish()
    
    #print('Creating SQLite Indexes for faster searching!')
    #bar = Bar(message='Creating SQLite Indexes:', max=1)
    c = con.cursor()
    bar = MsgBar(message='Creating SQLite Indexes:  ', max=3)
    for column in ['Hour', 'Weekday', 'Building']:
        bar.next(message='Creating Index for {:10}'.format(column))
        c.execute('CREATE INDEX {ix} on {tn}({cn})'\
            .format(ix=column+'_index', tn='wifi_09_19', cn=column))
    bar.finish()
    con.close()

if __name__ == "__main__":
    
    #parser = argparse.ArgumentParser()
    
    #parser.add_argument('program', metavar='PROG', type=str)
    run()
    



