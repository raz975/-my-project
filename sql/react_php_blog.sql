-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Окт 17 2026 г., 18:47
-- Версия сервера: 8.0.30
-- Версия PHP: 8.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `react_php_blog`
--

-- --------------------------------------------------------

--
-- Структура таблицы `comments`
--

CREATE TABLE `comments` (
  `id` int NOT NULL,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `comment_likes`
--

CREATE TABLE `comment_likes` (
  `id` int NOT NULL,
  `comment_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `languages`
--

CREATE TABLE `languages` (
  `id` int NOT NULL,
  `code` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `languages`
--

INSERT INTO `languages` (`id`, `code`, `name`, `is_active`, `created_at`) VALUES
(1, 'ru', 'Русский', 1, '2026-10-07 17:18:32'),
(2, 'en', 'English', 0, '2026-10-07 17:18:32'),
(3, 'hy', 'Հայերեն', 0, '2026-10-07 17:18:32');

-- --------------------------------------------------------

--
-- Структура таблицы `menu_items`
--

CREATE TABLE `menu_items` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent_id` int DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `user_id` int NOT NULL,
  `sort_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `menu_items`
--

INSERT INTO `menu_items` (`id`, `name`, `parent_id`, `url`, `user_id`, `sort_order`, `is_active`) VALUES
(4, 'aaa1', NULL, 'aaa1', 1, 0, 1),
(5, 'bbb1', 4, 'bbb1', 1, 0, 1),
(6, 'ccc1', 5, 'ccc1', 1, 0, 1),
(14, 'bbb2', 4, 'bbb2', 1, 1, 1),
(15, 'ccc4', 14, 'ccc4', 1, 1, 1),
(16, 'ccc2', 5, 'ccc2', 1, 1, 1),
(17, 'ccc3', 14, 'ccc3', 1, 0, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `menu_item_translations`
--

CREATE TABLE `menu_item_translations` (
  `id` int NOT NULL,
  `menu_item_id` int NOT NULL,
  `language_id` int NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `menu_item_translations`
--

INSERT INTO `menu_item_translations` (`id`, `menu_item_id`, `language_id`, `name`) VALUES
(3, 4, 1, 'aaa'),
(4, 4, 2, 'aaa1'),
(5, 4, 3, 'aaa (HY)'),
(6, 5, 1, 'bbb'),
(7, 5, 2, 'bbb1'),
(8, 5, 3, 'bbb (HY)'),
(9, 6, 1, 'ccc'),
(10, 6, 2, 'ccc1'),
(11, 6, 3, 'ccc (HY)'),
(26, 14, 2, 'bbb2'),
(28, 15, 2, 'ccc4'),
(30, 16, 2, 'ccc2'),
(31, 17, 2, 'ccc3');

-- --------------------------------------------------------

--
-- Структура таблицы `posts`
--

CREATE TABLE `posts` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `posts`
--

INSERT INTO `posts` (`id`, `title`, `content`, `user_id`, `created_at`) VALUES
(11, 'user1', 'user1', 2, '2026-10-08 12:01:08'),
(12, 'user1', 'user1', 2, '2026-10-08 12:02:14'),
(13, 'user2', 'user2', 3, '2026-10-08 12:04:15'),
(14, 'user2', 'user2', 3, '2026-10-08 12:06:23'),
(15, 'user3', 'user3', 4, '2026-10-08 12:08:36'),
(16, 'user3', 'user3', 4, '2026-10-08 12:09:01'),
(17, 'user4', 'user4', 5, '2026-10-08 12:10:18'),
(18, 'user4', 'user4', 5, '2026-10-08 12:10:40'),
(19, 'user5', 'user5', 6, '2026-10-08 12:12:30'),
(20, 'user5', 'user5', 6, '2026-10-08 12:12:44');

-- --------------------------------------------------------

--
-- Структура таблицы `post_images`
--

CREATE TABLE `post_images` (
  `id` int NOT NULL,
  `post_id` int NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `file_size` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `post_images`
--

INSERT INTO `post_images` (`id`, `post_id`, `file_name`, `original_name`, `mime_type`, `file_size`, `created_at`) VALUES
(14, 11, 'post_11_1792058753_11033e27.jpg', 'images (1).jpg', 'image/jpeg', 51357, '2026-10-15 10:05:53'),
(15, 12, 'post_12_1792058769_223dd285.jpg', 'images (2).jpg', 'image/jpeg', 27604, '2026-10-15 10:06:09'),
(16, 13, 'post_13_1792058785_3a56f561.jpg', 'images (3).jpg', 'image/jpeg', 17772, '2026-10-15 10:06:25'),
(17, 14, 'post_14_1792058792_867a93a9.jpg', 'images (4).jpg', 'image/jpeg', 37962, '2026-10-15 10:06:32'),
(18, 15, 'post_15_1792058806_f8f51698.jpg', 'images (5).jpg', 'image/jpeg', 24495, '2026-10-15 10:06:46'),
(19, 16, 'post_16_1792058813_9b7b2bf7.jpg', 'images (6).jpg', 'image/jpeg', 60103, '2026-10-15 10:06:53'),
(20, 17, 'post_17_1792058832_b8d8dc6f.jpg', 'images (7).jpg', 'image/jpeg', 16883, '2026-10-15 10:07:12'),
(21, 18, 'post_18_1792058841_b023b9e3.jpg', 'images (8).jpg', 'image/jpeg', 55523, '2026-10-15 10:07:21'),
(22, 19, 'post_19_1792058853_5a2e49ca.jpg', 'images.jpg', 'image/jpeg', 54382, '2026-10-15 10:07:33'),
(23, 20, 'post_20_1792058881_c3bfdba8.jpg', 'images (9).jpg', 'image/jpeg', 32407, '2026-10-15 10:08:01');

-- --------------------------------------------------------

--
-- Структура таблицы `post_likes`
--

CREATE TABLE `post_likes` (
  `id` int NOT NULL,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `post_translations`
--

CREATE TABLE `post_translations` (
  `id` int NOT NULL,
  `post_id` int NOT NULL,
  `language_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `post_translations`
--

INSERT INTO `post_translations` (`id`, `post_id`, `language_id`, `title`, `content`) VALUES
(24, 11, 2, 'user1', 'user1'),
(25, 12, 2, 'user1', 'user1'),
(29, 13, 2, 'user2', 'user2'),
(30, 14, 2, 'user2', 'user2'),
(31, 15, 2, 'user3', 'user3'),
(32, 16, 2, 'user3', 'user3'),
(33, 17, 2, 'user4', 'user4'),
(34, 18, 1, 'user4', 'user4'),
(35, 19, 2, 'user5', 'user5'),
(36, 20, 2, 'user5', 'user5'),
(37, 11, 1, 'user1', 'user1'),
(38, 12, 1, 'user1', 'user1'),
(39, 13, 1, 'user2', 'user2'),
(40, 14, 1, 'user2', 'user2'),
(41, 15, 1, 'user3', 'user3'),
(42, 16, 1, 'user3', 'user3'),
(43, 17, 1, 'user4', 'user4'),
(45, 19, 1, 'user5', 'user5'),
(46, 20, 1, 'user5', 'user5');

-- --------------------------------------------------------

--
-- Структура таблицы `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` int NOT NULL,
  `follower_id` int NOT NULL,
  `following_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user',
  `is_blocked` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `is_blocked`, `created_at`) VALUES
(1, 'admin', 'admin@gmail.com', '$2y$10$ew7qRI.SbS4eu2gnVk6hmOwAcpYMnCVPl19ZtnBbgPwQHE4RUQsby', 'admin', 0, '2026-10-07 17:44:10'),
(2, 'user1', 'user1@gmail.com', '$2y$10$RAg75k75hMLJc3pyTY2uFeaJjaOqGXovGYsj0rLwA6hKYzM/OdCpu', 'user', 0, '2026-10-08 11:59:04'),
(3, 'user2', 'user2@gmail.com', '$2y$10$YNvZTSXI59nr6dZi6qyQsOG01TYXapBSqdY2i4Hp7HFyrxoO7bHMy', 'user', 0, '2026-10-08 12:03:37'),
(4, 'user3', 'user3@gmail.com', '$2y$10$RGwixtP/EP9jfU3krLrTeeug5oTZjoRG3pvCA/EbQHcDW4Rbs65Ya', 'user', 0, '2026-10-08 12:07:12'),
(5, 'user4', 'user4@gmail.com', '$2y$10$WYpVBdcDNHDQP.aWfW66wOa5JU923xNhwCWcIthHPI3mqJcT4nLaC', 'user', 0, '2026-10-08 12:09:30'),
(6, 'user5', 'user5@gmail.com', '$2y$10$GuFV6ciZfouLaO19hc6cq.LVdpvMyi7WF6XetrVzmPZCcz7NS74/S', 'user', 0, '2026-10-08 12:11:54');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `comment_likes`
--
ALTER TABLE `comment_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_comment_like` (`comment_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `languages`
--
ALTER TABLE `languages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Индексы таблицы `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent_id` (`parent_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `menu_item_translations`
--
ALTER TABLE `menu_item_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `menu_lang` (`menu_item_id`,`language_id`),
  ADD KEY `language_id` (`language_id`);

--
-- Индексы таблицы `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `post_images`
--
ALTER TABLE `post_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_post_id` (`post_id`);

--
-- Индексы таблицы `post_likes`
--
ALTER TABLE `post_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`post_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `post_translations`
--
ALTER TABLE `post_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `post_lang` (`post_id`,`language_id`),
  ADD KEY `language_id` (`language_id`);

--
-- Индексы таблицы `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_subscription` (`follower_id`,`following_id`),
  ADD KEY `following_id` (`following_id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_is_blocked` (`is_blocked`),
  ADD KEY `idx_role` (`role`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `comment_likes`
--
ALTER TABLE `comment_likes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `languages`
--
ALTER TABLE `languages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT для таблицы `menu_item_translations`
--
ALTER TABLE `menu_item_translations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT для таблицы `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT для таблицы `post_images`
--
ALTER TABLE `post_images`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT для таблицы `post_likes`
--
ALTER TABLE `post_likes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT для таблицы `post_translations`
--
ALTER TABLE `post_translations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT для таблицы `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_post_fk` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `comment_likes`
--
ALTER TABLE `comment_likes`
  ADD CONSTRAINT `comment_likes_comment_fk` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comment_likes_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `menu_items`
--
ALTER TABLE `menu_items`
  ADD CONSTRAINT `menu_items_parent_fk` FOREIGN KEY (`parent_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `menu_item_translations`
--
ALTER TABLE `menu_item_translations`
  ADD CONSTRAINT `menu_trans_item_fk` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `menu_trans_lang_fk` FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `post_images`
--
ALTER TABLE `post_images`
  ADD CONSTRAINT `post_images_post_fk` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `post_likes`
--
ALTER TABLE `post_likes`
  ADD CONSTRAINT `post_likes_post_fk` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `post_likes_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `post_translations`
--
ALTER TABLE `post_translations`
  ADD CONSTRAINT `post_trans_lang_fk` FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `post_trans_post_fk` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subs_follower_fk` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `subs_following_fk` FOREIGN KEY (`following_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
