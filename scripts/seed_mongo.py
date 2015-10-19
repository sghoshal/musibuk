from pymongo import MongoClient
from datetime import datetime
from bson.objectid import ObjectId

# Global variables
host_name = 'localhost'
port = 27017
database = 'musibuk'
mongo_uri = 'mongodb://' + host_name + ':' + str(port) + '/' + database
test_user_email = 'test@mb.com'

client = MongoClient(mongo_uri)
db = client[database]

# Collections
exercises = db['exercises']
folders = db['folders']
users = db['users']

# Find in collection
# cursor = exercises.find()

# for document in cursor:
# 	print "%s\n" % document

# Insert into collection
result = exercises.insert_one( 
	{
		"bpm" : 150,
		"bpmGoal" : 140,
		"createdTime" : datetime.utcnow(),
		"entryType" : "exercise",
		"folderId" : "root",
		"history" : [
			{
				"date" : datetime.utcnow(),
				"practiceTime" : 12,
				"bpm" : 150,
				"_id" : ObjectId("561621272a67ba1f3e4f2cff")
			}
		],
		"lastPracticeTime" : 2,
		"lastUpdated" : datetime.utcnow(),
		"maxPracticeTime" : 600,
		"name" : "Root Exercise 1",
		"notes" : "This is a root exercise.",
		"totalPracticeTime" : 12,
		"user_id" : test_user_email
	}
)