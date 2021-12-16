import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import UsersModel from "./models/users.js";
import * as UsersControl from "./controllers/usersController.js";
import bcrypt from "bcrypt";
import session from "express-session";
import cookieParser from "cookie-parser";

const port = process.env.PORT || 3011;
dotenv.config();
///////////////////////////////////////////////////////
const app = express();
app.use(express.json());
app.use(cors(
  {
      origin: process.env.FRONTEND_URL,
      credentials: true
  }
));
app.use(cookieParser());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
  })
);

///////////DATA BASE CONNECTION///////////////////
const mongoConnectString = process.env.MONGO_URI;
mongoose.connect(mongoConnectString);

app.get("/", (req, res) => {
  res.send("Hello");
});
////////////////signup///////////////////////////7
app.post("/signup", async (req, res) => {
  const userExisted = await UsersControl.getUser(req.body.user.login);
  const passwd1 = req.body.user.password1;
  const passwd2 = req.body.user.password2;

  if (userExisted) {
    res
      .status(403)
      .json({ message: "error:Es gibt schon eine user mit diesem login" });
  } else if (passwd1 !== passwd2) {
    res
      .status(403)
      .json({ message: "error:password1 und password2 müssen  gleich sein" });
  } else {
   const salt=await  bcrypt.genSalt();
     const hash=await bcrypt.hash(passwd1, salt);
        const user = await UsersModel.create({
          login: req.body.user.login,
          name:req.body.user.name,
          lastName:req.body.user.lastName,
          email:req.body.user.email,
          hash: hash,
          accesGroup:"notApprovedUser"
          
        });
        req.session.user = user;
        req.session.save();
        res.json(user);
        console.log(req.session.user);
      
    
  }
});

////////login/////////////////////////

app.post("/login", async (req, res) => {
  const login = req.body.user.login;
  const password = req.body.user.password;
  let user = await UsersModel.findOne({login:login});
  
  if(!user){
   console.log("no user")
   user=await UsersModel.findOne({login:"gast"});
 }
  const hash = user.hash;
  bcrypt.compare(password, hash).then((result) => {
    if (result) {
      req.session.user = user;
      req.session.save();
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: "access deneged" });
    }
  });
});
/////////////////getusers//////////////////////////////////////////////////////
app.get("/getAllUsers", async (req, res) => {
  const allUsers = await UsersControl.getAllUsers();
  if (!allUsers) {
    res.json({ message: "keine user" });
  }
  res.status(200).json(allUsers);
});

/////////////////////////////////////////////////////////////////////////////////////////
app.get("/getMembers", async (req, res) => {
  const allUsers = await UsersControl.getMembers();
  if (!allUsers) {
    res.json({ message: "keine user" });
  }
  res.status(200).json(allUsers);
});
///////////////notAprovedUser////////////////////////////////////////////////////////////////
 
app.get("/notApprovedUser",async(req,res)=>{
  const notAprovedUser= await UsersModel.find({accesGroup:"notApprovedUser"});
  res.json(notAprovedUser);
});

app.patch(`/acceptUser`,async(req,res)=>{
  const login=req.body.user.login;
  const user=await UsersControl.acceptUser(login);
  res.json(user);
})
///////////////////////cancelSolicitude////////////////////////////////////////

app.delete(`/deleteUser`,async(req,res)=>{
  const login=req.body.user.login;
  const user =await UsersModel.findOneAndDelete({login:login});
  res.json(user);
})
////////////////GET Login/getLoginUser/////////////////////////////////////////
app.get("/currentUser", async(req, res) => {
  let user=req.session.user;
    if(!user){
      user=await UsersModel.findOne({login:"gast"});
    }
    res.json(user);

});
/////////////////////////////////////////////////////////////////////////
app.get("/currentUser", async(req, res) => {
  let user=req.session.user;
    if(!user){
      user=await UsersModel.findOne({login:"gast"});
    }
    res.json(user);

});
//////////////////////////////////////////////////////////////////////////
app.post("/infoUser", async(req, res) => {
  const login=req.body.user.login;
  const user= await UsersModel.findOne({login});
    if(!user){
      res.status(403).json({message:"error"});
    }
    res.json(user);

});
////////////logout////////////////////////////////////////////////////////
app.get("/logout", async(req, res) => {
  req.session.destroy();
  const user=await UsersModel.findOne({login:"gast"});
  res.json(user);
});

app.patch("/changepassword",async(req,res)=>{
  const login=req.body.user.login;
  const altePassw=req.body.user.altepassword;
  const newPassw=req.body.user.newpassword;
  const user = await UsersModel.findOne({login:login});
  const hash=user.hash;
 const result =await bcrypt.compare(altePassw,hash);
  
    if (result) {
      //////////////////////////////
      const salt=await bcrypt.genSalt();
     const newhash=await bcrypt.hash(newPassw,salt);
     const newuser = await UsersModel.findOneAndUpdate({login:login},{hash:newhash},{new:true})
     res.json(newuser);
     
      /////////////////////////////
    } else {
      res.status(401).json({ message: "alte password incorrect" });
    }
  });
  
//////////////////////////////////////////////////////
app.patch("/editUser",async(req,res)=>{
  const id=req.body.user.id;
  const login=req.body.user.login;
  const name=req.body.user.name;
  const lastName=req.body.user.lastName;
  const email=req.body.user.email;
  const accesGroup=req.body.user.accesGroup;
  const user=await UsersModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(id) },
  {login:login,name:name,lastName:lastName,email:email,accesGroup:accesGroup},{new:true})
  if(!user){
    res.json({message:"error"})
  }
  else{
    req.session.user = user;
    req.session.save();
    res.json(user);
  }
}) 

///////////////////////////////////////////////////////
app.listen(port, () => {
  console.log(`Now listening on port http://localhost:${port}`);
});
