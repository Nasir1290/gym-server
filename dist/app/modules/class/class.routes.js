"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classRouter = void 0;
const express_1 = require("express");
const class_controllers_1 = require("./class.controllers");
const router = (0, express_1.Router)();
router.route('/create-class').post(class_controllers_1.classControllers.createGymClass);
router.route('/update-class').patch(class_controllers_1.classControllers.updateGymClass);
router.route('/').patch(class_controllers_1.classControllers.getAllGymClasses);
exports.classRouter = router;
