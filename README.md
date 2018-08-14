# simple_auth
Basic app for practicing authentication 

This is just a very simple app to practice authentication. Currently, using client sessions for session cookies and
bcrypt for password hashing with a Mongo database managing the data. The app is just for testing basic security (like
cookie flags or different libraries and middelware). The app just asks to register or login, which the user will enter name, email and password. Upon successful registration and/or login, a simple dashboard with name, email, and hashed password. 

To start app, install Mongo database (in addition to fork repo, download, etc, etc), cd into simple_auth folder and at the command prompt type  "Mongod". Open another terminal, cd into simple_auth folder and type "node app.js" to start the application. 
