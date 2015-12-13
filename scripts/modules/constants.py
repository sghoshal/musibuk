class Constants:
    HOST = 'localhost'
    PORT = 27017
    DATABASE = 'musibuk'
    MONGO_URI = 'mongodb://' + HOST + ':' + str(PORT) + '/' + DATABASE
    COLLECTION_FOLDER = 'folder'
    COLLECTION_EXERCISE = 'exercise'

    TEST_USER_EMAIL = 'test@mb.com'
    ROOT_FOLDER_ID = "root"
    ROOT_STACK_ID = "root"
    ROOT_EXERCISES = ['Random noodling around', 'Misc']
    FOLDER_EXERCISES = {
        'Warm Up': ['Chromatic', '4 notes/string picking', '8 notes/string picking',
                    'Hammer-on & Pull-offs', 'Bends', 'Legato'],
        'Chords': ['CAGED', 'Jazz chords'],
        'Pentatonics': ['5 positions', 'Legato', 'Major Pentatonic Run 1', 'Major Pentatonic run 2',
                        '5 positions Hammer-on and Pull-offs', 'Triplets', 'Alternate Triplets',
                        'Groups of 4s', 'Thirds', 'Fourths', 'Fifths'],
        'Scales': ['Ascending Descending 5 positions', 'Triplets', 'Groups of 4s',
                   'Thirds', 'Fourths', 'Fifths'],
        'Arpeggios': ['Major', 'Minor', 'Major 7th', 'Minor 7th', 'Dominanth 7th', 'Minor 7th Flat 5'],
        'Modes': ['Dorian', 'Aeolian', 'Phrygian', 'Lydian', 'Ionian', 'Mixolydian', 'Locrian'],
        'Riffs & Licks': ['Guthrie Govan', 'David Gilmour', 'Slash', 'Porcupine Tree', 'Joe Satriani', 'Opeth',
                          'From Licklibrary', 'John Petrucci', 'Joe Pass'],
        'Songs': ['Stairway To Heaven', 'Hotel California', 'Comfortably Numb', 'Alive', 'Windowpane',
                  'Sweet Child', 'November Rain', 'Blackest Eyes', 'Another Brick In The Wall',
                  'Time', 'Ancestral Solo', 'Nothing Else Matters', 'Freedom'],
        'Jam Tracks': ['A minor Blues', '2-5-1 progression', 'Rock Progression']
    }

    def __init__(self):
        Constants()
