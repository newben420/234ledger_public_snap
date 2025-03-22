-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 22, 2025 at 08:46 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ledger`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` text DEFAULT NULL,
  `last_logged_in` text DEFAULT NULL,
  `last_modified` text DEFAULT NULL,
  `modules` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`modules`)),
  `read_only` int(11) NOT NULL,
  `jwt` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `last_logged_in`, `last_modified`, `modules`, `read_only`, `jwt`) VALUES
(1, 'root', '6a010a1b983ad6072965b3abf7a75bead1c10770b1f70b4b8db75e131caa9afd', '1742628486495', '1731480182848', '[2,1,3,5,7,4,6]', 0, '05d7d8d4-fd25-40d6-8088-aec159930bf4'),
(3, 'bennie', '6a010a1b983ad6072965b3abf7a75bead1c10770b1f70b4b8db75e131caa9afd', '1731137999522', '1731138097244', '[2]', 0, 'a3417e2d-5be4-4a83-8c7c-8fdcde280a1d');

-- --------------------------------------------------------

--
-- Table structure for table `admin_module`
--

CREATE TABLE `admin_module` (
  `id` int(11) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `icon` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_module`
--

INSERT INTO `admin_module` (`id`, `slug`, `icon`) VALUES
(1, 'admin', 'bi  bi-house-gear-fill'),
(2, 'post', 'bi bi-list-ul'),
(3, 'approve', 'bi bi-patch-check-fill'),
(4, 'email', 'bi bi-envelope-at-fill'),
(5, 'current', 'bi bi-calendar-check-fill'),
(6, 'stats', 'bi bi-speedometer'),
(7, 'query', 'bi bi-database');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `title_slug` varchar(100) DEFAULT NULL,
  `last_modified` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `title`, `title_slug`, `last_modified`) VALUES
(1, 'Daily Update', 'daily-show', '1731740524165'),
(2, 'Weekly Highlights', 'monthly-stuff', '1731740572613'),
(4, 'Monthly Recap', 'monthly-recap', '1731740590083'),
(5, 'Yearly Diary', 'yearly-diary', '1731740623484');

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `post_id` int(11) DEFAULT NULL,
  `visibility` int(11) DEFAULT NULL,
  `commenter` varchar(100) NOT NULL,
  `contact` text DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `last_modified` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`id`, `post_id`, `visibility`, `commenter`, `contact`, `comment`, `last_modified`) VALUES
(10, 3, 1, 'bennie', 'gbiangb@gmail.com', 'hello world 1', '2487924803'),
(14, 8, 1, '', 'gbiangb@gmail.com', 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human h', '1731965596476'),
(15, 8, 1, 'Bennie', 'gbiangb@gmail.com', 'No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.', '1731965643662'),
(16, 8, 1, 'gbiangb', 'gbiangb@gmail.com', 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?', '1731965910565');

-- --------------------------------------------------------

--
-- Table structure for table `content`
--

CREATE TABLE `content` (
  `id` int(11) NOT NULL,
  `post_id` int(11) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `body` text DEFAULT NULL,
  `visibility` int(11) DEFAULT NULL,
  `last_modified` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `content`
--

INSERT INTO `content` (`id`, `post_id`, `section_id`, `body`, `visibility`, `last_modified`) VALUES
(3, 3, 1, '<p>Some stuff went down today... hopefully, nothing keeps up.</p>', 1, '1731878634484'),
(9, 4, 1, '<p>ok</p><p></p><blockquote>Hello world okayyy</blockquote>', 1, '1731487992559'),
(24, 9, 1, '<p>ddez nuts</p>', 1, '1731487802370'),
(25, 8, 1, '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>', 1, '1732157668079'),
(26, 8, 1, '<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>', 1, '1732157668079'),
(30, 10, 1, '<p>efefefeefefefe</p>', 1, '1732157654201'),
(31, 8, 3, '<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium <a href=\"https://active.com\" rel=\"noopener nofollow noreferrer\" target=\"_blank\">doloremque</a> laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p><p></p><blockquote>ffssfsfssf</blockquote><p></p><p><strong>Nemo</strong> enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>', 1, '1732157668079'),
(32, 8, 4, '<p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>', 1, '1732157668079'),
(33, 8, 4, '<p> Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?</p>', 1, '1732157668079'),
(34, 8, 4, '<p>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.</p>', 1, '1732157668079');

-- --------------------------------------------------------

--
-- Table structure for table `email`
--

CREATE TABLE `email` (
  `id` int(11) NOT NULL,
  `freq` int(11) NOT NULL,
  `address` text DEFAULT NULL,
  `last_modified` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `email`
--

INSERT INTO `email` (`id`, `freq`, `address`, `last_modified`) VALUES
(1, 1, 'gbiangb@gmail.com', '248689032'),
(2, 1, 'gbiangb@gmail.com', '248689032'),
(5, 1, 'gbiangb@gmail.com', '248689032'),
(6, 1, 'gbiangb@gmail.com', '248689032'),
(10, 1, 'gbiangb@gmail.com', '248689032'),
(13, 1, 'gbiangb@gmail.com', '248689032'),
(14, 1, 'gbiangb@gmail.com', '248689032'),
(18, 2, 'ggfcgh@gjdhkd.co', '1731750572725'),
(19, 3, 'ewwf@jjhfhsd.x', '1731750588861'),
(20, 1, 'dwdw@ffsff.co', '1731836008982');

-- --------------------------------------------------------

--
-- Table structure for table `image`
--

CREATE TABLE `image` (
  `id` int(11) NOT NULL,
  `link` text DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `last_modified` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `image`
--

INSERT INTO `image` (`id`, `link`, `title`, `last_modified`) VALUES
(2, 'http://localhost:4200/uploads/Screenshot_2024-10-14_11_22_48.png', 'bennie 2', '1731286633570'),
(5, 'http://localhost:4200/uploads/344d6f4b-cedd-454b-a56f-74bbb146fd6a.png', 'bennie', '1731286239914'),
(6, 'http://localhost:4200/uploads/Screenshot_2024-10-14_12_11_38.png', 'deez', '1731409487499'),
(7, 'http://localhost:3992/uploads/IMG_6379.JPG', 'Ben 2', '1732264606580');

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE `post` (
  `id` int(11) NOT NULL,
  `category` int(11) DEFAULT NULL,
  `date_created` text DEFAULT NULL,
  `last_modified` text DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `is_hap` int(11) DEFAULT 0,
  `title_slug` varchar(100) DEFAULT NULL,
  `visibility` int(11) DEFAULT NULL,
  `ready` int(11) NOT NULL DEFAULT 0,
  `description` varchar(255) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `creation_ts` varchar(30) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`id`, `category`, `date_created`, `last_modified`, `title`, `is_hap`, `title_slug`, `visibility`, `ready`, `description`, `image`, `creation_ts`) VALUES
(3, 1, '2024-11-12', '1731878634349', 'My First Post', 0, 'my-first-post', 1, 1, 'This describes my first post.', NULL, '0'),
(4, 1, '2024-11-12', '1731487992434', 'My Second Post', 0, 'my-second-post', 1, 1, '', NULL, '0'),
(7, NULL, NULL, '1732165912776', 'Current', 1, NULL, NULL, 0, NULL, NULL, '0'),
(8, 1, '2024-11-13', '1732157668044', 'Converted From Yesterday', 0, 'converted-from-yesterday', 1, 1, 'converted yeah yeah yeah', NULL, '0'),
(9, 2, '2024-11-14', '1731590830146', 'Current 2', 0, 'current-2', 1, 1, '', NULL, '0'),
(10, 4, '2024-11-17', '1732157654069', 'Some Bullshit', 0, 'some-bullshit', 1, 1, 'converted yeah yeah yeah', NULL, '1731823585129');

-- --------------------------------------------------------

--
-- Table structure for table `post_analytics`
--

CREATE TABLE `post_analytics` (
  `id` int(11) NOT NULL,
  `dat` varchar(100) DEFAULT NULL,
  `post_id` int(11) DEFAULT NULL,
  `loc` text DEFAULT NULL,
  `ip` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `post_analytics`
--

INSERT INTO `post_analytics` (`id`, `dat`, `post_id`, `loc`, `ip`) VALUES
(1, '2024-11-19', 8, 'NG', '::1'),
(2, '2024-11-19', 10, 'NG', '::1'),
(3, '2024-11-19', 3, 'NG', '::1'),
(4, '2024-11-19', 4, 'NG', '::1'),
(5, '2024-11-19', 7, 'NG', '::1'),
(6, '2024-11-20', 8, 'NG', '::1'),
(7, '2024-11-20', 3, 'NG', '::1'),
(8, '2024-11-20', 7, 'NG', '::1'),
(9, '2024-11-21', 8, 'NG', '::1'),
(10, '2024-11-21', 7, 'NG', '::1'),
(11, '2024-11-21', 3, 'NG', '::1'),
(12, '2024-11-21', 9, 'NG', '::1'),
(13, '2024-11-21', 4, 'NG', '::1'),
(14, '2024-11-22', 4, 'XX', '::1'),
(15, '2024-11-22', 8, 'XX', '::1'),
(16, '2024-11-29', 10, 'XX', '::1'),
(17, '2024-11-29', 3, 'XX', '::1'),
(18, '2024-11-29', 8, 'XX', '::1'),
(19, '2025-03-22', 10, 'XX', '::1');

-- --------------------------------------------------------

--
-- Table structure for table `section`
--

CREATE TABLE `section` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `title_slug` varchar(100) DEFAULT NULL,
  `last_modified` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `section`
--

INSERT INTO `section` (`id`, `title`, `title_slug`, `last_modified`) VALUES
(1, 'Entertainment', 'entertainment', '1731740702496'),
(3, 'Politics', 'politics', '1731740708417'),
(4, 'Twitter X Trends', 'twitter-x-trends', '1731740655664'),
(5, 'Tech', 'tech', '1731740717453'),
(6, 'Business', 'business', '1731740724786');

-- --------------------------------------------------------

--
-- Table structure for table `visitor`
--

CREATE TABLE `visitor` (
  `id` int(11) NOT NULL,
  `ip` varchar(100) DEFAULT NULL,
  `dat` varchar(100) DEFAULT NULL,
  `loc` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `visitor`
--

INSERT INTO `visitor` (`id`, `ip`, `dat`, `loc`) VALUES
(1, '::1', '2024-11-19', 'NG'),
(2, '::1', '2024-11-20', 'NG'),
(3, '::1', '2024-11-21', 'NG'),
(4, '::1', '2024-11-21', 'XX'),
(5, '::1', '2024-11-22', 'XX'),
(6, '::1', '2024-11-23', 'XX'),
(7, '::1', '2024-11-29', 'XX'),
(8, '::1', '2025-03-22', 'XX');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `username` (`username`);

--
-- Indexes for table `admin_module`
--
ALTER TABLE `admin_module`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `title_slug` (`title_slug`),
  ADD KEY `title` (`title`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`);

