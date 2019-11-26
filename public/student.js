var x=-1;
var courses=[" "," "," "," "," "]
const max=4;
var ind = x+1;
var i=0;
var sub = document.getElementById("sub");




function print()
    {
        if(x == -1)
            {
                document.getElementById("para").innerHTML= "Select prefered courses."
            }

        else
            {
                document.getElementById("para").innerHTML = "1. " + courses[0];
                for(i=1;i<=x;i++)
                {document.getElementById("para").innerHTML=document.getElementById("para").innerHTML + "<br/>" + (i+1) + ". " + courses[i];}
            }

    }

function check(id)
{

    var checkBox = document.getElementById(id);
    
    if (checkBox.checked == true)
    {
        x = x + 1;
        if(x > max)
        {
            alert("cannot choose more than " + (max+1) +" courses")
            x = max;
            checkBox.checked = false;
        }
        else{
            courses[x]=id;
            print();
            }        
    }                                       //if checkbox is not checked
    else {
        x=x-1;
        if(x<0){x=-1;}                      //just making sure value doesnt go below -1 
        var dlt = courses.indexOf(id);
        for(i=dlt;i<=max-1;i++)
        {
            courses[i]=courses[i+1]
        }
        courses[max]=" ";
        print();
    } 


    
}

function submit()
{
   if(x == -1)
    alert("select options")
   else
    alert("options registered")
}

function clear()
{   
    alert("options registered")
}