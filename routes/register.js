const express = require("express");
const User = require("../models/user");
const Student = require("../models/student");
const Teacher = require("../models/teacher");
const router = express.Router();
const bcrypt = require("bcryptjs");
const multer= require('multer');


const storage=multer.diskStorage({
  destination:(req,file,callBack) =>{
    callBack(null,"uploads/")
  },
  filename:(req,file,callBack)=>{
    console.log(file.fieldname,"filename");
    callBack(null,file.fieldname + '-' + Date.now() + ".pdf");
  }
});
const upload=multer({storage:storage});
router.post("/file",upload.single('file'),(req, res) => {
console.log(req.file.filename);

});

router.post("/admin",async (req, res) => {
  try {
   
    const { user_name, user_password } = req.body;

    const user = await User.findOne({
      user_name: user_name,
    });
    console.log("user", user);
    if (user) {
      console.log("user err", err);
      res.status(400).send({
        success: false,
        user: user,
        message: "Failed! Username is already in use!",
      });
    } else {
    
        const password = await bcrypt.hash(user_password, 5);

        const userNew = new User({
          user_name: user_name,
          user_password: password,
          type: "admin",
        });
        console.log(userNew, "new");
        const savedUser = await userNew.save();
        res.json({ success: true, message: "Saved Successfully" });
     
   }
  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }
});

router.post("/teacher",upload.single('cv'),async (req, res) => {
  try {
    console.log(req.body,"body");
    const { user_name, user_password } = req.body;
    const password = await bcrypt.hash(user_password, 5);
    // console.log(user_name,user_password);
    const user = new User({
      user_name: user_name,
      user_password: password,
      type: "teacher",
    });
    const savedUser = await user.save();
    //res.json(savedUser);
    const teacher = new Teacher({
      user_name: req.body.user_name,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      national_id_no: req.body.national_id_no,
      level: req.body.level,
      email: req.body.email,
      phone_no: req.body.phone_no,
      // cv_file_path: 'uploads/'+req.cv.filename,
      section: "",
    });

    try {
      const savedTeacher = await teacher.save();
     // res.json({ message: "Saved Successfully", data: savedTeacher });
      res.json({ status:'success',message: "Saved Successfully" });
    } catch (err) {
      console.log(err);
      const removedTeacher = await User.deleteOne({ user_name: req.body.user_name});
    res.json({ status:'error',message: err });
     
    }
  } catch (err) {
    console.log("Error User/Teacher registration",err);
    res.json({ status:'error',message: err });
  }
});
router.post("/student", async (req, res) => {
  // console.log(req.body);
  const { user_name, user_password } = req.body;
  const password = await bcrypt.hash(user_password, 5);
  try {
    console.log(user_name);
    const user = new User({
      user_name: user_name,
      user_password: password,
      type: "student",
    });
    const savedUser = await user.save();
    //res.json(savedUser);
    const student = new Student({
      user_name: req.body.user_name,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      date_of_birth: req.body.date_of_birth,
      level: req.body.level,
      parent_name: req.body.parent_name,
      parent_id_no: req.body.parent_id_no,
      parent_phone_no: req.body.parent_phone_no,
      parent_email: req.body.parent_email,
    });

    try {
      const savedStudent = await student.save();
      res.json({ message: "Student Created Successfully" });
    } catch (err) {
      console.json({ message: err });
    }
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
