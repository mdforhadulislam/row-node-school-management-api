const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const data = require("./lib/data")

const app = {};


app.config = {
  port: 5000,
};

app.createServer = () => {
  const server = http.createServer(app.hendeRequestRespons);
  server.listen(app.config.port, () => {
    console.log("Server Started Port", app.config.port);
  });
};

app.hendeRequestRespons = handleReqRes;

app.createServer();
