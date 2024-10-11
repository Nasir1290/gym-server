import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';
import ApiError from '../../../errors/ApiError';

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { ...userData } = req.body;

    const result = await UserService.createUserToDB(userData);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User created successfully',
        data: result,
    });
});

// const createSuperAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const { ...userData } = req.body;
//     const result = await UserService.createSuperAdminToDB(userData);

//     sendResponse(res, {
//         success: true,
//         statusCode: StatusCodes.OK,
//         message: 'Super Admin created successfully',
//         data: result,
//     });
// });

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await UserService.getUserProfileFromDB(user);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Profile data retrieved successfully',
        data: result,
    });
});

const getUserByRole = catchAsync(async (req: Request, res: Response) => {
    console.log(req.params)
    const {role} = req.params
    const result = await UserService.getUserByRole(role as string);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'all user retrieved successfully',
        data: result,
    });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const { data, meta } = await UserService.getAllUserFromDB(req.query);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'All users retrieved successfully',
        data: {
            data,
            meta,
        },
    });
});


// const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const user = req.user;
//     let profile;

//     // Check for file upload
//     if (req.files && 'image' in req.files && req.files.image[0]) {
//         profile = `/images/${req.files.image[0].filename}`;
//     }

//     // Create data object for updating the profile
//     const data = {
//         profile,
//         ...req.body,
//     };

//     // Log for debugging (remove in production)

//     // Update the profile in the database
//     const result = await UserService.updateProfileToDB(user, data);

//     // Send the response back
//     sendResponse(res, {
//         success: true,
//         statusCode: StatusCodes.OK,
//         message: 'Profile updated successfully',
//         data: result,
//     });
// });

const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // The user object should contain user information
    let profile;

    // Check if a new profile image is being uploaded
    if (req.files && 'image' in req.files && req.files.image[0]) {
        profile = `/images/${req.files.image[0].filename}`;
    }

    // Extract the raw data from req.body
    const rawData = req.body.data; // Assuming req.body.data contains the stringified data object
    let parsedData = {};
    const data = {
        profile,
        rawData, // Spread the parsed data into the data object
    };
    const result = await UserService.updateProfileToDB(user, data);

    // Send the response back
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Profile updated successfully',
        data: result,
    });
});


const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let profile;

    // Check if a new profile image is being uploaded
    if (req.files && 'image' in req.files && req.files.image[0]) {
        profile = `/images/${req.files.image[0].filename}`;
    }

    // Extract the raw data from req.body
    const rawData = req.body.data; // Assuming req.body.data contains the stringified data object
    const data = {
        profile,
        rawData, // Spread the parsed data into the data object
    };
    const result = await UserService.updateUserToDB(data);

    // Send the response back
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Profile updated successfully',
        data: result,
    });
});


const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.query;
    console.log(id) 
    if (!id) {
        return res.status(400).json({ success: false, message: 'ID is required' });
    }

    const result = await UserService.deleteUserFromDB(id as string);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: 'User deleted successfully!',
        data: {},
    });
});



export const UserController = {
    createUser,
    getUserProfile,
    updateProfile,
    getAllUsers,
    getUserByRole,
    updateUser,
    deleteUser
};
