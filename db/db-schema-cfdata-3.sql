CREATE TABLE `tblfeedbacks` (
  `feedbackId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(50) NOT NULL,
  `feedbackText` longtext,
  `screenshotPath` varchar(2000) DEFAULT NULL,
  `feedbackCreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `feedbackStatus` int(11) DEFAULT '0',
  PRIMARY KEY (`feedbackId`),
  KEY `feedbackUserId_idx` (`userId`),
  CONSTRAINT `feedbackUserId` FOREIGN KEY (`userId`) REFERENCES `tblusers` (`userId`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
