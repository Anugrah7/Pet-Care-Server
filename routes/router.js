const express = require('express')
const userController = require('../Controller/userController');
const jwtMiddleware = require('../middlewares/jwtMiddlewares');
const  petController  = require('../Controller/petController');
const multerMiddleware = require('../middlewares/multerMiddleware');
const booking = require('../Controller/bookingController');
const serviceController = require('../Controller/serviceController');
const providerController = require('../Controller/providerController');
const communityController = require('../Controller/communityController')




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
router.get('/get-booking/:serviceId', jwtMiddleware, booking.getbookingController);


//removePet
router.delete('/remove-pet/:_id',petController.removePetController)

router.get('/get-services',jwtMiddleware,serviceController.getServicesController)

router.get('/get-providers',jwtMiddleware,providerController.getProvidersController)

router.post('/providers-by-service', jwtMiddleware, booking.getProvidersByServicesController)

//Community 

router.post('/community-add',jwtMiddleware,communityController.createPost)

router.get('/community-get',communityController.getAllPosts)

router.post('/community-comment/:postId',jwtMiddleware,communityController.addComment)

module.exports = router