from datetime import datetime
from constants import Constants


class Folder:
    def __init__(self):
        Folder(self)

    @staticmethod
    def hello_world():
        print "Hello world from folder class"

    def create_folders(collection_folders, folder_list, stack):
        created_folders = []

        for folder_name in folder_list:
            created_folders.append(Folder.create_folder(collection_folders, folder_name, stack))

        return created_folders

    @staticmethod
    def create_folder(collection_folders, folder_name, stack):
        today = datetime.utcnow()
        created_folder = collection_folders.insert_one(
            {
                "user_id": Constants.TEST_USER_EMAIL,
                "name": folder_name,
                "entryType": "folder",
                "exercises": [],
                "stack": stack,
                "createdTime": today,
                "lastUpdated": today,
                "lastPracticeTime": 0,
                "totalPracticeTime": 0,
                "history": []
            }
        )

        return created_folder

    @staticmethod
    def delete_folder_exercises(exercises, folder_name):
        num_rows_deleted = exercises.delete_many(
            {
                "user_id": Constants.TEST_USER_EMAIL,
                "folderId": folder_name
            }
        )
        return num_rows_deleted.deleted_count
