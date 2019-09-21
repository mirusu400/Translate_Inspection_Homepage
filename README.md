# Now On Here http://15.164.82.83/HM_GB/

# 목장이야기 시리즈 번역 및 검수 홈페이지 템플릿

Django 와 Sqlite를 이용한, 목장이야기 바람의바자회 및 쌍둥이마을을 포함한 여러가지 게임들을 검수하기 위해 만들어진 템플릿입니다.

## Requirements
```
Python 3.x.x
Django
```

## Usage
```
git clone https://github.com/mirusu400/Harvest_Moon_Inspection_Homepage
```

## 기본적으로 바꿔야 하는 것
 1. `HMsite\manage.py` 를 다음과 같이 수정해야합니다.
 ```
 -- os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HMsite.settings')
 ++	os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HMsite.settings_public')
 ```
 
 2. `secrets.json` 안에 `SECRET_KEY` 를 설정해줘야 합니다.
 [Django Secret Key Generator](https://www.miniwebtool.com/django-secret-key-generator/) 를 이용하세요.
 
 3. `makemigrations`과 `make_db.py` 를 이용해 `db.sqlite3` 를 만들어야 합니다.
 ```
 python manage.py makemigrations
 python manage.py migrate
 ```
 먼저 위 명령어를 통해 DB를 생성해주세요.
 이후, 텍스트 파일을 `db.sqlite3`에 저장해야 합니다.
 `make_db.py` 소스코드를 보고 추가해 주세요.
 
## 파일 설명
  - `HM_GB\views.py`
 GET과 POST를 받고 HTML파일 넘겨주기 등 여러가지를 처리해주는 파일입니다.
  - `HM_GB\static\HM_GB\mainjava.js`
 POST를 통해 값을 전달하고 여러가지 프론트엔드 작업을 해주는 파일입니다.
  - `HM_GB\models.py`
 db와 관련된 사항을 전달하는 파일입니다.

