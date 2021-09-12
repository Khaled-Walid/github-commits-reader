# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup

1. Go to your GitHub account settings > Developer Settings > OAuth Apps > New OAuth App

2. Add Application name, set Homepage URL to "http://localhost:3000/" and set Authorization callback URL
to "http://localhost:3000/#/login-callback"

3. Copy "config.example.js" and rename it to "config.js".

4. Set your Client ID & Client Secret in "config.js".

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
