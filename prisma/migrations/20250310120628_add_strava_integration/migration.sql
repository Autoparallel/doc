-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "stravaConnected" BOOLEAN NOT NULL DEFAULT false,
    "stravaId" TEXT,
    "stravaToken" TEXT,
    "stravaRefreshToken" TEXT,
    "stravaTokenExpiresAt" DATETIME,
    "stravaLastSync" DATETIME
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "password", "updatedAt") SELECT "createdAt", "email", "id", "name", "password", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_stravaId_key" ON "User"("stravaId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
