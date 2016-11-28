function startApp() {
	const baseUrl = "https://baas.kinvey.com/";
	const appKey = "kid_rkcLxcUr";
	const appSecret = "e234a245b3864b2eb7ee41e19b8ca4e5";
	const authHeaders = {
		"Authorization": "Basic " + btoa(appKey + ":" + appSecret),
		"Content-Type": "application/json"
	};

	//sessionStorage.clear();
	showHideMenuLinks();
	showView('viewHome');

	// Bind the navigation menu links
	$("#linkHome").click(showHomeView);
	$("#linkLogin").click(showLoginView);
	$("#linkRegister").click(showRegisterView);
	$("#linkListBooks").click(listBooks);
	$("#linkCreateBook").click(showCreateBookView);
	$("#linkLogout").click(logoutUser);

	// Bind the form submit buttons
	$("#buttonLoginUser").click(loginUser);
	$("#buttonRegisterUser").click(registerUser);
	$("#buttonCreateBook").click(createBook);
	$("#buttonEditBook").click(editBook)

	// Bind the info / error boxes: hide on click
	$("#infoBox, #errorBox").click(function() {
		$(this).fadeOut();
	})

	// Attach AJAX "loading" event listener
	$(document).on({
		ajaxStart: function() { $("#loadingBox").show() },
		ajaxStop: function() { $("#loadingBox").hide() }
	})

	function showHideMenuLinks() {
		$("#linkHome").show();
		if (sessionStorage.getItem('authToken')) {
			// We have logged in user
			$("#linkLogin").hide();
			$("#linkRegister").hide();
			$("#linkListBooks").show();
			$("#linkCreateBook").show();
			$("#linkLogout").show();
		} else {
			// No logged in user
			$("#linkLogin").show();
			$("#linkRegister").show();
			$("#linkListBooks").hide();
			$("#linkCreateBook").hide();
			$("#linkLogout").hide();
		}
	}

	function showView(viewName) {
		// Hide all views and show the selected view only
		$('main > section').hide();
		$('#' + viewName).show()
	}

	function showHomeView() {
		showView('viewHome')
	}

	function showLoginView(event) {
		showView('viewLogin')
		$('#formLogin').trigger('reset')
	}

	function showRegisterView() {
		$('#formRegister').trigger('reset')
		showView('viewRegister')
	}

	function showCreateBookView() {
		$('#formCreateBook').trigger('reset');
		showView('viewCreateBook')
	}

	function registerUser() {
		let username = $('#formRegister input[name=username]').val()
		let password = $('#formRegister input[name=passwd]').val()
		if (username != '' && password != '') {
			let userData = {
				username: username,
				password: password
			};
		} else {
			showError('Please fill in all fields')
		}

		$.ajax({
			method: "POST",
			url: baseUrl + "user/" + appKey + "/",
			headers: authHeaders,
			data: JSON.stringify(userData),
			success: registerSuccess,
			error: handleAjaxError
		})

		function registerSuccess(userInfo) {
			saveAuthInSession(userInfo);
			showHideMenuLinks();
			listBooks();
			showInfo('User registration successful.');
		}
	}

	function loginUser() {
		let userData = {
			username: $('#formLogin input[name=username]').val(),
			password: $('#formLogin input[name=passwd]').val()
		};
		$.ajax({
			method: "POST",
			url: baseUrl + "user/" + appKey + "/login",
			headers: authHeaders,
			data: JSON.stringify(userData),
			success: loginSuccess,
			error: handleAjaxError
		})

		function loginSuccess(userInfo) {
			saveAuthInSession(userInfo);
			showHideMenuLinks();
			listBooks();
			showInfo('Login successful.');
		}
	}

	function saveAuthInSession(user) {
		let userAuth = user._kmd.authtoken;
		sessionStorage.setItem('authToken', userAuth);
		let userId = user._id;
		sessionStorage.setItem('userId', userId);
		let username = user.username;
		$('#loggedInUser').text(
			"Welcome, " + username + "!");
	}

	function logoutUser() {
		sessionStorage.clear();
		$('#loggedInUser').text("");
		showHideMenuLinks();
		showView('viewHome');
		showInfo('Logout successful.');
	}

	function handleAjaxError(response) {
		let errorMsg = JSON.stringify(response);
		if (response.readyState === 0)
			errorMsg = "Cannot connect due to network error.";
		if (response.responseJSON &&
			response.responseJSON.description)
			errorMsg = response.responseJSON.description;
		showError(errorMsg);
	}

	function showInfo(message) {
		$('#infoBox').text(message);
		$('#infoBox').show();
		setTimeout(function() {
			$('#infoBox').fadeOut();
		}, 3000);
	}

	function showError(errorMsg) {
		$('#errorBox').text("Error: " + errorMsg);
		$('#errorBox').show();
	}

	function listBooks() {
		$('#books').empty();
		showView('viewBooks');
		$.ajax({
			method: "GET",
			url: baseUrl + "appdata/" + appKey + "/books",
			headers: getUserAuthHeaders(),
			success: loadBooksSuccess,
			error: handleAjaxError
		});

		function loadBooksSuccess(books) {
			showInfo('Books loaded.');
			if (books.length == 0) {
				$('#books').text('No books in the library.');
			} else {
				let booksTable = $('<table>')
					.append($('<tr>')
						.append('<th>Title</th><th>Author</th><th>Description</th><th>Actions</th>'));
				for (let book of books) {
					let links = [];
					if (book._acl.creator == sessionStorage['userId']) {
						let deleteLink = $('<a href="#">[Delete]</a>')
							.click(function() { deleteBook(book) });
						let editLink = $('<a href="#">[Edit]</a>')
							.click(function() { loadBookForEdit(book) });
						links = [deleteLink, ' ', editLink];
					}
					booksTable.append($('<tr>').append(
						$('<td>').text(book.title),
						$('<td>').text(book.author),
						$('<td>').text(book.description),
						$('<td>').append(links)
					));
				}
				$('#books').append(booksTable);
			}
		}
	}

	function getUserAuthHeaders() {
		return {
			"Authorization": "Kinvey " +
				sessionStorage.getItem('authToken'),
		};
	}

	function createBook() {
		let bookData = {
			title: $('#formCreateBook input[name=title]').val(),
			author: $('#formCreateBook input[name=author]').val(),
			description: $('#formCreateBook textarea[name=descr]').val()
		};
		$.ajax({
			method: "POST",
			url: baseUrl + "appdata/" + appKey + "/books",
			headers: getUserAuthHeaders(),
			data: bookData,
			success: createBookSuccess,
			error: handleAjaxError
		})

		function createBookSuccess(response) {
			listBooks();
			showInfo('Book created.');
		}
	}

	function loadBookForEdit(book) {
		$.ajax({
			method: "GET",
			url: baseUrl + "appdata/" + appKey + "/books/" + book._id,
			headers: getUserAuthHeaders(),
			success: loadBookForEditSuccess,
			error: handleAjaxError
		});

		function loadBookForEditSuccess(book) {
			$('#formEditBook input[name=id]').val(book._id);
			$('#formEditBook input[name=title]').val(book.title);
			$('#formEditBook input[name=author]')
				.val(book.author);
			$('#formEditBook textarea[name=descr]')
				.val(book.description);
			showView('viewEditBook');
		}
	}

	function editBook() {
		let bookData = {
			title: $('#formEditBook input[name=title]').val(),
			author: $('#formEditBook input[name=author]').val(),
			description: $('#formEditBook textarea[name=descr]').val()
		};
		$.ajax({
			method: "PUT",
			url: baseUrl + "appdata/" + appKey +
				"/books/" + $('#formEditBook input[name=id]').val(),
			headers: getUserAuthHeaders(),
			data: bookData,
			success: editBookSuccess,
			error: handleAjaxError
		});

		function editBookSuccess(response) {
			listBooks();
			showInfo('Book edited.');
		}
	}

	function deleteBook(book) {
		$.ajax({
			method: "DELETE",
			url: baseUrl + "appdata/" + appKey + "/books/" + book._id,
			headers: getUserAuthHeaders(),
			success: deleteBookSuccess,
			error: handleAjaxError
		});

		function deleteBookSuccess(response) {
			listBooks();
			showInfo('Book deleted.');
		}
	}
}
