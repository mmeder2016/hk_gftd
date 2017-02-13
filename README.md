# A gift recommendation application - NU926fsf - Team Project

# Table of Contents

* [Overview](#overview)
* [Usage](#usage)
  * [Running from Heroku](#running-from-heroku)
    * [URLs](#urls)
* [Miscellaneous Development Notes](#miscellaneous-development-notes)
  * [Heroku Deployment](#heroku-deployment)
    * [Run Time Errors](#run-time-errors)
  * [Viewing Errors on Heroku](#errors-on-heroku)
  * [Other Heroku Behavior](#other-heroku-behavior)

# Overview

Our application is gift recommendation application based on criteria obtain from the user via a short questionnaire.  

# Usage

This application has been deployed to Heroku as per the assignment, but it can also be ran locally.

## Running from Heroku

At the time when this assignment was submitted the application has been deployed to Heroku. Its URL is - 

    Heroku link is provided in the homework submission
    
*NOTE: The `:3000` port selection is not necessary, there is a `PORT` environment variable that contains the port number to be used.*

### URLs

The following URLs are recognized by the server and will serve pages - 

* `https://deployed-server/` - displays the *login* page

# Miscellaneous Development Notes

## Heroku Deployment

Deployment to Heroku for the most part is straight forward and easy to accomplish. However, several key steps should be noted :

* For this application it is necessary to set up a database on Heroku and modify the `config/config.json` file to use the correct credentials. **JawsDB** is the recommended choice for a database.

* Edit your `package.json` file (*after it's been created with* `npm init`) so that it contains - 

```javascript
    "engines": {
       "node": "6.9.4"
     }
```

**Where :** `"node": "6.9.4"` indicates the *version* of Node that you want your application use. This application is using the same version that was used locally during development.

* The *listening* port requires some special consideration. Although it is configured, that value will not be used when running on Heroku. The following links provided useful information - 

Provided the necessary information for editing the `packages.json` file :

<https://devcenter.heroku.com/articles/deploying-nodejs>

The top *answer* provided the details needed for managing the port number :

<http://stackoverflow.com/questions/31092538/heroku-node-js-error-r10-boot-timeout-web-process-failed-to-bind-to-port-w>

* The deployment steps I used are - 

1. `heroku login`
2. `heroku create`
3. Log onto the Heroku site and provision the application with JawsDB-MySQL.
4. `git push heroku master`

Heroku is now ready to serve the application. After the initial deployment and subsequent file modifications, and after committing and pushing the changes to Git then only step 3 is required.

**Don't forget to `heroku logout` when done!**

### Run Time Errors

## Viewing Errors on Heroku

Heroku *logs* the output from the server application. And it can be viewed from the Heroku dashboard. This log is useful when troubleshooting issues on Heroku.


## Other Heroku Behavior

When a node server application is deployed on Heroku several things will happen - 

1. Heroku will start the application as specified in the `package.json` file. 
2. When server application runs Heroku will assign a port to it, so it's necessary for the server application to read the `PORT` environment variable. 
3. If the application is idle for a period of time Heroku will **kill** the process. Then upon the next connection it will start the application again. The only visible side effect is that it will take a little longer to load a page *on the first time*  after Heroku has killed the process.

