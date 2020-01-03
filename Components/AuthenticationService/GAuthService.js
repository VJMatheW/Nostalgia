const {OAuth2Client} = require('google-auth-library');

const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;

const client = new OAuth2Client(CLIENT_ID);

let verify = async function(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  return payload;
//   const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}

module.exports = {
    'verify': verify
}