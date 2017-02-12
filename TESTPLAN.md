# Test Plan For : A gift recommendation application - NU926fsf - Team Project

## Testing Set Up

* Node - 6.9.4
* MySQL - 5.7

The application can be ran locally, and uses port 3000.

## Test Statuses

Test statuses can be *one* of the following - 

* under test
* FAIL
* PASS

## Integration Tests

### 1. Initial server start and run :

#### A. Database & Preliminary HTML Content Merge -

1) server starts and listens on port X without errors (*any port number is valid when running on Heroku*)
  * Expected Result : server displays listening and idle message on the console.
  * Status : **PASS** 2017-02-09 jm

2) database tables are created
  * Expected Result : use workbench to verify presence of these tables -
    * gifts
    * products
    * recipients
    * users
  * Status : **PASS** 2017-02-09 jm

3) verify column names and types
  * Expected Result : data types are as discussed by the team
  * Results Obtained
    * `gifts` - id,recipientName,createdAt,updatedAt 
    * `products` - id,productName,description,ageGroup,ratingCount,ratingValue,isClose,isLifeOfParty,isUseable,isLuxury,isPriceHigh,createdAt,updatedAt
    * `recipients` - id,recipientName,createdAt,updatedAt
    * `users` - id,userName,createdAt,updatedAt
  * Status : **PASS** 2017-02-09 jm
       
### 2. User Authentication :

#### A. User Registration -

1) minimal validation of input - fields cannot be empty, (*minimum length? valid/invalid characters?*)
  * Expected Result : a message should be shown to the user indicating that a *correction* is required.
  * Status : 

2) user data is correctly saved in the `user` table
  * Expected Result : use workbench to verify presence of a new user, and that the user name/login id field is correct.
  * Status : 

3) post successful registration user is redirected to `/survey.html`
  * Expected Result : 
  * Status : 

#### B. User Login -

1) minimal validation of input - fields cannot be empty, (*minimum length?*)
  * Expected Result : a message should be shown to the user indicating that a *correction* is required.
  * Status : 

2) user data is successfully retrieved from the `user` table
  * Expected Result : user login is successful.
  * Status : **PASS** 2017-02-09

3) post successful registration user is redirected to `/survey.html`
  * Expected Result :
  * Status : **PASS** 2017-02-09

#### C. Invalid Login Attempt -

1) intentional login failure, test with invalid data in both fields separately and in combination, user is redirected to *???path???*
  * Expected Result : a message should be shown to the user indicating that a *correction* is required.
  * Status : 

#### D. Questionnaire/Survey Form

1) page loads via the path `/survey.html`
  * Expected Result : Page with minimal styling, all inputs are visible.
  * Status : **PASS** 2017-02-09 jm

2) form submission - no user changes made to inputs
  * Expected Result : submission fails, `survey.html` stays in browser, error message should be sent to user.
  * Status : **FAIL** 2017-02-09 jm

3) form submission - user changes made to all but 1 input
  * Expected Result : submission fails, `survey.html` stays in browser, error message should be sent to user.
  * Status : **FAIL** 2017-02-09 jm

4) form submission - user changes all inputs
  * Expected Result : submission succeeds, form data with expected key names is sent in a query to the server.
  * Status : **PASS** 2017-02-09 jm

#### E. Matching Products Found in Database

1) after form submission the static file `results.html` is sent to the browser
  * Expected Result : submission succeeds, a temporary **static** `results.html` file is seen in the browser.
  * Status : **PASS** 2017-02-09 jm

2) `results.html` needs to become a *Handlebars* templated HTML file so data is visible
  * Expected Result : Page displays with **one** of the following (*test for both outcomes!*) - a message that indicates no matches found **or** a table is rendered with product data.
  * Status : **FAIL**
  * Reasons :
    * **no product data in table**
    * **`results.html` has not been templated yet**
    * 


## Post Integration Tests

### 1. *TBD*

# Pre Heroku Deployment Set Up

* Create Heroku application space
* Enable JawsDB
* Verify packages.json - 
  * Node - 6.9.4
  * *TBD*

## Post Heroku Deployment Tests

### 1. Minimum Successful Run Test

#### B. Run the following tests - 

1) Integration Tests 
  * 1.A.1 through 1.A.3
    * Status : 

  * 2.A.1 through 2.A.3
    * Status : 

  * 2.B.1 through 2.B.3
    * Status : 

  * 2.C.1
    * Status : 

## Final Testing

### 1. Page Appearance Tests

#### A. Login Pages

1) Login and related pages, messages and any other user facing content styling is correct
  * Expected Result : 
  * Status : 

#### B. Questionnaire and Related Pages

1) After successful login applicatio transitions to the `survey.html` page where styling, color, fonts, etc is consistent with the login pages.
  * Expected Result : 
  * Status : 




