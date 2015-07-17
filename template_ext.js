// Observe Meteor conventions (onCreated, onRendered, etc) and provide
// onBack method for attaching callback to template
Template.prototype.onBack = function (callback) {
  this._onBack = callback;
};
