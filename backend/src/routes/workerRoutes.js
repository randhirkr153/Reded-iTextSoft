const express = require('express');
const router = express.Router();
const { getWorkers, addWorker, assignWorker, getMyTask, updateMyTaskProgress, editWorker } = require('../controllers/workerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/me/task')
  .get(protect, authorize('Worker', 'Admin'), getMyTask)
  .put(protect, authorize('Worker', 'Admin'), updateMyTaskProgress);

router.route('/')
  .get(protect, getWorkers)
  .post(protect, authorize('Admin', 'Manager'), addWorker);

router.route('/:id')
  .put(protect, authorize('Admin', 'Manager'), editWorker);

router.route('/:id/assign')
  .put(protect, authorize('Admin', 'Manager'), assignWorker);

module.exports = router;
