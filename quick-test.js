var owl = $('.owl-carousel');

var treeview =  $('#quicktest_treeview');

function request(url, data, callback, processData = true, method = 'post') {

    let contentType = (processData) ? 'application/x-www-form-urlencoded; charset=UTF-8' : false;

    $.ajax({
        url: url,
        method: method,
        dataType: 'json',
        processData: processData,
        contentType: contentType,
        data: (data) ? data : {},
        success: function(res) {
            callback(res);
        },
        error: function(xhr, errno, errmsg) {
            console.log(xhr, errno, errmsg)
        }
    });
}
function processCallback(res) {

    if (res) {
        notify_success(res.message);
        render(res.content);
    }
}

function render(content) {

    if (content.code.length > 0) {

        $('#codeBox').html("<span class='m-auto'>" + content.code + "</span>");
    }

    if (content.result != null && content.result.length > 0) {

        switch (content.result_type) {
            case 'string':
                renderResult(content.result);
                break;
            case 'array':
                getTree(content.result);
                break;
            case 'object':
                getTree(content.result);
                break;
            default:
                renderResult('Error parsing query!');
                break;
        }
    }
}

function renderResult(res) {
    treeview.empty();
    treeview.append("<ul class='list-group'><li class='list-group-item'><i class='fas fa-check'></i><span class='ml-3'>" + res + "</span></li></ul>");
}

function analyzerMethodCallback(res) {

    if (res.length > 0) {
        $('#analyzerMethod option').not('option:eq(0)').remove();
        $.each(res, function(key, val) {
            let option = $('<option></option');
            option.html(val.methodName);
            option.val(val.methodName);
            $('#analyzerMethod').append(option);
        });
    }
}

function getTree(res){
    treeview.empty();
    treeview.treeview({
        data: res,
        expandIcon: 'fas fa-chevron-right',
        collapseIcon: 'fas fa-chevron-down',
        nodeIcon: 'fas fa-layer-group',
        onhoverColor: 'gainsboro',
        searchResultBackColor: '#f6d6d5',
        searchResultColor: 'black',
        onNodeSelected: function(event, data) {
            console.log(event, data);
        },
        onSearchComplete: function (event, results) {
            console.log(results);
        },
    });
    treeview.treeview('collapseAll', { silent: true });
}

// function showRequiredClasses(required_classes, hidden_classes) {

//     let hide_class = function(required_classes, val) {
//         for (i = 0; i < required_classes.length; i++) {
//             if (required_classes[i] === val) {
//                 return true;
//             }
//         }
//        return false;
//     }

//     $.each(hidden_classes, function(key, val){
//         if (hide_class(required_classes, val)) {
//             $('.' + val).removeAttr('hidden');
//         } else {
//             $('.' + val).attr('hidden', 'hidden');
//         }
//     });
// }

function uploadFile() {
    let fd = new FormData;
    fd.append('pcap', $('#pcap')[0].files[0]);
    fd.append('quicktestForm', $('#quicktestForm').serialize());
    fd.append('_token', $('meta[name=csrf-token]').attr('content'));
    request(window.location.origin + '/quick-test/file-upload', fd, callbackUpload, false);
}

function callbackUpload(res) {

    if (res.status) {
        notify_success(res.message);
        $('#traceFileName').val(res.filename);
    } else {
        notify_error(res.message);
    }
}

function search() {
    var pattern = $('#input-search').val();
    var options = {
            ignoreCase: $('#chk-ignore-case').is(':checked'),
            exactMatch: $('#chk-exact-match').is(':checked'),
            revealResults: $('#chk-reveal-results').is(':checked')
        };
    var results = treeview.treeview('search', [pattern, options]);
    var output = '<p>' + results.length + ' matches found</p>';
    $.each(results, function(index, result) {
        let parent = getParent(treeview, result.nodeId);
        let cleanText = result.text.match(/Frame\s+\d+/);

        if (cleanText) {
            res = result.text.match(/Info:.*/)[0].replace(/<\/span>/, '');
        } else {
            res = result.text;
        }

        if (typeof parent == 'string') {
            output += '<p><span class="badge badge-info">' + parent + '</span> - ' + res + '</p>';
        }
    });
    $('#search-output').html(output);
}

