let axios = require('axios');
let cheerio = require('cheerio');
let db = require('../models');

module.exports = function(app) {
    app.get('/scrape', function(req, res) {
        // First, we grab the body of the html with request
        axios.get('https://www.washingtonpost.com').then(function(response) {
          // Then, we load that into cheerio and save it to $ for a shorthand selector
          let $ = cheerio.load(response.data);
      
          $('.story-list').each(function(i, element) {
      
            console.log( 'Found a ul of story-list ' );
            // Add the text and href of every link, and save them as properties of the result object
            //result.title = $(element).find('a').text();
            let li = $(element).find('li');
                console.log( li.length );
                li.each(function (j, e) {
                    let result = {};

                    let aTag = $(e).find('a');
                    let headline = aTag.text().trim();
                    let link = aTag.attr('href').trim();
                    if ( headline && link ) {
                        let result = {};
                        result.headline = headline;
                        result.link = link;
                        db.Article.create( result )
                                  .then( function(dbArticle) {
                                    console.log(dbArticle);
                                  })
                                  .catch( (err) => {
                                    return res.json(err);
                                  });
                    }
                });
      
          });

          $('.no-skin').each(function(i, element) {
            
              let headlineElement = $(element).find('.headline').find('a');
              if ( headlineElement ) {
                  let headline = headlineElement.text().trim();
                  let link = headlineElement.attr('href');
                  if ( headline && link ) {
                      let result = {};
                      result.headline = headline;
                      result.link = link;
                      let summaryElement = $(element).find('.blurb');
                      if ( summaryElement ) {
                          let summary = summaryElement.text().trim();
                          if ( summary ) result.summary = summary;
                      }
                      db.Article.create( result )
                                .then( function(dbArticle) {
                                  console.log(dbArticle);
                                })
                                .catch( (err) => {
                                  return res.json(err);
                                });
                  }
              }
          });
      
          res.send('Scrape Complete');
        });
    });

    app.get('/countLinks', function(req,res) {
      db.Article.aggregate( 
                 [
                  { $project: {_id: 1, headline: 1, link: 1} },
                  { $group: {_id: '$link', 
                             headlines: {$addToSet: "$headline"},
                             total_found: {$sum: 1}} },
                  { $sort: {total_found : -1} }
                 ], function(error, results) {
                     if (error) {
                         console.log( error );
                     }
                     else {
                         res.json(results);
                     }

                 });
    });
    
};