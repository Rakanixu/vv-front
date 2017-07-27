import axios from 'axios';

axios.defaults.withCredentials = true; 

const config = require('./config.json');
const _ = require('lodash/core');

export function IsRoot() {
  if (!_.isEmpty(JSON.parse(localStorage.getItem('alantu-role')))) {
    return (JSON.parse(localStorage.getItem('alantu-role')).name === config.roles.root.name);
  }
  return false;
}

export function IsManager() {
  if (!_.isEmpty(JSON.parse(localStorage.getItem('alantu-role')))) {
    return (JSON.parse(localStorage.getItem('alantu-role')).name === config.roles.manager.name);
  }
  return false;
} 

export function IsUser() {
  if (!_.isEmpty(JSON.parse(localStorage.getItem('alantu-role')))) {
    return (JSON.parse(localStorage.getItem('alantu-role')).name === config.roles.user.name);
  }
  return false;
} 

export function setBackground(url) {
  if (url === undefined || url === '') {
    url = config.defaultBackground;
  }
  if (document.querySelector('body')) {
    document.querySelector('body').background = url;
  }
}

export function setLogo(url) {
  if (url === undefined || url === '') {
    url = config.defaultLogo;
  }
  if (document.querySelector('#principalLogo')) {
    document.querySelector('#principalLogo').src = url;
  }
}

export function dataURItoBlob(dataURI) {
  var binary = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var array = [];
  for(var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
  }

  return new Blob([new Uint8Array(array)], {type: mimeString, extension: '.png'});
}

export function exportToCsv(filename, rows) {
  var processRow = function (row) {
    var finalVal = '';
    var i = 0;
    for (var j in row) {
      if (j !== 'password') {
        var innerValue = row[j] === null ? '' : row[j].toString();
        if (row[j] instanceof Date) {
          innerValue = row[j].toLocaleString();
        };
        var result = innerValue.replace(/"/g, '""');
        if (result.search(/("|,|\n)/g) >= 0)
          result = '"' + result + '"';
        if (i > 0)
          finalVal += ',';
        finalVal += result;
        i++;
      }
    }
    return finalVal + '\n';
  };

  var processHeader = function (row) {
    var finalVal = '';
    var i = 0;
    for (var j in row) {
      if (j !== 'password') {
        var innerValue = j === null ? '' : j;
        var result = innerValue.replace(/"/g, '""');
        if (result.search(/("|,|\n)/g) >= 0)
          result = '"' + result + '"';

        
        if (i > 0)
          finalVal += ',';
        finalVal += result;
        i++;
      }
    }
    return finalVal + '\n';
  };

  var csvFile = '';
  csvFile += processHeader(rows[0]);
  for (var i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }

  var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
    