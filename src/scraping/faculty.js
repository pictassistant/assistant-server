var fs = require('fs');
const fetcher = require('./web_page_fetcher')
const cheerio = require('cheerio')

const BASE_URL = 'http://faculty.pictinc.org'

var db_array = []

function saveFacultyDetails(responsebody, additionalContent, dealWithProfile){
    
    const $ = cheerio.load(responsebody)
    
    var rows = $('tr', 'table.tableCentermulti tbody')

    var profile = {}

    profile.dp =  BASE_URL + '/' + $('#Image1').attr('src') //'http://faculty.pictinc.org/UploadImages/'

    //console.log(rows.length)
    rows.each(function(index, element){
        var key = $(this).children().children().text().trim().slice(0,-1).trim().replace(/\s/g,'').toLowerCase()
        var value = $(this).children().html().trim().split('</b>')[1].trim()

        profile[key] = value
    })

    // If additional data put it 
    if( additionalContent ){
        for (var key in additionalContent) {
            if (additionalContent.hasOwnProperty(key)) {
                profile[key] = additionalContent[key]
            }
        }
    }

    //console.log(profile)
    dealWithProfile(null, profile);

}
/**
 * 
 * @param {string} hod_page_url URL of Starting page of HOD of a particular Stream
 * @param {string} faculty_page_url Faculty list of webpage
 * @param {string} department DEPARTMENT Name or Abbr
 * @param {function} dealWithProfile What to do with each scrapped faculty record/profile Example it can be used to save a particular record to database
 */
function start(hod_page_url, faculty_page_url, department, dealWithProfile) {
    // Fetch information of HOD and then Go for the teachers
    fetcher(hod_page_url, (err, html_content) => {
        
        // Grab hod link 
        const $ = cheerio.load(html_content)

        var hod_web_page_link = BASE_URL + $('#HyperLink1').attr('href').substring(2)
       
        fetcher(hod_web_page_link, (err, html_content) => { 
            saveFacultyDetails(html_content,{ 'link' : hod_web_page_link },dealWithProfile) // HOD
        })

        fetcher(faculty_page_url, (err, html_content) => { 
            // Save faculty details

            const $ = cheerio.load(html_content)
            var faculty_urls = $('td a')
            console.log("length: " + faculty_urls.length)
            faculty_urls.each(function(index,faculty_web_page_link){
                // Create Web page link
                faculty_web_page_link = BASE_URL + $(this).attr('href').substring(2)
                
                fetcher(faculty_web_page_link, (err, html_content) => { 
                    saveFacultyDetails(html_content, { 'link' : faculty_web_page_link }, dealWithProfile) // Faculty
                })
            })

        }) ; 
    }) ; 
}

module.exports = start

/**
 * Examples:
 * 
var scrap_faculty = require('./src/scraping/faculty')

scrap_faculty(
    'http://faculty.pictinc.org/AS/AS-Department.aspx',
    'http://faculty.pictinc.org/AS/AS-Faculty.aspx',
     'FYE'
)

scrap_faculty(
    'http://faculty.pictinc.org/computer/Computer-Department.aspx',
    'http://faculty.pictinc.org/computer/CE-Faculty.aspx',
     'Computer'
)

scrap_faculty(
    'http://faculty.pictinc.org/EnTC/EnTC-Department.aspx',
    'http://faculty.pictinc.org/EnTC/EnTC-Faculty.aspx',
     'ENTC'
)

scrap_faculty(
    'http://faculty.pictinc.org/IT/IT-Department.aspx',
    'http://faculty.pictinc.org/IT/IT-Faculty.aspx',
     'IT'
)

 */