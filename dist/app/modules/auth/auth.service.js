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
exports.AuthService = void 0;
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const user_model_1 = require("../user/user.model");
//login
const loginUserFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const isExistUser = yield user_model_1.User.findOne({ email }).select('+password');
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    //check match password
    if (password &&
        !(yield user_model_1.User.isMatchPassword(password, isExistUser.password))) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Password is incorrect!');
    }
    const jwtPayload = {
        id: isExistUser._id,
        role: isExistUser.role,
        email: isExistUser.email,
    };
    //create token
    const accessToken = jwtHelper_1.jwtHelper.createToken(jwtPayload, config_1.default.jwt.jwt_access_token_secret, config_1.default.jwt.access_token_expire_in);
    const refreshToken = jwtHelper_1.jwtHelper.createToken(jwtPayload, config_1.default.jwt.jwt_refresh_token_secret, config_1.default.jwt.refresh_token_expire_in);
    return { accessToken, refreshToken };
});
// resend otp again
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jwtHelper_1.jwtHelper.verifyToken(token, config_1.default.jwt.jwt_refresh_token_secret);
    const { id } = decoded;
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User not found');
    }
    //check verified and status
    if (!isExistUser.verified) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Please verify your account, then try to login again');
    }
    //check user status
    if (isExistUser.status === 'delete') {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'It looks like your account has been deactivated.');
    }
    const jwtPayload = {
        id: isExistUser._id,
        role: isExistUser.role,
        email: isExistUser.email,
    };
    //create token
    const accessToken = jwtHelper_1.jwtHelper.createToken(jwtPayload, config_1.default.jwt.jwt_access_token_secret, config_1.default.jwt.access_token_expire_in);
    return { accessToken };
});
exports.AuthService = {
    loginUserFromDB,
    refreshToken,
};
