-- CreateTable
CREATE TABLE "Users" (
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blogs" (
    "title" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "author_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Blogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Blogs" ADD CONSTRAINT "Blogs_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
