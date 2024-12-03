import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
interface userInterface {
  fullname: string;
  description: string;
  id: number;
  _count: { following: number };
  following?: boolean;
}

const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await prisma.users.findUnique({
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
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
const toggleFriendship = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?.id; // Assuming you have middleware to add the current user's ID
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
    const existingFollow = await prisma.usersFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      // If a friendship exists, delete it to "unfollow"
      await prisma.usersFollow.delete({
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
    } else {
      // If a friendship does not exist, create it to "follow"
      const newFollow = await prisma.usersFollow.create({
        data: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      });

      return res.status(201).json({
        message: "Friendship added successfully",
      });
    }
  } catch (error: any) {
  
    console.error(error);
    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const query = req.query.q;
    const currentUserId = req.user?.id; // Assuming you have a way to extract the current user's ID

    let people: any = [];

    if (query && typeof query === "string") {
      people = await prisma.users.findMany({
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
      people = people.map((person: userInterface) => ({
        ...person,
        _count: undefined,
        isFollowing: person._count.following > 0, // true if count > 0, otherwise false
      }));
    }
    return res.status(200).json({ people });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ error: error.message || "something went wrong" });
    } else {
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

export { getUsers, toggleFriendship,getMyProfile };
