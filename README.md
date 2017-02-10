# couchdbimporter

An Electron app that allows CSV files to be imported into CouchDB or Cloudant.

This is a demonstration to show how a HTML/JavaScript/CSS app can be bundled into a native 
package and distributed for Windows, Mac and Linux platforms. Once installed, the app can
run 'offline-first' and is therefore an another method of distributing offline-first web
apps.

![screenshot](https://raw.githubusercontent.com/ibm-cds-labs/couchdbimporter/master/img/screenshot.png)

It uses the [couchimport](https://www.npmjs.com/package/couchimport) library to perform the
transformation and import of data into CouchDB. Unlike the raw `couchimport` library, this
app also infers data types from a preview of the file, turning booleans and numbers into their
native JavaScript data types on import.

Once installed, the user need only drag and drop a CSV file onto the app's window to import
data. The app can be configured to send data to a local Apache CouchDB database (default) or
a remote Cloudant database, through the app's settings panel.

## Building locally

Clone this repository then install the dependencies for the first time:

```sh
npm install
```

The run the app:

```sh
npm start
```

## Building 

Build a Mac binary and installer in the `dist` directory:

```sh
npm run mac
```

or for Windows

```sh
npm run win
```

or for Linux

```sh
npm run linux
```
