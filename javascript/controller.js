function Home()
{

 //check if site ist bereits geladen, wenn ja müsste den MainContent haben
  var mainContainer = document.getElementById("MainContent");
  
  if(mainContainer.childElementCount != 0)
  return;
  
  $( "#productListTemplate" ).tmpl(productList).appendTo("#MainContent");
  
}

 function formatPrice(price) {
            return price + " FCFA";
        }

//filter result set by cpu
function filterCPUChange(caller, filterValue)
{
	var productListTemplate = $("#productListTemplate").template();
	var cpuSlection = "";
	var productWithCPU = [];
	if(filterValue == "all")
	{
		$("div").remove('.productItem');
		$( "#productListTemplate" ).tmpl(productList).appendTo("#MainContent");	
	}
	else{
		for(product of productList)
		{
			if(filterValue.toLowerCase() == product.cpu.toLowerCase())
			{
				productWithCPU.push(product);
			}
		}
		
		if(productWithCPU.length > 0)
		{
			$("div").remove('.productItem');
			$( "#productListTemplate" ).tmpl(productWithCPU).appendTo("#MainContent");
		}
		else
		{
			$("div").remove('.productItem');
			$( "#noProductFoundTemplate" ).tmpl(contactList).appendTo("#MainContent");
		}
	}
	
}