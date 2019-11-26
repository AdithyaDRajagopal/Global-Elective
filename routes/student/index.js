const express = require('express');
const router = express.Router();

const Datastore = require('nedb');
var student = new Datastore({filename:'./db/student.db',autoload:true});
var course = new Datastore({filename:'./db/course.db',autoload:true});

router.post('/',function(req,res){
	var user=req.body.uname;
	var paw=req.body.pass;
	var person={
		"Username":user,
		"Password":paw
	}
	student.find(person,function(err,result){	
		course.find({"Department":result[0].Department},function(err,resul){
			if(result.length>0)
				res.render('student',{re:resul});
			else
				res.send('No Such User');
			})
		
    })
});





module.exports = router;