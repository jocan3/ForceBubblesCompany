 function outputUpdateYear(yyyy) {
      document.querySelector('#year').value = yyyy;
      }
      function outputUpdateMonth(mm) {
      	var month = mm;
      	switch(month){
	      	case "1": 
	      		month = "ENE";
	      		break;
	      	case "2":
	      		month = "FEB";
	      		break;
	      	case "3": 
	      		month = "MAR";
	      		break;
	      	case "4":
	      		month = "ABR";
	      		break;
	      	case "5": 
	      		month = "MAY";
	      		break;
	      	case "6":
	      		month = "JUN";
	      		break;
	      	case "7": 
	      		month = "JUL";
	      		break;
	      	case "8":
	      		month = "AGO";
	      		break;
	      	case "9": 
	      		month = "SET";
	      		break;
	      	case "10":
	      		month = "OCT";
	      		break;
	      	case "11": 
	      		month = "NOV";
	      		break;
	      	case "12":
	      		month = "DIC";
	      		break;
	      	}
	      	document.querySelector('#month').value = month;
      }