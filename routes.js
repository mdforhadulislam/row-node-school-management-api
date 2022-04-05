const { allNotice } = require("./hendlers/RouteHandlers/all-notice.js");
const { allStudents } = require("./hendlers/RouteHandlers/all-students.js");
const { examRoutine } = require("./hendlers/RouteHandlers/examRoutine.js");
const { schoolNotice } = require("./hendlers/RouteHandlers/schooleNotice.js");
const { studentAttendence } = require("./hendlers/RouteHandlers/student-attendence.js");
const { studentPayments } = require("./hendlers/RouteHandlers/student-payments.js");
const { studentRoutine } = require("./hendlers/RouteHandlers/student-routine.js");
const { studentLogin } = require("./hendlers/RouteHandlers/studentLogin");
const { teacherPayments } = require("./hendlers/RouteHandlers/teacher-payments.js");
const { teacherLogin } = require("./hendlers/RouteHandlers/teacherLogin");

const routes = {
   "teacher/login": teacherLogin,
   "student/login": studentLogin,
   "all-students": allStudents,
   "notice": schoolNotice,
   "all-notice": allNotice,
   "student-routine": studentRoutine,
   "exam-routine": examRoutine,
   "student-payments": studentPayments,
   "teacher-payments": teacherPayments,
   "student-attendence": studentAttendence,
};

module.exports = routes;
