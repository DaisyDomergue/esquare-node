const express = require("express");
const Student = require("../models/student");
const authJwt= require("../auth/authJWT");
const user = require("../models/user");
const router = express.Router();
const crypto = require('crypto')

router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.json({ message: err });
  }
});
router.patch("/",async (req,res)=> {
  
  try{
    const updatedStudent = await Student.updateOne(
      { _id: req.body.student_id },
      {
        $set: { section:req.body.student_section}
      }
    );
    res.json({message:"Successfully assgined class"});
  }
  catch(err)
  {
    res.json({message:err});
  }
});


router.get("/:id",async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    res.json(student);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/profile/:id", async (req, res) => {
  try {
    const student = await Student.findOne({user_name:req.params.id}).lean();
    classLink = getClassLink(student.first_name,student.last_name,student.level,student.section)
    console.log(classLink)
    studentwithClass = {...student,classLink}
    res.json(studentwithClass);
  } catch (err) {
    console.log("Error"+err);
    res.json({ message: err });
  }
});
function getClassLink(fname , lname, level, section){
  const secret = "NkoyvRdIJ6U5csQB09fqS5jbQMD7qjTkIA7eeN1BGo4";
  const apiCmd = 'join';
  const userUname = fname+"-"+lname+"-"+Math.random(5);
  const url = "https://bbbdev.esquare-homeschooling.com/bigbluebutton/api/"
  var addr = `fullName=${userUname}&meetingID=`+encodeURIComponent(level+"-"+section)+`&password=esquare&redirect=true`;
  console.log(apiCmd+addr);
  var checksum = crypto.createHash('sha1').update(apiCmd+addr+secret).digest("hex")
  var meetingLink = url+apiCmd+"?"+addr+"&checksum="+checksum;
  return meetingLink;
}

router.post("/", async (req, res) => {
  const student = new Student({
    user_name:req.body.user_name,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    date_of_birth: req.body.date_of_birth,
    level: req.body.level,
    parent_name: req.body.parent_name,
    parent_id_no: req.body.parent_id_no,
    parent_phone_no: req.body.parent_phone,
    parent_email: req.body.parent_email,
  });

  try {
    const savedStudent = await student.save();
    res.json(savedStudent);
  } catch (err) {
    res.json({ message: err });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const removedStudent = await Student.deleteOne({ _id: req.params.id });
   // const removedUser =await user.delete({})
    res.json(removedStudent);
  } catch (err) {
    res.send({ message: err });
  }
});
router.patch("/:id", async (req, res) => {
  const updatedStudent = await Student.updateOne(
    { _id: req.params.id },
    {
      $set: {
        first_name: req.body.first_name,
        last_name: req.body.first_name,
        date_of_birth: req.body.first_name,
        parent_name:req.body.parent_name,
        parent_email:req.body.parent_email
      },
    }
  );
});
module.exports = router;
