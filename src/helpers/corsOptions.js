const whiteList = [
  process.env.SERVER,
  "https://salonsacserverv2-production.up.railway.app" // ← sondaki slash kaldırıldı
];

const corsOptions = (req, callback) => {
  const origin = req.header("Origin");
  const isAllowed = whiteList.includes(origin);

  const corsOpt = { origin: isAllowed };
  callback(null, corsOpt);
};

module.exports = corsOptions;
