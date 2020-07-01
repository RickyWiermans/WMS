function showProducts() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			//console.log(this.responseText);
			var productsRow = JSON.parse(this.responseText);
			//console.log(productsRow);
			var catalogTable = "";
			if (!productsRow.length) {
				catalogTable +=
					"<p>The catalog is empty. There are no products to show<br>" +
					"Add new products to the form on top of this page</p>";
					document.getElementById("searchBarCatalog").hidden = true;
					document.getElementById("sortTextCatalog").hidden = true;
			} else {
				catalogTable +=
					"<table class='table img-table table-striped'><thead>" +
					"<tr><th scope='col' onclick=sortCatalog(0,false)>Image</th>" +
					"<th scope='col' onclick=sortCatalog(1,false)>Name</th>" +
					"<th scope='col' onclick=sortCatalog(2,true)>Price</th>" +
					"<th scope='col' onclick=sortCatalog(3,true)>EAN code</th>" +
					"<th scope='col' onclick=sortCatalog(4,false)>Description</th>" +
					"<th scope='col' onclick=sortCatalog(5,true)>Items CHECKED_IN</th>" +
					"<th scope='col' onclick=sortCatalog(6,true)>Items IN_STORAGE</th>" +
					"<th scope='col' onclick=sortCatalog(7,true)>Items RESERVED</th>" +
					"<th scope='col'>Backorder</th>" +
					"<th scope='col'>Edit</th>" +
					"<th scope='col'>Delete</th></tr>" +
					"</thead><tbody>";

				for (var x = productsRow.length - 1; x >= 0; x--) {
					catalogTable += "<tr style='height: 80px;'><td>";
					var fileData = productsRow[x].fileData;
					if (fileData) {
						catalogTable +=
							"<div class='thumbnail'><img class='rounded thumbnail'    src='data:image/png;base64," +
							fileData.data +
							"'></div>";
					}
					catalogTable +=
						"</td><td class='font-weight-bold'>" +
						productsRow[x].name +
						"</td><td>" +
						productsRow[x].price +
						"</td><td>" +
						productsRow[x].eanCode +
						"</td><td>" +
						productsRow[x].description +
						"</td><td>" +
						productsRow[x].currentItemsCheckedIn +
						"</td><td>" +
						productsRow[x].currentItemsInStorage +
						"</td><td>" +
						productsRow[x].currentItemsReserved +
						"</td><td>" +
						'<input type="checkbox" onchange="checkbackorderline(\'' +
						productsRow[x].id +
						"','" +
						productsRow[x].name +
						"','" +
						this +
						"')\">" +
						"</td><td>" +
						'<button type="button" class="btn btn-outline-secondary" onclick="editProduct(\'' +
						productsRow[x].id +
						"')\" id=ipedit>Edit</button>" +
						"</td><td>" +
						'<button type="button" class="btn btn-outline-danger" onclick="deleteProduct(\'' +
						productsRow[x].id +
						"')\" >Delete</button>" +
						"</td></tr>";
				}
				catalogTable += "</tbody></table>";
			}
			document.getElementById("catalogTable").innerHTML = catalogTable;
			document.getElementById("ipsendbo").disabled = true;
		}
	};
	xhr.open("GET", baseUrl + "/allproducts", true);
	xhr.send();
}

function getLastFileDataId() {
	console.log("follow: in getLastFileDataId()");
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			console.log("follow: getLastFileDataId() readyState == 4");
			const lastFileDataID = JSON.parse(this.responseText);
			//console.log(lastFileDataID);
			postProduct(lastFileDataID);

			//var catalogTable = "";
		}
	};
	xhr.open("GET", baseUrl + "/getLastFileDataId", true);
	xhr.send();
}

function confirmPostProduct() {
	console.log("FIRST PART");
	console.log("follow: confirmPostProduct");
	var file = document.getElementById("ipfile").files[0];
	if (file) {
		console.log("follow: confirmPostProduct with file");
		handleFileSelect(file);
	} else {
		console.log("follow: confirmPostProduct without file");
		fileId = document.getElementById("fileDataIdhidden").value;
		document.getElementById("fileDataIdhidden").value = "";
		console.log("follow: hidden fileId = " + fileId);
		postProduct(fileId);
	}
}

function handleFileSelect(file) {
	var maxMbSize = 2; // 2MB appears to be the max for XHttpRequest send function
	if (file.size / 1_000_000 > maxMbSize) {
		console.log("follow: file size = " + file.size / 1_000_000);
		console.log("follow: file to big, max size = 2MB");
		return null;
	} else {
		console.log("follow: handle the file");
		//var file = document.getElementById('files').files[0]; // FileList object
		var reader = new FileReader();
		// Read in the image file as a data URL.
		if (file) {
			reader.readAsBinaryString(file);
		}
		// Closure to capture the file information.
		reader.onload = (function (theFile) {
			return function (e) {
				console.log("MIDDLE PART");
				var fileData = {};
				const fileName = file.name;
				const lastDot = fileName.lastIndexOf(".");

				const name = fileName.substring(0, lastDot);
				const ext = fileName.substring(lastDot + 1);

				const binaryData = e.target.result;
				//Converting Binary Data to base 64
				const base64String = window.btoa(binaryData);

				fileData.name = name;
				fileData.extension = ext;
				fileData.data = base64String;

				postFileData(fileData);
			};
		})(file);
	}
}

