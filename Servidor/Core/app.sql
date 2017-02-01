-- MySQL dump 10.11
--
-- Host: localhost    Database: frasesWeb
-- ------------------------------------------------------
-- Server version	5.0.51b-community-nt-log

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
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `discusion` (
  `codigo` int(11) NOT NULL auto_increment,
  `tema` varchar(45) collate utf8_spanish_ci NOT NULL,
  `descripcion` varchar(200) collate utf8_spanish_ci NOT NULL,
  PRIMARY KEY  (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
SET character_set_client = @saved_cs_client;

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
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `frase` (
  `codigo` int(11) NOT NULL auto_increment,
  `contenido` varchar(200) collate utf8_spanish_ci NOT NULL,
  `autor` varchar(20) collate utf8_spanish_ci NOT NULL,
  `seudonimo` char(1) collate utf8_spanish_ci NOT NULL,
  PRIMARY KEY  (`codigo`),
  KEY `autor` (`autor`),
  CONSTRAINT `frase_ibfk_1` FOREIGN KEY (`autor`) REFERENCES `usuario` (`nombreusu`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `frase`
--

LOCK TABLES `frase` WRITE;
/*!40000 ALTER TABLE `frase` DISABLE KEYS */;
INSERT INTO `frase` VALUES (1,'victor','VICTOR','0'),(2,'Frase 2','VICTOR','0'),(3,'mas frases','VICTOR','0'),(4,'necesito mas frases','VICTOR','0'),(5,'anaPuentes','ANAPUENTES','0'),(6,'veronica','VERONICA','0');
/*!40000 ALTER TABLE `frase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `integrante`
--

DROP TABLE IF EXISTS `integrante`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `integrante` (
  `codigoDis` int(11) NOT NULL,
  `usuario` varchar(20) collate utf8_spanish_ci NOT NULL,
  `rol` int(11) NOT NULL,
  PRIMARY KEY  (`codigoDis`,`usuario`),
  KEY `usuario` (`usuario`),
  CONSTRAINT `integrante_ibfk_1` FOREIGN KEY (`codigoDis`) REFERENCES `discusion` (`codigo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `integrante_ibfk_2` FOREIGN KEY (`usuario`) REFERENCES `usuario` (`nombreusu`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
SET character_set_client = @saved_cs_client;

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
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `mensaje` (
  `codigo` int(11) NOT NULL auto_increment,
  `contenido` varchar(200) collate utf8_spanish_ci NOT NULL,
  `emisor` varchar(20) collate utf8_spanish_ci NOT NULL,
  `estado` varchar(10) collate utf8_spanish_ci NOT NULL default 'E',
  `fecha` datetime default NULL,
  `idtemp` varchar(5) collate utf8_spanish_ci default NULL,
  PRIMARY KEY  (`codigo`),
  KEY `emisor` (`emisor`),
  CONSTRAINT `mensaje_ibfk_1` FOREIGN KEY (`emisor`) REFERENCES `usuario` (`nombreusu`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `mensaje`
--

LOCK TABLES `mensaje` WRITE;
/*!40000 ALTER TABLE `mensaje` DISABLE KEYS */;
/*!40000 ALTER TABLE `mensaje` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receptordis`
--

DROP TABLE IF EXISTS `receptordis`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `receptordis` (
  `codigoMen` int(11) NOT NULL,
  `codigoDis` int(11) NOT NULL,
  PRIMARY KEY  (`codigoMen`,`codigoDis`),
  KEY `codigoDis` (`codigoDis`),
  CONSTRAINT `receptordis_ibfk_1` FOREIGN KEY (`codigoDis`) REFERENCES `discusion` (`codigo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `receptordis_ibfk_2` FOREIGN KEY (`codigoMen`) REFERENCES `mensaje` (`codigo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
SET character_set_client = @saved_cs_client;

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
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `receptorusu` (
  `codigoMen` int(11) NOT NULL,
  `usuario` varchar(20) collate utf8_spanish_ci NOT NULL,
  PRIMARY KEY  (`codigoMen`,`usuario`),
  KEY `usuario` (`usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `receptorusu`
--

LOCK TABLES `receptorusu` WRITE;
/*!40000 ALTER TABLE `receptorusu` DISABLE KEYS */;
/*!40000 ALTER TABLE `receptorusu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sigue`
--

DROP TABLE IF EXISTS `sigue`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `sigue` (
  `codigo` int(11) NOT NULL auto_increment,
  `seguidor` varchar(20) collate utf8_spanish_ci NOT NULL,
  `seguido` varchar(20) collate utf8_spanish_ci NOT NULL,
  PRIMARY KEY  (`codigo`),
  KEY `seguidor` (`seguidor`),
  KEY `seguido` (`seguido`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `sigue`
--

LOCK TABLES `sigue` WRITE;
/*!40000 ALTER TABLE `sigue` DISABLE KEYS */;
INSERT INTO `sigue` VALUES (14,'ANAPUENTES','VERONICA'),(15,'VERONICA','ARKANTHOS'),(16,'VERONICA','VICTOR');
/*!40000 ALTER TABLE `sigue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `usuario` (
  `nombreusu` varchar(20) collate utf8_spanish_ci NOT NULL,
  `nombre` varchar(45) collate utf8_spanish_ci NOT NULL,
  `apellido` varchar(45) collate utf8_spanish_ci NOT NULL,
  `email` varchar(60) collate utf8_spanish_ci NOT NULL,
  `clave_usu` varchar(40) collate utf8_spanish_ci NOT NULL,
  `seudonimo` varchar(20) collate utf8_spanish_ci NOT NULL,
  PRIMARY KEY  (`nombreusu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES ('ANAPUENTES','Ana','Puentes','','fb3ee9f2180c3c3f7a9236923f678715ba6e013b',''),('ARKANTHOS','','','','54a3f75708b9e70f10e74bf28455a36f1f8be0d8',''),('VERONICA','Veronica','Escobar','','2d6c02f9c144fec34f0a543ba9cf85387eb01f4c',''),('VICTOR','victor','leon','xonirv@gmail.com','f13a1a6f29d3609f98ea6844b3943c94f6e9de95','VRhino');
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

-- Dump completed on 2016-11-08 22:59:32
