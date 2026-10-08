-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Окт 08 2026 г., 15:13
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
(4, 'aaa', NULL, 'aaa', 1, 0, 1),
(5, 'bbb', 4, 'bbb', 1, 2, 1),
(6, 'ccc', 5, 'ccc', 1, 3, 1),
(7, 'ddd', NULL, 'ddd', 1, 1, 1),
(8, 'eee', 7, 'eee', 1, 5, 1),
(9, 'fff', 8, 'fff', 1, 6, 1);

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
(4, 4, 2, 'aaa (EN)'),
(5, 4, 3, 'aaa (HY)'),
(6, 5, 1, 'bbb'),
(7, 5, 2, 'bbb (EN)'),
(8, 5, 3, 'bbb (HY)'),
(9, 6, 1, 'ccc'),
(10, 6, 2, 'ccc (EN)'),
(11, 6, 3, 'ccc (HY)'),
(12, 7, 1, 'ddd'),
(13, 7, 2, 'ddd (EN)'),
(14, 7, 3, 'ddd (HY)'),
(15, 8, 1, 'eee'),
(16, 8, 2, 'eee (EN)'),
(17, 8, 3, 'eee (HY)'),
(18, 9, 1, 'fff'),
(19, 9, 2, 'fff (EN)'),
(20, 9, 3, 'fff (HY)');

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
(4, 11, 'post_11_1791460868_7c5fa32e.jpg', 'images.jpg', 'image/jpeg', 18163, '2026-10-08 12:01:08'),
(5, 12, 'post_12_1791460934_1e31c2eb.jpg', 'images (1).jpg', 'image/jpeg', 16038, '2026-10-08 12:02:14'),
(6, 13, 'post_13_1791461055_4d399dc2.jpg', 'images (2).jpg', 'image/jpeg', 21196, '2026-10-08 12:04:15'),
(7, 14, 'post_14_1791461183_d37d4f82.jpg', 'images (3).jpg', 'image/jpeg', 31121, '2026-10-08 12:06:23'),
(8, 15, 'post_15_1791461316_c6fe515d.jpg', 'images (4).jpg', 'image/jpeg', 26010, '2026-10-08 12:08:36'),
(9, 16, 'post_16_1791461341_57238a0d.jpg', 'images (5).jpg', 'image/jpeg', 47139, '2026-10-08 12:09:01'),
(10, 17, 'post_17_1791461418_a5184171.jpg', 'images (6).jpg', 'image/jpeg', 49524, '2026-10-08 12:10:18'),
(11, 18, 'post_18_1791461440_ff77ba74.jpg', 'images (7).jpg', 'image/jpeg', 15012, '2026-10-08 12:10:40'),
(12, 19, 'post_19_1791461550_64c7d79d.jpg', 'images (8).jpg', 'image/jpeg', 10138, '2026-10-08 12:12:30'),
(13, 20, 'post_20_1791461564_6f0463a9.jpg', 'images (9).jpg', 'image/jpeg', 21051, '2026-10-08 12:12:44');

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
(36, 20, 2, 'user5', 'user5');

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
-- Индексы таблицы `post_translations`
--
ALTER TABLE `post_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `post_lang` (`post_id`,`language_id`),
  ADD KEY `language_id` (`language_id`);

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
-- AUTO_INCREMENT для таблицы `languages`
--
ALTER TABLE `languages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT для таблицы `menu_item_translations`
--
ALTER TABLE `menu_item_translations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT для таблицы `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT для таблицы `post_images`
--
ALTER TABLE `post_images`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT для таблицы `post_translations`
--
ALTER TABLE `post_translations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

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
-- Ограничения внешнего ключа таблицы `post_translations`
--
ALTER TABLE `post_translations`
  ADD CONSTRAINT `post_trans_lang_fk` FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `post_trans_post_fk` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
