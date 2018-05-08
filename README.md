# simple_auth
Basic app for practicing authentication 

This is just a very simple app to practice authentication. Currently, using client sessions for session cookies and
bcrypt for password hashing with a Mongo database managing the data. The app is just for testing basic security (like
cookie flags or different libraries and middelware).

Eventually, some of the branches might use other hashing programs like scrypt (which is more secure than bcrypt) 
or argon2 (which has options for CPU, memory, and number of CPU cores), Passport, OAuth, etc, etc. 
