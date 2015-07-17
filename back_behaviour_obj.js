BackBehaviour = {};

BackBehaviour._checkViewTreeForCallback = function _checkViewTreeForCallback (view) {
  // Hit the top of the view tree
  if (! view) {
    return null;
  }
  // If callback is defined on the template return it
  if (view.template && view.template._onBack) {
    return view;
  } else {
    // Traverse the tree
    return _checkViewTreeForCallback(view.parentView);
  }
};

BackBehaviour._getContextBoundOnBack = function _getContextBoundOnBack (originTemplateInstance) {
  // Walk up the view tree to look for onBack defined on templates
  var viewWithOnBack = BackBehaviour._checkViewTreeForCallback(originTemplateInstance.view);
  if (viewWithOnBack) {
    // If we find a callback in the view tree, return it bound to its template instance
    return viewWithOnBack.template._onBack.bind(viewWithOnBack.templateInstance());
  } else if (typeof Iron !== 'undefined' && typeof Iron.controller === 'function') {
    // Else look for callback defined on the controller (if `iron-router` is in use)
    var controller = Iron.controller();
    if (typeof controller.onBack === 'function') {
      // Found one, return bound to controller
      return controller.onBack.bind(controller);
    } else {
      // Hmm, no more options :(
      console.warn('BackBehaviour did not find an onBack callback to execute.');
      return null;
    }
  }
};

BackBehaviour._detailsObj = function _detailsObj (options) {
  // return details object with expected keys defined (even as `null`)
  return _.extend({}, {
    dataContext: null,
    templateEvent: null
  }, options);
};

BackBehaviour.goBack = function (details, origin) {
  var templateInstance = Template.instance();
  if (!origin) {
    origin = 'custom';
  }
  var onBack = BackBehaviour._getContextBoundOnBack(templateInstance);
  if (onBack) {
    onBack(BackBehaviour._detailsObj(details), origin);
  }
};
