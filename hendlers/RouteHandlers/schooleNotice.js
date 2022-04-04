const data = require('../../lib/data')

const handler = {};

handler.schoolNotice = (requestProperties, callback) => {
   const acceptedMethods = ["get", "post", "put", 'delete'];
   if (acceptedMethods.indexOf(requestProperties.method) > -1) {
      handler._school_notice[requestProperties.method](requestProperties, callback)
   } else {
      callback(405, {
         massage: "You are Not Allow"
      })
   }
};

handler._school_notice = {};

handler._school_notice.get = (requestProperties, callback) => {
   const { queryStringObject } = requestProperties
   const id = typeof (queryStringObject.id) === "string" && queryStringObject.id.trim().length > 0 ? queryStringObject.id : false

   if (id) {
      data.read('notice', id, (err, notice) => {
         const noticeOBJ = parsrJSON(notice)
         if (!err && notice) {
            callback(200, noticeOBJ)
         } else {
            callback(404, {
               error: "Requested notice Not Found"
            })
         }
      })

   } else {
      callback(404, {
         error: "Requested notice Not Found"
      })
   }


}

handler._school_notice.post = (requestProperties, callback) => {
   const { body } = requestProperties
   const noticeTitle = typeof (body.title) === "string" && body.title.trim().length > 0 ? body.title : false
   const noticeDecprition = typeof (body.decprition) === "string" && body.decprition.trim().length > 0 ? body.decprition : false
   const noticeDate = typeof (body.date) === "string" && body.date.trim().length > 0 ? body.date : false
   const noticeTime = typeof (body.time) === "string" && body.time.trim().length > 0 ? body.time : false


   if (noticeTitle && noticeDecprition && noticeDate && noticeTime) {
      const idNumber = Math.floor(Math.random() * 1000)
      data.read('notice', `${noticeTitle}-${idNumber}`, (err1) => {
         if (err1) {
            let noticeObject = {
               id: `${noticeTitle}-${idNumber}`,
               noticeTitle,
               noticeDecprition,
               noticeDate,
               noticeTime,
            };

            data.create('notice', `${noticeTitle}-${idNumber}`, noticeObject, (err2) => {
               if (!err2) {
                  callback(200, {
                     ...noticeObject,
                  })
               } else {
                  callback(500, {
                     error: "could not create notice"
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

handler._school_notice.put = (requestProperties, callback) => {
   const { body } = requestProperties
   const noticeID = typeof (body.id) === "string" && body.id.trim().length > 0 ? body.id : false
   const noticeTitle = typeof (body.title) === "string" && body.title.trim().length > 0 ? body.title : false
   const noticeDecprition = typeof (body.decprition) === "string" && body.decprition.trim().length > 0 ? body.decprition : false
   const noticeDate = typeof (body.date) === "string" && body.date.trim().length > 0 ? body.date : false
   const noticeTime = typeof (body.time) === "string" && body.time.trim().length > 0 ? body.time : false

   if (noticeID) {
      if (noticeTitle || noticeDecprition || noticeDate || noticeTime) {
         data.read('notice', noticeID, (err, noticeData) => {
            const noticeOBJ = parsrJSON(noticeData)
            if (!err) {
               if (noticeTitle) {
                  noticeOBJ.title = noticeTitle
               }
               if (noticeDecprition) {
                  noticeOBJ.decprition = noticeDecprition
               }
               if (noticeDate) {
                  noticeOBJ.date = noticeDate
               }
               if (noticeTime) {
                  noticeOBJ.time = noticeTime
               }

               data.update('notice', noticeID, noticeOBJ, (err) => {
                  if (!err) {
                     callback(500, {
                        massage: "notice was update successfull"
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
         error: "invalid noticeDate number! plz try it"
      })
   }



}

handler._school_notice.delete = (requestProperties, callback) => {
   const { queryStringObject } = requestProperties
   const id = typeof (queryStringObject.id) === "string" && queryStringObject.id.trim().length > 0 ? queryStringObject.id : false

   if (id) {
      data.read('notice', id, (err, noticeData) => {
         if (!err && noticeData) {
            data.delete('notice', id, (err) => {
               if (!err) {
                  callback(201, {
                     massage: "notice was succesfully delete!"
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
