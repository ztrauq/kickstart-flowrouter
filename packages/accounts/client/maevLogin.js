/*Accounts.urls.enrollAccount = function (token) {
    return Meteor.absoluteUrl('enroll/' + token);
};

Accounts.urls.resetPassword = function (token) {
    return Meteor.absoluteUrl('reset-password/' + token);
};*/

function getGravatar (email) {
    var options = {
        secure: true // choose between `http://www.gravatar.com`
                     //            and `https://secure.gravatar.com`
                     //            default is `false`
    };

    var md5Hash = Gravatar.hash(email);
// 5658ffccee7f0ebfda2b226238b1eb6e

    return Gravatar.imageUrl(email, options);
}

// if the reset password link is triggered,
// put the token into a session variable
Accounts.onResetPasswordLink(function(token){

    Session.set('resetPasswordToken', token);

});

Accounts.onEmailVerificationLink(function(token){
    Session.set('emailVerifyToken', token);
});

// main loginButtons equiv, use {{> maevLogin}}
Template.maevLogin.onRendered(function(){

    //when button renders for the first time,
    //checks if if reset password token has been set
    // == does the session var contain a token or is undefined
    // -- is set when reset password link is triggered
    var key = 'services.password.reset.token',
        token = Session.get("resetPasswordToken");
    if(token) {
        //call server method, test for token
        // == do a find for any user with that token
        Meteor.call('doesValueExist', key, token, function(err, res){
            // if there is an error, ignore it and return quietly/
            // *TODO* handle the error
            if(err) return null;

            // else use the result of the call -- will be true (if token exists) of false
            //  *todo*
            // setting which template will be displayed in the Modal
            // --
            console.log(key, token, res);
            var templateTarget = !res ? 'maevRegisteredUserResetPasswordForm' : 'maevLoginErrorMessage';
            //set up an error message just in case res is negative
            // -- its only used if the res was undefined and we need to display the failure message
            Session.set('loginErrors',{
                warning: 'The password reset token associated with that email has expired.',
                question: 'Are you using the most recent email we sent you?',
                template: 'maevRegisteredUserPasswordReset',
                action: 'request a new reset email'
            });
            Modal.set(templateTarget);
        })
    }
    key = 'services.password.reset.token';
    token = Session.get('emailVerifyToken');
    if(token){
        Accounts.verifyEmail(token);
        Router.go('/')
    }
});

Template.maevLogin.onCreated(function(){

    var self = this;

    Meteor.call('userCount', function(err, res){
        if (err) console.log('error on userCount Method');

        self.userCount = new ReactiveVar(res);

    });

})

Template.maevLogin.helpers({
   noUsers : function(){
       // try to find just one user
       // -- if
       var t = Template.instance();
       return t.userCount ? t.userCount.get() : null;
   }
});

Template.maevLogin.events({
    'click .item.sign.in' : function (evt) {
        Modal.set('maevLoginForm')
    },
    'click .item.register' : function (evt) {
        //Modal.set('maevLoginAccountSteps')
        Modal.set('maevLoginRegisterAccountForm')
    },
    'click .item.sign.out' : function (evt) {
        Meteor.logout();
    },
    'click .item.user.detail' : function (evt) {
        Modal.set('maevRegisteredUserProfileForm')
    },
    'click .item.change.password' : function (evt) {
        Modal.set('maevRegisteredUserChangePasswordForm')
    },
    'click .item.reminder' : function (evt) {
        Modal.set('maevLoginForm')
    },
    'click .item.roles' : function (evt) {

    }
});

// login form enclosure
Template.maevLoginForm.events({
    'click .item.register' : function (evt) {
        Modal.set('maevLoginRegisterAccountForm')
    },
    'click .item.password.reset' : function (evt) {
        Modal.set('maevRegisteredUserPasswordReset')
    }
});

// actual login form - for enclosue in the login form
Template.maevLoginPasswordForm.events({
    'submit #login-form' : function(evt, t){
        evt.preventDefault();
        //get email and pasword from the form
        var email = t.find('input[name="user"]').value,
            password = t.find('input[type="password"]').value;
        //and login
        Meteor.loginWithPassword(email, password, function(err){
            if (err) {
                // The user might not have been found, or their passwword
                // could be incorrect. Inform the user that their
                // login attempt has failed.
                Session.set('loginErrors',{
                    warning: 'Login failed! Unknown user or wrong password.',
                    question: 'Are you sure you used the correct credentials?',
                    template: 'maevLoginForm',
                    action: 'try the login again or request a password reset'
                });
                Modal.set('maevLoginErrorMessage')
            } else {
                // The user has been logged in.
                Modal.close();
            }


        });
        return false;
    }
});

