const express = require('express')
const router = express.Router();


router.get("/",function(req,res){
    res.render('login');
})


router.get("/logout",function(req,res){
    res.redirect('/');
})
router.use("/loginHOD",require("./login/hod"))
router.use("/loginstudent",require("./login/student"))
router.use("/HOD",require("./HOD/index"))
router.use("/student",require("./student/index"))

module.exports = router;