/*
  Warnings:

  - A unique constraint covering the columns `[followerId,followingId]` on the table `UsersFollow` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UsersFollow_followerId_followingId_key" ON "UsersFollow"("followerId", "followingId");
