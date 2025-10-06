/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `t_tournaments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `t_tournaments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "t_tournaments" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "t_tournaments_slug_key" ON "t_tournaments"("slug");
