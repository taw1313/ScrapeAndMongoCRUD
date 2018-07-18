$(document).ready( function() {

    $('#scrapeBtn').on('click', e => {
       $.get('/scrape', (res) => {
           alert(res);
       });
    });

    $('#articlesBtn').on('click', e => {
        $('.articlesArea').empty();
        $.get('/countLinks', (articles) => {
            $('.articlesArea').append( `<h3> Total Articles found: ${articles.length} </h3>` );
            articles.forEach( (a) => {
                let outStr = `<p> ${a.total_found} ${a._id} </p>`;
                $('.articlesArea').append( outStr );
            });
        });
    });

});