# Daily DDD :)
#### It's providing service now [Here](http://www.woosik-projects.cf)

## What it is
It focuses on basic function of To Do List. so It's very easy to use. Daily DDD provides To Do List made of Easy and Simple UI. It helps you to manage your task more efficiently. 

## UI
<img width="1243" alt="스크린샷 2020-01-14 05 01 39" src="https://user-images.githubusercontent.com/48206623/72287776-fca0ba00-368a-11ea-991f-bc043e9dacd6.png">

## Getting Started on your local
> Before Start, Check to install `MySQL`
```
sudo npm install
```

### Set Database

Connect Database
```
mysql -u root -p
```

Create Database
```
CREATE DATABASE [your database name];
USE [your database name];
```

Create users table
```sql
CREATE TABLE `[your database name]`.`users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(16) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));
```

Create todo table
```sql
CREATE TABLE `your database`.`todo` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `task` VARCHAR(100) NULL,
  `user_id` INT(11) NULL,
  `state` VARCHAR(20) NULL,
  `todoname` VARCHAR(45) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
  PRIMARY KEY (`id`));
```
Exit Database
```
exit
```

### Set environment variable

Create `.env` file
```
touch .env
vim .env
```

Enter your MySQL Information in `.env`
```
host=localhost
user=root
password=your pass word
database=your database name
port=3306
```

### Finish

```
sudo npm i -g pm2
```

```
sudo pm2 start app.js
```


Go to your [localhost](http://localhost:3000/)



## Dependencies
- [connect-flash](https://www.npmjs.com/package/connect-flash) 0.1.1
- [dotenv](https://www.npmjs.com/package/dotenv) 8.2.0
- [express](https://www.npmjs.com/package/express) 4.17.1
- [express-handlebars](https://www.npmjs.com/package/express-handlebars) 3.1.0
- [express-mysql-session](https://www.npmjs.com/package/express-mysql-session) 2.1.0
- [express-session](https://www.npmjs.com/package/express-session) 1.17.0
- [mysql](https://www.npmjs.com/package/mysql) 2.17.1
- [passport](portjs.org) 0.4.1
- [passport-local](https://www.npmjs.com/package/passport-local) 1.0.0
- [pm2](https://pm2.keymetrics.io/) 4.2.1
