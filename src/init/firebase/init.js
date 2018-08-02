var admin = require("firebase-admin");

var serviceAccount = require("../../secrets/firebase/serviceaccount/pict-assistant-1a63c-06be9236db79.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pict-assistant-1a63c.firebaseio.com"
});

module.exports = admin