/*
*   Knockout Extensions - ko.Model
*   Created By Dan Matthews (https://github.com/bluefocus)
*
*   Source: https://github.com/kostructures/ko.Model
*   MIT License: http://www.opensource.org/licenses/MIT
*/
(function (ko) {
  var Model = {
    __attributeExtensions__: ko.observableArray([]),
    __modelExtensions__: ko.observableArray([]),
    __defaults__: {},
    __attrs__: {},
    __version__: '0.1.1',

    attributes: function(attrs) {
      var self = this;

      $.each(self.__modelExtensions__(), function() { this(self) });

      self.__defaults__ = attrs;

      for(var attr in attrs){
        var name = attr.constructor.name;
        if(name === "Array") {
          self[attr] = ko.observableArray(attrs[attr]);
        } else if(name === "Function") {
          self[attr] = ko.computed(attrs[attr]);
        } else {
          self[attr] = ko.observable(attrs[attr]);
        }
        $.each(self.__attributeExtensions__(), function() { this(self[attr]) });
      }
    },

    initialize: function(attrs) {
      var self = this;

      self.__attrs__ = attrs;

      for(var attr in attrs) {
        if(/_attributes$/.test(attr)) {
          var name = attr.match(/^(.+)_attributes/)[1];
          self[name]().initialize(attrs[attr]);
        } else {
          self.set(self[attr], attrs[attr]);
        }
      }
    },

    // Resets to the defaults
    reset: function() {
      var self = this;

      for(var attr in self.__defaults__){
        self[attr](self.__defaults__[attr]);
      }
    },

    // Restores to the newed state
    restore: function() {
      this.reset();
      this.initialize(this.__attrs__);
    },

    // will never set null or undefined
    set: function(target, value) {
      if(target && (value || value === false)) {
        target(value);
      }
    },

    toJS: function() {
      var self = this;
      var attrs = {};
      for(var attr in self._defaults) {
        attrs[attr] = self[attr]();
      }
      return attrs;
    }
  };

  ko.Model = Model;
})(ko);

