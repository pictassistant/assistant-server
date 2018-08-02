const cheerio = require('cheerio')

const SECRET_KEY = '310a7b2cd0e52dd19c9bbe4c78f1eb6778af88a67a5990969273711054584e037c3bee2f22ea5ebfe7cb6b3d151f54b87c0b232f5424fb54ebdf64f590e9e913' // this is SHA of mySuperPassword

function passwordToSHAPasskey(plainPassword){
    var encryption = require('./encryption');
    var encryptedString = encryption.crypto.encrypt(plainPassword,SECRET_KEY, 256)
    return encryptedString
}

function getAttendanceOf(regNumber, plainPassword, dealWithAttendance){
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
        request('http://pict.ethdigitalcampus.com/DCWeb/form/jsp_sms/StudentsPersonalFolder_pict.jsp?dashboard=1', function (error, response, body) {
            if(error == null){
                // console.log(body)
                // console.log(response.statusCode) // 200
                // console.log(response.headers['content-type']) // 'image/png'
                dealWithAttendance(body)
            }
            else{
                console.log('Some Error loading data with credential')
            }
        });
    });
}

getAttendanceOf('C2K17207238','123456', function(html_content){
    const $ = cheerio.load(html_content)
    var faculty_urls = $('#table1 tbody tr.child')
    for (let i = 0; i < faculty_urls.length; i++) {
        const element = faculty_urls.next()
        //console.log(element.html())
        const html = cheerio.load('' + element.html())
        // var faculty_urls = $('td a')
        // var html = cheerio.load('<html>' + element.html() + '</html>')
        console.log(html.text().trim())

        // var all_td = html('td')
        // console.log(all_td.length)
        // console.log(all_td.next().text())
    }
    
})

module.exports.getAttendanceOf = getAttendanceOf
