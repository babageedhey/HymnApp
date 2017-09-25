//date function
var     	today    = new Date(),
			date     = today.getDate(),
        	day      = today.getDay(),
        	month    = today.getMonth(),
        	year     = today.getFullYear(),
        	min      = addZero(today.getMinutes()),
        	hour     = addZero(today.getHours());
function addZero(i) {
	if(i<10) {
		i = "0" + i;
	}
	return i;
}
function getDayName(dateStr, locale) {
        	
    return today.toLocaleDateString(locale, {weekday: "long"});
}
	
function getMonthName(dateStr, locale) {
	return today.toLocaleDateString(locale, {month: "long"});
}

	var dateStr = (day +"/"+ (month+1) +"/"+ date +"/"+ year).toString();
	var dayName = getDayName(dateStr, "en-US");
	var monthName = getMonthName(dateStr, "en-US");  
    var    fullDate = (dayName +", "+ monthName +" "+ date +", "+ year +" "+hour +":"+ min)
	document.getElementById("date").innerHTML = fullDate;





//Function to confirm password match
var password = document.getElementById('password');
var confirm_password = document.getElementById('confirm_password');
function validatePwd(){
	console.log(password, confirm_password);
	if (password.value !== confirm_password.value){
		confirm_password.setCustomValidity("Password does not match");
	} else {
		confirm_password.setCustomValidity("");
	}
}
confirm_password.onkeyup = validatePwd;


//Search function to table
function myFunction() {
  // Declare variables 
  var input, filter, table, tr, td, i;
  input = document.getElementById("search");
  filter = input.value.toUpperCase();
  table = document.getElementById("sortable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    } 
  }
}

//Function for the sort by selection
function sortBy(input) {
	var input = $("#sort-by").find(':selected').text();
	
	if (input == "Number") {
		$("#sortable #table-head").find(".number").click();
	}
	else if (input == "Title") {
		$("#sortable #table-head").find(".title").click()
	}
	else if (input == "Meter") {
		$("#sortable #table-head").find(".meter").click()
	}
	else if ( input == "Tune-Name") {
		$("#sortable #table-head").find(".tune").click()
	} else {
		console.log("Nothing happened")
	}		
}






