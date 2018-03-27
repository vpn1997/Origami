const appConfig = {
  CLIENT_IP: process.env.HOST,
  CLIENT_PORT: process.env.PORT,
  DROPBOX_API_KEY: "API_KEY"
};

console.log("process.env.HOST = ");
console.log(process.env.HOST);

module.exports = appConfig;
