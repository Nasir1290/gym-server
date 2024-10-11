import { Router } from 'express';
import { classControllers } from './class.controllers';

const router = Router();

router.route('/create-class').post(classControllers.createGymClass);
router.route('/update-class').patch(classControllers.updateGymClass);
router.route('/').patch(classControllers.getAllGymClasses);

export const classRouter = router;
