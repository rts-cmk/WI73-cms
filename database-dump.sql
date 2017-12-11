CREATE DATABASE  IF NOT EXISTS `demo-cms` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_danish_ci */;
USE `demo-cms`;

CREATE USER IF NOT EXISTS 'wwwuser'@'localhost' IDENTIFIED BY 'wwwuser';
GRANT SELECT, INSERT, UPDATE, DELETE ON `demo-cms`.* TO 'wwwuser'@'localhost';

-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: ubu-dev    Database: demo-cms
-- ------------------------------------------------------
-- Server version	5.7.18-0ubuntu0.16.10.1

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
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(255) COLLATE utf8_danish_ci NOT NULL DEFAULT '---',
  `content` text COLLATE utf8_danish_ci,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_danish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articles`
--

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT INTO `articles` VALUES (1,1,'Vejret','<p>Tja, ved ikke rigtig....</p>','2017-07-30 18:27:47'),(2,2,'Minister går amok','<p>Minister går amok, bider mikrofonledningen over da han får et kritisk spørgsmål</p>','2017-07-30 18:27:47'),(3,3,'Tjenester','<p>Vi yder en uovertruffen tjeneste mod en beskeden betaling</p>','2017-07-30 18:27:47'),(4,4,'Hvem er vi','<p>Vi er en virksomhed der lige fra starten af har lagt os i førerfeltet.</p>\n<p>Det hele startede med at NN (vores grundlægger) havde en idé om at det måtte kunne gøres på en nemmere måde.</p>\n<p>Med denne grundtanke gik han i gang med at etablere en virksomhed.</p>','2017-07-30 18:27:47'),(5,4,'Leverandør til mange virksomheder og institutioner','<p>Vi har lige fra starten leveret totalløsninger af meget høj kvalitet til en lang række virksomheder, både private og offentlige</p>\n<ul style=\"padding-left: 28px;\">\n	<li>AAAAA</li>\n	<li>BBBBB</li>\n	<li>CCCCC</li>\n	<li>DDDDD</li>\n	<li>EEEEEE</li>\n</ul>\nog mange flere','2017-07-30 18:27:47'),(7,1,'Nederlag for Trump, igen - igen - igen','<p>Det lykkedes heller ikke denne gang for USA\'s præsident at samle flertal for at afskaffe \'Obamacare\'</p>','2017-07-30 18:27:47');
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `menu` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8_danish_ci NOT NULL DEFAULT '',
  `description` varchar(255) COLLATE utf8_danish_ci DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `position` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_danish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (1,'Hjem',NULL,'2017-07-28 07:08:26',1),(2,'Nyheder',NULL,'2017-07-28 07:08:41',2),(3,'Tjenester',NULL,'2017-07-28 07:09:04',3),(4,'Om os',NULL,'2017-07-28 07:09:43',5),(5,'Kontakt',NULL,'2017-07-28 07:09:50',4);
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_sessions`
--

DROP TABLE IF EXISTS `user_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_sessions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `session_key` varchar(128) COLLATE utf8_danish_ci NOT NULL DEFAULT '',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_key_UNIQUE` (`session_key`),
  KEY `fk_user_id_session_idx` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8 COLLATE=utf8_danish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sessions`
--

LOCK TABLES `user_sessions` WRITE;
/*!40000 ALTER TABLE `user_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8_danish_ci NOT NULL,
  `password` varchar(128) COLLATE utf8_danish_ci NOT NULL,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `salt` varchar(128) COLLATE utf8_danish_ci NOT NULL DEFAULT '1',
  `img` varchar(24) COLLATE utf8_danish_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_danish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin','2017-08-23 10:19:44','salt','N/A'),(9,'test','74a5e2d93ce660ceb745dbb3306f0cb4','2017-09-11 19:43:10','1505462583687%pq7U7ue02vh8v9rQmd00jfa15i7G38b0dbmGzy0B9ziDhmwA','N/A'),(10,'qqq','b2ca678b4c936f905fb82f2733f5297f','2017-10-08 12:54:39','1',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'demo-cms'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-11-03  8:37:47
