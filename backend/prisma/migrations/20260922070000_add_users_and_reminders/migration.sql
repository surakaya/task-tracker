
CREATE TABLE `User` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `passwordHash` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(30) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE INDEX `User_email_key`(`email`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Session` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `token` VARCHAR(128) NOT NULL,
  `userId` INTEGER NOT NULL,
  `expiresAt` DATETIME(3) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE INDEX `Session_token_key`(`token`),
  INDEX `Session_userId_idx`(`userId`),
  INDEX `Session_expiresAt_idx`(`expiresAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Task`
  ADD COLUMN `isImportant` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `reminderAt` DATETIME(3) NULL,
  ADD COLUMN `userId` INTEGER NULL;

INSERT INTO `User` (`name`, `email`, `passwordHash`)
VALUES ('Eski Görevler', 'legacy-import@local.invalid', '$2a$12$GBDNuiFuAsL9vkA50Qs/BOpIfXBVqa7o1E4qVqHkW3.rFOuuZZh8a');

UPDATE `Task`
SET `userId` = (SELECT `id` FROM `User` WHERE `email` = 'legacy-import@local.invalid')
WHERE `userId` IS NULL;

ALTER TABLE `Task` MODIFY `userId` INTEGER NOT NULL;
CREATE INDEX `Task_userId_idx` ON `Task`(`userId`);
ALTER TABLE `Task` ADD CONSTRAINT `Task_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
