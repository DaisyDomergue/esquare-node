const express = require("express");
const Teacher = require("../models/teacher");
const cors = require("../cors.js");
const router = express.Router();
const crypto = require("crypto");
const https = require("https");
var xml2js = require("xml2js");

router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    res.json(teacher);
  } catch (err) {
    res.json({ message: err });
  }
});
function getClassCreateLink(fname, lname, level, section) {
  const secret = "NkoyvRdIJ6U5csQB09fqS5jbQMD7qjTkIA7eeN1BGo4";
  const apiCmd = 'create';
  const userUname = fname + "-" + lname + "-" + Math.random(5);
  const url = "https://bbbdev.esquare-homeschooling.com/bigbluebutton/api/"
  var addr = `allowStartStopRecording=true&attendeePW=esquare&autoStartRecording=false&meetingID=` + encodeURIComponent(level + "-" + section) + `&moderatorPW=esquare-teacher&name=` + encodeURIComponent(level + "-" + section) + `&record=false&voiceBridge=` + Math.floor(Math.random() * 10000) + `&welcome=%3Cbr%3EWelcome+to+%3Cb%3E%25%25CONFNAME%25%25%3C%2Fb%3E%21`;
  console.log(apiCmd + addr);
  var checksum = crypto.createHash('sha1').update(apiCmd + addr + secret).digest("hex")
  var meetingLink = url + apiCmd + "?" + addr + "&checksum=" + checksum;
  return meetingLink;
}
function getClassJoinLink(fname, lname, level, section) {
  const secret = "NkoyvRdIJ6U5csQB09fqS5jbQMD7qjTkIA7eeN1BGo4";
  const apiCmd = 'join';
  const userUname = fname + "-" + lname + "-" + Math.random(5);
  const url = "https://bbbdev.esquare-homeschooling.com/bigbluebutton/api/"
  var addr = `fullName=${userUname}&meetingID=` + encodeURIComponent(level + "-" + section) + `&password=esquare-teacher&redirect=true`;
  console.log(apiCmd + addr);
  var checksum = crypto.createHash('sha1').update(apiCmd + addr + secret).digest("hex")
  var meetingLink = url + apiCmd + "?" + addr + "&checksum=" + checksum;
  return meetingLink;
}
router.patch("/", async (req, res) => {
  try {
    const updatedTeacher = await Teacher.updateOne(
      { _id: req.body.teacher_id },
      {
        $set: { section: req.body.teacher_section }
      }
    );
    console.log(updatedTeacher);
    res.json({ message: "Successfully assgined class" });
  }
  catch (err) {
    res.json({ message: err });
  }
});
router.get("/profile/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user_name: req.params.id }).lean();
    classLink = getClassJoinLink(teacher.first_name, teacher.last_name, teacher.level, teacher.section)
    classCreateLink = getClassCreateLink(teacher.first_name, teacher.last_name, teacher.level, teacher.section)
    https.get(classCreateLink, (resp) => {
      let data = '';

      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        var doc = xml2js.parseString(data);
        console.log(doc);
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
    console.log(classLink)
    teacherwithClass = { ...teacher, classLink, classCreateLink }
    res.json(teacherwithClass);
  } catch (err) {
    console.log("Error");
    res.json({ message: err });
  }
});
router.post("/", async (req, res) => {
  const teacher = new Teacher({
    user_name: req.body.user_name,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    national_id_no: req.body.national_id_no,
    level: req.body.level,
    email: req.body.email,
    phone_no: req.body.phone_no
  });

  try {
    const savedTeacher = await teacher.save();
    res.json(savedTeacher);
  } catch (err) {
    res.json({ message: err });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const removedTeacher = await Teacher.deleteOne({ _id: req.params.id });
    res.json(removedTeacher);
  } catch (err) {
    res.send({ message: err });
  }
});
router.patch("/:id", async (req, res) => {
  const updatedTeacher = await Teacher.updateOne(
    { _id: req.params.id },
    { $set: { section: teacher_section } }
  );
});
module.exports = router;
