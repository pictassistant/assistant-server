const SECRET_KEY = '310a7b2cd0e52dd19c9bbe4c78f1eb6778af88a67a5990969273711054584e037c3bee2f22ea5ebfe7cb6b3d151f54b87c0b232f5424fb54ebdf64f590e9e913' // this is SHA of mySuperPassword

function passwordToSHAPasskey(plainPassword){
    var encryption = require('./encryption');
    var encryptedString = encryption.crypto.encrypt(plainPassword,SECRET_KEY, 256)
    return encryptedString
}

function login(regNumber, plainPassword){
    var request = require('request');
    var fs = require('fs')
    
    var request = request.defaults({jar: true}) // Enable Session On this requests library
    passKey = passwordToSHAPasskey(plainPassword)

    var authenticatePayload = {
        'loginid' : regNumber,
        'password' : passKey,
        'dbConnVar':'PICT',
		'hiddenfield': SECRET_KEY, 
        'service_id': ''
    }
    request.post({url:'http://pict.ethdigitalcampus.com/DCWeb/authenticate.do', formData: authenticatePayload}, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        fs.writeFile('data.json',JSON.stringify(httpResponse));
        request
            .get('http://pict.ethdigitalcampus.com/DCWeb/form/jsp_sms/StudentsPersonalFolder_pict.jsp?dashboard=1')
            .on('response', function(response) {
                console.log(response.statusCode) // 200
                console.log(response.headers['content-type']) // 'image/png'
            })
            .pipe(fs.createWriteStream('look1.html'))  // Temp storing in look1.html

            return {
                data: 'Some Data',
                done: true
            }
    });
}


module.exports.login = login