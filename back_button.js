Template.BackButton.events({
  'click .back-button-wrapper': function (event) {
    var dataContext = Blaze.getData(event.target),
        templateInstance = Template.instance();

    var onBack = BackBehaviour._getContextBoundOnBack(templateInstance);
    if (onBack) {
      onBack(BackBehaviour._detailsObj({ dataContext: dataContext, templateEvent: event}), 'BackButton_click');
    }
  }
});