// step form for registering a new accounts
Template.maevLoginAccountSteps.events({
    'click .step' : function(evt,t){
        var target = t.$(evt.target);

        //prepare the transition vars
        var targetFormId = target.attr('data-form');
        var visForm = t.$('.stepForm.transition.visible');
        var visFormId = visForm[0].id;

        // sort out the active
        t.$('.step').removeClass('active');
        target.addClass('active');

        // do gravatar
        if(targetFormId === 'Profile') {
            //set for gravatar
            Session.set('gravatar',getGravatar(t.$('input[name="email"]').val()));

            if (!Session.get('username'))  {
                var suggestedUsername = t.$('input[name="email"]').val().split('@')[0];
                console.log(suggestedUsername);
                Session.set('username', suggestedUsername);
            }
        }

        // do transition
        if(targetFormId !== visFormId)
            $(visForm).transition('horizontal flip', 500, function(){
                $('#maevLoginRegister' + targetFormId + 'Form').transition('horizontal flip', '500ms');
            });
    },
    'keyup input[data-reqd="true"]' : function () {
        
    }
});

Template.maevLoginAccountSteps.onCreated(function(){
    Session.set('username', null);
});

// email and password step in the registration process
Template.maevLoginRegisterAccountForm.onCreated(function(){
    //add some reactive vars to the template
    // to test for matching passwords
    this.isMatching = new ReactiveVar(false);
    this.isConfirmFocus = new ReactiveVar(false);
    this.emailmsg = new ReactiveVar();
    this.usermsg = new ReactiveVar();
});

Template.maevLoginRegisterAccountForm.onRendered(function(){
    //apply the strengthjs function to the password input
    var t = Template.instance();
    t.$("#strong-password").strength({
        strengthClass: 'strength',
        strengthMeterClass: 'strength_meter',
        strengthButtonClass: 'button_strength',
        strengthButtonText: 'Show password',
        strengthButtonTextToggle: 'Hide Password'
    });
    t.$(':input').val("");
});

Template.maevLoginRegisterAccountForm.helpers({
    isMatching: function () {
        return Template.instance().isMatching.get()
    },
    isConfirmFocus: function () {
        return Template.instance().isConfirmFocus.get()
    },
    emailmsg : function () {
        return Template.instance().emailmsg.get()
    },
    usermsg : function () {
        return Template.instance().usermsg.get()
    },

});

Template.maevLoginRegisterAccountForm.events({
    'keyup #strong-password,#confirm-password' : function(evt, t) {
        //get the password and confirm from the form
        var password = t.find('#strong-password').value,
            confirm = t.find('#confirm-password').value;
        //only test for matching if the confirm has some value
        if( confirm.length > 0 ){
            var matchingState = password===confirm;
            t.isMatching.set(matchingState);
            if(matchingState){
                //if matching, then enable the next step
                $('.profile.step').removeClass('disabled');
                $('.confirm.step').removeClass('disabled');
                //capture the formdata to move along the steps
                Session.set('formData', t.$('#register-form input').serializeArray());
            } else {
                //else, disable the next step
                $('.profile.step').addClass('disabled');
            }
        }

    },
    'focus #strong-password' : function(evt, t){
        if($(evt.target).val().length>0)
            t.isConfirmFocus.set(true)
    },
    'focus #confirm-password' : function(evt, t){
        t.isConfirmFocus.set(true)
    },
    'blur #confirm-password' : function(evt, t){
        t.isConfirmFocus.set(false)
    },
    'blur input[name="email"]' : function(evt, t){
        var target = t.$(evt.target);
        var key = 'profile.username',
            email = target.val();
        //test for uniqueEmail
        if(email !== "")
        Meteor.call('doesValueExist', key, email, function(err, res){
            if (err) return null;

            if (!res){
                var msg = "a test of blur";
                t.emailmsg.set(msg);
                target.focus();
            } else {
                var key = 'profile.username',
                    username = (email.split("@")[0]).replace(/\W+/g, "");

                Meteor.call('doesValueExist', key, username, function (err, res) {
                    if (err) return null;
                    console.log(key,username,res)
                    if (res) {
                        t.$('input[name="username"]').val(username);
                        var msg = "we guessed a username for you from your email (but you can still change it)"
                        t.usermsg.set(msg);
                    }
                })

            }
        });
    },
    'submit #register-form' : function (evt, t) {
        evt.preventDefault();
        console.log('as')
        var options = {};
        options.email = t.find('input[name="email"]').value;
        options.username = t.find('input[name="username"]').value;
        options.password = t.find('input[name="password"]').value;
        options.profile = {};
        options.profile.fullname = t.find('input[name="fullname"]').value;
        options.profile.bio = "";
        options.profile.avatar = getGravatar(options.email);
        Accounts.createUser(options, function (err) {
            if (!err){
                Meteor.call('onUserCreated',options.email,function(err, res){
                    Modal.close();
                })
            }
        });
    },
    'click button[type=reset]' : function (evt, t) {
        Modal.close();
    }
});

