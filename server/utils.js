var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

exports.sendResponse = function(response, data,statusCode) {
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

//have a special method that will handle post requests
//which give you data to save on the server
//so we need to collect data off of the request
var collectData = function(request) {
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function(callback) {
    callback(JSON.parse(data));//parsing the data gives you access to the message object in data
  });
};