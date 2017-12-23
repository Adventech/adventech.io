# tiny-server

A tiny Web Server


## Install

You can install to global

```shell
npm install -g tiny-server
```

or as a module

```shell
npm install tiny-server
```


## Usage

### global

```shell
tiny-server
```

It will use terminal's current working directory as the web server's root directory.
And the server's port is 3000.

You can specify a path as web server's root directory:

```shell
tiny-server ./www
```

You can export environment `PORT` value as the server's port:

```shell
export PORT=3001 && tiny-server;
```

