import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';

import unlinkFile from '../../../shared/unlinkFile';
import { IUser } from './user.interface';
import { User } from './user.model';
import QueryBuilder from '../../../builder/QueryBuilder';

const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
    //set role
    // payload.role = USER_ROLES.USER;
    const createUser = await User.create(payload);

    return createUser;
};

const getUserProfileFromDB = async (user: JwtPayload): Promise<Partial<IUser>> => {
    const { id } = user;
    const isExistUser = await User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }

    return isExistUser;
};

const getUserByRole = async (role: string): Promise<any> => {
    try {
        const users = await User.find({ role: role });
        return users;
    } catch (error) {
        console.log('error occured in getUserByRole:', error);
    }
};

const getAllUserFromDB = async (query: Record<string, any>) => {
    const userModal = new QueryBuilder(User.find({ role: USER_ROLES.TRAINER }), query)
        .search(['name', 'email'])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = await userModal.modelQuery;
    const meta = await userModal.countTotal();

    return {
        data,
        meta,
    };
};

const getUserByIdFromDB = async (id: string) => {
    const result = await User.findById(id);
    return result;
};

// const updateProfileToDB = async (user: JwtPayload, payload: Partial<IUser>): Promise<Partial<IUser | null>> => {
//     const { id } = user;
// // console.log({payload})

//     if (payload.email) {
//         throw new ApiError(StatusCodes.FORBIDDEN, 'Email cannot be changed!!!');
//     }
//     const isExistUser = await User.isExistUserById(id);
//     if (!isExistUser) {
//         throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
//     }

//     //unlink file here
//     if (payload.profile) {
//         unlinkFile(isExistUser.profile);
//     }

//     const updateDoc = await User.findOneAndUpdate({ _id: id }, payload?.data, {
//         new: true,
//     });
// // console.log(updateDoc)
//     return updateDoc;
// };

const updateProfileToDB = async (user: JwtPayload, payload: Partial<IUser>): Promise<Partial<IUser | null>> => {
    const { id } = user;

    // Prevent email changes
    if (payload.email) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'Email cannot be changed!!!');
    }

    // Check if the user exists
    const isExistUser = await User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }

    // Unlink old profile if a new one is being uploaded
    if (payload.profile) {
        unlinkFile(isExistUser.profile);
    }
    console.log(payload);
    // Update the user profile (correct usage of payload)
    const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, { new: true });
    console.log(updateDoc);
    return updateDoc;
};

const updateUserToDB = async (payload: Partial<IUser>): Promise<Partial<IUser | null>> => {
    console.log(payload);
    const { id } = payload.rawData;

    // Prevent email changes
    if (payload.email) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'Email cannot be changed!!!');
    }

    // Check if the user exists
    const isExistUser = await User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }

    // Unlink old profile if a new one is being uploaded
    if (payload.profile) {
        unlinkFile(isExistUser.profile);
    }
    console.log(payload);
    // Update the user profile (correct usage of payload)
    const updateDoc = await User.findOneAndUpdate({ _id: id }, payload.rawData, { new: true });
    console.log(updateDoc);
    return updateDoc;
};

const deleteUserFromDB = async (id: string): Promise<any> => {
    // Check if the user exists
    const isExistUser = await User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    // Update the user profile (correct usage of payload)
    const updateDoc = await User.findByIdAndDelete({ _id: id });
    return updateDoc;
};

export const UserService = {
    createUserToDB,
    getUserProfileFromDB,
    updateProfileToDB,
    getAllUserFromDB,
    getUserByIdFromDB,
    getUserByRole,
    updateUserToDB,
    deleteUserFromDB,
};
