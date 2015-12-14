from datetime import datetime, timedelta
from constants import Constants
from bson.objectid import ObjectId

import random


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

    @staticmethod
    def generate_random_session():
        # Generate a random BPM and time within certail limits
        bpm = random.randint(120, 140)
        practice_time = random.randint(5 * 60, 15 * 60)
        return (bpm, practice_time)

    @staticmethod
    def add_practice_sessions(collection_exercises, ex_id):

        today = datetime.utcnow()

        for i in range(30, 0, -1):
            practice_session = {}
            random_session = Exercise.generate_random_session()
            practice_date = today - timedelta(i)

            practice_session['date'] = practice_date
            practice_session['bpm'] = random_session[0]
            practice_session['practiceTime'] = random_session[1]

            updated_exercise = collection_exercises.update_one(
                {'_id': ex_id},
                {
                    '$push': {
                        'history': practice_session
                    },
                    '$inc': {
                        'totalPracticeTime': random_session[1]
                    },
                    '$set': {
                        'lastPracticeTime': random_session[1]
                    },
                    '$set': {
                        'lastUpdated': practice_date
                    }
                }
            )

            # print 'Updated exercise %s' % updated_exercise.matched_count
