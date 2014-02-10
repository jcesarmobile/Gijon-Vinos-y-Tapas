//window.onerror = function (desc,page,line,chr){ alert("DESC: "+desc+" Page: "+page+" Line: "+line+ " CHR: "+chr); }
  		var map;
		var geocoder;
		var bares;
        var bar;
			          
            /* This function runs when the body is loaded.*/
            var init = function () {
                    $.ui.backButtonText = "Atrás";// We override the back button text to always say "Back"
                    window.setTimeout(function () {
                        $.ui.launch();
                    }, 1500);//We wait 1.5 seconds to call $.ui.launch after DOMContentLoaded fires
                };
            document.addEventListener("DOMContentLoaded", init, false);
            $.ui.ready(function () {
            	
            	$.ui.removeFooterMenu();

            });
            
            function onDeviceReady() {
                // en android parece que no funciona bien si pones el porcentaje dentro del scroller del intel app framework
                $("#mapa").css("height",(window.innerHeight-100)+"px");
                $.getJSON('http://jcesarmobile.com/cyl/vinos.json',
                
                	function(data){
                    
                    	bares = data.directorios.directorio;
                        var htmlOutput = "";
                        for (var i = 0; i < bares.length; i++) {
                        	var currentBar = bares[i];
                          	htmlOutput += "<li data-indice='"+i+"'><a href='#details'><span class='imgspan'>";
                          	if (currentBar.foto) {
                          		 htmlOutput += "<img src='"+currentBar.foto.content+"'/>";
                          	} 
                          		
                          	htmlOutput += "</span><span class='titlespan'>"+currentBar.nombre.content+"</span></a></li>";
                        }
                        $("#bares").append(htmlOutput);
                          
                 	}
                          
              	);
                          
                $("#bares").on("click","li",
                	function(){
                    	var indice = $(this).data("indice");
                        bar = bares[indice];
                        
                        if (bar.foto) {
                        	$("#foto").attr("src",bar.foto.content);	
                        } else {
                        	$("#foto").attr("src","");
                        }
                        if (bar.descripcion && bar.descripcion.content) {
                        	$("#descripcion").html(bar.descripcion.content);
                        } else {
                        	$("#descripcion").html("");
                        }
                        
                        var botonesString = "";
                        if (bar.telefono&&bar.telefono.content) {
                        	botonesString += "<a class='button icon phone' href='tel:+34"+bar.telefono.content.split(" ").join("")+"'>Llamar</a>";
                        } 
                        
                        if (bar["correo-electronico"]) {
                        	botonesString += "<a class='button icon mail' href='mailto:"+bar["correo-electronico"]+"'>Mail</a>";
                        } 
                        botonesString += "<a class='button icon location' data-transition='up' href='#localizacion'>Localización</a>";
                        
                        $("#botones").html(botonesString);
                        
                        if (bar.horario==="") {
                        	$("#horario").html("No disponible");
                        } else {
                        	$("#horario").html(bar.horario);
                        }
                        
                        if (bar.web ==="") {
                        	$("#web").attr("href",bar.url);
                        } else {
                        	$("#web").attr("href",bar.web);
                        }
                        
                        $("#direccion").html(bar.direccion[0]);

    					
    					
  

                                            
            		});
            		
            		$("#web").bind("click",function (event) {
            			
            			event.preventDefault();
						window.open($(this).attr("href"),'_blank', 'location=no');
						
                    });
                    

            }
        
        	document.addEventListener('deviceready', onDeviceReady, false);
        	
        	function initMap(){
        		
        		var loc;
					    if (bar.localizacion.content) {
					    	var locParts = bar.localizacion.content.split(" ");
					    	loc = new google.maps.LatLng(locParts[0], locParts[1]);
					    	showMap(loc);
					    } else {
					    	
					    	geocoder = new google.maps.Geocoder();
					    	var address = "calle "+bar.direccion[0];
					    	console.log(address);
					    	geocoder.geocode( { 'address': address}, function(results, status) {
					        if (status == google.maps.GeocoderStatus.OK) {
					           
								loc = results[0].geometry.location;
					            showMap(loc);
					        } else {
					            
					            navigator.notification.alert('No se pudo cargar el mapa', null, 'Error', 'Ok');
					            $("#map_canvas").hide();
					            
					        }
					    
					    	});
					    }
   
    
					    
        	}
        	
        	function showMap(loc){
        		var mapOptions = {
					                zoom: 14,
					                center: loc,
					                mapTypeId: google.maps.MapTypeId.ROADMAP
					            };
				map = new google.maps.Map(document.getElementById('map_canvas'),mapOptions);
				var marker = new google.maps.Marker({
					                map: map,
					                position: loc,
					                clickable: true,
					                title: bar.nombre.content 
					            });
				var infowindow = new google.maps.InfoWindow({
				    content: bar.nombre.content
				});

				google.maps.event.addListener(marker, 'click', 
					function() {
				    	infowindow.open(map,marker);
				 	 });
				 	 $('#map_canvas').on('click', 'a', function(event){
					    event.preventDefault();
					    window.open($(this).attr('href'), '_blank');
					}); 
					
        	}
        	
        	function loadedLocPanel() {

            	initMap();

        	}
        	
        	function loadedBarPanel(){
        		
                setTimeout(
					function(){
                       $.ui.setTitle(bar.nombre.content);
                	},0);
                       
        	}