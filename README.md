Musibuk is a web application designed around the practice needs of a musician. It provides a clean interface that lets users create exercises and folders.
___
Each exercise provides tools like Metronome (tempo click), a stop watch to track how long you are practicing and a webcam to check if your form is correct.    
___
The app also tracks the progress of the user over the last 7 days. It provides bar graph visualizations showing the Time and Beats Per Minute achieved during a particular day's practice session.    
___
On the folder page, the app also shows the total time all the exercises were practiced in the folder over the last 7 days.    
___
The app can be accessed here -> http://ec2-52-25-232-144.us-west-2.compute.amazonaws.com:3000/  
Login with Username: test@mb.com Password: test to play around or Register as a new user. 
___
Here are some screenshots of the app:    

The Folder page:    
![alt tag](https://raw.githubusercontent.com/sghoshal/musibuk/master/screenshots/folder.jpg)    

The Exercise page:    
![alt tag](https://raw.githubusercontent.com/sghoshal/musibuk/master/screenshots/exercise.jpg)    

The Home page:    
![alt tag](https://raw.githubusercontent.com/sghoshal/musibuk/master/screenshots/home.jpg)
___
Steps to run this app locally:

1. Install node.js and npm

- For Unix/Mac based systems - https://docs.npmjs.com/getting-started/installing-node

2. Install MongoDB

The app is running on Mongo 2.4.8. Here is the link for installing this version.

https://docs.mongodb.org/v2.4/tutorial/install-mongodb-on-os-x/#manual-installation

3. Fetch dependencies, start Mongod and run the app:

git clone https://github.com/sghoshal/musibuk
cd musibuk
npm install
mkdir data
mongod --dbpath data/
npm start

localhost:3000 should bring the home page





