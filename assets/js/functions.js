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
function retrieveBD() {
	//Make sure localStorage is supported.
	if (typeof(Storage) !== "Undefined") {
		//Check to see if database is already stored.
		if (localStorage.database) {
			//Parse string into readable object and assign to variable database.
			var database = JSON.parse(localStorage.database)
			return database
			console.log('Database retrieval successful.')
		}
		//If DB is not already stored, generate the structure and assign it to variable database.
		else {
			var database = {"users":[],"books":[],"users_books":[],"users_requests":[]};
			return database
			console.log('Database not found. Creating a new database.')
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
			if (document.getElementById('title').value != '' || document.getElementById('author').value != '' || document.getElementById('genre').value != '' || document.getElementById('language').value != '') {

				//Fetch DB.
				var database = retrieveBD()
				//Set results innerHTML variable.
				var html = ''
				//Loop over BD and append results to innerHTML variable.
				for (var i = 0; i < database["books"].length; i++) {
					html += '<li>'
					html += database["books"][i].title
					html += '</li>'
				}
				//Set inner HTML to results div.
				document.getElementById('results').innerHTML = html
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
function logIn () {
	//Check that storage is available and that all fields are filled. Define userExists.
	var userExists = false
	var userIndex
	if (typeof(Storage) != 'Undefined') {
		if (document.getElementById('nickname').value != '') {
			//Get database from localStorage.
			database = retrieveBD()
			//Check to see if nickname evists in database.
			for (var i = database["users"].length - 1; i >= 0; i--) {
				if (document.getElementById('nickname').value == database["users"][i].nickname) {
					//If user exists, assign necessary variables.
					userExists = true
					userIndex = i
				}
			}
			//Using assigned variables, access user nickname from DB.
			if (userExists) {
				sessionStorage.session = database["users"][userIndex].nickname
				alert(database["users"][userIndex].nickname + ' has been logged in.')
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