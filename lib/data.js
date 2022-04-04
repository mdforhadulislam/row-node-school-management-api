const fs = require("fs")
const path = require("path");
const { parsrJSON } = require("../helpers/utilites");

const lib = {}

// base diretory of the data folder 
lib.basedir = path.join(__dirname, '/../.data/');


// write dta to file 
lib.create = (dir, file, data, callback) => {
   // open file for wite 
   fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err1, fileDescriptor) => {
      if (!err1 && fileDescriptor) {
         // convart data to string 
         const stringData = JSON.stringify(data)
         // write data to file 
         fs.writeFile(fileDescriptor, stringData, (err2) => {
            if (!err2) {
               fs.close(fileDescriptor, (err3) => {
                  if (!err3) {
                     callback(false)
                  } else {
                     callback("Error Closing The New File")
                  }
               })
            } else {
               callback("Error Writing to file")
            }
         })

      } else {
         callback("could not create new file")
      }
   })
}

//read file
lib.read = (dir, file, callback) => {
   fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
      callback(err, data)
   })
}

//update file
lib.update = (dir, file, data, callback) => {
   // file open 
   fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err1, fileDescriptor) => {
      if (!err1) {
         const stringData = JSON.stringify(data)
         // clear file 
         fs.ftruncate(fileDescriptor, (err2) => {
            if (!err2) {
               // write to the file 
               fs.writeFile(fileDescriptor, stringData, (err3) => {
                  if (!err3) {
                     // closeing file 
                     fs.close(fileDescriptor, (err4) => {
                        if (!err4) {
                           callback(false)
                        } else {
                           callback('error closing file')
                        }
                     })
                  } else {
                     callback("Error Writing to file")
                  }
               })
            } else {
               callback("Error Clearing fole")
            }
         })
      } else {
         callback(`Error updationg, File may not exist`)
      }
   })
}

//delete file
lib.delete = (dir, file, callback) => {
   //unlink file
   fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
      if (!err) {
         callback(false)
      } else {
         callback("Error deleteing file")
      }
   })
}




module.exports = lib