$(document).ready( function() {

    $('#scrapeBtn').on('click', e => {
        $.get('/scrape', (res) => {
            alert(res);
            location.reload();
        });
    });

});