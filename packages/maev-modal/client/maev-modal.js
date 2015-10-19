/*Template.modal.onRendered({

})*/

Session.set("modal",null);

Template.modal.helpers({
    modal : function(){

        return Session.get("modal");
    },
    target : function () {
        return Session.get("target");
    }
});

Modal = {
    set : function(target){
        //
        var targetmsg = {};
        console.log('16',target);
        if(target && !Template[target]) {
            targetmsg.msg = "Bad Target";
            targetmsg.detail = "The target template '" + target + "' does not exist.";
            target = undefined;
        } else if (!target) {
            targetmsg.msg = "Empty Target";
            targetmsg.detail = "You did not supply a template to include in the modal";
        }
        Session.set("target", targetmsg);
        //Session.set("overlay","_modal");
        Session.set("modal", target  || undefined);

        Meteor.setTimeout(function(){
            $('#maev-modal').modal('refresh');
            $('#maev-modal').modal('show');
        }, 0)

    },
    close : function () {
        //Session.set("overlay",null);
        Session.set("modal",null);

        $('#maev-modal').modal('hide');

    }
};
