# hackIDE

hackIDE is an online code editor, compiler and interpreter based on Django, powered by HackerEarth API! Go, hack it!

#### Visit - [hackIDE | Online Code Editor, Compiler & Interpreter](http://hackide.herokuapp.com)


## Screenshot- 
![Screenshot for HackIDE](/hackIDE/static/hackIDE/img/screenshot.png?raw=true "Screenshot for HackIDE")

## Getting set up
Depending on your environment, you may need to install some libraries. On Debian/Ubuntu, you will need to:
```shell
sudo apt-get install libmysqlclient-dev libcurl4-gnutls-dev
```

To get your Python environment properly set up, you can create a virtual environment and use the requirements.txt file to install the proper versions of various libraries.

```shell
# Navigate to a directory of your choosing, where you will store your virtual environment.
$ mkdir virtualEnvs
$ cd virtualEnvs
$ virtualenv hackIDE_venv # We need python2. If you are using 3 by default, type virtualenv -p /usr/bin/python2.7 hackIDE_venv
$ source ~/virtualEnvs/hackIDE_venv/bin/activate
$ cd /location/of/your/copy/of/hackIDE
$ pip install -r requirements.txt
```


## How to run the server locally
To run the server locally, you will need to do two things:
1. Get a hackerearth API "Client Secret Key"
2. Change the hackIDE_project/settings.py file

### Get a Client Secret Key
Go to https://www.hackerearth.com/api/register/, create a HackerEarth profile and register a URL. You can register http://google.com, for example. Then you will be provided with a Client Secret Key.

###  Change the hackIDE_project/settings.py file.
Change the ALLOWED_HOSTS line to
```shell
ALLOWED_HOSTS = ['*'] if not DEBUG else ['*']
```

### Then, startup the server with:

```shell
$ python manage.py collectstatic
$ HE_CLIENT_SECRET=your_token_here python manage.py runserver
```

Then, you can connect to the site at 0.0.0.0:8000.

## TODO
 - [x] Add "Download code as a zipped file" option
 - [x] Implement "Save code on cloud" feature
 - [x] Explain how to get a HackerEarth API key
 - [ ] Implement profiling system allowing users to make their profiles and saving codes in their profiles

## Stargazers over time

[![Stargazers over time](https://starcharts.herokuapp.com/sahildua2305/hackide.svg)](https://starcharts.herokuapp.com/sahildua2305/hackide)
