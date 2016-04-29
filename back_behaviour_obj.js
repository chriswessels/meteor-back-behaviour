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

BackBehaviour._getRouterOnBackCallback = function _getRouterOnBackCallback () {
  // Check for iron-router
  if (typeof Router !== 'undefined' && typeof Router.current === 'function') {
    var controller = Router.current();
    if (typeof controller.onBack === 'function') {
      // Found one, return bound to controller
      return controller.onBack.bind(controller);
    } else return null;
  // Check for flow-router
  } else if (typeof FlowRouter !== 'undefined' && typeof FlowRouter.current === 'function') {
    var controller = FlowRouter.current(),
        routeOptions = controller.route && controller.route.options;
    if (routeOptions && typeof routeOptions.onBack === 'function') {
      return routeOptions.onBack.bind(controller);
    } else return null;
  } else {
    return null;
  }
}

BackBehaviour._getContextBoundOnBack = function _getContextBoundOnBack (originTemplateInstance) {
  var viewWithOnBack, routerCallback;
  if (originTemplateInstance) {
    // Walk up the view tree to look for onBack defined on templates
    viewWithOnBack = this._checkViewTreeForCallback(originTemplateInstance.view);
  }

  routerCallback = BackBehaviour._getRouterOnBackCallback();

  if (viewWithOnBack) {
    // If we find a callback in the view tree, return it bound to its template instance
    return viewWithOnBack.template._onBack.bind(viewWithOnBack.templateInstance());
  } else if (routerCallback) {
    return routerCallback;
  } else {
    // Hmm, no more options :(
    console.warn('BackBehaviour did not find an onBack callback to execute.');
    return null;
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
