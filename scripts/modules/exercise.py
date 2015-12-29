import random

from datetime import datetime
from constants import Constants
from pymongo import ReturnDocument


class Exercise:
    """
    The class holds static methods to carry out DB operations related to exercises in the app.
    """

    def __init__(self):
        Exercise(self)

    @staticmethod
    def create_exercises_in_folder(collection_exercises, collection_folders, exercises_to_add, dest_folder_id):
        """
        Create multiple exercises in a folder.

        :param collection_exercises: MongoDB reference to collection - 'exercises'.
        :param collection_folders:   MongoDB reference to collection - 'folders'.
        :param exercises_to_add:     The list of exercise names to be created.
        :param dest_folder_id:       The ID of the folder in which these exercises should reside.
        :return:                     The list of exercise IDs created.
        """
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
        """
        Create a single exercise in a folder with default values.

        :param collection_exercises: MongoDB reference to collection - 'exercises'
        :param ex_name:              The name of the exercise to be created.
        :param dest_folder_id:       The ID of the folder in which this exercise should reside.
        :return:                     The created exercise document.
        """
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
        """
        Generate a random BPM and time within certain limits.

        :return: A tuple of Beats per minute and Practice Time in seconds.
        """
        bpm = random.randint(Constants.BPM_MIN, Constants.BPM_MAX)
        practice_time = random.randint(Constants.PRACTICE_TIME_MIN * Constants.SECONDS_IN_MIN,
                                       Constants.PRACTICE_TIME_MAX * Constants.SECONDS_IN_MIN)
        return (bpm, practice_time)

    @staticmethod
    def add_practice_session(collection_exercises, ex_id, practice_session_date):
        """
        Add a random practice session to an exercise. The session consists of time practiced and BPM.

        :param collection_exercises:    MongoDB collection 'exercises'
        :param ex_id:                   The ObjectID of the exercise to which the session is to be added.
        :param practice_session_date:   The date of the practice session.
        :return:                        The exercise document updated in MongoDB AFTER update.
        """

        practice_session = {}
        random_session = Exercise.generate_random_session()

        practice_session['date'] = practice_session_date
        practice_session['bpm'] = random_session[0]
        practice_session['practiceTime'] = random_session[1]

        updated_exercise = collection_exercises.find_one_and_update(
            {'_id': ex_id},
            {
                '$push': {
                    'history': practice_session
                },
                '$inc': {
                    'totalPracticeTime': random_session[1]
                },
                '$set': {
                    'lastPracticeTime': random_session[1],
                    'lastUpdated': practice_session_date
                }
            },
            return_document=ReturnDocument.AFTER
        )

        return updated_exercise
