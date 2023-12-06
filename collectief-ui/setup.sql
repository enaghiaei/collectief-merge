-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 29, 2023 at 04:09 PM
-- Server version: 8.0.27
-- PHP Version: 8.1.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `collectief`
--

-- --------------------------------------------------------

--
-- Table structure for table `area_building`
--

CREATE TABLE `area_building` (
  `ab_id` int NOT NULL,
  `ac_id` int NOT NULL,
  `ab_name` varchar(256) NOT NULL,
  `ab_location` varchar(256) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf16;

-- --------------------------------------------------------

--
-- Table structure for table `area_cluster`
--

CREATE TABLE `area_cluster` (
  `ac_id` int NOT NULL,
  `ac_name` varchar(256) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf16;

-- --------------------------------------------------------

--
-- Table structure for table `area_location_types`
--

CREATE TABLE `area_location_types` (
  `alt_id` int NOT NULL,
  `alt_title` varchar(256) NOT NULL,
  `alt_deleted` tinyint NOT NULL DEFAULT '0',
  `alt_user_types` varchar(256) NOT NULL DEFAULT '{}'
) ENGINE=MyISAM DEFAULT CHARSET=utf16;

--
-- Dumping data for table `area_location_types`
--

INSERT INTO `area_location_types` (`alt_id`, `alt_title`, `alt_deleted`, `alt_user_types`) VALUES
(1, 'Cluster', 0, '{\"user_types\":[1]}'),
(2, 'Building', 0, '{\"user_types\":[1,2]}'),
(3, 'Unit', 0, '{\"user_types\":[1,2,3]}'),
(4, 'Room', 0, '{\"user_types\":[1,2,3,4]}');

-- --------------------------------------------------------

--
-- Table structure for table `area_room`
--

CREATE TABLE `area_room` (
  `ar_id` int NOT NULL,
  `ar_title` varchar(256) NOT NULL,
  `au_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf16;

-- --------------------------------------------------------

--
-- Table structure for table `area_unit`
--

CREATE TABLE `area_unit` (
  `au_id` int NOT NULL,
  `au_title` varchar(256) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf16;

-- --------------------------------------------------------

--
-- Table structure for table `collectief_assignment`
--

CREATE TABLE `collectief_assignment` (
  `ca_id` int NOT NULL,
  `cl_id` int NOT NULL DEFAULT '0',
  `sensor_id` int NOT NULL DEFAULT '0',
  `ca_date` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `ca_user` int NOT NULL DEFAULT '0',
  `ca_deleted` int NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `collectief_assignment`
--

INSERT INTO `collectief_assignment` (`ca_id`, `cl_id`, `sensor_id`, `ca_date`, `ca_user`, `ca_deleted`) VALUES
(1, 3, 22040319, '2023-11-17 12:36:37.733', 0, 0),
(2, 4, 22040320, '2023-11-17 12:37:35.081', 0, 0),
(3, 5, 22050335, '2023-11-17 12:38:08.793', 0, 0),
(4, 5, 22040321, '2023-11-17 12:38:21.201', 0, 0),
(5, 6, 22040322, '2023-11-17 12:38:48.550', 0, 0),
(6, 7, 22040324, '2023-11-17 12:39:34.120', 0, 0),
(7, 8, 22040325, '2023-11-17 12:40:16.062', 0, 0),
(8, 9, 22040326, '2023-11-17 12:41:23.180', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `collectief_boxes`
--

CREATE TABLE `collectief_boxes` (
  `cb_id` int NOT NULL,
  `cb_title` varchar(100) DEFAULT NULL,
  `cb_width` varchar(100) NOT NULL DEFAULT '0',
  `cb_row` int NOT NULL DEFAULT '0',
  `cb_column` int NOT NULL DEFAULT '0',
  `cb_type` varchar(8000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0',
  `cb_type_2` varchar(8000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `cb_deleted` int NOT NULL DEFAULT '0',
  `cb_user` int NOT NULL DEFAULT '0',
  `cb_default` int NOT NULL DEFAULT '0',
  `cb_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `collectief_boxes`
--

INSERT INTO `collectief_boxes` (`cb_id`, `cb_title`, `cb_width`, `cb_row`, `cb_column`, `cb_type`, `cb_type_2`, `cb_deleted`, `cb_user`, `cb_default`, `cb_date`) VALUES
(7, NULL, '0', 0, 0, '[{\"row\":0,\"type\":{\"function\":0,\"chart\":1,\"parametr\":0,\"value_type\":[\"Average\",\"Max\",\"Min\"],\"other\":0,\"location\":\"3\",\"sensor\":\"\",\"source_type\":0},\"column\":0,\"title\":\"B09Z01 Temprature Over Time\",\"title_short\":\"B09Z01\"},{\"row\":1,\"type\":{\"function\":0,\"chart\":1,\"parametr\":0,\"value_type\":[\"Average\",\"Max\",\"Min\"],\"other\":0,\"location\":\"4\",\"sensor\":\"\",\"source_type\":0},\"column\":0,\"title\":\"B09Z02 Temprature Over Time\",\"title_short\":\"B09Z02\"},{\"row\":2,\"type\":{\"function\":0,\"chart\":1,\"parametr\":0,\"value_type\":[\"Average\",\"Max\",\"Min\"],\"other\":0,\"location\":\"5\",\"sensor\":\"\",\"source_type\":0},\"column\":0,\"title\":\"B09Z03 Temprature Over Time\",\"title_short\":\"B09Z03\"},{\"row\":3,\"type\":{\"function\":0,\"chart\":1,\"parametr\":0,\"value_type\":[\"Average\",\"Max\",\"Min\"],\"other\":0,\"location\":\"6\",\"sensor\":\"\",\"source_type\":0},\"column\":0,\"title\":\"B09Z04 Temprature Over Time\",\"title_short\":\"B09Z04\"},{\"row\":4,\"type\":{\"function\":0,\"chart\":1,\"parametr\":0,\"value_type\":[\"Average\",\"Max\",\"Min\"],\"other\":0,\"location\":\"7\",\"sensor\":\"\",\"source_type\":0},\"column\":0,\"title\":\"B09Z05 Temprature Over Time\",\"title_short\":\"B09Z05\"},{\"row\":5,\"type\":{\"function\":0,\"chart\":1,\"parametr\":0,\"value_type\":[\"Average\",\"Max\",\"Min\"],\"other\":0,\"location\":\"8\",\"sensor\":\"\",\"source_type\":0},\"column\":0,\"title\":\"B09Z06 Temprature Over Time\",\"title_short\":\"B09Z06\"},{\"row\":6,\"type\":{\"function\":0,\"chart\":1,\"parametr\":0,\"value_type\":[\"Average\",\"Max\",\"Min\"],\"other\":0,\"location\":\"9\",\"sensor\":\"\",\"source_type\":0},\"column\":0,\"title\":\"B09Z07 Temprature Over Time\",\"title_short\":\"B09Z07\"}]', '[]', 0, 1, 0, '2023-11-17 12:56:10');


-- --------------------------------------------------------

--
-- Table structure for table `collectief_location`
--

CREATE TABLE `collectief_location` (
  `cl_id` int NOT NULL,
  `cl_title` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `cl_type` int NOT NULL DEFAULT '0',
  `cl_location` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '{}',
  `cl_detail` varchar(256) DEFAULT '{}',
  `cl_data` varchar(1024) NOT NULL DEFAULT '{}',
  `cl_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `cl_user` int NOT NULL DEFAULT '0',
  `cl_parent` int NOT NULL,
  `cl_deleted` int NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;


--
-- Dumping data for table `collectief_location`
--

INSERT INTO `collectief_location` (`cl_id`, `cl_title`, `cl_type`, `cl_location`, `cl_detail`, `cl_data`, `cl_date`, `cl_user`, `cl_parent`, `cl_deleted`) VALUES
(1, 'Cluster 1', 1, '{\"lat\":\"-1\",\"lng\":\"-1\"}', '{\"cluster\":\"Cluster 1\",\"building\":\"\",\"unit\":\"\",\"room\":\"\"}', '{}', '2023-11-17 12:26:34', 3, -1, 0),
(2, 'Guy Ourisson Building (GOB)', 2, '{\"lat\":\"35.1414598117012\",\"lng\":\"33.37997421169489\"}', '{\"cluster\":\"Cluster 1\",\"building\":\"Guy Ourisson Building (GOB)\",\"unit\":\"\",\"room\":\"\"}', '{}', '2023-11-17 12:27:42', 3, 1, 0),
(3, 'B09Z01', 3, '{\"lat\":\"-1\",\"lng\":\"-1\"}', '{\"cluster\":\"Cluster 1\",\"building\":\"Guy Ourisson Building (GOB)\",\"unit\":\"\",\"room\":\"\"}', '{}', '2023-11-17 12:30:08', 1, 10, 0),
(4, 'B09Z02', 3, '{\"lat\":\"-1\",\"lng\":\"-1\"}', '{\"cluster\":\"Cluster 1\",\"building\":\"Guy Ourisson Building (GOB)\",\"unit\":\"\",\"room\":\"\"}', '{}', '2023-11-17 12:30:37', 1, 10, 0),
(5, 'B09Z03', 3, '{\"lat\":\"-1\",\"lng\":\"-1\"}', '{\"cluster\":\"Cluster 1\",\"building\":\"Guy Ourisson Building (GOB)\",\"unit\":\"\",\"room\":\"\"}', '{}', '2023-11-17 12:30:52', 1, 10, 0),
(6, 'B09Z04', 3, '{\"lat\":\"-1\",\"lng\":\"-1\"}', '{\"cluster\":\"Cluster 1\",\"building\":\"Guy Ourisson Building (GOB)\",\"unit\":\"\",\"room\":\"\"}', '{}', '2023-11-17 12:31:03', 1, 10, 0),
(7, 'B09Z05', 3, '{\"lat\":\"-1\",\"lng\":\"-1\"}', '{\"cluster\":\"Cluster 1\",\"building\":\"Guy Ourisson Building (GOB)\",\"unit\":\"\",\"room\":\"\"}', '{}', '2023-11-17 12:31:24', 1, 10, 0),
(8, 'B09Z06', 3, '{\"lat\":\"-1\",\"lng\":\"-1\"}', '{\"cluster\":\"Cluster 1\",\"building\":\"Guy Ourisson Building (GOB)\",\"unit\":\"\",\"room\":\"\"}', '{}', '2023-11-17 12:32:26', 1, 10, 0),
(9, 'B09Z07', 3, '{\"lat\":\"-1\",\"lng\":\"-1\"}', '{\"cluster\":\"Cluster 1\",\"building\":\"Guy Ourisson Building (GOB)\",\"unit\":\"\",\"room\":\"\"}', '{}', '2023-11-17 12:32:43', 1, 10, 0),
(10, 'Guy Ourisson Building (GOB)', 2, '{\"lat\":\"35.1414598117012\",\"lng\":\"33.37997421169489\"}', '{\"cluster\":\"Cluster 1\",\"building\":\"Guy Ourisson Building (GOB)\",\"unit\":\"\",\"room\":\"\"}', '{}', '2023-11-17 12:27:42', 2, 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `collectief_location_access`
--

CREATE TABLE `collectief_location_access` (
  `cla_id` int NOT NULL,
  `cl_id` int NOT NULL,
  `cla_user` int NOT NULL,
  `cla_deleted` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf16;

-- --------------------------------------------------------

--
-- Table structure for table `measure_types`
--

CREATE TABLE `measure_types` (
  `measure_id` int NOT NULL,
  `measure_kind` varchar(255) DEFAULT NULL,
  `measure_name` varchar(255) DEFAULT NULL,
  `measure_equal` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `measure_types`
--

INSERT INTO `measure_types` (`measure_id`, `measure_kind`, `measure_name`, `measure_equal`) VALUES
(1, 'TVOC', 'TVOC', 'tvoc_1'),
(2, 'Mass', 'PM 1 (MASS)', 'pm_0'),
(3, 'Mass', 'PM 2.5 (MASS)', 'pm_1'),
(4, 'Mass', 'PM 4 (MASS)', 'pm_2'),
(5, 'Mass', 'PM 10 (MASS)', 'pm_3'),
(6, 'CO2', 'CO2', 'co2_1'),
(7, 'Voltage', 'Battery (V)', 'battery_0'),
(8, 'Temperature', 'Cell temperature', 'press_0'),
(9, 'Pressure', 'Atm. pressure', 'press_1'),
(10, 'Temperature', 'Air temperature', 't_rh_0'),
(11, 'Humidity', 'Relative humidity', 't_rh_1'),
(12, 'Lux', 'Lux 5', 'lux5_0'),
(13, 'Lux', 'Lux 4', 'lux4_0'),
(14, 'Lux', 'Lux 3', 'lux3_0'),
(15, 'Lux', 'Lux 2', 'lux2_0'),
(16, 'Lux', 'Lux 1', 'lux1_0');

-- --------------------------------------------------------

--
-- Table structure for table `node_220403690`
--

CREATE TABLE `node_220403690` (
  `id` int DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT NULL,
  `sensor_type` varchar(255) DEFAULT NULL,
  `channel` varchar(255) DEFAULT NULL,
  `measure_name` varchar(255) DEFAULT NULL,
  `measure_var` varchar(255) DEFAULT NULL,
  `measure_kind` varchar(255) DEFAULT NULL,
  `is_external` int DEFAULT NULL,
  `is_calibrated` int DEFAULT NULL,
  `measure_value` varchar(255) DEFAULT NULL,
  `sensor_serial` int DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `node_per_quarter`
--

CREATE TABLE `node_per_quarter` (
  `nph_id` bigint NOT NULL,
  `nph_cl_id` int NOT NULL DEFAULT '0',
  `nph_max` varchar(10) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `nph_min` varchar(10) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `nph_avg` varchar(10) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `nph_kind` varchar(50) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `nph_name` varchar(50) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `nph_from` varchar(25) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `nph_to` varchar(25) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `nph_from2` varchar(25) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `nph_to2` varchar(25) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `nph_unixtime` bigint NOT NULL DEFAULT '0',
  `sensor_serial` varchar(20) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `nph_status` int NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf16;

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `nt_id` int NOT NULL,
  `nt_value` varchar(15) NOT NULL,
  `nte_id` int NOT NULL,
  `nt_operation` varchar(20) NOT NULL,
  `nt_user` int NOT NULL DEFAULT '0',
  `nt_importance` int NOT NULL DEFAULT '0',
  `nt_deleted` int NOT NULL DEFAULT '0',
  `nt_active` int NOT NULL DEFAULT '1',
  `nt_default` int NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification_base`
--

CREATE TABLE `notification_base` (
  `nt_id` int NOT NULL,
  `nt_value` varchar(15) NOT NULL,
  `nt_value_default` int NOT NULL DEFAULT '0',
  `nt_type` int NOT NULL,
  `nt_operation` varchar(20) NOT NULL,
  `nt_operation_default` int DEFAULT '0',
  `nt_user` int NOT NULL DEFAULT '0',
  `nt_deleted` int NOT NULL DEFAULT '0',
  `nt_is_default` int NOT NULL DEFAULT '0',
  `nte_id` int NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification_default`
--

CREATE TABLE `notification_default` (
  `nt_id` int NOT NULL,
  `nt_value` varchar(15) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `nt_type` int NOT NULL,
  `nt_operation` varchar(20) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `nt_user` int NOT NULL DEFAULT '0',
  `nt_deleted` int NOT NULL DEFAULT '0',
  `nt_active` int NOT NULL DEFAULT '1',
  `nt_importance` int NOT NULL DEFAULT '0',
  `nte_id` int NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `notification_default` (`nt_id`, `nt_value`, `nt_type`, `nt_operation`, `nt_user`, `nt_deleted`, `nt_active`, `nt_importance`, `nte_id`) VALUES
(1, '40', 0, '0', 0, 0, 0, 0, 1),
(2, '2', 1, '0', 0, 0, 0, 0, 0),
(3, '3', 2, '2', 0, 0, 0, 0, 1),
(4, '1000', 3, '2', 0, 0, 0, 0, 2),
(5, '2000', 4, '0', 0, 0, 0, 0, 2),
(6, '80', 5, '0', 0, 0, 0, 0, 0);
-- --------------------------------------------------------

--
-- Table structure for table `notification_messages`
--

CREATE TABLE `notification_messages` (
  `nm_id` int NOT NULL,
  `nt_id` int NOT NULL,
  `nm_value` int NOT NULL,
  `nm_message` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `nm_seen` int NOT NULL DEFAULT '0',
  `nm_deleted` int NOT NULL DEFAULT '0',
  `nm_user` int NOT NULL DEFAULT '0',
  `nt_date` bigint NOT NULL DEFAULT '0',
  `nt_date2` bigint NOT NULL DEFAULT '0',
  `nm_sensor_id` varchar(20) CHARACTER SET utf16 COLLATE utf16_general_ci NOT NULL,
  `nm_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `nm_archived` int NOT NULL DEFAULT '0',
  `nm_type` int NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification_messages_old`
--

CREATE TABLE `notification_messages_old` (
  `nm_id` int NOT NULL,
  `nt_id` int NOT NULL,
  `nm_value` int NOT NULL,
  `nm_message` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `nm_seen` int NOT NULL DEFAULT '0',
  `nm_deleted` int NOT NULL DEFAULT '0',
  `nm_user` int NOT NULL DEFAULT '0',
  `nt_date` bigint NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification_types`
--

CREATE TABLE `notification_types` (
  `nte_id` int NOT NULL,
  `nte_value` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `nte_deleted` int NOT NULL DEFAULT '0',
  `measure_id` int NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `notification_types` (`nte_id`, `nte_value`, `nte_deleted`, `measure_id`) VALUES
(8, 'Indoor humidity', 0, 11),
(1, 'Indoor temperature', 0, 10),
(2, 'Pressure', 0, 9),
(3, 'CO2', 0, 6),
(4, 'Noise', 0, 0),
(5, 'Outdoor humidity', 0, 11),
(6, 'Outdoor temperature', 0, 10),
(7, 'Sensors status', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `schedule`
--

CREATE TABLE `schedule` (
  `sc_id` int NOT NULL,
  `sc_schedule` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `user_id` int NOT NULL,
  `sc_deleted` int NOT NULL DEFAULT '0',
  `sc_location` int NOT NULL DEFAULT '0',
  `sc_type` int NOT NULL DEFAULT '0',
  `sc_active` int NOT NULL DEFAULT '1',
  `sc_mode` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `schedule_poll`
--

CREATE TABLE `schedule_poll` (
  `sp_id` int NOT NULL,
  `sp_text` varchar(5000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `sp_value` int NOT NULL DEFAULT '0',
  `sp_deleted` int NOT NULL DEFAULT '0',
  `sp_date` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `sp_ip` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `sensors_list`
--

CREATE TABLE `sensors_list` (
  `sl_id` int NOT NULL,
  `sl_sensor` int NOT NULL DEFAULT '0',
  `sl_status` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE `session` (
  `s_id` int NOT NULL,
  `s_ip` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `s_first_time` bigint NOT NULL,
  `s_last_time` bigint NOT NULL,
  `s_info` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `s_user_id` int NOT NULL,
  `s_token` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int UNSIGNED NOT NULL,
  `email` varchar(100) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `phone_number` varchar(100) DEFAULT NULL,
  `password` text,
  `is_active` tinyint NOT NULL DEFAULT '0',
  `token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_type` int DEFAULT '0',
  `is_technical_support` int NOT NULL DEFAULT '0',
  `user_pic` varchar(100) DEFAULT NULL,
  `owner` int DEFAULT '0',
  `is_admin` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `fullname`, `phone_number`, `password`, `is_active`, `token`, `created_at`, `updated_at`, `user_type`, `is_technical_support`, `user_pic`, `owner`, `is_admin`) VALUES
(1, 'collectief4@gmail.com', 'sgz', NULL, '25d55ad283aa400af464c76d713c07ad', 1, '1de57bbafded83ce3774ce0482f42bc0e', '2020-11-03 13:14:36', '2023-04-15 08:45:46', 4, 1, NULL, 0, 1),
(2, 'javanshah8@gmail.com', NULL, NULL, '15ffa689802bc0ac23b80e26763556bd', 1, '22454296103d0291568027b6a289d14da', '2020-11-04 02:21:31', '2021-11-03 05:32:16', 0, 0, NULL, 0, 0),
(3, 'm.naghiaei@gmail.com', NULL, NULL, '62e6cdfc22e8d28559cd112c851c126f', 1, NULL, '2020-11-05 04:10:56', '2021-11-03 05:32:16', 0, 0, NULL, 0, 0),
(5, 'test@gmail.com', 'ehsan naghiaei', '2134659168', '25d55ad283aa400af464c76d713c07ad', 1, NULL, '2020-11-08 18:02:27', '2022-01-02 05:15:07', 0, 0, NULL, 0, 0),
(6, 'Pontus.rosengren@virtual.se', 'Pontus Rosengren', '123456789', '25d55ad283aa400af464c76d713c07ad', 1, '69e9c4153e2974abea4601ed099e3d528', '2020-11-09 08:53:01', '2021-11-03 05:32:16', 0, 0, NULL, 0, 0),
(7, 'jose-maria.sabater@scania.com', NULL, NULL, '25d55ad283aa400af464c76d713c07ad', 1, NULL, '2020-11-09 09:17:26', '2022-01-02 06:40:36', 0, 0, NULL, 0, 0),
(8, 'killerking782@gmail.com', 'sina', NULL, '25d55ad283aa400af464c76d713c07ad', 1, NULL, '2020-11-09 17:15:22', '2021-12-24 05:01:37', 0, 0, NULL, 0, 0),
(9, 'jorgen.mossberg@virtual.se', 'Jörgen Mossberg', '+46722543564', '179980ab1eb12c6703844391e7088cf0', 1, NULL, NULL, '2021-11-03 05:32:16', 0, 0, NULL, 0, 0),
(11, 'm.naghiaeikari@gmail.com', 'Ehsan', '', '62e6cdfc22e8d28559cd112c851c126f', 1, NULL, NULL, '2021-11-03 05:32:16', 0, 0, NULL, 0, 0),
(13, 'sales@virtual.se', 'sales virtual', '123456789', '14ea4022a4118ace1e9e34674a855086', 1, NULL, NULL, '2021-11-03 05:32:16', 0, 0, NULL, 0, 0),
(14, 'juan-luis.jimenez.sanchez@scania.com', 'Juan-Luis Jimenez', '+46700869151', '067d5a686155987c4f41c73f6fd21c5e', 1, '141e78cac12392e7c84241a016611c21c6', NULL, '2021-11-03 05:32:16', 0, 0, NULL, 0, 0),
(17, 'johan_z.karlsson@scania.com', 'Johan Karlsson', '', '25d55ad283aa400af464c76d713c07ad', 1, NULL, NULL, '2021-11-03 05:32:16', 0, 0, NULL, 0, 0),
(18, 'linda.x.svensson@scania.com', 'Linda Svensson', '', '25d55ad283aa400af464c76d713c07ad', 1, NULL, NULL, '2021-11-03 05:32:16', 0, 0, NULL, 0, 0),
(19, 'rodrigo.silva.soares@scania.com', 'Rodrigo Silva', '', '25d55ad283aa400af464c76d713c07ad', 1, NULL, NULL, '2021-11-03 05:32:16', 0, 0, NULL, 0, 0),
(20, 'shahin.developer7@gmail.com', 'Shahin Mirzaei', '', '25d55ad283aa400af464c76d713c07ad', 1, NULL, NULL, '2021-11-03 05:32:16', 0, 0, NULL, 0, 0),
(21, 'gabrijella.matic@scania.com', 'Gabrijella Matic', '', '62e6cdfc22e8d28559cd112c851c126f', 1, NULL, NULL, '2021-11-03 05:32:16', 0, 0, NULL, 0, 0),
(22, 'flower1@yahoo.com', 'flower1', '09930934725', '62c8ad0a15d9d1ca38d5dee762a16e01', 1, NULL, NULL, '2022-01-02 05:16:01', 0, 0, NULL, 0, 0),
(23, 'flower3@yahoo.com', 'flower3', '09930980987', '62c8ad0a15d9d1ca38d5dee762a16e01', 1, NULL, NULL, '2021-11-03 05:32:16', 0, 0, NULL, 0, 0),
(24, 'adell.ahmed@live.se', 'Adell Ahmed', '', '62c8ad0a15d9d1ca38d5dee762a16e01', 1, '246544c06d8897b2b73ccd6d4fcb01ea98', NULL, '2021-11-03 05:32:16', 0, 0, NULL, 0, 0),
(25, 'trmu1701@student.ju.se', 'Murad Trkawi', '', '62c8ad0a15d9d1ca38d5dee762a16e01', 1, NULL, NULL, '2021-11-03 05:32:16', 0, 0, NULL, 0, 0),
(30, 'sgz1376923333@gmail.com', 'sasas', '09127798996', '6c7862691767f3109280e881f80bb7c5', 1, NULL, NULL, NULL, 0, 0, NULL, 0, 0),
(36, 'sgz1376921111111@gmail.com', 'sgz1', '09127798996', '25d55ad283aa400af464c76d713c07ad', 1, NULL, NULL, NULL, 0, 0, NULL, 0, 0),
(37, 'sgz13769211111ww11@gmail.com', 'sgz1', '09127798996', '25d55ad283aa400af464c76d713c07ad', 1, NULL, NULL, NULL, 0, 0, NULL, 0, 0),
(38, 'sgz1376www92@gmail.com', 'sgz137692', '09127798996', '25d55ad283aa400af464c76d713c07ad', 1, NULL, NULL, NULL, 0, 0, NULL, 0, 0),
(39, 'sgz1376911111111112@gmail.com', 'sgz', '09937798996', '25d55ad283aa400af464c76d713c07ad', 1, NULL, NULL, NULL, 0, 0, NULL, 0, 0),
(40, 'sgz137692ddddddddddaa@gmail.com', 'dddddddddddddddddd', '09930934725', '62c8ad0a15d9d1ca38d5dee762a16e01', 1, NULL, NULL, NULL, 0, 0, NULL, 0, 0),
(41, 'sgz137692aaaaasasasas@gmail.com', 'Mahdi', '09930934725', '0eae7ce32991ae8bfc771bb1092ab970', 1, NULL, NULL, NULL, 0, 0, NULL, 0, 0),
(42, 'sgz137692sgz@gmail.com', 'sgz', '09127798996', '25d55ad283aa400af464c76d713c07ad', 1, NULL, NULL, NULL, 0, 0, NULL, 0, 0),
(43, 'ddd', 'ddd', 'ddd', '77963b7a931377ad4ab5ad6a9cd718aa', 0, '067c9474443219f5b089ece8dcc996ad', '2022-02-02 14:40:56', '2022-02-02 14:40:56', 0, 0, NULL, 1, 0),
(44, 'nn', 'nn', 'n', 'eab71244afb687f16d8c4f5ee9d6ef0e', 0, 'b3fa8d694612db04c98435435be423b5', '2022-02-03 16:31:01', '2022-02-03 16:31:01', 0, 0, NULL, 1, 0),
(45, 'shiri@yahoo.com', 'mahdi', '0912', '62c8ad0a15d9d1ca38d5dee762a16e01', 0, '5d778a9ada5304d6d5f0aaa7c0cc22cb', '2023-02-18 08:22:12', '2023-02-18 08:22:12', 0, 0, NULL, 1, 0),
(46, 'collectief1@gmail.com', 'Admin', '0912', '25d55ad283aa400af464c76d713c07ad', 0, 'be074c6d9e94acb7da2063570f086b36', '2023-02-27 15:37:08', '2023-04-16 14:14:07', 1, 0, NULL, 1, 0),
(47, 'collectief2@gmail.com', 'Cluster', NULL, '25d55ad283aa400af464c76d713c07ad', 0, NULL, '2023-03-08 15:01:22', '2023-04-16 14:14:02', 2, 0, NULL, 0, 0),
(48, 'collectief3@gmail.com', 'Facility', NULL, '25d55ad283aa400af464c76d713c07ad', 0, NULL, '2023-04-15 08:47:51', '2023-04-16 14:13:52', 3, 0, NULL, 0, 0),
(49, 'collectief_end1@gmail.com', 'collectief_end1', '0912', '62c8ad0a15d9d1ca38d5dee762a16e01', 0, 'cc9636becd31f1590038531694aef79e', '2023-04-16 10:16:22', '2023-04-16 10:16:22', 0, 0, NULL, 46, 0),
(50, 'collectif_facility@gmail.com', 'collectif_facility', '0912', '25d55ad283aa400af464c76d713c07ad', 0, '937e36a9cda6cee7f856bcb6429746e1', '2023-04-16 10:31:10', '2023-04-16 10:31:10', 3, 0, NULL, 46, 0),
(51, 'collectief_facility2@gmail.com', 'collectief_facility2', '0912', '25d55ad283aa400af464c76d713c07ad', 0, '57d677f932edc88668b28b6cada41072', '2023-04-16 10:34:02', '2023-04-16 10:34:02', 3, 0, NULL, 46, 0),
(52, 'collectief_facility3@gmail.com', 'collectief_facility3', '0914', '25d55ad283aa400af464c76d713c07ad', 0, 'd4a625e3e1056f4ad315fd88bf1c7763', '2023-04-16 10:36:36', '2023-04-16 10:36:36', 3, 0, NULL, 46, 0),
(53, 'collectief_facility3@gmail.com	', 'collectief_facility3', '081', '25d55ad283aa400af464c76d713c07ad', 0, 'cd7cfa044b29efae8b9de4a182c5b0dd', '2023-04-16 10:39:46', '2023-04-16 10:39:46', 3, 0, NULL, 46, 0),
(54, 'collectief_facility5@gmail.com', 'collectief_facility5', '0912', '62c8ad0a15d9d1ca38d5dee762a16e01', 0, '582d098e95b56e9d34e022104b18b60f', '2023-04-16 10:44:02', '2023-04-16 10:44:02', 3, 0, NULL, 46, 0),
(55, 'collectief_facility6@gmail.com', 'collectief_facility6', '0912', '25d55ad283aa400af464c76d713c07ad', 0, '6f1cf7e427d6354f404ec2475b02c71c', '2023-04-16 10:46:32', '2023-04-16 10:49:05', 3, 0, NULL, 46, 0),
(56, 'collectief_yyy@gmail.com', 'collectief_yyy', '0987', '25d55ad283aa400af464c76d713c07ad', 0, '3323df7b773cf9db91b15a03b5944cd8', '2023-04-16 16:02:17', '2023-04-16 16:02:17', 2, 0, NULL, 46, 0),
(57, 'collectief_yyy_b1@gmail.com', 'collectief_yyy_b1', '0987', '25d55ad283aa400af464c76d713c07ad', 0, '4331fdea7a92b4f91f004a13a1abfe0a', '2023-04-16 16:03:13', '2023-04-16 16:03:13', 3, 0, NULL, 46, 0),
(58, 'collectief2_b2@gmail.com', 'collectief2_b2', 'collectief2_b2', '25d55ad283aa400af464c76d713c07ad', 0, '32afc340cb23fa85e842835886b6e683', '2023-04-16 16:16:27', '2023-04-16 16:16:27', 3, 0, NULL, 47, 0),
(59, 'collectief2_b2_u1@gmail.com', 'collectief2_b2_u1', 'collectief2_b2_u1', '25d55ad283aa400af464c76d713c07ad', 0, '4e69ed14d75d6c2d4eeabcfa8e2ef948', '2023-04-16 16:22:26', '2023-04-16 16:22:26', 4, 0, NULL, 58, 0),
(60, 'collectief3_end1@gmail.com', 'collectief3_end1', 'collectief3_end1', '25d55ad283aa400af464c76d713c07ad', 0, '32631db79ebcb4f93db2410aa3daced4', '2023-04-17 13:19:14', '2023-04-17 13:19:14', 4, 0, NULL, 48, 0),
(61, 'collectief3_end2@gmail.com', 'collectief3_end2', '0912', '25d55ad283aa400af464c76d713c07ad', 0, 'b7d3afbbc67366cbd06c3394ea86510d', '2023-04-17 13:20:30', '2023-04-17 13:20:30', 4, 0, NULL, 48, 0),
(62, 'collectief_ssssssssssssssssss@gmail.com', 'collectief_ssssssssssssssssss', '0912', '25d55ad283aa400af464c76d713c07ad', 0, '6824550abf18ef67c068ec08d969861e', '2023-04-17 14:26:27', '2023-04-17 14:26:27', 3, 0, NULL, 48, 0),
(64, 'collectief_ssssssssssssssssss2@gmail.com', 'collectief_ssssssssssssssssss', '0912', '25d55ad283aa400af464c76d713c07ad', 0, '48ab4510a671197b99018f2239f908e6', '2023-04-17 14:55:09', '2023-04-17 14:55:09', 3, 0, NULL, 48, 0),
(65, 'collectief_ssssssssssssssssss23@gmail.com', 'collectief_ssssssssssssssssss', '0912', '25d55ad283aa400af464c76d713c07ad', 0, 'fa2619f88c8b95bec5d7115d90b21582', '2023-04-17 14:55:46', '2023-04-17 14:55:46', 3, 0, NULL, 48, 0),
(66, 'collectiefwwe1@gmail.com', 'collectiefwwe1', '0912', '25d55ad283aa400af464c76d713c07ad', 0, '62d848e20877fa53b4635536783d6d85', '2023-04-17 15:30:28', '2023-04-17 15:30:28', 3, 0, NULL, 48, 0),
(67, 'collectiefwwe111@gmail.com', 'collectiefwwe1', '0912', '25d55ad283aa400af464c76d713c07ad', 0, 'ad81cfe2623d14424d2d8b790aad6fce', '2023-04-17 15:31:21', '2023-04-17 15:31:21', 3, 0, NULL, 48, 0),
(68, 'collectief1vvvvvvvvvvvvv@gmail.com', 'collectief1vvvvvvvvvvvvv', '214324', '25d55ad283aa400af464c76d713c07ad', 0, 'adc49481275570ae7b139873c89ef3c3', '2023-04-17 15:34:12', '2023-04-17 15:34:12', 3, 0, NULL, 48, 0),
(69, 'collectie1f1vvvvvvvvvvvvv@gmail.com', 'collectief1vvvvvvvvvvvvv', '214324', '25d55ad283aa400af464c76d713c07ad', 0, '6e0e368e0a66557985292830608cfcba', '2023-04-17 15:34:53', '2023-04-17 15:34:53', 3, 0, NULL, 48, 0),
(70, 'collectiefssdsd1@gmail.com', 'asd', '21323', '25d55ad283aa400af464c76d713c07ad', 0, '6b483d5fa60c4aa0bb6fd893024783c2', '2023-04-17 15:37:32', '2023-04-17 15:37:32', 3, 0, NULL, 48, 0),
(71, 'collectieasdsadsadasdf1@gmail.com', 'asdsad', '324324', '25d55ad283aa400af464c76d713c07ad', 0, 'd0e8136b93ba89c07f3be55847e436ef', '2023-04-17 15:39:49', '2023-04-17 15:39:49', 3, 0, NULL, 48, 0),
(72, 'dfdcollectiesdfsdf1@gmail.com', 'ew', 'we', '25d55ad283aa400af464c76d713c07ad', 0, '6fefdac6ea9a511859a5bc20ea8b76f7', '2023-04-17 15:41:02', '2023-04-17 15:41:02', 3, 0, NULL, 48, 0),
(74, 'dfdcollectwqwiesdfsdf1@gmail.com', 'ew', 'we', '25d55ad283aa400af464c76d713c07ad', 0, '8dbe482699b2a412541c75442acd12bb', '2023-04-17 15:41:47', '2023-04-17 15:41:47', 3, 0, NULL, 48, 0),
(76, 'dfdcollecwwewtwqwiesdfsdf1@gmail.com', 'ew', 'we', '25d55ad283aa400af464c76d713c07ad', 0, '4924df0633847e1401cd61cfc13e1592', '2023-04-17 15:42:53', '2023-04-17 15:42:53', 3, 0, NULL, 48, 0),
(77, 'dfdcollecwwweewtwqwiesdfsdf1@gmail.com', 'ew', 'we', '25d55ad283aa400af464c76d713c07ad', 0, '32024800b0f6cdd09f91aef4ac0c0589', '2023-04-17 15:44:27', '2023-04-17 15:44:27', 3, 0, NULL, 48, 0),
(80, 'dfdcollecwwwsadasdeewtwqwiesdfsdf1@gmail.com', 'ew', 'we', '25d55ad283aa400af464c76d713c07ad', 0, '75bc2559b92e22271dcef58687299508', '2023-04-17 15:44:46', '2023-04-17 15:44:46', 3, 0, NULL, 48, 0),
(81, 'collectief_xxx_b1_u1@gmail.com', 'collectief_xxx_b1_u1', '0912', '25d55ad283aa400af464c76d713c07ad', 0, '8b1159b76ba3e66381f6b13a02f9f850', '2023-04-19 06:25:48', '2023-04-19 06:25:48', 4, 0, NULL, 46, 0),
(82, 'collectief_xxx_b1_u1vv@gmail.com', 'collectief_xxx_b1_u1vv', '0912', '25d55ad283aa400af464c76d713c07ad', 0, '1e26800b5de5ee8e670d3707e2002d50', '2023-04-19 06:32:18', '2023-04-19 06:32:18', 4, 0, NULL, 46, 0),
(84, 'collectief_ddv@gmail.com', 'collectief_xxx_b1_u1vv', '0912', '25d55ad283aa400af464c76d713c07ad', 0, '5b33fafaa7c7014d19ef223609d90ef5', '2023-04-19 06:35:35', '2023-04-19 06:35:35', 4, 0, NULL, 46, 0),
(85, 'collectief1_facility@gmail.com', 'ddd', 'ddd', '25d55ad283aa400af464c76d713c07ad', 0, 'ab41cc394b202af522b305c5a9cc14ea', '2023-05-19 06:35:07', '2023-05-19 06:35:07', 3, 0, NULL, 47, 0),
(86, 'collectief5@gmail.com', 'collectief5', '44', '25d55ad283aa400af464c76d713c07ad', 0, 'c103d97deba9c266a0d2a356a68be5cc', '2023-05-20 13:22:06', '2023-05-20 13:22:06', 3, 0, NULL, 47, 0),
(87, 'collectief21111@gmail.com', 'ccc', '222', '25d55ad283aa400af464c76d713c07ad', 0, 'e0cd1977301328f89cc37e69145caeb0', '2023-05-20 15:44:46', '2023-05-20 15:44:46', 3, 0, NULL, 47, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users_detail`
--

CREATE TABLE `users_detail` (
  `ud_id` int NOT NULL,
  `ud_country` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `ud_address` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `ud_position` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `user_id` int NOT NULL DEFAULT '0',
  `location_id` int NOT NULL DEFAULT '0',
  `location_detail` text NOT NULL,
  `calculation_data` varchar(1024) NOT NULL DEFAULT '{}'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users_detail`
--

INSERT INTO `users_detail` (`ud_id`, `ud_country`, `ud_address`, `ud_position`, `user_id`, `location_id`, `location_detail`, `calculation_data`) VALUES
(1, 'ddd', 'ddd', 'ddd', 48, 10, '', '{\"chart\":{\"item1\":{\"val\":\"15\",\"title\":\"Energy Efficiency\"},\"item2\":{\"val\":\"40\",\"title\":\"Energy Flexibility and Storage\"},\"item3\":{\"val\":\"10\",\"title\":\"Comfort\"},\"item4\":{\"val\":\"40\",\"title\":\"Convenience\"},\"item5\":{\"val\":\"60\",\"title\":\"Health,Well-being and Accessibility\"},\"item6\":{\"val\":\"87\",\"title\":\"Maintenance and Fault Prediction\"},\"item7\":{\"val\":\"20\",\"title\":\"Information to Occupants\"}},\"total_sri\":\"45\",\"class_sri\":\"G\"}'),
(2, 'n', 'n', 'n', 44, 10, '', '{\"chart\":{\"item1\":{\"val\":\"15\",\"title\":\"Energy Efficiency\"},\"item2\":{\"val\":\"40\",\"title\":\"Energy Flexibility and Storage\"},\"item3\":{\"val\":\"10\",\"title\":\"Comfort\"},\"item4\":{\"val\":\"40\",\"title\":\"Convenience\"},\"item5\":{\"val\":\"60\",\"title\":\"Health,Well-being and Accessibility\"},\"item6\":{\"val\":\"87\",\"title\":\"Maintenance and Fault Prediction\"},\"item7\":{\"val\":\"20\",\"title\":\"Information to Occupants\"}},\"total_sri\":\"45\",\"class_sri\":\"G\"}'),
(3, '', '', '', 47, 1, '', '{\"chart\":{\"item1\":{\"val\":\"15\",\"title\":\"Energy Efficiency\"},\"item2\":{\"val\":\"40\",\"title\":\"Energy Flexibility and Storage\"},\"item3\":{\"val\":\"10\",\"title\":\"Comfort\"},\"item4\":{\"val\":\"40\",\"title\":\"Convenience\"},\"item5\":{\"val\":\"60\",\"title\":\"Health,Well-being and Accessibility\"},\"item6\":{\"val\":\"87\",\"title\":\"Maintenance and Fault Prediction\"},\"item7\":{\"val\":\"20\",\"title\":\"Information to Occupants\"}},\"total_sri\":\"45\",\"class_sri\":\"G\"}'),
(4, '', '', '', 55, 8, '', '{\"chart\":{\"item1\":{\"val\":\"15\",\"title\":\"Energy Efficiency\"},\"item2\":{\"val\":\"40\",\"title\":\"Energy Flexibility and Storage\"},\"item3\":{\"val\":\"10\",\"title\":\"Comfort\"},\"item4\":{\"val\":\"40\",\"title\":\"Convenience\"},\"item5\":{\"val\":\"60\",\"title\":\"Health,Well-being and Accessibility\"},\"item6\":{\"val\":\"87\",\"title\":\"Maintenance and Fault Prediction\"},\"item7\":{\"val\":\"20\",\"title\":\"Information to Occupants\"}},\"total_sri\":\"45\",\"class_sri\":\"G\"}'),
(5, '', '', '', 56, 2, '', '{\"chart\":{\"item1\":{\"val\":\"15\",\"title\":\"Energy Efficiency\"},\"item2\":{\"val\":\"40\",\"title\":\"Energy Flexibility and Storage\"},\"item3\":{\"val\":\"10\",\"title\":\"Comfort\"},\"item4\":{\"val\":\"40\",\"title\":\"Convenience\"},\"item5\":{\"val\":\"60\",\"title\":\"Health,Well-being and Accessibility\"},\"item6\":{\"val\":\"87\",\"title\":\"Maintenance and Fault Prediction\"},\"item7\":{\"val\":\"20\",\"title\":\"Information to Occupants\"}},\"total_sri\":\"45\",\"class_sri\":\"G\"}'),
(6, '', '', '', 57, 7, '', '{\"chart\":{\"item1\":{\"val\":\"15\",\"title\":\"Energy Efficiency\"},\"item2\":{\"val\":\"40\",\"title\":\"Energy Flexibility and Storage\"},\"item3\":{\"val\":\"10\",\"title\":\"Comfort\"},\"item4\":{\"val\":\"40\",\"title\":\"Convenience\"},\"item5\":{\"val\":\"60\",\"title\":\"Health,Well-being and Accessibility\"},\"item6\":{\"val\":\"87\",\"title\":\"Maintenance and Fault Prediction\"},\"item7\":{\"val\":\"20\",\"title\":\"Information to Occupants\"}},\"total_sri\":\"85\",\"class_sri\":\"G\"}'),
(7, '', '', '', 58, 17, '', '{\"chart\":{\"item1\":{\"val\":\"15\",\"title\":\"Energy Efficiency\"},\"item2\":{\"val\":\"40\",\"title\":\"Energy Flexibility and Storage\"},\"item3\":{\"val\":\"10\",\"title\":\"Comfort\"},\"item4\":{\"val\":\"40\",\"title\":\"Convenience\"},\"item5\":{\"val\":\"60\",\"title\":\"Health,Well-being and Accessibility\"},\"item6\":{\"val\":\"87\",\"title\":\"Maintenance and Fault Prediction\"},\"item7\":{\"val\":\"20\",\"title\":\"Information to Occupants\"}},\"total_sri\":\"5\",\"class_sri\":\"G\"}'),
(8, '', '', '', 59, 18, '', '{\"chart\":{\"item1\":{\"val\":\"15\",\"title\":\"Energy Efficiency\"},\"item2\":{\"val\":\"40\",\"title\":\"Energy Flexibility and Storage\"},\"item3\":{\"val\":\"10\",\"title\":\"Comfort\"},\"item4\":{\"val\":\"40\",\"title\":\"Convenience\"},\"item5\":{\"val\":\"60\",\"title\":\"Health,Well-being and Accessibility\"},\"item6\":{\"val\":\"87\",\"title\":\"Maintenance and Fault Prediction\"},\"item7\":{\"val\":\"20\",\"title\":\"Information to Occupants\"}},\"total_sri\":\"45\",\"class_sri\":\"G\"}'),
(9, '', '', '', 60, 25, '', '{\"chart\":{\"item1\":{\"val\":\"15\",\"title\":\"Energy Efficiency\"},\"item2\":{\"val\":\"40\",\"title\":\"Energy Flexibility and Storage\"},\"item3\":{\"val\":\"10\",\"title\":\"Comfort\"},\"item4\":{\"val\":\"40\",\"title\":\"Convenience\"},\"item5\":{\"val\":\"60\",\"title\":\"Health,Well-being and Accessibility\"},\"item6\":{\"val\":\"87\",\"title\":\"Maintenance and Fault Prediction\"},\"item7\":{\"val\":\"20\",\"title\":\"Information to Occupants\"}},\"total_sri\":\"45\",\"class_sri\":\"G\"}'),
(10, '', '', '', 61, 26, '', '{\"chart\":{\"item1\":{\"val\":\"15\",\"title\":\"Energy Efficiency\"},\"item2\":{\"val\":\"40\",\"title\":\"Energy Flexibility and Storage\"},\"item3\":{\"val\":\"10\",\"title\":\"Comfort\"},\"item4\":{\"val\":\"40\",\"title\":\"Convenience\"},\"item5\":{\"val\":\"60\",\"title\":\"Health,Well-being and Accessibility\"},\"item6\":{\"val\":\"87\",\"title\":\"Maintenance and Fault Prediction\"},\"item7\":{\"val\":\"20\",\"title\":\"Information to Occupants\"}},\"total_sri\":\"45\",\"class_sri\":\"G\"}'),
(11, '', NULL, NULL, 67, 6, '{}', '{\"chart\":{\"item1\":{\"val\":\"15\",\"title\":\"Energy Efficiency\"},\"item2\":{\"val\":\"40\",\"title\":\"Energy Flexibility and Storage\"},\"item3\":{\"val\":\"10\",\"title\":\"Comfort\"},\"item4\":{\"val\":\"40\",\"title\":\"Convenience\"},\"item5\":{\"val\":\"60\",\"title\":\"Health,Well-being and Accessibility\"},\"item6\":{\"val\":\"87\",\"title\":\"Maintenance and Fault Prediction\"},\"item7\":{\"val\":\"20\",\"title\":\"Information to Occupants\"}},\"total_sri\":\"45\",\"class_sri\":\"G\"}'),
(12, '', NULL, NULL, 69, 6, '{\"unit\":\"\"}', '{\"chart\":{\"item1\":{\"val\":\"15\",\"title\":\"Energy Efficiency\"},\"item2\":{\"val\":\"40\",\"title\":\"Energy Flexibility and Storage\"},\"item3\":{\"val\":\"10\",\"title\":\"Comfort\"},\"item4\":{\"val\":\"40\",\"title\":\"Convenience\"},\"item5\":{\"val\":\"60\",\"title\":\"Health,Well-being and Accessibility\"},\"item6\":{\"val\":\"87\",\"title\":\"Maintenance and Fault Prediction\"},\"item7\":{\"val\":\"20\",\"title\":\"Information to Occupants\"}},\"total_sri\":\"45\",\"class_sri\":\"G\"}'),
(13, '', NULL, NULL, 70, 6, '{\"unit\":\"\"}', '{\"chart\":{\"item1\":{\"val\":\"15\",\"title\":\"Energy Efficiency\"},\"item2\":{\"val\":\"40\",\"title\":\"Energy Flexibility and Storage\"},\"item3\":{\"val\":\"10\",\"title\":\"Comfort\"},\"item4\":{\"val\":\"40\",\"title\":\"Convenience\"},\"item5\":{\"val\":\"60\",\"title\":\"Health,Well-being and Accessibility\"},\"item6\":{\"val\":\"87\",\"title\":\"Maintenance and Fault Prediction\"},\"item7\":{\"val\":\"20\",\"title\":\"Information to Occupants\"}},\"total_sri\":\"45\",\"class_sri\":\"G\"}'),
(14, '', NULL, NULL, 71, 6, '{\"unit\":\"\"}', '{\"chart\":{\"item1\":{\"val\":\"15\",\"title\":\"Energy Efficiency\"},\"item2\":{\"val\":\"40\",\"title\":\"Energy Flexibility and Storage\"},\"item3\":{\"val\":\"10\",\"title\":\"Comfort\"},\"item4\":{\"val\":\"40\",\"title\":\"Convenience\"},\"item5\":{\"val\":\"60\",\"title\":\"Health,Well-being and Accessibility\"},\"item6\":{\"val\":\"87\",\"title\":\"Maintenance and Fault Prediction\"},\"item7\":{\"val\":\"20\",\"title\":\"Information to Occupants\"}},\"total_sri\":\"35\",\"class_sri\":\"G\"}'),
(15, '', NULL, NULL, 72, 6, '{\"unit\":\"\"}', '{\"chart\":{\"item1\":{\"val\":\"15\",\"title\":\"Energy Efficiency\"},\"item2\":{\"val\":\"40\",\"title\":\"Energy Flexibility and Storage\"},\"item3\":{\"val\":\"10\",\"title\":\"Comfort\"},\"item4\":{\"val\":\"40\",\"title\":\"Convenience\"},\"item5\":{\"val\":\"60\",\"title\":\"Health,Well-being and Accessibility\"},\"item6\":{\"val\":\"87\",\"title\":\"Maintenance and Fault Prediction\"},\"item7\":{\"val\":\"20\",\"title\":\"Information to Occupants\"}},\"total_sri\":\"45\",\"class_sri\":\"G\"}'),
(16, '', NULL, NULL, 74, 6, '{\"unit\":\"\"}', '{\"chart\":{\"item1\":{\"val\":\"15\",\"title\":\"Energy Efficiency\"},\"item2\":{\"val\":\"40\",\"title\":\"Energy Flexibility and Storage\"},\"item3\":{\"val\":\"10\",\"title\":\"Comfort\"},\"item4\":{\"val\":\"40\",\"title\":\"Convenience\"},\"item5\":{\"val\":\"60\",\"title\":\"Health,Well-being and Accessibility\"},\"item6\":{\"val\":\"87\",\"title\":\"Maintenance and Fault Prediction\"},\"item7\":{\"val\":\"20\",\"title\":\"Information to Occupants\"}},\"total_sri\":\"45\",\"class_sri\":\"G\"}'),
(17, '', NULL, NULL, 76, 6, '{\"unit\":\"\"}', '{\"chart\":{\"item1\":{\"val\":\"15\",\"title\":\"Energy Efficiency\"},\"item2\":{\"val\":\"40\",\"title\":\"Energy Flexibility and Storage\"},\"item3\":{\"val\":\"10\",\"title\":\"Comfort\"},\"item4\":{\"val\":\"40\",\"title\":\"Convenience\"},\"item5\":{\"val\":\"60\",\"title\":\"Health,Well-being and Accessibility\"},\"item6\":{\"val\":\"87\",\"title\":\"Maintenance and Fault Prediction\"},\"item7\":{\"val\":\"20\",\"title\":\"Information to Occupants\"}},\"total_sri\":\"75\",\"class_sri\":\"G\"}'),
(18, '', NULL, NULL, 77, 6, '{\"unit\":\"\"}', '{\"chart\":{\"item1\":{\"val\":\"15\",\"title\":\"Energy Efficiency\"},\"item2\":{\"val\":\"40\",\"title\":\"Energy Flexibility and Storage\"},\"item3\":{\"val\":\"10\",\"title\":\"Comfort\"},\"item4\":{\"val\":\"40\",\"title\":\"Convenience\"},\"item5\":{\"val\":\"60\",\"title\":\"Health,Well-being and Accessibility\"},\"item6\":{\"val\":\"87\",\"title\":\"Maintenance and Fault Prediction\"},\"item7\":{\"val\":\"20\",\"title\":\"Information to Occupants\"}},\"total_sri\":\"45\",\"class_sri\":\"G\"}'),
(19, '', NULL, NULL, 80, 6, '{\"building\":\"ZZZ_b1\",\"unit\":\"\",\"cluster\":\"ZZZ\"}', '{\"chart\":{\"item1\":{\"val\":\"15\",\"title\":\"Energy Efficiency\"},\"item2\":{\"val\":\"40\",\"title\":\"Energy Flexibility and Storage\"},\"item3\":{\"val\":\"10\",\"title\":\"Comfort\"},\"item4\":{\"val\":\"40\",\"title\":\"Convenience\"},\"item5\":{\"val\":\"60\",\"title\":\"Health,Well-being and Accessibility\"},\"item6\":{\"val\":\"87\",\"title\":\"Maintenance and Fault Prediction\"},\"item7\":{\"val\":\"20\",\"title\":\"Information to Occupants\"}},\"total_sri\":\"15\",\"class_sri\":\"G\"}'),
(20, '', NULL, NULL, 82, 9, '{\"unit\":\"XXX_b1_u1\",\"building\":\"XXX_b1\",\"cluster\":\"XXX\"}', '{\"chart\":{\"item1\":{\"val\":\"15\",\"title\":\"Energy Efficiency\"},\"item2\":{\"val\":\"40\",\"title\":\"Energy Flexibility and Storage\"},\"item3\":{\"val\":\"10\",\"title\":\"Comfort\"},\"item4\":{\"val\":\"40\",\"title\":\"Convenience\"},\"item5\":{\"val\":\"60\",\"title\":\"Health,Well-being and Accessibility\"},\"item6\":{\"val\":\"87\",\"title\":\"Maintenance and Fault Prediction\"},\"item7\":{\"val\":\"20\",\"title\":\"Information to Occupants\"}},\"total_sri\":\"45\",\"class_sri\":\"G\"}'),
(21, '', NULL, NULL, 84, 9, '{\"unit\":\"XXX_b1_u1\",\"building\":\"XXX_b1\",\"cluster\":\"XXX\"}', '{\"chart\":{\"item1\":{\"val\":\"15\",\"title\":\"Energy Efficiency\"},\"item2\":{\"val\":\"40\",\"title\":\"Energy Flexibility and Storage\"},\"item3\":{\"val\":\"10\",\"title\":\"Comfort\"},\"item4\":{\"val\":\"40\",\"title\":\"Convenience\"},\"item5\":{\"val\":\"60\",\"title\":\"Health,Well-being and Accessibility\"},\"item6\":{\"val\":\"87\",\"title\":\"Maintenance and Fault Prediction\"},\"item7\":{\"val\":\"20\",\"title\":\"Information to Occupants\"}},\"total_sri\":\"45\",\"class_sri\":\"G\"}'),
(23, '', NULL, NULL, 85, 8, '{\"building\":\"XXX_b1\",\"unit\":\"\",\"cluster\":\"XXX\"}', '{}'),
(24, '', NULL, NULL, 86, 29, '{\"building\":\"XXX_b10\",\"unit\":\"\",\"cluster\":\"XXX\"}', '{\"chart\":{\"item1\":{\"val\":\"56\",\"title\":\"Energy Efficiency\"},\"item2\":{\"val\":\"23\",\"title\":\"Energy Flexibility and Storage\"},\"item3\":{\"val\":\"35\",\"title\":\"Comfort\"},\"item4\":{\"val\":\"78\",\"title\":\"Convenience\"},\"item5\":{\"val\":\"43\",\"title\":\"Health,Well-being and Accessibility\"},\"item6\":{\"val\":\"22\",\"title\":\"Maintenance and Fault Prediction\"},\"item7\":{\"val\":\"84\",\"title\":\"Information to Occupants\"}},\"total_sri\":\"89\",\"class_sri\":\"A\"}'),
(25, '', NULL, NULL, 87, 30, '{\"building\":\"XXX_b11\",\"unit\":\"\",\"cluster\":\"XXX\"}', '{}'),
(26, '', NULL, NULL, 1, 10, '{\"building\":\"XXX_b11\",\"unit\":\"\",\"cluster\":\"XXX\"}', '{}');

-- --------------------------------------------------------

--
-- Table structure for table `yd_minimumwages2`
--

CREATE TABLE `yd_minimumwages2` (
  `ydm_id` int NOT NULL,
  `ydm_year` int NOT NULL,
  `ydm_amount` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf16;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `area_building`
--
ALTER TABLE `area_building`
  ADD PRIMARY KEY (`ab_id`);

--
-- Indexes for table `area_cluster`
--
ALTER TABLE `area_cluster`
  ADD PRIMARY KEY (`ac_id`);

--
-- Indexes for table `area_location_types`
--
ALTER TABLE `area_location_types`
  ADD PRIMARY KEY (`alt_id`);

--
-- Indexes for table `area_room`
--
ALTER TABLE `area_room`
  ADD PRIMARY KEY (`ar_id`);

--
-- Indexes for table `area_unit`
--
ALTER TABLE `area_unit`
  ADD PRIMARY KEY (`au_id`);

--
-- Indexes for table `collectief_assignment`
--
ALTER TABLE `collectief_assignment`
  ADD PRIMARY KEY (`ca_id`),
  ADD KEY `cl_id` (`cl_id`),
  ADD KEY `sensor_id` (`sensor_id`);

--
-- Indexes for table `collectief_boxes`
--
ALTER TABLE `collectief_boxes`
  ADD PRIMARY KEY (`cb_id`);


--
-- Indexes for table `collectief_location`
--
ALTER TABLE `collectief_location`
  ADD PRIMARY KEY (`cl_id`);

--
-- Indexes for table `collectief_location_access`
--
ALTER TABLE `collectief_location_access`
  ADD PRIMARY KEY (`cla_id`);

--
-- Indexes for table `measure_types`
--
ALTER TABLE `measure_types`
  ADD PRIMARY KEY (`measure_id`);

--
-- Indexes for table `node_220403690`
--
ALTER TABLE `node_220403690`
  ADD KEY `timestamp` (`timestamp`),
  ADD KEY `measure_kind` (`measure_kind`(250)),
  ADD KEY `measure_name` (`measure_name`(250)),
  ADD KEY `sensor_serial` (`sensor_serial`);

--
-- Indexes for table `node_per_quarter`
--
ALTER TABLE `node_per_quarter`
  ADD PRIMARY KEY (`nph_id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`nt_id`);

--
-- Indexes for table `notification_base`
--
ALTER TABLE `notification_base`
  ADD PRIMARY KEY (`nt_id`);

--
-- Indexes for table `notification_default`
--
ALTER TABLE `notification_default`
  ADD PRIMARY KEY (`nt_id`);

--
-- Indexes for table `notification_messages_old`
--
ALTER TABLE `notification_messages_old`
  ADD PRIMARY KEY (`nm_id`);

--
-- Indexes for table `notification_messages_old`
--
ALTER TABLE `notification_messages`
  ADD PRIMARY KEY (`nm_id`);

--
-- Indexes for table `notification_messages_old`
--
ALTER TABLE `sensors_list`
  ADD PRIMARY KEY (`sl_id`);


--
-- Indexes for table `notification_types`
--
ALTER TABLE `notification_types`
  ADD PRIMARY KEY (`nte_id`);

--
-- Indexes for table `schedule`
--
ALTER TABLE `schedule`
  ADD PRIMARY KEY (`sc_id`);

--
-- Indexes for table `schedule_poll`
--
ALTER TABLE `schedule_poll`
  ADD PRIMARY KEY (`sp_id`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`s_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `token` (`token`);

--
-- Indexes for table `users_detail`
--
ALTER TABLE `users_detail`
  ADD PRIMARY KEY (`ud_id`);

--
-- Indexes for table `yd_minimumwages2`
--
ALTER TABLE `yd_minimumwages2`
  ADD PRIMARY KEY (`ydm_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `area_building`
--
ALTER TABLE `area_building`
  MODIFY `ab_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `area_cluster`
--
ALTER TABLE `area_cluster`
  MODIFY `ac_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `area_cluster`
--
ALTER TABLE `sensors_list`
  MODIFY `sl_id` int NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `area_location_types`
--
ALTER TABLE `area_location_types`
  MODIFY `alt_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `area_room`
--
ALTER TABLE `area_room`
  MODIFY `ar_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `area_unit`
--
ALTER TABLE `area_unit`
  MODIFY `au_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `collectief_assignment`
--
ALTER TABLE `collectief_assignment`
  MODIFY `ca_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `collectief_boxes`
--
ALTER TABLE `collectief_boxes`
  MODIFY `cb_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `collectief_location`
--
ALTER TABLE `collectief_location`
  MODIFY `cl_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `collectief_location_access`
--
ALTER TABLE `collectief_location_access`
  MODIFY `cla_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `measure_types`
--
ALTER TABLE `measure_types`
  MODIFY `measure_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `node_per_quarter`
--
ALTER TABLE `node_per_quarter`
  MODIFY `nph_id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `nt_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification_base`
--
ALTER TABLE `notification_base`
  MODIFY `nt_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification_default`
--
ALTER TABLE `notification_default`
  MODIFY `nt_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification_messages_old`
--
ALTER TABLE `notification_messages_old`
  MODIFY `nm_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification_types`
--
ALTER TABLE `notification_types`
  MODIFY `nte_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `schedule`
--
ALTER TABLE `schedule`
  MODIFY `sc_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `schedule_poll`
--
ALTER TABLE `schedule_poll`
  MODIFY `sp_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `session`
--
ALTER TABLE `session`
  MODIFY `s_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT for table `notification_messages`
--

ALTER TABLE `notification_messages`
  MODIFY `nm_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users_detail`
--
ALTER TABLE `users_detail`
  MODIFY `ud_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `yd_minimumwages2`
--
ALTER TABLE `yd_minimumwages2`
  MODIFY `ydm_id` int NOT NULL AUTO_INCREMENT;
COMMIT;
