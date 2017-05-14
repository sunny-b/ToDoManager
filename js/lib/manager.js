function Manager() {
  this.currentSection = {};
  this.$main = $('main');
  this.$sidebar = $('.sidebar');
  this.init();
}

Manager.prototype.renderSideBar = function() {
  var allTodos = todos.sortedTodos;
  var doneTodos = todos.sortedDoneTodos;

  this.$sidebar.html($(templates.sideBar({ allTasks: allTodos,
                                           totalAll: todos.all().length,
                                           completedTasks: doneTodos,
                                           totalCompleted: todos.completed().length })));
  this.setSelected();
}

Manager.prototype.setSelected = function() {
  $('.col, .sidebar-task').removeClass('selected');

  if (this.currentSection.isComplete) {
    $('.completed').find('[data-cate="' + this.currentSection.data + '"]')
                   .addClass('selected');
  } else {
    $('.all_todos').find('[data-cate="' + this.currentSection.data + '"]')
                   .addClass('selected');
  }
}

Manager.prototype.showTodos = function() {
  var filteredTodos = todos.filter(this.currentSection);
  var sortedTodos = todos.sortByComplete(filteredTodos);

  this.$main.html($(templates.todos({ category: this.currentSection.category,
                                      total: sortedTodos.length,
                                      todoTasks: sortedTodos,
                                      currentId: storage.get('id') })));
}

Manager.prototype.showModal = function(e) {
  e.preventDefault();
  e.stopPropagation();

  var $e = $(e.target);
  var todo = todos.get($e);

  modal.show(todo);
}

Manager.prototype.updateTodos = function(e) {
  e.preventDefault();
  var $e = $(e.target);

  todos.update($e);
  this.renderPage();
}

Manager.prototype.deleteTodo = function(e) {
  e.preventDefault();
  var $e = $(e.target);

  todos.delete($e);
  this.renderPage();
}

Manager.prototype.toggleComplete = function(e) {
  e.preventDefault();
  e.stopPropagation();
  var $e = $(e.target);
  var category = this.$main.find('h1').text();

  this.toggleTodo($e);
}

Manager.prototype.markComplete = function(e) {
  e.preventDefault();
  var $e = $(e.target);
  var id = $e.closest('[data-id]').data('id');

  if (id === storage.get('id')) {
    alert('Cannot be marked as complete since it has not been created yet!');
  } else {
    this.toggleTodo($e);
  }
}

Manager.prototype.toggleTodo = function($e) {
  todos.toggle($e);
  this.renderPage();
}

Manager.prototype.extractCategory = function($e) {
  return $e.closest('.col, .sidebar-task').text().trim().split(/\s\s+/)[0];
}

Manager.prototype.filterTodos = function(e) {
  e.preventDefault();
  var $e = $(e.target);
  var category = this.extractCategory($e);
  var data = $e.closest('.col, .sidebar-task').data('cate');
  var isComplete = !!$e.closest('.completed')[0];

  this.updateCurrentSection(category, isComplete, data);
  this.renderPage();
}

Manager.prototype.updateCurrentSection = function(category, isComplete, data) {
  this.currentSection.category = category ? category : 'All Todos';
  this.currentSection.isComplete = isComplete ? isComplete : false;
  this.currentSection.data = data ? data : 'all';
}

Manager.prototype.renderPage = function() {
  todos.setGroups();
  this.renderSideBar();
  this.showTodos();
}

Manager.prototype.binds = function() {
  this.$main.on('click', '.add-todo, .edit', this.showModal.bind(this));
  this.$main.on('click', '.modal_layer', modal.hide.bind(modal));
  this.$main.on('submit', '#modalForm', this.updateTodos.bind(this));
  this.$main.on('click', '.trash-container', this.deleteTodo.bind(this));
  this.$main.on('click', '.todo-container, .check', this.toggleComplete.bind(this));
  this.$main.on('click', '.complete', this.markComplete.bind(this));
  this.$sidebar.on('click', '.col, .sidebar-task', this.filterTodos.bind(this));
}

Manager.prototype.init = function() {
  this.updateCurrentSection();
  this.renderPage();
  this.binds();
}
