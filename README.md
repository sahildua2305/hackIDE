# hackIDE

hackIDE is an online code editor, compiler and interpreter based on Django, powered by HackerEarth API! Go, hack it!

#### Visit - [hackIDE | Online Code Editor, Compiler & Interpreter](http://hackide.herokuapp.com)


## Screenshot- 
![Screenshot for HackIDE](/hackIDE/static/hackIDE/img/screenshot.png?raw=true "Screenshot for HackIDE")

## Getting set up
Depending on your environment you may need to install some libraries. On debian/ubuntu you will need to:
```
    sudo apt-get install libmysqlclient-dev libcurl4-gnutls-dev
```

To get your python environment environment properly set up you can create a virtual environment and use the requirements.txt file to install the proper versions of various libraries.
```
#Navigate to a directory of your choosing, where you will store your virtual environment. For example:
cd
mkdir virtualEnvs
cd virtualEnvs
virtualenv hackIDE_venv # we need python2. If you are using 3 by default type virtualenv -p /usr/bin/python2.7 hackIDE_venv
source ~/virtualEnvs/hackIDE_venv/bin/activate
cd /location/of/your/copy/of/hackIDE
pip install -r requirements.txt
```


## How to run the server locally

```
$ python manage.py collectstatic
$ HACKIDE_DEBUG=true python manage.py runserver
```

Note that the IDE may not show up without a valid api token from HackerEarth. To specify the HackerEarth api token, supply it with ```HE_CLIENT_SECRET``` as a command line argument.

```
$ python manage.py collectstatic
$ HE_CLIENT_SECRET=your_token_here python manage.py runserver
```

## TODO
 - [x] Add "Download code as a zipped file" option
 - [x] Implement "Save code on cloud" feature
 - [ ] Explain how to get a hackerearth API key
 - [ ] Implement profiling system allowing users to make their profiles and saving codes in their profiles
