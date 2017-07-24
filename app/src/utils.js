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