//Author: Jan van der Meiden
//jvdmeiden@googlemail.com
//Version: 20120201.00
//
//Copyright © 2012 Jan van der Meiden.
 
//
//Copying and distribution of this file, with or without modification,
//are permitted in any medium without royalty provided the copyright
//notice and this notice are preserved.
//
 
// This is an attempt to create a nodejs webserver....
//  
 
var	http = require('http'), 
	url = require('url'), 
	path = require('path'), 
	fs = require('fs'); 
	harpoon = require('./lib/harpoon');
    
http.createServer(function(request, response) { 
	var uri = url.parse(request.url).pathname; 
	if (uri == '/'){
		uri='index.html';
	} else if (uri == '/har.js') {
		try {
			harpoon.print(request, response);
		}
		catch (err){ 
			response.writeHeader(500, {'Content-Type': 'text/plain'}); 
			response.write(err + '\n'); 
			response.end(); 
		}
		
	} else {
	
		var filename = path.join(process.cwd(), uri); 
		var re_html=new RegExp(/\.[hH][tT][mM][lL]$/);
		var re_svg=new RegExp(/\.[sS][vV][gG]$/);
		var re_js=new RegExp(/\.[jJ][sS]$/);
		var re_css=new RegExp(/\.[cC][sS][sS]$/);
		var re_json=new RegExp(/\.[jJ][sS][oO][nN]$/);
		var re_xml=new RegExp(/\.[xX][mM][lL]$/);
		var re_xhtml=new RegExp(/\.[xX][hH][tT][mM][lL]$/);
		var logPath = "access_log";
		var now = new Date();
		var dateAndTime = now.toUTCString();
		stream = fs.createWriteStream(logPath, {
			'flags': 'a+',
			'encoding': 'utf8',
			'mode': 0644
		});
		stream.write(dateAndTime + " | ", 'utf8');
		stream.write(request.connection.remoteAddress + " | ", 'utf8')
		stream.write(request.url + " | ", 'utf8');
		stream.write(JSON.stringify(request.headers) + "\n", 'utf8');
		stream.end();
 
		path.exists(filename, function(exists) { 
			console.log(filename);
			if(!exists) { 
				response.writeHeader(404, {'Content-Type': 'text/plain'}); 
				response.write('404 Not Found\n'); 
				response.end(); 
				return; 
			} 
 
			fs.readFile(filename, 'binary', function(err, file) { 
				if(err) { 
					response.writeHeader(500, {'Content-Type': 'text/plain'}); 
					response.write(err + '\n'); 
					response.end(); 
					return; 
				}
				if ( filename.match(re_html)){
					response.writeHeader(200, {'Content-Type': 'text/html'});
				} else if ( filename.match(re_js)){
					response.writeHeader(200, {'Content-Type': 'application/javascript'});
				} else if ( filename.match(re_svg)){
					response.writeHeader(200, {'Content-Type': 'image/svg+xml'});
				} else if ( filename.match(re_css)){
					response.writeHeader(200, {'Content-Type': 'text/css'});
				} else if ( filename.match(re_json)){
					response.writeHeader(200, {'Content-Type': 'application/json'});			
				} else if ( filename.match(re_xml)){
					response.writeHeader(200, {'Content-Type': 'text/xml'});			
				} else if ( filename.match(re_xhtml)){
					response.writeHeader(200, {'Content-Type': 'application/xhtml+xml'});			
				}else { 
					response.writeHeader(200, {'Content-Type': 'text/plain'});
				}   
				response.write(file, 'binary'); 
				response.end();
			
			}); 
		});
	}
}).listen(8080); 
    
console.log('Server running at http://localhost:80/');  