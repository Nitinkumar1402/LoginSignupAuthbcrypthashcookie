const express= require("express")
const app = express()
const path = require("path")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const bcryptjs = require("bcryptjs") 
const hbs = require("hbs") 

const collection = require("./mongodb") 
const templatePath = path.join(__dirname,'./templates')

app.use(express.json())
app.use(cookieParser())
app.set("view engine","hbs")
app.set("views",templatePath)
app.use(express.urlencoded({extended:false}))



async function hashPass(password){
    const res= await bcryptjs.hash(password,10)
    return res
}

async function compare(userPass,hashPass){
    const res= await bcryptjs.compare(userPass,hashPass)
    return res
}




app.get("/",(req,res)=>{
    
    if(req.cookies.jwt){
        const verify = jwt.verify(req.cookies.jwt,"helloandwellcomenitinkumargeneratetoken")
    res.render("home",{name:verify.name})
    }
    else{
        res.render("login")
    }
})
app.get("/signup",(req,res)=>{
    res.render("signup")
})

app.post("/signup",async (req,res)=>{

    try{
        const check = await collection.findOne({name:req.body.name})
   


        if(check){

    res.render("user already exists")
        }
        else{

            const token= jwt.sign({name:req.body.name},"helloandwellcomenitinkumargeneratetoken")

            res.cookie("jwt",token,{
                maxAge:60000,
                httpOnly:true
            })


    const data = {
        name:req.body.name,
        password: await hashPass(req.body.password),
        token:token
    }

        
    await collection.insertMany([data])
    res.render("home",{name:req.body.name})
    
    
        }
    }



    catch{
        res.send("wrong details")
    }
})


// app.post("/login",async (req,res)=>{

//     try{
//         const check = await collection.findOne({name:req.body.name})

//         if(check.password ===req.body.password){

//     res.render("home")
//         }
//         else{   
//             res.send("wrong password")
//         }
    

//     }
//     catch{
//         res.send("wrong Details")

//     }
// })


app.post("/login",async (req,res)=>{

    try{
        const check = await collection.findOne({name:req.body.name})
        const passCheck = await compare(req.body.password,check.password)
   
        if(check && passCheck){

            res.cookie("jwt",check.token,{
                maxAge:60000,
                httpOnly:true
            })
        
            res.render("home",{name:req.body.name})
    
        }
        else{

            res.render("wrong details")

    
    
        }
    }



    catch{
        res.send("wrong details")
    }
})


app.listen(3000,()=>{
    console.log(' port connected');
})