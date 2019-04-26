var logSource = null;

function sse(url, callback) {

    logSource = new EventSource(url);

    logSource.onmessage = callback; 
}

function renderLogs(event) {

    let data = JSON.parse(event.data);

    let lc = $('.log-content');

    if (data.length > 0) {

        lc.html(data.join('<br/>'));
    }

    let height = lc.height();

    let scrollHeight = lc[0].scrollHeight

    lc.scrollTop(parseInt(scrollHeight - height));
}

$(function(){

    sse(window.location.origin + '/test-set/log', renderLogs);

    $('.log-container button.minimize').click(function(e){

        let lc = $('.log-container .log-content');

        if (lc.attr('data-hidden') == 0) {

            lc.attr('data-hidden', '1');
            lc.slideUp(500);
        
        } else {

            lc.attr('data-hidden', '0');
            lc.slideDown(500);
        }

    });

    $('.log-container button.close').click(function(e){

        $('.log-container').attr('hidden', 'hidden');

        logSource = null;
    });
});