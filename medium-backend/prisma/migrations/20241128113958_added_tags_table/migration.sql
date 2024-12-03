-- DropForeignKey
ALTER TABLE "Blogs" DROP CONSTRAINT "Blogs_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_blogId_fkey";

-- CreateTable
CREATE TABLE "Tags" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlogTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tags_tag_key" ON "Tags"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "_BlogTags_AB_unique" ON "_BlogTags"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogTags_B_index" ON "_BlogTags"("B");

-- AddForeignKey
ALTER TABLE "Blogs" ADD CONSTRAINT "Blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogTags" ADD CONSTRAINT "_BlogTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogTags" ADD CONSTRAINT "_BlogTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
