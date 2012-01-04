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
 
// This is an attempt to create a display function for a har file
// 


exports.print = function (request,response) {
		var data = '';
		request.setEncoding('utf8');
		request.on('data', function(chunk) { 
			data += chunk; 
			console.log('CHUNK -->' + chunk + '\n');
		});
		request.on('end', function() {
		    var lines=data.split('\n');
			var parsedData = JSON.parse(lines[4]);
			response.writeHead(200, {'content-type': 'text/html' });
			response.write('<html>\n');
			response.write('<head>\n');
			for (var i=0;i<parsedData.log.entries.length;i++){
				response.write(parsedData.log.entries[i].pageref + '</br>');
			}

			response.write('</head>\n');
			response.write('<body>\n');
			response.write('</body>\n');			
			response.write('</html>\n');
			response.end();
		});
};	