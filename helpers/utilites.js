const crypto = require("crypto")

const utilites = {}

utilites.parsrJSON = (jsonString) => {
   let output = {};
   try {
      output = JSON.parse(jsonString)
   } catch {
      output = {}
   }
   return output
}

// hashing password
utilites.hash = (str) => {
   if (typeof (str) === "string" && str.length > 0) {
      let hash = crypto.createHmac('sha256', 'password').update(str).digest('hex')
      return hash
   } else {
      return false
   }

}






module.exports = utilites