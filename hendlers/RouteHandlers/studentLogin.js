const data = require('../../lib/data')
const { parsrJSON } = require('../../helpers/utilites')

const handler = {};

handler.studentLogin = (requestProperties, callback) => {
   const acceptedMethods = ["get", "post", "put", 'delete'];
   if (acceptedMethods.indexOf(requestProperties.method) > -1) {
      handler._student[requestProperties.method](requestProperties, callback)
   } else {
      callback(405, {
         massage: "You are Not Allow"
      })
   }
};

handler._student = {};

handler._student.get = (requestProperties, callback) => {
   const { queryStringObject } = requestProperties
   const id = typeof (queryStringObject.id) === "string" && queryStringObject.id.trim().length > 0 ? queryStringObject.id : false

   if (id) {
      data.read('student', id, (err, student) => {
         const studentOBJ = parsrJSON(student)
         if (!err && student) {
            delete studentOBJ.password

            callback(200, studentOBJ)

         } else {
            callback(404, {
               error: "Requested student Not Found"
            })
         }
      })

   } else {
      callback(404, {
         error: "Requested student Not Found"
      })
   }


}

handler._student.post = (requestProperties, callback) => {
   const { body } = requestProperties
   const firstName = typeof (body.firstName) === "string" && body.firstName.trim().length > 0 ? body.firstName : false
   const lastName = typeof (body.lastName) === "string" && body.lastName.trim().length > 0 ? body.lastName : false
   const className = typeof (body.class) === "string" && body.class.trim().length > 0 ? body.class : false
   const phone = typeof (body.phone) === "string" && body.phone.trim().length === 11 ? body.phone : false
   const password = typeof (body.password) === "string" && body.password.trim().length > 0 ? body.password : false
   const isStudent = typeof (body.isStudent) === "boolean" && body.isStudent ? body.isStudent : false

   if (firstName && lastName && phone && password && isStudent && className) {
      const idNumber = Math.floor(Math.random() * 1000)
      data.read('student', `${firstName}-${lastName}-${idNumber}`, (err1) => {
         if (err1) {
            let studentObject = {
               studentID: `${firstName}-${lastName}-${idNumber}`,
               firstName,
               lastName,
               phone,
               class: className,
               password,
               isStudent
            }

            data.create('student', `${firstName}-${lastName}-${idNumber}`, studentObject, (err2) => {
               if (!err2) {
                  callback(200, {
                     ...studentObject
                  })
               } else {
                  callback(500, {
                     error: "could not create student"
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

handler._student.put = (requestProperties, callback) => {
   const { body } = requestProperties
   const studentID = typeof (body.studentID) === "string" && body.studentID.trim().length > 0 ? body.studentID : false
   const firstName = typeof (body.firstName) === "string" && body.firstName.trim().length > 0 ? body.firstName : false
   const lastName = typeof (body.lastName) === "string" && body.lastName.trim().length > 0 ? body.lastName : false
   const phone = typeof (body.phone) === "string" && body.phone.trim().length === 11 ? body.phone : false
   const password = typeof (body.password) === "string" && body.password.trim().length > 0 ? body.password : false

   if (studentID) {
      if (firstName || lastName || phone || password) {
         data.read('student', studentID, (err, studentData) => {
            const studentOBJ = parsrJSON(studentData)
            if (!err) {
               if (firstName) {
                  studentOBJ.firstName = firstName
               }
               if (lastName) {
                  studentOBJ.lastName = lastName
               }
               if (phone) {
                  studentOBJ.phone = phone
               }
               if (password) {
                  studentOBJ.password = password
               }

               data.update('student', studentID, studentOBJ, (err) => {
                  if (!err) {
                     callback(500, {
                        massage: "student was update successfull"
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
         error: "invalid Phone number! plz try it"
      })
   }



}

handler._student.delete = (requestProperties, callback) => {
   const { queryStringObject } = requestProperties
   const id = typeof (queryStringObject.id) === "string" && queryStringObject.id.trim().length > 0 ? queryStringObject.id : false

   if (id) {
      data.read('student', id, (err, studentData) => {
         if (!err && studentData) {
            data.delete('student', id, (err) => {
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
