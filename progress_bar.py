# -*- coding: utf-8 -*-
"""
Created on Wed Jan 25 22:48:04 2017

@author: Colin

This python code just overwrites the Bar class in the progress package so that
the Bar is able to change the message when updating
"""
from progress.bar import Bar
import time

class MsgBar(Bar):
    
    def next(self, n=1, message=None):
        if n > 0:
            now = time.time()
            dt = (now - self._ts) / n
            self._dt.append(dt)
            self._ts = now
        if message != None:
            self.message = message
        self.index = self.index + n
        self.update()