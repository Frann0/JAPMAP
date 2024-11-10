/*
  Warnings:

  - You are about to drop the column `gitlabProjectId` on the `NomadInstance` table. All the data in the column will be lost.
  - Added the required column `mapId` to the `NomadInstance` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[NomadInstance] DROP CONSTRAINT [NomadInstance_gitlabProjectId_fkey];

-- AlterTable
ALTER TABLE [dbo].[NomadInstance] DROP COLUMN [gitlabProjectId];
ALTER TABLE [dbo].[NomadInstance] ADD [mapId] INT NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[Map] (
    [id] INT NOT NULL IDENTITY(1,1),
    [gitlabProjectId] INT NOT NULL,
    CONSTRAINT [Map_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Map_gitlabProjectId_key] UNIQUE NONCLUSTERED ([gitlabProjectId])
);

-- AddForeignKey
ALTER TABLE [dbo].[NomadInstance] ADD CONSTRAINT [NomadInstance_mapId_fkey] FOREIGN KEY ([mapId]) REFERENCES [dbo].[Map]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Map] ADD CONSTRAINT [Map_gitlabProjectId_fkey] FOREIGN KEY ([gitlabProjectId]) REFERENCES [dbo].[GitlabProject]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
