var domain = process.env.NODE_ENV === 'development' ? 'localhost:3000' : 'ramenbuffet.com';
var id     = process.env.NODE_ENV === 'development' ? process.env.FACEBOOK_ID_TEST : process.env.FACEBOOK_ID;
var secret = process.env.NODE_ENV === 'development' ? process.env.FACEBOOK_SECRET_TEST : process.env.FACEBOOK_SECRET;

module.exports = {
  'facebook' : {
    clientID         : id,
    clientSecret     : secret,
    callbackURL      : 'http://' + domain + '/auth/facebook/callback'
  },

  'twitter' : {
    'consumerKey'    : process.env.TWITTER_KEY,
    'consumerSecret' : process.env.TWITTER_SECRET,
    'callbackURL'    : 'http://' + domain + '/auth/twitter/callback'
  },
};