import { Router } from 'express';
import { CollectionController } from '../controllers/collection.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', CollectionController.getCollection);
router.post('/items', CollectionController.addItem);
router.delete('/items/:itemId', CollectionController.removeItem);
router.patch('/items/:itemId', CollectionController.updateItem);

export default router;