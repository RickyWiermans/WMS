function registerCustomer() {
	var firstnamep = document.getElementById("ipfirstname").value;
	var lastnamep = document.getElementById("iplastname").value;
	var streetaddressp = document.getElementById("ipstreetaddress").value;
	var streetaddresstwop = document.getElementById("ipstreetaddresstwo").value;
	var cityp = document.getElementById("ipcity").value;
	var statep = document.getElementById("ipstate").value;
	var zipcodep = document.getElementById("ipzipcode").value;
	var countryp = document.getElementById("ipcountry").value;
	var phonenumberp = document.getElementById("ipphonenumber").value;
	var mobilephonenumberp = document.getElementById("ipmobilenumber").value;
	var emailp = document.getElementById("ipemail").value;
	var passwordp = document.getElementById("ippassword").value;
	var repeatpasswordp = document.getElementById("iprepeatpassword").value;

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			var listOfCustomers = JSON.parse(this.responseText);
			for (const value of listOfCustomers) {
				if (value.email == document.getElementById("ipemail").value) {
					document.getElementById("ipemail").value = "";
					alert("E-mail already taken");
					return;
				}
			}

			if (repeatpasswordp != passwordp) {
				document.getElementById("ippassword").value = "";
				document.getElementById("iprepeatpassword").value = "";
				alert("Passwords are not the same!");
				return;
			}
			var theObject = {};
			theObject.firstName = firstnamep;
			theObject.lastName = lastnamep;
			theObject.streetAddress = streetaddressp;
			theObject.streetAddresstwo = streetaddresstwop;
			theObject.city = cityp;
			theObject.state = statep;
			theObject.zipCode = zipcodep;
			theObject.country = countryp;
			theObject.phoneNumber = phonenumberp;
			theObject.mobilePhoneNumber = mobilephonenumberp;
			theObject.email = emailp;
			theObject.password = passwordp;

			var objJSON = JSON.stringify(theObject);
			addNewCustomer(objJSON);
		}
	};
	xhr.open("GET", baseUrl + "/getcustomers", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send();
}

function addNewCustomer(objJSON) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", baseUrl + "/newcustomer", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(objJSON);
	alert("Register Succesfull!");
	navigate("pages/login.html");
}
