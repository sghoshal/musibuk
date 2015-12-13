from pymongo import MongoClient
from datetime import datetime

# Global variables
host_name = 'localhost'
port = 27017
database = 'musibuk'
mongo_uri = 'mongodb://' + host_name + ':' + str(port) + '/' + database
test_user_email = 'test@mb.com'

root_folder_id = "root"
root_stack_id = "root"
root_exercises = ['Random noodling around', 'Misc']
folder_exercises = {
    'Warm Up':       ['Chromatic', '4 notes/string picking', '8 notes/string picking',
                      'Hammer-on & Pull-offs', 'Bends', 'Legato'],
    'Chords':        ['CAGED', 'Jazz chords'],
    'Pentatonics':   ['5 positions', 'Legato', 'Major Pentatonic Run 1', 'Major Pentatonic run 2',
                      '5 positions Hammer-on and Pull-offs', 'Triplets', 'Alternate Triplets',
                      'Groups of 4s', 'Thirds', 'Fourths', 'Fifths'],
    'Scales':        ['Ascending Descending 5 positions', 'Triplets', 'Groups of 4s',
                      'Thirds', 'Fourths', 'Fifths'],
    'Arpeggios':     ['Major', 'Minor', 'Major 7th', 'Minor 7th', 'Dominanth 7th', 'Minor 7th Flat 5'],
    'Modes':         ['Dorian', 'Aeolian', 'Phrygian', 'Lydian', 'Ionian', 'Mixolydian', 'Locrian'],
    'Riffs & Licks': ['Guthrie Govan', 'David Gilmour', 'Slash', 'Porcupine Tree', 'Joe Satriani', 'Opeth',
                      'From Licklibrary', 'John Petrucci', 'Joe Pass'],
    'Songs':         ['Stairway To Heaven', 'Hotel California', 'Comfortably Numb', 'Alive', 'Windowpane',
                      'Sweet Child', 'November Rain', 'Blackest Eyes', 'Another Brick In The Wall',
                      'Time', 'Ancestral Solo', 'Nothing Else Matters', 'Freedom'],
    'Jam Tracks':    ['A minor Blues', '2-5-1 progression', 'Rock Progression']
}


def create_folders_and_exercises(collection_folders, collection_exercises, folders_exercises_to_create, stack):
    for folder_name in folders_exercises_to_create.keys():
        print "Creating Folder: %s" % folder_name
        folder_created = create_folder(collection_folders, folder_name, stack)
        print "Done!"

        if folder_created.acknowledged:
            exercises = folders_exercises_to_create.get(folder_name)
            print "-- Creating exercises: %s" % exercises
            create_exercises_in_folder(collection_exercises, collection_folders, exercises, folder_created.inserted_id)
            print "Done!"

        else:
            print "Folder %s was not created succesfully." % folder_name


def create_exercises_in_folder(collection_exercises, collection_folders, exercises_to_add, dest_folder_id):
    created_exercises_ids = []

    for ex_name in exercises_to_add:
        today = datetime.utcnow()
        print "---- Creating exercise %s in folder ID: %s" % (ex_name, dest_folder_id)

        # Insert into exercises collection
        exercise_created = collection_exercises.insert_one(
            {
                "user_id": test_user_email,
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
        created_exercises_ids.append(exercise_created.inserted_id)

    if dest_folder_id is not root_folder_id:
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


def create_folders(collection_folders, folder_list, stack):
    created_folders = []

    for folder_name in folder_list:
        created_folders.append(create_folders(collection_folders, folder_name, stack))

    return created_folders


def create_folder(collection_folders, folder_name, stack):
    today = datetime.utcnow()
    created_folder = collection_folders.insert_one(
        {
            "user_id": test_user_email,
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


def delete_folder_exercises(exercises, folder_name):
    num_rows_deleted = exercises.delete_many(
        {
            "user_id": test_user_email,
            "folderId": folder_name
        }
    )
    return num_rows_deleted.deleted_count


def delete_all_user_content(folders, exercises):
    num_exercises_deleted = exercises.delete_many(
        {
            "user_id": test_user_email
        }
    )

    num_folders_deleted = folders.delete_many(
        {
            "user_id": test_user_email
        }
    )

    return (num_exercises_deleted.deleted_count, num_folders_deleted.deleted_count)


def main():
    client = MongoClient(mongo_uri)
    db = client[database]

    # Collections
    collection_exercises = db['exercises']
    collection_folders = db['folders']

    # Find in collection
    # cursor = exercises.find()

    # for document in cursor:
    # 	print "%s\n" % document

    # num_deleted = delete_folder_exercises(exercises, "root")
    # print "Deleted " + str(num_deleted) + " exercises"

    num_deleted = delete_all_user_content(collection_folders, collection_exercises)
    print "Deleted " + str(num_deleted[0]) + " exercises " + str(num_deleted[1]) + " folders."

    created_exercises_ids = create_exercises_in_folder(collection_exercises, collection_folders, root_exercises,
                                                       root_folder_id)
    print "Created Root Exercises: %s" % created_exercises_ids

    # created_folders_ids = create_folders(folders, root_stack)
    # print "Created Root Folders: %s" % created_folders_ids

    create_folders_and_exercises(collection_folders, collection_exercises, folder_exercises, root_stack_id)

if __name__ == "__main__":
    main()
