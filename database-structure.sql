-- phpMyAdmin SQL Dump
-- version 4.9.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Mar 25, 2020 at 03:09 PM
-- Server version: 5.7.26
-- PHP Version: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `alienator`
--

-- --------------------------------------------------------

--
-- Table structure for table `aliens`
--

CREATE TABLE `aliens` (
  `id` int(10) UNSIGNED NOT NULL,
  `body` tinyint(3) UNSIGNED NOT NULL,
  `head` tinyint(3) UNSIGNED NOT NULL,
  `color` int(10) UNSIGNED NOT NULL,
  `trait1` tinytext COLLATE utf8_unicode_ci,
  `trait2` tinytext COLLATE utf8_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `eyes`
--

CREATE TABLE `eyes` (
  `id` int(10) UNSIGNED NOT NULL,
  `alienID` int(10) UNSIGNED NOT NULL,
  `type` tinyint(3) UNSIGNED NOT NULL,
  `x` smallint(255) NOT NULL,
  `y` smallint(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aliens`
--
ALTER TABLE `aliens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `eyes`
--
ALTER TABLE `eyes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alienID` (`alienID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aliens`
--
ALTER TABLE `aliens`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `eyes`
--
ALTER TABLE `eyes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `eyes`
--
ALTER TABLE `eyes`
  ADD CONSTRAINT `eyes_ibfk_1` FOREIGN KEY (`alienID`) REFERENCES `aliens` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
