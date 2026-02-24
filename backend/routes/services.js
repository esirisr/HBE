
import express from 'express';
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesByProvider
} from '../controllers/serviceController.js';

const router = express.Router();

router.post('/', createService);
router.get('/', getServices);
router.get('/:id', getServiceById);
router.put('/:id', updateService);
router.delete('/:id', deleteService);
router.get('/provider/:providerId', getServicesByProvider);



export default router;
