BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Group] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Group_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[_GroupToUser] (
    [A] INT NOT NULL,
    [B] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [_GroupToUser_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_GitlabProjectToGroup] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_GitlabProjectToGroup_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_GroupToUser_B_index] ON [dbo].[_GroupToUser]([B]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_GitlabProjectToGroup_B_index] ON [dbo].[_GitlabProjectToGroup]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[_GroupToUser] ADD CONSTRAINT [_GroupToUser_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Group]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_GroupToUser] ADD CONSTRAINT [_GroupToUser_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_GitlabProjectToGroup] ADD CONSTRAINT [_GitlabProjectToGroup_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[GitlabProject]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_GitlabProjectToGroup] ADD CONSTRAINT [_GitlabProjectToGroup_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Group]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
