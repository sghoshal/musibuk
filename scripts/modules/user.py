from constants import Constants


class User:
    """
    This class holds static methods pertaining to users in the app.
    """

    def __init__(self):
        User(self)

    @staticmethod
    def delete_all_user_content(folders, exercises):
        """
        Deletes ALL user contents from the DB.
        :param folders:     MongoDB reference to collection - 'folders'
        :param exercises:   MongoDB reference to collection - 'exercises'
        :return:            A tuple of count of exercises and folders deleted.
        """
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
