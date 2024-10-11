import { Request, Response, NextFunction } from 'express';
import GymClass from './class.model';
import { User } from '../user/user.model';

// Controller function to create a class
const createGymClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { practiceName, trainerId, traineeIds, startedAt, endedAt, date } = req.body;

        // Ensure there is a valid trainer
        const trainer = await User.findById(trainerId);
        if (!trainer || trainer.role !== 'TRAINER') {
            return res.status(400).json({ message: 'Invalid trainer or trainer not found' });
        }

        // Ensure all trainees are valid and not exceeding the limit
        const trainees = await User.find({ _id: { $in: traineeIds }, role: 'TRAINEE' });
        if (trainees.length > 10) {
            return res.status(400).json({ message: 'Cannot exceed 10 trainees per class' });
        }

        // Ensure class duration is 2 hours
        const classDuration = (new Date(endedAt).getTime() - new Date(startedAt).getTime()) / (1000 * 60 * 60);
        if (classDuration !== 2) {
            return res.status(400).json({ message: 'Class duration must be 2 hours' });
        }

        // Create the gym class
        const gymClass = await GymClass.create({
            practiceName,
            trainer: trainerId,
            trainee: traineeIds,
            startedAt,
            endedAt,
            date,
            traineeCount: trainees.length,
        });

        res.status(201).json({ message: 'Gym class created successfully', gymClass });
    } catch (error) {
        next(error);
    }
};



const updateGymClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { classId } = req.params;
        const { practiceName, trainerId, traineeIds, startedAt, endedAt } = req.body;

        // Fetch the class
        const gymClass = await GymClass.findById(classId);
        if (!gymClass) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Validate the trainer and trainees as before
        if (trainerId) {
            const trainer = await User.findById(trainerId);
            if (!trainer || trainer.role !== 'TRAINER') {
                return res.status(400).json({ message: 'Invalid trainer or trainer not found' });
            }
            gymClass.trainer = trainerId;
        }

        if (traineeIds) {
            const trainees = await User.find({ _id: { $in: traineeIds }, role: 'TRAINEE' });
            if (trainees.length > 10) {
                return res.status(400).json({ message: 'Cannot exceed 10 trainees per class' });
            }
            gymClass.trainee = traineeIds;
            gymClass.traineeCount = trainees.length;
        }

        if (startedAt && endedAt) {
            const classDuration = (new Date(endedAt).getTime() - new Date(startedAt).getTime()) / (1000 * 60 * 60);
            if (classDuration !== 2) {
                return res.status(400).json({ message: 'Class duration must be 2 hours' });
            }
            gymClass.startedAt = startedAt;
            gymClass.endedAt = endedAt;
        }

        await gymClass.save();
        res.status(200).json({ message: 'Class updated successfully', gymClass });
    } catch (error) {
        next(error);
    }
};



const getAllGymClasses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Optional filters and pagination setup
        const { date, page = 1, limit = 10 } = req.query;

        // Pagination and limit calculations
        const skip = (Number(page) - 1) * Number(limit);

        // Filtering by date (if provided)
        let filter = {};
        if (date) {
            filter = { ...filter, date: new Date(date as string) };
        }

        // Fetch the classes with pagination, sorting by date
        const gymClasses = await GymClass.find(filter)
            .populate('trainer', 'name') // Populate trainer's name
            .populate('trainee', 'name') // Populate trainees' names
            .sort({ date: 1 }) // Sort by date in ascending order
            .skip(skip)
            .limit(Number(limit));

        // Total count for pagination purposes
        const totalClasses = await GymClass.countDocuments(filter);

        // Prepare the response
        const response = {
            success: true,
            message: 'Gym classes retrieved successfully',
            data: {
                totalPages: Math.ceil(totalClasses / Number(limit)),
                currentPage: Number(page),
                totalClasses,
                gymClasses,
            },
        };

        // Send the response
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

export default getAllGymClasses;


export const classControllers = {
    createGymClass,
    updateGymClass,
    getAllGymClasses
}