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
exports.UserService = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_1 = require("../../../enums/user");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const unlinkFile_1 = __importDefault(require("../../../shared/unlinkFile"));
const user_model_1 = require("./user.model");
const QueryBuilder_1 = __importDefault(require("../../../builder/QueryBuilder"));
const createUserToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //set role
    // payload.role = USER_ROLES.USER;
    const createUser = yield user_model_1.User.create(payload);
    return createUser;
});
const getUserProfileFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    return isExistUser;
});
const getUserByRole = (role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.User.find({ role: role });
        return users;
    }
    catch (error) {
        console.log('error occured in getUserByRole:', error);
    }
});
const getAllUserFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userModal = new QueryBuilder_1.default(user_model_1.User.find({ role: user_1.USER_ROLES.TRAINER }), query)
        .search(['name', 'email'])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield userModal.modelQuery;
    const meta = yield userModal.countTotal();
    return {
        data,
        meta,
    };
});
const getUserByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    return result;
});
const updateProfileToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    // console.log(typeof payload.profile)
    if (payload.email) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Email cannot be changed!!!');
    }
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    //unlink file here
    if (payload.profile) {
        (0, unlinkFile_1.default)(isExistUser.profile);
    }
    const updateDoc = yield user_model_1.User.findOneAndUpdate({ _id: id }, Object.assign({ profile: payload === null || payload === void 0 ? void 0 : payload.profile }, payload === null || payload === void 0 ? void 0 : payload.data), {
        new: true,
    });
    // console.log(updateDoc)
    return updateDoc;
});
const updateUserToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    const { id } = payload.rawData;
    // Prevent email changes
    if (payload.email) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Email cannot be changed!!!');
    }
    // Check if the user exists
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    // Unlink old profile if a new one is being uploaded
    if (payload.profile) {
        (0, unlinkFile_1.default)(isExistUser.profile);
    }
    console.log(payload);
    // Update the user profile (correct usage of payload)
    const updateDoc = yield user_model_1.User.findOneAndUpdate({ _id: id }, payload.rawData, { new: true });
    console.log(updateDoc);
    return updateDoc;
});
const deleteUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user exists
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    // Update the user profile (correct usage of payload)
    const updateDoc = yield user_model_1.User.findByIdAndDelete({ _id: id });
    return updateDoc;
});
exports.UserService = {
    createUserToDB,
    getUserProfileFromDB,
    updateProfileToDB,
    getAllUserFromDB,
    getUserByIdFromDB,
    getUserByRole,
    updateUserToDB,
    deleteUserFromDB,
};
