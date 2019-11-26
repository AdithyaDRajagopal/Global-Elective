const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const Datastore = require('nedb');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('static'));
app.use(express.static(__dirname + '/public'));

var hod = new Datastore({filename:"./db/hod.db",autoload:true});
var courses = new Datastore({filename:'./db/courses.db',autoload:true});
var dept = new Datastore({filename:"./db/dept.db",autoload:true});
var course = new Datastore({filename:"./db/course.db",autoload:true});
var student = new Datastore({filename:"./db/student.db",autoload:true});
var eligible = new Datastore({filename:"./db/eligible.db",autoload:true});
var stucs = new Datastore({filename:"./db/stucs.db",autoload:true});
var allot =new Datastore({filename:"./db/result.db",autoload:true});

var stdcnt = 0;
var hodcnt = 0;


app.get("/",function(req,res){
	student.count({},function(err,c){
		if(stdcnt == c) {
			student.find({}).sort({"cgpa": 1}.exec(function(err,result){
					for(var i=0;i<result.length;i++){
						var sid = result[i].Username
						var person = {"SID":result[i].Username}
						stucs.find(person).sort({"Priority":1}).exec(function(err,resul){
							for(var j=0;i<resul.length;j++){
								var cs = {"CID":resul[j].CID}
								course.find(cs,function(err,res){
									var str = res[0].strength;
									var limit = res[0].max;
									if(str<limit){
										var ins ={
											"SID": sid,
											"CID": res[0].CID ,
											"CNAME": res[0].Course
 										}
										allot.insert(ins,function(err,inse){
											console.log(inse);
										})
										//update
										break;
									}
									else{

									}
								})
							}
						})
					}
			}))
		}
	})

    res.render('login');
})

app.post("/loginHOD",function(req,res){
    res.render("hodlog");
})

app.post("/loginstudent",function(req,res){
	hod.count({},function(err,count){
		if(count == hodcnt){
			res.render("studentlog");
		}
		else
		res.send("Courses not Uploaded");
})

app.post('/HOD',function(req,res){
	var user=req.body.uname;
	var paw=req.body.pass;
	var person={
		"username":user,
		"password":paw
	}
	hod.find(person,function(err,result){	
		hodcnt++;
		courses.find({"Department":result[0].Department}).sort({ CID:1 }).exec(function(err,resul){
			dept.find({"DID":result[0].Department},function(err,d){
			if(result.length>0)
				res.render("HOD",{re:resul,dept:d});
			else
				res.send('No Such User');
			})
		})
    })
});

app.post("/HOD/course",function(req,res){
    var cid = req.body.course;
    if (typeof cid === "string") {
        courses.find({"CID" : cid},function(err,result){
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
})

app.post("/student",function(req,res){
	var user=req.body.uname;
	var paw=req.body.pass;
	var person={
		"Username":user,
		"Password":paw
	}
	stid = user;
	var elg = [];
	var dp = [];
	
		student.find(person,function(err,result){
			stdcnt++;
			eligible.find({"class":result[0].class},function(err,resul){
				for(var i=0;i<resul.length;i++){
				elg.push(resul[i].course);
			}
					course.find({"CID":{$in:elg}}).sort({CID:1}).exec(function(err,rlt){
						for(var i=0;i<rlt.length;i++){
							dp.push(rlt[i].Department);
						}
						dept.find({"DID":{$in:dp}},function(err,de){
	
							if(result.length>0)
									res.render('student',{re:rlt,dept:de})
								else
									res.send("No Such User");
						})
													
					})
				})
		})
		
	})
	
			
})

app.post("/student/course",function(req,res){
	var cid = req.body.course;
	var priority = 1;
    if (typeof cid === "string") {
        course.find({"CID" : cid},function(err,result){
			var person = {
				"SID":stid,
				"CID":cid,
				"Priority":priority
		}
            stucs.insert(person,function(err,resul){
                console.log(resul);
			})
			
        } )
    } else if (typeof cid === "object") {
        for (var i = 0; i < cid.length; i++) {
			var id = {"CID":cid[i]};
            course.find(id,function(err,result){
				var person = {
					"SID":stid,
					"CID":result[0].CID,
					"Priority":priority
				}
                 stucs.insert(person,function(err,resul){
					 console.log(resul);
				 })
				 priority++;
            })
         }
	 }
})

app.post("/result",function(req,res){
	student.count({},function(err,count){
		if(stdcnt == count)
		allot.find({},function(err,result){
			res.render('result',{re:result});
		})
		else
		res.send("Result Not Published")
	})
	

})


app.get("/logout",function(req,res){
    res.redirect('/');
})

app.listen(3001,function(req,res){
    console.log("App is listening on port 3001");
})