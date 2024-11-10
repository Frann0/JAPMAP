/*
  Warnings:

  - You are about to drop the column `mapId` on the `NomadInstance` table. All the data in the column will be lost.
  - You are about to drop the `Map` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `gitlabProjectId` to the `NomadInstance` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Map] DROP CONSTRAINT [Map_gitlabProjectId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[NomadInstance] DROP CONSTRAINT [NomadInstance_mapId_fkey];

-- AlterTable
ALTER TABLE [dbo].[NomadInstance] DROP COLUMN [mapId];
ALTER TABLE [dbo].[NomadInstance] ADD [gitlabProjectId] INT NOT NULL;

-- DropTable
DROP TABLE [dbo].[Map];

-- AddForeignKey
ALTER TABLE [dbo].[NomadInstance] ADD CONSTRAINT [NomadInstance_gitlabProjectId_fkey] FOREIGN KEY ([gitlabProjectId]) REFERENCES [dbo].[GitlabProject]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
