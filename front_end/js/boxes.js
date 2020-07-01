/* BOX FUCNTIONS */
function showBoxes() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			//console.log(this.responseText);
			var boxesRow = JSON.parse(this.responseText);
			//console.log(boxesRow);
			var boxesTable = "";
			if (!boxesRow.length) {
				boxesTable +=
					"<p>There are no boxes to show.<br>" +
					"Add new boxes with the form on top of this page.</p>";
					document.getElementById("searchBarBox").hidden = true;
					document.getElementById("sortTextBox").hidden = true;
			} else {
				boxesTable +=
					"<table class='table table-striped scrollbar'><thead>" +
					"<tr><th scope='col' onclick=sortBoxTable(0,true)>Box ID</th>" +
					"<th scope='col' onclick=sortBoxTable(1,false)>Product</th>" +
					"<th scope='col' onclick=sortBoxTable(2,true)>Max items</th>" +
					"<th scope='col' onclick=sortBoxTable(3,true)>Current items CHECKED_IN</th>" +
					"<th scope='col' onclick=sortBoxTable(4,true)>Current items IN_STORAGE</th>" +
					"<th scope='col' onclick=sortBoxTable(5,true)>Current items RESERVED</th>" +
					"<th scope='col' onclick=sortBoxTable(6,false)>Box status</th>" +
					"<th scope='col'>Delete</th></tr>" +
					"</thead><tbody>";

				for (var x = 0; x < boxesRow.length; x++) {
					var barColor = "success", barText = "<80 %";
					if (boxesRow[x].maxProductItems == (boxesRow[x].currentItemsCheckedIn +
						boxesRow[x].currentItemsInStorage +boxesRow[x].currentItemsReserved)) {
							barColor = "danger";
							barText = "100 %";
					} else if (0.8*boxesRow[x].maxProductItems <= (boxesRow[x].currentItemsCheckedIn +
						boxesRow[x].currentItemsInStorage +boxesRow[x].currentItemsReserved)) {
							barColor = "warning";
							barText = ">80 %"
					}
					boxesTable += 
						"<tr><td>" +
						boxesRow[x].id +
						"</td><td>" +
						boxesRow[x].product.name +
						"</td><td>" +
						boxesRow[x].maxProductItems +
						"</td><td>" +
						boxesRow[x].currentItemsCheckedIn +
						"</td><td>" +
						boxesRow[x].currentItemsInStorage +
						"</td><td>" +
						boxesRow[x].currentItemsReserved +
						"</td><td>" +
						//"<input type='text' class='form-control text-sm bg-"+barColor+"' disabled></input>" +
						"<span class='badge badge-"+ barColor +"'>"+barText+"</span>" +
						"</td><td>" +
						"<button type='button' class='btn btn-outline-danger btn-sm' onclick=deleteBox(" + 
						boxesRow[x].id + ")>delete</button>" +
						"</td>";
				}

				boxesTable += "</tbody></table>";
			}
			document.getElementById("boxesTable").innerHTML = boxesTable;
		}
	};
	xhr.open("GET", baseUrl + "/allboxes", true);
	xhr.send();
}

function productDropdown() {
	var jojo = document.getElementById("ipproduct");
	console.log(jojo);
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			console.log(this.responseText);
			var productsRow = JSON.parse(this.responseText);
			console.log(productsRow);
			var productDropdown = "";
			if (!productsRow.length) {
				//productsproductDropdownDropdown += // add: option disabled: No products
			} else {
				productDropdown +=
					"<option selected disabled value =''> Choose...</option>";
				for (var x = 0; x < productsRow.length; x++) {
					productDropdown +=
						"<option value='" +
						productsRow[x].id +
						"'>" +
						productsRow[x].name +
						"</option>";
				}
			}
			document.getElementById("ipproduct").innerHTML = productDropdown;
		}
	};
	xhr.open("GET", baseUrl + "/allproducts", true);
	xhr.send();
}

function postBox() {
	// var idp = document.getElementById("ipid").value;
	var productp = document.getElementById("ipproduct").value;
	var maxProductItemsp = document.getElementById("ipmaxProductItems").value;
	//var lengthp = document.getElementById("iplength").value;
	//var widthp = document.getElementById("ipwidth").value;
	//var heightp = document.getElementById("ipheight").value;
	//var maxWeightp = document.getElementById("ipmaxWeight").value;

	var theObject = {};
	// theObject.product = {};

	theObject.maxProductItems = maxProductItemsp;
	//theObject.length = lengthp;
	//theObject.width = widthp;
	//theObject.height = heightp;
	//theObject.maxWeight = maxWeightp;

	var objJSON = JSON.stringify(theObject);
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			console.log("The Box is saved");
			showBoxes();
		}
	};
	xhr.open("POST", baseUrl + "/newbox/" + productp, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(objJSON);
	document.getElementById("boxesTable");
}

function deleteBox(id){
	var msg = "This is a permament action. If there are still items in the box, " + 
		"these will also be deleted from the system. Are you sure to delete this box?";
	if (!confirm(msg)){
		return;
	} else {
		var xhr = new XMLHttpRequest();
		xhr.open("DELETE", baseUrl + "/deleteBox/" + id, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onreadystatechange = function () {
			if (this.readyState == 4) {
				console.log("The Box is deleted");
				showBoxes();
			}
		};
		xhr.send();
	}
}


function filterBoxTable() {
	var input, filter, table, tr, td, i, txtValue, columnr;
	input = document.getElementById("ipboxfilter");
	filter = input.value.toUpperCase();
	var ipselection = document.getElementById("boxcolumNames").value;
	console.log(ipselection);
	columnr = (ipselection == "Box ID") ? 0	: 1;
	table = document.getElementById("boxesTable").getElementsByTagName("TABLE")[0];
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

function sortBoxTable(n, numbers) {
	var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
	table = document.getElementById("boxesTable").getElementsByTagName("TABLE")[0];
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