function postFileData(fileData) {
	console.log("LAST PART");
	console.log("follow: inside postFileData");
	console.log(fileData.data);

	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			console.log("follow: postFileData() readyState == 4");
			getLastFileDataId();
		}
	};

	var objJSON = JSON.stringify(fileData);
	xhr.open("POST", baseUrl + "/postFileData", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(objJSON);
}

function postProduct(fileId) {
	console.log("follow: inside postProduct()");
	var editState = false;
	if (document.getElementById("ipaddoredit").innerHTML == "Update product") {
		console.log("follow: editState = true");
		editState = true;
	}
	var xhr = new XMLHttpRequest();
	var theObject = {};
	theObject.id = document.getElementById("idhidden").value;
	if (theObject.id) {
		console.log(
			"follow: The prodcut id form #idhidden in postProduct = " + theObject.id
		);
	}

	theObject.name = document.getElementById("ipname").value;
	theObject.price = document.getElementById("ipprice").value;
	theObject.eanCode = document.getElementById("ipeanCode").value;
	theObject.description = document.getElementById("ipdescription").value;
	//theObject.length = document.getElementById("iplength").value;
	//theObject.width = document.getElementById("ipwidth").value;
	//theObject.height = document.getElementById("ipheight").value;
	//theObject.weight = document.getElementById("ipweight").value;
	if (fileId) {
		theObject.fileData = { id: fileId };
	} else {
		console.log("follow: no fileId selected or found in hidden input field");
		console.log("follow: fileId = " + fileId);
	}

	var objJSON = JSON.stringify(theObject);
	xhr.onreadystatechange = function () {
		showProducts();
	};

	if (editState) {
		xhr.open("POST", baseUrl + "/editproduct", true);
		console.log("endpoint: /editproduct");
	} else {
		xhr.open("POST", baseUrl + "/newproduct", true);
		console.log("endpoint: /newproduct");
	}
	console.log(theObject);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(objJSON);

	document.getElementById("ipname").value = "";
	document.getElementById("ipprice").value = "";
	document.getElementById("ipeanCode").value = "";
	document.getElementById("ipdescription").value = "";
	//document.getElementById("iplength").value = "";
	//document.getElementById("ipwidth").value = "";
	//document.getElementById("ipheight").value = "";
	//document.getElementById("ipweight").value = "";

	// document.getElementById("ipfile").files[0].name = null;
	document.getElementById("ipfile").value = "";
	document.getElementById("ipfileLabel").innerHTML = "Choose product image";
	if (editState) {
		console.log("end of edit product");
		var changebutton = document.getElementById("ipaddoredit");
		changebutton.innerHTML = "Add product to catalog";
		changebutton.classList.toggle("btn-outline-success");
		changebutton.classList.remove("btn-primary");

		document.getElementById("idhidden").value = "";
	} else {
		console.log("end of post product");
	}
}

function deleteProduct(id) {
	console.log("follow: in deleteProuct()");
	var youSure = confirm("Are you sure you want to delete this product?");
	if (youSure == true) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", baseUrl + "/deleteproduct", true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(id);
	}
	xhr.onreadystatechange = function () {
		showProducts();
	};
}

function editProduct(id) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			var product = JSON.parse(this.responseText);
			document.getElementById("ipname").value = product.name;
			document.getElementById("ipprice").value = product.price;
			document.getElementById("ipeanCode").value = product.eanCode;
			//document.getElementById("iplength").value = product.length;
			//document.getElementById("ipwidth").value = product.width;
			//document.getElementById("ipheight").value = product.height;
			//document.getElementById("ipweight").value = product.weight;
			document.getElementById("ipdescription").value = product.description;
			document.getElementById("ipaddoredit").innerHTML = "Update product";
			var changebutton = document.getElementById("ipaddoredit");
			changebutton.classList.toggle("btn-outline-success");
			changebutton.classList.add("btn-primary");
			document.getElementById("idhidden").value = id;
			// document.getElementById("ipfile").value = product.fileData.data;
			// document.getElementById("ipfile").files[0] = product.fileData.data;
			var fileSelectText = "Choos product image";
			if (product.fileData) {
				document.getElementById("fileDataIdhidden").value = product.fileData.id;
				fileSelectText =
					product.fileData.name + "." + product.fileData.extension;
			}
			document.getElementById("ipfileLabel").innerHTML = fileSelectText;
		}
	};
	xhr.open("POST", baseUrl + "/getproduct", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send(id);
}

