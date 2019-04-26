var idleModal = $('#idle');
var idleTime = idleModal.find('#idle-time');
var s_day = 86400;
var s_hours = 3600;
var s_minutes = 60;
var timer = null;
var logout = null;

function getTimeLapse(x) {
    let hour = convertTime(x, s_hours);
    let minutes = convertTime(hour.excess, s_minutes);
    let seconds = minutes.excess;
    return hour.quo + "h " + minutes.quo + "m " + seconds + "s";
}

function convertTime(seconds, divisor) {
    let a = Math.floor(seconds / divisor);
    let b = seconds % divisor;
    return {quo:a, excess: b};
}

function startSessionTimer() {
    let ctr = 0;
    timer = setInterval(function(){
        ctr += 1;
        // 30 minutes idle
        if (ctr == parseInt(session_idle)) {
            idleModal.modal('show');
            let logout_ctr = parseInt(session_logout); // 5 minute timer to logout
            logout = setInterval(function(){
                idleTime.find('strong').text(getTimeLapse(logout_ctr));
                logout_ctr -= 1;
                if (logout_ctr == 0) {
                    clearInterval(timer);
                    clearInterval(logout);
                    removeSession();
                }
            }, 1000)
        }
    }, 1000);
}

function removeSession(){
    let f = $('<form method="GET"></form>');
    f.attr('action', window.location.origin + '/logout');
    $('body').append(f);
    f.submit();
}

(function(){

    startSessionTimer();

    $(document).on('mousedown', function(e){
        clearInterval(timer);
        clearInterval(logout);
        idleTime.find('strong').text('');
        startSessionTimer();
    });

    $('#idleLogoutBtn').click(function(e){
        removeSession();
    });
})();