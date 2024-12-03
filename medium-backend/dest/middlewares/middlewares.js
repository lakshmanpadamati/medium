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
const authMiddleware = (req, res, next) => {
    try {
        // Check if the Authorization header is present
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ message: "Unauthorized: Missing or invalid token" });
        }
        // Extract the token'
        const token = authHeader.split(" ")[1];
        console.log(token);
        console.log();
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Attach the decoded user info to the request object
        req.user = decoded;
        // Call the next middleware or route handler
        next();
    }
    catch (error) {
        console.log(req.params);
        console.error("in authmiddleware", error.message);
        return res
            .status(401)
            .json({ message: "Unauthorized: Invalid or expired token" });
    }
};
const authorMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the Authorization header is present
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ message: "Unauthorized: Missing or invalid token" });
        }
        // Extract the token
        const token = authHeader.split(" ")[1];
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Attach the decoded user info to the request object
        const authorId = Number(decoded.id);
        const blogId = req.params.blogId;
        const blog = yield prisma.blogs.findUnique({
            where: { id: Number(blogId) },
        });
        if (!blog) {
            return res.status(404).json({ message: "blog not found" });
        }
        if (authorId !== (blog === null || blog === void 0 ? void 0 : blog.authorId)) {
            return res.status(401).json({ message: "Unauthorized request" });
        }
        req.user = decoded;
        // Call the next middleware or route handler
        next();
    }
    catch (error) {
        console.error("Authentication error:", error.message);
        return res
            .status(401)
            .json({ message: "Unauthorized: Invalid or expired token" });
    }
});
module.exports = { authMiddleware, authorMiddleware };
