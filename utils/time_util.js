module.exports = {
    convertSecondsToTimeString: function(seconds) {
        var totalTimeHours = parseInt( seconds / 3600 );
        var totalTimeMinutes = parseInt( seconds / 60 ) % 60;
        var totalTimeSeconds = parseInt( seconds % 60 );


        var totalPracticeTimeString = "";
        
        if (totalTimeHours > 0) {
            totalPracticeTimeString += (totalTimeHours === 1 ? "1 hour" : (totalTimeHours + " hours"));
        }

        if (totalTimeMinutes > 0) {
            if(totalPracticeTimeString.length > 0) {
                totalPracticeTimeString += ", ";
            }

            totalPracticeTimeString += (totalTimeMinutes === 1 ? "1 minute" : (totalTimeMinutes + " minutes"));
        }

        if (totalTimeSeconds > 0) {
            if(totalPracticeTimeString.length > 0) {
                totalPracticeTimeString += ", ";
            }

            totalPracticeTimeString += (totalTimeSeconds === 1 ? "1 second" : (totalTimeSeconds + " seconds"));
        }

        return totalPracticeTimeString;
    }
}