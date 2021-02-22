## Based on: https://www.linode.com/docs/guides/remote-desktop-using-apache-guacamole-on-docker/

### MySQL Setup
```
docker run --rm guacamole/guacamole /opt/guacamole/bin/initdb.sh --mysql > initdb.sql
```
```
docker run --name example-mysql -e MYSQL_RANDOM_ROOT_PASSWORD=yes -e MYSQL_ONETIME_PASSWORD=yes -d mysql/mysql-server
```

Copy password from:
```
docker logs example-mysql
```
```
[Entrypoint] Database initialized
[Entrypoint] GENERATED ROOT PASSWORD: <password>
```
```
docker cp initdb.sql example-mysql:/guac_db.sql
```
```
docker exec -it example-mysql bash
```
```
bash-4.2# mysql -u root -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 11
Server version: 5.7.20

Copyright (c) 2000, 2017, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_root_password';
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE DATABASE guacamole_db;
Query OK, 1 row affected (0.00 sec)

mysql> CREATE USER 'guacamole_user'@'%' IDENTIFIED BY 'guacamole_user_password';
Query OK, 0 rows affected (0.00 sec)

mysql> GRANT SELECT,INSERT,UPDATE,DELETE ON guacamole_db.* TO 'guacamole_user'@'%';
Query OK, 0 rows affected (0.00 sec)

mysql> FLUSH PRIVILEGES;
Query OK, 0 rows affected (0.00 sec)

mysql> quit
Bye
```
```
bash-4.2#  cat guac_db.sql | mysql -u root -p guacamole_db
```

### Initiate vnc server
```
x11vnc -id pick
```
Pick window you want to display.

### Guacamole in Browser
```
docker run -it --rm --network=host guacamole/guacd
```
```
docker run -it --rm -e MYSQL_HOSTNAME=172.17.0.2 -e MYSQL_DATABASE=guacamole_db -e MYSQL_USER=guacamole_user -e MYSQL_PASSWORD=guacamole_user_password -e GUACD_HOSTNAME=0.0.0.0 --network=host guacamole/guacamole
```