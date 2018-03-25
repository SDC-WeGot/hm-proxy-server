const generateUrls = function generateUrls(userContext, events, done) {
  // keep the majority of requests in a small range
  const randomNumber = Math.random();
  let id;
  if (randomNumber < 0.85) {
    // 85% of the time the requests will hit id's 1,000 through 1050
    id = Math.floor(Math.random() * 50) + 1000;
  } else if (randomNumber >= 0.85 && randomNumber < 0.95) {
    // 10% of requests will fall over 50,000 through 50,500
    id = Math.floor(Math.random() * 500) + 50000;
  } else {
    //  rest of requests will be completely random
    id = Math.floor(Math.random() * 10000001);
  }
  userContext.vars.restaurantId = id;
  return done();
};

module.exports = {
  generateUrls,
};

