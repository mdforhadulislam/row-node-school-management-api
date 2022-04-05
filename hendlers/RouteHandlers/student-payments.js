const data = require('../../lib/data')
const { parsrJSON } = require('../../helpers/utilites')

const handler = {};

handler.studentPayments = (requestProperties, callback) => {
   const acceptedMethods = ["get", "post", "put", 'delete'];
   if (acceptedMethods.indexOf(requestProperties.method) > -1) {
      handler._student_payments[requestProperties.method](requestProperties, callback)
   } else {
      callback(405, {
         massage: "You are Not Allow"
      })
   }
};

handler._student_payments = {};

handler._student_payments.get = (requestProperties, callback) => {
   const { queryStringObject } = requestProperties
   const studentID = typeof (queryStringObject.id) === "string" && queryStringObject.id.trim().length > 0 ? queryStringObject.id : false

   if (studentID) {
      data.read('student-payments', studentID, (err, paymentDatils) => {
         const paymentDatilsOBJ = parsrJSON(paymentDatils)
         if (!err && paymentDatilsOBJ) {
            callback(200, paymentDatilsOBJ)
         } else {
            callback(404, {
               error: "Requested student payments Not Found"
            })
         }
      })
   } else {
      callback(404, {
         error: "Requested student payments Not Found"
      })
   }


}

handler._student_payments.post = (requestProperties, callback) => {
   const { body } = requestProperties
   const studentID = typeof (body.studentID) === "string" && body.studentID.trim().length > 0 ? body.studentID : false
   const payment = typeof (body.payment) === "object" && body.payment.length > 0 ? body.payment : false

   if (studentID && payment) {
      data.read('student', studentID, (err1) => {
         if (!err1) {
            data.read('student-payments', studentID, (err2) => {
               if (err2) {
                  let paymentObject = {
                     studentID,
                     payment
                  }
                  data.create('student-payments', studentID, paymentObject, (err3) => {
                     if (!err3) {
                        callback(200, paymentObject)
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

handler._student_payments.put = (requestProperties, callback) => {
   const { body } = requestProperties
   const studentID = typeof (body.studentID) === "string" && body.studentID.trim().length > 0 ? body.studentID : false
   const payment = typeof (body.payment) === "object" && body.payment.length > 0 ? body.payment : false

   if (studentID) {
      if (payment) {
         data.read('student-payments', studentID, (err1, paymentsData) => {
            const paymentsDataOBJ = parsrJSON(paymentsData)

            if (!err1) {
               if (paymentsDataOBJ) {
                  paymentsDataOBJ.payment = paymentsDataOBJ
               }
               // when i find the  file payments foler then i delete this student payment file 
               data.delete('student-payments', studentID, (err3) => {
                  if (!err3) {
                     // then i read student folder this student file find student file then i go payment folder and i read student payment file then not finde i student payment file 
                     data.read('student', studentID, (err4) => {
                        if (!err4) {
                           data.read('student-payments', studentID, (err5) => {
                              if (err5) {
                                 let paymentObject = {
                                    studentID,
                                    payment

                                 }
                                 // then i create student new payment file 
                                 data.create('student-payments', studentID, paymentObject, (err6) => {
                                    if (!err6) {
                                       callback(200, paymentObject)
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
                           callback(500, {
                              'error': "Thear was a problem in server side!"
                           })
                        }
                     })

                  } else {
                     callback(500, {
                        error: "There was a server side error"
                     })
                  }
               })



               //ther are not using (data.update )fuction becose ther was a problem


               // data.update('payments', studentID, paymentsDataOBJ, (err) => {
               //    if (!err) {
               //       callback(500, {
               //          massage: "student was update successfull"
               //       })
               //    } else {
               //       callback(500, {
               //          error: "There was a problem in server side"
               //       })
               //    }
               // })
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
         error: "invalid Student id number! plz try it"
      })
   }



}

handler._student_payments.delete = (requestProperties, callback) => {
   const { queryStringObject } = requestProperties
   const studentID = typeof (queryStringObject.id) === "string" && queryStringObject.id.trim().length > 0 ? queryStringObject.id : false

   if (id) {
      data.read('student-payments', studentID, (err, paymentData) => {
         if (!err && paymentData) {
            data.delete('student-payments', studentID, (err) => {
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
