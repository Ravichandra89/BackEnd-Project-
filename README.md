Steps To Build Project

1. SetUp all Neccessary Files
2. Connecting DataBase (MongoDB)
  Types of way to connect dataBase.

  1.Writing the DataBase connect code in Index.js because when it start the Db connection is Created

  2.We can Seprate this DataBase connection function in any Db folder then import in Index.js.

3. HTTP 

Request Headers -> from client
Response Headers -> from server
Repersentation Headers -> encoding / compression
Payload Headers -> data
Security Headers -> for server

Most Common Headers:- 
  Accept, User-Agent (where from request came), Authorization (Bearer Token), Content-Type (image, pdf,), Cookie, Cache-Control (Controlling cache)

CORS :- 
  Access-Control-Allow-Origin
  Access-Control-Allow-Credentials
  Access-Control-Allow-method

Security:- 
  Cross-Origin-Embedders-Policy
  Content-Security-Policy
  x-xss-protection

Methods of HTTP :- 

Get: Retrieve a resources
Head: No message body(response only headers)
Options: what operations are available
Trace : loopBack test(get some data)
delete : remove a resource
put : replace a resource
Post : interact with resource
Patch: change part of a resource

HTTP Status Code :-

1xx  - Informational
2xx - Success
3xx - Redirection
4xx - Client Error
5xx - Server Error
