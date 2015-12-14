import copy

from datetime import datetime
from constants import Constants
from pymongo import ReturnDocument


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
    def delete_folder_exercises(collection_exercises, folder_name):
        num_rows_deleted = collection_exercises.delete_many(
            {
                "user_id": Constants.TEST_USER_EMAIL,
                "folderId": folder_name
            }
        )
        return num_rows_deleted.deleted_count

    @staticmethod
    def get_all_folders(collection_folders):
        documents = []

        cursor = collection_folders.find({})

        for document in cursor:
            # doc_attributes = {}
            #
            # for key, value in document.iteritems():
            #     if key == 'user_id':
            #         doc_attributes[key] = value
            #     elif key == '_id':
            #         doc_attributes[key] = value
            #     elif key == 'name':
            #         doc_attributes[key] = value
            #     elif key == 'stack':
            #         doc_attributes[key] = value

            documents.append(document)

        return documents

    @staticmethod
    def update_folder_with_practice_session(collection_folders, folder, practice_session, ex_last_practice_time):

        print "Original Folder: %s" % folder

        new_folder = {
            'createdTime': folder['createdTime'],
            'entryType': folder['entryType'],
            'exercises': folder['exercises'],
            'name': folder['name'],
            'stack': folder['stack'],
            'user_id': folder['user_id']
        }

        # If the practice session's date is the same as the last updated date of the folder, then:
        #   - lastPracticeTime should be added
        #   - otherwise this is a new lastPracticeTime

        if practice_session['date'] == folder['lastUpdated']:
            new_folder['lastPracticeTime'] = folder['lastPracticeTime'] + ex_last_practice_time
        else:
            new_folder['lastPracticeTime'] = ex_last_practice_time

        new_folder['lastUpdated'] = practice_session['date']
        new_folder['totalPracticeTime'] = folder['totalPracticeTime'] + practice_session['practiceTime']

        original_folder_history_list = folder['history']
        new_folder_history_list = copy.deepcopy(original_folder_history_list)
        new_history_entry = {}

        # If there is a history already present, then check if the latest history is on the same day as this session:
        # - If yes, update the latest history by adding this session's time to the existing time.
        # - Else this is a new practice session - so add a new entry to the history list.
        # Else:
        # - This is a new practice session. Add a new entry to the history list

        if len(original_folder_history_list) > 0:
            print "Length of folder history > 0 and = %s\n" % len(original_folder_history_list)

            found_history_tuple = Folder.is_history_present(original_folder_history_list, practice_session['date'])

            if found_history_tuple is not None:
                found_history = found_history_tuple[0]
                index = found_history_tuple[1]

                print "FOUND!\n"
                new_history_entry['date'] = practice_session['date']
                new_history_entry['practiceTime'] = found_history['practiceTime'] + practice_session['practiceTime']

                new_folder_history_list[index] = new_history_entry
            else:
                print "NOPE. COULDNT FIND IT BRO!\n"
                new_history_entry['date'] = practice_session['date']
                new_history_entry['practiceTime'] = practice_session['practiceTime']

                new_folder_history_list.append(new_history_entry)
        else:
            print "Length of folder history = 0"
            new_history_entry['date'] = practice_session['date']
            new_history_entry['practiceTime'] = practice_session['practiceTime']

            new_folder_history_list.append(new_history_entry)

        new_folder['history'] = new_folder_history_list
        # print "Updating folder to %s" % new_folder

        replaced_folder = collection_folders.find_one_and_replace(
            {'_id': folder['_id']},
            new_folder,
            return_document=ReturnDocument.AFTER
        )

        print "Done! Updated to: %s\n\n" % replaced_folder
        return replaced_folder

    @staticmethod
    def is_history_present(history_list, input_date):
        print "Trying to search for history with Date: %s" % input_date.date()
        found_history = next(((d, index) for (index, d) in enumerate(history_list) if d['date'].date() == input_date.date()), None)
        return found_history

    @staticmethod
    def is_same_date(date1, date2):
        return date1.date() == date2.date()
