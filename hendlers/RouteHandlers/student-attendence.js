const data = require('../../lib/data')
const { parsrJSON } = require('../../helpers/utilites')

const handler = {};

handler.studentAttendence = (requestProperties, callback) => {
   const acceptedMethods = ["get", "post", "put", 'delete'];
   if (acceptedMethods.indexOf(requestProperties.method) > -1) {
      handler._student_attendence[requestProperties.method](requestProperties, callback)
   } else {
      callback(405, {
         massage: "You are Not Allow"
      })
   }
};

handler._student_attendence = {};

handler._student_attendence.get = (requestProperties, callback) => {
   const { queryStringObject } = requestProperties
   const id = typeof (queryStringObject.id) === "string" && queryStringObject.id.trim().length > 0 ? queryStringObject.id : false

   if (id) {
      data.read('student-attendence', id, (err, student) => {
         const studentOBJ = parsrJSON(student)
         if (!err && student) {
            delete studentOBJ.password

            callback(200, studentOBJ)

         } else {
            callback(404, {
               error: "Requested student attendence Not Found"
            })
         }
      })

   } else {
      callback(404, {
         error: "Requested student attendence Not Found"
      })
   }


}

handler._student_attendence.post = (requestProperties, callback) => {
   const { body } = requestProperties
   const studentID = typeof (body.studentID) === "string" && body.studentID.trim().length > 0 ? body.studentID : false
   const attendence = typeof (body.attendence) === "object" && body.attendence.length > 0 ? body.attendence : false

   if (studentID && attendence) {
      data.read('student', studentID, (err1) => {
         if (!err1) {
            data.read('student-attendence', studentID, (err1) => {
               if (err1) {
                  let studentObject = {
                     studentID, attendence
                  }

                  data.create('student-attendence', studentID, studentObject, (err2) => {
                     if (!err2) {
                        callback(200, studentObject)
                     } else {
                        callback(500, {
                           error: "could not create student attendence"
                        })
                     }
                  })


               } else {
                  callback(500, {
                     'error': "Thear was a problem in server side!"
                  })
               }
            })

         } else {
            callback(500, {
               'error': "Thear was a problem in server side!"
            })
         }
      })

   } else {
      callback(400, {
         error: "you have a problem in your request"
      })
   }

}

handler._student_attendence.put = (requestProperties, callback) => {
   const { body } = requestProperties
   const studentID = typeof (body.studentID) === "string" && body.studentID.trim().length > 0 ? body.studentID : false
   const attendence = typeof (body.attendence) === "object" && body.attendence.length > 0 ? body.attendence : false

   if (studentID) {
      if (attendence) {
         data.read('student-attendence', studentID, (err, studentData) => {
            const studentOBJ = parsrJSON(studentData)
            if (!err) {
               if (attendence) {
                  studentOBJ.attendence = attendence
               }
               data.update('student-attendence', studentID, studentOBJ, (err) => {
                  if (!err) {
                     callback(500, {
                        massage: "student attendence was update successfull"
                     })
                  } else {
                     callback(500, {
                        error: "There was a problem in server side"
                     })
                  }
               })


            } else {
               callback(400, {
                  error: "You have a problem in your request"
               })
            }
         })
      } else {
         callback(400, {
            error: "You have a problem in your request"
         })
      }
   } else {
      callback(400, {
         error: "invalid id number! plz try it"
      })
   }



}

handler._student_attendence.delete = (requestProperties, callback) => {
   const { queryStringObject } = requestProperties
   const id = typeof (queryStringObject.id) === "string" && queryStringObject.id.trim().length > 0 ? queryStringObject.id : false

   if (id) {
      data.read('student-attendence', id, (err, studentData) => {
         if (!err && studentData) {
            data.delete('student-attendence', id, (err) => {
               if (!err) {
                  callback(201, {
                     massage: "student was succesfully delete!"
                  })
               } else {
                  callback(500, {
                     error: "There was a server side error"
                  })
               }
            })

         } else {
            callback(500, {
               error: "There was a server side error"
            })
         }
      })
   } else {
      callback(400, {
         error: "There was a problem in your request"
      })
   }

}


module.exports = handler;
