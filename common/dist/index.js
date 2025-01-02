"use strict";
//this  file is for zod validation by both frontend and backend
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogInput = exports.createBlogInput = exports.signinInput = exports.signupInput = void 0;
const zod_1 = require("zod");
// signup/signin
exports.signupInput = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().optional(),
});
exports.signinInput = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
// blogs
exports.createBlogInput = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string(),
});
exports.updateBlogInput = zod_1.z.object({
    title: zod_1.z.string().optional(),
    content: zod_1.z.string().optional(),
    id: zod_1.z.number()
});
