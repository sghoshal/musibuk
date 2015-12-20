/**
 * Module containing data and time related utility methods.
 */
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
    },

    getFullDateString: function(inputDate) {
        var year = inputDate.getFullYear();
        var month = inputDate.getMonth() + 1;       // Because the month returned is from 0 - 11
        var dateInMonth = inputDate.getDate();

        return (year.toString() + "-" + month.toString() + "-" + dateInMonth.toString());
    },

    getShortDateWithYearString: function(inputDate) {
        var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

        return monthNames[inputDate.getMonth()] + " " + inputDate.getDate() + ", " + inputDate.getFullYear();
    },

    getShortDateString: function(inputDate) {
        var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
                       
        return monthNames[inputDate.getMonth()] + " " + inputDate.getDate();
    },

    convertDateToUtc: function(inputDate) { 
        return new Date(inputDate.toISOString()); 
    },

    isSameDate: function(date1, date2) {

        return ((date1.getFullYear() === date2.getFullYear()) &&
                (date1.getMonth() === date2.getMonth()) &&
                (date1.getDate() === date2.getDate()));
    }
}