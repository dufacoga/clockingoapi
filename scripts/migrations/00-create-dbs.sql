CREATE DATABASE IF NOT EXISTS clockingo_dev;
CREATE DATABASE IF NOT EXISTS clockingo_test;
CREATE DATABASE IF NOT EXISTS clockingo_prod;

GRANT ALL PRIVILEGES ON clockingo_dev.*  TO 'clockingo'@'%';
GRANT ALL PRIVILEGES ON clockingo_test.* TO 'clockingo'@'%';
GRANT ALL PRIVILEGES ON clockingo_prod.* TO 'clockingo'@'%';
FLUSH PRIVILEGES;