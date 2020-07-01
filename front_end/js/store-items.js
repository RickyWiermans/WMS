function pageStoreItems() {
	//console.log("JAJA");
	var deliveryId = sessionStorage.getItem("showDeliveryId");
	console.log(deliveryId);
	document.getElementById("showDId").innerHTML = deliveryId;
	var xhr = new XMLHttpRequest();
	xhr.open("GET", baseUrl + "/getStorageLines/" + deliveryId, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			//console.log(this.responseText);
			var object = JSON.parse(this.responseText); //storageLines
			console.log(object);
			document.getElementById("showBOId").innerHTML =
				object[0].delivery.lines[0].backOrder.id;
			document.getElementById("showDDate").innerHTML =
				object[0].delivery.deliveryDate;
			document.getElementById("showDeviating").innerHTML =
				object[0].delivery.deviating;
			document.getElementById("showStatus").innerHTML =
				object[0].delivery.currentStatus;
			var storeItemsTable =
				"<table class='table img-table table-striped'><thead>" +
				"<tr><th scope='col'>Product name</th>" +
				"<th scope='col'>Amount received</th>" +
				"<th scope='col'>Amount to store</th>" +
				"<th scope='col'>Actually stored</th>" +
				"<th scope='col'>Store in Box no.</th>" +
				"<th scope='col'>Confirmation</th></tr>" +
				"</thead><tbody>";
			var line = 1;
			for (var x = 0; x < object.length; x++) {
				var showName =
					x > 0
						? object[x].product.id == object[x - 1].product.id
							? ""
							: object[x].product.name
						: object[x].product.name;
				var showAmount = object[x].delivery.lines[0].amountReceived;
				if (x > 0) {
					if (object[x].product.id == object[x - 1].product.id) {
						showAmount = "";
					} else {
						showAmount = object[x].delivery.lines[line].amountReceived;
						line++;
					}
				}
				var ed="", disable="", buttonClass="warning";
				if (object[x].storageConfirmed){
					ed = "ed";
					disable = "disabled";
					buttonClass = "secondary";
				}
				storeItemsTable +=
					"<tr><td>" +
					showName +
					"</td>" +
					"<td >" +
					showAmount +
					"</td>" +
					"<td id=ipToStore" +
					x +
					">" +
					object[x].amountToStore +
					"</td>" +
					'<td><input type="number" class="form-control" value=' +
					object[x].actuallyStored +
					" "+disable+" id=ipActuallyStored" +
					x +
					" oninput=confirmButtonCheck(" +
					x +
					")></td>" +
					"<td id=ipBoxID" +
					x +
					">" +
					object[x].box.id +
					"</td>" +
					'<td><button type="button" ' +
					" "+disable+" id=ipConfirmStorage" +
					x +
					" onclick=confirmStorageLine(" +
					x +
					"," +
					object[x].id +
					") class=\"btn btn-outline-"+buttonClass+"\">Confirm"+ed+"</button></td></tr>";
			}
			document.getElementById("storeItemsTable").innerHTML = storeItemsTable;
			var lines = document.getElementById("storeItemsTable").getElementsByTagName("TABLE")[0].rows;
			var counter = 0; 
			console.log(lines[1].cells);
			for (var x = 1; x < lines.length; x++) {
				var confirmation = lines[x].cells[5].innerText;
				if (confirmation != "Confirmed") counter++;
			}
			console.log("counter: "+counter);
			if (counter == 0) { 
				document.getElementById("ipsetStored").disabled = false;
				document.getElementById("ipsetStored").className = "btn btn-outline-success mb-3";
			}
		}
	};
	xhr.send();
}

function confirmStorageLine(id, storageLineId) {
	var a = document.getElementById("ipActuallyStored" + id).value;
	var b = document.getElementById("ipToStore" + id).innerHTML;
	if (a > b) {
		alert("The actually stored amount is higher than the amount to store. Please only store the amount that's requested.");
		return;
	} else if (a < b){
		var msg = "The actually stored amount is lower than the amount to store. Are you sure you counted right?";
		if (!confirm(msg)) return;
	}
	document.getElementById("ipActuallyStored" + id).disabled = true;
	document.getElementById("ipConfirmStorage" + id).innerHTML = "Confirmed";
	document.getElementById("ipConfirmStorage" + id).disabled = true;
	document.getElementById("ipConfirmStorage" + id).className = "btn btn-outline-secondary mb-3";
	//set storage line to confirmed --> add actually stored --> productitems status to IN_STORAGE
	var xhr = new XMLHttpRequest();
	xhr.open("POST", baseUrl + "/confirmStorageLine/" + storageLineId + "/" + a, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send();
	var lines = document.getElementById("storeItemsTable").getElementsByTagName("TABLE")[0].rows;
	var counter = 0; 
	for (var x = 1; x < lines.length; x++) {
		var confirmation = lines[x].cells[5].innerText;
		if (confirmation != "Confirmed") counter++;
	}
	console.log("counter: "+counter);
	if (counter == 0) {
		document.getElementById("ipsetStored").disabled = false;
		document.getElementById("ipsetStored").className = "btn btn-outline-success mb-3";
	}
}

function confirmButtonCheck(id) {
	var a = document.getElementById("ipActuallyStored" + id).value;
	var b = document.getElementById("ipToStore" + id).innerHTML;
	if (a == b) {
		document.getElementById("ipConfirmStorage" + id).className =
			"btn btn-outline-success";
	} else {
		document.getElementById("ipConfirmStorage" + id).className =
			"btn btn-outline-warning";
	}
}

function setStored(){
	document.getElementById("ipsetStored").disabled = true;
	document.getElementById("ipsetStored").className =
		"btn btn-outline-secondary mb-3";
	document.getElementById("ipsetStored").innerHTML = "Processing...";
	var deliveryId = sessionStorage.getItem("showDeliveryId");
	var xhr = new XMLHttpRequest();
	xhr.open("POST", baseUrl + "/setDeliveryStored/" + deliveryId, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState == 4)
			navigateShow("pages/delivery.html", showDeliveries);
	};
	xhr.send();
}