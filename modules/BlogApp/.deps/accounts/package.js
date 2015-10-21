Package.describe({
  name: 'maev:accounts-semantic-ui',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.use([
    'tracker',
    'service-configuration',
    'accounts-base',
    'underscore',
    'templating',
    'session'
  ], 'client');
  api.use([
    'jparker:gravatar@0.4.1',
      'aldeed:collection2@2.5.0',
      'aldeed:autoform@5.5.1',
      'fabienb4:autoform-semantic-ui@0.5.0'
  ]);
  api.addFiles('accounts.js');
  api.addFiles([
    'server/methods.js',
    'server/email.templates.config.js'
    ],'server');
  api.addFiles([
    'client/lib/strength.js/strength.js',
    'client/lib/strength.js/strength.css',
    'client/maevLogin.html',
    'client/maevLogin.js',
    'client/maevLogin.css'
  ],'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('maev:accounts');
  api.addFiles('accounts-tests.js');
});
