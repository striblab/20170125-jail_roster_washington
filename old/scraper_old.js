//ADD A MENU ITEM
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('JailRoster')
      .addItem('Refresh', 'menuItem5')
      .addToUi();
}

function menuItem5() {
  cronTasks();
}

//THE PRIMARY FUNCTION
function cronTasks() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = SpreadsheetApp.setActiveSheet(ss.getSheets()[1]);
  
  var d = new Date();
  var n = d.getDate();
  var m = d.getMonth() + 1;
  var y = d.getFullYear();
  var h = d.getHours();
  var min = d.getMinutes();
  
  //GET NAMES
  var list = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('names');
  var rng = list.getDataRange();
  var names = rng.getValues();
  
  //SET DAY ARRAY
  var days = ['SUNDAY','MONDAY','TUESDAY','WENESDAY','THURSDAY','FRIDAY','SATURDAY'];
  var jailData = [];
  
  //SAVE DAILY TEXT IN NEW SHEET
  var sheetName = "data" + "-" + y + "-" + m + "-" + n + "-" + h + ":" + min;
  newSheet(sheetName);
 
  Utilities.sleep(15000);
  
  var sh2 = ss.getSheetByName(sheetName);
  sh2.getRange('A1').setValue('SUNDAY');
  sh2.getRange('E1').setValue('MONDAY');
  sh2.getRange('H1').setValue('TUESDAY');
  sh2.getRange('L1').setValue('WEDNESDAY');
  sh2.getRange('P1').setValue('THURSDAY');
  sh2.getRange('S1').setValue('FRIDAY');
  sh2.getRange('V1').setValue('SATURDAY');
  sh2.getRange('A2').setFormula('=ImportData( "http://wcsheriff.info/reports/SUNDAY")');
  sh2.getRange('E2').setFormula('=ImportData( "http://wcsheriff.info/reports/MONDAY")');
  sh2.getRange('H2').setFormula('=ImportData( "http://wcsheriff.info/reports/TUESDAY")');
  sh2.getRange('L2').setFormula('=ImportData( "http://wcsheriff.info/reports/WEDNESDAY")');
  sh2.getRange('P2').setFormula('=ImportData( "http://wcsheriff.info/reports/THURSDAY")');
  sh2.getRange('S2').setFormula('=ImportData( "http://wcsheriff.info/reports/FRIDAY")');
  sh2.getRange('V2').setFormula('=ImportData( "http://wcsheriff.info/reports/SATURDAY")');
  
  var sunData = sh2.getRange('A2').getValue();
  var monData = sh2.getRange('E2').getValue();
  var tueData = sh2.getRange('H2').getValue();
  var wedData = sh2.getRange('L2').getValue();
  var thuData = sh2.getRange('P2').getValue();
  var friData = sh2.getRange('S2').getValue();
  var satData = sh2.getRange('V2').getValue();
  
  sh2.getRange('A2').setValue(sunData);
  sh2.getRange('E2').setValue(monData);
  sh2.getRange('H2').setValue(tueData);
  sh2.getRange('L2').setValue(wedData);
  sh2.getRange('P2').setValue(thuData);
  sh2.getRange('S2').setValue(friData);
  sh2.getRange('V2').setValue(satData);  
  
  var jailData = sh2.getDataRange().getValues();
  
  Logger.log(jailData);
  
  //LOOP THROUGH NAMES
  for (var k=0; k < days.length; k++){
    for (var i=1; i < names.length; i++) {
      list.getRange('B' + (i + 1)).setFormula('=ArrayFormula(IF( ISNUMBER( SEARCH( "' + names[i][0] + '" ; ' + jailData + ')) ; "Found in ' + sheetName + '" ; "Not found" ))');
      var thisData = list.getRange('B' + (i + 1)).getValue();
      list.getRange('B' + (i + 1)).setValue(thisData);
    }
  }
             
  removeEmptyColumns(sh2);
  //removeEmptyRows(sh2);
}

//DATA CONVERSION AND CLEANING STUFF
function newSheet(name){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  yourNewSheet = ss.insertSheet();
  yourNewSheet.setName(name);
}

function removeEmptyRows(sh){
  var maxRows = sh.getMaxRows(); 
  var lastRow = sh.getLastRow();
  sh.deleteRows(lastRow+1, maxRows-lastRow);
}

function removeEmptyColumns(sh) {
  var maxColumns = sh.getMaxColumns(); 
  var lastColumn = sh.getLastColumn();
  sh.deleteColumns(lastColumn+1, maxColumns-lastColumn);
}

function readRows() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();

  for (var i = 0; i <= numRows - 1; i++) {
    var row = values[i];
    Logger.log(row);
  }
};


function ImportJSON(url, query, options) {
  return ImportJSONAdvanced(url, query, options, includeXPath_, defaultTransform_);
}

