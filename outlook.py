import os
import zipfile

def getDay1Outlook():
    from bs4 import BeautifulSoup
    import urllib2
    import re
    from datetime import datetime

    html_page = urllib2.urlopen('http://www.spc.noaa.gov/products/outlook/day1otlk.html')
    soup = BeautifulSoup(html_page, 'html.parser')
    for title in soup.find_all('td', { 'class': 'zz' }):
        cur_url = title.string
        cur_url = re.sub('\ UTC Day 1 Convective Outlook$', '', cur_url)
        datetime_object = datetime.strptime(cur_url, '%b %d, %Y %H%M')
        calculated_date = datetime_object.strftime('%Y%m%d_%H%M')
        file = 'http://www.spc.noaa.gov/products/outlook/archive/2017/day1otlk_' + calculated_date + '.kmz'
        print file

getDay1Outlook()