use  `cfdata`;
INSERT INTO tblversion VALUES(4, CURRENT_TIME);

CREATE TABLE `tblinspirations` (
  `urlHash` varchar(600) NOT NULL,
  `url` varchar(5000) NOT NULL,
  `classifyPath` varchar(5000) DEFAULT NULL,
  `sourcePage` varchar(5000) DEFAULT NULL,
  `isRejected` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`urlHash`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `tblsessionrelations` (
  `userId` varchar(50) NOT NULL,
  `targetCollectionId` int(11) NOT NULL,
  `sourceSessionId` int(11) NOT NULL,
  PRIMARY KEY (`userId`,`sourceSessionId`),
  KEY `targetCollectionId_idx` (`targetCollectionId`),
  KEY `sourceSessionId_idx` (`sourceSessionId`),
  CONSTRAINT `sourceSessionId` FOREIGN KEY (`sourceSessionId`) REFERENCES `tblsessions` (`sessionId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `targetCollectionId` FOREIGN KEY (`targetCollectionId`) REFERENCES `tblcollections` (`collectionId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `targetUserId` FOREIGN KEY (`userId`) REFERENCES `tblusers` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


ALTER TABLE `cfdata`.`tblinspirations` 
ADD COLUMN `isRejected` TINYINT(1) NULL DEFAULT 0 AFTER `sourcePage`;

