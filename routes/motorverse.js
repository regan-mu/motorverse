const express = require("express");
const router = express.Router(); 

const vehicleController = require("../controllers/vehicleController");
const manufacturerController = require("../controllers/manufacturerController");
const categoryController = require("../controllers/categoryController");

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

// ------------------------ MANUFACTURER ----------------------------

//Manufacturer List
router.get("/manufacturers", manufacturerController.manufacturerList);

// Create Manufacturer
router.get("/manufacturer/create", manufacturerController.createGet);
router.post("/manufacturer/create", manufacturerController.createPost);

// Delete Manufacturer
router.get("/manufacturer/:id/delete", manufacturerController.deleteGet);
router.post("/manufacturer/:id/delete", manufacturerController.deletePost);

// Update Manufacturer
router.get("/manufacturer/:id/update", manufacturerController.updateGet);
router.post("/manufacturer/:id/update", manufacturerController.updatePost);

// Details
router.get("/manufacturer/:id", manufacturerController.manufacturerDetail);

//-------------------------- CATEGORY --------------------------------

// Category List
router.get("/categories", categoryController.categoryList);

// Create
router.get("/category/create", categoryController.createGet);
router.post("/category/create", categoryController.createPost);

// Delete
router.get("/category/:id/delete", categoryController.deleteGet);
router.post("/category/:id/delete", categoryController.deletePost);

// Update
router.get("/category/:id/update", categoryController.updateGet);
router.post("/category/:id/update", categoryController.updatePost);

// Detail
router.get("/category/:id", categoryController.categoryDetail);

  
module.exports = router;