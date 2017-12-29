import urllib2
from urllib2 import urlopen
from datetime import datetime
import csv

webpS = urllib2.urlopen("http://wcsheriff.info/reports/SUNDAY").read()
webpM = urllib2.urlopen("http://wcsheriff.info/reports/MONDAY").read()
webpT = urllib2.urlopen("http://wcsheriff.info/reports/TUESDAY").read()
webpW = urllib2.urlopen("http://wcsheriff.info/reports/WEDNESDAY").read()
webpTH = urllib2.urlopen("http://wcsheriff.info/reports/THURSDAY").read()
webpF = urllib2.urlopen("http://wcsheriff.info/reports/FRIDAY").read()
webpST = urllib2.urlopen("http://wcsheriff.info/reports/SATURDAY").read()

FORMAT = '%Y%m%d%H%M%S'
path = 'roster.txt'
new_path = '%s_%s' % (datetime.now().strftime(FORMAT), path)
text_file = open(new_path, 'w')

text_file.write('SUNDAY\n')
text_file.write(webpS)
text_file.write('MONDAY\n')
text_file.write(webpM)
text_file.write('TUESDAY\n')
text_file.write(webpT)
text_file.write('WEDNESDAY\n')
text_file.write(webpW)
text_file.write('THURSDAY\n')
text_file.write(webpTH)
text_file.write('FRIDAY\n')
text_file.write(webpF)
text_file.write('SATURDAY\n')
text_file.write(webpST)
text_file.close()

f = open('names.csv')
csv_f = csv.reader(f, dialect=csv.excel_tab)
text_file2 = open('hits.txt',"a")

for row in csv_f:
	print(repr(row))
	print str(row[0])
	if str(row[0]) in webpS != -1:
		text_file2.write('From the last SUNDAY, retrieved on %s - %s found\n' % (datetime.now().strftime(FORMAT), str(row)))
	if str(row[0]) in webpM != -1:
		text_file2.write('From the last MONDAY, retrieved on %s - %s found \n' % (datetime.now().strftime(FORMAT), str(row)))
	if str(row[0]) in webpT != -1:
		text_file2.write('From the last TUESDAY, retrieved on %s - %s found \n' % (datetime.now().strftime(FORMAT), str(row)))
	if str(row[0]) in webpW != -1:
		text_file2.write('From the last WEDNESDAY, retrieved on %s - %s found \n' % (datetime.now().strftime(FORMAT), str(row)))
	if str(row[0]) in webpTH != -1:
		text_file2.write('From the last THURSDAY, retrieved on %s - %s found \n' % (datetime.now().strftime(FORMAT), str(row)))
	if str(row[0]) in webpF != -1:
		text_file2.write('From the last FRIDAY, retrieved on %s - %s found \n' % (datetime.now().strftime(FORMAT), str(row)))
	if str(row[0]) in webpST != -1:
		text_file2.write('From the last SATURDAY, retrieved on %s - %s found \n' % (datetime.now().strftime(FORMAT), str(row)))

f.close();
text_file2.close();