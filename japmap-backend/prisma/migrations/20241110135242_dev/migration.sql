BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[GitlabProject] (
    [id] INT NOT NULL,
    [nomadPrefix] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [path] NVARCHAR(1000) NOT NULL,
    [namespace] NVARCHAR(1000) NOT NULL,
    [visibility] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [webUrl] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [GitlabProject_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [GitlabProject_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[NomadInstance] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [gitlabProjectId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [NomadInstance_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [NomadInstance_pkey] PRIMARY KEY CLUSTERED ([id])
);

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
