const express = require('express');
const router = express.Router();
const {deserializeUser} = require("../middlewares/deserializeUser");
const teamControllers = require("../controllers/eventTeamRegistrationControllers.js");


router.post("/event/register",teamControllers.registerForEvent );  

module.exports =router;