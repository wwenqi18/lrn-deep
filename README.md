# lrn-deep [![Build Status](https://travis-ci.org/CathyMouse96/lrn-deep.svg?branch=master)](https://travis-ci.org/CathyMouse96/lrn-deep)
A Web application for building neural networks interactively.

## Demo
<img src="https://github.com/wwenqi18/lrn-deep/blob/master/img/lrndeep1.png" width="70%" /> <br/>

<img src="https://github.com/wwenqi18/lrn-deep/blob/master/img/lrndeep2.png" width="70%" />

## Installation
Clone repo:
```sh
$ git clone https://github.com/CathyMouse96/lrn-deep.git
```

Install prerequisites (Make sure you have Python 3 installed):
```sh
$ pip3 install -r requirements.txt
```

## Usage
Run server:
```sh
$ cd lrn-deep
$ python3 manage.py runserver
```

The server will start at http://127.0.0.1:8000/.

## Testing
Python tests:
```sh
$ python3 manage.py test [canvas / users]
```

Coverage:
```sh
$ python3 -m coverage run --branch manage.py test
$ python3 -m coverage report lrndeep/*.py canvas/*.py users/*.py
```

JavaScript tests:
```sh
$ cd js_test
$ npm test
$ cd ../
```

## Troubleshooting
1. You have 1 unapplied migration(s). Your project may not work properly until you apply the migrations for app(s): users.
Solution: Run `python3 manage.py migrate --run-syncdb`.

2. django.db.migrations.exceptions.InconsistentMigrationHistory
Solution: Delete 'canvas/migrations' and 'users/migrations' and run `python3 manage.py makemigrations`.

3. For other issues please search existing issues or post an issue.

## Contributing
Enable pre-commit building and testing:
```sh
$ bin/git-hooks/hook-setup.sh
```

Pre-commit building and testing will be performed before each commit.
