alertify.defaults = {
        // dialogs defaults
        autoReset:true,
        basic:false,
        closable:true,
        closableByDimmer:true,
        frameless:false,
        maintainFocus:true, // <== global default not per instance, applies to all dialogs
        maximizable:true,
        modal:true,
        movable:true,
        moveBounded:false,
        overflow:true,
        padding: true,
        pinnable:true,
        pinned:true,
        preventBodyShift:false, // <== global default not per instance, applies to all dialogs
        resizable:true,
        startMaximized:false,
        transition:'pulse',

        // notifier defaults
        notifier:{
            // auto-dismiss wait time (in seconds)  
            delay:5,
            // default position
            position:'top-right',
            // adds a close button to notifier messages
            closeButton: false
        },

        // language resources 
        glossary:{
            // dialogs default title
            title:'AlertifyJS',
            // ok button text
            ok: 'OK',
            // cancel button text
            cancel: 'Cancel'            
        },

        // theme settings
        theme:{
            // class name attached to prompt dialog input textbox.
            input:'form-control',
            // class name attached to ok button
            ok:'btn btn-primary',
            // class name attached to cancel button 
            cancel:'btn btn-danger'
        }
    };

function notify_success(message) {

    let m = 'Update successful';

    if (message) {

        m = message;
    }

    return alertify.success(m);
}

function notify_error(message) {

    let m = 'Ooops! Error updating';

    if (message) {

        m = message;
    }

    return alertify.error(m)
}

function notify_warning(message) {

    let m = 'Warning: ';

    if (message) {

        m = message;
    }

    return alertify.warning(m);
}

function notify_message(message) {

    let m = 'Message: ';

    if (message) {

        m = message;
    }

    return alertify.message(m);
}

function notify_default(message, type, callback) {

    let m = 'Default Message';

    if (message) {

        m = message;
    }

    if (type && callback) {

        return alertify.notify(m, type, callback);
    }

    return false;
}

function confirm_ppp(title, message, e, apply_status) {

    let m = 'Default Confirm';

    let t = 'Default Title';

    if (title) {

        t = title;
    }


    if (message) {

        m = message;
    }

    alertify.confirm(t, m,
        function(){ apply_status.val(1); switchResourceStatus(e, true);}, 
        function(){ apply_status.val(0); switchResourceStatus(e, true);}
    ).set('labels', {ok:'Yes', cancel:'No'});

}