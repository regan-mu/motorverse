const express = require("express");
const router = express.Router(); 

const vehicleController = require("../controllers/vehicleController");

//Index
router.get('/', vehicleController.index);

// Create Vehicle 
router.get("/vehicle/create", vehicleController.createGet);
router.post("/vehicle/create", vehicleController.createPost);

// Delete Vehicle 
router.get("/vehicle/:id/delete", vehicleController.deleteGet);
router.post("/vehicle/:id/delete", vehicleController.deletePost);

// Update Vehicle 
router.get("/vehicle/:id/update", vehicleController.updateGet);
router.post("/vehicle/:id/update", vehicleController.updatePost);

// Vehicle Details
router.get("/vehicle/:id", vehicleController.vehicleDetail);

// Vehicle Listing
router.get("/vehicles", vehicleController.vehicleList);
  
module.exports = router;