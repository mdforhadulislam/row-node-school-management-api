const data = require('../../lib/data')
const { parsrJSON } = require('../../helpers/utilites')

const handler = {};

handler.teacherPayments = (requestProperties, callback) => {
   const acceptedMethods = ["get", "post", "put", 'delete'];
   if (acceptedMethods.indexOf(requestProperties.method) > -1) {
      handler._teacher_payments[requestProperties.method](requestProperties, callback)
   } else {
      callback(405, {
         massage: "You are Not Allow"
      })
   }
};

handler._teacher_payments = {};

handler._teacher_payments.get = (requestProperties, callback) => {
   const { queryStringObject } = requestProperties
   const teacherID = typeof (queryStringObject.id) === "string" && queryStringObject.id.trim().length > 0 ? queryStringObject.id : false

   if (teacherID) {
      data.read('teacher-payments', teacherID, (err, paymentDatils) => {
         const paymentDatilsOBJ = parsrJSON(paymentDatils)
         if (!err && paymentDatilsOBJ) {
            callback(200, paymentDatilsOBJ)
         } else {
            callback(404, {
               error: "Requested teacher payments Not Found"
            })
         }
      })
   } else {
      callback(404, {
         error: "Requested teacher payments Not Found"
      })
   }


}

handler._teacher_payments.post = (requestProperties, callback) => {
   const { body } = requestProperties
   const teacherID = typeof (body.teacherID) === "string" && body.teacherID.trim().length > 0 ? body.teacherID : false
   const payment = typeof (body.payment) === "object" && body.payment.length > 0 ? body.payment : false

   if (teacherID && payment) {
      data.read('teacher', teacherID, (err1) => {
         if (!err1) {
            data.read('teacher-payments', teacherID, (err2) => {
               if (err2) {
                  let paymentObject = {
                     teacherID,
                     payment
                  }
                  data.create('teacher-payments', teacherID, paymentObject, (err3) => {
                     if (!err3) {
                        callback(200, paymentObject)
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

handler._teacher_payments.put = (requestProperties, callback) => {
   const { body } = requestProperties
   const teacherID = typeof (body.teacherID) === "string" && body.teacherID.trim().length > 0 ? body.teacherID : false
   const payment = typeof (body.payment) === "object" && body.payment.length > 0 ? body.payment : false

   if (teacherID) {
      if (payment) {
         data.read('teacher-payments', teacherID, (err, paymentsData) => {
            const paymentsDataOBJ = parsrJSON(paymentsData)
            if (!err) {
               if (paymentsDataOBJ) {
                  paymentsDataOBJ.payment = paymentsDataOBJ
               }

               if (teacherID) {
                  data.read('teacher-payments', teacherID, (err, paymentData) => {
                     if (!err && paymentData) {

                        // when i find the  file payments foler then i delete this teacher payment file 
                        data.delete('teacher-payments', teacherID, (err) => {
                           if (!err) {
                              // then i read teacher folder this teacher file find teacher file then i go payment folder and i read teacher payment file then not finde i teacher payment file 
                              data.read('teacher', teacherID, (err1) => {

                                 if (!err1) {
                                    data.read('teacher-payments', teacherID, (err2) => {
                                       if (err2) {
                                          console.log(payment);
                                          let paymentObject = {
                                             teacherID,
                                             payment

                                          }
                                          // then i create teacher new payment file 
                                          data.create('teacher-payments', teacherID, paymentObject, (err3) => {
                                             if (!err3) {
                                                callback(200, paymentObject)
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


               //ther are not using (data.update )fuction becose ther was a problem


               // data.update('payments', teacherID, paymentsDataOBJ, (err) => {
               //    if (!err) {
               //       callback(500, {
               //          massage: "teacher was update successfull"
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
         error: "invalid teacher id number! plz try it"
      })
   }



}

handler._teacher_payments.delete = (requestProperties, callback) => {
   const { queryStringObject } = requestProperties
   const teacherID = typeof (queryStringObject.id) === "string" && queryStringObject.id.trim().length > 0 ? queryStringObject.id : false

   if (id) {
      data.read('teacher-payments', teacherID, (err, paymentData) => {
         if (!err && paymentData) {
            data.delete('teacher-payments', teacherID, (err) => {
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
