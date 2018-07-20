let axios = require('axios');
let cheerio = require('cheerio');
let db = require('../models');

const dbReadHeadlineData = (res) => {

    db.Article.aggregate( [
        { $project: {
            headline: 1 ,
            numNotes: {$size: '$notes'}
           } 
        },
        { $sort: {createdDate : -1} } ], 
        (error, results) => {
            console.log(results);
        if (error) {
            console.log( error );
        }
        else {
            //
            // define handlebars object that will contain data needed needed for DOM
            //
            let articlesObject = { 
                articlesCount: results.length,
                articles: results 
            };
            res.render('index', articlesObject);
        }
    });
};

//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
const dbCreateArticle = ( headline, link, element ) => {
    if ( headline && link ) {
        let result = {};
        result.headline = headline;
        result.link = link;
        let summaryElement = element.find('.blurb');
        if ( summaryElement ) {
            let summary = summaryElement.text().trim();
            if ( summary ) result.summary = summary;
        }
        db.Article.create( result )
                  .then( (dbArticle) => {
                      // console.log(dbArticle);
                      let note = {
                          title: `Test ${i}`,
                          body: `Body ${dbArticle._id}`
                      };
                      dbCreateNote( dbArticle._id, note );
                  })
                  .catch( (err) => {
                      //
                      // ignore duplicate errors
                      //
                      if ( err.code != 11000 ) res.send(err.message);
                  });
    }
};

const dbCreateNote = ( articleID, note ) => {
    db.Note.create(note)
      .then( (dbNote) => {
          return db.Article.findOneAndUpdate( 
              {_id: articleID}, 
              {$push: {notes: dbNote._id} }, 
              {new: true} );
      })
      .then( (dbArticle) => {
          console.log(dbArticle);
      })
      .catch( (err) => {
          // TODO: look at error handling
          console.log(err.message);
      })
};

//-------------------------------------------------------------------------------------------------
//  Define routes
//-------------------------------------------------------------------------------------------------
module.exports = (app) => {
    //---------------------------------------------------------------------------------------------
    // default route - read all headlines that currently in db
    //---------------------------------------------------------------------------------------------
    app.get('/', (req,res) => {
        dbReadHeadlineData( res );
    });

    //---------------------------------------------------------------------------------------------
    //  Get all notes for an article
    //---------------------------------------------------------------------------------------------
    app.get('/api/readNotes/:id', (req,res) => {
        console.log ( `In readNotes route ${req.params.id}` );
        db.Article.findOne({ _id: req.params.id })
                  .populate("notes")
                  .then(function(dbArticle) {
                      console.log(dbArticle);
                      res.json(dbArticle);
                  })
                  .catch(function(err) {
                  res.json(err);
        });
    });

    //---------------------------------------------------------------------------------------------
    //  Delete an article from the db
    //---------------------------------------------------------------------------------------------
    app.delete('/api/removeArticle/:id', (req,res) => {
        db.Article.remove( {_id: req.params.id } )
            .then( response => {
                res.send(response);
            })
            .catch( err => {
                res.send(err);
            });
    });

    //---------------------------------------------------------------------------------------------
    //  Scrape web site and store headlines in db
    //---------------------------------------------------------------------------------------------
    app.get('/scrape', (req, res) => {
        console.log(`DEBUG - in scrape route`);
        axios.get('https://www.washingtonpost.com').then( (response) => {
            let $ = cheerio.load(response.data);
            //
            // Find headlines that are part of main section
            //
            $('.no-skin').each( (i, element) => {
                let headlineElement = $(element).find('.headline').find('a');
                if ( headlineElement ) {
                    let headline = headlineElement.text().trim();
                    let link = headlineElement.attr('href');
                    dbCreateArticle( headline, link, $(element) );
                }
            });

            //
            // Find headlines from the bottom section that are not part of main section above
            //
            $('.story-list').each( (i, element) => {
                let li = $(element).find('li');
                li.each( (j, e) => {
                    let aTag = $(e).find('a');
                    let headline = aTag.text().trim();
                    let link = aTag.attr('href').trim();
                    dbCreateArticle( headline, link, $(e) );
                });
            });

            //
            // TODO: db writes could still be occuring...
            //       need to add logic to either wait or update the web page when 
            //       each write has completed
            //
            res.send('Scrape Complete');    
        });
    });
 
};