CREATE DATABASE IF NOT EXISTS clockingo_dev;
CREATE DATABASE IF NOT EXISTS clockingo_test;

GRANT ALL PRIVILEGES ON clockingo_dev.*  TO 'clockingo'@'%';
GRANT ALL PRIVILEGES ON clockingo_test.* TO 'clockingo'@'%';
FLUSH PRIVILEGES;