const http = require("http");

const app = {};

app.config = {
  port: 5500,
};

app.createServer = () => {
  const server = http.createServer(app.hendeRequestRespons);
  server.listen(app.config.port, () => {
    console.log("Server Started Port", app.config.port);
  });
};

app.hendeRequestRespons = (req, res) => {
  res.end("Hello World");
};

app.createServer();
