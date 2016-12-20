# couchdbimporter

An Electron app that allows CSV files to be imported into CouchDB or Cloudant.

## Building locally

Clone this repository then install the dependencies for the first time:

```sh
cd app; npm install; cd ..
```

The run the app:

```sh
npm start
```

## Building 

Build a Mac binary and installer in the `dist` directory:

```sh
npm install
npm run mac
```

or for Windows

```sh
npm install
npm run win
```

or for Linux

```sh
npm install
npm run linux
```