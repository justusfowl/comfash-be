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
  `userId` varchar(45) NOT NULL,
  `collectionCreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `collectionTitle` varchar(100) NOT NULL,
  `privacyStatus` int(3) NOT NULL DEFAULT '0',
  `collectionDescription` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`collectionId`),
  KEY `userId_idx` (`userId`),
  CONSTRAINT `userId` FOREIGN KEY (`userId`) REFERENCES `tblusers` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblcollections`
--

LOCK TABLES `tblcollections` WRITE;
/*!40000 ALTER TABLE `tblcollections` DISABLE KEYS */;
INSERT INTO `tblcollections` VALUES (95,'u.kaulfuss@gmx.de','2018-03-20 14:03:46','Leisure',0,'Collecting some outfits for every day use but with neat details to them.'),(96,'u.kaulfuss@gmx.de','2018-03-20 14:06:00','FineOutfits',0,'Gathering ideas for the perfect office dressup, ranging from top to bottom, glasses to shoes.'),(97,'u.kaulfuss@gmx.de','2018-03-20 14:28:02','CasualMine',3,'Hunting a special outfit for a very special night :)'),(101,'tim','2018-03-20 15:19:11','OfficeFinest',0,'Hunting a special outfit for a very special night :)'),(102,'tim','2018-03-21 09:26:52','SamstagParty',0,'Hunting a special outfit for a very special night :)'),(103,'u.kaulfuss@gmx.de','2018-03-21 09:53:01','WeddingDress',0,'Hunting a special outfit for a very special night :)');
/*!40000 ALTER TABLE `tblcollections` ENABLE KEYS */;
UNLOCK TABLES;

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
  `userId` varchar(200) NOT NULL,
  `prcSessionItem` int(11) DEFAULT NULL,
  PRIMARY KEY (`commentId`),
  KEY `userId_idx` (`userId`),
  KEY `sessionId_idx` (`sessionId`),
  CONSTRAINT `authorId` FOREIGN KEY (`userId`) REFERENCES `tblusers` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sessionId` FOREIGN KEY (`sessionId`) REFERENCES `tblsessions` (`sessionId`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblcomments`
--

