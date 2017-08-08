$(document).ready(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDaiEY9li8LaPGE2fE8o6rf3mJ1E2G7bs8",
    authDomain: "train-schedule-67e42.firebaseapp.com",
    databaseURL: "https://train-schedule-67e42.firebaseio.com",
    projectId: "train-schedule-67e42",
    storageBucket: "train-schedule-67e42.appspot.com",
    messagingSenderId: "664704185675"
  };
  firebase.initializeApp(config);

  // Create a variable to reference the database.
  var database = firebase.database();

  $('#submit').click(function(){
    event.preventDefault();

    var tName = $('#train-name').val().trim();
    var tDestination = $('#destination').val().trim();
    var tFirstTime = $('#first-train').val().trim();
    var tFrequency = $('#frequency').val().trim();
    console.log('Train Name: ' + tName);
    console.log('Destination: ' + tDestination);
    console.log('First Train Time: ' + tFirstTime);
    console.log('Frequency: ' + tFrequency);
    console.log('------------------------------------');

    // Pushing values in the database
    database.ref().push({
      name: tName,
      destination: tDestination,
      first: tFirstTime,
      frequency: tFrequency,
    });

    // Alert
    alert("Train successfully added");
    
    // Clear out input fields
    $('#train-name').val('');
    $('#destination').val('');
    $('#first-train').val('');
    $('#frequency').val('');

  });

   
  database.ref().on('child_added', function(snapshot){

    // //Calculate Minutes Away and Next Arrival
    // var currentTime = moment();
    // var firstTimeConverted = moment(tFirstTime, "HH:mm").subtract(1, "years");
    // var diffTime = moment().diff(moment(firstTimeConverted), 'minutes');
    // var tRemainder = diffTime % tFrequency;
    // var tMinutesTillTrain = tFrequency - tRemainder;
    // var nextTrain = moment().add(tMinutesTillTrain, "minutes");

    // console.log("Current Time: " + currentTime);
    // console.log("First Time Converted: " + firstTimeConverted);
    // console.log("Diff Time: " + diffTime);
    // console.log("Remainder: " + tRemainder);
    // console.log("Minutes till Train: " + tMinutesTillTrain);
    // console.log("Arrival Time: " + moment(nextTrain).format("HH:mm"));
    // console.log('------------------------------------');

    //Calculate Minutes Away and Next Arrival
    var firstTrain = snapshot.val().first;
    var frequencyInMins = snapshot.val().frequency;

    var currentTime = moment();
    var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTimeConverted), 'minutes');
    var tRemainder = diffTime % frequencyInMins;
    var tMinutesTillTrain = frequencyInMins - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");

    console.log("Current Time: " + currentTime);
    console.log("First Time Converted: " + firstTimeConverted);
    console.log("Diff Time: " + diffTime);
    console.log("Remainder: " + tRemainder);
    console.log("Minutes till Train: " + tMinutesTillTrain);
    console.log("Arrival Time: " + moment(nextTrain).format("HH:mm"));
    console.log('------------------------------------');
  
    //Create new rows and append data from firebase
    var newRow = $('<tr>');
    newRow.append('<td>'+ snapshot.val().name +'</td');
    newRow.append('<td>'+ snapshot.val().destination +'</td');
    newRow.append('<td>'+ snapshot.val().frequency +'</td');
    newRow.append('<td>'+ moment(nextTrain).format("HH:mm") +'</td');
    newRow.append('<td>'+ tMinutesTillTrain +'</td');
      
    $('tbody').append(newRow);
  
  // Handle the errors
  }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
  });
});