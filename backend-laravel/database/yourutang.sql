-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2025 at 06:59 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `yourutang`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `subject_type` varchar(255) DEFAULT NULL,
  `subject_id` bigint(20) UNSIGNED DEFAULT NULL,
  `properties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`properties`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `description`, `subject_type`, `subject_id`, `properties`, `created_at`, `updated_at`) VALUES
(1, 6, 'deleted loan #2', 'App\\Models\\Loan', 2, NULL, '2025-11-28 20:53:35', '2025-11-28 20:53:35'),
(2, 6, 'received payment of ₱500.00 from chriselda', 'App\\Models\\Payment', 2, '{\"loan_id\":1,\"amount\":\"500.00\",\"payment_date\":\"2025-11-29T00:00:00.000000Z\",\"notes\":null,\"updated_at\":\"2025-11-29T06:04:05.000000Z\",\"created_at\":\"2025-11-29T06:04:05.000000Z\",\"id\":2,\"loan\":{\"id\":1,\"borrower_id\":1,\"amount\":\"2000.00\",\"interest_rate\":\"0.00\",\"term_months\":1,\"due_date\":null,\"date_borrowed\":\"2025-11-27\",\"description\":\"utang\",\"created_at\":\"2025-11-27T10:21:39.000000Z\",\"updated_at\":\"2025-11-27T10:21:39.000000Z\",\"balance\":1500,\"status\":\"active\",\"borrower\":{\"id\":1,\"user_id\":6,\"name\":\"chriselda\",\"contact\":\"09667010334\",\"notes\":\"friend\",\"created_at\":\"2025-11-27T10:20:56.000000Z\",\"updated_at\":\"2025-11-27T10:20:56.000000Z\"}}}', '2025-11-28 22:04:05', '2025-11-28 22:04:05'),
(3, 6, 'created a new loan for loloy (₱5,000.00)', 'App\\Models\\Loan', 4, '{\"borrower_id\":4,\"amount\":\"5000\",\"date_borrowed\":\"2025-11-30\",\"description\":null,\"interest_rate\":\"10\",\"interest_type\":\"monthly\",\"term_months\":1,\"due_date\":\"2025-12-03\",\"updated_at\":\"2025-11-30T06:49:42.000000Z\",\"created_at\":\"2025-11-30T06:49:42.000000Z\",\"id\":4,\"balance\":5000,\"status\":\"active\",\"borrower\":{\"id\":4,\"user_id\":6,\"name\":\"loloy\",\"contact\":\"09954235075\",\"notes\":\"friend\",\"created_at\":\"2025-11-29T05:53:03.000000Z\",\"updated_at\":\"2025-11-29T05:53:03.000000Z\"}}', '2025-11-29 22:49:42', '2025-11-29 22:49:42'),
(4, 6, 'received payment of ₱5,000.00 from loloy', 'App\\Models\\Payment', 3, '{\"loan_id\":4,\"amount\":\"5000.00\",\"payment_date\":\"2025-12-01T00:00:00.000000Z\",\"notes\":null,\"updated_at\":\"2025-12-01T02:12:32.000000Z\",\"created_at\":\"2025-12-01T02:12:32.000000Z\",\"id\":3,\"loan\":{\"id\":4,\"borrower_id\":4,\"amount\":\"5000.00\",\"interest_rate\":\"10.00\",\"interest_type\":\"monthly\",\"term_months\":1,\"due_date\":\"2025-12-03\",\"date_borrowed\":\"2025-11-30\",\"description\":null,\"created_at\":\"2025-11-30T06:49:42.000000Z\",\"updated_at\":\"2025-11-30T06:49:42.000000Z\",\"balance\":0,\"status\":\"paid\",\"borrower\":{\"id\":4,\"user_id\":6,\"name\":\"loloy\",\"contact\":\"09954235075\",\"notes\":\"friend\",\"created_at\":\"2025-11-29T05:53:03.000000Z\",\"updated_at\":\"2025-11-29T05:53:03.000000Z\"}}}', '2025-11-30 18:12:33', '2025-11-30 18:12:33'),
(5, 6, 'deleted loan #4', 'App\\Models\\Loan', 4, NULL, '2025-11-30 18:12:42', '2025-11-30 18:12:42'),
(6, 6, 'created a new loan for loloy (₱5,000.00)', 'App\\Models\\Loan', 5, '{\"borrower_id\":4,\"amount\":\"5000\",\"date_borrowed\":\"2025-12-01\",\"description\":null,\"interest_rate\":0,\"interest_type\":\"monthly\",\"term_months\":\"1\",\"term_unit\":\"weeks\",\"due_date\":\"2025-12-08\",\"updated_at\":\"2025-12-01T02:38:13.000000Z\",\"created_at\":\"2025-12-01T02:38:13.000000Z\",\"id\":5,\"balance\":5000,\"status\":\"active\",\"borrower\":{\"id\":4,\"user_id\":6,\"name\":\"loloy\",\"contact\":\"09954235075\",\"notes\":\"friend\",\"created_at\":\"2025-11-29T05:53:03.000000Z\",\"updated_at\":\"2025-11-29T05:53:03.000000Z\"}}', '2025-11-30 18:38:13', '2025-11-30 18:38:13'),
(7, 6, 'deleted loan #3', 'App\\Models\\Loan', 3, NULL, '2025-11-30 18:39:11', '2025-11-30 18:39:11'),
(8, 6, 'deleted loan #1', 'App\\Models\\Loan', 1, NULL, '2025-11-30 18:39:14', '2025-11-30 18:39:14');

-- --------------------------------------------------------

--
-- Table structure for table `borrowers`
--

CREATE TABLE `borrowers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `province` text DEFAULT NULL,
  `city` text DEFAULT NULL,
  `barangay` text DEFAULT NULL,
  `street` text DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `id_type` varchar(255) DEFAULT NULL,
  `id_number` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `borrowers`
