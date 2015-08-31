var domain = process.env.NODE_ENV === "development" ? 'localhost:3000' : 'ramenbuffet.com';

module.exports = {

  'facebook' : {
    clientID         : process.env.FACEBOOK_ID,
    clientSecret     : process.env.FACEBOOK_SECRET,
    callbackURL      : 'http://' + domain + '/auth/facebook/callback'
  },

  'twitter' : {
    'consumerKey'    : process.env.TWITTER_KEY,
    'consumerSecret' : process.env.TWITTER_SECRET,
    'callbackURL'    : 'http://' + domain + '/auth/twitter/callback'
  },

};