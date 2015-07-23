var url;
if (process.env.NODE_ENV === "development") {
var url = 'http://localhost:3000/auth/facebook/callback';
}
else {
var url = 'http://ramenbuffet.com/auth/facebook/callback';
}

module.exports = {
  facebook : {
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: url
  }
};