const { allNotice } = require("./hendlers/RouteHandlers/all-notice.js");
const { allStudents } = require("./hendlers/RouteHandlers/all-students.js");
const { schoolNotice } = require("./hendlers/RouteHandlers/schooleNotice.js");
const { studentPayments } = require("./hendlers/RouteHandlers/student-payments.js");
const { studentRoutine } = require("./hendlers/RouteHandlers/student-routine.js");
const { studentLogin } = require("./hendlers/RouteHandlers/studentLogin");
const { teacherLogin } = require("./hendlers/RouteHandlers/teacherLogin");

const routes = {
   "teacher/login": teacherLogin,
   "student/login": studentLogin,
   "all-students": allStudents,
   "notice": schoolNotice,
   "all-notice": allNotice,
   "student-routine": studentRoutine,
   "student-payments": studentPayments
};

module.exports = routes;
