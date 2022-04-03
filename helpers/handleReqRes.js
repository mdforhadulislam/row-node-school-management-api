const url = require("url");
const { StringDecoder } = require("string_decoder");

const handler = {};

handler.handleReqRes = (req, res) => {
  const parsedURL = url.parse(req.url, true);
  const path = parsedURL.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, " ");
  const method = req.method.toLowerCase();
  const queryStringObject = parsedURL.query;
  const headersObject = parsedURL.headers;

  const decoder = new StringDecoder("utf-8");

  let realData = "";

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", (buffer) => {
    realData += decoder.end();

    console.log(realData);

    res.end("Hello World");
  });
};

module.exports = handler;
