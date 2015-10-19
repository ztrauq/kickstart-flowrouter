Package.describe({
  name: 'maev:modal-semantic-ui',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'A simple implementation of the Modal from the Semantic-UI framework',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use([ 'underscore', 'templating', 'session'], 'client');
  api.addFiles('client/maev-modal.html', 'client');
  api.addFiles('client/maev-modal.js', 'client');
  api.export('Modal','client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('maev-modal');
  api.addFiles('maev-modal-tests.js');
});
