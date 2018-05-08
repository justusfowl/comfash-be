-- MySQL dump 10.16  Distrib 10.1.25-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: cfdata
-- ------------------------------------------------------
-- Server version	10.1.25-MariaDB-1~xenial

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tblcollections`
--

DROP TABLE IF EXISTS `tblcollections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblcollections` (
  `collectionId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(50) NOT NULL,
  `collectionCreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `collectionTitle` varchar(100) NOT NULL,
  `privacyStatus` int(3) NOT NULL DEFAULT '0',
  `collectionDescription` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`collectionId`),
  KEY `userId_idx` (`userId`),
  CONSTRAINT `userId` FOREIGN KEY (`userId`) REFERENCES `tblusers` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblcomments`
--

DROP TABLE IF EXISTS `tblcomments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblcomments` (
  `commentId` int(11) NOT NULL AUTO_INCREMENT,
  `commentText` longtext NOT NULL,
  `commentCreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `xRatio` decimal(17,17) DEFAULT NULL,
  `yRatio` decimal(17,17) DEFAULT NULL,
  `sessionId` int(11) NOT NULL,
  `userId` varchar(50) NOT NULL,
  `prcSessionItem` int(11) DEFAULT NULL,
  PRIMARY KEY (`commentId`),
  KEY `userId_idx` (`userId`),
  KEY `sessionId_idx` (`sessionId`),
  CONSTRAINT `authorId` FOREIGN KEY (`userId`) REFERENCES `tblusers` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sessionId` FOREIGN KEY (`sessionId`) REFERENCES `tblsessions` (`sessionId`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblcomparehists`
--

DROP TABLE IF EXISTS `tblcomparehists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblcomparehists` (
  `userId` varchar(50) NOT NULL,
  `sessionId` int(11) NOT NULL,
  `addedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `flagActive` varchar(45) DEFAULT '1',
  `modifiedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`,`sessionId`),
  KEY `compareSessionId_idx` (`sessionId`),
  CONSTRAINT `compareSessionId` FOREIGN KEY (`sessionId`) REFERENCES `tblsessions` (`sessionId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `compareUserId` FOREIGN KEY (`userId`) REFERENCES `tblusers` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblgroupusers`
--

DROP TABLE IF EXISTS `tblgroupusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblgroupusers` (
  `collectionId` int(11) NOT NULL,
  `userId` varchar(50) NOT NULL,
  `userIdIsAuthor` tinyint(1) NOT NULL DEFAULT '0',
  KEY `memberId_idx` (`userId`),
  KEY `collectionId_idx` (`collectionId`),
  CONSTRAINT `collectionIdToGroup` FOREIGN KEY (`collectionId`) REFERENCES `tblcollections` (`collectionId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `memberId` FOREIGN KEY (`userId`) REFERENCES `tblusers` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblmessages`
--

DROP TABLE IF EXISTS `tblmessages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblmessages` (
  `messageId` int(11) NOT NULL AUTO_INCREMENT,
  `senderId` varchar(100) NOT NULL,
  `receiverId` varchar(100) NOT NULL,
  `messageBody` varchar(500) DEFAULT NULL,
  `linkUrl` varchar(1000) DEFAULT NULL,
  `messageCreated` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `isUnread` int(11) DEFAULT NULL,
  `collectionId` int(11) DEFAULT NULL,
  `sessionId` int(11) DEFAULT NULL,
  PRIMARY KEY (`messageId`),
  KEY `receiverId_idx` (`receiverId`),
  KEY `messageCollectionId_idx` (`collectionId`),
  KEY `messageSessionId_idx` (`sessionId`),
  CONSTRAINT `messageCollectionId` FOREIGN KEY (`collectionId`) REFERENCES `tblcollections` (`collectionId`) ON DELETE SET NULL ON UPDATE NO ACTION,
  CONSTRAINT `messageSessionId` FOREIGN KEY (`sessionId`) REFERENCES `tblsessions` (`sessionId`) ON DELETE SET NULL ON UPDATE NO ACTION,
  CONSTRAINT `receiverId` FOREIGN KEY (`receiverId`) REFERENCES `tblusers` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=440 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblsessions`
--

DROP TABLE IF EXISTS `tblsessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblsessions` (
  `sessionId` int(11) NOT NULL AUTO_INCREMENT,
  `sessionCreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `collectionId` int(11) NOT NULL,
  `sessionItemPath` varchar(2000) DEFAULT NULL,
  `sessionItemType` varchar(45) DEFAULT NULL,
  `sessionThumbnailPath` varchar(2000) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `primeColor` varchar(45) NOT NULL DEFAULT '#8c8c8c',
  `primeFont` varchar(45) DEFAULT '#fff',
  `filterOption` varchar(45) DEFAULT '#nofilter',
  PRIMARY KEY (`sessionId`),
  KEY `collectionId_idx` (`collectionId`),
  CONSTRAINT `collectionId` FOREIGN KEY (`collectionId`) REFERENCES `tblcollections` (`collectionId`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=361 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbltags`
--

DROP TABLE IF EXISTS `tbltags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbltags` (
  `tagId` int(11) NOT NULL AUTO_INCREMENT,
  `sessionId` int(11) NOT NULL,
  `tagUrl` mediumtext NOT NULL,
  `tagTitle` varchar(100) DEFAULT NULL,
  `tagImage` varchar(1000) DEFAULT NULL,
  `tagSeller` varchar(100) DEFAULT NULL,
  `tagBrand` varchar(100) DEFAULT NULL,
  `xRatio` decimal(10,10) DEFAULT '0.5000000000',
  `yRatio` decimal(10,10) DEFAULT '0.5000000000',
  PRIMARY KEY (`tagId`),
  KEY `tagSessionId_idx` (`sessionId`),
  CONSTRAINT `tagSessionId` FOREIGN KEY (`sessionId`) REFERENCES `tblsessions` (`sessionId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbluserdevices`
--

DROP TABLE IF EXISTS `tbluserdevices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbluserdevices` (
  `userId` varchar(50) NOT NULL,
  `deviceToken` varchar(100) NOT NULL,
  `lastUpdate` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`deviceToken`),
  KEY `deviceUserId_idx` (`userId`),
  CONSTRAINT `deviceUserId` FOREIGN KEY (`userId`) REFERENCES `tblusers` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblusers`
--

DROP TABLE IF EXISTS `tblusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblusers` (
  `userId` varchar(50) NOT NULL,
  `userName` varchar(45) DEFAULT NULL,
  `userBirthDate` date DEFAULT NULL,
  `userAvatarPath` varchar(2000) DEFAULT NULL,
  `userCreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tblvotes`
--

DROP TABLE IF EXISTS `tblvotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblvotes` (
  `sessionId` int(11) NOT NULL,
  `voteType` int(11) NOT NULL,
  `voteChanged` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `userId` varchar(50) NOT NULL,
  PRIMARY KEY (`sessionId`,`userId`),
  KEY `voteSessionId_idx` (`sessionId`),
  KEY `voteUserId_idx` (`userId`),
  CONSTRAINT `voteSessionId` FOREIGN KEY (`sessionId`) REFERENCES `tblsessions` (`sessionId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `voteUserId` FOREIGN KEY (`userId`) REFERENCES `tblusers` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-03 21:06:58
