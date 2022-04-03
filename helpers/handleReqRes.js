const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const {
   notFoundHandler,
} = require("../hendlers/RouteHandlers/notFoundHandler");
const { parsrJSON } = require('../helpers/utilites')

const handler = {};

handler.handleReqRes = (req, res) => {
   const parsedURL = url.parse(req.url, true);
   const path = parsedURL.pathname;
   const trimmedPath = path.replace(/^\/+|\/+$/g, "");
   const method = req.method.toLowerCase();
   const queryStringObject = parsedURL.query;
   const headersObject = parsedURL.headers;

   const requestProperties = {
      parsedURL,
      path,
      trimmedPath,
      method,
      queryStringObject,
      headersObject,
   }

   const decoder = new StringDecoder("utf-8");

   let realData = "";

   const chosenHandler = routes[trimmedPath]
      ? routes[trimmedPath]
      : notFoundHandler;


   req.on("data", (buffer) => {
      realData += decoder.write(buffer);
      requestProperties.body = parsrJSON(realData)

      chosenHandler(requestProperties, (statusCode, payload) => {
         statusCode = typeof (statusCode) === "number" ? statusCode : 500
         payload = typeof (payload) === "object" ? payload : {}

         const payloadString = JSON.stringify(payload)
         // request.setHeader('content-type', 'text/html');
         res.setHeader("Content-Type", "application/json")
         res.writeHead(statusCode)
         res.end(payloadString)
      })

   });

   req.on("end", () => {
      realData += decoder.end();
   });
};

module.exports = handler;
