# データベースの使い方
### パッケージインストール
```
sudo apt install postgresql
```

### ログイン
```
sudo su - postgres
psql
```

### 設定
postgresユーザのパスワードをpostgresに変更
```
alter role postgres with password 'postgres';
```

### 作成
```
create database secret_board;
```

### 閲覧
```
\c secret_board
select * from "Post";
```

### 削除
```
drop database secret_board;
```

### 終了
```
\q
exit
```