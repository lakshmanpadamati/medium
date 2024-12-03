/*
  Warnings:

  - You are about to drop the column `author_id` on the `Blogs` table. All the data in the column will be lost.
  - You are about to drop the column `firstname` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `Users` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `likes_count` to the `Blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saved_count` to the `Blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullname` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Blogs" DROP CONSTRAINT "Blogs_author_id_fkey";

-- AlterTable
ALTER TABLE "Blogs" DROP COLUMN "author_id",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD COLUMN     "likes_count" INTEGER NOT NULL,
ADD COLUMN     "saved_count" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "firstname",
DROP COLUMN "lastname",
ADD COLUMN     "fullname" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Comments" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blogId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LikedBlogs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_SavedBlogs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LikedBlogs_AB_unique" ON "_LikedBlogs"("A", "B");

-- CreateIndex
CREATE INDEX "_LikedBlogs_B_index" ON "_LikedBlogs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SavedBlogs_AB_unique" ON "_SavedBlogs"("A", "B");

-- CreateIndex
CREATE INDEX "_SavedBlogs_B_index" ON "_SavedBlogs"("B");

-- AddForeignKey
ALTER TABLE "Blogs" ADD CONSTRAINT "Blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedBlogs" ADD CONSTRAINT "_LikedBlogs_A_fkey" FOREIGN KEY ("A") REFERENCES "Blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedBlogs" ADD CONSTRAINT "_LikedBlogs_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SavedBlogs" ADD CONSTRAINT "_SavedBlogs_A_fkey" FOREIGN KEY ("A") REFERENCES "Blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SavedBlogs" ADD CONSTRAINT "_SavedBlogs_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
