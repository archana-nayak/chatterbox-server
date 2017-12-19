/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var userMessageDB = {};


var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  // console.log('request', request);  
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
 
  var defaultCorsHeaders = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10 // Seconds.
  };
  // See the note below about CORS h6eaders.
  var headers = defaultCorsHeaders;
  var {method, url} = request;
  // Tell the client we are sending them plain text.
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  //=========================================================
  // Working Code below
  //=========================================================
  // headers['Content-Type'] = 'application/json';
  // // headers['Content-Type'] = 'text/json';
  // // console.log('request.url ', request);
  
  // var statusCode = 200;
  // if (request.method === 'POST') {
  //   statusCode = 201;
  // }
  // if (request.url !== '/classes/messages') {
  //   statusCode = 404;
  // }
  
  
  // response.writeHead(statusCode, headers);
  //============================================================

  
   
  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  
  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  //=================================================================
  // End of working code solution
  // response.end(JSON.stringify({results: ['Hello World!', 'Hi']}));
  //==================================================================
  var headers = defaultCorsHeaders;
  var {method, url} = request;
  let body = '';
  console.log('url ', url);
  var validUrlPath = {
    '/classes/messages' : '/classes/messages',
     // '/classes/room': '/classes/room'                
  };
  
  
  if (method === 'POST') {
    request.on('error', (err) => {
       console.log(err);
    });
    request.on('data', (bufferedChunks) => {
      body += bufferedChunks;
    });
    request.on('end', () => {
      console.log('body before toString ', body);
      body = body.toString();
      if (validUrlPath[url]) {
        if (!userMessageDB[url]) {
          userMessageDB[url] = [JSON.parse(body)];
        } else {
          console.log('userMessageDB ', userMessageDB);
          userMessageDB[url].push(body);
        }
      }

      console.log('body ', body);
    });  
  } else if (method === 'GET') {
      if (userMessageDB[url]) {
        body = userMessageDB[url];//body.concat();
      } else {
        body = ["Hello World GET"];  
      }
      
  } 
  //now write the response object
  //set status code and headers
  var statusCode = 200;
  headers['Content-Type'] = 'application/json';
  if (!validUrlPath[url]) {
    statusCode = 404;
    response.writeHead(statusCode,headers);
    response.end(JSON.stringify({}));
  } else if (method === 'POST') {
    statusCode = 201;
  }
  
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify({results : body}));
};


// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


exports.requestHandler = requestHandler;
