function Storage() {
  this.init();
}

Storage.prototype.get = function(key) {
  return JSON.parse(localStorage.getItem(key));
};

Storage.prototype.set = function(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
};

Storage.prototype.remove = function(key) {
  localStorage.removeItem(key);
};

Storage.prototype.init = function() {
  localStorage['todos'] = localStorage['todos'] || '[]';
  localStorage['done_todos'] = localStorage['done_todos'] || '[]';
  localStorage['id'] = localStorage['id'] || '1';
};
