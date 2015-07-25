var url;
if (process.env.NODE_ENV === "development") {
  url = 'http://localhost:3000/auth/facebook/callback';
}
else {
  url = 'http://ramenbuffet.com/auth/facebook/callback';
}

module.exports = {
  facebook : {
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: url
  }
};