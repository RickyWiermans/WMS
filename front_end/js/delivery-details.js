function pageDetails() {
	//console.log("JAJA");
	var deliveryId = sessionStorage.getItem("showDeliveryId");
	console.log(deliveryId);
	document.getElementById("showDId").innerHTML = deliveryId;
	var xhr = new XMLHttpRequest();
	xhr.open("GET", baseUrl + "/getBODelivery/" + deliveryId, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			//console.log(this.responseText);
			var object = JSON.parse(this.responseText);
			if (object.currentStatus == "COMPLETE")
				navigateShow("pages/store-items.html", pageStoreItems);
			console.log(object);
			document.getElementById("showBOId").innerHTML =
				object.lines[0].backOrder.id;
			document.getElementById("showDDate").innerHTML = object.deliveryDate;
			document.getElementById("showDeviating").innerHTML = object.deviating;
			document.getElementById("showStatus").innerHTML = object.currentStatus;
			var detailTable =
				"<table class='table img-table table-striped'><thead>" +
				"<tr><th scope='col'>Product name</th>" +
				"<th scope='col'>Amount ordered</th>" +
				"<th scope='col'>Amount received</th>" +
				"<th scope='col'>Confirmation</th>" +
				"<th scope='col'>Deviation handling</th></tr>" +
				"</thead><tbody>";
			for (var x = 0; x < object.lines.length; x++) {
				var disable = (object.lines[x].deliveryConfirmed || object.currentStatus == "EXPECTED") ? "disabled" : "";
				var ed = object.lines[x].deliveryConfirmed ? "ed" : "";
				var amountToShow =
					object.lines[x].amountReceived < 0
						? ""
						: object.lines[x].amountReceived;
				var hide = object.lines[x].needsResolving
					? ">Resolve deviation"
					: object.lines[x].resolved
					? "disabled >Resolved by Supervisor"
					: "hidden >Resolve deviation";
				detailTable +=
					"<tr><td>" +
					object.lines[x].product.name +
					"</td>" +
					"<td id=ipAmountOrdered" +
					x +
					">" +
					object.lines[x].amount +
					"</td>" +
					'<td><input type="number" class="form-control" placeholder="" ' +
					"id=ipAmountReceived" +
					x +
					" " +
					disable +
					" value=" +
					amountToShow +
					"></td>" +
					'<td><button type="button" class="btn btn-outline-secondary"' +
					" id=ipConfirm" +
					x +
					" onclick=confirmation(" +
					x +
					"," +
					object.lines.length +
					"," +
					object.lines[x].id +
					") " +
					disable +
					">Confirm" +
					ed +
					"</button></td>" +
					'<td><button type="button" class="btn btn-outline-danger" id=ipResolve' +
					x +
					" " +
					" onclick=resolveIssue(" +
					x +
					"," +
					object.lines.length +
					"," +
					object.lines[x].id +
					") " +
					hide +
					"</button></td></tr>";
			}
			document.getElementById("deliveryDetailTable").innerHTML = detailTable;
			if (object.currentStatus == "EXPECTED") {
				document.getElementById("ipDelete").disabled = false;
				for (var x = 0; x < object.lines.length; x++) {
					document.getElementById("ipConfirm" + x).disabled = true;
				}
			}
			if (
				object.currentStatus == "NEEDS_RESOLVING" ||
				object.currentStatus == "ARRIVED"
			) {
				var counter = 0;
				for (var x = 0; x < object.lines.length; x++) {
					var confirmation = document.getElementById("ipConfirm" + x).innerHTML;
					if (confirmation != "Confirmed") counter++;
					if (
						!(
							document.getElementById("ipResolve" + x).hidden ||
							document.getElementById("ipResolve" + x).disabled
						)
					)
						counter++;
				}
				console.log("counter: " + counter);
				if (counter == 0)
					document.getElementById("ipcheckComplete").disabled = false;
			}
		}
	};
	xhr.send();
}

