

Meteor.methods({

    userCount : function () {
        var count = Meteor.users.find().count();
        return !count;
    },
    updateProfile : function (email, username, avatar, bio) {

        var Future = Npm.require('fibers/future');
        var Fut = new Future;

        Meteor.users.update({_id: this.userId},
            {
                $set:{
                    "emails":[{address:email}],
                    "username":username,
                    "profile.avatar":avatar,
                    "profile.bio":bio
                }
            },
            function(err, res) {
                if (err) return err;

                Fut.return(res)
            }
        );

        return Fut.wait();
    },
    sendResetPasswordEmail : function (email) {
        var user = Meteor.users.findOne({'emails.address': email});
        Accounts.sendResetPasswordEmail(user._id);
        return user._id;
    },
    onUserCreated : function (email) {
        // sends verify email and checks for first user, making it admin
        var user = Meteor.users.findOne({'emails.address': email});
        Accounts.sendVerificationEmail(user._id);
        if(Meteor.users.find().count()===1){
            //Meteor.users.update({_id: user._id},{$addToSet : {roles : "mdblog-admin"}})
            Roles.addUsersToRoles(user._id, "mdblog-admin");
        }
        return user._id;
    },
    doesValueExist : function (key, value) {
        var  query = {} ; query[key] = value;
        var valueExists = Meteor.users.findOne(query);
        return !valueExists;
    }
});