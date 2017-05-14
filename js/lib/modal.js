function Modal() {}

Modal.prototype.hide = function(e) {
  e.preventDefault();
  $('.modal, .modal_layer').fadeOut();
};

Modal.prototype.show = function(todo) {
  $('.modal').html($(templates.modal(todo)));
  $('.modal_layer, .modal').fadeIn();
};