// the profile step in the registration process
Template.maevLoginRegisterProfileForm.helpers({
   url : function () {
       return Session.get('gravatar');
   },
    username : function () {
        return Session.get('username');
    }
});

Template.maevLoginRegisterProfileForm.events({
    'focus input[name="username"]' : function (evt, t) {
        var target = $(evt.target);
    }
});

// registered user edits profile form
Template.maevRegisteredUserProfileForm.events({
    'submit #registered-user-profile-form ' : function(evt, t){

        evt.preventDefault();
        var user = Meteor.user();
        var email = t.find('input[name="email"]').value,
            username = t.find('input[name="username"]').value,
            avatar = t.find('input[name="avatar"]').value,
            bio = t.find('textarea').value;
        console.log(user._id, email, username, avatar, bio);
        Meteor.call("updateProfile",email, username, avatar, bio, function(err, res){
            console.log(err,res,$('.item.selected.active'));
            $('.item.selected.active').removeClass("selected active");
            Modal.close();
        })
    },
    'click button[type="reset"]' : function(evt, t){

        evt.preventDefault();
        var user = Meteor.user();
        var email = t.find('input[name="email"]').value = user.emails[0].address,
            username = t.find('input[name="username"]').value = user.username,
            avatar = t.find('input[name="avatar"]').value = user.profile.avatar,
            bio = t.find('textarea').value = user.profile.bio;
        console.log(user._id,email, username, avatar, bio);
        $('.item.selected.active').removeClass("selected active");
        Modal.close();
    }
});


// registered user (who is logged in) changes password
// -- requires current password to enact
Template.maevRegisteredUserChangePasswordForm.onCreated(function(){
    //set up some reactive vars attached to the template
    //to be used in testing for password matches
    this.isMatching = new ReactiveVar(false);
    this.isConfirmFocus = new ReactiveVar(false);
});

Template.maevRegisteredUserChangePasswordForm.onRendered(function(){
    //apply strengthjs to password input
    var t = Template.instance();
    t.$("#strong-password").strength({
        strengthClass: 'strength',
        strengthMeterClass: 'strength_meter',
        strengthButtonClass: 'button_strength',
        strengthButtonText: 'Show password',
        strengthButtonTextToggle: 'Hide Password'
    });
});

Template.maevRegisteredUserChangePasswordForm.helpers({
    isMatching: function () {
        return Template.instance().isMatching.get() | false
    },
    isConfirmFocus: function () {
        return Template.instance().isConfirmFocus.get() | false
    }
})

Template.maevRegisteredUserChangePasswordForm.events({
    'keyup #strong-password,#confirm-password' : function(evt, t) {
        var password = t.find('#strong-password').value,
            confirm = t.find('#confirm-password').value;
        if( confirm.length > 0 ){
            Template.instance().isMatching.set(password===confirm);
            if(password===confirm){
                t.$('button[type="submit"').removeClass('disabled');
            } else {
                t.$('button[type="submit"').addClass('disabled');
            }
        }
    },
    'focus #strong-password' : function(evt, t){
        console.log('focus #strong-password', t.$(evt.target).val().length );
        if(t.$(evt.target).val().length>0)
            t.isConfirmFocus.set(true)
    },
    'focus #confirm-password' : function(evt, t){
        t.isConfirmFocus.set(true);
    },
    'blur #confirm-password' : function(evt, t){
        t.isConfirmFocus.set(false);
    },
    'submit #registered-user-change-password-form' : function(evt, t) {
        evt.preventDefault();

        var currentPassword = t.find('input[name="current-password"]').value,
            newPassword = t.find('input[name="new-password"]').value,
            confirmPassword = t.find('input[name="confirm-password"]').value;
        if (newPassword===confirmPassword) {
            Accounts.changePassword(currentPassword,newPassword,function(err){
                if(err) {
                    console.log(err);
                } else {
                    console.log("password changed");
                    $('.item.selected.active').removeClass("selected active");
                    Modal.close();
                }
            })
        }

    },
    'click button[type="reset"]' : function(){
        Modal.close();
    }
});

