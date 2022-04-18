const express = require("express");
const Razorpay = require("razorpay");
const level = require("../models/level");
const student = require("../models/student");
const router = express.Router();

async function seedLevel() {
  const seedLevels = [
    {
      "level_name":"pre_1",
      "level_fullname":"Preschool - I",
      "price":150000
    },
    {
      "level_name":"pre_2",
      "level_fullname":"Preschool - II",
      "price":150000
    },
    {
      "level_name":"pre_3",
      "level_fullname":"Preschool - III",
      "price":150000
    },
    {
      "level_name":"Grade_1",
      "level_fullname":"Grade - I",
      "price":250000
    },
    {
      "level_name":"Grade_2",
      "level_fullname":"Grade - II",
      "price":250000
    },
    {
      "level_name":"spe_1",
      "level_fullname":"Special Education Level - I",
      "price":500000
    },
    {
      "level_name":"spe_2",
      "level_fullname":"Special Education Level - II",
      "price":500000
    },
    {
      "level_name":"Holistic_G1",
      "level_fullname":"Holistic Program Group - I",
      "price":250000
    },
    {
      "level_name":"Holistic_G2",
      "level_fullname":"Holistic Program Group - II",
      "price":350000
    },
    {
      "level_name":"accelerated_G1",
      "level_fullname":"Accelerated Program Group - I",
      "price":200000
    },
    {
      "level_name":"accelerated_G2",
      "level_fullname":"Accelerated Program Group - II",
      "price":300000
    },
    {
      "level_name":"accelerated_G3",
      "level_fullname":"Accelerated Program Group - III",
      "price":450000
    },
    {
      "level_name":"accelerated_G4",
      "level_fullname":"Accelerated Program Group - IV",
      "price":600000
    },
    {
      "level_name":"caregivers_basic",
      "level_fullname":"Caregivers Training Basic",
      "price":400000
    },
    {
      "level_name":"caregivers_adv",
      "level_fullname":"Caregivers Training Advanced",
      "price":400000
    }];
  count = await level.countDocuments({})

  if (count == 0) {
    await level.insertMany(seedLevels)
  }
}


router.get("/createorder/:id", async (req, res) => {
  console.log(req.params.id);
  std = await student.findById(req.params.id).lean()
  console.log(std);
  await seedLevel()
  lvl = await level.findOne({ "level_name": std.level })
  console.log(lvl);
  var instance = new Razorpay({
    key_id: 'rzp_test_H63Iwu9sdwkPrq',
    key_secret: 'nWf4U8aJOQEEiEK7uyEiQhgB',
  });

  var options = {
    amount: lvl.price,  // amount in the smallest currency unit
    currency: "INR",
    receipt: req.params.id + "-" + Math.floor(Math.random() * 10000),
    payment_capture: 1
  };
  instance.orders.create(options, function (err, order) {
    res.send(order);
  });
});

module.exports = router;
