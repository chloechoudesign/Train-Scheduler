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

    // Calculate Minutes Away and Next Arrival
    var firstTimeConverted = moment(tFirstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    var diffTime = moment().diff(moment(firstTimeConverted), 'minutes');

    var tRemainder = diffTime % tFrequency;

    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log( tMinutesTillTrain + 'minutes away');

    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));


  // Pushing values in the database"
    database.ref().push({
      trainName: tName,
      trainDestination: tDestination,
      trainFrequency: tFrequency,
      minutesAway: tMinutesTillTrain,
      nextArrival: nextTrain
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
      var newRow = $('<tr>');
      
      newRow.append('<td>'+ snapshot.val().trainName +'</td');
      newRow.append('<td>'+ snapshot.val().trainDestination +'</td');
      newRow.append('<td>'+ snapshot.val().trainFrequency +'</td');
      newRow.append('<td>'+ snapshot.val().minutesAway +'</td');
      newRow.append('<td>'+ snapshot.val().nextArrival +'</td');
      
      $('tbody').append(newRow);
  
  // Handle the errors
  }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
  });

  

});