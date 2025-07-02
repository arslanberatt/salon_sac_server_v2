const whiteList = [process.env.SERVER];

const corsOptions = (req, callback) => {
  const origin = req.header("Origin");
  const isAllowed = whiteList.includes(origin);

  callback(null, { origin: isAllowed });
};

module.exports = corsOptions;
