INSERT INTO tblversion VALUES(1, CURRENT_TIME);

CREATE TABLE `tblcomplaints` (
  `objectId` varchar(100) NOT NULL,
  `userId` varchar(100) NOT NULL,
  `complaintCreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `complaintStatus` int(11) DEFAULT NULL,
  `objectType` int(11) DEFAULT NULL,
  PRIMARY KEY (`objectId`,`userId`),
  KEY `userId_idx` (`userId`),
  CONSTRAINT `userIdComplaint` FOREIGN KEY (`userId`) REFERENCES `tblusers` (`userId`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
