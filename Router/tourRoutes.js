const express = require('express');

const tourControler = require("../controllers/tourController");
const router = express.Router();

router
  .route('/')
  .get(tourControler.getAllTours)
  .post(tourControler.createTour);
router.route('/tourstats').get(tourControler.getStatus);
router.route('/getmonthlyTours/:year').get(tourControler.planmonthly);

router.route('/getTotalPrice/:year').get(tourControler.getTotalPrice);
router
  .route('/:id')
  .get(tourControler.getTour)
  .patch(tourControler.updateTour)
  .delete(tourControler.deleteTour);

module.exports = router;
