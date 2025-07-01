const whiteList = [process.env.SERVER];
const corsOptions = (req, callback) => {
  let corsOpt;
  if (whiteList.indexOf(req.header("Origin")) !== -1) {
    corsOpt = { origin: true };
  } else {
    corsOpt = { origin: false };

  }

  callback(null, corsOpt);
};

module.exports = corsOptions
