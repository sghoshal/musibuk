from pymongo import MongoClient

from modules.constants import Constants
from modules.exercise import Exercise
from modules.folder import Folder
from modules.user import User


def create_folders_and_exercises(collection_folders, collection_exercises, folders_exercises_to_create, stack):
    for folder_name in folders_exercises_to_create.keys():
        print "Creating Folder: %s" % folder_name
        folder_created = Folder.create_folder(collection_folders, folder_name, stack)
        print "Done!"

        if folder_created.acknowledged:
            exercises = folders_exercises_to_create.get(folder_name)
            print "-- Creating exercises: %s" % exercises
            Exercise.create_exercises_in_folder(collection_exercises, collection_folders, exercises, folder_created.inserted_id)
            print "Done!"

        else:
            print "Folder %s was not created succesfully." % folder_name


def main():
    client = MongoClient(Constants.MONGO_URI)
    db = client[Constants.DATABASE]

    # Collections
    collection_exercises = db[Constants.COLLECTION_EXERCISE]
    collection_folders = db[Constants.COLLECTION_FOLDER]

    # Delete user contents entirely before seeding data.
    num_deleted = User.delete_all_user_content(collection_folders, collection_exercises)
    print "Deleted " + str(num_deleted[0]) + " exercises " + str(num_deleted[1]) + " folders."

    created_exercises_ids = Exercise.create_exercises_in_folder(collection_exercises,
                                                                collection_folders,
                                                                Constants.ROOT_EXERCISES,
                                                                Constants.ROOT_FOLDER_ID)
    print "Created Root Exercises: %s" % created_exercises_ids

    # created_folders_ids = create_folders(folders, root_stack)
    # print "Created Root Folders: %s" % created_folders_ids

    create_folders_and_exercises(collection_folders,
                                 collection_exercises,
                                 Constants.FOLDER_EXERCISES,
                                 Constants.ROOT_STACK_ID)

if __name__ == "__main__":
    main()
