/*
  Warnings:

  - Added the required column `subtitle` to the `Blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blogs" ADD COLUMN     "subtitle" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "followers_count" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "UsersFollow" (
    "id" SERIAL NOT NULL,
    "followerId" INTEGER NOT NULL,
    "followingId" INTEGER NOT NULL,

    CONSTRAINT "UsersFollow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UsersFollow" ADD CONSTRAINT "UsersFollow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersFollow" ADD CONSTRAINT "UsersFollow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
