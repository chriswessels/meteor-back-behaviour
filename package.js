Package.describe({
  name: 'chriswessels:back-behaviour',
  version: '0.2.1',
  summary: 'A pattern for defining and triggering in-app back button behaviour',
  git: 'https://github.com/chriswessels/meteor-back-behaviour.git'
});

Package.onUse(function (api) {
  api.versionsFrom('1.0');

  api.use([
    'underscore@1.0.3',
    'templating@1.1.1',
    'blaze@2.1.2',
    'random@1.0.3'
  ]);

  api.addFiles([
    'back_behaviour_obj.js',
    'template_ext.js'
  ], 'client');

  api.addFiles([
    'back_button.html',
    'back_button.js'
  ], 'client');

  api.export('BackBehaviour');
});
