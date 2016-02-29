-- MySQL dump 10.13  Distrib 5.5.44, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: frasesWeb
-- ------------------------------------------------------
-- Server version	5.5.44-0ubuntu0.14.04.1

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
-- Table structure for table `discusion`
--

DROP TABLE IF EXISTS `discusion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `discusion` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `tema` varchar(45) COLLATE utf8_spanish_ci NOT NULL,
  `descripcion` varchar(200) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discusion`
--

LOCK TABLES `discusion` WRITE;
/*!40000 ALTER TABLE `discusion` DISABLE KEYS */;
/*!40000 ALTER TABLE `discusion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `frase`
--

DROP TABLE IF EXISTS `frase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `frase` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `contenido` varchar(200) COLLATE utf8_spanish_ci NOT NULL,
  `autor` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  `seudonimo` char(1) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`codigo`),
  KEY `autor` (`autor`),
  CONSTRAINT `frase_ibfk_1` FOREIGN KEY (`autor`) REFERENCES `usuario` (`nombreUsu`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `frase`
--

LOCK TABLES `frase` WRITE;
/*!40000 ALTER TABLE `frase` DISABLE KEYS */;
INSERT INTO `frase` VALUES (1,'victor','victor','0'),(2,'Frase 2','victor','0'),(3,'mas frases','victor','0'),(4,'necesito mas frases','victor','0'),(5,'anaPuentes','AnaPuentes','0'),(6,'veronica','veronica','0');
/*!40000 ALTER TABLE `frase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `integrante`
--

DROP TABLE IF EXISTS `integrante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `integrante` (
  `codigoDis` int(11) NOT NULL,
  `usuario` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  `rol` int(11) NOT NULL,
  PRIMARY KEY (`codigoDis`,`usuario`),
  KEY `usuario` (`usuario`),
  CONSTRAINT `integrante_ibfk_1` FOREIGN KEY (`codigoDis`) REFERENCES `discusion` (`codigo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `integrante_ibfk_2` FOREIGN KEY (`usuario`) REFERENCES `usuario` (`nombreUsu`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `integrante`
--

LOCK TABLES `integrante` WRITE;
/*!40000 ALTER TABLE `integrante` DISABLE KEYS */;
/*!40000 ALTER TABLE `integrante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensaje`
--

DROP TABLE IF EXISTS `mensaje`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mensaje` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `contenido` varchar(200) COLLATE utf8_spanish_ci NOT NULL,
  `emisor` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  `estado` varchar(10) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'E',
  `fecha` datetime DEFAULT NULL,
  PRIMARY KEY (`codigo`),
  KEY `emisor` (`emisor`),
  CONSTRAINT `mensaje_ibfk_1` FOREIGN KEY (`emisor`) REFERENCES `usuario` (`nombreUsu`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensaje`
--

LOCK TABLES `mensaje` WRITE;
/*!40000 ALTER TABLE `mensaje` DISABLE KEYS */;
INSERT INTO `mensaje` VALUES (12,'Victor','veronica','E','2016-02-29 01:53:33'),(13,'digame','victor','E','2016-02-29 01:54:11'),(14,'Todo fino?','veronica','E','2016-02-29 01:56:07'),(15,'alpelo','victor','E','2016-02-29 01:56:20'),(16,'hablame','victor','E','2016-02-29 02:45:24'),(17,'Todo fino','veronica','E','2016-02-29 02:45:42'),(18,'no llgan o si\n','victor','E','2016-02-29 02:46:09'),(19,'Mira si llegan','veronica','E','2016-02-29 02:46:22'),(20,'Llegan?','veronica','E','2016-02-29 02:52:33'),(21,'si llgan','victor','E','2016-02-29 02:54:45'),(22,'claro que llegan','victor','E','2016-02-29 02:56:10'),(23,'Pos claro','veronica','E','2016-02-29 02:56:22'),(24,'estoy prbando\n','victor','E','2016-02-29 02:56:49'),(25,'Aquí igual','veronica','E','2016-02-29 02:56:56');
/*!40000 ALTER TABLE `mensaje` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receptordis`
--

DROP TABLE IF EXISTS `receptordis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `receptordis` (
  `codigoMen` int(11) NOT NULL,
  `codigoDis` int(11) NOT NULL,
  PRIMARY KEY (`codigoMen`,`codigoDis`),
  KEY `codigoDis` (`codigoDis`),
  CONSTRAINT `receptordis_ibfk_1` FOREIGN KEY (`codigoDis`) REFERENCES `discusion` (`codigo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `receptordis_ibfk_2` FOREIGN KEY (`codigoMen`) REFERENCES `mensaje` (`codigo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receptordis`
--

LOCK TABLES `receptordis` WRITE;
/*!40000 ALTER TABLE `receptordis` DISABLE KEYS */;
/*!40000 ALTER TABLE `receptordis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receptorusu`
--

DROP TABLE IF EXISTS `receptorusu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `receptorusu` (
  `codigoMen` int(11) NOT NULL,
  `usuario` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`codigoMen`,`usuario`),
  KEY `usuario` (`usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receptorusu`
--

LOCK TABLES `receptorusu` WRITE;
/*!40000 ALTER TABLE `receptorusu` DISABLE KEYS */;
INSERT INTO `receptorusu` VALUES (13,'veronica'),(15,'veronica'),(16,'veronica'),(18,'veronica'),(21,'veronica'),(22,'veronica'),(24,'veronica'),(12,'victor'),(14,'victor'),(17,'victor'),(19,'victor'),(20,'victor'),(23,'victor'),(25,'victor');
/*!40000 ALTER TABLE `receptorusu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sigue`
--

DROP TABLE IF EXISTS `sigue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sigue` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `seguidor` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  `seguido` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`codigo`),
  KEY `seguidor` (`seguidor`),
  KEY `seguido` (`seguido`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sigue`
--

LOCK TABLES `sigue` WRITE;
/*!40000 ALTER TABLE `sigue` DISABLE KEYS */;
INSERT INTO `sigue` VALUES (2,'veronica','victor'),(5,'victor','AnaPuentes'),(6,'AnaPuentes','veronica');
/*!40000 ALTER TABLE `sigue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario` (
  `nombreUsu` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  `nombre` varchar(45) COLLATE utf8_spanish_ci NOT NULL,
  `apellido` varchar(45) COLLATE utf8_spanish_ci NOT NULL,
  `email` varchar(60) COLLATE utf8_spanish_ci NOT NULL,
  `clave_usu` varchar(40) COLLATE utf8_spanish_ci NOT NULL,
  `seudonimo` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  PRIMARY KEY (`nombreUsu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES ('AnaPuentes','Ana','Puentes','','fb3ee9f2180c3c3f7a9236923f678715ba6e013b',''),('veronica','Veronica','Escobar','','dc8bb0f295ba8ccda25786244ca989e3301edfda',''),('victor','victor','leon','xonirv@gmail.com','fbd10d99594e8e66aa2b946a035cadc1ace7ba65','VRhino');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-02-28 22:38:57
