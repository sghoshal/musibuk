#3w

Simple express server for static file delivering.
When it comes to setting up a simple Http server to expose a specific dir, we have bunch of options.
One of the usual way of doing that which has a tone of restrictions, is using `python` like:

```
python -m SimpleHTTPServer 8080
```

which allows me to expose the current dir as a http server on the specific port number.
I created **3w** as an alternative with bunch of advanced features.
Being able to set up http proxies is one of the useful features which saves a lot of pain when developing a web application.
Http proxies are not provided in the current version but they will be soon with a nice and useful way of setting up the configuration.

##Installation
3w is now on npm, to install it all you need is to run this on terminal:

```
npm install 3w
```

Now to run a server and expose a directory (let's say its name is `src`) all you should do is:

```
node node_modules/3w/3w.js src --3000
```

To enable https you could also pass `--https` which usually needs you to have `sudo` access on the machine:

```
sudo node node_modules/3w/3w.js src --3000 --https
```

##API
You could also `require` 3w as a module, and set up the server like:

```javascript
var www = require('3w'),
  app;

app = www({
  enableHTTPS: true,
  port: 8888,
  dir: 'src'
});
```

or:

```javascript
//This will expose the 'app' folder and 'enableHTTPS' will be false
app = www({
  port: 8888
});
```
or:

```javascript
//This will expose the 'src' folder on '9000' and 'enableHTTPS' will be false
app = www({
  dir: 'src'
});
```

or:

```javascript
//This will expose the 'app' folder on '9000' and 'enableHTTPS' will be false
app = www();
```
Using `3w` you could also tweak the `app` object to set up your `http-proxies` like:

```javascript
var www = require('3w'),
  app;

function proxy(app){
  //...
}

app = www({
  enableHTTPS: true,
  port: 8888,
  dir: 'src',
  proxy: proxy
});
```
