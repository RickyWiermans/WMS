function showDeliveries() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			//console.log(this.responseText);
			var deliveryRows = JSON.parse(this.responseText);
			//console.log(productsRow);
			var deliveryTable = "";
			if (!deliveryRows.length) {
				deliveryTable +=
					"<p>The delivery overview is empty. There are no deliveries to show.<br>";
				document.getElementById("searchBarDelivery").hidden = true;
				document.getElementById("sortTextDelivery").hidden = true;
			} else {
				deliveryTable +=
					"<table class='table table-striped'><thead>" +
					"<tr><th scope='col' onclick=sortTable(0,true)>BackOrder ID</th>" +
					"<th scope='col' onclick=sortTable(1,true)>BackOrderDelivery ID</th>" +
					"<th scope='col' onclick=sortTable(2,false)>Status</th>" +
					"<th scope='col' onclick=sortTable(3,false)>Delivery date</th>" +
					"<th scope='col' onclick=sortTable(4,false)>License plate</th>" +
					"<th scope='col'>Action</th>" +
					"</tr>" +
					"</thead><tbody>";

				for (var x = 0; x < deliveryRows.length; x++) {
					//if(deliveryRows[x].currentStatus == "COMPLETE") continue;
					var showOrStore =
						(deliveryRows[x].currentStatus == "COMPLETE")
							? "Store items"
							: (deliveryRows[x].currentStatus == "ARRIVED" || 
							deliveryRows[x].currentStatus == "NEEDS_RESOLVING") ? "Count items" : "Show details";
					var showDate = deliveryRows[x].deliveryDate;
					var showPlate = deliveryRows[x].licensePlateDeliverer;
					if (deliveryRows[x].currentStatus == "EXPECTED"){
						showDate = "";
						showPlate = "";
					}
					deliveryTable +=
						"<tr id=" +
						deliveryRows[x].id +
						"><td>" +
						deliveryRows[x].lines[0].backOrder.id +
						"</td>" +
						"<td>" +
						deliveryRows[x].id +
						"</td>" +
						"<td>" +
						deliveryRows[x].currentStatus +
						"</td>" +
						"<td>" +
						showDate +
						"</td>" +
						"<td>" +
						showPlate +
						"</td>" +
						"<td>" +
						'<button type="button" class="btn btn-outline-secondary" onclick=changeWindow(' +
						deliveryRows[x].id +
						")>" +
						showOrStore +
						"</button>" +
						"</td>" +
						"</tr>";
				}
				deliveryTable += "</tbody></table>";
			}
			document.getElementById("deliveryTable").innerHTML = deliveryTable;
		}
	};
	xhr.open("GET", baseUrl + "/allBODeliveries", true);
	xhr.send();
}

function markDeliveryArrived() {
	var delId = document.getElementById("ipbodid").value;
	var licensePlate = document.getElementById("iplicense").value;
	if (delId == "" || licensePlate == "") { 
		alert("Please fill in both fields.");
		return;
	}
	var row = document.getElementById("" + delId + "");
	if (row == null) {
		alert("This delivery can't be marked as arrived.");
		return;
	} 
	if (row.cells[2].innerHTML == "EXPECTED") {
		//console.log("YESS");
		var xhr = new XMLHttpRequest();
		xhr.open(
			"POST",
			baseUrl + "/setDeliveryArrived/" + delId + "/" + licensePlate,
			true
		);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onreadystatechange = function () {
			if (this.readyState == 4) {
				showDeliveries();
				document.getElementById("ipbodid").value = "";
				document.getElementById("iplicense").value = "";
			}
		};
		xhr.send();
	} else {
		alert("This delivery can't be marked as arrived.");
	}
}

function changeWindow(deliveryId) {
	sessionStorage.setItem("showDeliveryId", deliveryId);
	navigateShow("pages/delivery-details.html", pageDetails);
}

function sortTable(n, numbers) {
	var table,
		rows,
		switching,
		i,
		x,
		y,
		shouldSwitch,
		dir,
		switchcount = 0;
	table = document
		.getElementById("deliveryTable")
		.getElementsByTagName("TABLE")[0];
	//console.log(table);
	switching = true;
	dir = "asc";
	while (switching) {
		switching = false;
		rows = table.rows;
		for (i = 1; i < rows.length - 1; i++) {
			shouldSwitch = false;
			x = rows[i].getElementsByTagName("TD")[n];
			y = rows[i + 1].getElementsByTagName("TD")[n];
			if (dir == "asc") {
				if (numbers) {
					if (parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
						shouldSwitch = true;
						break;
					}
				} else {
					if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
						shouldSwitch = true;
						break;
					}
				}
			} else if (dir == "desc") {
				if (numbers) {
					if (parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
						shouldSwitch = true;
						break;
					}
				} else {
					if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
						shouldSwitch = true;
						break;
					}
				}
			}
		}
		if (shouldSwitch) {
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
			switchcount++;
		} else {
			if (switchcount == 0 && dir == "asc") {
				dir = "desc";
				switching = true;
			}
		}
	}
}

function filterTable() {
	var input, filter, table, tr, td, i, txtValue, columnr;
	input = document.getElementById("ipfilter");
	filter = input.value.toUpperCase();
	var ipselection = document.getElementById("columNames").value;
	console.log(ipselection);
	columnr =
		ipselection == "Backorder ID"
			? 0
			: ipselection == "Delivery ID"
			? 1
			: ipselection == "Status"
			? 2
			: ipselection == "Delivery date"
			? 3
			: 4;
	table = document
		.getElementById("deliveryTable")
		.getElementsByTagName("TABLE")[0];
	tr = table.getElementsByTagName("tr");

	// Loop through all table rows, and hide those who don't match the search query
	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td")[columnr];
		if (td) {
			txtValue = td.textContent || td.innerText;
			if (txtValue.toUpperCase().indexOf(filter) > -1) {
				tr[i].style.display = "";
			} else {
				tr[i].style.display = "none";
			}
		}
	}
}
