USE clockingo_test;

CREATE TABLE `Roles` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE `Users` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Username` varchar(50) NOT NULL,
  `AuthToken` varchar(255) NOT NULL,
  `RoleId` int(11) NOT NULL,
  `IsDeleted` tinyint(1) DEFAULT 0,
  `TotpSecret` VARCHAR(255) DEFAULT NULL,
  `TwoFactorEnabled` TINYINT(1) DEFAULT 0,
  `RecoveryCodes` TEXT DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Username` (`Username`),
  KEY `RoleId` (`RoleId`),
  CONSTRAINT `Users_ibfk_1` FOREIGN KEY (`RoleId`) REFERENCES `Roles` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE `Locations` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Code` varchar(255) NOT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  `CreatedBy` int(11) NOT NULL,
  `IsCompanyOffice` tinyint(1) DEFAULT 0,
  `IsDeleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Code` (`Code`),
  KEY `CreatedBy` (`CreatedBy`),
  CONSTRAINT `Locations_ibfk_1` FOREIGN KEY (`CreatedBy`) REFERENCES `Users` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE `Entries` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) NOT NULL,
  `LocationId` int(11) NOT NULL,
  `EntryTime` datetime NOT NULL,
  `Selfie` longblob DEFAULT NULL,
  `UpdatedAt` datetime DEFAULT current_timestamp(),
  `IsSynced` tinyint(1) DEFAULT 0,
  `DeviceId` varchar(100) DEFAULT NULL,
  `IsDeleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`Id`),
  KEY `UserId` (`UserId`),
  KEY `LocationId` (`LocationId`),
  CONSTRAINT `Entries_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`),
  CONSTRAINT `Entries_ibfk_2` FOREIGN KEY (`LocationId`) REFERENCES `Locations` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


CREATE TABLE `Exits` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) NOT NULL,
  `LocationId` int(11) NOT NULL,
  `ExitTime` datetime NOT NULL,
  `EntryId` int(11) NOT NULL,
  `Result` varchar(255) DEFAULT NULL,
  `IrregularBehavior` tinyint(1) DEFAULT 0,
  `ReviewedByAdmin` tinyint(1) DEFAULT 0,
  `UpdatedAt` datetime DEFAULT current_timestamp(),
  `IsSynced` tinyint(1) DEFAULT 0,
  `DeviceId` varchar(100) DEFAULT NULL,
  `IsDeleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`Id`),
  KEY `UserId` (`UserId`),
  KEY `LocationId` (`LocationId`),
  KEY `EntryId` (`EntryId`),
  CONSTRAINT `Exits_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`),
  CONSTRAINT `Exits_ibfk_2` FOREIGN KEY (`LocationId`) REFERENCES `Locations` (`Id`),
  CONSTRAINT `Exits_ibfk_3` FOREIGN KEY (`EntryId`) REFERENCES `Entries` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE `Menus` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `NameEs` varchar(100) NOT NULL,
  `NameEn` varchar(100) NOT NULL,
  `ParentId` int(11) DEFAULT NULL,
  `Level` int(11) NOT NULL DEFAULT 1,
  `DisplayOrder` int(11) NOT NULL DEFAULT 0,
  `IsDeleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`Id`),
  KEY `ParentId` (`ParentId`),
  CONSTRAINT `Menus_ibfk_1` FOREIGN KEY (`ParentId`) REFERENCES `Menus` (`Id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

CREATE TABLE `MenuRoles` (
  `RoleId` int(11) NOT NULL,
  `MenuId` int(11) NOT NULL,
  PRIMARY KEY (`RoleId`, `MenuId`),
  KEY `MenuId` (`MenuId`),
  CONSTRAINT `MenuRoles_ibfk_1` FOREIGN KEY (`RoleId`) REFERENCES `Roles` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `MenuRoles_ibfk_2` FOREIGN KEY (`MenuId`) REFERENCES `Menus` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;