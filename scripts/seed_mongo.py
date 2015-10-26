from pymongo import MongoClient
from datetime import datetime
from bson.objectid import ObjectId

# Global variables
host_name = 'localhost'
port = 27017
database = 'musibuk'
mongo_uri = 'mongodb://' + host_name + ':' + str(port) + '/' + database
test_user_email = 'test@mb.com'

def create_root_exercises(exercises, n):	
	created_exercises_ids = []

	for ex_count in range(0, n):
		ex_name = "Root Exercise " + str(ex_count)
		today = datetime.utcnow()

		# Insert into collection
		exercise_created = exercises.insert_one ( 
			{
		        "user_id":            test_user_email,
		        "name":               ex_name,
		        "entryType":          "exercise",
		        "notes":              "Notes for " + ex_name,
		        "folderId":           "root",
		        "createdTime":        today,
		        "bpm":                80,
		        "bpmGoal":            140,
		        "maxPracticeTime":    600,
		        "lastUpdated":        today,
		        "lastPracticeTime":   0,
		        "totalPracticeTime":  0,
		        "history":            [],
			}
		)
		created_exercises_ids.append(exercise_created.inserted_id)

	return created_exercises_ids

def create_folders(folders, stack, num_folders):
	created_folder_ids = []
	for folder_count in range(0, num_folders):
		today = datetime.utcnow()
		folder_name = "Root Folder " + str(folder_count)

		folder_created = folders.insert_one(
			{
				"user_id":            test_user_email,
		        "name":               folder_name,
		        "entryType":          "folder",
		        "exercises":          [],
		        "stack":              stack,
		        "createdTime":        today,
		        "lastUpdated":        today,
		        "lastPracticeTime":   0,
		        "totalPracticeTime":  0,
		        "history":            []
			}
		)

		created_folder_ids.append(folder_created.inserted_id)

	return folder_created

def delete_folder_exercises(exercises, folder_name):
	num_rows_deleted = exercises.delete_many (
		{
			"user_id": 	test_user_email,
			"folderId": folder_name
		}
	)
	return num_rows_deleted.deleted_count

def delete_all_user_content(folders, exercises):
	num_exercises_deleted = exercises.delete_many (
		{
			"user_id": 	test_user_email
		}
	)

	num_folders_deleted = folders.delete_many (
		{
			"user_id": 	test_user_email
		}
	)

	return (num_exercises_deleted.deleted_count, num_folders_deleted.deleted_count)	

def main():
	client = MongoClient(mongo_uri)
	db = client[database]

	# Collections
	exercises = db['exercises']
	folders = db['folders']
	users = db['users']

	root_stack = "root"

	num_root_exercies = 5
	num_folders = 5

	# Find in collection
	# cursor = exercises.find()

	# for document in cursor:
	# 	print "%s\n" % document

	# num_deleted = delete_folder_exercises(exercises, "root")
	# print "Deleted " + str(num_deleted) + " exercises"

	num_deleted = delete_all_user_content(folders, exercises)
	print "Deleted " + str(num_deleted[0]) + " exercises " + str(num_deleted[1]) + " folders."

	created_exercises_ids = create_root_exercises(exercises, num_root_exercies)
	print "Created Root Exercises: %s" % created_exercises_ids

	created_folders_ids = create_folders(folders, root_stack, num_folders)
	print "Created Root Folders: %s" % created_folders_ids

if __name__ == "__main__":
	main()
	