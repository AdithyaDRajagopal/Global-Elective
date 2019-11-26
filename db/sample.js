const Datastore = require('nedb');
var db = new Datastore({filename:'./eligible.db',autoload:true});
var course = new Datastore({filename:'./courses.db',autoload:true});

course.find({$and : [{"Department":{$ne:"CE"}}]},function(err,rlt){
        for(var i=0;i<rlt.length;i++){
            var person1 = {
                "class":"c1",
                "course":rlt[i].CID
            }
            
           var person2 = {
                "class":"c2",
                "course":rlt[i].CID
            }
    
            db.insert(person2,function(err,result){
                console.log(result);
            })
           
            db.insert(person1,function(err,result){
                console.log(result);
            })
        }
    
    
})


