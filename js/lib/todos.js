function Todos() {
  this.sortedTodos = [];
  this.sortedDoneTodos = [];
}

Todos.prototype.get = function($e) {
  var id = $e.closest('[data-id]').data('id');
  var filteredTodo = storage.get('todos').filter(function(todo) {
    return todo.id === id;
  })[0];

  return filteredTodo ? filteredTodo : this.new();
};

Todos.prototype.groupTodos = function(todosGroup) {
  var seen = [];

  return todosGroup.sort(this.compareDueDates).reduce(function(arr, todo) {
    if (seen.includes(todo.dueDate)) {
      arr.filter(function(obj) {
        return obj.dueDate === todo.dueDate;
      })[0].total += 1;
    } else {
      seen.push(todo.dueDate);
      arr.push({ dueDate: todo.dueDate,
                 total: 1,
                 data: todo.dueDate.replace(/[\s]/g, '') });
    }

    return arr;
  }, []);
};

Todos.prototype.compareDueDates = function(todo1, todo2) {
  if (todo1.year === 'Year' || +todo1.year < +todo2.year) {
      return -1
  } else if (todo2.year === 'Year' || +todo1.year > +todo2.year) {
    return 1
  } else {
    if (todo1.month === 'Month' +todo1.month < +todo2.month) {
        return -1
    } else if (todo2.month === 'Month' || +todo1.month > +todo2.month) {
      return 1
    } else {
      return 0
    }
  }
};

Todos.prototype.setGroups = function() {
  this.sortedTodos = this.groupTodos(this.all());
  this.sortedDoneTodos = this.groupTodos(this.completed());
};

Todos.prototype.filter = function(section) {
  var category = section.category;
  var isComplete = section.isComplete;
  var filteredTodos;

  if (category === 'All Todos') {
    filteredTodos = this.all();
  } else if (category === 'Completed') {
    filteredTodos = this.completed();
  } else {
    if (isComplete) {
      filteredTodos = this.completed().filter(function(todo) {
        return todo.dueDate === category;
      });
    } else {
      filteredTodos = this.all().filter(function(todo) {
        return todo.dueDate === category;
      });
    }
  }

  return filteredTodos;
};

Todos.prototype.sortByComplete = function(collection) {
  var allTodos = collection ? collection : this.all();
  var notDone = allTodos.filter(function(todo) {
    return !todo.completed
  }).sort(function(todo1, todo2) {
    return todo1 - todo2;
  });

  var done = allTodos.filter(function(todo) {
    return todo.completed
  }).sort(function(todo1, todo2) {
    return todo1.id - todo2.id;
  });

  return notDone.concat(done);
};

Todos.prototype.update = function($e) {
  var formInfo = $e.serializeArray();
  var todo = this.get($e);
  var isNew = todo.id === storage.get('id');

  if (isNew) {
    storage.set('id', todo.id + 1);
    manager.updateCurrentSection();
  }

  formInfo.forEach(function(key) {
    todo[key.name] = key.value;
  });

  this.createDueDate(todo);
  this.save(todo, isNew);
};

Todos.prototype.createDueDate = function(todo) {
  if (todo.month === 'Month' || todo.year === 'Year') {
    todo.dueDate = 'No Due Date'
  } else {
    todo.dueDate = todo.month + '/' + todo.year.slice(2);
  }
}

Todos.prototype.save = function(todo, isNew) {
  var allTodos = this.all();

  isNew ? allTodos.push(todo) : this.replace(allTodos, todo);

  storage.set('todos', allTodos);
  this.updateCompleted();
}

Todos.prototype.updateCompleted = function() {
  var completeTodos = this.all().filter(function(todo) {
    return todo.completed === true;
  });

  storage.set('done_todos', completeTodos);
  this.setGroups();
}

Todos.prototype.toggle = function($e) {
  var todo = this.get($e);

  todo.completed = !todo.completed;
  this.save(todo);
}

Todos.prototype.delete = function($e) {
  var allTodos = this.all();
  var todo = this.get($e)
  var index = this.findIndex(allTodos, todo);

  allTodos.splice(index, 1);
  storage.set('todos', allTodos);
  this.updateCompleted();
}

Todos.prototype.replace = function(collection, newItem) {
  var index = this.findIndex(collection, newItem);

  collection.splice(index, 1, newItem);
}

Todos.prototype.findIndex = function(collection, item) {
  var oldItem = collection.filter(function(element) {
    return element.id === item.id;
  })[0];

  return collection.indexOf(oldItem);
}

Todos.prototype.all = function() {
  return storage.get('todos');
}

Todos.prototype.completed = function() {
  return storage.get('done_todos');
}

Todos.prototype.new = function() {
  return new Todo(storage.get('id'));
}

function Todo(id) {
  this.id = id;
  this.completed = false;
  this.title = '';
  this.day = 'Day';
  this.month = 'Month';
  this.year = 'Year';
  this.description = '';
  this.dueDate = 'No Due Date';
}
