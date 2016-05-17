# hackIDE

hackIDE is an online code editor, compiler and interpreter based on Django, powered by HackerEarth API! Go, hack it!

####Visit - [hackIDE | Online Code Editor, Compiler & Interpreter](http://hackide.herokuapp.com)


## Screenshot- 
![Screenshot for HackIDE](/hackIDE/static/hackIDE/img/screenshot.png?raw=true "Screenshot for HackIDE")

## How to run the server locally

```
$ python manage.py collectstatic
$ HACKIDE_DEBUG=true python manage.py runserver
```

Note that the IDE may not show up without a valid api token from HackerEarth. To specify the HackerEarth api token, supply it with ```HE_CLIENT_SECRET``` as a command line variable.

```
$ python manage.py collectstatic
$ HE_CLIENT_SECRET=<<your token here>> python manage.py runserver
```

## TODO
 - Add "Download code as a zipped file" option
 - Implement "Save code on cloud" feature
 - Implement profiling system allowing users to make their profiles and saving codes in their profiles
