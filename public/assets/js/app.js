$(document).ready( function() {

function createNoteModal( aID, res ) {

    $('#noteTableData').empty();
    for (let i=0; i<res.notes.length; i++) {
        $('#noteTableData').append(`<tr>`);
        $('#noteTableData').append(`<td>${res.notes[i].title}</td>`); 
        $('#noteTableData').append(`<td>${res.notes[i].body}</td>`);
        $('#noteTableData').append(`<td class='fas fa-trash-alt delNote' aid=${aID} nid=${res.notes[i]._id}> </td>`);
        $('#noteTableData').append(`</tr>`);
    }
    $('#addNote').attr('aid', aID);

    $('#noteModal').modal('show');

}


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
        let aID = $(this).attr('aid');
        $.ajax({
            method: 'DELETE',
            url: `/api/removeArticle/${aID}`
        })
            .then(function() {
                location.reload();
            });
    });

    //---------------------------------------------------------------------------------------------
    //  Delete a note
    //---------------------------------------------------------------------------------------------
    $('#noteTableData').on('click', '.delNote', function(e) {
        let aID = $(this).attr('aid');
        let nID = $(this).attr('nid');
        let dbIDs = { 
            articleID: aID, 
            noteID: nID 
        };
        console.log(`Del Note: ${nID}`);
        $.ajax(`/api/removeNote`,
            {
                type: 'DELETE',
                data:  dbIDs
            })
            .then(function() {
                location.reload();
            });
    });

    //---------------------------------------------------------------------------------------------
    //  Add a note
    //---------------------------------------------------------------------------------------------
    $('#addNote').on('click', function(e) {
        console.log(`Add Note selected`);
    });

    //---------------------------------------------------------------------------------------------
    //  Get all notes for an article
    //---------------------------------------------------------------------------------------------
    $('.numNotesField').on('click', function(e) {
        let aID = $(this).attr('aid');
        $.get(`/api/readNotes/${aID}`, function(res) {
            createNoteModal( aID, res );
        });
    });

    //---------------------------------------------------------------------------------------------
    //  Show form to add note
    //---------------------------------------------------------------------------------------------
    $('#addNote').on('click', function(e) {
        let aID = $(this).attr('aid');
        $('#addNoteBtn').attr('aid', aID);
        $('#addNoteDiv').modal('show');
    });

    //---------------------------------------------------------------------------------------------
    //  Show form to add note
    //---------------------------------------------------------------------------------------------
    $('#addNoteBtn').on('click', function(e) {
        const noteDetails = {
            title: $('#txtTitle').val(),
            body: $('#txtBody').val(),
            aID: $(this).attr('aid')
        };

        $.post('/api/addNote', noteDetails, (res) => {
            location.reload(true);
        });
    });

});