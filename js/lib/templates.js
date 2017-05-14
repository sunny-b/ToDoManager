function Templates() {
  this.cacheTemplates();
  this.registerPartials();
}

Templates.prototype.cacheTemplates = function() {
  var self = this;

  $('[type*=handlebars]').each(function() {
    self[$(this).attr('id')] = Handlebars.compile($(this).html());
  });
};

Templates.prototype.registerPartials = function() {
  $('[data-type=partial]').each(function() {
    Handlebars.registerPartial($(this).attr('id'), $(this).html());
  });
}
