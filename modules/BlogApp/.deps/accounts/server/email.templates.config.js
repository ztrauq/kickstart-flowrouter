Meteor.startup(function () {
    var emailsfrom = Meteor.settings.public.accounts.service.name + " Admin " + Meteor.settings.public.accounts.service.email.from;
    Accounts.emailTemplates.from = emailsfrom;
})
