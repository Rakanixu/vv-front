const config = require('./config.json');

export function IsRoot() {
  return (JSON.parse(localStorage.getItem('alantu-role')).name === config.roles.root.name);
}

export function IsManager() {
  return (JSON.parse(localStorage.getItem('alantu-role')).name === config.roles.manager.name);
} 

export function IsUser() {
  return (JSON.parse(localStorage.getItem('alantu-role')).name === config.roles.user.name);
} 