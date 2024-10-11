"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploadHandler_1 = __importDefault(require("../../middlewares/fileUploadHandler"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.get('/profile', (0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.TRAINEE, user_1.USER_ROLES.TRAINER), user_controller_1.UserController.getUserProfile);
//create a new user
router.route('/create-user').post((0, validateRequest_1.default)(user_validation_1.UserValidation.createUserZodSchema), user_controller_1.UserController.createUser);
router.route('/get-user/:role').get(user_controller_1.UserController.getUserByRole);
// update user profile
router
    .route('/update-profile')
    .patch((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN, user_1.USER_ROLES.TRAINEE, user_1.USER_ROLES.TRAINER), (0, fileUploadHandler_1.default)(), user_controller_1.UserController.updateProfile);
router.route('/update-user').patch((0, fileUploadHandler_1.default)(), user_controller_1.UserController.updateUser);
router.route('/delete-user').delete((0, fileUploadHandler_1.default)(), user_controller_1.UserController.deleteUser);
// get all users
router.route('/all-user').get((0, auth_1.default)(user_1.USER_ROLES.SUPER_ADMIN, user_1.USER_ROLES.ADMIN), user_controller_1.UserController.getAllUsers);
// get all admins
// //get single user by id
// router.route('/:id').get( auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TRAINEE,USER_ROLES.TRAINER), UserController.getUserById);
//  delete user account
// router.route('/').patch( auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TRAINEE,USER_ROLES.TRAINER), UserController.deleteAccount);
exports.UserRoutes = router;
