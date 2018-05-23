var https = require('https');

var config = require('../../config/config'); 


var resolveUrl = function(request, response) {

    // set appId to the message object 
    let targetUrl = request.query.targetUrl;
    
    var headers = {
        "Content-Type": "application/json; charset=utf-8"
      };
    
    var options = {
      host: "api.linkpreview.net",
      port: 443,
      path: "/?key=" + config.linkPreview.api_key +"&q=" + targetUrl,
      method: "GET",
      headers: headers
    };
   
    var req = https.request(options, function(res) {  
      res.on('data', function(data) {
          try{
            let string = data.toString()
            let output = JSON.parse(string);

            output["seller"] = output.url.substring(output.url.indexOf("://") + 3, output.url.indexOf("."))
            response.json(output);
          }catch(err){
            response.send(500, "something went wrong resolving the URL")
          }
       
      });
    });
    
    req.on('error', function(e) {
      config.logger.error(e);
      res.send(500, e);

    });
    
    req.end();
  };

  
module.exports = { resolveUrl };
