const data = require('../../lib/data')
const { parsrJSON } = require('../../helpers/utilites')

const handler = {};

handler.studentRoutine = (requestProperties, callback) => {
   const acceptedMethods = ["get", "post", "put", 'delete'];
   if (acceptedMethods.indexOf(requestProperties.method) > -1) {
      handler._student_routine[requestProperties.method](requestProperties, callback)
   } else {
      callback(405, {
         massage: "You are Not Allow"
      })
   }
};

handler._student_routine = {};

handler._student_routine.get = (requestProperties, callback) => {
   const { queryStringObject } = requestProperties
   const className = typeof (queryStringObject.class) === "string" && queryStringObject.class.trim().length > 0 ? queryStringObject.class : false

   if (className) {
      data.read('routine', className, (err, classroutine) => {
         const classroutineOBJ = parsrJSON(classroutine)
         if (!err && classroutineOBJ) {
            callback(200, classroutineOBJ)
         } else {
            callback(404, {
               error: "Requested routine Not Found"
            })
         }
      })

   } else {
      callback(404, {
         error: "Requested routine Not Found"
      })
   }


}

handler._student_routine.post = (requestProperties, callback) => {
   const { body } = requestProperties
   const className = typeof (body.class) === "string" && body.class.trim().length > 0 ? body.class : false
   const routine = typeof (body.routine) === "object" && body.routine.length > 0 ? body.routine : false

   if (className && routine) {
      data.read('routine', className, (err1) => {
         if (err1) {
            let routineObject = {
               className, routine
            }

            data.create('routine', className, routineObject, (err2) => {
               if (!err2) {
                  callback(200, routineObject)
               } else {
                  callback(500, {
                     error: "could not create routine"
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

handler._student_routine.put = (requestProperties, callback) => {
   const { body } = requestProperties
   const className = typeof (body.class) === "string" && body.class.trim().length > 0 ? body.class : false
   const routine = typeof (body.routine) === "object" && body.routine.trim().length > 0 ? body.routine : false

   if (className) {
      if (className || routine) {
         data.read('routine', className, (err, routineData) => {
            const routineOBJ = parsrJSON(routineData)
            if (!err) {
               if (className) {
                  routineOBJ.class = className
               }
               if (routine) {
                  routineOBJ.routine = routine
               }

               data.update('routine', className, routineOBJ, (err) => {
                  if (!err) {
                     callback(500, {
                        massage: "routine was update successfull"
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

handler._student_routine.delete = (requestProperties, callback) => {
   const { queryStringObject } = requestProperties
   const className = typeof (queryStringObject.class) === "string" && queryStringObject.class.trim().length > 0 ? queryStringObject.class : false

   if (className) {
      data.read('routine', className, (err, routineData) => {
         if (!err && routineData) {
            data.delete('routine', className, (err) => {
               if (!err) {
                  callback(201, {
                     massage: "routine was succesfully delete!"
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