// non-logges-in registered user requests password reset
Template.maevRegisteredUserPasswordReset.events({
    'submit #password-reset-form' :function (evt, t) {
        evt.preventDefault();
        var email = t.find('input[name="email"]').value;
        Meteor.call('sendResetPasswordEmail',email, function (err, res) {
            if (err) return null;

            Session.set('loginErrors',{
                warning: 'No user account with that email was found.',
                question: 'Are you sure that\'s the correct address?',
                template: 'maevRegisteredUserPasswordReset',
                action: 'request a new reset email'
            });
            var templateToDisplay = res !== undefined ? 'passwordResetSent' : 'maevLoginErrorMessage'
            Modal.set(templateToDisplay);

        })
    }
});

// after user clicks reset email link
// -- shows new password form
Template.maevRegisteredUserResetPasswordForm.onCreated(function(){
    this.isMatching = new ReactiveVar(false);
    this.isConfirmFocus = new ReactiveVar(false);
    this.regForm = new ReactiveVar([]);
});

Template.maevRegisteredUserResetPasswordForm.onRendered(function(){
    var t = Template.instance();
    t.$("#strong-password").strength({
        strengthClass: 'strength',
        strengthMeterClass: 'strength_meter',
        strengthButtonClass: 'button_strength',
        strengthButtonText: 'Show password',
        strengthButtonTextToggle: 'Hide Password'
    });
    console.log('strong rendered')
});

Template.maevRegisteredUserResetPasswordForm.helpers({
    isMatching: function () {
        //console.log('helper', 'isMatching', Template.instance().isMatching)
        return Template.instance().isMatching.get() | false
    },
    isConfirmFocus: function () {
        //console.log('helper', 'isConfirmFocus', Template.instance().isConfirmFocus.get())
        return Template.instance().isConfirmFocus.get() | false
    }
});

Template.maevRegisteredUserResetPasswordForm.events({
    'keyup #strong-password,#confirm-password' : function(evt, t) {
        console.log('kup')
        var password = t.$('#strong-password').val(),
            confirm = t.$('#confirm-password').val();
        if( confirm.length > 0 ){
            Template.instance().isMatching.set(password===confirm);
        }

    },
    'focus #strong-password2' : function(evt, t){
        console.log('focus #strong-password', t.$(evt.target).val().length );
        if(t.$(evt.target).val().length>0)
            Template.instance().isConfirmFocus.set(true)
    },
    'focus #confirm-password' : function(evt){
        console.log('focus #confirm-password', Template.instance().isConfirmFocus.get())
        Template.instance().isConfirmFocus.set(true)
    },
    'blur #confirm-password' : function(){
        Template.instance().isConfirmFocus.set(false)
    },
    'submit #registered-user-reset-password-form' : function(evt, t) {
        evt.preventDefault();
        var newPassword = t.find('input[name="new-password"]').value,
            confirmPassword = t.find('input[name="confirm-password"]').value;
        console.log(newPassword, confirmPassword, newPassword===confirmPassword);
        if (newPassword===confirmPassword) {
            var token = Session.get('resetPasswordToken');
            Accounts.resetPassword(token,newPassword,function(err){
                if(err) {
                    console.log(err);
                } else {
                    console.log("password changed");
                    Session.set('resetPasswordToken',undefined);
                    Modal.close();
                    Router.go('/')
                }
            })
        }

    }
});

// An failure message for when processes don't
Template.maevLoginErrorMessage.helpers({
    error : function () {
        return Session.get('loginErrors')
    }
});

Template.maevLoginErrorMessage.events({
    'click a' : function(evt, t){
        evt.preventDefault();
        var template = t.$(evt.target).attr('data-template');
        Modal.set(template);
    }
});

Template.registerHelper('settings', function(target){
    var path = target.split(".");
    var settings = Meteor.settings.public.accounts;
    _.each(path, function(section){
        settings = settings[section];
    });
    return settings;
});

Template.registerHelper('isAdmin', function(){
    //var isAdmim = true;
    return _.contains(Meteor.user().roles, 'mdblog-admin');
});