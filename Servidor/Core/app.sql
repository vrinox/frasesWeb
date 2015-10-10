-- phpMyAdmin SQL Dump
-- version 2.10.3
-- http://www.phpmyadmin.net
-- 
-- Servidor: localhost
-- Tiempo de generación: 25-09-2015 a las 20:24:46
-- Versión del servidor: 5.0.51
-- Versión de PHP: 5.2.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

-- 
-- Base de datos: `frasesweb`
-- 
CREATE DATABASE `frasesWeb` DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish_ci;
USE `frasesWeb`;

-- --------------------------------------------------------

-- 
-- Estructura de tabla para la tabla `discusion`
-- 

CREATE TABLE `discusion` (
  `codigo` int(11) NOT NULL auto_increment,
  `tema` varchar(45) collate utf8_spanish_ci NOT NULL,
  `descripcion` varchar(200) collate utf8_spanish_ci NOT NULL,
  PRIMARY KEY  (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci AUTO_INCREMENT=1 ;

-- 
-- Volcar la base de datos para la tabla `discusion`
-- 


-- --------------------------------------------------------

-- 
-- Estructura de tabla para la tabla `frase`
-- 

CREATE TABLE `frase` (
  `codigo` int(11) NOT NULL auto_increment,
  `contenido` varchar(200) collate utf8_spanish_ci NOT NULL,
  `autor` varchar(20) collate utf8_spanish_ci NOT NULL,
  `seudonimo` char(1) collate utf8_spanish_ci NOT NULL,
  PRIMARY KEY  (`codigo`),
  KEY `autor` (`autor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci AUTO_INCREMENT=1 ;

-- 
-- Volcar la base de datos para la tabla `frase`
-- 


-- --------------------------------------------------------

-- 
-- Estructura de tabla para la tabla `integrante`
-- 

CREATE TABLE `integrante` (
  `codigoDis` int(11) NOT NULL,
  `usuario` varchar(20) collate utf8_spanish_ci NOT NULL,
  `rol` int(11) NOT NULL,
  PRIMARY KEY  (`codigoDis`,`usuario`),
  KEY `usuario` (`usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- 
-- Volcar la base de datos para la tabla `integrante`
-- 


-- --------------------------------------------------------

-- 
-- Estructura de tabla para la tabla `mensaje`
-- 

CREATE TABLE `mensaje` (
  `codigo` int(11) NOT NULL auto_increment,
  `contenido` varchar(200) collate utf8_spanish_ci NOT NULL,
  `emisor` varchar(20) collate utf8_spanish_ci NOT NULL,
  PRIMARY KEY  (`codigo`),
  KEY `emisor` (`emisor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci AUTO_INCREMENT=1 ;

-- 
-- Volcar la base de datos para la tabla `mensaje`
-- 


-- --------------------------------------------------------

-- 
-- Estructura de tabla para la tabla `receptordis`
-- 

CREATE TABLE `receptordis` (
  `codigoMen` int(11) NOT NULL,
  `codigoDis` int(11) NOT NULL,
  PRIMARY KEY  (`codigoMen`,`codigoDis`),
  KEY `codigoDis` (`codigoDis`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- 
-- Volcar la base de datos para la tabla `receptordis`
-- 


-- --------------------------------------------------------

-- 
-- Estructura de tabla para la tabla `receptorusu`
-- 

CREATE TABLE `receptorusu` (
  `codigoMen` int(11) NOT NULL,
  `usuario` varchar(20) collate utf8_spanish_ci NOT NULL,
  PRIMARY KEY  (`codigoMen`,`usuario`),
  KEY `usuario` (`usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- 
-- Volcar la base de datos para la tabla `receptorusu`
-- 


-- --------------------------------------------------------

-- 
-- Estructura de tabla para la tabla `sigue`
-- 

CREATE TABLE `sigue` (
  `codigo` int(11) NOT NULL auto_increment,
  `seguidor` varchar(20) collate utf8_spanish_ci NOT NULL,
  `seguido` varchar(20) collate utf8_spanish_ci NOT NULL,
  PRIMARY KEY  (`codigo`),
  KEY `seguidor` (`seguidor`),
  KEY `seguido` (`seguido`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci AUTO_INCREMENT=1 ;

-- 
-- Volcar la base de datos para la tabla `sigue`
-- 


-- --------------------------------------------------------

-- 
-- Estructura de tabla para la tabla `usuario`
-- 

CREATE TABLE `usuario` (
  `nombreUsu` varchar(20) collate utf8_spanish_ci NOT NULL,
  `nombre` varchar(45) collate utf8_spanish_ci NOT NULL,
  `apellido` varchar(45) collate utf8_spanish_ci NOT NULL,
  `email` varchar(60) collate utf8_spanish_ci NOT NULL,
  `clave_usu` varchar(40) collate utf8_spanish_ci NOT NULL,
  `seudonimo` varchar(20) collate utf8_spanish_ci NOT NULL,
  PRIMARY KEY  (`nombreUsu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- 
-- Volcar la base de datos para la tabla `usuario`
-- 


-- 
-- Filtros para las tablas descargadas (dump)
-- 

-- 
-- Filtros para la tabla `frase`
-- 
ALTER TABLE `frase`
  ADD CONSTRAINT `frase_ibfk_1` FOREIGN KEY (`autor`) REFERENCES `usuario` (`nombreUsu`) ON DELETE CASCADE ON UPDATE CASCADE;

-- 
-- Filtros para la tabla `integrante`
-- 
ALTER TABLE `integrante`
  ADD CONSTRAINT `integrante_ibfk_2` FOREIGN KEY (`usuario`) REFERENCES `usuario` (`nombreUsu`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `integrante_ibfk_1` FOREIGN KEY (`codigoDis`) REFERENCES `discusion` (`codigo`) ON DELETE CASCADE ON UPDATE CASCADE;

-- 
-- Filtros para la tabla `mensaje`
-- 
ALTER TABLE `mensaje`
  ADD CONSTRAINT `mensaje_ibfk_1` FOREIGN KEY (`emisor`) REFERENCES `usuario` (`nombreUsu`) ON DELETE CASCADE ON UPDATE CASCADE;

-- 
-- Filtros para la tabla `receptordis`
-- 
ALTER TABLE `receptordis`
  ADD CONSTRAINT `receptordis_ibfk_1` FOREIGN KEY (`codigoDis`) REFERENCES `discusion` (`codigo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `receptordis_ibfk_2` FOREIGN KEY (`codigoMen`) REFERENCES `mensaje` (`codigo`) ON DELETE CASCADE ON UPDATE CASCADE;

-- 
-- Filtros para la tabla `receptorusu`
-- 
ALTER TABLE `receptorusu`
  ADD CONSTRAINT `receptorusu_ibfk_1` FOREIGN KEY (`usuario`) REFERENCES `usuario` (`nombreUsu`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `receptorusu_ibfk_1` FOREIGN KEY (`codigoMen`) REFERENCES `mensaje` (`codigo`) ON DELETE CASCADE ON UPDATE CASCADE;

-- 
-- Filtros para la tabla `sigue`
-- 
ALTER TABLE `sigue`
  ADD CONSTRAINT `sigue_ibfk_2` FOREIGN KEY (`seguido`) REFERENCES `usuario` (`nombreUsu`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sigue_ibfk_1` FOREIGN KEY (`seguidor`) REFERENCES `usuario` (`nombreUsu`) ON DELETE CASCADE ON UPDATE CASCADE;
