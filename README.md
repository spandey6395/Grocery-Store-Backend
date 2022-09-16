Grocery Store Backend

Tech Stack: Node, Express, Mongo
Candidates need to create a simple backend for a Grocery store. This will be a complete node
application with routes, controllers and models.
Tasks:
● Create Database to hold Customer Details, Customer’s Order, Products Details.(Note:
Create DB on local to test APIs)
○ Customer Details must include the following fields
■ Email
■ Phone
■ Name
○ Customer Order must include the following fields
■ productList
■ totalPrice
■ paymentInfo
● Type

○ Product Details must include the following fields
■ productCategory
■ productInfo
■ price
■ quantityAvailable

● Use npm package Mongoose to interact with Mongo.
● Create Schema for each collection
○ Use virtuals to populate data from other collections
○ Add options for required and unique fields
● Rest APIs:
<!-- ○ Api to fetch Customers list -->
<!-- ○ Api to fetch specific Customer Orders list -->
○ Api to fetch customer Details with maximum Orders in an year
<!-- ○ Api to create new Customer -->
<!-- ○ Api to create new Product -->
<!-- ○ API to update Product Price -->
● Check for invalid inputs and return appropriate status code in response

Note: Candidates need to upload their project on github and share its url with us. We'll
run each project on our local machine for testing and use postman for api calls.
Candidates no need to share any DB file, we’ll reconstruct db using their schema files.