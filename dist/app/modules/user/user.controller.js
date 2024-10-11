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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const user_service_1 = require("./user.service");
const createUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = __rest(req.body, []);
    const result = yield user_service_1.UserService.createUserToDB(userData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'User created successfully',
        data: result,
    });
}));
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
const getUserProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield user_service_1.UserService.getUserProfileFromDB(user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Profile data retrieved successfully',
        data: result,
    });
}));
const getUserByRole = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    const { role } = req.params;
    const result = yield user_service_1.UserService.getUserByRole(role);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'all user retrieved successfully',
        data: result,
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, meta } = yield user_service_1.UserService.getAllUserFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'All users retrieved successfully',
        data: {
            data,
            meta,
        },
    });
}));
const updateProfile = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let profile;
    console.log(req.files);
    // Check for file upload
    if (req.files && 'image' in req.files && req.files.image[0]) {
        profile = `/images/${req.files.image[0].filename}`;
    }
    console.log(req.body);
    // Create data object for updating the profile
    const data = Object.assign({ profile }, req.body);
    // Log for debugging (remove in production)
    // Update the profile in the database
    const result = yield user_service_1.UserService.updateProfileToDB(user, data);
    // Send the response back
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Profile updated successfully',
        data: result,
    });
}));
// const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const user = req.user; // The user object should contain user information
//     let profile;
//     // Check if a new profile image is being uploaded
//     if (req.files && 'image' in req.files && req.files.image[0]) {
//         profile = `/images/${req.files.image[0].filename}`;
//     }
//     // Extract the raw data from req.body
//     const rawData = req.body.data; // Assuming req.body.data contains the stringified data object
//     let parsedData = JSON.parse(rawData);
//     const data = {
//         profile,
//         parsedData, // Spread the parsed data into the data object
//     };
//     const result = await UserService.updateProfileToDB(user, data);
//     // Send the response back
//     sendResponse(res, {
//         success: true,
//         statusCode: StatusCodes.OK,
//         message: 'Profile updated successfully',
//         data: result,
//     });
// });
const updateUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield user_service_1.UserService.updateUserToDB(data);
    // Send the response back
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Profile updated successfully',
        data: result,
    });
}));
const deleteUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    console.log(id);
    if (!id) {
        return res.status(400).json({ success: false, message: 'ID is required' });
    }
    const result = yield user_service_1.UserService.deleteUserFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'User deleted successfully!',
        data: {},
    });
}));
exports.UserController = {
    createUser,
    getUserProfile,
    updateProfile,
    getAllUsers,
    getUserByRole,
    updateUser,
    deleteUser
};