function getParent(treeview, nodeId) {
    let res = null;
    let p = treeview.treeview('getParent', nodeId);
    if (p[0] instanceof HTMLDivElement) {
        p = treeview.treeview('getNode', nodeId);
    }
    if (p.parentId == undefined) {
        let cleanText = p.text.match(/Frame\s+\d+/);
        res = (cleanText !== null && typeof cleanText[0] == 'string') ? cleanText[0] : p.text;
    } else {
        res = getParent(treeview, p.nodeId);
    }
    return res;
}

$(function(){

    request(window.location.origin + "/quick-test/functions", {}, analyzerMethodCallback, true, 'get');

    $('#uploadBtn').click(function(e){
        e.preventDefault();
        uploadFile();
    });

    $('#btn-search').on('click', search);

    $('#btn-clear-search').on('click', function(e) {
        treeview.treeview('clearSearch');
        $('#input-search').val('');
        $('#search-output').html('');
    });

    $('#query_methods div').draggable({
        cancel: "",
        revert: "invalid",
        containment: "#query_target",
        helper: "clone",
        cursor: "move",
        snap: true,
        drag: function(event, ui) {
            $('#query_target').addClass('query-target-hover');
        },
    });

    $('#query_target').droppable({
        accept: "#query_methods div",
        classes: {
            "ui-droppable-active": "custom-state-active"
        },
        drop: function( event, ui ) {
            let methods = ['select', 'from', 'where', 'filter'];
            let l = $(ui.draggable).html().toLowerCase();
            let id = $('#query_target').find('.query_input').length;
            if (methods.indexOf(l) != -1) {
                let clone = $('#query_' + l).clone();
                clone.removeAttr('hidden');
                clone.find('input').each(function(key, obj) {
                    let keys = "";
                    let x = $(obj).attr('name').replace(/query_input/, "").replace(/\[|\]/g, '|').replace(/[0-9]/g, '').match(/\w+/g)
                    x.forEach(function(val, key) {
                        keys += "[" + val +"]";
                    });
                    $(obj).attr('name', 'query_input[' + id + ']' + keys);
                });
                $(this).append(clone);
            } else {
                // let clone = ui.draggable.clone();
                // clone.removeClass('col-sm-2 col-md-2 float-left m-1');
                // clone.addClass('col-sm-12 col-md-12 ml-auto mr-auto mt-1 mb-1');
                // let input = $("<input />");
                // input.attr({
                //     type: 'hidden',
                //     hidden: 'hidden',
                //     name: 'query_input[' + id + '][' + l + ']',
                //     value: 1,
                //     class: 'query_input'
                // });
                // clone.append(input);
                let clone = $('#query_results').clone();
                clone.attr('name', '');
                clone.find('label').html(l.toUpperCase());
                clone.removeAttr('hidden');
                clone.find('input').attr({name: 'query_input[' + id + '][' + l + ']', type:'hidden'});
                $(this).append(clone);
            }
            $('#query_target').removeClass('query-target-hover');
        }
    });

    // $(document).on('dblclick', '#query_target div', function(e){
    //     $(e.currentTarget).remove();
    // });

    $(document).on('click', '.removeBtn', function(e){
        let el = $(this).parent();
        let findParent = function(el) {
            let id = el.attr('id');
            while ((/query_*/g).test(id) == false) {
                el = el.parent();
                id = el.attr('id');
            }
            return el;
        }
        let parent = findParent(el);
        parent.remove();
    });

    $('#analyzerMethod').change(function(e){
        if ($(this).val() === 'findSubscriberSession') {
            $('.subscriber').prop('hidden', false);
        } else {
            $('.subscriber').prop('hidden', true);
        }
    });

    $('#processBtn').click(function(e){
        request(window.location.origin + "/quick-test/process", $('#quicktestForm').serialize(), processCallback);
    });

    $('#chkQuickTestModal').click(function(e){
        $('#quickTestModal').modal('show');
    });
})