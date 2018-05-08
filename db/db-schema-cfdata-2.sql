CREATE TABLE `cfdata`.`tblfollowers` (
  `followerId` varchar(50) NOT NULL,
  `followedId` varchar(50) NOT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`followerId`, `followedId`),
  INDEX `followingForeignKey_idx` (`followedId` ASC),
  CONSTRAINT `followerForeignKey`
    FOREIGN KEY (`followerId`)
    REFERENCES `cfdata`.`tblusers` (`userId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `followedForeignKey`
    FOREIGN KEY (`followedId`)
    REFERENCES `cfdata`.`tblusers` (`userId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
    ENGINE=InnoDB DEFAULT CHARSET=latin1;
