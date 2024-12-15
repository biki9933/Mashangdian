/*
SQLyog Ultimate v11.33 (64 bit)
MySQL - 5.7.18-log : Database - db_diancan
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE /*!32312 IF NOT EXISTS*/`db_diancan` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `db_diancan`;

-- 创建商户表
CREATE TABLE `t_merchant` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `merchant_name` varchar(100) NOT NULL COMMENT '商户名称',
  `contact_name` varchar(50) NOT NULL COMMENT '联系人姓名',
  `contact_phone` varchar(20) NOT NULL COMMENT '联系电话',
  `address` varchar(200) NOT NULL COMMENT '商户地址',
  `logo` varchar(200) DEFAULT NULL COMMENT '商户logo',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态 1:正常 0:禁用',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商户表';

-- 创建用户表（简化版）
CREATE TABLE `t_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) NOT NULL COMMENT '用户名(用户自定义ID)',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_name` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 管理员表
CREATE TABLE `t_admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `merchant_id` int(11) NOT NULL COMMENT '商户ID',
  `username` varchar(22) NOT NULL,
  `password` varchar(22) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_merchant` (`merchant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 菜品分类表 (已更新)
CREATE TABLE `t_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `merchant_id` int(11) NOT NULL COMMENT '商户ID',
  `name` varchar(30) NOT NULL COMMENT '分类名称',
  `sort` int(11) DEFAULT '0' COMMENT '排序',
  `value` varchar(30) DEFAULT NULL COMMENT '分类值',
  `count` int DEFAULT 0 COMMENT '菜品数量',
  `sele_quantity` int DEFAULT 0 COMMENT '已选数量',
  `cid` varchar(30) DEFAULT NULL COMMENT '分类编号',
  PRIMARY KEY (`id`),
  KEY `idx_merchant` (`merchant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 菜品表 (已更新)
CREATE TABLE `t_dish` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `merchant_id` int(11) NOT NULL COMMENT '商户ID',
  `name` varchar(50) NOT NULL COMMENT '菜品名称',
  `typeId` int(11) NOT NULL COMMENT '类别ID',
  `unitprice` decimal(10,2) NOT NULL COMMENT '单价',
  `image` varchar(200) DEFAULT NULL COMMENT '图片',
  `description` varchar(200) DEFAULT NULL COMMENT '描述',
  `onsale` tinyint(1) DEFAULT '1' COMMENT '状态 1:在售 0:停售',
  `time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `monthlysale` int DEFAULT 0 COMMENT '月销量',
  `unit` varchar(20) DEFAULT NULL COMMENT '单位',
  `quantity` int DEFAULT 0 COMMENT '数量',
  PRIMARY KEY (`id`),
  KEY `idx_merchant` (`merchant_id`),
  KEY `idx_category` (`typeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 餐桌表 (已更新)
CREATE TABLE `t_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `merchant_id` int(11) NOT NULL COMMENT '商户ID',
  `number` varchar(20) NOT NULL COMMENT '桌号',
  `qrcode` varchar(200) DEFAULT NULL COMMENT '二维码图片地址',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态 1:空闲 0:占用',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_merchant` (`merchant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 订单表
CREATE TABLE `t_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `merchant_id` int(11) NOT NULL COMMENT '商户ID',
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `table_id` int(11) NOT NULL COMMENT '桌号ID',
  `order_no` varchar(32) NOT NULL COMMENT '订单号',
  `total_amount` decimal(10,2) NOT NULL COMMENT '订单总金额',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '订单状态：1待支付 2已支付 3已完成 4已取消',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_merchant` (`merchant_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_table` (`table_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 订单详情表
CREATE TABLE `t_order_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL COMMENT '订单ID',
  `dish_id` int(11) NOT NULL COMMENT '菜品ID',
  `quantity` int(11) NOT NULL COMMENT '数量',
  `price` decimal(10,2) NOT NULL COMMENT '价格',
  PRIMARY KEY (`id`),
  KEY `idx_order` (`order_id`),
  KEY `idx_dish` (`dish_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 插入示例数据
-- 1. 商户数据
INSERT INTO t_merchant (merchant_name, contact_name, contact_phone, address) VALUES
('商家A', '张老板', '13800138001', '北京市海淀区中关村大街1号'),
('商家B', '李老板', '13800138002', '北京市朝阳区三里屯1号');

-- 2. 用户数据
INSERT INTO t_user (user_name) VALUES
('user001'),
('user002'),
('user003');

-- 3. 管理员数据
INSERT INTO t_admin (merchant_id, username, password) VALUES
(1, 'adminA', '123456'),
(2, 'adminB', '123456');

-- 4. 分类数据
INSERT INTO t_category (merchant_id, name, sort, value, count, sele_quantity, cid) VALUES
(1, '热菜', 1, 'hot', 0, 0, 'CAT001'),
(1, '凉菜', 2, 'cold', 0, 0, 'CAT002'),
(1, '主食', 3, 'staple', 0, 0, 'CAT003'),
(2, '特色菜', 1, 'special', 0, 0, 'CAT004'),
(2, '炒菜', 2, 'stir-fry', 0, 0, 'CAT005'),
(2, '饮品', 3, 'drinks', 0, 0, 'CAT006');

-- 5. 菜品数据
INSERT INTO t_dish (merchant_id, name, typeId, unitprice, image, description, monthlysale, unit, quantity) VALUES
(1, '宫保鸡丁', 1, 38.00, 'gongbao.jpg', '多放花生', 100, '份', 0),
(1, '凉拌黄瓜', 2, 18.00, 'huanggua.jpg', '爽口开胃', 80, '份', 0),
(1, '米饭', 3, 3.00, 'rice.jpg', '东北大米', 200, '碗', 0),
(2, '水煮鱼', 4, 58.00, 'fish.jpg', '特色菜品', 150, '份', 0),
(2, '青椒炒肉', 5, 32.00, 'pork.jpg', '农家小炒', 120, '份', 0),
(2, '可乐', 6, 5.00, 'cola.jpg', '冰镇可乐', 300, '瓶', 0);

-- 6. 餐桌数据
INSERT INTO t_table (merchant_id, number, qrcode) VALUES
(1, 'A1', 'qr_A1.png'),
(1, 'A2', 'qr_A2.png'),
(1, 'A3', 'qr_A3.png'),
(2, 'B1', 'qr_B1.png'),
(2, 'B2', 'qr_B2.png'),
(2, 'B3', 'qr_B3.png');

-- 7. 订单数据
INSERT INTO t_order (merchant_id, user_id, table_id, order_no, total_amount, status) VALUES
(1, 1, 1, '202401010001', 59.00, 2),
(1, 2, 2, '202401010002', 41.00, 1),
(2, 1, 4, '202401010003', 95.00, 2);

-- 8. 订单详情数据
INSERT INTO t_order_detail (order_id, dish_id, quantity, price) VALUES
(1, 1, 1, 38.00),
(1, 2, 1, 18.00),
(1, 3, 1, 3.00),
(2, 4, 1, 58.00),
(2, 5, 1, 32.00),
(3, 6, 1, 5.00);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;