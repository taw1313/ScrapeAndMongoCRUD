$(document).ready( function() {

    //---------------------------------------------------------------------------------------------
    //  Scrape web site
    //---------------------------------------------------------------------------------------------
    $('#scrapeBtn').on('click', function(e) {
        $.get('/scrape', function(res) {
            location.reload();
        });
    });

    //---------------------------------------------------------------------------------------------
    //  Delete an article
    //---------------------------------------------------------------------------------------------
    $('.delField').on('click', function(e) {
        let dbID = $(this).attr('dbid');
        $.ajax({
            method: 'DELETE',
            url: `/api/removeArticle/${dbID}`
        })
            .then(function() {
                location.reload();
            });
    });

    //---------------------------------------------------------------------------------------------
    //  Get all notes for an article
    //---------------------------------------------------------------------------------------------
    $('.numNotesField').on('click', function(e) {
        let dbID = $(this).attr('dbid');
        $.get(`/api/readNotes/${dbID}`, function(res) {
            console.log( 'display modal' );
        })
    });

});