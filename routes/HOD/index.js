const express = require('express');
const router = express.Router();

const Datastore = require('nedb');
var hod = new Datastore({filename:'./db/hod.db',autoload:true});
var courses = new Datastore({filename:'./db/courses.db',autoload:true});
var dept = new Datastore({filename:"./db/dept.db",autoload:true});
var course = new Datastore({filename:"./db/course.db",autoload:true});

router.post('/',function(req,res){
	var user=req.body.uname;
	var paw=req.body.pass;
	var person={
		"username":user,
		"password":paw
	}
	hod.find(person,function(err,result){	
		courses.find({"Department":result[0].Department},function(err,resul){
			dept.find({_id:result[0].Department},function(err,d){
			if(result.length>0)
				res.render('HOD',{re:resul,dept:d});
			else
				res.send('No Such User');
			})
		})
    })
});

router.post("/course",function(req,res){
    var cid = req.body.course;
    if (typeof cid === "string") {
        course.find({"CID" : cid},function(err,result){
            course.insert(result,function(err,resul){
                console.log(resul);
            })
        } )
    } else if (typeof cid === "object") {
        for (var i = 0; i < cid.length; i++) {
            var person = {"CID":cid[i]}
            courses.find(person,function(err,result){
                 course.insert(result,function(err,resul){
					 console.log(resul);
				 })
                })
         }
     }
    res.redirect("/");
})


module.exports = router;