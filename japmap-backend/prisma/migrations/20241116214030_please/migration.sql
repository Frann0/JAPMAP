/*
  Warnings:

  - You are about to drop the `_UserToGitlabProject` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[_UserToGitlabProject] DROP CONSTRAINT [_UserToGitlabProject_A_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[_UserToGitlabProject] DROP CONSTRAINT [_UserToGitlabProject_B_fkey];

-- DropTable
DROP TABLE [dbo].[_UserToGitlabProject];

-- CreateTable
CREATE TABLE [dbo].[_GitlabProjectToUser] (
    [A] INT NOT NULL,
    [B] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [_GitlabProjectToUser_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_GitlabProjectToUser_B_index] ON [dbo].[_GitlabProjectToUser]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[_GitlabProjectToUser] ADD CONSTRAINT [_GitlabProjectToUser_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[GitlabProject]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_GitlabProjectToUser] ADD CONSTRAINT [_GitlabProjectToUser_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
