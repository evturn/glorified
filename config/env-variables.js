module.exports = {
  facebook : {
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: 'http://ramenbuffet.com/auth/facebook/callback'
  }
};