const { allStudents } = require("./hendlers/RouteHandlers/all-students");
const { studentLogin } = require("./hendlers/RouteHandlers/studentLogin");
const { teacherLogin } = require("./hendlers/RouteHandlers/teacherLogin");

const routes = {
   "teacher/login": teacherLogin,
   "student/login": studentLogin,
   "all-students": allStudents,
};

module.exports = routes;
