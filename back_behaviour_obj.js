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
  var controller;
  
  if (originTemplateInstance) {
    // Walk up the view tree to look for onBack defined on templates
    var viewWithOnBack = this._checkViewTreeForCallback(originTemplateInstance.view);
    if (viewWithOnBack) {
      // If we find a callback in the view tree, return it bound to its template instance
      return viewWithOnBack.template._onBack.bind(viewWithOnBack.templateInstance());
    } else if (typeof Iron !== 'undefined' && typeof Iron.controller === 'function') {
      // Else look for callback defined on the controller (if `iron-router` is in use)
      controller = Iron.controller();
      if (typeof controller.onBack === 'function') {
        // Found one, return bound to controller
        return controller.onBack.bind(controller);
      } else {
        // Hmm, no more options :(
        console.warn('BackBehaviour did not find an onBack callback to execute.');
        return null;
      }
    }
  } else if (typeof Router !== 'undefined' && typeof Router.current === 'function') {
    controller = Router.current();
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
  // find the closest callback
  var onBack = this._getContextBoundOnBack(templateInstance);
  if (onBack) {
    // execute
    onBack(this._detailsObj(details), origin);
  }
};

BackBehaviour._onHardwareBackButtonDown = function (event) {
  // stop the default browser event i.e. history.go(-1)
  event.preventDefault();
  event.stopPropagation();

  // send user back via back-behaviour
  BackBehaviour.goBack({
    templateEvent: event,
  }, 'HardwareBackButton_press');
};

BackBehaviour.attachToHardwareBackButton = function (enable) {
  if (enable !== true && enable !== false) {
    console.warn('BackBehaviour.attachToHardwareBackButton called without a valid argument. Use true or false to enable or disable attachment.');
  }
  if (Meteor.isCordova) {
     if (enable === true) {
      document.addEventListener('backbutton', this._onHardwareBackButtonDown, false);
    } else if (enable === false) {
      document.removeEventListener('backbutton', this._onHardwareBackButtonDown, false);
    }
  }
};
