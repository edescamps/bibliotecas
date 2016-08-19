//jQuey function calls
var objectName

$(function() {
	$('body').fadeIn(2500);
  	$('#FNcreateNewLibrary').bind('click', createNewLibrary);
  	$('#FNloginLibrary').bind('click', loginLibrary);
  	$('#logoutBtn').bind('click', logout);

  	if (window.location.pathname == '/android_asset/www/addBook.html' /* '/home/enrique/Desktop/Bibliotecas/addBook.html' */) {
  		searchBooks()
  		$('#filterBookResultsBtn').bind('click', function() {
  			$('#filterBookResultsDiv').slideToggle('slow');
  		});
  	}

  	if (window.location.pathname == '/android_asset/www/addBook.html' /* '/home/enrique/Desktop/Bibliotecas/addBook.html' */) {
  		$('#isbnSearch').bind('click', function() {
	  			objectName = 'ISBN:' + $('#isbn').val();
	  			$('#testBookAPI').html( '<script src="https://openlibrary.org/api/books?bibkeys=ISBN:' + $('#isbn').val() + '&jscmd=data&callback=getBookInfo"></script>');
	  			
	  		});
  	}
  	$('#cameraTest').bind('click', scanISBN);

});


// Global Variables
//Create a new user.
function createNewUser() {
	if (typeof(Storage) !== "Undefined") {
		if (document.getElementById('nickname').value !== '' && document.getElementById('gender').value !== '' && document.getElementById('age').value !== '' && document.getElementById('country').value !== '') {

			var database = retrieveBD()
			//Check if user nickname exists.
			//Define new user as true. Check in for loop if user exists in DB.
			var newUser = true
			for (var i = database["users"].length - 1; i >= 0; i--) {
				if (document.getElementById('nickname').value == database["users"][i].nickname) {
					newUser = false							
				}
			}
			//Add users to the user DB
			if (newUser == true) {
				database["users"].push({"nickname":document.getElementById('nickname').value,"gender":document.getElementById('gender').value,"age":document.getElementById('age').value,"country":document.getElementById('country').value})
				alert('New user created!')
			}
			else {
				alert('Please select a different username.')
			}

			saveBD(database)
		}
		else {
			alert('Not all fields filled.')
		}
	}
	else {
		alert('localStorage not supported.')
	}
}
function createNewLibrary() {
	if (typeof(Storage) !== "Undefined") {
		if ( $('#username').val() != '' && $('#libraryName').val() != '' && $('#country').val() != '' && $('#password').val() != '' && $('#confirmPassword').val() != '' ) {

			if ($('#password').val() ==  $('#confirmPassword').val()) {
				var database = retrieveBD()
				//Check if user nickname exists.
				//Define new user as true. Check in for loop if user exists in DB.
				var newUser = true
				for (var i = database["libraries"].length - 1; i >= 0; i--) {
					if ($('#username').val() == database["libraries"][i].username) {
						newUser = false							
					}
				}
				//Add users to the user DB
				if (newUser == true) {
					database["libraries"].push({"username":$('#username').val(),"libraryName":$('#libraryName').val(),"country":$('#country').val(),"password":$('#password').val()})
					alert('New library created!')
			  		$( 'body' ).fadeOut( 2500 , function() {
						window.location.href = 'login.html';
			 		 });
				}
				else {
					alert('That username has already been taken. Please select a different username.')
				}

				saveBD(database)
			} 
			else {
				alert('Paswords do not match.')
			}
			
		}
		else {
			alert('Not all fields filled.')
		}
	}
	else {
		alert('localStorage not supported.')
	}
}
function retrieveBD() {
	//Make sure localStorage is supported.
	if (typeof(Storage) !== "Undefined") {
		//Check to see if database is already stored.
		if (localStorage.database) {
			//Parse string into readable object and assign to variable database.
			var database = JSON.parse(localStorage.database)
			return database
			alert('Database retrieval successful.')
		}
		//If DB is not already stored, generate the structure and assign it to variable database.
		else {
			var database = {"libraries":[],"books":[],"users_books":[],"users_requests":[]};
			return database
			alert('Database not found. Creating a new database.')
		}
	}
	else {
		alert('localStorage not supported.')
	}
}
function saveBD(databaseObject) {
	//Convert DB from object to string.
	var databaseString = JSON.stringify(databaseObject)
	//Make sure localStorage is supported.
	if (typeof(Storage) !== "Undefined") {
			//Save database from JSON string.
			localStorage.database = databaseString
			console.log('Database save successful.')
	}
	else {
		alert('localStorage not supported.')
	}
}
function addNewBook () {
	//Make sure localStorage is supported.
	if (typeof(Storage) != 'Undefined') {
		//Make sure a user is logged in.
		if (sessionStorage.session) {
			//Make sure all form fields are filled.
			if (document.getElementById('title').value != '' && document.getElementById('author').value != '' && document.getElementById('genre').value != '' && document.getElementById('language').value != '') {
				
				//Retrieve DB
				var database = retrieveBD()
				//Generate bok ID
				var bookId = bookIdGenerator()
				
				//Check to see if book table is empty. If it is, add first book.
				if (database["books"].length == 0) {
					alert("First book.")
					database["books"].push({"id":bookId,"title":document.getElementById('title').value,"author":document.getElementById('author').value,"genre":document.getElementById('genre').value,"language":document.getElementById('language').value})
					database["users_books"].push({"bookId":bookId,"userId":sessionStorage.session,"holderId":sessionStorage.session})
				}
				//If book table is not empty, add book, but make sure bookId does not repeat first by looping over all items in book table.
				else {
					alert("Not first book.")
					for (var i = 0; i < database["books"].length; i++) {
						//If bookId exists, generate a new bookId and reset for look counter.
						if (database["books"][i].id == bookId) {
							alert('Changing book id.')
							bookId = bookIdGenerator()
							i = 0
						}
					}
					database["books"].push({"id":bookId,"title":document.getElementById('title').value,"author":document.getElementById('author').value,"genre":document.getElementById('genre').value,"language":document.getElementById('language').value})
					database["users_books"].push({"bookId":bookId,"userId":sessionStorage.session,"holderId":sessionStorage.session})
				}
				//Save DB
				saveBD(database)

			}
			else {
				alert('Please fill out all fields.')
			}
		}
		else {
			alert('Please log in to add books.')
		}
	}
	else {
		alert('localStorage is not supported.')
	}
}
function searchBooks () {
	//Make sure localStorage is supported.
	if (typeof(Storage) != 'Undefined') {
		//Make sure user is logged in.
		if (sessionStorage.session) {
			//Make sure at least one field is not empty.
			if (true) {

				//Fetch DB.
				var database = retrieveBD()
				if (database["books"].length > 0) {
					//Loop over BD and append results to innerHTML variable.
					for (var i = 0; i < database["libraries"].length; i++) {
						//Set inner HTML to results div.
						$( "#bookResultsTable" ).append( "<tr><td>" + database["libraries"][i].username + "</td><td>" + database["libraries"][i].country + "</td><td>" + database["libraries"][i].libraryName + "</td></tr>" );
					}
				} 
				else {
					$( "#bookResults" ).html('<p>You have no books in you book list. You can add books <a href="addBook.html">here</a>.</p>');
				}
				
				//Save DB. Update search density.
				saveBD(database)
			}
			else {
				alert('Please fill out all fields.')
			}
		}
		else {
			alert('Please log in to search ofr books.')
		}
	}
	else {
		alert('localStorage not supported.')
	}
}
function bookIdGenerator () {
	//Define character set to choose from.
	var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	var bookId = ''
	//Assign random characters to bookId string.
	for (var i = 5; i >= 0; i--) {
		bookId += characters[Math.floor(Math.random()*36)]
	}
	return bookId
}
function loginLibrary () {
	//Check that storage is available and that all fields are filled. Define userExists.
	var userExists = false
	var userIndex
	if (typeof(Storage) != 'Undefined') {
		if ($('#username').val() != '' && $('#password').val() != '') {
			//Get database from localStorage.
			database = retrieveBD()
			//Check to see if nickname evists in database.
			for (var i = database["libraries"].length - 1; i >= 0; i--) {
				if ($('#username').val() == database["libraries"][i].username && $('#password').val() == database["libraries"][i].password) {
					//If user exists, assign necessary variables.
					userExists = true
					userIndex = i
				}
			}
			//Using assigned variables, access user nickname from DB.
			if (userExists) {
				sessionStorage.session = database["libraries"][userIndex].username
				alert(database["libraries"][userIndex].username + ' has been logged in.')
				$( 'body' ).fadeOut( 2500 , function() {
					window.location.href = 'addBook.html';
			 	});
			}
			else {
				alert('User not found. Please register.')
			}
		}
		else {
			alert('Please fill out all fields.')
		}
	}
	else {
		alert('localStorage not supported.')
	}
}
function requestBook () {
	//Create function.
}
function tradeBook () {
	//Create function.
}
function logout () {
	if (typeof(Storage) != 'Undefined') {
		if (sessionStorage.session) {
			sessionStorage.clear()
			$( 'body' ).fadeOut( 2500 , function() {
				window.location.href = 'login.html';
			});
		} 
		else {
			alert('Nobody is logged in.')
		}
	} 
	else {
		alert('localStorage not supported.')
	}
}
function scanISBN () {
    alert('scanning');
    
    var scanner = cordova.require("cordova/plugin/BarcodeScanner");

    scanner.scan( function (result) {

    	$('#isbn').val(result.text)

    	objectName = 'ISBN:' + $('#isbn').val();
	  	$('#testBookAPI').html( '<script src="https://openlibrary.org/api/books?bibkeys=ISBN:' + $('#isbn').val() + '&jscmd=data&callback=getBookInfo"></script>');

    }, function (error) {

        console.log("Scanning failed: ", error);

    },
    {
        "preferFrontCamera" : true, // iOS and Android
        "showFlipCameraButton" : false, // iOS and Android
        "prompt" : "Place a barcode inside the scan area", // supported on Android only
        "orientation" : "portrait" // Android only (portrait|landscape), default unset so it rotates with the device
    } );

}
//This function is triggered after we retrieve info from Open Library
function getBookInfo (bookData) {
	//Browse through the JSON structure and assign values to input fields.
	$('#title').val(bookData[objectName]["title"])
	$('#author').val(bookData[objectName]["authors"][0]["name"])
}
