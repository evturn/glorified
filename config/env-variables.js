module.exports = {
  facebook : {
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  }
};