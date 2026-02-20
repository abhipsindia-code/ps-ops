-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Feb 17, 2026 at 10:57 AM
-- Server version: 8.4.7
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ps_ops`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` char(36) NOT NULL,
  `code` varchar(50) NOT NULL,
  `contact_id` char(36) NOT NULL,
  `company_id` char(36) DEFAULT NULL,
  `client_name` varchar(100) DEFAULT NULL,
  `client_type` varchar(30) DEFAULT NULL,
  `service_type` varchar(50) DEFAULT NULL,
  `sub_services` json DEFAULT NULL,
  `notes` text,
  `created_by_user_id` char(36) DEFAULT NULL,
  `status` enum('ACTIVE','CLOSED','CANCELED') DEFAULT 'ACTIVE',
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `code`, `contact_id`, `company_id`, `client_name`, `client_type`, `service_type`, `sub_services`, `notes`, `created_by_user_id`, `status`, `created_at`) VALUES
('060ceade-6cf7-44fe-baae-03a3321b4bf1', 'B-1771138563039', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ACTIVE', '2026-02-15 12:26:03'),
('10bc1469-6576-4ff8-9554-78cf355a4ca4', 'B-1771075895034', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ACTIVE', '2026-02-14 19:01:35'),
('7e0dddad-f6c8-49ca-adc5-5a85ce6c3559', 'B-1767093598262', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ACTIVE', '2025-12-30 16:49:58'),
('83e8f2c5-2dbf-43a8-b5f3-1570c40a63eb', 'B-1771076192239', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ACTIVE', '2026-02-14 19:06:32'),
('c10a6a10-e9af-4de4-8f0b-d2dafd36168d', 'B-1771075935104', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ACTIVE', '2026-02-14 19:02:15'),
('c5f37792-5f18-441e-94e5-7725e00b9aff', 'B-1767094144848', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ACTIVE', '2025-12-30 16:59:04'),
('e6858240-47f5-4af1-bfec-eb3f7a90511b', 'B-1771138298995', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ACTIVE', '2026-02-15 12:21:38'),
('f49ad4ab-b69a-4a7d-8c0b-d56bf9ad50c3', 'B-1770891441550', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ACTIVE', '2026-02-12 15:47:21'),
('test-booking-1', 'B-TEST-001', '', NULL, 'Test Client', 'Individual', 'Pest', NULL, NULL, NULL, 'ACTIVE', '2025-12-23 08:10:05');

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` char(36) NOT NULL,
  `code` varchar(10) NOT NULL,
  `type` enum('INDIVIDUAL','CORPORATE','RWA') NOT NULL,
  `address` text,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `gst_number` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Name` varchar(2550) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `code`, `type`, `address`, `city`, `state`, `gst_number`, `is_active`, `created_at`, `updated_at`, `Name`) VALUES
('8ed2e5c8-e53c-11f0-be37-06f610c6dc38', 'BRI', 'CORPORATE', 'Brigade Gateway, Malleshwaram', 'Bangalore', 'Karnataka', '29AABCB1234C1Z9', 1, '2025-12-30 10:31:10', '2026-02-16 13:17:01', 'Brigade'),
('8ed2fb46-e53c-11f0-be37-06f610c6dc38', 'PRG', 'CORPORATE', 'Prestige Tech Park, Bellandur', 'Bangalore', 'Karnataka', '29AABCP5678D1Z2', 1, '2025-12-30 10:31:10', '2026-02-16 13:19:14', 'Prestige'),
('8ed2fd1c-e53c-11f0-be37-06f610c6dc38', 'SPC', 'RWA', 'Sobha Palm Court, Thanisandra', 'Bangalore', 'Karnataka', NULL, 1, '2025-12-30 10:31:10', '2026-02-16 13:19:14', 'Sobha Palm Court');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` char(36) NOT NULL,
  `company_id` char(36) DEFAULT NULL COMMENT 'NULL for individual customers, FK for company SPOCs',
  `name` varchar(150) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `company_id`, `name`, `phone`, `email`, `role`, `is_primary`, `is_verified`, `created_at`, `updated_at`) VALUES
('3604ca71-e53d-11f0-be37-06f610c6dc38', NULL, 'Suresh Rao', '9988776655', NULL, 'Owner', 1, 1, '2025-12-30 10:35:51', '2025-12-30 10:35:51'),
('3604ced7-e53d-11f0-be37-06f610c6dc38', NULL, 'Meena Iyer', '9877001122', NULL, 'Tenant', 1, 0, '2025-12-30 10:35:51', '2025-12-30 10:35:51'),
('9cbe0765-e53c-11f0-be37-06f610c6dc38', '8ed2e5c8-e53c-11f0-be37-06f610c6dc38', 'Ramesh Kumar', '9876543210', 'ramesh.kumar@brigade.com', 'Facility Manager', 1, 1, '2025-12-30 10:31:33', '2025-12-30 10:31:33'),
('9cbe13b5-e53c-11f0-be37-06f610c6dc38', '8ed2e5c8-e53c-11f0-be37-06f610c6dc38', 'Sneha Iyer', '9123456789', 'sneha.iyer@brigade.com', 'Admin SPOC', 0, 1, '2025-12-30 10:31:33', '2025-12-30 10:31:33'),
('abb7963d-e53c-11f0-be37-06f610c6dc38', '8ed2fb46-e53c-11f0-be37-06f610c6dc38', 'Anita Sharma', '9000012345', 'anita.sharma@prestige.com', 'Operations Lead', 1, 1, '2025-12-30 10:31:59', '2025-12-30 10:31:59'),
('abb8fb96-e53c-11f0-be37-06f610c6dc38', '8ed2fd1c-e53c-11f0-be37-06f610c6dc38', 'Mahesh Rao', '9887766554', 'mahesh.rao@spcrwa.in', 'RWA Secretary', 1, 1, '2025-12-30 10:31:59', '2025-12-30 10:31:59'),
('bec2239e-e53c-11f0-be37-06f610c6dc38', '8ed2e5c8-e53c-11f0-be37-06f610c6dc38', 'Ramesh Kumar', '9876543210', 'ramesh.kumar@brigade.com', 'Facility Manager', 1, 1, '2025-12-30 10:32:30', '2025-12-30 10:32:30'),
('bec22a0d-e53c-11f0-be37-06f610c6dc38', '8ed2e5c8-e53c-11f0-be37-06f610c6dc38', 'Sneha Iyer', '9123456789', 'sneha.iyer@brigade.com', 'Admin SPOC', 0, 1, '2025-12-30 10:32:30', '2025-12-30 10:32:30'),
('c26aeeb2-e53c-11f0-be37-06f610c6dc38', '8ed2fb46-e53c-11f0-be37-06f610c6dc38', 'Anita Sharma', '9000012345', 'anita.sharma@prestige.com', 'Operations Lead', 1, 1, '2025-12-30 10:32:37', '2025-12-30 10:32:37'),
('d43b0ed2-e53c-11f0-be37-06f610c6dc38', '8ed2fd1c-e53c-11f0-be37-06f610c6dc38', 'Mahesh Rao', '9887766554', 'mahesh.rao@spcrwa.in', 'RWA Secretary', 1, 1, '2025-12-30 10:33:06', '2025-12-30 10:33:06');

-- --------------------------------------------------------

--
-- Table structure for table `email_otps`
--

CREATE TABLE `email_otps` (
  `id` bigint NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp_code` varchar(10) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `email_otps`
--

INSERT INTO `email_otps` (`id`, `email`, `otp_code`, `expires_at`, `created_at`) VALUES
(1, 'abhipsindia@gmail.com', '550440', '2026-02-06 13:32:55', '2026-02-06 13:22:55'),
(2, 'abhipsindia@gmail.com', '979121', '2026-02-06 13:33:19', '2026-02-06 13:23:19'),
(3, 'abhipsindia@gmail.com', '996659', '2026-02-06 13:34:14', '2026-02-06 13:24:14'),
(4, 'abhipsindia@gmail.com', '260643', '2026-02-06 13:36:43', '2026-02-06 13:26:42'),
(5, 'Testuser1@ps-ops.com', '673575', '2026-02-09 14:56:03', '2026-02-09 14:46:03'),
(6, 'Testuser1@ps-ops.com', '604432', '2026-02-09 14:56:05', '2026-02-09 14:46:04'),
(7, 'test1@psops.com', '237544', '2026-02-09 14:56:30', '2026-02-09 14:46:30'),
(8, 'testuser3@psops.com', '248755', '2026-02-09 15:01:04', '2026-02-09 14:51:03'),
(9, 'min@psops.com', '368753', '2026-02-09 15:01:44', '2026-02-09 14:51:44'),
(10, 'adin@psops.com', '171399', '2026-02-09 15:02:50', '2026-02-09 14:52:50'),
(11, 'test1@psops.com', '179894', '2026-02-11 06:02:18', '2026-02-11 05:52:18'),
(12, 'test3@gtest.com', '798698', '2026-02-11 08:16:54', '2026-02-11 08:06:53'),
(13, 'test111n@psops.com', '806305', '2026-02-11 08:35:20', '2026-02-11 08:25:20'),
(14, 'adm23@psops.com', '234160', '2026-02-11 08:36:14', '2026-02-11 08:26:14'),
(15, 'aqwewdmin@psops.com', '200184', '2026-02-11 08:41:32', '2026-02-11 08:31:31'),
(16, 'testoingmin@psops.com', '654177', '2026-02-11 08:51:35', '2026-02-11 08:41:34'),
(17, 'admiweewqqn@psops.com', '900508', '2026-02-11 08:55:07', '2026-02-11 08:45:06'),
(18, 'attt111dmin@psops.com', '115776', '2026-02-11 08:55:50', '2026-02-11 08:45:50'),
(19, 'adadmwewein@psops.com', '319500', '2026-02-11 09:06:11', '2026-02-11 08:56:11'),
(20, 'test@abhi1.com', '778372', '2026-02-11 09:07:02', '2026-02-11 08:57:01'),
(21, 'Testuseer1@psops.com', '571569', '2026-02-11 09:11:54', '2026-02-11 09:01:54'),
(22, 'adtest1min@psops.com', '710557', '2026-02-11 09:13:03', '2026-02-11 09:03:03');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` char(36) NOT NULL,
  `code` varchar(50) NOT NULL,
  `booking_id` char(36) DEFAULT NULL,
  `service_type` varchar(50) NOT NULL,
  `sub_service` varchar(100) NOT NULL,
  `status` enum('CREATED','NOT_STARTED','IN_PROGRESS','PAUSED','COMPLETED','CANCELED') NOT NULL DEFAULT 'CREATED',
  `priority` enum('LOW','MEDIUM','HIGH','CRITICAL') NOT NULL DEFAULT 'MEDIUM',
  `supervisor_id` int DEFAULT NULL,
  `assigned_at` datetime DEFAULT NULL,
  `team` json DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `sla_minutes` int DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `notes` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `requested_by_type` enum('USER','CONTACT') DEFAULT NULL,
  `requested_by_id` char(36) DEFAULT NULL,
  `requested_by_contact_id` char(36) NOT NULL,
  `created_by_user_id` char(36) NOT NULL,
  `approval_status` enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
  `approved_at` datetime DEFAULT NULL,
  `company_id` char(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `code`, `booking_id`, `service_type`, `sub_service`, `status`, `priority`, `supervisor_id`, `assigned_at`, `team`, `due_date`, `sla_minutes`, `start_date`, `completed_at`, `notes`, `created_at`, `updated_at`, `requested_by_type`, `requested_by_id`, `requested_by_contact_id`, `created_by_user_id`, `approval_status`, `approved_at`, `company_id`) VALUES
('1f68e80c-6af2-44d2-aea9-8db4c16a4e66', 'PRG 198919', 'e6858240-47f5-4af1-bfec-eb3f7a90511b', 'BOTH', 'Rodent Control', 'CREATED', 'MEDIUM', NULL, NULL, '[]', NULL, NULL, NULL, NULL, NULL, '2026-02-15 12:21:39', '2026-02-15 12:21:39', NULL, NULL, 'c26aeeb2-e53c-11f0-be37-06f610c6dc38', '102', 'PENDING', NULL, '8ed2fb46-e53c-11f0-be37-06f610c6dc38'),
('2009e9f7-aeae-4350-afc5-23cbf6f449a1', 'PRG 198908', '10bc1469-6576-4ff8-9554-78cf355a4ca4', 'PEST', 'Termite Control', 'CREATED', 'MEDIUM', NULL, NULL, '[]', '2026-02-14 00:00:00', NULL, '2026-02-11 00:00:00', NULL, NULL, '2026-02-14 19:01:35', '2026-02-14 19:01:35', NULL, NULL, 'abb7963d-e53c-11f0-be37-06f610c6dc38', '102', 'PENDING', NULL, '8ed2fb46-e53c-11f0-be37-06f610c6dc38'),
('214aa9ec-f8e0-4a94-9c3b-6309fa889ad8', 'PRG 198905', 'f49ad4ab-b69a-4a7d-8c0b-d56bf9ad50c3', 'PEST', 'Rodent Control', 'COMPLETED', 'MEDIUM', 102, NULL, '[106, 107]', '2026-02-20 00:00:00', NULL, '2026-02-18 00:00:00', NULL, NULL, '2026-02-12 15:47:21', '2026-02-14 17:56:21', NULL, NULL, 'abb7963d-e53c-11f0-be37-06f610c6dc38', '1', 'PENDING', NULL, '8ed2fb46-e53c-11f0-be37-06f610c6dc38'),
('321a63c2-4b2f-446d-b793-6dc72809f6f8', 'PRG 198911', 'c10a6a10-e9af-4de4-8f0b-d2dafd36168d', 'PEST', 'Termite Control', 'NOT_STARTED', 'MEDIUM', 102, NULL, '[105]', '2026-02-06 00:00:00', NULL, '2026-02-01 00:00:00', NULL, NULL, '2026-02-14 19:02:15', '2026-02-15 15:39:47', NULL, NULL, 'abb7963d-e53c-11f0-be37-06f610c6dc38', '1', 'PENDING', NULL, '8ed2fb46-e53c-11f0-be37-06f610c6dc38'),
('3b6fe9a1-e546-11f0-8f1e-82d5953d7b27', 'PRG 620891', NULL, 'Deep', 'Lobby Deep Cleaning', 'NOT_STARTED', 'MEDIUM', 102, NULL, '[106]', NULL, 1440, NULL, NULL, NULL, '2025-12-30 11:40:25', '2026-02-13 18:34:00', 'CONTACT', NULL, 'abb7963d-e53c-11f0-be37-06f610c6dc38', '104', 'PENDING', NULL, '8ed2fb46-e53c-11f0-be37-06f610c6dc38'),
('3b6ff19c-e546-11f0-8f1e-82d5953d7b27', 'PRG 429337', NULL, 'Deep', 'Lobby Deep Cleaning', 'NOT_STARTED', 'MEDIUM', NULL, NULL, '[]', NULL, 1440, NULL, NULL, NULL, '2025-12-30 11:40:25', '2025-12-30 11:40:25', 'CONTACT', NULL, 'c26aeeb2-e53c-11f0-be37-06f610c6dc38', '104', 'PENDING', NULL, '8ed2fb46-e53c-11f0-be37-06f610c6dc38'),
('40612e9b-e546-11f0-8f1e-82d5953d7b27', 'SPC 297305', NULL, 'Pest', 'Common Area Mosquito Treatment', 'COMPLETED', 'HIGH', 102, NULL, '[105]', NULL, 2880, NULL, NULL, NULL, '2025-12-30 11:40:33', '2026-02-14 16:07:46', 'CONTACT', NULL, 'abb8fb96-e53c-11f0-be37-06f610c6dc38', '104', 'PENDING', NULL, '8ed2fd1c-e53c-11f0-be37-06f610c6dc38'),
('40613321-e546-11f0-8f1e-82d5953d7b27', 'SPC 404097', NULL, 'Pest', 'Common Area Mosquito Treatment', 'NOT_STARTED', 'HIGH', NULL, NULL, '[]', NULL, 2880, NULL, NULL, NULL, '2025-12-30 11:40:33', '2025-12-30 11:40:33', 'CONTACT', NULL, 'd43b0ed2-e53c-11f0-be37-06f610c6dc38', '104', 'PENDING', NULL, '8ed2fd1c-e53c-11f0-be37-06f610c6dc38'),
('435bd677-e9ea-4dec-bc42-7122595b6325', 'PRG 198909', 'c10a6a10-e9af-4de4-8f0b-d2dafd36168d', 'PEST', 'Cockroach Control', 'CREATED', 'MEDIUM', NULL, NULL, '[]', '2026-02-21 00:00:00', NULL, '2026-02-11 00:00:00', NULL, NULL, '2026-02-14 19:02:15', '2026-02-14 19:02:15', NULL, NULL, 'abb7963d-e53c-11f0-be37-06f610c6dc38', '1', 'PENDING', NULL, '8ed2fb46-e53c-11f0-be37-06f610c6dc38'),
('43f8f329-8ea1-464c-8d95-961c79b6b74c', 'BRI 198916', '83e8f2c5-2dbf-43a8-b5f3-1570c40a63eb', 'BOTH', 'Ant Control', 'CREATED', 'MEDIUM', NULL, NULL, '[]', NULL, NULL, NULL, NULL, NULL, '2026-02-14 19:06:32', '2026-02-14 19:06:32', NULL, NULL, 'bec22a0d-e53c-11f0-be37-06f610c6dc38', '1', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('5da30cc3-8849-4053-ba07-025a5b241e90', 'PRG 198910', 'c10a6a10-e9af-4de4-8f0b-d2dafd36168d', 'PEST', 'Bed Bug Control', 'CREATED', 'MEDIUM', NULL, NULL, '[]', '2026-02-21 00:00:00', NULL, '2026-02-11 00:00:00', NULL, NULL, '2026-02-14 19:02:15', '2026-02-14 19:02:15', NULL, NULL, 'abb7963d-e53c-11f0-be37-06f610c6dc38', '1', 'PENDING', NULL, '8ed2fb46-e53c-11f0-be37-06f610c6dc38'),
('6089c7db-ea63-4d73-b740-3acd3a1e76ab', 'BRI 198914', '83e8f2c5-2dbf-43a8-b5f3-1570c40a63eb', 'BOTH', 'Kitchen Cleaning', 'CREATED', 'MEDIUM', NULL, NULL, '[]', NULL, NULL, NULL, NULL, NULL, '2026-02-14 19:06:32', '2026-02-14 19:06:32', NULL, NULL, 'bec22a0d-e53c-11f0-be37-06f610c6dc38', '1', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('61dfa86a-e002-11f0-8fa0-268c951a2987', 'BRI 198900', NULL, 'Pest', 'General Pest Control', 'NOT_STARTED', 'LOW', 101, '2025-12-23 14:03:08', '[]', NULL, 1440, NULL, NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-23 13:22:08', NULL, NULL, '9cbe0765-e53c-11f0-be37-06f610c6dc38', '', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('61dfac4d-e002-11f0-8fa0-268c951a2987', '2025-8901', NULL, 'Deep', 'Sofa Cleaning', 'IN_PROGRESS', 'LOW', 102, '2025-12-23 13:47:08', '[]', NULL, 2880, '2025-12-23 15:37:08', NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-30 10:59:43', NULL, NULL, '', '', 'PENDING', NULL, NULL),
('61dfacf2-e002-11f0-8fa0-268c951a2987', 'BRI 198902', NULL, 'Pest', 'Cockroach Treatment', 'IN_PROGRESS', 'LOW', 101, '2025-12-23 13:23:08', '[]', NULL, 1440, NULL, NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-23 13:22:08', NULL, NULL, '9cbe0765-e53c-11f0-be37-06f610c6dc38', '', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('61dfad36-e002-11f0-8fa0-268c951a2987', '2025-8903', NULL, 'Deep', 'Bathroom Cleaning', 'NOT_STARTED', 'LOW', 101, '2025-12-23 14:12:08', '[]', NULL, 2880, NULL, NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-23 13:22:08', NULL, NULL, '', '', 'PENDING', NULL, NULL),
('61dfad59-e002-11f0-8fa0-268c951a2987', 'BRI 198904', NULL, 'Pest', 'Rodent Control', 'NOT_STARTED', 'HIGH', 101, '2025-12-23 13:32:08', '[]', NULL, 1440, '2025-12-23 15:23:08', NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-23 13:22:08', NULL, NULL, '9cbe0765-e53c-11f0-be37-06f610c6dc38', '', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('61dfad80-e002-11f0-8fa0-268c951a2987', '2025-8905', NULL, 'Deep', 'Kitchen Deep Clean', 'COMPLETED', 'LOW', 102, '2025-12-23 13:41:08', '[]', NULL, 2880, '2025-12-23 13:46:08', '2025-12-23 16:59:08', 'Job completed successfully. Client satisfied.', '2025-12-23 13:22:08', '2025-12-23 13:22:08', NULL, NULL, '', '', 'PENDING', NULL, NULL),
('61dfada5-e002-11f0-8fa0-268c951a2987', 'BRI 198906', NULL, 'Pest', 'Termite Control', 'IN_PROGRESS', 'HIGH', 102, '2025-12-23 13:29:08', '[]', NULL, 1440, '2025-12-23 16:27:08', NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-23 13:22:08', NULL, NULL, '9cbe0765-e53c-11f0-be37-06f610c6dc38', '', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('61dfadca-e002-11f0-8fa0-268c951a2987', '2025-8907', NULL, 'Deep', 'Floor Scrubbing', 'IN_PROGRESS', 'LOW', 103, '2025-12-23 14:00:08', '[\"tech-3\"]', NULL, 2880, NULL, NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-23 13:31:48', NULL, NULL, '', '', 'PENDING', NULL, NULL),
('61dfade9-e002-11f0-8fa0-268c951a2987', 'BRI 198908', NULL, 'Pest', 'Ant Control', 'IN_PROGRESS', 'LOW', 102, '2025-12-23 14:11:08', '[]', NULL, 1440, '2025-12-23 15:12:08', NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-23 13:22:08', NULL, NULL, '9cbe0765-e53c-11f0-be37-06f610c6dc38', '', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('61dfae0d-e002-11f0-8fa0-268c951a2987', '2025-8909', NULL, 'Deep', 'Window Cleaning', 'NOT_STARTED', 'LOW', 103, '2025-12-23 13:35:08', '[\"tech-3\"]', NULL, 2880, NULL, NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-23 13:31:48', NULL, NULL, '', '', 'PENDING', NULL, NULL),
('61dfae2e-e002-11f0-8fa0-268c951a2987', 'BRI 198910', NULL, 'Pest', 'Mosquito Treatment', 'IN_PROGRESS', 'LOW', 103, '2025-12-23 13:59:08', '[\"tech-3\"]', NULL, 1440, '2025-12-23 15:37:08', NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-23 13:31:48', NULL, NULL, '9cbe0765-e53c-11f0-be37-06f610c6dc38', '', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('61dfae4e-e002-11f0-8fa0-268c951a2987', '2025-8911', NULL, 'Deep', 'Carpet Shampooing', 'NOT_STARTED', 'LOW', 103, '2025-12-23 13:49:08', '[]', NULL, 2880, '2025-12-23 16:00:08', NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-23 13:22:08', NULL, NULL, '', '', 'PENDING', NULL, NULL),
('61dfae6d-e002-11f0-8fa0-268c951a2987', 'BRI 198912', NULL, 'Pest', 'Bed Bug Control', 'IN_PROGRESS', 'LOW', 103, '2025-12-23 13:47:08', '[]', NULL, 1440, '2025-12-23 16:46:08', NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-23 13:22:08', NULL, NULL, '9cbe0765-e53c-11f0-be37-06f610c6dc38', '', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('61dfae8b-e002-11f0-8fa0-268c951a2987', '2025-8913', NULL, 'Deep', 'Chair Cleaning', 'IN_PROGRESS', 'LOW', 103, '2025-12-23 14:08:08', '[]', NULL, 2880, '2025-12-23 15:04:08', NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-23 13:22:08', NULL, NULL, '', '', 'PENDING', NULL, NULL),
('61dfaea8-e002-11f0-8fa0-268c951a2987', 'BRI 198914', NULL, 'Pest', 'Fly Control', 'NOT_STARTED', 'LOW', 103, '2025-12-23 13:57:08', '[]', NULL, 1440, '2025-12-23 14:00:08', NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-23 13:22:08', NULL, NULL, '9cbe0765-e53c-11f0-be37-06f610c6dc38', '', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('61dfaec7-e002-11f0-8fa0-268c951a2987', '2025-8915', NULL, 'Deep', 'Office Deep Cleaning', 'COMPLETED', 'MEDIUM', 104, '2025-12-23 13:59:08', '[]', NULL, 2880, '2025-12-23 15:26:08', '2025-12-23 18:00:08', 'Job completed successfully. Client satisfied.', '2025-12-23 13:22:08', '2025-12-23 13:22:08', NULL, NULL, '', '', 'PENDING', NULL, NULL),
('61dfaee4-e002-11f0-8fa0-268c951a2987', 'BRI 198916', NULL, 'Pest', 'Lizard Control', 'IN_PROGRESS', 'LOW', 104, '2025-12-23 13:44:08', '[]', NULL, 1440, '2025-12-23 14:08:08', NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-23 13:22:08', NULL, NULL, '9cbe0765-e53c-11f0-be37-06f610c6dc38', '', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('61dfaf01-e002-11f0-8fa0-268c951a2987', '2025-8917', NULL, 'Deep', 'Glass Cleaning', 'COMPLETED', 'LOW', 104, '2025-12-23 14:19:08', '[]', NULL, 2880, '2025-12-23 14:43:08', '2025-12-23 17:24:08', 'Job completed successfully. Client satisfied.', '2025-12-23 13:22:08', '2025-12-23 13:22:08', NULL, NULL, '', '', 'PENDING', NULL, NULL),
('61dfaf20-e002-11f0-8fa0-268c951a2987', 'BRI 198918', NULL, 'Pest', 'Spider Control', 'NOT_STARTED', 'LOW', 104, '2025-12-23 14:05:08', '[]', NULL, 1440, '2025-12-23 15:16:08', NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-23 13:22:08', NULL, NULL, '9cbe0765-e53c-11f0-be37-06f610c6dc38', '', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('61dfaf3e-e002-11f0-8fa0-268c951a2987', '2025-8919', NULL, 'Deep', 'Lobby Cleaning', 'IN_PROGRESS', 'LOW', 104, '2025-12-23 14:03:08', '[]', NULL, 2880, NULL, NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-23 13:22:08', NULL, NULL, '', '', 'PENDING', NULL, NULL),
('61dfaf5a-e002-11f0-8fa0-268c951a2987', 'BRI 198920', NULL, 'Pest', 'General Pest Control', 'COMPLETED', 'LOW', 104, '2025-12-23 13:40:08', '[\"tech-3\", \"tech-2\", \"tech-1\"]', NULL, 1440, '2025-12-23 13:49:08', '2025-12-23 14:56:08', 'Job completed successfully. Client satisfied.', '2025-12-23 13:22:08', '2025-12-23 13:32:11', NULL, NULL, '9cbe0765-e53c-11f0-be37-06f610c6dc38', '', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('61dfaf77-e002-11f0-8fa0-268c951a2987', '2025-8921', NULL, 'Deep', 'Villa Deep Clean', 'COMPLETED', 'MEDIUM', 104, '2025-12-23 13:50:08', '[\"tech-3\", \"tech-2\", \"tech-1\"]', NULL, 2880, '2025-12-23 16:10:08', '2025-12-23 17:48:08', 'Job completed successfully. Client satisfied.', '2025-12-23 13:22:08', '2025-12-23 13:32:11', NULL, NULL, '', '', 'PENDING', NULL, NULL),
('61dfaf96-e002-11f0-8fa0-268c951a2987', 'BRI 198922', NULL, 'Pest', 'Rodent Control', 'NOT_STARTED', 'HIGH', 104, '2025-12-23 13:47:08', '[\"tech-3\", \"tech-2\", \"tech-1\"]', NULL, 1440, '2025-12-23 14:53:08', NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-23 13:32:11', NULL, NULL, '9cbe0765-e53c-11f0-be37-06f610c6dc38', '', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('61dfafb4-e002-11f0-8fa0-268c951a2987', '2025-8923', NULL, 'Deep', 'Balcony Cleaning', 'NOT_STARTED', 'LOW', 104, '2025-12-23 14:03:08', '[\"tech-3\", \"tech-2\", \"tech-1\"]', NULL, 2880, NULL, NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-23 13:32:11', NULL, NULL, '', '', 'PENDING', NULL, NULL),
('61dfafd0-e002-11f0-8fa0-268c951a2987', 'BRI 198924', NULL, 'Pest', 'Ant Control', 'IN_PROGRESS', 'LOW', 104, '2025-12-23 13:33:08', '[\"tech-3\", \"tech-2\", \"tech-1\"]', NULL, 1440, NULL, NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-23 13:32:11', NULL, NULL, '9cbe0765-e53c-11f0-be37-06f610c6dc38', '', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('61dfafed-e002-11f0-8fa0-268c951a2987', '2025-8925', NULL, 'Deep', 'Warehouse Cleaning', 'NOT_STARTED', 'LOW', 104, '2025-12-23 14:14:08', '[\"tech-3\", \"tech-2\", \"tech-1\"]', NULL, 2880, '2025-12-23 16:22:08', NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-23 13:32:11', NULL, NULL, '', '', 'PENDING', NULL, NULL),
('61dfb00a-e002-11f0-8fa0-268c951a2987', 'BRI 198926', NULL, 'Pest', 'Termite Inspection', 'COMPLETED', 'LOW', 104, '2025-12-23 14:10:08', '[\"tech-3\", \"tech-2\", \"tech-1\"]', NULL, 1440, '2025-12-23 14:19:08', '2025-12-23 15:28:08', 'Job completed successfully. Client satisfied.', '2025-12-23 13:22:08', '2025-12-23 13:32:11', NULL, NULL, '9cbe0765-e53c-11f0-be37-06f610c6dc38', '', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('61dfb027-e002-11f0-8fa0-268c951a2987', '2025-8927', NULL, 'Deep', 'Post Construction Clean', 'COMPLETED', 'LOW', 102, '2025-12-23 13:48:08', '[]', NULL, 2880, '2025-12-23 15:27:08', '2025-12-23 17:35:08', 'Job completed successfully. Client satisfied.', '2025-12-23 13:22:08', '2025-12-26 12:45:31', NULL, NULL, '', '', 'PENDING', NULL, NULL),
('61dfb05b-e002-11f0-8fa0-268c951a2987', 'BRI 198928', NULL, 'Pest', 'Cockroach Control', 'IN_PROGRESS', 'LOW', 103, '2025-12-23 14:09:08', '[]', NULL, 1440, NULL, NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-26 12:37:53', NULL, NULL, '9cbe0765-e53c-11f0-be37-06f610c6dc38', '', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('61dfb081-e002-11f0-8fa0-268c951a2987', '2025-8929', NULL, 'Deep', 'Common Area Cleaning', 'IN_PROGRESS', 'LOW', 104, '2025-12-23 14:00:08', '[\"tech-3\", \"tech-2\", \"tech-1\"]', NULL, 2880, '2025-12-23 14:31:08', NULL, 'Work in progress. Technician on site.', '2025-12-23 13:22:08', '2025-12-23 13:32:11', NULL, NULL, '', '', 'PENDING', NULL, NULL),
('64f34e9b-e546-11f0-8f1e-82d5953d7b27', 'PRG 416068', NULL, 'Deep', 'Washroom Deep Cleaning', 'IN_PROGRESS', 'HIGH', 101, NULL, '[]', NULL, 1440, NULL, NULL, NULL, '2025-12-30 11:41:35', '2025-12-30 12:29:00', 'CONTACT', NULL, 'abb7963d-e53c-11f0-be37-06f610c6dc38', '104', 'PENDING', NULL, '8ed2fb46-e53c-11f0-be37-06f610c6dc38'),
('64f3571d-e546-11f0-8f1e-82d5953d7b27', 'PRG 553509', NULL, 'Deep', 'Pantry Cleaning', 'PAUSED', 'HIGH', 103, NULL, '[105]', NULL, 1440, NULL, NULL, NULL, '2025-12-30 11:41:35', '2026-02-14 18:02:47', 'CONTACT', NULL, 'c26aeeb2-e53c-11f0-be37-06f610c6dc38', '104', 'PENDING', NULL, '8ed2fb46-e53c-11f0-be37-06f610c6dc38'),
('67f3106b-7e43-47db-b88f-ccb1c1ce8341', 'BRI 198901', 'c5f37792-5f18-441e-94e5-7725e00b9aff', 'BOTH', 'Cockroach Control', 'CREATED', 'MEDIUM', 104, NULL, '[]', NULL, NULL, NULL, NULL, NULL, '2025-12-30 16:59:04', '2026-01-10 12:44:15', NULL, NULL, 'bec22a0d-e53c-11f0-be37-06f610c6dc38', '101', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('682eff0e-1699-4612-97ec-fe6cfbe0ad93', 'BRI 198913', '83e8f2c5-2dbf-43a8-b5f3-1570c40a63eb', 'BOTH', 'Rodent Control', 'COMPLETED', 'MEDIUM', 102, NULL, '[105]', NULL, NULL, NULL, NULL, NULL, '2026-02-14 19:06:32', '2026-02-14 19:13:57', NULL, NULL, 'bec22a0d-e53c-11f0-be37-06f610c6dc38', '1', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('6e78aba1-bc80-4eea-a50f-4606f9c9f096', 'BRI 198902', 'c5f37792-5f18-441e-94e5-7725e00b9aff', 'BOTH', 'Bed Bug Control', 'COMPLETED', 'MEDIUM', 102, NULL, '[105]', '2026-02-19 00:00:00', NULL, NULL, NULL, NULL, '2025-12-30 16:59:04', '2026-02-14 18:19:22', NULL, NULL, 'bec22a0d-e53c-11f0-be37-06f610c6dc38', '101', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('6f6ae11e-e583-4f38-a9f5-d37c5d786958', 'PRG 198906', '10bc1469-6576-4ff8-9554-78cf355a4ca4', 'PEST', 'Cockroach Control', 'CREATED', 'MEDIUM', NULL, NULL, '[]', '2026-02-14 00:00:00', NULL, '2026-02-11 00:00:00', NULL, NULL, '2026-02-14 19:01:35', '2026-02-14 19:01:35', NULL, NULL, 'abb7963d-e53c-11f0-be37-06f610c6dc38', '102', 'PENDING', NULL, '8ed2fb46-e53c-11f0-be37-06f610c6dc38'),
('818873f2-089a-4f0a-b948-b0d640f54f74', 'BRI 198903', 'c5f37792-5f18-441e-94e5-7725e00b9aff', 'BOTH', 'Termite Control', 'COMPLETED', 'MEDIUM', 102, NULL, '[105]', NULL, NULL, NULL, NULL, NULL, '2025-12-30 16:59:04', '2026-02-14 16:06:44', NULL, NULL, 'bec22a0d-e53c-11f0-be37-06f610c6dc38', '101', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('8ab5c349-a5d7-4b1f-9e73-25916a3099f5', 'PRG 198904', 'f49ad4ab-b69a-4a7d-8c0b-d56bf9ad50c3', 'PEST', 'Cockroach Control', 'COMPLETED', 'MEDIUM', 102, NULL, '[106, 107]', NULL, NULL, NULL, NULL, NULL, '2026-02-12 15:47:21', '2026-02-14 17:56:21', NULL, NULL, 'abb7963d-e53c-11f0-be37-06f610c6dc38', '1', 'PENDING', NULL, '8ed2fb46-e53c-11f0-be37-06f610c6dc38'),
('96d6f3ad-0424-4b96-8401-bd44b1a34ef5', 'BRI 198912', '83e8f2c5-2dbf-43a8-b5f3-1570c40a63eb', 'BOTH', 'Cockroach Control', 'CREATED', 'MEDIUM', NULL, NULL, '[]', NULL, NULL, NULL, NULL, NULL, '2026-02-14 19:06:32', '2026-02-14 19:06:32', NULL, NULL, 'bec22a0d-e53c-11f0-be37-06f610c6dc38', '1', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('9de4e120-8763-4b03-aef9-09161fd98bb2', 'SPC 198922', '060ceade-6cf7-44fe-baae-03a3321b4bf1', 'BOTH', 'Bed Bug Control', 'CREATED', 'MEDIUM', NULL, NULL, '[]', NULL, NULL, NULL, NULL, NULL, '2026-02-15 12:26:03', '2026-02-15 12:26:03', NULL, NULL, 'abb8fb96-e53c-11f0-be37-06f610c6dc38', '1', 'PENDING', NULL, '8ed2fd1c-e53c-11f0-be37-06f610c6dc38'),
('9e94ef06-a07e-4a67-bb5d-e0c5b96b0ad6', 'PRG 198907', '10bc1469-6576-4ff8-9554-78cf355a4ca4', 'PEST', 'Bed Bug Control', 'CREATED', 'MEDIUM', NULL, NULL, '[]', '2026-02-14 00:00:00', NULL, '2026-02-11 00:00:00', NULL, NULL, '2026-02-14 19:01:35', '2026-02-14 19:01:35', NULL, NULL, 'abb7963d-e53c-11f0-be37-06f610c6dc38', '102', 'PENDING', NULL, '8ed2fb46-e53c-11f0-be37-06f610c6dc38'),
('b20b257d-f567-4c87-b4b3-ffb41ec4215b', 'PRG 198917', 'e6858240-47f5-4af1-bfec-eb3f7a90511b', 'BOTH', 'Cockroach Control', 'CREATED', 'MEDIUM', NULL, NULL, '[]', NULL, NULL, NULL, NULL, NULL, '2026-02-15 12:21:38', '2026-02-15 12:21:38', NULL, NULL, 'c26aeeb2-e53c-11f0-be37-06f610c6dc38', '102', 'PENDING', NULL, '8ed2fb46-e53c-11f0-be37-06f610c6dc38'),
('b990afc5-29fd-40dc-be7c-d63548bcad4d', 'BRI 198915', '83e8f2c5-2dbf-43a8-b5f3-1570c40a63eb', 'BOTH', 'Sofa Cleaning', 'CREATED', 'MEDIUM', NULL, NULL, '[]', NULL, NULL, NULL, NULL, NULL, '2026-02-14 19:06:32', '2026-02-14 19:06:32', NULL, NULL, 'bec22a0d-e53c-11f0-be37-06f610c6dc38', '1', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38'),
('c4563979-757c-4f8c-8630-f6543a90b8b1', 'PRG 198920', 'e6858240-47f5-4af1-bfec-eb3f7a90511b', 'BOTH', 'Sofa Cleaning', 'CREATED', 'MEDIUM', NULL, NULL, '[]', NULL, NULL, NULL, NULL, NULL, '2026-02-15 12:21:39', '2026-02-15 12:21:39', NULL, NULL, 'c26aeeb2-e53c-11f0-be37-06f610c6dc38', '102', 'PENDING', NULL, '8ed2fb46-e53c-11f0-be37-06f610c6dc38'),
('c62fc8c3-bebf-4052-97af-105f6ef8400e', 'PRG 198918', 'e6858240-47f5-4af1-bfec-eb3f7a90511b', 'BOTH', 'Bed Bug Control', 'CREATED', 'MEDIUM', NULL, NULL, '[]', NULL, NULL, NULL, NULL, NULL, '2026-02-15 12:21:39', '2026-02-15 12:21:39', NULL, NULL, 'c26aeeb2-e53c-11f0-be37-06f610c6dc38', '102', 'PENDING', NULL, '8ed2fb46-e53c-11f0-be37-06f610c6dc38'),
('c8c66067-78be-46ab-9e46-c41632c2b8fa', 'SPC 198923', '060ceade-6cf7-44fe-baae-03a3321b4bf1', 'BOTH', 'Termite Control', 'CREATED', 'MEDIUM', NULL, NULL, '[]', NULL, NULL, NULL, NULL, NULL, '2026-02-15 12:26:03', '2026-02-15 12:26:03', NULL, NULL, 'abb8fb96-e53c-11f0-be37-06f610c6dc38', '1', 'PENDING', NULL, '8ed2fd1c-e53c-11f0-be37-06f610c6dc38'),
('e4e431f0-e8d7-4e94-b483-415600673a36', 'PRG 198900', '7e0dddad-f6c8-49ca-adc5-5a85ce6c3559', 'PEST', 'Cockroach Control', 'COMPLETED', 'MEDIUM', 102, NULL, '[106]', NULL, NULL, '2026-02-13 19:41:54', '2026-02-13 19:42:00', NULL, '2025-12-30 16:49:58', '2026-02-13 19:41:53', NULL, NULL, 'abb7963d-e53c-11f0-be37-06f610c6dc38', '101', 'PENDING', NULL, '8ed2fb46-e53c-11f0-be37-06f610c6dc38'),
('f69bca06-2a10-43ff-b9a0-3edeaf44d6f9', 'SPC 198921', '060ceade-6cf7-44fe-baae-03a3321b4bf1', 'BOTH', 'Cockroach Control', 'CREATED', 'MEDIUM', NULL, NULL, '[]', NULL, NULL, NULL, NULL, NULL, '2026-02-15 12:26:03', '2026-02-15 12:26:03', NULL, NULL, 'abb8fb96-e53c-11f0-be37-06f610c6dc38', '1', 'PENDING', NULL, '8ed2fd1c-e53c-11f0-be37-06f610c6dc38'),
('job-test-1', 'BRI 999001', NULL, 'Pest', 'General Pest Control', 'IN_PROGRESS', 'LOW', 101, '2025-12-23 12:50:05', '[\"tech-1\"]', NULL, 1440, '2025-12-23 14:32:05', NULL, 'Work in progress. Technician on site.', '2025-12-23 12:02:05', '2025-12-23 13:18:37', NULL, NULL, '9cbe0765-e53c-11f0-be37-06f610c6dc38', '', 'PENDING', NULL, '8ed2e5c8-e53c-11f0-be37-06f610c6dc38');

--
-- Triggers `jobs`
--
DELIMITER $$
CREATE TRIGGER `trg_jobs_inprogress_guard` BEFORE UPDATE ON `jobs` FOR EACH ROW BEGIN
  IF NEW.status = 'IN_PROGRESS'
     AND NEW.supervisor_id IS NULL
     AND (NEW.team IS NULL OR JSON_LENGTH(NEW.team) = 0) THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Cannot set IN_PROGRESS without assignment';
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_jobs_inprogress_guard_insert` BEFORE INSERT ON `jobs` FOR EACH ROW BEGIN
  IF NEW.status = 'IN_PROGRESS'
     AND NEW.supervisor_id IS NULL
     AND (NEW.team IS NULL OR JSON_LENGTH(NEW.team) = 0) THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Cannot create IN_PROGRESS job without assignment';
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_jobs_requested_by_company_check` BEFORE INSERT ON `jobs` FOR EACH ROW BEGIN
  IF NEW.requested_by_contact_id IS NOT NULL THEN
    -- Corporate job: contact.company_id MUST match job.company_id
    IF NEW.company_id IS NOT NULL AND
       (SELECT company_id FROM contacts WHERE id = NEW.requested_by_contact_id) <> NEW.company_id
    THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Requested-by contact does not belong to this company';
    END IF;

    -- Individual job: contact.company_id MUST be NULL
    IF NEW.company_id IS NULL AND
       (SELECT company_id FROM contacts WHERE id = NEW.requested_by_contact_id) IS NOT NULL
    THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Company contact cannot request an individual job';
    END IF;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `job_attachments`
--

CREATE TABLE `job_attachments` (
  `id` char(36) NOT NULL,
  `job_id` char(36) NOT NULL,
  `type` varchar(30) NOT NULL,
  `object_key` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_type` varchar(100) DEFAULT NULL,
  `file_url` text,
  `history_id` char(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `job_attachments`
--

INSERT INTO `job_attachments` (`id`, `job_id`, `type`, `object_key`, `created_at`, `file_name`, `file_type`, `file_url`, `history_id`) VALUES
('00abd4db-c9cb-4a32-a98e-c1273329e13b', '818873f2-089a-4f0a-b948-b0d640f54f74', 'IMAGE', 'jobs/818873f2-089a-4f0a-b948-b0d640f54f74/b7a56580-d1d0-4262-ad18-79b01443c603/68ae9b65-6a3f-48af-8f3d-b9ffbdfd347d.png', '2026-02-04 14:01:33', 'Screenshot 2025-11-26 174031.png', 'image/png', NULL, 'b7a56580-d1d0-4262-ad18-79b01443c603'),
('1998a0e2-6a62-4e6d-9c85-b042d8e33ec2', '818873f2-089a-4f0a-b948-b0d640f54f74', 'IMAGE', 'jobs/818873f2-089a-4f0a-b948-b0d640f54f74/6abca762-49bb-4012-9dd9-4ade93cc3a59/e5b9c1e1-3f2f-4504-942a-f68ad417df5d.jpg', '2026-02-03 12:15:50', 'asus.jpg', 'image/jpeg', NULL, '6abca762-49bb-4012-9dd9-4ade93cc3a59'),
('4015e807-d3df-46b4-8f2f-e720e035a3c3', '61dfb027-e002-11f0-8fa0-268c951a2987', 'image', 'jobs/818873f2/site-photo.jpg', '2026-01-06 18:25:00', 'test.jpg', 'image/jpeg', 'https://example.com/test.jpg', '04317068-9443-4b06-9610-64cbd092ad17'),
('44f24250-bfec-447f-a9ee-ab45ac6ef112', '818873f2-089a-4f0a-b948-b0d640f54f74', 'IMAGE', 'jobs/818873f2-089a-4f0a-b948-b0d640f54f74/b7a56580-d1d0-4262-ad18-79b01443c603/2f9b7eaf-ca40-45fa-b96b-deac35b8e8d2.png', '2026-02-04 14:01:33', 'Screenshot 2025-11-26 173453.png', 'image/png', NULL, 'b7a56580-d1d0-4262-ad18-79b01443c603'),
('59407d03-f158-40c0-a53c-7be97ba81216', '6e78aba1-bc80-4eea-a50f-4606f9c9f096', 'IMAGE', 'jobs/6e78aba1-bc80-4eea-a50f-4606f9c9f096/ab3e4134-a24f-454d-be40-d2206e668482/f41babae-0eca-41c1-a67a-d1cc27051a44.jpg', '2026-02-14 18:59:20', 'IMG_20260207_152209-EDIT.jpg', 'image/jpeg', NULL, 'ab3e4134-a24f-454d-be40-d2206e668482'),
('611af9a2-557d-4e5a-821e-6566b03d3099', '6e78aba1-bc80-4eea-a50f-4606f9c9f096', 'IMAGE', 'jobs/6e78aba1-bc80-4eea-a50f-4606f9c9f096/db46ab4d-20a4-4e54-a443-b1b8f1925c44/2196ab1b-bd8e-4155-8a1e-619d40655ec7.png', '2026-02-12 13:27:11', 'Screenshot 2026-02-12 132617.png', 'image/png', NULL, 'db46ab4d-20a4-4e54-a443-b1b8f1925c44'),
('64309d68-ae9a-443f-bee5-1b7a4d3e0ddd', '818873f2-089a-4f0a-b948-b0d640f54f74', 'FILE', 'jobs/818873f2-089a-4f0a-b948-b0d640f54f74/df1b14bc-4938-49c8-a014-f31cbdd575a9/back Poster 11x16 (3) (1).pdf', '2026-01-10 12:42:56', 'back Poster 11x16 (3) (1).pdf', 'application/pdf', NULL, 'df1b14bc-4938-49c8-a014-f31cbdd575a9'),
('73823fd3-bb64-4893-9d32-f6d3dc045297', '818873f2-089a-4f0a-b948-b0d640f54f74', 'IMAGE', 'jobs/818873f2-089a-4f0a-b948-b0d640f54f74/e1bbca98-b546-4607-adf7-fc006ddf7353/0c431256-5756-4444-972e-22eb440d798d.jpg', '2026-02-03 17:51:42', 'asus.jpg', 'image/jpeg', NULL, 'e1bbca98-b546-4607-adf7-fc006ddf7353'),
('7d991c26-c8ea-47c2-a4a9-29ea7258c7f8', '818873f2-089a-4f0a-b948-b0d640f54f74', 'IMAGE', 'jobs/818873f2-089a-4f0a-b948-b0d640f54f74/97cf90b8-de1e-497a-aa2e-2493bf49c444/01fb87b8-2a10-459c-b894-e672e6522ec6.png', '2026-02-06 15:34:58', 'Screenshot 2026-02-06 152403.png', 'image/png', NULL, '97cf90b8-de1e-497a-aa2e-2493bf49c444'),
('9b4dd885-5d51-4a43-8b22-20d8580b7dd7', '214aa9ec-f8e0-4a94-9c3b-6309fa889ad8', 'IMAGE', 'jobs/214aa9ec-f8e0-4a94-9c3b-6309fa889ad8/b8eb85e4-d153-4978-94e0-a2e14ebe944e/bc735cad-b42a-41e8-8ea2-52e90b06aca9.png', '2026-02-13 17:51:12', 'Screenshot 2025-11-26 111941.png', 'image/png', NULL, 'b8eb85e4-d153-4978-94e0-a2e14ebe944e'),
('abb91ae6-22c5-4a40-94f0-a99384ab254a', '818873f2-089a-4f0a-b948-b0d640f54f74', 'IMAGE', 'jobs/818873f2-089a-4f0a-b948-b0d640f54f74/d3683cde-cc1d-48fc-878c-a898f79a009c/WIN_20251220_16_31_51_Pro.jpg', '2026-01-07 12:58:51', 'WIN_20251220_16_31_51_Pro.jpg', 'image/jpeg', NULL, 'd3683cde-cc1d-48fc-878c-a898f79a009c'),
('e369546d-3fa3-40a4-979f-1777e2d47397', '6e78aba1-bc80-4eea-a50f-4606f9c9f096', 'FILE', 'jobs/6e78aba1-bc80-4eea-a50f-4606f9c9f096/903daf64-cea4-4619-8c0b-aaac836ad8e4/0a280096-c4c9-4efc-8688-802e595d594c.pdf', '2026-02-14 18:19:51', 'JAN LED.pdf', 'application/pdf', NULL, '903daf64-cea4-4619-8c0b-aaac836ad8e4'),
('e84b26dc-cf99-4786-a2aa-171e09a016e2', '818873f2-089a-4f0a-b948-b0d640f54f74', 'IMAGE', 'jobs/818873f2-089a-4f0a-b948-b0d640f54f74/db478578-6daf-4a81-855a-72c2bada75d9/GROUP (1).png', '2026-01-07 15:46:57', 'GROUP (1).png', 'image/png', NULL, 'db478578-6daf-4a81-855a-72c2bada75d9'),
('ef2822af-af06-49d4-9679-f8d442555e39', '818873f2-089a-4f0a-b948-b0d640f54f74', 'IMAGE', 'jobs/818873f2-089a-4f0a-b948-b0d640f54f74/b7a56580-d1d0-4262-ad18-79b01443c603/84c9ef72-0652-4870-b349-269435539ff7.png', '2026-02-04 14:01:33', 'Screenshot 2025-11-26 175838.png', 'image/png', NULL, 'b7a56580-d1d0-4262-ad18-79b01443c603'),
('f5a4ea5e-1328-48d7-b2ed-7599d2131129', '6e78aba1-bc80-4eea-a50f-4606f9c9f096', 'IMAGE', 'jobs/6e78aba1-bc80-4eea-a50f-4606f9c9f096/db46ab4d-20a4-4e54-a443-b1b8f1925c44/2daf0a5d-f4d2-4ce3-815c-0a4ea838b2ca.png', '2026-02-12 13:27:11', 'Screenshot 2026-02-12 132115.png', 'image/png', NULL, 'db46ab4d-20a4-4e54-a443-b1b8f1925c44');

-- --------------------------------------------------------

--
-- Table structure for table `job_comments`
--

CREATE TABLE `job_comments` (
  `id` char(36) NOT NULL,
  `job_id` char(36) NOT NULL,
  `comment` text NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_history`
--

CREATE TABLE `job_history` (
  `id` char(36) NOT NULL,
  `job_id` char(36) NOT NULL,
  `action` varchar(50) NOT NULL,
  `message` text,
  `metadata` json DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `created_by_user_id` char(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `job_history`
--

INSERT INTO `job_history` (`id`, `job_id`, `action`, `message`, `metadata`, `created_at`, `created_by_user_id`) VALUES
('01753e1f-0997-11f1-a6f5-6e24f1ab0c9a', '8ab5c349-a5d7-4b1f-9e73-25916a3099f5', 'STATUS_CHANGED', 'Status changed from IN_PROGRESS to PAUSED', NULL, '2026-02-14 16:49:19', '105'),
('021939e8-0997-11f1-a6f5-6e24f1ab0c9a', '8ab5c349-a5d7-4b1f-9e73-25916a3099f5', 'STATUS_CHANGED', 'Status changed from PAUSED to IN_PROGRESS', NULL, '2026-02-14 16:49:20', '105'),
('027ac1e6-098c-11f1-a6f5-6e24f1ab0c9a', '64f3571d-e546-11f0-8f1e-82d5953d7b27', 'STATUS_CHANGED', 'Status changed from IN_PROGRESS to PAUSED', NULL, '2026-02-14 15:30:36', '105'),
('02bf1568-0997-11f1-a6f5-6e24f1ab0c9a', '8ab5c349-a5d7-4b1f-9e73-25916a3099f5', 'STATUS_CHANGED', 'Status changed from IN_PROGRESS to COMPLETED', NULL, '2026-02-14 16:49:21', '105'),
('03d54b7b-051f-40ef-aa6f-baca3b1b35a5', '6e78aba1-bc80-4eea-a50f-4606f9c9f096', 'COMMENT', 'Anup Sir Test', NULL, '2026-02-14 18:17:31', '1'),
('04317068-9443-4b06-9610-64cbd092ad17', '61dfb027-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Nagraj T to Ishaan U', '{\"technicians\": [], \"newSupervisorId\": 103, \"oldSupervisorId\": \"104\"}', '2025-12-26 12:40:52', NULL),
('04b8fb8e-a771-4b54-aa60-1ee6a7043208', 'f69bca06-2a10-43ff-b9a0-3edeaf44d6f9', 'CREATED', 'Job created', NULL, '2026-02-15 12:26:03', '1'),
('06aae2f0-cb20-46c3-b0c8-ff892ecbd567', '64f3571d-e546-11f0-8f1e-82d5953d7b27', 'ASSIGNED', 'Supervisor changed from Chandan G to Ishaan U', '{\"technicians\": [], \"newSupervisorId\": 103, \"oldSupervisorId\": \"101\"}', '2025-12-30 13:48:14', NULL),
('0b13d6dd-f3bd-41be-9608-5efa7339826e', '61dfac4d-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Ishaan U to Chandan G', '{\"technicians\": [], \"newSupervisorId\": 101, \"oldSupervisorId\": \"103\"}', '2025-12-26 12:29:24', NULL),
('0c4f6ea9-0991-11f1-a6f5-6e24f1ab0c9a', '8ab5c349-a5d7-4b1f-9e73-25916a3099f5', 'STATUS_CHANGED', 'Status changed from PAUSED to IN_PROGRESS', NULL, '2026-02-14 16:06:40', '105'),
('0d351461-0991-11f1-a6f5-6e24f1ab0c9a', '64f3571d-e546-11f0-8f1e-82d5953d7b27', 'STATUS_CHANGED', 'Status changed from PAUSED to IN_PROGRESS', NULL, '2026-02-14 16:06:42', '105'),
('0e2b8d61-33b8-4bcd-b541-0eccfffa98c6', '214aa9ec-f8e0-4a94-9c3b-6309fa889ad8', 'ASSIGNED', 'Supervisor changed from Harsh A to Harsh A', '{\"technicians\": [106, 107], \"newSupervisorId\": 102, \"oldSupervisorId\": \"102\"}', '2026-02-13 12:13:51', '1'),
('0e64c56b-0d64-40e9-b4af-f11988f0f41b', '6e78aba1-bc80-4eea-a50f-4606f9c9f096', 'CREATED', 'Job created', NULL, '2025-12-30 16:59:04', NULL),
('0e659fb3-0991-11f1-a6f5-6e24f1ab0c9a', '818873f2-089a-4f0a-b948-b0d640f54f74', 'STATUS_CHANGED', 'Status changed from IN_PROGRESS to COMPLETED', NULL, '2026-02-14 16:06:44', '105'),
('0f8eed78-5228-453e-b66b-cbf58e4aeff0', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'test', NULL, '2025-12-30 19:49:08', '101'),
('0feb0bb5-8230-466a-9637-e6c81562cdf2', '61dfafb4-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from sup-2 to Nagraj T', '{\"technicians\": [\"tech-3\", \"tech-2\", \"tech-1\"], \"newSupervisor\": \"sup-4\", \"oldSupervisor\": \"sup-2\"}', '2025-12-23 13:32:11', NULL),
('1189c21b-8496-410f-98f2-faf3ad714b63', '9e94ef06-a07e-4a67-bb5d-e0c5b96b0ad6', 'CREATED', 'Job created', NULL, '2026-02-14 19:01:35', '102'),
('161dc45f-d467-4559-a66d-4e5b73f0a228', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'Yes It does! Images Next! \n', NULL, '2026-01-05 13:48:44', '101'),
('1820bdd8-8f97-4bae-a5c4-84fc137913fb', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'Does it still work?\n', NULL, '2026-01-05 13:48:34', '101'),
('1a2e9d28-c859-4a6c-96d6-3ba3f71263bc', '61dfaf77-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from sup-2 to Nagraj T', '{\"technicians\": [\"tech-3\", \"tech-2\", \"tech-1\"], \"newSupervisor\": \"sup-4\", \"oldSupervisor\": \"sup-2\"}', '2025-12-23 13:32:11', NULL),
('2190e918-841e-4dc7-b2be-44f2d472cabd', '61dfac4d-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Nagraj T to Harsh A', '{\"technicians\": [], \"newSupervisorId\": 102, \"oldSupervisorId\": \"104\"}', '2025-12-26 12:36:12', NULL),
('2440400c-998b-4e2b-b7b0-5e22f0a5e111', '6089c7db-ea63-4d73-b740-3acd3a1e76ab', 'CREATED', 'Job created', NULL, '2026-02-14 19:06:32', '1'),
('25a48e4d-cf7a-43f8-a68f-b89345e3e38e', '2009e9f7-aeae-4350-afc5-23cbf6f449a1', 'CREATED', 'Job created', NULL, '2026-02-14 19:01:35', '102'),
('275e277a-2857-4663-9325-ecb219dcdd12', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'adding file- console log\n', NULL, '2026-01-07 12:39:27', '101'),
('298b4321-5e38-40e1-aa3e-ac0a04170ef3', '61dfac4d-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from sup-3 to Uday M', '{\"technicians\": [], \"newSupervisor\": \"sup-6\", \"oldSupervisor\": \"sup-3\"}', '2025-12-24 05:17:38', NULL),
('2b48a447-6a4f-4fcb-9113-19b84de67c8d', '321a63c2-4b2f-446d-b793-6dc72809f6f8', 'CREATED', 'Job created', NULL, '2026-02-14 19:02:15', '1'),
('2c803147-b92e-4cab-a069-0626a090887e', '43f8f329-8ea1-464c-8d95-961c79b6b74c', 'CREATED', 'Job created', NULL, '2026-02-14 19:06:32', '1'),
('2dda0577-c5ba-4d78-9276-d33ca2a653da', '321a63c2-4b2f-446d-b793-6dc72809f6f8', 'ASSIGNED', 'Supervisor changed from Unassigned to Harsh A | Team: test1', '{\"technicianIds\": [105], \"newSupervisorId\": 102, \"oldSupervisorId\": null, \"technicianNames\": [\"test1\"]}', '2026-02-14 19:03:24', '1'),
('2dfef62c-fcb3-4033-9d92-5af6448cedf5', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'Test 4 - hope it works now! ', NULL, '2026-01-07 12:52:18', '101'),
('2f48f306-09ab-11f1-a6f5-6e24f1ab0c9a', '682eff0e-1699-4612-97ec-fe6cfbe0ad93', 'STATUS_CHANGED', 'Status changed from NOT_STARTED to IN_PROGRESS', NULL, '2026-02-14 19:13:46', '105'),
('2f899442-744f-45eb-94f0-5de38c013842', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'Manasa\n', NULL, '2026-02-03 17:51:18', '101'),
('31261d04-041a-4fff-abba-2d2561975e60', 'b990afc5-29fd-40dc-be7c-d63548bcad4d', 'CREATED', 'Job created', NULL, '2026-02-14 19:06:32', '1'),
('31a65162-48a9-4c34-83f9-5f34326ae944', '61dfac4d-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Ishaan U to Ishaan U', '{\"technicians\": [], \"newSupervisorId\": 103, \"oldSupervisorId\": \"103\"}', '2025-12-26 12:24:12', NULL),
('31cef5e9-09ab-11f1-a6f5-6e24f1ab0c9a', '682eff0e-1699-4612-97ec-fe6cfbe0ad93', 'STATUS_CHANGED', 'Status changed from IN_PROGRESS to PAUSED', NULL, '2026-02-14 19:13:50', '105'),
('31da83da-0991-11f1-a6f5-6e24f1ab0c9a', '40612e9b-e546-11f0-8f1e-82d5953d7b27', 'STATUS_CHANGED', 'Status changed from NOT_STARTED to IN_PROGRESS', NULL, '2026-02-14 16:07:43', '105'),
('31e16dbf-383a-4102-a974-2673520b7ad1', '6f6ae11e-e583-4f38-a9f5-d37c5d786958', 'CREATED', 'Job created', NULL, '2026-02-14 19:01:35', '102'),
('32af238f-0991-11f1-a6f5-6e24f1ab0c9a', '40612e9b-e546-11f0-8f1e-82d5953d7b27', 'STATUS_CHANGED', 'Status changed from IN_PROGRESS to PAUSED', NULL, '2026-02-14 16:07:45', '105'),
('33284ee8-0991-11f1-a6f5-6e24f1ab0c9a', '40612e9b-e546-11f0-8f1e-82d5953d7b27', 'STATUS_CHANGED', 'Status changed from PAUSED to IN_PROGRESS', NULL, '2026-02-14 16:07:45', '105'),
('339ad7bc-0991-11f1-a6f5-6e24f1ab0c9a', '40612e9b-e546-11f0-8f1e-82d5953d7b27', 'STATUS_CHANGED', 'Status changed from IN_PROGRESS to COMPLETED', NULL, '2026-02-14 16:07:46', '105'),
('341a268d-09ab-11f1-a6f5-6e24f1ab0c9a', '682eff0e-1699-4612-97ec-fe6cfbe0ad93', 'STATUS_CHANGED', 'Status changed from PAUSED to IN_PROGRESS', NULL, '2026-02-14 19:13:54', '105'),
('3643e45a-09ab-11f1-a6f5-6e24f1ab0c9a', '682eff0e-1699-4612-97ec-fe6cfbe0ad93', 'STATUS_CHANGED', 'Status changed from IN_PROGRESS to COMPLETED', NULL, '2026-02-14 19:13:57', '105'),
('37f10078-d2fd-4b58-b1eb-b925558b3a7b', '64f3571d-e546-11f0-8f1e-82d5953d7b27', 'ASSIGNED', 'Supervisor changed from Harsh A to Chandan G', '{\"technicians\": [], \"newSupervisorId\": 101, \"oldSupervisorId\": \"102\"}', '2025-12-30 12:29:00', NULL),
('39be5fc8-ca6b-4b1b-99c4-3c36500a7632', '61dfac4d-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Harsh A to Chandan G', '{\"technicians\": [], \"newSupervisorId\": 101, \"oldSupervisorId\": \"102\"}', '2025-12-26 12:17:11', NULL),
('3a978410-b82c-4281-8de5-7618af685b8a', '682eff0e-1699-4612-97ec-fe6cfbe0ad93', 'COMMENT', 'Test - Prashanta', NULL, '2026-02-14 19:07:09', '1'),
('3cbde024-85b7-4184-ba52-866ee7d695d1', '6e78aba1-bc80-4eea-a50f-4606f9c9f096', 'ASSIGNED', 'Supervisor changed from Nagraj T to Harsh A', '{\"technicians\": [106, 107], \"newSupervisorId\": 102, \"oldSupervisorId\": \"104\"}', '2026-02-12 13:28:34', NULL),
('43cf25cf-7a97-4c19-9828-607ebff107b7', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', '?? Now test 5 ', NULL, '2026-01-07 12:53:11', '101'),
('4448e739-1a83-46f1-b739-33866ced9891', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'test 2', NULL, '2026-01-07 12:42:41', '101'),
('44da735a-09a1-11f1-a6f5-6e24f1ab0c9a', '64f3571d-e546-11f0-8f1e-82d5953d7b27', 'STATUS_CHANGED', 'Status changed from IN_PROGRESS to PAUSED', NULL, '2026-02-14 18:02:47', '105'),
('4808b8d5-a660-4784-b910-ed555770ebdb', 'b20b257d-f567-4c87-b4b3-ffb41ec4215b', 'CREATED', 'Job created', NULL, '2026-02-15 12:21:38', '102'),
('48f6b38f-bc5c-41f3-b723-059a872dab74', '61dfac4d-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Harsh A to Nagraj T', '{\"technicians\": [], \"newSupervisorId\": 104, \"oldSupervisorId\": \"102\"}', '2025-12-26 18:22:57', NULL),
('4b155a58-98b8-47c4-a71c-811fa5d3eab3', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'okayy!', NULL, '2025-12-30 19:53:26', '101'),
('4ec43e77-e201-437d-ac3d-287fdea851cc', '61dfb027-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Ishaan U to Harsh A', '{\"technicians\": [], \"newSupervisorId\": 102, \"oldSupervisorId\": \"103\"}', '2025-12-26 12:45:31', NULL),
('4f23d842-5480-4afc-a731-5fe8a97fc3be', '214aa9ec-f8e0-4a94-9c3b-6309fa889ad8', 'CREATED', 'Job created', NULL, '2026-02-12 15:47:21', '1'),
('4fa1dcbd-d26c-4bdd-b857-7bee0c6abe7f', '8ab5c349-a5d7-4b1f-9e73-25916a3099f5', 'ASSIGNED', 'Supervisor changed from Harsh A to Harsh A | Team: Tech, Tech1', '{\"technicianIds\": [106, 107], \"newSupervisorId\": 102, \"oldSupervisorId\": 102, \"technicianNames\": [\"Tech\", \"Tech1\"]}', '2026-02-14 17:56:21', '1'),
('5399ae75-098b-11f1-a6f5-6e24f1ab0c9a', '818873f2-089a-4f0a-b948-b0d640f54f74', 'STATUS_CHANGED', 'Status changed from NOT_STARTED to IN_PROGRESS', NULL, '2026-02-14 15:25:43', '105'),
('54edee76-ad92-4f1e-b378-9ad81932a85a', 'e4e431f0-e8d7-4e94-b483-415600673a36', 'ASSIGNED', 'Supervisor changed from Unassigned to Harsh A | Team: Tech', '{\"technicianIds\": [106], \"newSupervisorId\": 102, \"oldSupervisorId\": null, \"technicianNames\": [\"Tech\"]}', '2026-02-13 19:41:53', '1'),
('55074b6a-a182-4c8c-8eb2-ae13ee55f890', '61dfaf5a-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Navin A to Nagraj T', '{\"technicians\": [\"tech-3\", \"tech-2\", \"tech-1\"], \"newSupervisor\": \"sup-4\", \"oldSupervisor\": \"Navin A\"}', '2025-12-23 13:32:11', NULL),
('550c874f-08e9-11f1-a962-2a7229429a6a', '214aa9ec-f8e0-4a94-9c3b-6309fa889ad8', 'STATUS_CHANGED', 'Status changed from IN_PROGRESS to PAUSED', NULL, '2026-02-13 20:06:07', '1'),
('574a9f52-73f2-470a-9861-9dcd500160a0', '61dfac4d-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from sup-1 to Ishwar U', '{\"technicians\": [], \"newSupervisor\": \"sup-3\", \"oldSupervisor\": \"sup-1\"}', '2025-12-23 14:07:58', NULL),
('57861860-caa0-4018-8f1c-66cc9c564e9c', '61dfadca-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Harsh A to Ishwar U', '{\"technicians\": [\"tech-3\"], \"newSupervisor\": \"sup-3\", \"oldSupervisor\": \"Harsh A\"}', '2025-12-23 13:31:48', NULL),
('58b089d2-08e9-11f1-a962-2a7229429a6a', '214aa9ec-f8e0-4a94-9c3b-6309fa889ad8', 'STATUS_CHANGED', 'Status changed from PAUSED to IN_PROGRESS', NULL, '2026-02-13 20:06:13', '1'),
('597eeb0f-08e9-11f1-a962-2a7229429a6a', '214aa9ec-f8e0-4a94-9c3b-6309fa889ad8', 'STATUS_CHANGED', 'Status changed from IN_PROGRESS to COMPLETED', NULL, '2026-02-13 20:06:14', '1'),
('5d351779-e57a-11f0-b789-ea480a5a68f4', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'Reached site and did initial inspection.', NULL, '2025-12-30 17:53:36', '103'),
('5d351d60-e57a-11f0-b789-ea480a5a68f4', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'Identified mosquito breeding areas near the basement.', NULL, '2025-12-30 17:53:36', '104'),
('5d351dfb-e57a-11f0-b789-ea480a5a68f4', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'Chemical treatment completed. Awaiting client confirmation.', NULL, '2025-12-30 17:53:36', '101'),
('5d94deb0-b69c-4809-a9b0-3e044ebf2867', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'TEst', NULL, '2026-01-07 12:41:46', '101'),
('61b34711-d6ff-4de3-9b94-2e084330820c', '61dfac4d-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Chandan G to Nagraj T', '{\"technicians\": [], \"newSupervisorId\": 104, \"oldSupervisorId\": \"101\"}', '2025-12-26 12:34:32', NULL),
('6385255e-387c-435d-8fc7-6cbfc4807a1e', '96d6f3ad-0424-4b96-8401-bd44b1a34ef5', 'CREATED', 'Job created', NULL, '2026-02-14 19:06:32', '1'),
('68863f46-b24c-400b-a3bf-54e2bf696364', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'test', NULL, '2025-12-30 19:47:39', '101'),
('6abca762-49bb-4012-9dd9-4ade93cc3a59', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'Test', NULL, '2026-02-03 12:15:50', '101'),
('6c1f0989-bf97-4cdf-920b-b1bdf6c8c3b6', '61dfac4d-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Nagraj T to Harsh A', '{\"technicians\": [], \"newSupervisorId\": 102, \"oldSupervisorId\": \"104\"}', '2025-12-30 10:59:43', NULL),
('6c26e973-3441-4ae0-9c40-cf731af90a95', '61dfaf77-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Navin A to Harsh A', '{\"technicians\": [\"tech-2\", \"tech-3\"], \"newSupervisor\": \"sup-2\", \"oldSupervisor\": \"Navin A\"}', '2025-12-23 13:31:34', NULL),
('6d0cd53a-aa26-4138-bad1-203eeac746b5', '818873f2-089a-4f0a-b948-b0d640f54f74', 'CREATED', 'Job created', NULL, '2025-12-30 16:59:04', NULL),
('72e6f365-a6ef-43a5-bd87-f8eef5c186b8', '5da30cc3-8849-4053-ba07-025a5b241e90', 'CREATED', 'Job created', NULL, '2026-02-14 19:02:15', '1'),
('73c1579c-13c4-45c1-bf14-bf87bf2f17bf', 'job-test-1', 'ASSIGNED', 'Supervisor changed from Unassigned to Chandan G', '{\"technicians\": [\"tech-1\"], \"newSupervisor\": \"sup-1\", \"oldSupervisor\": \"Unassigned\"}', '2025-12-23 13:18:37', NULL),
('7632ff5c-d058-4b81-a288-981b6e47defb', '818873f2-089a-4f0a-b948-b0d640f54f74', 'ASSIGNED', 'Supervisor changed from Chandan G to Harsh A | Team: Tech', '{\"technicianIds\": [106], \"newSupervisorId\": 102, \"oldSupervisorId\": 101, \"technicianNames\": [\"Tech\"]}', '2026-02-13 19:30:40', '1'),
('783ef678-09a3-11f1-a6f5-6e24f1ab0c9a', '6e78aba1-bc80-4eea-a50f-4606f9c9f096', 'STATUS_CHANGED', 'Status changed from NOT_STARTED to IN_PROGRESS', NULL, '2026-02-14 18:18:32', '105'),
('7f959abd-3a8c-4f42-8b23-fb8e624491de', '214aa9ec-f8e0-4a94-9c3b-6309fa889ad8', 'COMMENT', 'Sup user update is written here\n', NULL, '2026-02-13 17:53:15', '102'),
('83e72b1b-ec2f-4c3f-97d8-0b205cb7adb0', '61dfac4d-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from sup-6 to Chandan G', '{\"technicians\": [], \"newSupervisor\": \"sup-1\", \"oldSupervisor\": \"sup-6\"}', '2025-12-24 07:45:19', NULL),
('8427f37f-9316-4641-a559-569f730907ce', '214aa9ec-f8e0-4a94-9c3b-6309fa889ad8', 'ASSIGNED', 'Supervisor changed from Harsh A to Harsh A', '{\"technicians\": [106], \"newSupervisorId\": 102, \"oldSupervisorId\": \"102\"}', '2026-02-13 12:16:53', '1'),
('84dc0214-9126-4016-81d1-300bf4661559', '9de4e120-8763-4b03-aef9-09161fd98bb2', 'CREATED', 'Job created', NULL, '2026-02-15 12:26:03', '1'),
('875d53a4-3c96-4aff-ab42-90ceb7a07fc3', '67f3106b-7e43-47db-b88f-ccb1c1ce8341', 'CREATED', 'Job created', NULL, '2025-12-30 16:59:04', NULL),
('8c552b33-00a0-4485-9413-0b59f6dde7bb', '8ab5c349-a5d7-4b1f-9e73-25916a3099f5', 'ASSIGNED', 'Supervisor changed from Harsh A to Harsh A | Team: test1, Tech, Tech1', '{\"technicianIds\": [106, 107, 105], \"newSupervisorId\": 102, \"oldSupervisorId\": 102, \"technicianNames\": [\"test1\", \"Tech\", \"Tech1\"]}', '2026-02-13 20:28:51', '1'),
('8c67cf2f-08ef-11f1-a6f5-6e24f1ab0c9a', '8ab5c349-a5d7-4b1f-9e73-25916a3099f5', 'STATUS_CHANGED', 'Status changed from NOT_STARTED to IN_PROGRESS', NULL, '2026-02-13 20:50:37', '105'),
('8cd17d86-e548-4c39-96a1-2e3b5e31ee0b', '8ab5c349-a5d7-4b1f-9e73-25916a3099f5', 'CREATED', 'Job created', NULL, '2026-02-12 15:47:21', '1'),
('8d954576-c6c5-4eee-a5ec-a9863ad22da1', '6e78aba1-bc80-4eea-a50f-4606f9c9f096', 'ASSIGNED', 'Supervisor changed from Unassigned to Nagraj T', '{\"technicians\": [], \"newSupervisorId\": 104, \"oldSupervisorId\": null}', '2026-01-10 12:44:15', NULL),
('8dec9e37-08ef-11f1-a6f5-6e24f1ab0c9a', '8ab5c349-a5d7-4b1f-9e73-25916a3099f5', 'STATUS_CHANGED', 'Status changed from IN_PROGRESS to PAUSED', NULL, '2026-02-13 20:50:39', '105'),
('8e3ee4dc-94a7-4ddc-bf24-865b076ba3c4', '61dfac4d-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from sup-4 to Chandan G', '{\"technicians\": [\"tech-1\"], \"newSupervisor\": \"sup-1\", \"oldSupervisor\": \"sup-4\"}', '2025-12-23 14:04:20', NULL),
('903daf64-cea4-4619-8c0b-aaac836ad8e4', '6e78aba1-bc80-4eea-a50f-4606f9c9f096', 'COMMENT', 'added', NULL, '2026-02-14 18:19:51', '105'),
('928612af-7d6a-4001-913a-b51d10b59893', 'c62fc8c3-bebf-4052-97af-105f6ef8400e', 'CREATED', 'Job created', NULL, '2026-02-15 12:21:39', '102'),
('92a9ff82-99e1-4f5c-bf5d-52d7e7197c11', '64f3571d-e546-11f0-8f1e-82d5953d7b27', 'ASSIGNED', 'Supervisor changed from Unassigned to Harsh A', '{\"technicians\": [], \"newSupervisorId\": 102, \"oldSupervisorId\": null}', '2025-12-30 11:55:09', NULL),
('92e4dfb2-08ef-11f1-a6f5-6e24f1ab0c9a', '8ab5c349-a5d7-4b1f-9e73-25916a3099f5', 'STATUS_CHANGED', 'Status changed from PAUSED to IN_PROGRESS', NULL, '2026-02-13 20:50:47', '105'),
('9629eabd-09a3-11f1-a6f5-6e24f1ab0c9a', '6e78aba1-bc80-4eea-a50f-4606f9c9f096', 'STATUS_CHANGED', 'Status changed from IN_PROGRESS to COMPLETED', NULL, '2026-02-14 18:19:22', '105'),
('9730f5bb-b2ef-4f88-b6ec-987e4b9ec13f', '818873f2-089a-4f0a-b948-b0d640f54f74', 'ASSIGNED', 'Supervisor changed from Unassigned to Chandan G', '{\"technicians\": [], \"newSupervisorId\": 101, \"oldSupervisorId\": null}', '2025-12-31 12:30:35', NULL),
('9761966c-cbe4-4b90-ae70-764383cf5fbd', '6e78aba1-bc80-4eea-a50f-4606f9c9f096', 'COMMENT', 'New Test Job \n', NULL, '2026-02-12 13:26:52', '101'),
('97cf90b8-de1e-497a-aa2e-2493bf49c444', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'Test', NULL, '2026-02-06 15:34:58', '101'),
('98f4b8da-d431-4878-bb6b-1d07ca7f898a', '682eff0e-1699-4612-97ec-fe6cfbe0ad93', 'CREATED', 'Job created', NULL, '2026-02-14 19:06:32', '1'),
('9a8d5baa-6e37-4026-bf21-00c234aedb63', '3b6fe9a1-e546-11f0-8f1e-82d5953d7b27', 'ASSIGNED', 'Supervisor changed from Unassigned to Harsh A | Team: Tech', '{\"technicianIds\": [106], \"newSupervisorId\": 102, \"oldSupervisorId\": null, \"technicianNames\": [\"Tech\"]}', '2026-02-13 18:34:00', '1'),
('9b99a062-e2f2-464a-9211-5f953814afb4', '61dfb027-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Uday M to Nagraj T', '{\"technicians\": [\"tech-3\", \"tech-2\", \"tech-1\"], \"newSupervisor\": \"sup-4\", \"oldSupervisor\": \"Uday M\"}', '2025-12-23 13:32:11', NULL),
('9c645595-6813-4289-9383-d454c7f0a049', '682eff0e-1699-4612-97ec-fe6cfbe0ad93', 'ASSIGNED', 'Supervisor changed from Unassigned to Harsh A | Team: test1', '{\"technicianIds\": [105], \"newSupervisorId\": 102, \"oldSupervisorId\": null, \"technicianNames\": [\"test1\"]}', '2026-02-14 19:10:06', '1'),
('9d373416-2c61-4645-8826-a2f89f062cd3', '61dfafed-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Uday M to Nagraj T', '{\"technicians\": [\"tech-3\", \"tech-2\", \"tech-1\"], \"newSupervisor\": \"sup-4\", \"oldSupervisor\": \"Uday M\"}', '2025-12-23 13:32:11', NULL),
('9f0da07c-05e8-4be0-8da3-078b1c664e9f', '214aa9ec-f8e0-4a94-9c3b-6309fa889ad8', 'ASSIGNED', 'Supervisor changed from Harsh A to Harsh A', '{\"technicians\": [106], \"newSupervisorId\": 102, \"oldSupervisorId\": \"102\"}', '2026-02-13 12:18:59', '1'),
('a16566e6-4bae-4466-ac3a-0c76c1c28bdd', '64f34e9b-e546-11f0-8f1e-82d5953d7b27', 'ASSIGNED', 'Supervisor changed from Unassigned to Chandan G', '{\"technicians\": [], \"newSupervisorId\": 101, \"oldSupervisorId\": null}', '2025-12-30 12:29:00', NULL),
('a1712c4a-133e-4f2e-984a-3a97986de463', '61dfac4d-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from sup-6 to Uday M', '{\"technicians\": [], \"newSupervisor\": \"sup-6\", \"oldSupervisor\": \"sup-6\"}', '2025-12-24 05:38:27', NULL),
('a29d929d-b80c-4c11-bae7-0c860afb1310', '61dfae0d-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Harsh A to Ishwar U', '{\"technicians\": [\"tech-3\"], \"newSupervisor\": \"sup-3\", \"oldSupervisor\": \"Harsh A\"}', '2025-12-23 13:31:48', NULL),
('a47e1a06-0591-4268-904f-912c1614790f', '818873f2-089a-4f0a-b948-b0d640f54f74', 'ASSIGNED', 'Supervisor changed from Ishaan U to Chandan G', '{\"technicians\": [], \"newSupervisorId\": 101, \"oldSupervisorId\": \"103\"}', '2026-01-07 15:48:31', NULL),
('a6c67aed-17bf-427a-bb33-06dd518e4878', '61dfb05b-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Nagraj T to Ishaan U', '{\"technicians\": [], \"newSupervisorId\": 103, \"oldSupervisorId\": \"104\"}', '2025-12-26 12:37:53', NULL),
('aac1d60e-23ec-4a38-af2a-7c08b38790a2', '61dfae2e-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Ishwar U to Ishwar U', '{\"technicians\": [\"tech-3\"], \"newSupervisor\": \"sup-3\", \"oldSupervisor\": \"Ishwar U\"}', '2025-12-23 13:31:48', NULL),
('ab3e4134-a24f-454d-be40-d2206e668482', '6e78aba1-bc80-4eea-a50f-4606f9c9f096', 'COMMENT', 'test', NULL, '2026-02-14 18:59:20', '1'),
('ab59bc58-a93f-4d52-9dd5-4cbbbc26b1f0', '61dfb00a-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Uday M to Nagraj T', '{\"technicians\": [\"tech-3\", \"tech-2\", \"tech-1\"], \"newSupervisor\": \"sup-4\", \"oldSupervisor\": \"Uday M\"}', '2025-12-23 13:32:11', NULL),
('ad2e6f11-cfec-478c-9867-62baff3288c2', '818873f2-089a-4f0a-b948-b0d640f54f74', 'ASSIGNED', 'Supervisor changed from Nagraj T to Chandan G', '{\"technicians\": [], \"newSupervisorId\": 101, \"oldSupervisorId\": \"104\"}', '2026-02-06 15:34:44', NULL),
('af525182-bab5-4497-8d1e-1a4c73eedd87', '1f68e80c-6af2-44d2-aea9-8db4c16a4e66', 'CREATED', 'Job created', NULL, '2026-02-15 12:21:39', '102'),
('b04704de-2c78-42e7-93a4-5b33723e7038', '214aa9ec-f8e0-4a94-9c3b-6309fa889ad8', 'ASSIGNED', 'Supervisor changed from Harsh A to Harsh A | Team: Tech, Tech1', '{\"technicianIds\": [106, 107], \"newSupervisorId\": 102, \"oldSupervisorId\": 102, \"technicianNames\": [\"Tech\", \"Tech1\"]}', '2026-02-14 17:56:21', '1'),
('b5c68191-070d-42db-9a77-19399a9d00f4', '818873f2-089a-4f0a-b948-b0d640f54f74', 'ASSIGNED', 'Supervisor changed from Chandan G to Harsh A', '{\"technicians\": [], \"newSupervisorId\": 102, \"oldSupervisorId\": \"101\"}', '2026-01-10 12:42:09', NULL),
('b5cdf7f8-b4cd-4b34-b6f6-071cfa1388c4', 'c8c66067-78be-46ab-9e46-c41632c2b8fa', 'CREATED', 'Job created', NULL, '2026-02-15 12:26:03', '1'),
('b7a56580-d1d0-4262-ad18-79b01443c603', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'Testing with multiple files', NULL, '2026-02-04 14:01:33', '101'),
('b8eb85e4-d153-4978-94e0-a2e14ebe944e', '214aa9ec-f8e0-4a94-9c3b-6309fa889ad8', 'COMMENT', 'Say something manasa', NULL, '2026-02-13 17:51:12', '1'),
('b9a24de9-c069-45cc-9e9d-e177f4016276', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'This comment', NULL, '2026-01-07 15:44:43', '101'),
('bf7768e2-860f-40ff-9a7d-4a7298e446fc', '64f3571d-e546-11f0-8f1e-82d5953d7b27', 'COMMENT', 'Rain is still there, so we will now work in the Rain\n', NULL, '2025-12-31 10:43:21', '101'),
('c219756d-3cc2-44e2-bcf3-60722d48d85e', '818873f2-089a-4f0a-b948-b0d640f54f74', 'ASSIGNED', 'Supervisor changed from Chandan G to Harsh A', '{\"technicians\": [], \"newSupervisorId\": 102, \"oldSupervisorId\": \"101\"}', '2026-01-05 13:48:49', NULL),
('c231d4a9-27d8-4c04-9578-8dfe4ed3cb45', '214aa9ec-f8e0-4a94-9c3b-6309fa889ad8', 'ASSIGNED', 'Supervisor changed from Unassigned to Harsh A', '{\"technicians\": [106, 107], \"newSupervisorId\": 102, \"oldSupervisorId\": null}', '2026-02-13 11:02:10', '1'),
('c52a407f-0b2f-4c13-abc3-55837d49fb32', 'e4e431f0-e8d7-4e94-b483-415600673a36', 'CREATED', 'Job created', NULL, '2025-12-30 16:49:58', NULL),
('c592bdfe-dfc4-41e1-ae2d-7bc906f8111d', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'Completed the wall chipping, will install wires', NULL, '2026-02-06 15:35:45', '101'),
('c6714cff-2096-4f16-bc99-1e96a7c8fb46', '61dfb05b-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Uday M to Nagraj T', '{\"technicians\": [\"tech-3\", \"tech-2\", \"tech-1\"], \"newSupervisor\": \"sup-4\", \"oldSupervisor\": \"Uday M\"}', '2025-12-23 13:32:11', NULL),
('c77bfa28-bb59-4681-9cc5-b1759ea52f4d', '61dfac4d-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Harsh A to Ishaan U', '{\"technicians\": [], \"newSupervisorId\": 103, \"oldSupervisorId\": \"102\"}', '2025-12-26 12:24:06', NULL),
('c9b08146-e579-11f0-b789-ea480a5a68f4', '61dfb027-e002-11f0-8fa0-268c951a2987', 'COMMENT', 'Reached site, inspection completed.', NULL, '2025-12-30 17:49:28', '103'),
('c9b08f1e-e579-11f0-b789-ea480a5a68f4', '61dfb027-e002-11f0-8fa0-268c951a2987', 'COMMENT', 'Treatment started in common areas.', NULL, '2025-12-30 17:49:28', '104'),
('c9b09078-e579-11f0-b789-ea480a5a68f4', '64f3571d-e546-11f0-8f1e-82d5953d7b27', 'COMMENT', 'Work paused due to rain, will resume tomorrow.', NULL, '2025-12-30 17:49:28', '101'),
('c9f86b11-b2f7-49da-b4cb-e62c02770dc8', '61dfafd0-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Navin A to Nagraj T', '{\"technicians\": [\"tech-3\", \"tech-2\", \"tech-1\"], \"newSupervisor\": \"sup-4\", \"oldSupervisor\": \"Navin A\"}', '2025-12-23 13:32:11', NULL),
('ca596f6c-1dcc-4501-bcae-217187bb811b', '61dfac4d-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Chandan G to Ishaan U', '{\"technicians\": [], \"newSupervisorId\": 103, \"oldSupervisorId\": \"101\"}', '2025-12-26 12:05:24', NULL),
('cb0b7111-a29b-4ae0-8438-abb4fe99af0a', '435bd677-e9ea-4dec-bc42-7122595b6325', 'CREATED', 'Job created', NULL, '2026-02-14 19:02:15', '1'),
('cba33803-f309-493b-b80d-4c855d8f3346', '818873f2-089a-4f0a-b948-b0d640f54f74', 'ASSIGNED', 'Supervisor changed from Harsh A to Ishaan U', '{\"technicians\": [], \"newSupervisorId\": 103, \"oldSupervisorId\": \"102\"}', '2026-01-06 21:07:12', NULL),
('cc46a13f-1e07-46ba-85fb-11ffe272ac57', '40612e9b-e546-11f0-8f1e-82d5953d7b27', 'ASSIGNED', 'Supervisor changed from Unassigned to Harsh A | Team: test1', '{\"technicianIds\": [105], \"newSupervisorId\": 102, \"oldSupervisorId\": null, \"technicianNames\": [\"test1\"]}', '2026-02-14 16:07:36', '1'),
('cca72c46-40e0-48d8-9ce8-b33193f6f8bf', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'TEst 3', NULL, '2026-01-07 12:47:08', '101'),
('cf14fca7-0c04-4fc4-bb76-95fcad2ddfb8', '682eff0e-1699-4612-97ec-fe6cfbe0ad93', 'COMMENT', 'Test', NULL, '2026-02-15 11:57:12', '102'),
('d3683cde-cc1d-48fc-878c-a898f79a009c', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'Test 6 Hope this works! ', NULL, '2026-01-07 12:58:51', '101'),
('d3cb9bbf-25df-469f-af78-88971b371b58', '6e78aba1-bc80-4eea-a50f-4606f9c9f096', 'COMMENT', 'note the thumbnails are not working', NULL, '2026-02-12 13:27:25', '101'),
('d3f597fe-2b54-44c6-b139-a87ea95e1daa', '61dfaf96-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from sup-2 to Nagraj T', '{\"technicians\": [\"tech-3\", \"tech-2\", \"tech-1\"], \"newSupervisor\": \"sup-4\", \"oldSupervisor\": \"sup-2\"}', '2025-12-23 13:32:11', NULL),
('db46ab4d-20a4-4e54-a443-b1b8f1925c44', '6e78aba1-bc80-4eea-a50f-4606f9c9f096', 'COMMENT', 'Testing Img uploads\n', NULL, '2026-02-12 13:27:11', '101'),
('db478578-6daf-4a81-855a-72c2bada75d9', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'This file added', NULL, '2026-01-07 15:46:57', '101'),
('dea171e0-67b8-441f-ad54-91f3d8bfaad6', '61dfac4d-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Chandan G to Harsh A', '{\"technicians\": [], \"newSupervisorId\": 102, \"oldSupervisorId\": \"101\"}', '2025-12-26 12:19:55', NULL),
('deb77b2d-c600-41f1-b7c3-75b1697ed371', '61dfac4d-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Nagraj T to Harsh A', '{\"technicians\": [], \"newSupervisorId\": 102, \"oldSupervisorId\": \"104\"}', '2025-12-26 12:17:00', NULL),
('df1b14bc-4938-49c8-a014-f31cbdd575a9', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'Comments', NULL, '2026-01-10 12:42:56', '101'),
('e075b0d3-6bbd-4be5-b669-1bac14ebf146', '64f3571d-e546-11f0-8f1e-82d5953d7b27', 'ASSIGNED', 'Supervisor changed from Ishaan U to Ishaan U | Team: test1', '{\"technicianIds\": [105], \"newSupervisorId\": 103, \"oldSupervisorId\": 103, \"technicianNames\": [\"test1\"]}', '2026-02-14 15:23:40', '1'),
('e0d88797-f0fc-4eab-8f90-0682f2c95932', '67f3106b-7e43-47db-b88f-ccb1c1ce8341', 'ASSIGNED', 'Supervisor changed from Unassigned to Nagraj T', '{\"technicians\": [], \"newSupervisorId\": 104, \"oldSupervisorId\": null}', '2026-01-10 12:44:15', NULL),
('e127eaf9-0d76-47d8-90f0-c74ad873e207', '214aa9ec-f8e0-4a94-9c3b-6309fa889ad8', 'ASSIGNED', 'Supervisor changed from Harsh A to Harsh A | Team: Tech', '{\"technicianIds\": [106], \"newSupervisorId\": 102, \"oldSupervisorId\": 102, \"technicianNames\": [\"Tech\"]}', '2026-02-13 19:46:39', '1'),
('e1bbca98-b546-4607-adf7-fc006ddf7353', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'asus test', NULL, '2026-02-03 17:51:41', '101'),
('e46d724e-4030-4a8c-8d51-d247e0058a3b', '214aa9ec-f8e0-4a94-9c3b-6309fa889ad8', 'ASSIGNED', 'Supervisor changed from Harsh A to Harsh A', '{\"technicians\": [107, 105], \"newSupervisorId\": 102, \"oldSupervisorId\": \"102\"}', '2026-02-13 12:25:46', '1'),
('e47b9fb6-c672-4e60-97b2-f930361f459a', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'adding a file', NULL, '2026-01-07 12:15:32', '101'),
('e58949f2-1ca3-49ce-ac39-fff3a2aad53a', '61dfaf96-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Navin A to Harsh A', '{\"technicians\": [\"tech-2\", \"tech-3\"], \"newSupervisor\": \"sup-2\", \"oldSupervisor\": \"Navin A\"}', '2025-12-23 13:31:34', NULL),
('e59322da-bc58-4b07-b6d1-91613da2862e', '6e78aba1-bc80-4eea-a50f-4606f9c9f096', 'ASSIGNED', 'Supervisor changed from Harsh A to Harsh A | Team: test1', '{\"technicianIds\": [105], \"newSupervisorId\": 102, \"oldSupervisorId\": 102, \"technicianNames\": [\"test1\"]}', '2026-02-14 18:17:07', '1'),
('ea90306c-3ca9-4ff9-93e4-b54bec1579de', '61dfac4d-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Ishaan U to Nagraj T', '{\"technicians\": [], \"newSupervisorId\": 104, \"oldSupervisorId\": \"103\"}', '2025-12-26 12:06:54', NULL),
('ecafb235-ddb1-4d6d-ac82-0bd61e778e38', '61dfafb4-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Navin A to Harsh A', '{\"technicians\": [\"tech-2\", \"tech-3\"], \"newSupervisor\": \"sup-2\", \"oldSupervisor\": \"Navin A\"}', '2025-12-23 13:31:34', NULL),
('ef012aef-df50-4689-b38e-dd28dc8f7900', 'c4563979-757c-4f8c-8630-f6543a90b8b1', 'CREATED', 'Job created', NULL, '2026-02-15 12:21:39', '102'),
('ef423fbf-098b-11f1-a6f5-6e24f1ab0c9a', '8ab5c349-a5d7-4b1f-9e73-25916a3099f5', 'STATUS_CHANGED', 'Status changed from IN_PROGRESS to PAUSED', NULL, '2026-02-14 15:30:04', '105'),
('f04e6825-8689-4aad-8765-891d9c4d38b0', '8ab5c349-a5d7-4b1f-9e73-25916a3099f5', 'ASSIGNED', 'Supervisor changed from Unassigned to Harsh A | Team: test1, Tech', '{\"technicianIds\": [106, 105], \"newSupervisorId\": 102, \"oldSupervisorId\": null, \"technicianNames\": [\"test1\", \"Tech\"]}', '2026-02-13 20:28:35', '1'),
('f10c77ec-5e13-4b15-8072-94bcca85a3d4', '61dfb081-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Uday M to Nagraj T', '{\"technicians\": [\"tech-3\", \"tech-2\", \"tech-1\"], \"newSupervisor\": \"sup-4\", \"oldSupervisor\": \"Uday M\"}', '2025-12-23 13:32:11', NULL),
('f5ec4b01-9166-49d4-8854-caf3e316b41e', '818873f2-089a-4f0a-b948-b0d640f54f74', 'ASSIGNED', 'Supervisor changed from Harsh A to Nagraj T', '{\"technicians\": [], \"newSupervisorId\": 104, \"oldSupervisorId\": \"102\"}', '2026-01-10 12:44:15', NULL),
('f78ef7d4-8ead-4ee4-9fcb-a66d01e86799', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'Great it works! \n', NULL, '2025-12-30 19:51:36', '101'),
('f7a03aa8-293c-424f-82b1-10f3bbe5f6a0', '61dfac4d-e002-11f0-8fa0-268c951a2987', 'ASSIGNED', 'Supervisor changed from Chandan G to Nagraj T', '{\"technicians\": [\"tech-3\", \"tech-2\", \"tech-1\"], \"newSupervisor\": \"sup-4\", \"oldSupervisor\": \"Chandan G\"}', '2025-12-23 13:32:11', NULL),
('fac0f5d9-f597-477f-8d49-36ddef5ba367', '818873f2-089a-4f0a-b948-b0d640f54f74', 'COMMENT', 'This is an update', NULL, '2026-01-06 21:08:02', '101'),
('ff7ac862-696e-449d-ac98-fea0ce8d7928', '818873f2-089a-4f0a-b948-b0d640f54f74', 'ASSIGNED', 'Supervisor changed from Harsh A to Harsh A | Team: test1', '{\"technicianIds\": [105], \"newSupervisorId\": 102, \"oldSupervisorId\": 102, \"technicianNames\": [\"test1\"]}', '2026-02-14 15:23:22', '1');

-- --------------------------------------------------------

--
-- Table structure for table `recurring_rules`
--

CREATE TABLE `recurring_rules` (
  `id` char(36) NOT NULL,
  `booking_id` char(36) NOT NULL,
  `frequency` enum('WEEKLY','MONTHLY','CUSTOM_DAYS') NOT NULL,
  `interval_value` int NOT NULL DEFAULT '1',
  `day_of_week` int DEFAULT NULL,
  `days_of_week` json DEFAULT NULL,
  `day_of_month` int DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `last_generated_until` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sequences`
--

CREATE TABLE `sequences` (
  `name` varchar(50) NOT NULL,
  `value` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sequences`
--

INSERT INTO `sequences` (`name`, `value`) VALUES
('job_code', 198923);

-- --------------------------------------------------------

--
-- Table structure for table `supervisors`
--

CREATE TABLE `supervisors` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supervisor_technicians`
--

CREATE TABLE `supervisor_technicians` (
  `id` char(36) NOT NULL,
  `supervisor_id` bigint NOT NULL,
  `technician_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `supervisor_technicians`
--

INSERT INTO `supervisor_technicians` (`id`, `supervisor_id`, `technician_id`, `created_at`) VALUES
('3287c758-08ae-11f1-b268-6a1c7c15bbe9', 102, 107, '2026-02-13 07:32:49'),
('d6fbf779-0b29-11f1-8505-2ed31da4f143', 104, 106, '2026-02-16 11:22:55'),
('fd20a7e0-0b29-11f1-8505-2ed31da4f143', 102, 105, '2026-02-16 11:23:59');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('customer','technician','supervisor','tele_exec','admin') NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password_hash`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@psops.com', '9999999999', '$2b$10$jokhppcJvUiUJW5YWQAD9eJu5rc5xjkay2hhbTkyiIeDbpBjS8ph6', 'admin', 1, '2025-12-13 11:32:47', '2026-02-12 07:40:33'),
(101, 'Chandan G', 'chandan@psops.com', NULL, '$2b$10$.rOtUqKazYylW4eLLZPtB.5OcfOe9L8INKgWyn7I5DjimmPFBpo/i', 'admin', 1, '2025-12-24 10:20:09', '2026-02-13 08:00:16'),
(102, 'Harsh A', 'harsh@psops.com', NULL, '$2b$10$SjL9YmNPkE8nZ7MQDILcYuWTd.32k3KkKdkyaeG5an/ClaqFtJNPy', 'supervisor', 1, '2025-12-24 10:20:09', '2026-02-13 08:01:24'),
(103, 'Ishaan U', 'ishaan@psops.com', NULL, 'test1123', 'supervisor', 1, '2025-12-24 10:20:09', '2025-12-24 10:20:09'),
(104, 'Nagraj T', 'Nagraj@psops.com', NULL, 'test1123', 'supervisor', 1, '2025-12-24 10:20:09', '2025-12-24 10:20:09'),
(105, 'test1', 'testuser7@pspos.com', '9988556677', '$2b$10$UZIDbuAnfjn.H81D7Fmq2Onfgan69BHSyWqSmx29jwTpJPG1ZrW1m', 'technician', 1, '2026-02-11 09:05:13', '2026-02-13 14:57:25'),
(106, 'Tech', 'technician@ps-ops.com', '9923545485', '$2b$10$ctcj.GpEVTbS1O0oSQN6feApjxiPv0pcW9XMFo5iu8sS6Qz/GEdgm', 'technician', 1, '2026-02-12 06:00:07', '2026-02-12 06:00:07'),
(107, 'Tech1', 'technician1@ps-ops.com', '9923545485', '$2b$10$Mr1EEN3Fp32TK1ngM4uO0Os5F5rhmu0VNC2jKSjZDTXZhVEMe9Mim', 'technician', 1, '2026-02-12 06:01:00', '2026-02-12 06:01:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_company_code` (`code`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_contacts_company` (`company_id`);

--
-- Indexes for table `email_otps`
--
ALTER TABLE `email_otps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_email` (`email`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_jobs_company` (`company_id`);

--
-- Indexes for table `job_attachments`
--
ALTER TABLE `job_attachments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job_comments`
--
ALTER TABLE `job_comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job_history`
--
ALTER TABLE `job_history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recurring_rules`
--
ALTER TABLE `recurring_rules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_recurring_rules_booking` (`booking_id`);

--
-- Indexes for table `sequences`
--
ALTER TABLE `sequences`
  ADD PRIMARY KEY (`name`);

--
-- Indexes for table `supervisors`
--
ALTER TABLE `supervisors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `supervisor_technicians`
--
ALTER TABLE `supervisor_technicians`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_pair` (`supervisor_id`,`technician_id`),
  ADD KEY `technician_id` (`technician_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `email_otps`
--
ALTER TABLE `email_otps`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `fk_contacts_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`);

--
-- Constraints for table `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `fk_jobs_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`);

--
-- Constraints for table `recurring_rules`
--
ALTER TABLE `recurring_rules`
  ADD CONSTRAINT `fk_recurring_rules_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `supervisor_technicians`
--
ALTER TABLE `supervisor_technicians`
  ADD CONSTRAINT `supervisor_technicians_ibfk_1` FOREIGN KEY (`supervisor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `supervisor_technicians_ibfk_2` FOREIGN KEY (`technician_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
