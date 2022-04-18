const express = require("express");
const Razorpay=require("razorpay");
const level = require("../models/level");
const student = require("../models/student");
const router = express.Router();

async function seedLevel() {
  const seedLevels =[
    {
      "level_name":'pre_1',
      "price":200
    },
    {
      "level_name":'pre_3',
      "price":300
    },
    {
      "level_name":'pre_11',
      "price":400
    },
    {
      "level_name":'pre_6',
      "price":500
    },
    {
      "level_name":'pre_2',
      "price":600
    }
  ]
  count = await level.countDocuments({})

  if (count == 0){
    await level.insertMany(seedLevels)
  }
}


router.get("/createorder/:id", async (req, res) => {
    console.log(req.params.id);
    std = await student.findById(req.params.id).lean()
    console.log(std);
    await seedLevel()
    lvl = await level.findOne({"level_name":std.level})
    console.log(lvl);
    var instance = new Razorpay({
        key_id: 'rzp_test_H63Iwu9sdwkPrq',
        key_secret: 'nWf4U8aJOQEEiEK7uyEiQhgB',
      });
    
      var options = {
        amount: lvl.price,  // amount in the smallest currency unit
        currency: "INR",
        receipt:  req.params.id+"-"+Math.floor(Math.random() * 10000),
        payment_capture:1
      };
      instance.orders.create(options, function(err, order) {
        res.send(order);
      });
});

module.exports=router;
