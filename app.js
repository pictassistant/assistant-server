//console.log(require('./attendance').login('C2K17207238','123456'))


var scrap_faculty = require('./scraping/faculty')
const constants = require('./scraping/constants')

// scrap_faculty(
//     'http://faculty.pictinc.org/AS/AS-Department.aspx',
//     'http://faculty.pictinc.org/AS/AS-Faculty.aspx',
//     constants.FIRSTYEARENGG
// )

scrap_faculty(
    'http://faculty.pictinc.org/computer/Computer-Department.aspx',
    'http://faculty.pictinc.org/computer/CE-Faculty.aspx',
    constants.COMPUTER
)

// scrap_faculty(
//     'http://faculty.pictinc.org/EnTC/EnTC-Department.aspx',
//     'http://faculty.pictinc.org/EnTC/EnTC-Faculty.aspx',
//     constants.ENTC
// )

// scrap_faculty(
//     'http://faculty.pictinc.org/IT/IT-Department.aspx',
//     'http://faculty.pictinc.org/IT/IT-Faculty.aspx',
//     constants.IT
// )