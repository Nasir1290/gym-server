import mongoose, { Schema, Document, Types } from 'mongoose';

// Define a User reference, assuming you have a User model
const User = mongoose.model('User');

// Gym Class Interface
interface IGymClass extends Document {
    practiceName: string;
    trainer: Types.ObjectId;
    trainee: Types.ObjectId[];
    startedAt: Date;
    endedAt: Date;
    date: Date;
    traineeCount: number;
}

// Gym Class Schema
const GymClassSchema: Schema<IGymClass> = new Schema({
    practiceName: { type: String, required: true },
    trainer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async function (trainerId: Types.ObjectId) {
                const user = await User.findById(trainerId);
                return user && user.role === 'TRAINER'; // Ensure the user is a trainer
            },
            message: 'The assigned trainer must have the role TRAINER.',
        },
    },
    trainee: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            validate: {
                validator: async function (traineeId: Types.ObjectId) {
                    const user = await User.findById(traineeId);
                    return user && user.role === 'TRAINEE'; // Ensure the user is a trainee
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
GymClassSchema.pre('save', async function (next) {
    const gymClass = this as IGymClass;
    const classCount = await GymClass.countDocuments({ date: gymClass.date });

    if (classCount >= 5) {
        throw new Error('Cannot schedule more than 5 classes per day');
    }

    next();
});

// Create GymClass model
const GymClass = mongoose.model<IGymClass>('GymClass', GymClassSchema);

export default GymClass;
