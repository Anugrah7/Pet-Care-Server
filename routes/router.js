const express = require('express')
const userController = require('../Controller/userController');
const jwtMiddleware = require('../middlewares/jwtMiddlewares');
const  petController  = require('../Controller/petController');
const multerMiddleware = require('../middlewares/multerMiddleware');
const booking = require('../Controller/bookingController');


const router = new express.Router();

//register
router.post('/register',userController.registerController)

//login
router.post('/login',userController.loginController)

//addpet
router.post('/add-pet',jwtMiddleware,petController.addPetController)

//getPet
router.get('/get-pet/:ownerId',jwtMiddleware ,petController.getPetController)

//addBooking
router.post('/add-booking',jwtMiddleware,booking.addbookingController)

//getBooking
router.get('/get-booking',jwtMiddleware,booking.getbookingController)

//removePet
router.delete('/remove-pet/:_id',petController.removePetController)



module.exports = router