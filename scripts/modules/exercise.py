from datetime import datetime
from constants import Constants


class Exercise:
    def __init__(self):
        Exercise(self)

    @staticmethod
    def create_exercises_in_folder(collection_exercises, collection_folders, exercises_to_add, dest_folder_id):
        created_exercises_ids = []

        for ex_name in exercises_to_add:
            created_exercise = Exercise.create_exercise_in_folder(collection_exercises, ex_name, dest_folder_id)
            created_exercises_ids.append(created_exercise.inserted_id)

        if dest_folder_id is not Constants.ROOT_FOLDER_ID:
            collection_folders.update_one(
                {'_id': dest_folder_id},
                {'$push': {
                    'exercises': {
                        '$each': created_exercises_ids
                    }
                }
                }
            )

        return created_exercises_ids

    @staticmethod
    def create_exercise_in_folder(collection_exercises, ex_name, dest_folder_id):
        today = datetime.utcnow()
        print "---- Creating exercise %s in folder ID: %s" % (ex_name, dest_folder_id)

        # Insert into exercises collection
        exercise_created = collection_exercises.insert_one(
            {
                "user_id": Constants.TEST_USER_EMAIL,
                "name": ex_name,
                "entryType": "exercise",
                "notes": "Notes for " + ex_name,
                "folderId": dest_folder_id,
                "createdTime": today,
                "bpm": 80,
                "bpmGoal": 140,
                "maxPracticeTime": 600,
                "lastUpdated": today,
                "lastPracticeTime": 0,
                "totalPracticeTime": 0,
                "history": [],
            }
        )

        return exercise_created
