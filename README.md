# skills-dashboard

## API 仕様

| メソッド | エンドポイント            | 処理概要                         |
| -------- | ------------------------- | -------------------------------- |
| GET      | /users                    | ユーザ情報全件取得               |
| GET      | /register/{employee_code} | ユーザ新規登録                   |
| GET      | /view/{employee_code}     | ユーザ情報取得                   |
| POST     | /edit/{employee_code}     | ユーザ情報再登録                 |
| POST     | /delete/{employee_code}   | ユーザ削除                       |
| GET      | /newposts                 | 新しい変更を新しい順に 15 件取得 |

## DB 設計

| PK  | 項目名 1      | 項目名 2           | 型        |
| --- | ------------- | ------------------ | --------- |
| ○   | employee_code | -                  | number    |
|     | user_name     | -                  | string    |
|     | email_address | -                  | string    |
|     | position      | -                  | string    |
|     | department    | -                  | string    |
|     | division      | -                  | string    |
|     | skills        | -                  | list->map |
|     | -             | section            | string    |
|     | -             | skill_name         | string    |
|     | -             | level              | number    |
|     | certification | -                  | list->map |
|     | -             | certification_name | string    |
|     | -             | vender             | string    |
|     | -             | acquired_date      | string    |
|     | created_date  | -                  | string    |
|     | updated_date  | -                  | string    |
