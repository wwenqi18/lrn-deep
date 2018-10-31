# lrn-deep [![Build Status](https://travis-ci.org/CathyMouse96/lrn-deep.svg?branch=master)](https://travis-ci.org/CathyMouse96/lrn-deep)
A Web application for building neural networks interactively.

## Installation
Clone repo:
```sh
$ git clone https://github.com/CathyMouse96/lrn-deep.git
```

Install prerequisites (Make sure you have Python 3 installed):
```sh
$ pip install -r requirements.txt
```

## Usage
Run server:
```sh
$ cd lrn-deep
$ python3 manage.py runserver
```

The server will start at http://127.0.0.1:8000/.

## Contributing
Enable pre-commit building and testing:
```sh
$ bin/git-hooks/hook-setup.sh
```

Pre-commit building and testing will be performed before each commit.