function checkbackorderline(id, naam, check) {
	var table = document.getElementById("backorderTable");
	var rid = id;
	if (document.getElementById(rid) == null) {
		var row = table.insertRow(1);
		row.id = id;
		var inputid = "ip" + id;
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		cell1.innerHTML = naam;
		cell2.innerHTML = '<input type="number" id=\'' + inputid + "'>";
	} else {
		table.deleteRow(document.getElementById(rid).rowIndex);
	}
	console.log(table.rows);
	if (table.rows.length == 1) {
		document.getElementById("ipsendbo").disabled = true;
	} else document.getElementById("ipsendbo").disabled = false;
}

function sendbackorder() {
	var table = document.getElementById("backorderTable");
	for (var x = 1; x < table.rows.length; x++) {
		var inputid = "ip" + table.rows[x].id;
		var amountp = document.getElementById(inputid).value;
		if (amountp < 1) {
			alert("Please insert an amount bigger than zero.");
			return;
		}
	}
	var members = createDeliveries();
	var xhr = new XMLHttpRequest();
	xhr.open("POST", baseUrl + "/newBackOrder", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.send("{}");
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			var xhr2 = new XMLHttpRequest();
			xhr2.open("GET", baseUrl + "/getLatestBackOrderId", true);
			xhr2.send();
			xhr2.onreadystatechange = function () {
				if (this.readyState == 4) {
					console.log(members);
					console.log("nr of members: " + members.length);
					var delArr = createDeliveryArray(table.rows.length - 1, members);
					//console.log(this.responseText);
					var boid = this.responseText;
					var bodyboid = {};
					bodyboid.id = boid;
					var list = document.getElementById("backorderTable").rows;

					for (var x = 1, y = 0; x < list.length; ) {
						var inputid = "ip" + list[x].id;
						var amountp = document.getElementById(inputid).value;
						var prid = list[x].id;

						var theObject = {};
						var prbody = {};
						prbody.id = prid;
						theObject.backOrder = bodyboid;
						theObject.amount = amountp;
						theObject.product = prbody;
						var objJSON = JSON.stringify(theObject);
						console.log(objJSON);
						var xhr3 = new XMLHttpRequest();
						xhr3.open("POST", baseUrl + "/newBackOrderLine", true);
						xhr3.setRequestHeader("Content-Type", "application/json");
						xhr3.onreadystatechange = function () {
							if (this.readyState == 4) {
								var xhr4 = new XMLHttpRequest();
								xhr4.open(
									"POST",
									baseUrl +
										"/connectDeliveryLine/" +
										delArr[y] +
										"/" +
										this.responseText,
									true
								);
								xhr4.setRequestHeader("Content-Type", "application/json");
								xhr4.send();
								y++;
							}
						};
						xhr3.send(objJSON);
						document.getElementById("backorderTable").deleteRow(x);
					}

					showProducts();
					console.log("backorder verzonden");
				}
			};
		}
	};
}

function createDeliveries() {
	var table = document.getElementById("backorderTable");
	var nrOfLines = table.rows.length - 1;
	var nrOfDeliveries = 1;
	if (nrOfLines > 5) {
		var prob = Math.random();
		console.log("random nr: " + prob);
		nrOfDeliveries = prob > 0.8 ? 3 : prob > 0.3 ? 2 : 1;
	} else if (nrOfLines > 2) {
		var prob = Math.random();
		console.log("random nr: " + prob);
		nrOfDeliveries = prob > 0.95 ? 3 : prob > 0.75 ? 2 : 1;
	}
	console.log("nrOfDeliveries: " + nrOfDeliveries);
	var memberArray = [];
	for (var x = 1; x <= nrOfDeliveries; x++) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", baseUrl + "/newBODelivery", true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send('{ "member":' + x + " }");
		xhr.onreadystatechange = function () {
			if (this.readyState == 4) {
				memberArray.push(this.responseText);
			}
		};
	}
	return memberArray;
}

function createDeliveryArray(nrOfLines, deliveryMembers) {
	var del = deliveryMembers.length;
	var array = new Array(nrOfLines);
	if (del == 1) {
		for (var x = 0; x < array.length; x++) {
			array[x] = deliveryMembers[0];
		}
	} else if (del == 2) {
		for (var x = 0; x < array.length; x++) {
			array[x] = x % 2 == 1 ? deliveryMembers[1] : deliveryMembers[0];
		}
	} else {
		for (var x = 0; x < array.length; x++) {
			array[x] =
				x % 3 == 0
					? deliveryMembers[0]
					: x % 3 == 1
					? deliveryMembers[1]
					: deliveryMembers[2];
		}
	}
	console.log("deliveryarray: ");
	console.log(array);
	return array;
}

function filterCatalog() {
	var input, filter, table, tr, td, i, txtValue, columnr;
	input = document.getElementById("ipcatalogfilter");
	filter = input.value.toUpperCase();
	var ipselection = document.getElementById("catalogcolumNames").value;
	console.log(ipselection);
	columnr = (ipselection == "Name") ? 1 :
		(ipselection == "Price") ? 2 : 
		(ipselection == "eanCode") ? 3 : 4;
	table = document.getElementById("catalogTable").getElementsByTagName("TABLE")[0];
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

function sortCatalog(n, numbers) {
	var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
	table = document.getElementById("catalogTable").getElementsByTagName("TABLE")[0];
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
