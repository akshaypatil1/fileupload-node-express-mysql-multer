// Setup core variables for the RESTful application and database connection

var node_port   = 3000;
var express     = require('express'); // This makes REST easy
var app         = express();
var db          = require('mysql'); //This sets up the MySQL connection
var path = require("path");
var db_pool     = db.createPool({
    host        : 'localhost',
    port        : '',
    database    : 'fileupload',
    user        : 'root',
    password    : ''
});
var multer = require('multer'),
    img = require('easyimage');
/* Setup static page delivery */
app.configure( function (){
    //app.use( express.static( __dirname + '/public' ) ); // This is the client side!
    app.use( express.logger( 'dev' ) ); // Any request to the server will print out in the console bash shell
	//app.use(express.bodyParser());
	app.use(multer({
        dest: './static/uploads/',
        rename: function (fieldname, filename) {
            return filename.replace(/\W+/g, '-').toLowerCase()+ Date.now();
        },
		limits: {
		  //fieldNameSize: 10,
		  //files: 2,
		  //fields: 5
		  //fieldSize: 1
		}
    }));
    app.use(express.static(__dirname + '/static'));
});


app.post('/api/upload', function (req, res) {
	
	var filename = req.files.userFile.name;  // This will give renamed file name
	var filepath = req.files.userFile.path;  // This will give file path from current location
	filepath = filepath.replace(/\\/g,"&#92;"); // This will replace 'backslash' with it's ASCII code in path
	var filetype = req.files.userFile.mimetype;  // This will give mimetype of file
		
	//res.setHeader( 'content-type', 'application/json' );

    // Get a connection to the database
    db_pool.getConnection( function ( objError, objConnection ){

        // check for any connection errors
        if( objError ){

            // There was an error, so send JSON with an error message and an HTTP status of 503 (Service Unavailable)
            sendError( res, 503, 'error', 'connection', objError );

        }else{
			
			
            objConnection.query(
                'INSERT INTO `file_details` (`fileid`, `filename`, `filepath`, `filetype`) VALUES (NULL, "'+filename+'", "'+filepath+'", "'+filetype+'");',
                function ( objError, objRows, objFields ){
                    if( objError ){
                        
                        // Couldn't get the query to run, so send JSON with an error message and an HTTP status of 500 (Internal Server Error)
                        sendError( res, 500, 'error', 'query', objError );
                    
                    }else{
                    
                        // We have query results back, so lets put the results in JSON and return them
                        res.send({
								image: true,
								file: req.files.userFile.originalname,
								savedAs: req.files.userFile.name
									});

                    }
                }
            );
            objConnection.release();
        }
    });	
	
	//console.log(req.files.userFile.name);
	//console.log(req.files.userFile.path);
	//var filePath = path.join(__dirname, '/static/uploads/'+req.files.userFile.name);
	//console.log(filePath);
 
});

/**
 * sendError is the JSON we use to send information about errors to the client-side.
 *     We need to check on the client-side for errors.
 */
function sendError( objResponse, iStatusCode, strResult,  strType, objError ){
    // I could throw errors at the HTTP response level, but I want to trap handled errors in my code instead
    //objResponse.statusCode = iStatusCode;
    objResponse.send({
        result  : strResult,
        err     : objError.code,
        err_type    : strType
    });
}

/* Start listening on port 3000 */
app.listen( node_port );
console.log( "App listening on port " + node_port );