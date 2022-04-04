//requiring path and fs modules
const path = require('path');
const fs = require('fs');
const data = require("../../lib/data")
const { parsrJSON, hash } = require('../../helpers/utilites')

const handler = {};

handler.allNotice = (requestProperties, callback) => {
   const acceptedMethods = ["get",];
   if (acceptedMethods.indexOf(requestProperties.method) > -1) {
      handler._all_notice[requestProperties.method](requestProperties, callback)
   } else {
      callback(405, {
         massage: "You are Not Allow"
      })
   }
};

handler._all_notice = {};

handler._all_notice.get = (requestProperties, callback) => {
   const directoryPath = path.join(__dirname, '/../../.data/notice/');
   //passsing directoryPath and callback function
   let alldata = []
   fs.readdir(directoryPath, function (err, files) {
      if (err) {
         callback(500, {
            error: "There was a server side error"
         })
      }
      //listing all files using forEach
      files.forEach(function (file) {
         data.read('notice', file.split('.')[0], (err, data) => {
            if (!err) {
               let noticedata = parsrJSON(data)
               noticedata.password = hash(noticedata.password)
               alldata.push(noticedata)
            } else {
               callback(500, {
                  error: "There was a server side error"
               })
            }
         });
      });
      setTimeout(() => { callback(200, alldata) }, 1000)
   });
}


module.exports = handler;
