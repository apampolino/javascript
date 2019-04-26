let row_keys = ['CALID'];

let pagination = new Pagination({
    container: '#nav-list .pagination', 
    resultContainer: '#nav-list .pagination-results',
    query: [{limit:10}],
    keys: row_keys,
    dataContainer: '#lineID_list',
    sideLinks: 2,
    buttonDisplay: 5,
    paginationOnly: false,
    search: '#lineID_search',
    customRender: customRender
});

pagination.init('url');

function Pagination(obj) {
    
    this.container = obj.container,
    
    this.resultContainer = obj.resultContainer,
    
    this.pagination_data = null,

    this.url = null;

    this.query = (obj.query) ? obj.query : '',

    this.search = (obj.search) ? obj.search : null,

    this.keys = (obj.keys) ? obj.keys : [],

    this.sideLinks = (obj.sideLinks) ? obj.sideLinks : 2;

    this.buttonDisplay = (obj.buttonDisplay) ? obj.buttonDisplay : 5;

    this.dataContainer = obj.dataContainer;

    this.paginationOnly = (obj.paginationOnly) ? obj.paginationOnly : false;

    this.customRender = (obj.customRender) ? obj.customRender : null;

    this.init = function(url) {

        this.url = url;

        this.loadData(url);
    },

    this.renderData = function() {

        let p = this;

        let rows = this.pagination_data.data;

        let main = $(this.dataContainer);

        main.find('tr.evt-data').remove();

        $.each(rows, function(key, row){

            let clone = main.find('.clone').clone(true);
            
            clone.removeAttr('hidden');
            
            clone.removeClass('clone');

            clone.addClass('evt-data');
            
            $.each(p.keys, function(k, v){

                clone.find('.' + v).html(row[v])
            });

            main.find('tbody').append(clone);
        });
    }
    
    this.renderLinks = function() {

        let pagination_data = this.pagination_data;

        if (this.container && this.resultContainer && pagination_data)
        {
            if (pagination_data)
            {
                let current_page = pagination_data.current_page;

                let last_page = pagination_data.last_page;

                let page_url = pagination_data.path;

                let page_url_prev = pagination_data.prev_page_url;

                let page_url_next = pagination_data.next_page_url;

                let from = pagination_data.from;

                let to = pagination_data.to;

                let total = pagination_data.total;

                let container = $(this.container);

                let resultContainer = $(this.resultContainer);

                let li = $('<li class="page-item" aria-current="page"></li>');

                let prev_li = li.clone();

                let next_li = li.clone();

                let side_links = 2;
                
                container.find('li').remove();

                if ( last_page > 1 ) {

                    container.removeAttr('hidden');
                }

                if ( current_page == 1 ) {

                    prev_li.addClass('disabled');

                    let prev_link = $('<span class="page-link" aria-hidden="true">‹</span>');

                    prev_li.append(prev_link);

                } else {

                    prev_li.removeClass('disabled');

                    let prev_link = $('<a class="page-link ajax-link" href="' + page_url_prev + '" rel="prev" aria-label="« Previous">‹</a>');

                    prev_li.append(prev_link)
                }

                // attach previous button
                container.append(prev_li);

                for (let i = 1; i <= last_page; i++) {

                    let page_li = li.clone();

                    let href = page_url + '?page=' + i;
                    
                    if (i == current_page) {

                        page_li.addClass('active');

                        page_link = $('<span class="page-link">' + i + '</span>');

                    } else {

                        page_link = $('<a class="page-link ajax-link" href="' + href + '">' + i + '</a>');
                    }

                    page_li.append(page_link);
                    
                    if (i <= this.buttonDisplay && i >= (current_page - this.sideLinks) || i >= (current_page - side_links) && i <= (current_page + side_links) || i > (last_page - this.buttonDisplay) && current_page >= (last_page - this.sideLinks)) {       

                        container.append(page_li);
                    }
                }
                
                if (current_page == last_page) {

                    next_li.addClass('disabled');

                    let next_link = $('<span class="page-link" aria-hidden="true">›</span>');

                    next_li.append(next_link);

                } else {

                    next_li.removeClass('disabled');

                    let next_link = $('<a class="page-link ajax-link" href="' + page_url_next + '" rel="next" aria-label="Next »">›</a>');

                    next_li.append(next_link)
                }
                
                // attach next button
                container.append(next_li);

                if (from != 0 && to != 0 && total != 0) {

                    resultContainer.html('Showing ' + from + ' to ' + to + ' of ' + total +' entries');
                }
            }
        }

        this.initAjaxLinks();

        this.initSearch();

    },
    
    this.initSearch = function () {

        let p = this;

        if (this.search !== null) {
            
            $(this.search).on('keypress', function(e){

                if (e.keyCode == 13) {

                    p.loadData(p.url);
                }
            });
        }
    },

    this.initAjaxLinks = function() {

        let p = this;

        $('.ajax-link').on('click', function(e){
        
            e.preventDefault();

            let url = $(this).attr('href');

            p.loadData(url);

        });
    },
    
    this.loadData = function(url) {

        let p = this;

        $.ajax({
            url: this.generateQuery(url),
            method:'get',
            dataType: 'json',
            success: function(res) {

                p.pagination_data = res;

                if (!p.paginationOnly) {

                    if (p.customRender !== null) {

                        p.customRender(res);

                    } else {

                        p.renderData();
                    }
                }

                p.renderLinks();

            },
            error: function(xhr, errno, errmsg) {

                console.log(xhr, errno, errmsg);
            }
        });
    },

    this.generateQuery = function(url) {

        let params = this.query;

        let q = ((/\?/g).test(url)) ? '&' : '?';

        for (i = 0; i < params.length; i++) {

            for (x in params[i]) {

                q += x + '=' + params[i][x];
            }

            if (i < params.length - 1) {

                q += '&';
            }
        }

        if (this.search !== null) {

            q += '&search=' + $(this.search).val();
        }

        return url + q;
    }
}