function ImportJSONAdvanced(url, query, options, includeFunc, transformFunc) {
  var jsondata = UrlFetchApp.fetch(url);
  var object   = JSON.parse(jsondata.getContentText());
  
  return parseJSONObject_(object, query, options, includeFunc, transformFunc);
}

function URLEncode(value) {
  return encodeURIComponent(value.toString());  
}

function parseJSONObject_(object, query, options, includeFunc, transformFunc) {
  var headers = new Array();
  var data    = new Array();
  
  if (query && !Array.isArray(query) && query.toString().indexOf(",") != -1) {
    query = query.toString().split(",");
  }
  
  if (options) {
    options = options.toString().split(",");
  }
    
  parseData_(headers, data, "", 1, object, query, options, includeFunc);
  parseHeaders_(headers, data);
  transformData_(data, options, transformFunc);
  
  return hasOption_(options, "noHeaders") ? (data.length > 1 ? data.slice(1) : new Array()) : data;
}

function parseData_(headers, data, path, rowIndex, value, query, options, includeFunc) {
  var dataInserted = false;
  
  if (isObject_(value)) {
    for (key in value) {
      if (parseData_(headers, data, path + "/" + key, rowIndex, value[key], query, options, includeFunc)) {
        dataInserted = true; 
      }
    }
  } else if (Array.isArray(value) && isObjectArray_(value)) {
    for (var i = 0; i < value.length; i++) {
      if (parseData_(headers, data, path, rowIndex, value[i], query, options, includeFunc)) {
        dataInserted = true;
        rowIndex++;
      }
    }
  } else if (!includeFunc || includeFunc(query, path, options)) {
    // Handle arrays containing only scalar values
    if (Array.isArray(value)) {
      value = value.join(); 
    }
    
    // Insert new row if one doesn't already exist
    if (!data[rowIndex]) {
      data[rowIndex] = new Array();
    }
    
    // Add a new header if one doesn't exist
    if (!headers[path] && headers[path] != 0) {
      headers[path] = Object.keys(headers).length;
    }
    
    // Insert the data
    data[rowIndex][headers[path]] = value;
    dataInserted = true;
  }
  
  return dataInserted;
}

function parseHeaders_(headers, data) {
  data[0] = new Array();

  for (key in headers) {
    data[0][headers[key]] = key;
  }
}

function transformData_(data, options, transformFunc) {
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
      transformFunc(data, i, j, options);
    }
  }
}

function isObject_(test) {
  return Object.prototype.toString.call(test) === '[object Object]';
}

function isObjectArray_(test) {
  for (var i = 0; i < test.length; i++) {
    if (isObject_(test[i])) {
      return true; 
    }
  }  

  return false;
}

function includeXPath_(query, path, options) {
  if (!query) {
    return true; 
  } else if (Array.isArray(query)) {
    for (var i = 0; i < query.length; i++) {
      if (applyXPathRule_(query[i], path, options)) {
        return true; 
      }
    }  
  } else {
    return applyXPathRule_(query, path, options);
  }
  
  return false; 
};

function applyXPathRule_(rule, path, options) {
  return path.indexOf(rule) == 0; 
}

function defaultTransform_(data, row, column, options) {
  if (!data[row][column]) {
    if (row < 2 || hasOption_(options, "noInherit")) {
      data[row][column] = "";
    } else {
      data[row][column] = data[row-1][column];
    }
  } 

  if (!hasOption_(options, "rawHeaders") && row == 0) {
    if (column == 0 && data[row].length > 1) {
      removeCommonPrefixes_(data, row);  
    }
    
    data[row][column] = toTitleCase_(data[row][column].toString().replace(/[\/\_]/g, " "));
  }
  
  if (!hasOption_(options, "noTruncate") && data[row][column]) {
    data[row][column] = data[row][column].toString().substr(0, 256);
  }

  if (hasOption_(options, "debugLocation")) {
    data[row][column] = "[" + row + "," + column + "]" + data[row][column];
  }
}

function removeCommonPrefixes_(data, row) {
  var matchIndex = data[row][0].length;

  for (var i = 1; i < data[row].length; i++) {
    matchIndex = findEqualityEndpoint_(data[row][i-1], data[row][i], matchIndex);

    if (matchIndex == 0) {
      return;
    }
  }
  
  for (var i = 0; i < data[row].length; i++) {
    data[row][i] = data[row][i].substring(matchIndex, data[row][i].length);
  }
}

function findEqualityEndpoint_(string1, string2, stopAt) {
  if (!string1 || !string2) {
    return -1; 
  }
  
  var maxEndpoint = Math.min(stopAt, string1.length, string2.length);
  
  for (var i = 0; i < maxEndpoint; i++) {
    if (string1.charAt(i) != string2.charAt(i)) {
      return i;
    }
  }
  
  return maxEndpoint;
}
  
function toTitleCase_(text) {
  if (text == null) {
    return null;
  }
  
  return text.replace(/\w\S*/g, function(word) { return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase(); });
}

function hasOption_(options, option) {
  return options && options.indexOf(option) >= 0;
}