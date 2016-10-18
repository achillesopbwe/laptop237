$(function () {

	// Globals variables

		// 	An array containing objects with information about the products.
	var products = [],
	
	productsFormatedForDisplaying = [],

		// Our filters object will contain an array of values for each filter

		// Example:
		// filters = {
		// 		"manufacturer" = ["Apple","Sony"],
		//		"storage" = [16]
		//	}
		filters = {};
		filterBy = "";
		
		category = "";
		
	   lastPageForChangeToSingleProductPage = ""; 


	//	Event handlers for frontend navigation

	//	Checkbox filtering

	var checkboxes = $('.all-products input[type=checkbox]');
	
	var navMenuButtons = $('.nav_selector');
	navMenuButtons.on('click', function (e) {
		clearFilters(filters);
		var that = $(this);
		var specName = that.attr('name');
		// If the filter for this specification isn't created yet - do it.
				if(!(filters[specName] && filters[specName].length)){
					filters[specName] = [];
				}
		//	Push values into the chosen filter array
				filters[specName].push(that.attr('value'));

				// Change the url hash;
				//createQueryHash(filters);
				
				clearFilters(filters);
		})
	
	function clearFilters(filters)
	{
		for (var member in filters) delete filters[member];
	}


	checkboxes.click(function () {

		var that = $(this),
			specName = that.attr('name');

		// When a checkbox is checked we need to write that in the filters object;
		if(that.is(":checked")) {

			// If the filter for this specification isn't created yet - do it.
			if(!(filters[specName] && filters[specName].length)){
				filters[specName] = [];
			}

			//	Push values into the chosen filter array
			filters[specName].push(that.val());

			// Change the url hash;
			createQueryHash(filters);

		}

		// When a checkbox is unchecked we need to remove its value from the filters object.
		if(!that.is(":checked")) {

			if(filters[specName] && filters[specName].length && (filters[specName].indexOf(that.val()) != -1)){

				// Find the checkbox value in the corresponding array inside the filters object.
				var index = filters[specName].indexOf(that.val());

				// Remove it.
				filters[specName].splice(index, 1);

				// If it was the last remaining value for this specification,
				// delete the whole array.
				if(!filters[specName].length){
					delete filters[specName];
				}

			}

			// Change the url hash;
			createQueryHash(filters);
		}
	});

	// When the "Clear all filters" button is pressed change the hash to '#' (go to the home page)
	$('.filters button').click(function (e) {
		e.preventDefault();
		window.location.hash = '#';
	});


	// Single product page buttons
 var singleProductPage = $('.single-product-detail');

	singleProductPage.on('click', function (e) {
	
	 var currentPage = window.location.hash;

		if (singleProductPage.hasClass('visible')) {

			var clicked = $(e.target);

			// If the close button or the background are clicked go to the previous page.
			if (clicked.hasClass('close') || clicked.hasClass('overlay') || clicked.hasClass('close-page')) {
				// Change the url hash with the last used filters.
				//createQueryHash(filters);
				
				window.location.hash = lastPageForChangeToSingleProductPage;
			}

		}

	});

function formatProductForDisplaying(item)
	{
		var itemToDisplay = {};
			itemToDisplay.name = item.name;
			itemToDisplay.id = item.Id;
			itemToDisplay.category = item.category;
			itemToDisplay.manufacturer = item.manufacturer;	
			itemToDisplay.imagesmall = item.imageSmall;
			itemToDisplay.imagelarge = item.imageBig;
			itemToDisplay.showAsTop = item.showAsTop;
			
			itemToDisplay.firstLine_description = "";// manufacturer + marque
			itemToDisplay.secondLine_description = ""; //LAptop-PC-Tablett-Smartphone (cpu, hdd, ram) oder Description for firealarm
			itemToDisplay.thirdLine_description  = ""; //Display + webcam + umts
			itemToDisplay.fourthLine_description  = ""; //preis
			
			itemToDisplay.spec1 = ""; // processor + takt / detecteur de fumée :alarme sonore: 
			itemToDisplay.spec2 = ""; //memoire 
			itemToDisplay.spec3 = ""; 
			itemToDisplay.spec4 = ""; 
			itemToDisplay.spec5 = ""; 
			itemToDisplay.spec6 = ""; 
			itemToDisplay.spec7 = ""; 
			
			
			/*
			itemToDisplay.firstLine_description = item.manufacturer + " " + item.name;
			if(item.category.toLowerCase() == "laptop" || item.category.toLowerCase() == "smartphone" || item.category.toLowerCase() == "pc" || item.category.toLowerCase() == "tablet")
			{
				itemToDisplay.secondLine_description = item.cpu +  " /HDD " + item.hdd +  " /RAM " + item.ram;
				itemToDisplay.thirdLine_description  = item.display + " | " + ((item.umts !="")? "Slot Puce 3G/4G ": " ") + ((item.webcam !="")? " | Webcam": "")
				itemToDisplay.longdescription = item.manufacturer + " " + item.name + item.cpu +  " /HDD " + item.hdd +  " /RAM " + item.ram +  " /" + item.specials;
			}
			
			if(item.category.toLowerCase() == "accesoire")
			{
			}
			if(item.category.toLowerCase() == "firealarm")
			{
			}
			if(item.category.toLowerCase() == "gaming")
			{
				
			}*/
			
			
			itemToDisplay.fourthLine_description   = item.price;
			
			itemToDisplay.description = item.description;
			itemToDisplay.price = item.price;
			itemToDisplay.name = item.manufacturer + " " + item.name;
			itemToDisplay.etat = item.etat;
			itemToDisplay.details = item.details;
			itemToDisplay.longdescription = item.longdescription;
			
			return itemToDisplay;
			
	}
	
	
	// These are called on page load

	// Get data about our products from products.json.
	$.getJSON( "assets/product-db/products.json", function( data ) {

		// Write the data into our global variable.
		products = data;
		
		for(var i= 0; i < data.length; i++)
		{
			productsFormatedForDisplaying.push(formatProductForDisplaying(data[i]));
		}

		var temp = (decodeURI(window.location.hash)).split('/')[0];
		
		if(temp == "")
		{
			$('#myCarousel').addClass('visible');
		}
		
		// Call a function to create HTML for all the products.
		generateAllProductsHTML(productsFormatedForDisplaying);

		// Manually trigger a hashchange to start the app.
		$(window).trigger('hashchange');
	});


	// An event handler with calls the render function on every hashchange.
	// The render function will show the appropriate content of out page.
	$(window).on('hashchange', function(){
		render(decodeURI(window.location.hash));
	});

	//navigation hide/display caroussel
	function hideCaroussel(caroussel)
	{
		caroussel.addClass('hidden');
	}
	//navigation hide/display caroussel
	function showCaroussel( caroussel)
	{
		caroussel.removeClass('hidden');
	}
	
	
	function showSubmenuItems()
	{
		$('.all-Submenus .submenus-list').removeClass('hidden');
	}
	
	// Navigation
	function render(url) {

		// Get the keyword from the url.
		var temp = url.split('/')[0];

		// Hide whatever page is currently shown.
		$('.main-content .page').removeClass('visible');
		/*var caroussel = $('#myCarousel');
		hideCaroussel(caroussel);
		*/
		
		var caroussel_banner= $('#carousel-banner'); 
		hideCaroussel(caroussel_banner);

		var	map = {

			// The "Homepage".
			'': function() {
				showCaroussel(caroussel_banner);
				// Clear the filters object, uncheck all checkboxes, show all the products
				filters = {};
				checkboxes.prop('checked',false);
				//show caroussel if hidden
				renderProductsPage(products, 'Home');
			},

			// Single Products page.
			'#product': function() {

				// Get the index of which product we want to show and call the appropriate function.
				var index = url.split('#product/')[1].trim();

				renderSingleProductPage(index, products);
			},

			// Page with filtered products
			'#filter': function() {
				// Grab the string after the '#filter/' keyword. Call the filtering function.
				url = url.split('#filter/')[1].trim();

				// Try and parse the filters object from the query string.
				try {
					filters = JSON.parse(url);
				}
					// If it isn't a valid json, go back to homepage ( the rest of the code won't be executed ).
				catch(err) {
					window.location.hash = '#';
					return;
				}

				renderFilterResults(filters, products);
			},
			'#ordinateurs':function(){
				
				showSubmenuItems();
				// Grab the string after the '#filter/' keyword. Call the filtering function.
				category = "ordinateurs";
				filterBy = url.split('#ordinateurs/')[1];
				renderFilterResultsBy(category, filterBy, products);
			},
			'#mobiles':function(){
				showSubmenuItems();
				// Grab the string after the '#filter/' keyword. Call the filtering function.
				category = "mobiles";
				filterBy = url.split('#mobiles/')[1];
				renderFilterResultsBy(category, filterBy, products);
			},
			'#securite':function(){
				// Grab the string after the '#filter/' keyword. Call the filtering function.
				showSubmenuItems();
				category = "securite";
				filterBy = url.split('#secutire/')[1];
				renderFilterResultsBy(category, filterBy, products);
			},
			'#accessoires':function(){
				showSubmenuItems();
				// Grab the string after the '#filter/' keyword. Call the filtering function.
				category = "accessoires";
				filterBy = url.split('#accessoires/')[1];
				renderFilterResultsBy(category, filterBy, products);
			},
			'#contact':function(){
				showSubmenuItems();
				// Grab the string after the '#filter/' keyword. Call the filtering function.
				category = "contact";
				//filterBy = url.split('#pc/')[1];
				//renderFilterResultsBy(category, filterBy, products);
				renderContactPage();
			},
			'#location':function(){
				
				// Grab the string after the '#filter/' keyword. Call the filtering function.
				category = "location";
				//filterBy = url.split('#pc/')[1];
				//renderFilterResultsBy(category, filterBy, products);
				renderStoresPage();
			}

		};

		// Execute the needed function depending on the url keyword (stored in temp).
		if(map[temp]){
			map[temp]();
		}
		// If the keyword isn't listed in the above - render the error page.
		else {
			renderErrorPage();
		}

	}
	
	function generateSubMenuHTML(submenuData)
	{
		var list = $('.all-Submenus .submenus-list');
		var theTemplateScript = $("#submenu-template").html();
		//Compile the template​
		var theTemplate = Handlebars.compile (theTemplateScript);
		list.append (theTemplate(submenuData));


		// Each products has a data-index attribute.
		// On click change the url hash to open up a preview for this product only.
		// Remember: every hashchange triggers the render function.
		list.find('li').on('click', function (e) {
			e.preventDefault();
			var manufacturerName= $(this)[0].dataset.index;
			var category = $(this)[0].dataset.category;
			window.location.hash = category + '/' + manufacturerName;
		})			
	}
	
	//filter the result by category and manufacturer or (all) for all manufactures
	function renderFilterResultsBy(category, manufacturer, productsList)
	{
		var results = [];
		var subCatOrdinateurs = ["laptop", "pc"];
		var subCatMobiles = ["smartphone", "tablet"];
		var subCatAccessoire = ["accessoire", "accessoire"];
		var subCatSecurite = ["firealarm", "ip-camera"];
		
	
					// Iterate over the products.
					productsList.forEach(function (item){
						// If the product has the same specification value: category and manufacturer  as the one in the filter// push it inside the results array 
						switch(category)
						{
								case "ordinateurs":
								 if(item.category.toLowerCase() == subCatOrdinateurs[0].toLowerCase()  || item.category.toLowerCase()  ==subCatOrdinateurs[1].toLowerCase()  )
								 { results.push(item);}
								 break;
								 case "mobiles":
								 if(item.category.toLowerCase()  == subCatMobiles[0].toLowerCase()  || item.category.toLowerCase()  ==subCatMobiles[1].toLowerCase()  )
								 { results.push(item);}
								 break;
								 case "accessoires":
								 if(item.category.toLowerCase()  == subCatAccessoire[0].toLowerCase()  )
								 { results.push(item);}
								 break;
								 case "securite":
								 if(item.category.toLowerCase()  == subCatSecurite[0].toLowerCase()  || item.category.toLowerCase()  == subCatSecurite[1].toLowerCase()  )
								 { results.push(item);}
								 break;	
						}							

					});
		// Call the renderProductsPage.
		// As it's argument give the object with filtered products.
		renderProductsPage(results, category);
	
	
	}
	
	// This function is called only once - on page load.
	// It fills up the products list via a handlebars template.
	// It recieves one parameter - the data we took from products.json.
	function generateAllProductsHTML(data){

		var list = $('.all-products .products-list');
		var theTemplateScript = $("#products-template").html();
		//Compile the template​
		var theTemplate = Handlebars.compile(theTemplateScript);
		list.append (theTemplate(data));


		// Each products has a data-index attribute.
		// On click change the url hash to open up a preview for this product only.
		// Remember: every hashchange triggers the render function.
		list.find('li').on('click', function (e) {
			e.preventDefault();
			var productIndex = $(this).data('index');
			lastPageForChangeToSingleProductPage = window.location.hash;
			window.location.hash = 'product/' + productIndex;
		})
		
		
		
		
		
	}

	 function renderCategoryPage(data, menuCategory)
	 {
	 
		var page = $('.all-products'),
			allProducts = $('.all-products .products-list > div > li');

		$('.main-content .page').removeClass('visible');
		$('.page').removeClass('visible');
		
		if(data.length == 0)
		{
			var pageURL = window.location.hash
			var searchCategory = pageURL.split('/')[0];
			var searchManufacturer = pageURL.split('/')[1];
			
			renderNoProductFoundPage(searchCategory, searchManufacturer);
			return;
		}
		var length = $('.product_item').length;
		for(var x = 0; x < length; x++)
		{
			$('.product_item')[0].remove();
		}
		
			var productsFormatedForDisplaying = [];
			for(var i = 0; i < data.length; i++)
			{
					productsFormatedForDisplaying.push(formatProductForDisplaying(data[i]));
			}
			generateAllProductsHTML(productsFormatedForDisplaying);
			
		$('#cat').text(menuCategory)
		page.addClass('visible');
	 
	 }
	// This function receives an object containing all the product we want to show.
	function renderProductsPage(data, menuCategory){

	renderCategoryPage(data, menuCategory);
	
	/*	var page = $('.all-products'),
			allProducts = $('.all-products .products-list > div > li');

		
		//hide nothing found error page
		//$('.nothingFound').addClass('hidden');
		
		// Hide all the products in the products list.
		allProducts.addClass('hidden');
		var cPage = window.location.hash;
		
		
		// Iterate over all of the product.
		// If their category is the same as the current selected category remove the hidden class to reveal them.
		
		

		//show notification wenn no product to a category
		if(data.length == 0)
		{
			var pageURL = window.location.hash
			var searchCategory = pageURL.split('/')[0];
			var searchManufacturer = pageURL.split('/')[1];
			
			renderNoProductFoundPage(searchCategory, searchManufacturer);
			return;
		}
		
		// Iterate over all of the products.
		// If their ID is somewhere in the data object remove the hidden class to reveal them.
		allProducts.each(function () {
			var that = $(this);
			data.forEach(function (item) { 
				if(that.data('index') == item.Id) 
				{	
					if((cPage == '#' || cPage == '')  & item.showAsTop.toLowerCase() == 'yes') //show only featured products on homepage
					{
						that.removeClass('hidden');
					}
					if(cPage !== '#' & cPage !== '') //show products belonging to the selection
					{
						that.removeClass('hidden');
					}
				}
			});
		});

		// Show the page itself.
		// (the render function hides all pages so we need to show the one we want).
		page.addClass('visible');*/

	}

  function formatSingleProductAttibutes(item)
  {
    var withPrefix = true;
	
			/*
			   //LAptop, PC, Tablet, Smartphone
			//prod_title,product_description first:Cpu + takt, second:Ram + HDD; third: display+webcam; fourth:accessoires; fourth_2:batterie;fifth:extra;seventh:garanty; eight:contact; nine:price
			var singleProductAttr = [];
			   
			   //img0_thumbnail, image0_big, img1_thumbnail, img1_big, img2_thumbnail, img2_big
			   singleProductAttr.img0_thumbnail = item.imageSmall;
			   singleProductAttr.img0_big = item.imageBig;
			   
			    singleProductAttr.img1_thumbnail = item.imageSmall;
			   singleProductAttr.img1_big = item.imageBig;
			   
			    singleProductAttr.img1_thumbnail = item.imageSmall;
			   singleProductAttr.img1_big = item.imageBig;
			   
			   
			   
			   singleProductAttr.prod_title = item.manufacturer + " " + item.name;
			   singleProductAttr.product_description = item.description;
			   
			   singleProductAttr.product_specials = withPrefix?"Specials: ": "" +  item.umts;
			   
			
			if(item.category.toLowerCase() =="laptop" || item.category.toLowerCase() =="pc" ||item.category.toLowerCase() =="tablet" ||item.category.toLowerCase() =="smartphone")
			{
				singleProductAttr.first = (withPrefix?"Processeur: ": "") +  item.cpu + (item.cpuTakt != ""? " - " + item.cpuTakt + " Mhz":"");
				singleProductAttr.second = (withPrefix?"Memoire: ": "") +  item.hdd + " | " +  (withPrefix? "RAM: " : "") + item.ram;
				singleProductAttr.third = (withPrefix?"Taille Ecran: ": "") +  item.display;
				singleProductAttr.third_2 = (withPrefix?"Webcam: ": "") +  item.webcam;
				singleProductAttr.fourth = (withPrefix?"Accesoires: ": "") +  item.accessoires;
				singleProductAttr.fourth_2 = (withPrefix?"Batterie: ": "")+  item.batterie;
				singleProductAttr.fifth = (withPrefix?"Extra: ": "")+  item.os + (item.programme != ""? " , " + item.programme:"");
				singleProductAttr.seventh = (withPrefix?"Garantie: ": "")+  item.garantie;
				singleProductAttr.contact = (withPrefix?"Contact: ": "") +  item.contact;
				singleProductAttr.price = (withPrefix?"Prix: ": "") +  item.price + " FCFA";
			}
			if(item.category.toLowerCase() =="accesoire")
			{
			}
			
			if(item.category.toLowerCase() =="securite")
			{
					if(item.subcategory.toLowerCase()=="firealarm")
					{
						singleProductAttr.fourth_2 = (withPrefix?"Batterie: ": "")+  item.batterie;
						//singleProductAttr.fifth = withPrefix?"Extra: ": "" +  item.os + " , " + item.programme;
						singleProductAttr.seventh = (withPrefix?"Garantie: ": "") +  item.garantie;
						singleProductAttr.contact = (withPrefix?"Contact: ": "")+  item.contact;
						singleProductAttr.price = (withPrefix?"Prix: ": "")+  item.price + " FCFA"; 
						
						
					}
			}
			
			return singleProductAttr;
			
			*/
			
			var singleProductAttr = [];
			
			singleProductAttr.longdescription = item.longdescription;
			singleProductAttr.details = item.details;
			singleProductAttr.price = item.price;
			singleProductAttr.etat = item.etat;
			singleProductAttr.disponibilite = item.disponibilite;
			singleProductAttr.name = item.manufacturer + " " + item.name;
			
			return singleProductAttr;
			
			
			
			
			
			 
  }
	// Opens up a preview for one of the products.
	// Its parameters are an index from the hash and the products object.
	function renderSingleProductPage(index, data){
		
		var pageAll = $('.all-products'),
			allProducts = $('.all-products .products-list>div>li');

		/*var pageAll = $('.all-products'),
			allProducts = $('.all-products>div');	*/
			
			
			
			
		// Hide all the products in the products list.
		allProducts.addClass('hidden');
		$('.error').addClass('hidden');
		$('.nothingFound').addClass('hidden');
		$('.team').addClass('hidden');
		

		//remove hidden from selected product - workaround to avoid overlapping footer
		$('#'+index).removeClass('hidden');
		
		// Hide whatever page is currently shown.
		$('.main-content .page').removeClass('visible');
		$('#cat').text("");
		var page = $('.single-product-detail'),
			container = $('.container-preview-large');
			
			
			
			var length = $('.product_item').length;
		for(var x = 0; x < length; x++)
		{
			$('.product_item')[0].remove();
		}
			
			
			
			
		var singleProductAttr = [];
		// Find the wanted product by iterating the data object and searching for the chosen index.
		if(data.length){
			for(var i=0; i < data.length;i++)
			{
				if(data[i].Id == index){
				
					singleProductAttr = formatSingleProductAttibutes(data[i]);
					
					
					$('#product-longdescription').html(singleProductAttr.longdescription);
					$('#product-details').html(singleProductAttr.details);
					$('#product-dispo').html("Disponibilité: " + singleProductAttr.disponibilite);
					$('#product-etat').html("Etat: " + singleProductAttr.etat);
					$('#product-price').html("Prix: " + singleProductAttr.price + " FCFA");
					$('#product-name').html(singleProductAttr.name);
					
					/*
					$('.prod_title').text(singleProductAttr.prod_title);
					$('#product_description').text(singleProductAttr.product_description);
			
					$('.price').text(singleProductAttr.price);
					$('.product-spec1').text( singleProductAttr.first);
					$('.product-spec2').text(singleProductAttr.second);
					$('.product-spec3').text(singleProductAttr.third);
					$('.product-spec3_2').text(singleProductAttr.third_2);
					
					
					$('.product-spec4').text(singleProductAttr.fourth);
					$('.product-spec4-2').text(singleProductAttr.fourth_2);
					$('.product-spec5').text(singleProductAttr.fifth );
					$('.product-spec6').text(singleProductAttr.seventh);
					$('.product-contact').text(singleProductAttr.contact);*/

					break;
				}
			}

		}
		

		
		// Show the page.
		page.addClass('visible');
		
		
		
	}

	// Find and render the filtered data results. Arguments are:
	// filters - our global variable - the object with arrays about what we are searching for.
	// products - an object with the full products list (from product.json).
	function renderFilterResults(filters, products){

			// This array contains all the possible filter criteria.
		var criteria = ['manufacturer','storage','os','camera'],
			results = [],
			isFiltered = false;

		// Uncheck all the checkboxes.
		// We will be checking them again one by one.
		checkboxes.prop('checked', false);


		criteria.forEach(function (c) {

			// Check if each of the possible filter criteria is actually in the filters object.
			if(filters[c] && filters[c].length){


				// After we've filtered the products once, we want to keep filtering them.
				// That's why we make the object we search in (products) to equal the one with the results.
				// Then the results array is cleared, so it can be filled with the newly filtered data.
				if(isFiltered){
					products = results;
					results = [];
				}


				// In these nested 'for loops' we will iterate over the filters and the products
				// and check if they contain the same values (the ones we are filtering by).

				// Iterate over the entries inside filters.criteria (remember each criteria contains an array).
				filters[c].forEach(function (filter) {

					// Iterate over the products.
					products.forEach(function (item){

						// If the product has the same specification value as the one in the filter
						// push it inside the results array and mark the isFiltered flag true.

						if(typeof item.specs[c] == 'number'){
							if(item.specs[c] == filter){
								results.push(item);
								isFiltered = true;
							}
						}

						if(typeof item.specs[c] == 'string'){
							if(item.specs[c].toLowerCase().indexOf(filter) != -1){
								results.push(item);
								isFiltered = true;
							}
						}

					});

					// Here we can make the checkboxes representing the filters true,
					// keeping the app up to date.
					if(c && filter){
						$('input[name='+c+'][value='+filter+']').prop('checked',true);
					}
				});
			}

		});

		// Call the renderProductsPage.
		// As it's argument give the object with filtered products.
		renderProductsPage(results, "");
	}


	// Shows the error page.
	function renderErrorPage(){
		var page = $('.error');
		page.removeClass('hidden');
		page.addClass('visible');
		$('#cat').text("");
		
	}
	

	
	// Shows the nothingFound page.
	function renderNoProductFoundPage(searchCategory, searchManufacturer){
		//insertSubtitle(searchCategory);
		$('#cat').text(searchCategory);
		var page1 = $('.all-products'),
			allProducts = $('.all-products .products-list > div> li');
		

		// Hide all the products in the products list.
		allProducts.addClass('hidden');
		
		
		//remove hidden from selected product - workaround to avoid overlapping footer
		//$('#'+index).removeClass('hidden');

	
		// Hide whatever page is currently shown.
		$('.main-content .page').removeClass('visible');
		
		var page = $('.nothingFound');
		var messageContainer = $('#nothingfoundMessageContainer');
		var message =  "";
		if(searchManufacturer == "all")
		{ 
			 message = "Sorry, no " + searchCategory.replace('#', '').trim() + " found";
		}
		else
		{
			 message = "Sorry, no " + searchCategory.replace('#', '').trim() + " " + searchManufacturer + " found";
		}
		
		messageContainer.text(message);
		page.removeClass('hidden');
		page.addClass('visible');
	}

	
	//show the contact page	
	function renderContactPage(){
	
		
		var page = $('.team');
		$('.all-Submenus .submenus-list').addClass('hidden');

		var length = $('.product_item').length;
		for(var x = 0; x < length; x++)
		{
			$('.product_item')[0].remove();
		}
		// Show the page itself.
		// (the render function hides all pages so we need to show the one we want).
		page.addClass('visible');
		
		$('#cat').text("Notre Equipe");
	}
	
	
		//show the contact page	
	function renderStoresPage(){
		var page = $('.team');
		$('.all-Submenus .submenus-list').addClass('hidden');

		var length = $('.product_item').length;
		for(var x = 0; x < length; x++)
		{
			$('.product_item')[0].remove();
		}
		// Show the page itself.
		// (the render function hides all pages so we need to show the one we want).
		page.addClass('visible');
		
		$('#cat').text("Nos Magasins");
	}


	
	
	// Get the filters object, turn it into a string and write it into the hash.
	function createQueryHash(filters){

		// Here we check if filters isn't empty.
		if(!$.isEmptyObject(filters)){
			// Stringify the object via JSON.stringify and write it after the '#filter' keyword.
			window.location.hash = '#filter/' + JSON.stringify(filters);
		}
		else{
			// If it's empty change the hash to '#' (the homepage).
			window.location.hash = '#';
		}

	}

});