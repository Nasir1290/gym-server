"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.classControllers = void 0;
const class_model_1 = __importDefault(require("./class.model"));
const user_model_1 = require("../user/user.model");
// Controller function to create a class
const createGymClass = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { practiceName, trainerId, traineeIds, startedAt, endedAt, date } = req.body;
        // Ensure there is a valid trainer
        const trainer = yield user_model_1.User.findById(trainerId);
        if (!trainer || trainer.role !== 'TRAINER') {
            return res.status(400).json({ message: 'Invalid trainer or trainer not found' });
        }
        // Ensure all trainees are valid and not exceeding the limit
        const trainees = yield user_model_1.User.find({ _id: { $in: traineeIds }, role: 'TRAINEE' });
        if (trainees.length > 10) {
            return res.status(400).json({ message: 'Cannot exceed 10 trainees per class' });
        }
        // Ensure class duration is 2 hours
        const classDuration = (new Date(endedAt).getTime() - new Date(startedAt).getTime()) / (1000 * 60 * 60);
        if (classDuration !== 2) {
            return res.status(400).json({ message: 'Class duration must be 2 hours' });
        }
        // Create the gym class
        const gymClass = yield class_model_1.default.create({
            practiceName,
            trainer: trainerId,
            trainee: traineeIds,
            startedAt,
            endedAt,
            date,
            traineeCount: trainees.length,
        });
        res.status(201).json({ message: 'Gym class created successfully', gymClass });
    }
    catch (error) {
        next(error);
    }
});
const updateGymClass = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classId } = req.params;
        const { practiceName, trainerId, traineeIds, startedAt, endedAt } = req.body;
        // Fetch the class
        const gymClass = yield class_model_1.default.findById(classId);
        if (!gymClass) {
            return res.status(404).json({ message: 'Class not found' });
        }
        // Validate the trainer and trainees as before
        if (trainerId) {
            const trainer = yield user_model_1.User.findById(trainerId);
            if (!trainer || trainer.role !== 'TRAINER') {
                return res.status(400).json({ message: 'Invalid trainer or trainer not found' });
            }
            gymClass.trainer = trainerId;
        }
        if (traineeIds) {
            const trainees = yield user_model_1.User.find({ _id: { $in: traineeIds }, role: 'TRAINEE' });
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
        yield gymClass.save();
        res.status(200).json({ message: 'Class updated successfully', gymClass });
    }
    catch (error) {
        next(error);
    }
});
const getAllGymClasses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Optional filters and pagination setup
        const { date, page = 1, limit = 10 } = req.query;
        // Pagination and limit calculations
        const skip = (Number(page) - 1) * Number(limit);
        // Filtering by date (if provided)
        let filter = {};
        if (date) {
            filter = Object.assign(Object.assign({}, filter), { date: new Date(date) });
        }
        // Fetch the classes with pagination, sorting by date
        const gymClasses = yield class_model_1.default.find(filter)
            .populate('trainer', 'name') // Populate trainer's name
            .populate('trainee', 'name') // Populate trainees' names
            .sort({ date: 1 }) // Sort by date in ascending order
            .skip(skip)
            .limit(Number(limit));
        // Total count for pagination purposes
        const totalClasses = yield class_model_1.default.countDocuments(filter);
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
    }
    catch (error) {
        next(error);
    }
});
exports.default = getAllGymClasses;
exports.classControllers = {
    createGymClass,
    updateGymClass,
    getAllGymClasses
};
