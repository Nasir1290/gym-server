"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define a User reference, assuming you have a User model
const User = mongoose_1.default.model('User');
// Gym Class Schema
const GymClassSchema = new mongoose_1.Schema({
    practiceName: { type: String, required: true },
    trainer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: function (trainerId) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield User.findById(trainerId);
                    return user && user.role === 'TRAINER'; // Ensure the user is a trainer
                });
            },
            message: 'The assigned trainer must have the role TRAINER.',
        },
    },
    trainee: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            validate: {
                validator: function (traineeId) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const user = yield User.findById(traineeId);
                        return user && user.role === 'TRAINEE'; // Ensure the user is a trainee
                    });
                },
                message: 'Trainee must have the role TRAINEE.',
            },
        },
    ],
    startedAt: { type: Date, required: true },
    endedAt: { type: Date, required: true },
    date: { type: Date, required: true },
    traineeCount: { type: Number, default: 0, max: 10 }, // Max of 10 trainees per class
});
// Middleware to ensure max 5 classes per day
GymClassSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const gymClass = this;
        const classCount = yield GymClass.countDocuments({ date: gymClass.date });
        if (classCount >= 5) {
            throw new Error('Cannot schedule more than 5 classes per day');
        }
        next();
    });
});
// Create GymClass model
const GymClass = mongoose_1.default.model('GymClass', GymClassSchema);
exports.default = GymClass;
