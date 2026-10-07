-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Сен 27 2026 г., 12:00
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
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(6, 'aaa', 'a@a.a', '$2y$10$YR9b2fkrRCsYqcE7a6nMAuh.wZX0w8zccVAGoG5MI11QSQtiKlgl2', 'user'),
(10, 'qqq', 'q@q.a', '$2y$10$B8YwpVl1GO06L5nR2ua6Wep2E/Hq05JgSyfE6klcpPOvW4XU8ztui', 'user'),
(12, 'hhh', 'h@h.h', '$2y$10$XbIDy81hZqAD9aHkZi13uemjTsqsyN8/Pb.Jgjl1VABGR1Vcn73/K', 'user'),
(13, 'kkk', 'k@k.k', '$2y$10$fPZKD6WMH2/zs/8lxdYrGua6DXbonkbQTR7YqgURO4y/iT/i6bjg2', 'user'),
(15, 'mmm', 'm@m.m', '$2y$10$WW6KHpLboM4j.alnTg3rheES5xrTMf3d.S.M2ZxSC8IxsnPm43/vi', 'user'),
(16, 'iii', 'i@i.i', '$2y$10$cm5mzrU7ubCfXDi2HFcx4..BcVialXUOy0yE16DuzATu8lyzr1X16', 'user'),
(17, 'admin', 'admin@gmail.com', '$2y$12$PI78IMrjkJcmVkgra0Ge7OpRg4iL77k8USRX6VUEPGYIw3nbf8jyu', 'admin');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
