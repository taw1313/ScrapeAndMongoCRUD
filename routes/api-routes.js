let axios = require('axios');
let cheerio = require('cheerio');
let db = require('../models');

module.exports = (app) => {
    app.get('/scrape', (req, res) => {
        console.log(`DEBUG - in scrape route`);
        axios.get('https://www.washingtonpost.com').then( (response) => {
          let $ = cheerio.load(response.data);
      
          $('.story-list').each( (i, element) => {
      
            let li = $(element).find('li');
                console.log( li.length );
                li.each( (j, e) => {
                    let result = {};

                    let aTag = $(e).find('a');
                    let headline = aTag.text().trim();
                    let link = aTag.attr('href').trim();
                    if ( headline && link ) {
                        let result = {};
                        result.headline = headline;
                        result.link = link;
                        db.Article.create( result )
                                  .then( (dbArticle) => {
                                    // console.log(dbArticle);
                                  })
                                  .catch( (err) => {
                                    return res.json(err);
                                  });
                    }
                });
      
          });

          $('.no-skin').each( (i, element) => {
            
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
                                .then( (dbArticle) => {
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

    app.get('/countLinks', (req,res) => {
      db.Article.aggregate( 
                 [
                  { $project: {_id: 1, headline: 1, link: 1} },
                  { $group: {_id: '$link', 
                             headlines: {$addToSet: "$headline"},
                             total_found: {$sum: 1}} },
                  { $sort: {total_found : -1} }
                 ], (error, results) => {
                     if (error) {
                         console.log( error );
                     }
                     else {
                         res.json(results);
                     }

                 });
    });
    
};