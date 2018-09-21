# node-boilerplate

A boilerplate for node apps

## Running Unit Test

`npm run test`

## How babel is used

The source code all lives in src/ but we are using es6+ syntax not all recognized by node.  

To make it work we must first transpile the code, that's what `npm run build` does, essentially transpiling all the application code (skips unit tests) in src/ and dumps it in dist/.  This way when the server is actually ran remotely (or locally), we're actually running the transpiled version on index.js (and everything else) in dist/, not src/

## Running Locally

`npm run dev`

The above will transpile the code to the dist/ folder and run index.js from there.

You must alos define all environment variables locally.

You can make a file called .env at the root of the project, then dump in required environment variables

## DotEnv

For managing environment variables, define a .env file at the root of the project.  From there you can define KEY=value attributes, one per line, that will be available in the app when accessing process.env.KEY.  In this way you don't have to mess with your environment variables locally, yet the server behaves as normal with environment variables.