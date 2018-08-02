var scrap_faculty = require('../../scraping/faculty')

/*
profile = { dp: 'http://faculty.pictinc.org/UploadImages/untitled123.JPG',
  name: 'Asmita Ajay Joshi',
  department: 'Applied Science',
  designation: 'Assistant Professor',
  responsibility: 'Subject Coordinator, Lab Incharge',
  'email-id': 'aajoshi@pict.edu',
  phoneno: '+91-020-24371101 Extn.[533]',
  areasofinterest: '',
  link:
   'http://faculty.pictinc.org/Faculty-Profile.aspx?profileID=136' }

*/

/**
 * this function will be running for every profile scrapped from sites specified
 * should be passed as last argument to scrap_faculty()
 * @param {JSON} err 'Error Object defining why and when Error happenend: Just Error first Function' 
 * @param {JSON} profile 'Profile JSON of data scrapped through key'
 */
function dealWithProfile(err, profile) { 
  if(err == null){
    // Initialize Admin
    const admin = require('../../init/firebase/init')
    const constants = require('../../scraping/constants')

    var db = admin.firestore();

    /*
    Structure:
      Facutly->
        ENTC->
          Faculty->
            Teacher1ProfileID

    */
    var facultyCollectionRef = db.collection('faculty')
    
    var docRef = null 
    console.log(profile.department)
    if( profile.department ==  constants.dept.FIRST_YEAR_ENGG ){
      docRef = facultyCollectionRef.doc(constants.acronym.FIRSTYEARENGG)
    }
    else if( profile.department ==  constants.dept.COMPUTER ){
      docRef = facultyCollectionRef.doc(constants.acronym.COMPUTER)
    }
    else if( profile.department ==  constants.dept.IT ){
      docRef = facultyCollectionRef.doc(constants.acronym.IT)
    }
    else if( profile.department ==  constants.dept.ENTC ){
      docRef = facultyCollectionRef.doc(constants.acronym.ENTC)
    }

    var profile_id =  profile.link.split('=')[1]
    docRef = docRef.collection('faculty').doc(constants.PROFILE_ID_KEY_APPEND + profile_id)
    
    //Save to Firestore Database
    docRef.set(profile);

  }
  else{
    console.log('There was some Error in scapping data so Please Fix the code ASAP')
  }
}

scrap_faculty(
    'http://faculty.pictinc.org/AS/AS-Department.aspx',
    'http://faculty.pictinc.org/AS/AS-Faculty.aspx',
    'FYE',
    dealWithProfile
)

scrap_faculty(
  'http://faculty.pictinc.org/computer/Computer-Department.aspx',
  'http://faculty.pictinc.org/computer/CE-Faculty.aspx',
  'Computer',
  dealWithProfile
)

scrap_faculty(
  'http://faculty.pictinc.org/EnTC/EnTC-Department.aspx',
  'http://faculty.pictinc.org/EnTC/EnTC-Faculty.aspx',
  'ENTC',
  dealWithProfile
)

scrap_faculty(
  'http://faculty.pictinc.org/IT/IT-Department.aspx',
  'http://faculty.pictinc.org/IT/IT-Faculty.aspx',
  'IT',
  dealWithProfile
)