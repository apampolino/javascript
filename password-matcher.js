String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function PasswordMatcher(elem1, elem2, elem3, elem4) {

	this.elem1 = document.querySelector(elem1);

	this.elem2 = document.querySelector(elem2);

	this.elem3 = (elem3 == undefined || elem3 == "") ? document.querySelector('.pm-error') : document.querySelector(elem3);

	this.elem4 = (elem4 == undefined || elem4 == "") ? document.querySelector('.pm-validator') : document.querySelector(elem3);

	this.validators = {length:9, smallLetters: null, capitalLetters:1, numbers:1, specialChars:1};

	this.init = function() {
		
		let p = this

		this.elem1.addEventListener('keyup', function(e) {
			p.checkPassword()
		});
		
		this.elem2.addEventListener('keyup', function(e) {
			p.checkPassword()
		});
	}

	this.checkPassword = function () {

		let p = this;

		let password = this.elem1.value;

		let confirm_password = this.elem2.value;

		p.validator(password);

		if (password != "" && password === confirm_password) {

			this.elem3.style.display = 'none';
			this.elem2.style.borderColor = '';

			return true;

		} else {

			this.elem3.style.display = 'block';
			this.elem2.style.borderColor = 'red';

			return false;
		}
	}

	this.validator = function(password) {

		let p = this;

		let results = [];

		let valKeys = Object.keys(p.validators);

		valKeys.forEach(function(val){

			let f = 'validate' + val.capitalize();

			(p[f](password, p.validators[val])) ? true : results.push(val);
		});

		if (this.elem4) {

			if (results.length > 0) {

				this.elem4.style.display = 'block';

				let errorList = this.elem4.querySelectorAll('li')

				if (errorList) {
					errorList.forEach(function(obj){
						obj.style.display = 'none';
					});
				}

				results.forEach(function(val){

					let el = p.elem4.querySelector('.pm-' + val);

					if (el) {

						el.style.display = 'block';
					}

				});

			} else {

				this.elem4.style.display = '';
			}
		}
	}

	this.validateLength = function(string, length) {

		if (typeof(length) == "number") {

			return (string.length >= length) ? true : false;
		}

		return false;
	}

	this.validateLetters = function(string, count) {

		let match = string.match(/[a-zA-Z]/g);

		if (typeof(count) == "number" && match && match.length == count) {
		
			return true;
		}

		return (match && match.length > 0) ? true : false;
	}

	this.validateSmallLetters = function(string, count) {

		let match = string.match(/[A-Z]/g);

		if (typeof(count) == "number" && match && match.length == count) {
		
			return true;
		}

		return (match && match.length > 0) ? true : false;
	}

	this.validateCapitalLetters = function(string, count) {

		let match = string.match(/[A-Z]/g);

		if (typeof(count) == "number" && match && match.length == count) {
		
			return true;
		}

		return (match && match.length > 0) ? true : false;
	}

	this.validateNumbers = function(string, count) {

		let match = string.match(/\d/g);

		if (typeof(count) == "number" && match && match.length == count) {
		
			return true;
		}

		return (match && match.length > 0) ? true : false;
	}

	this.validateSpecialChars = function(string, count) {

		let match = string.match(/\W/g);

		if (typeof(count) == "number" && match && match.length == count) {
		
			return true;
		}

		return (match && match.length > 0) ? true : false;
	}
}