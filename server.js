require('dotenv').config();
let express = require('express');
let bodyParser = require('body-parser');
let logger = require('morgan');
let mongoose = require('mongoose');

let db = require('./models');

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

console.log( MONGODB_URI );

//
// Initialize Express
//
let app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set Handlebars.
let exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require('./routes/api-routes.js')(app);

// 
// connect to mongo db using mongoose
// 
console.log( MONGODB_URI );
mongoose.connect( MONGODB_URI, {useNewUrlParser: true} )
        .then( () => {
            app.listen(PORT, function() {
                console.log(`App running on port ${PORT}!`);
            });
        })
        .catch( (err) => {
            console.log( err );
        });