LOCK TABLES `tblcomments` WRITE;
/*!40000 ALTER TABLE `tblcomments` DISABLE KEYS */;
INSERT INTO `tblcomments` VALUES (54,'very nice dress :)','2018-03-21 09:35:24',0.45326745038146690,0.65673575129533680,239,'larakaulfuss@datacenter.de',10),(57,'harald','2018-04-16 07:45:27',0.50000000000000000,0.50000000000000000,241,'u.kaulfuss@gmx.de',NULL),(58,'test','2018-04-16 07:51:23',0.50000000000000000,0.50000000000000000,241,'u.kaulfuss@gmx.de',NULL),(61,'asd','2018-04-16 07:51:43',0.50000000000000000,0.50000000000000000,241,'u.kaulfuss@gmx.de',NULL),(62,'Niiiiice','2018-04-16 07:51:47',0.50000000000000000,0.50000000000000000,241,'u.kaulfuss@gmx.de',NULL),(64,'nice one','2018-04-16 11:08:21',0.50000000000000000,0.50000000000000000,241,'u.kaulfuss@gmx.de',NULL),(65,'harald','2018-04-16 11:13:48',0.50000000000000000,0.50000000000000000,241,'u.kaulfuss@gmx.de',NULL),(66,'harald','2018-04-16 11:18:26',0.50000000000000000,0.50000000000000000,241,'u.kaulfuss@gmx.de',NULL),(67,'asdasd','2018-04-16 11:19:12',0.50000000000000000,0.50000000000000000,241,'u.kaulfuss@gmx.de',NULL),(68,'','2018-04-16 11:19:15',0.50000000000000000,0.50000000000000000,241,'u.kaulfuss@gmx.de',NULL),(69,'asd','2018-04-16 11:20:01',0.50000000000000000,0.50000000000000000,241,'u.kaulfuss@gmx.de',NULL),(72,'oooo','2018-04-16 11:23:49',0.50000000000000000,0.50000000000000000,241,'u.kaulfuss@gmx.de',NULL),(74,'das ist aber nice','2018-04-18 19:04:55',0.50000000000000000,0.50000000000000000,264,'u.kaulfuss@gmx.de',NULL);
/*!40000 ALTER TABLE `tblcomments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblcomparehists`
--

DROP TABLE IF EXISTS `tblcomparehists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblcomparehists` (
  `userId` varchar(100) NOT NULL,
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
-- Dumping data for table `tblcomparehists`
--

LOCK TABLES `tblcomparehists` WRITE;
/*!40000 ALTER TABLE `tblcomparehists` DISABLE KEYS */;
INSERT INTO `tblcomparehists` VALUES ('u.kaulfuss@gmx.de',241,'2018-04-15 09:27:38','1','2018-04-19 09:26:26'),('u.kaulfuss@gmx.de',242,'2018-04-16 11:55:04','1','2018-04-16 12:09:19'),('u.kaulfuss@gmx.de',243,'2018-04-15 10:38:41','1','2018-04-16 09:01:52'),('u.kaulfuss@gmx.de',252,'2018-04-15 10:49:16','1','2018-04-16 11:08:34'),('u.kaulfuss@gmx.de',263,'2018-04-18 19:03:53','1','2018-04-18 19:03:53'),('u.kaulfuss@gmx.de',264,'2018-04-18 19:03:54','1','2018-04-19 09:26:50'),('u.kaulfuss@gmx.de',273,'2018-04-18 15:11:52','1','2018-04-18 15:11:51'),('u.kaulfuss@gmx.de',274,'2018-04-18 19:03:56','1','2018-04-19 09:24:43');
/*!40000 ALTER TABLE `tblcomparehists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblgroupusers`
--

DROP TABLE IF EXISTS `tblgroupusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblgroupusers` (
  `collectionId` int(11) NOT NULL,
  `userId` varchar(100) NOT NULL,
  `userIdIsAuthor` tinyint(1) NOT NULL DEFAULT '0',
  KEY `memberId_idx` (`userId`),
  KEY `collectionId_idx` (`collectionId`),
  CONSTRAINT `collectionIdToGroup` FOREIGN KEY (`collectionId`) REFERENCES `tblcollections` (`collectionId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `memberId` FOREIGN KEY (`userId`) REFERENCES `tblusers` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblgroupusers`
--

LOCK TABLES `tblgroupusers` WRITE;
/*!40000 ALTER TABLE `tblgroupusers` DISABLE KEYS */;
INSERT INTO `tblgroupusers` VALUES (95,'u.kaulfuss@gmx.de',1),(96,'u.kaulfuss@gmx.de',1),(97,'u.kaulfuss@gmx.de',1),(95,'tim',0),(95,'larakaulfuss@datacenter.de',0),(103,'u.kaulfuss@gmx.de',1),(95,'harald@test',0);
/*!40000 ALTER TABLE `tblgroupusers` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=297 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblmessages`
--

LOCK TABLES `tblmessages` WRITE;
/*!40000 ALTER TABLE `tblmessages` DISABLE KEYS */;
INSERT INTO `tblmessages` VALUES (181,'tim','u.kaulfuss@gmx.de','COL_HAS_INVITED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":101}}','2018-03-20 15:19:11',1,101,NULL),(182,'tim','u.kaulfuss@gmx.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":101}}','2018-03-20 15:19:34',1,101,NULL),(183,'tim','tim','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":101,\"compareSessionIds\":\"238\"}}','2018-03-20 15:23:12',1,101,238),(184,'uli','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":89}}','2018-03-21 09:23:17',1,NULL,NULL),(185,'uli','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":89}}','2018-03-21 09:23:17',1,NULL,NULL),(186,'uli','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":89}}','2018-03-21 09:24:08',1,NULL,NULL),(187,'uli','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":89}}','2018-03-21 09:24:08',1,NULL,NULL),(188,'uli','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-03-21 09:24:23',1,95,NULL),(189,'uli','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":96}}','2018-03-21 09:24:36',1,96,NULL),(190,'uli','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":97}}','2018-03-21 09:24:51',1,97,NULL),(191,'uli','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":89}}','2018-03-21 09:25:18',1,NULL,NULL),(192,'uli','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":89}}','2018-03-21 09:25:18',1,NULL,NULL),(193,'uli','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":89}}','2018-03-21 09:26:00',1,NULL,NULL),(194,'uli','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":89}}','2018-03-21 09:26:00',1,NULL,NULL),(195,'tim','larakaulfuss@datacenter.de','COL_HAS_INVITED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":102}}','2018-03-21 09:26:53',1,102,NULL),(196,'tim','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":102}}','2018-03-21 09:27:10',1,102,NULL),(197,'tim','u.kaulfuss@gmx.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":101}}','2018-03-21 09:27:28',1,101,NULL),(198,'tim','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":89,\"compareSessionIds\":\"239\"}}','2018-03-21 09:32:39',1,NULL,239),(199,'tim','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":89,\"compareSessionIds\":\"244\"}}','2018-03-21 09:32:46',1,NULL,NULL),(200,'tim','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":96,\"compareSessionIds\":\"242\"}}','2018-03-21 09:32:57',1,96,242),(201,'tim','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":97,\"compareSessionIds\":\"243\"}}','2018-03-21 09:33:12',1,97,243),(202,'larakaulfuss@datacenter.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":89,\"compareSessionIds\":\"245\"}}','2018-03-21 09:35:42',1,NULL,NULL),(203,'larakaulfuss@datacenter.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":89,\"compareSessionIds\":\"239\"}}','2018-03-21 09:35:45',1,NULL,239),(204,'sarah@comfash.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":89,\"compareSessionIds\":\"244\"}}','2018-03-21 11:49:51',1,NULL,NULL),(205,'sarah@comfash.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":89,\"compareSessionIds\":\"244\"}}','2018-03-21 11:59:45',1,NULL,NULL),(206,'sarah@comfash.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":89,\"compareSessionIds\":\"244\"}}','2018-03-21 12:00:44',1,NULL,NULL),(207,'sarah@comfash.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":89,\"compareSessionIds\":\"244\"}}','2018-03-21 12:52:26',1,NULL,NULL),(208,'sarah@comfash.de','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-03-21 12:53:20',1,95,NULL),(209,'sarah@comfash.de','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":97}}','2018-03-21 13:12:59',1,97,NULL),(210,'sarah@comfash.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":103,\"compareSessionIds\":\"239\"}}','2018-03-21 19:17:05',1,103,239),(211,'sarah@comfash.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":103,\"compareSessionIds\":\"239\"}}','2018-03-21 19:17:12',1,103,239),(212,'u.kaulfuss@gmx.de','harald@test','COL_HAS_INVITED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":\"89\"}}','2018-04-10 13:22:00',1,NULL,NULL),(213,'u.kaulfuss@gmx.de','harald@test','COL_HAS_INVITED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":\"89\"}}','2018-04-10 13:22:54',1,NULL,NULL),(214,'u.kaulfuss@gmx.de','tim','COL_HAS_INVITED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":\"107\"}}','2018-04-10 13:51:01',1,NULL,NULL),(215,'u.kaulfuss@gmx.de','larakaulfuss@datacenter.de','COL_HAS_INVITED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":\"107\"}}','2018-04-10 13:51:01',1,NULL,NULL),(216,'u.kaulfuss@gmx.de','tim','COL_HAS_INVITED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":\"95\"}}','2018-04-10 15:04:09',1,95,NULL),(217,'u.kaulfuss@gmx.de','larakaulfuss@datacenter.de','COL_HAS_INVITED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":\"95\"}}','2018-04-10 15:04:19',1,95,NULL),(218,'u.kaulfuss@gmx.de','tim','COL_HAS_INVITED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":108}}','2018-04-10 15:13:01',1,NULL,NULL),(219,'u.kaulfuss@gmx.de','harald@test','COL_HAS_INVITED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":\"95\"}}','2018-04-16 08:46:55',1,95,NULL),(220,'u.kaulfuss@gmx.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":95,\"compareSessionIds\":\"241\"}}','2018-04-16 10:30:27',1,95,241),(221,'u.kaulfuss@gmx.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":95,\"compareSessionIds\":\"241\"}}','2018-04-16 10:45:57',1,95,241),(222,'u.kaulfuss@gmx.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":95,\"compareSessionIds\":\"241\"}}','2018-04-16 11:05:16',1,95,241),(223,'u.kaulfuss@gmx.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":95,\"compareSessionIds\":\"251\"}}','2018-04-16 11:05:24',1,95,NULL),(224,'u.kaulfuss@gmx.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":95,\"compareSessionIds\":\"241\"}}','2018-04-16 11:07:13',1,95,241),(225,'u.kaulfuss@gmx.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":95,\"compareSessionIds\":\"241\"}}','2018-04-16 11:09:38',1,95,241),(226,'u.kaulfuss@gmx.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":95,\"compareSessionIds\":\"241\"}}','2018-04-16 11:11:26',1,95,241),(227,'u.kaulfuss@gmx.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":95,\"compareSessionIds\":\"251\"}}','2018-04-16 11:11:30',1,95,NULL),(228,'u.kaulfuss@gmx.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":95,\"compareSessionIds\":\"251\"}}','2018-04-16 11:11:32',1,95,NULL),(229,'u.kaulfuss@gmx.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":95,\"compareSessionIds\":\"251\"}}','2018-04-16 11:11:34',0,95,NULL),(230,'u.kaulfuss@gmx.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":95,\"compareSessionIds\":\"251\"}}','2018-04-16 11:11:35',0,95,NULL),(231,'u.kaulfuss@gmx.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":95,\"compareSessionIds\":\"251\"}}','2018-04-16 11:12:28',0,95,NULL),(232,'u.kaulfuss@gmx.de','tim','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":102,\"compareSessionIds\":\"246\"}}','2018-04-16 11:27:11',1,102,246),(233,'u.kaulfuss@gmx.de','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-16 19:33:23',1,95,NULL),(234,'u.kaulfuss@gmx.de','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-16 19:33:23',1,95,NULL),(235,'u.kaulfuss@gmx.de','harald@test','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-16 19:33:23',1,95,NULL),(236,'u.kaulfuss@gmx.de','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-16 19:34:16',1,95,NULL),(237,'u.kaulfuss@gmx.de','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-16 19:34:16',1,95,NULL),(238,'u.kaulfuss@gmx.de','harald@test','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-16 19:34:16',1,95,NULL),(239,'u.kaulfuss@gmx.de','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-16 19:34:36',1,95,NULL),(240,'u.kaulfuss@gmx.de','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-16 19:34:36',1,95,NULL),(241,'u.kaulfuss@gmx.de','harald@test','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-16 19:34:36',1,95,NULL),(242,'u.kaulfuss@gmx.de','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-16 20:13:32',1,95,NULL),(243,'u.kaulfuss@gmx.de','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-16 20:13:32',1,95,NULL),(244,'u.kaulfuss@gmx.de','harald@test','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-16 20:13:32',1,95,NULL),(245,'u.kaulfuss@gmx.de','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-16 20:16:28',1,95,NULL),(246,'u.kaulfuss@gmx.de','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-16 20:16:28',1,95,NULL),(247,'u.kaulfuss@gmx.de','harald@test','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-16 20:16:28',1,95,NULL),(248,'u.kaulfuss@gmx.de','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:03:45',1,95,NULL),(249,'u.kaulfuss@gmx.de','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:03:45',1,95,NULL),(250,'u.kaulfuss@gmx.de','harald@test','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:03:45',1,95,NULL),(251,'u.kaulfuss@gmx.de','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:09:37',1,95,NULL),(252,'u.kaulfuss@gmx.de','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:09:37',1,95,NULL),(253,'u.kaulfuss@gmx.de','harald@test','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:09:37',1,95,NULL),(254,'u.kaulfuss@gmx.de','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:12:10',1,95,NULL),(255,'u.kaulfuss@gmx.de','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:12:10',1,95,NULL),(256,'u.kaulfuss@gmx.de','harald@test','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:12:10',1,95,NULL),(257,'u.kaulfuss@gmx.de','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:25:04',1,95,NULL),(258,'u.kaulfuss@gmx.de','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:25:04',1,95,NULL),(259,'u.kaulfuss@gmx.de','harald@test','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:25:04',1,95,NULL),(260,'u.kaulfuss@gmx.de','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:27:04',1,95,NULL),(261,'u.kaulfuss@gmx.de','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:27:04',1,95,NULL),(262,'u.kaulfuss@gmx.de','harald@test','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:27:04',1,95,NULL),(263,'u.kaulfuss@gmx.de','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:28:45',1,95,NULL),(264,'u.kaulfuss@gmx.de','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:28:45',1,95,NULL),(265,'u.kaulfuss@gmx.de','harald@test','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:28:45',1,95,NULL),(266,'u.kaulfuss@gmx.de','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:31:43',1,95,NULL),(267,'u.kaulfuss@gmx.de','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:31:43',1,95,NULL),(268,'u.kaulfuss@gmx.de','harald@test','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:31:43',1,95,NULL),(269,'u.kaulfuss@gmx.de','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:33:08',1,95,NULL),(270,'u.kaulfuss@gmx.de','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:33:08',1,95,NULL),(271,'u.kaulfuss@gmx.de','harald@test','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:33:08',1,95,NULL),(272,'u.kaulfuss@gmx.de','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:33:38',1,95,NULL),(273,'u.kaulfuss@gmx.de','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:33:38',1,95,NULL),(274,'u.kaulfuss@gmx.de','harald@test','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:33:38',1,95,NULL),(275,'u.kaulfuss@gmx.de','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:36:00',1,95,NULL),(276,'u.kaulfuss@gmx.de','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:36:00',1,95,NULL),(277,'u.kaulfuss@gmx.de','harald@test','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:36:00',1,95,NULL),(278,'u.kaulfuss@gmx.de','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:38:18',1,95,NULL),(279,'u.kaulfuss@gmx.de','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:38:18',1,95,NULL),(280,'u.kaulfuss@gmx.de','harald@test','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:38:18',1,95,NULL),(281,'u.kaulfuss@gmx.de','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:39:41',1,95,NULL),(282,'u.kaulfuss@gmx.de','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:39:41',1,95,NULL),(283,'u.kaulfuss@gmx.de','harald@test','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:39:41',1,95,NULL),(284,'u.kaulfuss@gmx.de','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:48:33',1,95,NULL),(285,'u.kaulfuss@gmx.de','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:48:33',1,95,NULL),(286,'u.kaulfuss@gmx.de','harald@test','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 08:48:33',1,95,NULL),(287,'u.kaulfuss@gmx.de','tim','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 17:41:24',1,95,NULL),(288,'u.kaulfuss@gmx.de','larakaulfuss@datacenter.de','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 17:41:24',1,95,NULL),(289,'u.kaulfuss@gmx.de','harald@test','SESSION_ADDED','{\"targetPage\":\"ImgCollectionPage\",\"params\":{\"collectionId\":95}}','2018-04-18 17:41:24',1,95,NULL),(290,'u.kaulfuss@gmx.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":95,\"compareSessionIds\":\"262\"}}','2018-04-18 19:03:50',1,95,262),(291,'u.kaulfuss@gmx.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":95,\"compareSessionIds\":\"264\"}}','2018-04-18 19:04:45',1,95,264),(292,'u.kaulfuss@gmx.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":95,\"compareSessionIds\":\"264\"}}','2018-04-19 07:46:05',1,95,264),(293,'u.kaulfuss@gmx.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":95,\"compareSessionIds\":\"264\"}}','2018-04-19 08:30:49',1,95,264),(294,'u.kaulfuss@gmx.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":95,\"compareSessionIds\":\"274\"}}','2018-04-19 09:28:45',1,95,274),(295,'u.kaulfuss@gmx.de','u.kaulfuss@gmx.de','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":95,\"compareSessionIds\":\"264\"}}','2018-04-19 09:29:08',1,95,264),(296,'u.kaulfuss@gmx.de','tim','HAS_VOTED','{\"targetPage\":\"ContentPage\",\"params\":{\"collectionId\":101,\"compareSessionIds\":\"238\"}}','2018-04-19 09:38:52',1,101,238);
/*!40000 ALTER TABLE `tblmessages` ENABLE KEYS */;
UNLOCK TABLES;

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
  PRIMARY KEY (`sessionId`),
  KEY `collectionId_idx` (`collectionId`),
  CONSTRAINT `collectionId` FOREIGN KEY (`collectionId`) REFERENCES `tblcollections` (`collectionId`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=275 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblsessions`
--

LOCK TABLES `tblsessions` WRITE;
/*!40000 ALTER TABLE `tblsessions` DISABLE KEYS */;
INSERT INTO `tblsessions` VALUES (238,'2018-03-20 15:19:31',101,'/v/file-1521559170550.mp4','video/mp4','/t/8.jpg',720,1280,'#997572'),(239,'2018-03-21 09:23:17',103,'/v/file-1521624196239.mp4','video/mp4','/t/1.jpg',720,1280,'#2c3640'),(241,'2018-03-21 09:24:23',95,'/v/file-1521624262264.mp4','video/mp4','/t/5.jpg',720,1280,'#538785'),(242,'2018-03-21 09:24:36',96,'/v/file-1521624275568.mp4','video/mp4','/t/8.jpg',720,1280,'#8c8c8c'),(243,'2018-03-21 09:24:51',97,'/v/file-1521624290523.mp4','video/mp4','/t/7.jpg',720,1280,'#a08d87'),(246,'2018-03-21 09:27:10',102,'/v/file-1521624429587.mp4','video/mp4','/t/10.jpg',720,1280,'#8c8c8c'),(247,'2018-03-21 09:27:28',101,'/v/file-1521624447501.mp4','video/mp4','/t/9.jpg',720,1280,'#8c8c8c'),(248,'2018-03-21 10:00:26',103,'/v/file-1521626425391.mp4','video/mp4','/t/14.jpg',720,1280,'#8c8c8c'),(249,'2018-03-21 10:00:36',103,'/v/file-1521626435922.mp4','video/mp4','/t/15.jpg',720,1280,'#8c8c8c'),(250,'2018-03-21 10:00:52',103,'/v/file-1521626451901.mp4','video/mp4','/t/16.jpg',720,1280,'#8c8c8c'),(252,'2018-03-21 13:12:59',97,'/v/file-1521637973824.mp4','video/mp4','/t/file-1521637973824-thumbnail.png',1088,1920,'#8c8c8c'),(262,'2018-04-18 08:09:37',95,'/i/3524343203file-1524038928771.jpg','image/jpeg','/i/3524343203file-1524038928771.jpg',6000,4000,'#272115'),(263,'2018-04-18 08:12:10',95,'/i/3524343203file-1524039124930.jpg','image/jpeg','/i/3524343203file-1524039124930.jpg',1000,1224,'#996860'),(264,'2018-04-18 08:25:03',95,'/i/3524343203file-1524039891410.jpg','image/jpeg','/i/3524343203file-1524039891410.jpg',2902,2670,'#33343a'),(273,'2018-04-18 08:48:29',95,'/i/3524343203file-1524041306418.jpg','image/jpeg','/i/3524343203file-1524041306418.jpg',3459,5188,'#3c3843'),(274,'2018-04-18 17:41:24',95,'/i/3524343203file-1524073283516.jpg','image/jpeg','/i/3524343203file-1524073283516.jpg',871,1359,'#b2b2b2');
/*!40000 ALTER TABLE `tblsessions` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `tbltags`
--

LOCK TABLES `tbltags` WRITE;
/*!40000 ALTER TABLE `tbltags` DISABLE KEYS */;
INSERT INTO `tbltags` VALUES (11,273,'https://www.zalando.de/levisr-line-8-l8-athletic-short-jeans-shorts-l8-eve-leh21s001-a11.html','L8 ATHLETIC SHORT','https://mosaic02.ztat.net/nvg/media/catalog/LE/H2/1S/00/1A/11/LEH21S001-A11@10.jpg','://www.zal',NULL,0.5167644052,0.2966130309),(13,273,'https://www.zalando.de/levisr-line-8-l8-athletic-short-jeans-shorts-l8-eve-leh21s001-a11.html','Jeans Shorts ','https://mosaic02.ztat.net/nvg/media/catalog/LE/H2/1S/00/1A/11/LEH21S001-A11@10.jpg','://www.zal',NULL,0.5614694856,0.7943775615),(14,274,'https://www.zalando.de/levisr-line-8-l8-athletic-short-jeans-shorts-l8-eve-leh21s001-a11.html','Jeans Shorts ','https://mosaic01.ztat.net/nvg/media/catalog/LE/H2/1S/00/1A/11/LEH21S001-A11@10.jpg','Zalando',NULL,0.1151630361,0.4411733886);
/*!40000 ALTER TABLE `tbltags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbluserdevices`
--

DROP TABLE IF EXISTS `tbluserdevices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbluserdevices` (
  `userId` varchar(200) NOT NULL,
  `deviceToken` varchar(100) NOT NULL,
  `lastUpdate` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`deviceToken`),
  KEY `deviceUserId_idx` (`userId`),
  CONSTRAINT `deviceUserId` FOREIGN KEY (`userId`) REFERENCES `tblusers` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbluserdevices`
--

LOCK TABLES `tbluserdevices` WRITE;
/*!40000 ALTER TABLE `tbluserdevices` DISABLE KEYS */;
INSERT INTO `tbluserdevices` VALUES ('u.kaulfuss@gmx.de','05101b32-7f5c-4451-85bf-d954dda9162d','2018-03-16 15:59:57'),('u.kaulfuss@gmx.de','1af51c60-2f69-4760-830e-9ba7fb418adb','2018-03-21 09:40:52'),('u.kaulfuss@gmx.de','8d8d7aa3-754b-4359-97af-02c4e17ba37d','2018-03-21 19:15:20'),('u.kaulfuss@gmx.de','960485d9-6c28-42e0-882b-36b153070af2','2018-03-22 07:07:03'),('u.kaulfuss@gmx.de','da644ad2-44e2-4b58-962e-e37253d3ae08','2018-03-19 11:56:59');
/*!40000 ALTER TABLE `tbluserdevices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblusers`
--

DROP TABLE IF EXISTS `tblusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblusers` (
  `userId` varchar(200) NOT NULL,
  `userName` varchar(45) DEFAULT NULL,
  `password` varchar(300) DEFAULT NULL,
  `salt` varchar(100) DEFAULT NULL,
  `userBirthDate` date DEFAULT NULL,
  `userAvatarPath` varchar(2000) DEFAULT NULL,
  `userCreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblusers`
--

LOCK TABLES `tblusers` WRITE;
/*!40000 ALTER TABLE `tblusers` DISABLE KEYS */;
INSERT INTO `tblusers` VALUES ('harald@test','Harald','$2a$10$37E3AHu5xn8w7.K.fxiRROL6NzZ24WnpnolVU.xustBYsSdNfdHNW',NULL,'2018-03-13','/a/ayo-ogunseinde-93181-unsplash.jpg','2018-04-18 17:18:55'),('larakaulfuss@datacenter.de','Lara','$2a$10$qiLzVbezNkLpjeRw8.WhN.IeA.eePRce9AcqaJCroeorV/MPEc4q.',NULL,'1988-03-13','/a/5ef98080-2c22-11e8-9aa3-a5ad9173860a.jpg','2018-04-18 17:18:55'),('tim','Tim','$2a$10$3MRw1vGWYUV9Hg0P9cNcheCvF7qCW8uqYJiRIh8E4Eqb7/VAJ5vz.',NULL,'2016-03-02','/a/5ef98080-2c22-11e8-9aa3-a5ad9173860tim.jpeg','2018-04-18 17:18:55'),('u.kaulfuss@gmx.de','Sarah','$2a$10$qiLzVbezNkLpjeRw8.WhN.IeA.eePRce9AcqaJCroeorV/MPEc4q.',NULL,'1991-01-04','/a/sarah.jpg','2018-04-18 17:18:55'),('Uli@comfash.de','schnulli','$2a$10$z.AwaqXBtpTuTprkmT10vu1xHFSrkYnu1bMREt9PA9d4kQw6uNQfG',NULL,'0000-00-00',NULL,'2018-04-18 17:18:55');
/*!40000 ALTER TABLE `tblusers` ENABLE KEYS */;
UNLOCK TABLES;

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
  `userId` varchar(200) NOT NULL,
  PRIMARY KEY (`sessionId`,`userId`),
  KEY `voteSessionId_idx` (`sessionId`),
  KEY `voteUserId_idx` (`userId`),
  CONSTRAINT `voteSessionId` FOREIGN KEY (`sessionId`) REFERENCES `tblsessions` (`sessionId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `voteUserId` FOREIGN KEY (`userId`) REFERENCES `tblusers` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblvotes`
--

LOCK TABLES `tblvotes` WRITE;
/*!40000 ALTER TABLE `tblvotes` DISABLE KEYS */;
INSERT INTO `tblvotes` VALUES (238,-50,'2018-04-19 09:38:52','u.kaulfuss@gmx.de'),(241,75,'2018-04-16 11:11:25','u.kaulfuss@gmx.de'),(246,25,'2018-04-16 11:27:11','u.kaulfuss@gmx.de'),(262,75,'2018-04-18 19:03:50','u.kaulfuss@gmx.de'),(264,100,'2018-04-19 08:00:09','tim'),(264,-50,'2018-04-19 09:29:08','u.kaulfuss@gmx.de'),(274,100,'2018-04-19 09:28:45','u.kaulfuss@gmx.de');
/*!40000 ALTER TABLE `tblvotes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-19 13:46:59
