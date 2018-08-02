var request = require('request');

function fetch(url_of_web_page, callback) {
    request(url_of_web_page, function (error, response, body) {
        if(response && response.statusCode == 200){
            callback(null, body)
        }
        else{
            callback("Error dowloading the page") ; 
        }
    });
}

/*

Example

fetch('http://faculty.pictinc.org/AS/AS-Department.aspx', function(err, html_content){
    if(err != null){
        console.log('Handle the error message Error : ' + err )
    }
    else{
        var fs = require('fs');
        fs.writeFile("some.html", body)
    }
})

*/

module.exports = fetch