import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from '../controllers/application.controller.js';

const router = express.Router();

// All routes are protected and require authentication
router.use(protect);

router
  .route('/')
  .post(createApplication)
  .get(getApplications);

router
  .route('/:id')
  .get(getApplicationById)
  .put(updateApplication)
  .delete(deleteApplication);

export default router;
