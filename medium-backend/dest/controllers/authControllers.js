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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" }),
});
const signupSchema = zod_1.z.object({
    fullname: zod_1.z.string(),
    description: zod_1.z.string(),
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" }),
});
// The signup controller function
const signupcontroller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the incoming data using Zod
        const parsedData = signupSchema.safeParse(req.body);
        // If validation fails, return a 400 response with the error message
        if (!parsedData.success) {
            return res.status(400).json({
                message: parsedData.error.errors.map((err) => `${err.path}: ${err.message}`).join(", "),
            });
        }
        // Extract validated data
        const { fullname, email, password, description } = parsedData.data;
        // Check if the user already exists by email
        const existingUser = yield prisma.users.findUnique({
            where: { email }, // Query by the unique email field
        });
        // If user exists, return an error
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "User with this email already exists" });
        }
        // Hash the password
        const salt = yield bcrypt_1.default.genSalt(12);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        // Create a new user in the database
        const newUser = yield prisma.users.create({
            data: {
                fullname,
                description,
                email,
                password: hashedPassword,
            },
        });
        const token = jsonwebtoken_1.default.sign({ email: newUser.email, id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        // Respond with the created user (excluding password)
        return res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: newUser.id,
                fullname: newUser.fullname,
                email: newUser.email,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message || "Internal server error",
        });
    }
});
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = loginSchema.safeParse(req.body);
        if (!response.success) {
            return res.status(400).json({
                message: response.error.errors.map((err) => err.message).join(", "),
            });
        }
        const { email, password } = response.data;
        const user = yield prisma.users.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                fullname: user.fullname,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message || "Internal server error",
        });
    }
});
const updatePasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
const forgotPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
module.exports = { signupcontroller, loginController, updatePasswordController, forgotPasswordController };
