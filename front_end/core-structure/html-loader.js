/* BASE URLS  */
//const baseUrl = "http://173.212.208.199:9088";
const baseUrl = "http://localhost:8082";

/* LOAD HEAD HEADER AND FOOTER */
$(document).ready(function () {
	$("#header").load("core-structure/header.html", navload);
	$("#footer").load("core-structure/footer.html");
});
