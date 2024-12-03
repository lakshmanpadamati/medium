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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyProfile = exports.toggleFriendship = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getMyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const user = yield prisma.users.findUnique({
            where: { id: userId },
            select: {
                fullname: true,
                email: true,
                id: true,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getMyProfile = getMyProfile;
const toggleFriendship = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming you have middleware to add the current user's ID
        const { targetUserId } = req.body; // Target user ID should be passed in the request body
        if (!currentUserId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!targetUserId) {
            return res.status(400).json({ message: "Target user ID is required" });
        }
        if (currentUserId === targetUserId) {
            return res
                .status(400)
                .json({ message: "You cannot toggle friendship with yourself" });
        }
        // Check if the friendship already exists
        const existingFollow = yield prisma.usersFollow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: targetUserId,
                },
            },
        });
        if (existingFollow) {
            // If a friendship exists, delete it to "unfollow"
            yield prisma.usersFollow.delete({
                where: {
                    followerId_followingId: {
                        followerId: currentUserId,
                        followingId: targetUserId,
                    },
                },
            });
            return res
                .status(200)
                .json({ message: "Friendship removed successfully" });
        }
        else {
            // If a friendship does not exist, create it to "follow"
            const newFollow = yield prisma.usersFollow.create({
                data: {
                    followerId: currentUserId,
                    followingId: targetUserId,
                },
            });
            return res.status(201).json({
                message: "Friendship added successfully",
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message || "Internal server error",
        });
    }
});
exports.toggleFriendship = toggleFriendship;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const query = req.query.q;
        const currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming you have a way to extract the current user's ID
        let people = [];
        if (query && typeof query === "string") {
            people = yield prisma.users.findMany({
                where: {
                    fullname: { contains: query, mode: "insensitive" },
                },
                select: {
                    id: true,
                    fullname: true,
                    description: true,
                    _count: {
                        select: {
                            following: {
                                where: {
                                    followerId: currentUserId, // Check if the current user follows this user
                                },
                            },
                        },
                    },
                },
            });
            people = people.map((person) => (Object.assign(Object.assign({}, person), { _count: undefined, isFollowing: person._count.following > 0 })));
        }
        return res.status(200).json({ people });
    }
    catch (error) {
        if (error instanceof Error) {
            return res
                .status(500)
                .json({ error: error.message || "something went wrong" });
        }
        else {
            return res.status(500).json({ error: "An unexpected error occurred" });
        }
    }
});
exports.getUsers = getUsers;
