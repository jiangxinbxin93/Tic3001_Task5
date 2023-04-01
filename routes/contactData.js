const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const Contact = require("../models/contact");
const Redis = require("redis");

const redisClient = Redis.createClient({ legacyMode: true });
const DEFAULT_EXPIRATION = 3600;

//Getting all
router.get("/", async (req, res) => {
    console.log(redisClient.isOpen)
    if(!redisClient.isOpen){
        await redisClient.connect();
    }
  

  redisClient.get("contacts", async (error, data) => {
    
    
    if (error) console.error(error);
    if (data != null) {
        
        
        return res.status(200).json(JSON.parse(data));
     } 
    else {
      try {
        const contactData = await Contact.find();
        redisClient.setEx(
          "contacts",
          DEFAULT_EXPIRATION,
          JSON.stringify(contactData)
        );
        return res.status(200).json(contactData);
      } catch (err) {
        res.status(500).json({
          message: err.message,
        });
      }
    }
  });
  
  
});

//Getting one
router.get("/:id", retri, (req, res) => {
  //res.send(res.subscriber.name)
  res.send(res.contactData.name);
});

//Creating one
router.post("/", async (req, res) => {
  const contactData = new Contact({
    name: req.body.name,
    phone: req.body.phone,
  });

  try {
    const newContactData = await contactData.save();
    res.status(201).json(newContactData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Updating one
router.patch("/:id", retri, async (req, res) => {
  if (req.body.name != null) {
    res.contactData.name = req.body.name;
  }

  if (req.body.phone != null) {
    res.contactData.phone = req.body.phone;
  }

  try {
    const updateContactData = await res.contactData.save();
    res.status(200).json(updateContactData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Deleting one
router.delete("/:id", del, async (req, res) => {
  try {
    await res.contactData;
    res.status(200).json({ message: "Deleted User" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function del(req, res, next) {
  let contactData;
  try {
    contactData = await Contact.findByIdAndDelete(req.params.id);
    if (contactData == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.contactData = contactData;
  next();
}

async function retri(req, res, next) {
  let contactData;
  try {
    contactData = await Contact.findById(req.params.id);
    if (contactData == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.contactData = contactData;
  next();
}

module.exports = router;
