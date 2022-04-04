//requiring path and fs modules
const path = require('path');
const fs = require('fs');
const data = require("../../lib/data")
const { parsrJSON, hash } = require('../../helpers/utilites')

const handler = {};

handler.allStudents = (requestProperties, callback) => {
   const acceptedMethods = ["get",];
   if (acceptedMethods.indexOf(requestProperties.method) > -1) {
      handler._all_student[requestProperties.method](requestProperties, callback)
   } else {
      callback(405, {
         massage: "You are Not Allow"
      })
   }
};

handler._all_student = {};

handler._all_student.get = (requestProperties, callback) => {
   const directoryPath = path.join(__dirname, '/../../.data/student/');
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
         data.read('student', file.split('.')[0], (err, data) => {
            if (!err) {
               let studentdata = parsrJSON(data)
               studentdata.password = hash(studentdata.password)
               alldata.push(studentdata)
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
