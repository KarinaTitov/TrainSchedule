$(document).ready(function () {
    //api information to firebase database
    var firebaseConfig = {
        apiKey: "AIzaSyA0Zg1aYEz5awiWGojzUiqjtpKohECpLLI",
        authDomain: "train-b54c3.firebaseapp.com",
        databaseURL: "https://train-b54c3.firebaseio.com",
        projectId: "train-b54c3",
        storageBucket: "train-b54c3.appspot.com",
        messagingSenderId: "125932547184",
        appId: "1:125932547184:web:1931babe6214187a5318b5"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);

    //Setting everything back to clear
    function clearInputs() {
        $(".form-control").val("");
    }

    //setting what happens on submit button
    $('#submit').on('click', function () {
        event.preventDefault();

        //establishing each variable from user input in each folder
        var train = $('#trainName').val().trim();
        var destinationLocation = $('#destination').val().trim();
        var trainTimeInitial = $('#firstTrainTime').val().trim();
        var timeInterval = $('#frequency').val().trim()
        
        //pushing into firebase 
        database.ref().push({
            trainName: train,
            destination: destinationLocation,
            trainStart: trainTimeInitial,
            timing: timeInterval,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        clearInputs();
    });

    // Assinging each field to a new db column
    database.ref().on("child_added", function (childSnapshot) {

        
        //calculate when next bus will come based off the start time and the current time


        //Current Time - push to DOM

        var timeFrequency = childSnapshot.val().timing;

        // Time is 3:30 AM
        var timeOne = "06:00";

        // First Time (pushed back 1 year to make sure it comes before current time)
        var timeOneConverted = moment(timeOne, "HH:mm").subtract(3, "years");

        // Current Time
        var currentTime = moment().format('HH:mm');

        // Difference between the times
        var diffTime = moment().diff(moment(timeOneConverted), "minutes");

        // Remainder
        var timeRemainder = diffTime % timeFrequency;

        // Minute Until Train
        var minutesLeft = timeFrequency - timeRemainder;

        // Next Train
        var nextTrain = moment().add(minutesLeft, "minutes");
        
        // new table row 
        var addNewTrain = $("<tr>").addClass("train-row");

        // HTML
        var trainNameColumn = $("<td>").text(childSnapshot.val().trainName);
        var destinationColumn = $("<td>").text(childSnapshot.val().destination);
        var frequencyColumn = $("<td>").text(childSnapshot.val().timing);
        var nextArrivalColumn = $("<td>").text(moment(nextTrain).format("HH:mm"));
        var minutesAwayColumn = $("<td>").text(minutesLeft);
    
        $('#currentMilitaryTime').text(currentTime);
        
        //entering each variable into the DOM
        $('#table-body').append(
            addNewTrain).append(
                addNewTrain, 
                trainNameColumn, 
                destinationColumn, 
                frequencyColumn, 
                nextArrivalColumn, 
                minutesAwayColumn);
    });
    
})