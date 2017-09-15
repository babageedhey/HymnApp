//Function to confirm password match
function validatePwd(password1,password2){
	if (password1.value !== password2.value){
		password2.setCustomValidity("Password does not match");
	} else {
		password2.setCustomValidity("");
	}
}



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