--
-- Indexes for table `content`
--
ALTER TABLE `content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `section_id` (`section_id`);

--
-- Indexes for table `email`
--
ALTER TABLE `email`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `image`
--
ALTER TABLE `image`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category` (`category`),
  ADD KEY `title_slug` (`title_slug`),
  ADD KEY `title` (`title`);

--
-- Indexes for table `post_analytics`
--
ALTER TABLE `post_analytics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `dat` (`dat`);

--
-- Indexes for table `section`
--
ALTER TABLE `section`
  ADD PRIMARY KEY (`id`),
  ADD KEY `title_slug` (`title_slug`),
  ADD KEY `title` (`title`);

--
-- Indexes for table `visitor`
--
ALTER TABLE `visitor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ip` (`ip`,`dat`,`loc`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `admin_module`
--
ALTER TABLE `admin_module`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `content`
--
ALTER TABLE `content`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `email`
--
ALTER TABLE `email`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `image`
--
ALTER TABLE `image`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `post_analytics`
--
ALTER TABLE `post_analytics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `visitor`
--
ALTER TABLE `visitor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`);

--
-- Constraints for table `content`
--
ALTER TABLE `content`
  ADD CONSTRAINT `content_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`),
  ADD CONSTRAINT `content_ibfk_2` FOREIGN KEY (`section_id`) REFERENCES `section` (`id`);

--
-- Constraints for table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `post_ibfk_1` FOREIGN KEY (`category`) REFERENCES `category` (`id`);

--
-- Constraints for table `post_analytics`
--
ALTER TABLE `post_analytics`
  ADD CONSTRAINT `post_analytics_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
