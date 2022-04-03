const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
   callback(404, {
      massage: "Not Found"
   })
};

module.exports = handler;
