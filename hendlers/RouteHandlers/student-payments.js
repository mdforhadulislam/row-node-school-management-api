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
      data.read('student', studentID, (err, paymentDatils) => {
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
   const payment = typeof (body.payment) === "object" && body.payment.trim().length > 0 ? body.payment : false

   // {
   //    "studentID":"forhadul-islam-400",
   //    "payment":[
   //    {"payment_month":"january","payment_date":'11/22/2022',"payment_amounts":3000,}
   // ] 
   // }


   if (studentID && payment) {
      const idNumber = Math.floor(Math.random() * 1000)
      data.read('student', studentID, (err1) => {
         if (err1) {
            let paymentObject = {
               studentID,
               payment
            }

            data.create('pyments', studentID, paymentObject, (err2) => {
               if (!err2) {
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
      callback(400, {
         error: "you have a problem in your request"
      })
   }

}

handler._student_payments.put = (requestProperties, callback) => {
   const { body } = requestProperties
   const studentID = typeof (body.studentID) === "string" && body.studentID.trim().length > 0 ? body.studentID : false
   const payment = typeof (body.payment) === "object" && body.payment.trim().length > 0 ? body.payment : false

   if (studentID) {
      if (payment) {
         data.read('payments', studentID, (err, paymentsData) => {
            const paymentsDataOBJ = parsrJSON(paymentsData)
            if (!err) {
               if (paymentsDataOBJ) {
                  studentOBJ.payment = paymentsDataOBJ
               }
               data.update('payments', studentID, paymentsDataOBJ, (err) => {
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

handler._student_payments.delete = (requestProperties, callback) => {
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
