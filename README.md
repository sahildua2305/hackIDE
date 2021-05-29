# hackIDE

hackIDE is an online code editor, compiler and interpreter based on Django, powered by HackerEarth API! Go, hack it!

#### Visit - [hackIDE | Online Code Editor, Compiler & Interpreter](http://hackide.herokuapp.com)


## Screenshot- 
![Screenshot for HackIDE](/hackIDE/static/hackIDE/img/screenshot.png?raw=true "Screenshot for HackIDE")


## How to run the server locally
To run the server locally, you will need to do two things:
1. Get a hackerearth API "Client Secret Key" (see section below)
2. Create a copy of .env.example, save it as .env and replace HE_CLIENT_SECRET with your token

### Get a Client Secret Key
Go to https://www.hackerearth.com/api/register/, create a HackerEarth profile and register a URL. You can register http://google.com, for example. Then you will be provided with a Client Secret Key.

### Then, startup the server with:

```shell
$ docker-compose up
```

Then, you can connect to the site at 0.0.0.0:8000.

## TODO
 - [x] Add "Download code as a zipped file" option
 - [x] Implement "Save code on cloud" feature
 - [x] Explain how to get a HackerEarth API key
 - [ ] Implement profiling system allowing users to make their profiles and saving codes in their profiles

## Stargazers over time

[![Stargazers over time](https://starcharts.herokuapp.com/sahildua2305/hackide.svg)](https://starcharts.herokuapp.com/sahildua2305/hackide)
