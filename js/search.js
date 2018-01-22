$('#searcher').quicksearch('table tbody tr', {
    'delay': 100,
    'bind': 'keyup keydown',
    'show': function() {
        if ($('#searcher').val() === '') {
            return;
        }
        $(this).addClass('show');
    },
    'onAfter': function() {
        if ($('#searcher').val() === '') {
            return;
        }
        if ($('.show:first').length > 0) {
        	$('html,body').scrollTop($('.show:first').offset().top);
        }
    },
    'hide': function() {
        $(this).removeClass('show');
    },
    'prepareQuery': function(val) {
        return new RegExp(val, "i");
    },
    'testQuery': function(query, txt, _row) {
        return query.test(txt);
    }
});

$('#searcher').focus();
