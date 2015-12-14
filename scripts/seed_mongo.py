from pymongo import MongoClient
from datetime import datetime, timedelta

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
            Exercise.create_exercises_in_folder(collection_exercises, collection_folders, exercises,
                                                folder_created.inserted_id)
            print "Done!"

        else:
            print "Folder %s was not created successfully." % folder_name


def create_practice_sessions(collection_folders, collection_exercises):
    all_folders = Folder.get_all_folders(collection_folders)

    for folder in all_folders:
        folder_exercises = folder['exercises']

        for each_exercise_id in folder_exercises:
            # print "Adding a practice session to %s" % each_exercise_id
            today = datetime.utcnow()

            for i in range(10, -1, -1):
                practice_session_date = today - timedelta(i)
                updated_exercise = Exercise.add_practice_session(collection_exercises,
                                                                 each_exercise_id,
                                                                 practice_session_date)
                ex_latest_session = updated_exercise['history'][-1]
                folder = Folder.update_folder_with_practice_session(collection_folders,
                                                                    folder,
                                                                    ex_latest_session,
                                                                    updated_exercise['lastPracticeTime'])


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

    create_practice_sessions(collection_folders, collection_exercises)


if __name__ == "__main__":
    main()
