This will help you to upload any file and store it's details to MySQL using NODEjs


0)	Nodejs and npm should be installed
1)	Download this code.master and unzip it somewhere
2)	open console goto the path
3)	run :	npm install
	this will install all dependencies
4)	Create a DB in your MYSQL with name 'fileupload'
	import 'fileupload.sql'
5)	now take a look on server.js file
	You may need to change DB user and password
6)	open console goto the path
	run :	node server.js
	this will start nodejs server
7)	open browser and postman rest client
	user URL:	http://localhost:3000/api/upload
	Method:		POST
	FileKey:	userFile

	That will store your file in \static\uploads location
	And it's information in DB

Good LUCK