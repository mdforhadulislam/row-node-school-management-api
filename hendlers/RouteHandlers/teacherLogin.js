const data = require('../../lib/data')
const { parsrJSON } = require('../../helpers/utilites')


const handler = {};

handler.teacherLogin = (requestProperties, callback) => {
   const acceptedMethods = ["get", "post", "put", 'delete'];
   if (acceptedMethods.indexOf(requestProperties.method) > -1) {
      handler._teacher[requestProperties.method](requestProperties, callback)
   } else {
      callback(405, {
         massage: "You are Not Allow"
      })
   }
};


handler._teacher = {};

handler._teacher.get = (requestProperties, callback) => {
   const { queryStringObject } = requestProperties
   const id = typeof (queryStringObject.id) === "string" && queryStringObject.id.trim().length > 0 ? queryStringObject.id : false

   if (id) {
      data.read('teacher', id, (err, teacher) => {
         const teacherOBJ = parsrJSON(teacher)
         if (!err && teacher) {
            delete teacherOBJ.password

            callback(200, teacherOBJ)

         } else {
            callback(404, {
               error: "Requested Teacher Not Found"
            })
         }
      })

   } else {
      callback(404, {
         error: "Requested Teacher Not Found"
      })
   }


}

handler._teacher.post = (requestProperties, callback) => {
   const { body } = requestProperties
   const firstName = typeof (body.firstName) === "string" && body.firstName.trim().length > 0 ? body.firstName : false
   const lastName = typeof (body.lastName) === "string" && body.lastName.trim().length > 0 ? body.lastName : false
   const phone = typeof (body.phone) === "string" && body.phone.trim().length === 11 ? body.phone : false
   const password = typeof (body.password) === "string" && body.password.trim().length > 0 ? body.password : false
   const isTeacher = typeof (body.isTeacher) === "boolean" && body.isTeacher ? body.isTeacher : false

   if (firstName && lastName && phone && password && isTeacher) {
      const idNumber = Math.floor(Math.random() * 1000)
      data.read('teacher', `${firstName}-${lastName}-${idNumber}`, (err1) => {
         if (err1) {
            let teacherObject = {
               tecacherID: `${firstName}-${lastName}-${idNumber}`,
               firstName,
               lastName,
               phone,
               password: password,
               isTeacher
            };

            data.create('teacher', `${firstName}-${lastName}-${idNumber}`, teacherObject, (err2) => {
               if (!err2) {
                  callback(200, {
                     ...teacherObject,
                  })
               } else {
                  callback(500, {
                     error: "could not create teacher"
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

handler._teacher.put = (requestProperties, callback) => {
   const { body } = requestProperties
   const tecacherID = typeof (body.tecacherID) === "string" && body.tecacherID.trim().length > 0 ? body.tecacherID : false
   const firstName = typeof (body.firstName) === "string" && body.firstName.trim().length > 0 ? body.firstName : false
   const lastName = typeof (body.lastName) === "string" && body.lastName.trim().length > 0 ? body.lastName : false
   const phone = typeof (body.phone) === "string" && body.phone.trim().length === 11 ? body.phone : false
   const password = typeof (body.password) === "string" && body.password.trim().length > 0 ? body.password : false

   if (tecacherID) {
      if (firstName || lastName || phone || password) {
         data.read('teacher', tecacherID, (err, teacherData) => {
            const teacherOBJ = parsrJSON(teacherData)
            if (!err) {
               if (firstName) {
                  teacherOBJ.firstName = firstName
               }
               if (lastName) {
                  teacherOBJ.lastName = lastName
               }
               if (phone) {
                  teacherOBJ.phone = phone
               }
               if (password) {
                  teacherOBJ.password = password
               }

               data.update('teacher', tecacherID, teacherOBJ, (err) => {
                  if (!err) {
                     callback(500, {
                        massage: "teacher was update successfull"
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

handler._teacher.delete = (requestProperties, callback) => {
   const { queryStringObject } = requestProperties
   const id = typeof (queryStringObject.id) === "string" && queryStringObject.id.trim().length > 0 ? queryStringObject.id : false

   if (id) {
      data.read('teacher', id, (err, teacherData) => {
         if (!err && teacherData) {
            data.delete('teacher', id, (err) => {
               if (!err) {
                  callback(201, {
                     massage: "teacher was succesfully delete!"
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