--

INSERT INTO `borrowers` (`id`, `user_id`, `name`, `contact`, `notes`, `created_at`, `updated_at`, `province`, `city`, `barangay`, `street`, `email`, `address`, `id_type`, `id_number`) VALUES
(1, 6, 'chriselda', '09667010334', 'friend', '2025-11-27 02:20:56', '2025-11-27 02:20:56', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 6, 'geno', '09533743437', 'silingan', '2025-11-27 03:25:09', '2025-11-27 03:25:09', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 6, 'Loloy Trugillo', '09954235075', 'friend', '2025-11-28 21:53:03', '2025-12-01 00:47:26', 'Surigao Del Sur', 'Carrascal', 'Tag-Anito', 'Purok - 3', 'lholhoy143@gmail.com', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `history_logs`
--

CREATE TABLE `history_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `action` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `subject_type` varchar(255) DEFAULT NULL,
  `subject_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `history_logs`
--

INSERT INTO `history_logs` (`id`, `user_id`, `action`, `description`, `subject_type`, `subject_id`, `created_at`, `updated_at`) VALUES
(1, 6, 'Created Borrower', 'Added new borrower: chriselda', 'App\\Models\\Borrower', 1, '2025-11-27 02:20:56', '2025-11-27 02:20:56'),
(2, 6, 'Created Loan', 'Added loan of ₱2000 for chriselda', 'App\\Models\\Loan', 1, '2025-11-27 02:21:39', '2025-11-27 02:21:39'),
(3, 6, 'Created Borrower', 'Added new borrower: geno', 'App\\Models\\Borrower', 2, '2025-11-27 03:25:09', '2025-11-27 03:25:09'),
(4, 6, 'Created Loan', 'Added loan of ₱5000 for geno', 'App\\Models\\Loan', 2, '2025-11-27 07:09:22', '2025-11-27 07:09:22'),
(5, 6, 'Created Loan', 'Added loan of ₱44444 for geno', 'App\\Models\\Loan', 3, '2025-11-27 07:09:48', '2025-11-27 07:09:48'),
(6, 6, 'Created Borrower', 'Added new borrower: keven', 'App\\Models\\Borrower', 3, '2025-11-27 08:08:08', '2025-11-27 08:08:08'),
(7, 6, 'Deleted Borrower', 'Deleted borrower: keven', 'App\\Models\\Borrower', 3, '2025-11-28 21:51:05', '2025-11-28 21:51:05'),
(8, 6, 'Created Borrower', 'Added new borrower: loloy', 'App\\Models\\Borrower', 4, '2025-11-28 21:53:03', '2025-11-28 21:53:03'),
(9, 6, 'Updated Borrower', 'Updated borrower details: loloy', 'App\\Models\\Borrower', 4, '2025-11-30 20:07:59', '2025-11-30 20:07:59'),
(10, 6, 'Updated Borrower', 'Updated borrower details: Loloy Trugillo', 'App\\Models\\Borrower', 4, '2025-12-01 00:47:26', '2025-12-01 00:47:26');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `loans`
--

CREATE TABLE `loans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `borrower_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `interest_rate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `interest_type` varchar(255) DEFAULT 'monthly',
  `term_months` int(11) NOT NULL DEFAULT 1,
  `term_unit` varchar(255) DEFAULT 'months',
  `due_date` date DEFAULT NULL,
  `date_borrowed` date NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `loans`
--

INSERT INTO `loans` (`id`, `borrower_id`, `amount`, `interest_rate`, `interest_type`, `term_months`, `term_unit`, `due_date`, `date_borrowed`, `description`, `created_at`, `updated_at`) VALUES
(5, 4, 5000.00, 0.00, 'monthly', 1, 'weeks', '2025-12-08', '2025-12-01', NULL, '2025-11-30 18:38:13', '2025-11-30 18:38:13');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_11_27_053927_create_personal_access_tokens_table', 1),
(5, '2025_11_27_060000_create_borrowers_table', 2),
(6, '2025_11_27_060001_create_loans_table', 2),
(7, '2025_11_27_070000_create_history_logs_table', 2),
(8, '2025_11_27_080000_create_payments_table', 3),
(9, '2025_11_28_000000_add_terms_to_loans_table', 4);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `loan_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` date NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('57JyzH408XphYAroL1DahjEj9c1QELnUSuYLYOhr', 6, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiN2l3V3Jlc2JUQkNmOXVLMzB2VElKbzY5UjhvSXk4OHRhckxxU2V3ZiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvdXNlciI7czo1OiJyb3V0ZSI7Tjt9czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6Njt9', 1764611917);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `profile_image`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(4, 'Adrian T. Isarna', 'lholhoy143@gmail.com', NULL, NULL, '$2y$12$zSZ/Rr/JRkmkXJl.5u9ieuJYqVDQDkEiKeJKmU3F0msolYKnRPytu', NULL, '2025-11-27 01:38:39', '2025-11-27 01:38:39'),
(5, 'test', 'finaltest@gmail.com', NULL, NULL, '$2y$12$Zp7aIv/OrGt2GC8DG3wtl.8jdaH38SvB/hewBxY.caZtW6UzpiZ0u', 'qMSQMPtKCUVdV6D3nM5Uj1RWY8qqkHvCszKpxiVoSfHNG0wy0THyuJgvU2G5', '2025-11-27 01:47:29', '2025-11-27 01:47:29'),
(6, 'Adrian T. Isarna', 'isarnaadriantrugillo@gmail.com', 'profile/nSMiqeqocy4kXgupH2n4T40PvwBiE7hTZGxwyOCo.jpg', NULL, '$2y$12$K8tiUQeL1ZlIGZg98UPb1.flWBQ8c0PawNLZ1hLleuvNchbfEnR2u', 'BXg89FAJpKamnKnESuZlTgfoaqaLA0vk7yueIXlEfZuyt4ku7IIN7kmXGnJP', '2025-11-27 02:01:34', '2025-12-01 00:34:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activity_logs_user_id_foreign` (`user_id`),
  ADD KEY `activity_logs_subject_type_subject_id_index` (`subject_type`,`subject_id`);

--
-- Indexes for table `borrowers`
--
ALTER TABLE `borrowers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `borrowers_user_id_foreign` (`user_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `history_logs`
--
ALTER TABLE `history_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `history_logs_user_id_foreign` (`user_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `loans`
--
ALTER TABLE `loans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `loans_borrower_id_foreign` (`borrower_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payments_loan_id_foreign` (`loan_id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `borrowers`
--
ALTER TABLE `borrowers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `history_logs`
--
ALTER TABLE `history_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `loans`
--
ALTER TABLE `loans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `borrowers`
--
ALTER TABLE `borrowers`
  ADD CONSTRAINT `borrowers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `history_logs`
--
ALTER TABLE `history_logs`
  ADD CONSTRAINT `history_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `loans`
--
ALTER TABLE `loans`
  ADD CONSTRAINT `loans_borrower_id_foreign` FOREIGN KEY (`borrower_id`) REFERENCES `borrowers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_loan_id_foreign` FOREIGN KEY (`loan_id`) REFERENCES `loans` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
