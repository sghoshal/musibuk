from constants import Constants


class User:
    def __init__(self):
        User(self)

    @staticmethod
    def delete_all_user_content(folders, exercises):
        num_exercises_deleted = exercises.delete_many(
            {
                "user_id": Constants.TEST_USER_EMAIL }
        )

        num_folders_deleted = folders.delete_many(
            {
                "user_id": Constants.TEST_USER_EMAIL
            }
        )

        return (num_exercises_deleted.deleted_count, num_folders_deleted.deleted_count)