function confirmation(id, lines, BOLID) {
	var deliveryId = sessionStorage.getItem("showDeliveryId");
	var received = document.getElementById("ipAmountReceived" + id).value;
	if (received == 0) {
		if (!confirm("Are you sure to confirm that the amount received equals 0 ?"))
			return;
	}
	var xhr = new XMLHttpRequest();
	xhr.open("GET", baseUrl + "/getBackOrderLine/" + BOLID, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			var object = JSON.parse(this.responseText);
			object.deliveryConfirmed = true;
			object.amountReceived = received;
			var ordered = document.getElementById("ipAmountOrdered" + id).innerHTML;
			if (ordered != received) {
				document.getElementById("ipResolve" + id).hidden = false;
				document.getElementById("showDeviating").innerHTML = true;
				object.needsResolving = true;
				var xhr1 = new XMLHttpRequest();
				xhr1.open(
					"POST",
					baseUrl + "/setDeliveryDeviating/" + deliveryId,
					true
				);
				xhr1.setRequestHeader("Content-Type", "application/json");
				xhr1.send();
				console.log("afwijkend");
			}
			document.getElementById("ipConfirm" + id).innerHTML = "Confirmed";
			document.getElementById("ipConfirm" + id).disabled = true;
			document.getElementById("ipAmountReceived" + id).disabled = true;
			var counter = 0;
			for (var x = 0; x < lines; x++) {
				var confirmation = document.getElementById("ipConfirm" + x).innerHTML;
				if (confirmation != "Confirmed") counter++;
				if (
					!(
						document.getElementById("ipResolve" + x).hidden ||
						document.getElementById("ipResolve" + x).disabled
					)
				)
					counter++;
			}
			if (counter == 0)
				document.getElementById("ipcheckComplete").disabled = false;
			var objJSON = JSON.stringify(object);
			var xhr2 = new XMLHttpRequest();
			xhr2.open("POST", baseUrl + "/updateBackOrderLine", true);
			xhr2.setRequestHeader("Content-Type", "application/json");
			xhr2.send(objJSON);
		}
	};
	xhr.send();
}

function resolveIssue(id, lines, BOLID) {
	document.getElementById("ipResolve" + id).disabled = true;
	document.getElementById("ipResolve" + id).innerHTML =
		"Resolved by Supervisor";
	var counter = 0;
	for (var x = 0; x < lines; x++) {
		var confirmation = document.getElementById("ipConfirm" + x).innerHTML;
		if (confirmation != "Confirmed") counter++;
		if (
			!(
				document.getElementById("ipResolve" + x).hidden ||
				document.getElementById("ipResolve" + x).disabled
			)
		)
			counter++;
	}
	if (counter == 0) document.getElementById("ipcheckComplete").disabled = false;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", baseUrl + "/resolveDeviation/" + BOLID, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send();
}

function deliveryCompleted() {
	document.getElementById("ipcheckComplete").disabled = true;
	document.getElementById("ipcheckComplete").className =
		"btn btn-outline-secondary mb-3";
	document.getElementById("ipcheckComplete").innerHTML = "Processing...";
	var deliveryId = sessionStorage.getItem("showDeliveryId");
	var xhr = new XMLHttpRequest();
	xhr.open("POST", baseUrl + "/completeDelivery/" + deliveryId, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			var xhr5 = new XMLHttpRequest();
			xhr5.open("POST", baseUrl + "/createStorageLines/" + deliveryId, true);
			xhr5.setRequestHeader("Content-Type", "application/json");
			xhr5.onreadystatechange = function () {
				if (this.readyState == 4) {
					navigateShow("pages/delivery.html", showDeliveries);
				}
			};
			xhr5.send();
		}
	};
	xhr.send();
}

function deleteDelivery() {
	var deliveryId = sessionStorage.getItem("showDeliveryId");
	if (
		confirm(
			"Are you sure to delete this delivery from the system? This is a permanent action."
		)
	) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", baseUrl + "/deleteDelivery/" + deliveryId, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onreadystatechange = function () {
			if (this.readyState == 4)
				navigateShow("pages/delivery.html", showDeliveries);
		};
		xhr.send();
	}
}
