
//INDICE DE FUNCIONES GOOGLE MAPS

//01. inicializar_google_maps
//02. initialize
//03. loadContent
//04. foundLocation
//05. noLocation
//06. codeAddress
//07. 
//08. getDistanceFromLatLonInKm
//09. deg2rad

//01.//////////////////////////////////////////////////////////////////////////////////////////////// 
function inicializar_google_maps(mobile,server,id_supervisor,tipo_key_id,key_id,lat,long,filtros){
  
  //alert("BUSCAR PUNTOS EN SERVIDOR");
  var token_sesion = window.sessionStorage.getItem("token_sesion");
  //GENERALIZAR
  if(id_supervisor==undefined){
    id_supervisor = 17;
  }
  
  //BUSCAR SUCURSALES DEL SUPERVISOR
  cadena_parametros = "tipo_key_id="+tipo_key_id+"&id_supervisor="+id_supervisor;
  //alert(cadena_parametros)
  ventana =  document.forms["ventanaForm"].elements["ventana"].value;

  
  
  //MOSTRAR MAPA EN LA PANTALLA
  if(ventana=="mapa_sucursales" || ventana=="mapa_sucursales_di"){
   
    //BUSCAR UNA SUCURSAL EN PARTICULAR
    cadena_parametros = "tipo_key_id="+tipo_key_id+"&cod_interno="+key_id+"&id_canal="+filtros+"&ventana="+ventana+"&token_sesion="+token_sesion;  
   
    //PHONEGAP (AGREGAR EL TOKEN SESION)

	if(token_sesion!=undefined && token_sesion!=""){
	  cadena_parametros = "tipo_key_id="+tipo_key_id+"&cod_interno="+key_id+"&id_canal="+filtros+"&ventana="+ventana+"&token_sesion="+token_sesion;
	}

    loadurl_xml('action_buscar_sucursales.php',cadena_parametros,triggered_mapa_xml);

  } 
  else if(ventana=="mapa_latitud"){
    cadena_parametros = "tipo_key_id="+tipo_key_id+"&cod_interno="+key_id+"&token_sesion="+token_sesion;
    loadurl_xml('mapa/action_latitud.php',cadena_parametros,triggered_mapa_xml);
  } 
  else if(ventana=="lista_sucursales"){
    //BUSCAR LISTA DE SUCURSALES
    
	cadena_parametros = "latitud_usuario="+lat+"&longitud_usuario="+long; 
	//PHONEGAP (AGREGAR EL TOKEN SESION)
    
    
	if(token_sesion!=undefined && token_sesion!=""){
	  cadena_parametros = "latitud_usuario="+lat+"&longitud_usuario="+long+"&token_sesion="+token_sesion;
	}
	
    loadurl_xml("action_listar_sucursales.php",cadena_parametros,triggered_lista_xml);
  } 
	//alert(cadena_parametros);
} 

//01.//////////////////////////////////////////////////////////////////////////////////////////////// 

//02.//////////////////////////////////////////////////////////////////////////////////////////////// 

function inicializando(lat,long,mensaje,distancia,mobile,server,xml_root,tipo_key_id) {
  //alert("POBLAR MARCADORES GOOGLE MAPS");
  ventana = document.forms["ventanaForm"].elements["ventana"].value;	
  
  lat = document.forms["mapa"].elements["lat"].value;
  long = document.forms["mapa"].elements["long"].value;	
	
  //ABRIR EL XML CON LOS PUNTOS		
  var xml_entidad = xml_root.firstChild;
  id_cargo = xml_root.attributes.getNamedItem("id_cargo").nodeValue;
  cant_filas = xml_entidad.attributes.getNamedItem("cant_filas").nodeValue;
  asignacion_informes = URLDecode(xml_entidad.attributes.getNamedItem("asignacion_informes").nodeValue);
//alert("2"); 
  //alert(cant_filas)
  //cant_filas = 10;
  
  //DEFINICION DEL COLOR DEL ICONO ESPECIAL PARA LA UBICACION ACTUAL
  var pinColor = "69FF75";
  	
  //DEFINICION DE FORMA DE LOS MARCADORES
  var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
    new google.maps.Size(21, 34),
    new google.maps.Point(0,0),
    new google.maps.Point(10, 34));
	
  var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
    new google.maps.Size(40, 37),
    new google.maps.Point(0, 0),
    new google.maps.Point(12, 35));
  
  var markers = [];
  //alert("4");
  //INICIO UBICACION ACTUAL

  if(tipo_key_id=="ID_USUARIO"){
  
    //DEFINIR EL MARCADOR DE LA UBICACION ACTUAL
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, long),
      map: map,
	  icon: pinImage,
      shadow: pinShadow
    });
  
    //AGREGAR EL MARCADOR DE LA UBICACION ACTUAL
    markers.push(marker);
  
      //CREAR EVENTO CLICK DE LA UBICACION ACTUAL
      google.maps.event.addListener(marker, 'click', (function(marker, i) {
      
	    //FUNCION PARA EL EVENTO CLICK DE LA UBICACION ACTUAL
	    return function() {
	      marker.setVisible(false);
	    }
	  
        })		
      (marker, i));
  }
  
   //FIN UBICACION ACTUAL
  
  for(var i=0;i<cant_filas;i++){
  
    var infowindow = new google.maps.InfoWindow(), marker, i;
    var CanalColor = '';
	latitud_gps = URLDecode(xml_entidad.getElementsByTagName("latitud_gps").item(i).firstChild.data);
	longitud_gps = URLDecode(xml_entidad.getElementsByTagName("longitud_gps").item(i).firstChild.data);
	var latLng = new google.maps.LatLng(latitud_gps,longitud_gps);
	if(ventana =='mapa_latitud'){
	  var marker = new google.maps.Marker({position: latLng,});
	}
	else{
	
	  //PERMITE QUE EL MARCADOR A UTILIZAR SE DEFINA EN FUNCION DEL CANAL (ARCOR)
	  if(isset(xml_entidad.getElementsByTagName("id_canal").item(i).firstChild))
		CanalColor =  URLDecode(xml_entidad.getElementsByTagName("id_canal").item(i).firstChild.data);
	  else
		CanalColor = "";
	  if(CanalColor==10){
		var pinColor = "FF3333";
		var Image = "../plugins/imagenes/plataforma/m.png";
	  }
	  else if(CanalColor==20){
		var pinColor = "0066CC";
		var Image = "../plugins/imagenes/plataforma/c.png";
	  }
	  else if(CanalColor==30){
		var pinColor = "CCCC99";
		var Image = "../plugins/imagenes/plataforma/s.png";
	  }
	  else if(CanalColor==40){
		var pinColor = "993399";
		var Image = "../plugins/imagenes/plataforma/d.png";
	  }
	  else if(CanalColor==80){
		var pinColor = "FFFF00";
		var Image = "../plugins/imagenes/plataforma/a.png";
	  }
	  else if(CanalColor==90){
		var pinColor = "FFFF00";
		var Image = "../plugins/imagenes/plataforma/f.png";
	  }
	  else{
	    //CASO COPEC!!!!!
		var pinColor = "FFFF00";
		var Image = "../plugins/imagenes/plataforma/copec_mini.png";
	  }
	
	  //icon: pinImage
		//DEFINIR LAS PROPIEDADES DE TAMAÑO DEL MARCADOR
		//CASO COPEC!!!!! (ICONO ES MAS ANCHO)
		if(CanalColor==1){
		  var pinImage = new google.maps.MarkerImage(Image,
		  new google.maps.Size(40, 15),
		  new google.maps.Point(0,0),
		  new google.maps.Point(10, 34));
		}
		else{
		  var pinImage = new google.maps.MarkerImage(Image,
		  new google.maps.Size(21, 34),
		  new google.maps.Point(0,0),
		  new google.maps.Point(10, 34));
		}
		//SOLO SI EL USUARIO ES ADMINISTRADOR PERMITIR ARRASTRAR LOS MARCADORES PARA RELOCALIZAR
		if(document.getElementById('var_s_perfil').value=='1' && mobile==false){
			var marker = new google.maps.Marker({
			  position: latLng,
			  icon: pinImage,
			  editable: true,
			  draggable: true
			});
		}else{
			var marker = new google.maps.Marker({
			  position: latLng,
			  icon: pinImage
			});
		}
	}

    markers.push(marker);
	
	
	  //DRAG MOVE DEL MARKER
	  google.maps.event.addListener(marker, 'dragend', (function(marker, i) { 
	  return function() {
	  Codigo = URLDecode(xml_entidad.getElementsByTagName("cod_interno").item(i).firstChild.data);
	  coords =  marker.getPosition();		
      //alert(coords)
	  cadena_parametros = "Codigo="+Codigo+"&Cordenadas="+coords+"&ventana="+ventana;
	  loadurl_xml('mapa/cambio_lat_long.php',cadena_parametros,triggered_mapa_Lat_Long);	
	  }
	  })
	  (marker, i));
	
	  //CREAR EVENTO CLICK DEL MARCADOR
		google.maps.event.addListener(marker, 'click', (function(marker, i) {
		return function() {
		
		 cod_interno = URLDecode(xml_entidad.getElementsByTagName("cod_interno").item(i).firstChild.data); 
		 codigo_local = URLDecode(xml_entidad.getElementsByTagName("codigo_local").item(i).firstChild.data); 
		
				var html = '';
				var aplicacion = document.forms["ventanaForm"].elements["aplicacion"].value;
				
				if(ventana=='mapa_latitud'){
					comuna = URLDecode(xml_entidad.getElementsByTagName("comuna").item(i).firstChild.data);
					id_sucursal_cliente = URLDecode(xml_entidad.getElementsByTagName("id_sucursal_cliente").item(i).firstChild.data);
					denominacion = URLDecode(xml_entidad.getElementsByTagName("denominacion").item(i).firstChild.data);
					var id_canal = '';
				}else{
					var id_canal = xml_entidad.getElementsByTagName("id_canal").item(i).firstChild.data;
					comuna ='';
					id_sucursal_cliente ='';
					denominacion ='';
				}
					distancia = myRound(getDistanceFromLatLonInKm(lat,long,latitud_gps,longitud_gps),1);
					latround = myRound(lat,7);
					longround = myRound(long,7)
			
            //HAY QUE PARAMETRIZAR EL SERVIDOR PARA CUANDO VAYA A PRODUCCION
			servidor = "http://192.168.1.183/angular/aplicacion/BusinessLogic/mapa/consulta_datos_punto.php";
			var token_sesion = window.sessionStorage.getItem("token_sesion");
			$.post(servidor,
			{
				cod_interno:cod_interno,ventana:ventana,aplicacion:aplicacion,id_canal:id_canal,distancia:distancia,
				mobile:mobile,host:host,comuna:comuna,codigo_local:codigo_local,id_sucursal_cliente:id_sucursal_cliente,denominacion:denominacion,lat:lat,long:long,
				latround:latround,longround:longround,token_sesion:token_sesion
			}, 
			function(data){
			infowindow.setContent(data);
			infowindow.open(map, marker);
			});
				
		}

		})
	
  (marker, i));
	
  }
  
  //GENERALIZAR!!!!
  if(ventana=="mapa_latitud"){
    tipo_key_id = "ID_USUARIO";
  }
  
  //DEFINIR PUNTO DE VISUALIZACION INICIAL EN EL MAPA: EN EL PUNTO DE REFERENCIA (ID_SUCURSAL) O EN LA UBICACION ACTUAL (ID_USUARIO)	
  if(tipo_key_id=="ID_USUARIO") {
    var latlng = new google.maps.LatLng(lat, long);
  }
  else if(tipo_key_id=="ID_SUCURSAL") {
	var latlng = new google.maps.LatLng(latitud_gps, longitud_gps);
  }
 
  //DEFINIR OPCIONES GENERALES DE VISUALIZACION DEL MAPA
  var myOptions = {
    zoom: 15,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: true
  };
  
  //ELEMENTO QUE DIBUJA EL MAPA
  var map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
  

  //DEFINIR PARAMETROS DE LA AGRUPACION DE MARCADORES
  if(ventana=="mapa_sucursales" || ventana=="mapa_sucursales_di")
    zoom = 14;
  else if(ventana=="mapa_latitud")
    zoom = 1;
  size = 60;
  
  var markerCluster = new MarkerClusterer(map, markers, {
    maxZoom: zoom,
    gridSize: size
  });
  
}

//02.//////////////////////////////////////////////////////////////////////////////////////////////// 

//03.//////////////////////////////////////////////////////////////////////////////////////////////// 
//FUNCION QUE SE EJECUTA AL HACER CLIC EN BOTON DE INFOWINDOW DE GOOGLE MAPS

function loadContent(mobile,server,id_sucursal,latitud_gps,longitud_gps,latitud_punto,longitud_punto,distancia,ventana,Mercaderista,NameMercaderista,TipoComunicacion){ 
  //mobile, latitud_punto y longitud_punto no se usan
  id_usuario = document.forms["ventanaForm"].elements["id_usuario"].value;	
 
  //DISTANCIA ENTRE GPS Y SUCURSAL DEBE SER MENOR A 3 KILOMETROS
  
  //EXCEPCION PARA CLAUDIO CONTRERAS DE ARCOR
    distancia_max_permitida =  document.getElementById("var_distancia_maps").value;
  
  //alert(distancia_max_permitida);
  
  if(parseFloat(distancia)<=parseFloat(distancia_max_permitida)){
	if(ventana=='local_cerrado'){
	cadena_parametros = 'id_sucursal='+id_sucursal+'&lat='+latitud_gps+'&lon='+longitud_gps+'&distancia='+distancia;
		 loadurl_xml('localcerrado.php',cadena_parametros,triggered_xml_cerrado)
	}else if(ventana=='informe_punto_venta'){
	   //COMPARAR CON ARCHIVO EN SERVIDOR PARA HOMOLAGAR EL LLAMADO A LA VENTANAS
	    $.mobile.changePage ('file:///android_asset/www/aplicacion/informe_punto_venta.html?ventana='+ventana+'&padre=mapa_sucursales&id_sucursal='+id_sucursal+"&lat="+latitud_gps+"&lon="+longitud_gps+"&distancia="+distancia+"&Mercaderista="+Mercaderista+"&NameMercaderista="+NameMercaderista+"&Comunicacion="+TipoComunicacion,{transition: 'none'});
        //window.location='file:///android_asset/www/aplicacion/informe_punto_venta.html?ventana='+ventana+'&padre=mapa_sucursales&id_sucursal='+id_sucursal+"&lat="+latitud_gps+"&lon="+longitud_gps+"&distancia="+distancia+"&Mercaderista="+Mercaderista+"&NameMercaderista="+NameMercaderista+"&Comunicacion="+TipoComunicacion;
	}else{
	   
	  url_servidor = window.localStorage.url_servidor;  
	
	  //PHONEGAP
	  if(url_servidor!=undefined && url_servidor!=""){
	   //alert(ventana);
	    //window.location='file:///android_asset/www/aplicacion/'+ventana+'.html?ventana='+ventana+'&padre=mapa_sucursales&id_sucursal='+id_sucursal+"&lat="+latitud_gps+"&lon="+longitud_gps+"&distancia="+distancia+"&Mercaderista="+Mercaderista+"&NameMercaderista="+NameMercaderista+"&Comunicacion="+TipoComunicacion;
        $.mobile.changePage ('file:///android_asset/www/aplicacion/'+ventana+'.html?ventana='+ventana+'&padre=mapa_sucursales&id_sucursal='+id_sucursal+"&lat="+latitud_gps+"&lon="+longitud_gps+"&distancia="+distancia+"&Mercaderista="+Mercaderista+"&NameMercaderista="+NameMercaderista+"&Comunicacion="+TipoComunicacion,{transition: 'none'});
      }
	  //NO PHONEGAP
      else{
	   window.location='http://'+server+'/aplicacion/window.php?ventana='+ventana+'&padre=mapa_sucursales&id_sucursal='+id_sucursal+"&lat="+latitud_gps+"&lon="+longitud_gps+"&distancia="+distancia+"&Mercaderista="+Mercaderista+"&NameMercaderista="+NameMercaderista+"&Comunicacion="+TipoComunicacion;
      }
	  
	}
  } 
  else{
    alert("Punto de venta no puede estar a más de " + distancia_max_permitida + " kilómetro(s)");
  } 
  
} 

//03.//////////////////////////////////////////////////////////////////////////////////////////////// 

//04.//////////////////////////////////////////////////////////////////////////////////////////////// 
//NO DEBIESE ESTAR EL FLA MAPS PUES OTROS FORMULARIOS IGUAL GEOREFERENCIAN!!

function foundLocation(position){ 

  //alert("POSICION ENCONTRADA");
  var lat = position.coords.latitude; 
  var long = position.coords.longitude; 
 
  //PARAMETROS
  mobile = document.forms["ventanaForm"].elements["mobile"].value;
  host =  document.forms["ventanaForm"].elements["host"].value;
  ventana =  document.forms["ventanaForm"].elements["ventana"].value;
  tipo_key_id = document.forms["ventanaForm"].elements["tipo_key_id"].value;
  key_id = document.forms["ventanaForm"].elements["key_id"].value;

  //PARA EL FILTRO DEL MAPA EN EL MOVIL (PANEL DERECHO)
  if(mobile=='false'){
    filtros='';
  }
  else{
	if(ventana=="mapa_sucursales"){
	  filtros = document.getElementById('filtros').value;
	}
	else{
      filtros='';
	}
  }
  
  //MOSTRAR MAPA EN LA PANTALLA
  if(ventana=="mapa_sucursales" || ventana=="mapa_latitud"){ 
    
    document.forms["mapa"].elements["lat"].value = lat;
    document.forms["mapa"].elements["long"].value = long;
    inicializar_google_maps(mobile,"",host,tipo_key_id,key_id,"","",filtros);
    }
  else if(ventana=="lista_sucursales"){
	inicializar_google_maps(mobile,"",host,tipo_key_id,key_id,lat,long,filtros);
  }
  else if(ventana=="mapa_sucursales_di"){
    document.forms["mapa"].elements["lat"].value = lat;
    document.forms["mapa"].elements["long"].value = long;
	inicializar_google_maps_di(mobile,"",host,tipo_key_id,key_id,"","",filtros);
  }
  //FORMULARIOS DE CAPTURA EN GENERAL
  else{
  
    //GENERALIZAR: GEOREFERENCIACION DE MULTICAJA
    document.forms["potencial_clienteForm"].elements["lat"].value = myRound(lat,7);
    document.forms["potencial_clienteForm"].elements["lon"].value = myRound(long,7);
				
  }
} 
 
//04.//////////////////////////////////////////////////////////////////////////////////////////////// 
 
//05.//////////////////////////////////////////////////////////////////////////////////////////////// 
 
function noLocation() { 
  alert('Imposible encontrar la ubicación'); 
} 

//05.//////////////////////////////////////////////////////////////////////////////////////////////// 

//06.//////////////////////////////////////////////////////////////////////////////////////////////// 

function codeAddress(address) {
  
  geocoder = new google.maps.Geocoder();	
  geocoder.geocode( { 'address': address}, function(results, status) {
  
  if (status == google.maps.GeocoderStatus.OK) {
  
    //alert(results[0].geometry.location);
	  
    //map.setCenter(results[0].geometry.location);
			
    //var marker = new google.maps.Marker({
    //  map: map,
    //  position: results[0].geometry.location		
    //});
	
	latlong = results[0].geometry.location;
	
  } 
  else {
    alert("Geocode was not successful for the following reason: " + status);
  }
  });
 
return latlong;	
		
}

//06.//////////////////////////////////////////////////////////////////////////////////////////////// 

//07.//////////////////////////////////////////////////////////////////////////////////////////////// 

function myRound(value, places) {
    var multiplier = Math.pow(10, places);
    return Math.round(value * multiplier) / multiplier;
}

//07.//////////////////////////////////////////////////////////////////////////////////////////////// 

//08.//////////////////////////////////////////////////////////////////////////////////////////////// 

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  
  return d;
}

//08.//////////////////////////////////////////////////////////////////////////////////////////////// 

//09.//////////////////////////////////////////////////////////////////////////////////////////////// 

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

//09.////////////////////////////////////////////////////////////////////////////////////////////////




///////////////////////////////////////MAPAS 4.0////////////////////////////////////////////////////////////
var map;
var panorama;
var selectedShape;
var drawingManager;


function inicializar_google_maps_di(mobile,server,id_supervisor,tipo_key_id,key_id,lat,long,Filtros){
    //alert("inicializa google");
 mapaprimario(lat,long)
} 
 

function mapaprimario(lat,long){

	  ventana = document.forms["ventanaForm"].elements["ventana"].value;	
	 /* lat = document.forms["mapa"].elements["lat"].value;
	  long = document.forms["mapa"].elements["long"].value;*/
	  lat = '-33.437';
	  long='-70.650';
	  document.getElementById("latgeneral").value='('+lat+','+long+')';
	  
	  //ABRIR EL XML CON LOS PUNTOS	

		var latlng = new google.maps.LatLng(lat, long);
		map = new google.maps.Map(document.getElementById('map_canvas'),{
			zoom: 12,
			center:latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true,
			zoomControl: true
		});
			
		
		google.maps.event.addDomListener(map, 'dragend', function(evento) {
			 var Data = map.getCenter();
			 muevemapas(Data);
			 
		});
	
	google.maps.event.addDomListener(map, 'click', function(evento) {
		var latitud = evento.latLng.lat();
			var longitud = evento.latLng.lng();
			streetview(latitud,longitud);
	});
	
	google.maps.event.addDomListener(map, 'zoom_changed', function(evento) {
		var zoomLevel = map.getZoom();
		document.getElementById("zoommap").value = zoomLevel;
	});
		
		
		var latlng = new google.maps.LatLng(lat, long);
		var map2 = new google.maps.Map(document.getElementById('map_canvas2'),{
			zoom: 7,
			center:latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true,
			scrollwheel: false
		});
		
		var lineSymbol = {
		path: google.maps.SymbolPath.CIRCLE,
		scale: 3,
		strokeColor: '#FF0000'
		};
						
		var marker = new google.maps.Marker({
			position: latlng,
			map: map2,
			icon: lineSymbol,
			title:"Mi ubicación!"
		});

		
		var panoramaOptions = {
		position: latlng,
		pov: {
		heading: 34,
		pitch: 10
		}
		};
		panorama = new  google.maps.StreetViewPanorama(document.getElementById('pano'),panoramaOptions);
		map.setStreetView(panorama);
		
		
}


function filtromapa(){

	var strMsgError = '';
	var cbofiltro='';
	var Capas=document.getElementsByName('rdo_capas');
	var Filtro=[];
	var Draw='';
	document.getElementById('bibliografia').innerHTML="";
	document.getElementById('bib').style.display="none";
	var Drawing=document.getElementsByName('rdo_Dibujar');
		for (x=0;x<Drawing.length;x++)
		 {
			if (Drawing[x].checked==true)
			  {
				Draw +=Drawing[x].value;
			  }
		 }
		 
		 
	for (x=0;x<Capas.length;x++)
	 {
		if (Capas[x].checked==true)
	      {
			Filtro.push(Capas[x].value);
	      }
	 }
	
	Filtroln = Filtro.length;
	if(Filtroln!=1){
		if(Filtroln>2){
			
			 strMsgError += 'Solo debe haber un maximo de 2 selecciones';
		}else{
			if(Filtro[0]=='Puntos' || Filtro[1]=='Puntos'){
			}else{
				if(Filtro==''){
				strMsgError += 'Debe seleccionar una capa';
				}else{
					if(Draw==1){
					strMsgError += 'Para dibujar solo se debe seleccionar una capa';
					document.getElementById("rdo_dibujo").checked=false;
					}else{
					strMsgError += 'Solo puntos puede ser una segunda selección';
					}
				}
			}
		}	
	}
	
	var txtLimiteDatos=document.getElementById('txtLimiteDatos').value;
	if(txtLimiteDatos==''){
		strMsgError += 'Límite debe ser minimo 0';
		document.getElementById('txtLimiteDatos').value = 500;
	}
	
	if ( strMsgError != '' ){
		alert( strMsgError );
		return false;		
	}
	else
	{
		ValidaCamposCombobox(Filtro[0],Filtro[1]);
		
		var distribuidor =  $('#distribuidor').val();
		var Comuna =  $('#Comunas').val();
		var zonas = $('#Zonas').val();
		var Vendedor = $('#Vendedor').val();
		var Datencion = $('#Datencion').val();
		var Cluster = $('#Cluster').val();
		var Formato = $('#Formato').val();
		if(distribuidor == null){distribuidor = '';}
		if(Comuna == null){Comuna = '';}
		if(zonas == null){zonas = '';}
		if(Vendedor == null){Vendedor = '';}
		if(Datencion == null){Datencion = '';}
		if(Cluster == null){Cluster = '';}
		if(Formato == null){Formato = '';}
		
		strdistribuidor = retornaresult(distribuidor);
		strComuna = retornaresult(Comuna);
		strzonas = retornaresult(zonas);
		strVendedor = retornaresult(Vendedor);
		strDatencion = retornaresult(Datencion);
		strCluster = retornaresult(Cluster);
		strFormato = retornaresult(Formato);	

		
		//document.getElementById('distribuidor').style.display="none";
		if(Filtro[0]=='Puntos' || Filtro[1]=='Puntos')
		{
			var Colores = $('#Colores').val();
		}
		else{ $("#Colores").multiselect('deselect', $('#Colores').val()); };
		abrebibliografia(Colores);
		
		cadena_parametros="&Capas="+Filtro+"&Dibujar="+Draw+"&distribuidor="+strdistribuidor+"&Comuna="+strComuna+"&zonas="+strzonas+"&Vendedor="+strVendedor+"&Datencion="+strDatencion+"&Cluster="+strCluster+"&Formato="+strFormato+"&Colores="+Colores+"&Limite="+txtLimiteDatos;
		document.getElementById('filtrosBK').value=cadena_parametros;
		//resumen(cadena_parametros);		
		loadurl_xml('interaccion_mapa.php',cadena_parametros,triggered_mapa_xml2); 
	}		
}


function InicializedMapaFilter(lat,long,mensaje,distancia,mobile,server,xml_root,tipo_key_id){
	
	ventana = document.forms["ventanaForm"].elements["ventana"].value;	
	latlnggeneral  = document.getElementById("latgeneral").value.split(',');
	lat = latlnggeneral[0].replace('(', '');
	long = latlnggeneral[1].replace(')', '');
	
	var latlng = new google.maps.LatLng(lat,long);
	var zoomid = parseInt(document.getElementById("zoommap").value);

	var map = new google.maps.Map(document.getElementById('map_canvas'),{
		zoom: zoomid,
		center:latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		disableDefaultUI: true,
		zoomControl: true
	});
	
	google.maps.event.addDomListener(map, 'zoom_changed', function(evento) {
		var zoomLevel = map.getZoom();
		document.getElementById("zoommap").value = zoomLevel;
	});
	
	google.maps.event.addDomListener(map, 'dragend', function(evento) {
		var Data = map.getCenter();
		muevemapas(Data);
	});
	
	google.maps.event.addDomListener(map, 'click', function(evento) {
		var latitud = evento.latLng.lat();
			var longitud = evento.latLng.lng();
			streetview(latitud,longitud);
	});
	

var xml_entidad = xml_root.firstChild;
   capa = xml_root.attributes.getNamedItem("capa").nodeValue;
   Dibujar = xml_root.attributes.getNamedItem("Dibujar").nodeValue;
   cant_filas = xml_entidad.attributes.getNamedItem("cant_filas").nodeValue;
   asignacion_informes = URLDecode(xml_entidad.attributes.getNamedItem("asignacion_informes").nodeValue);
   asignacion_zonas = URLDecode(xml_entidad.attributes.getNamedItem("asignacion_zonas").nodeValue);
   asignacion_distribuidor = URLDecode(xml_entidad.attributes.getNamedItem("asignacion_distribuidor").nodeValue);
   asignacion_colores = URLDecode(xml_entidad.attributes.getNamedItem("asignacion_colores").nodeValue);
   //Colores = xml_root.attributes.getNamedItem("Colores").nodeValue;
   
   
   
	var Filtro = [];
	var Capas=document.getElementsByName('rdo_capas');
	for (x=0;x<Capas.length;x++)
	{
	  if (Capas[x].checked==true)
	  {
		Filtro.push(Capas[x].value);
	  }
	}
var drag = false;
var edit = false;
var Clickeablepoint = true;
//DIBUJAR	 
if(Dibujar=='1'){	

			if(Filtro[0]=='Zonas' || Filtro.length==1){	 
				
			    drag = true;
				edit = true;
				Clickeablepoint = false;
				var polyOptions = {
					strokeWeight: 2,
					fillOpacity: 0.45,
					editable: edit,
					draggable: drag
				};
					
				if(capa=='Puntos'){
						
							alert('la capa de puntos no puede ser dibujada');
							document.getElementById("rdo_dibujo").checked=false;
					}else{
						var drawingManager = new google.maps.drawing.DrawingManager({
							drawingControl: true,
							drawingControlOptions:{
								position: google.maps.ControlPosition.TOP_CENTER,
								drawingModes:[
								google.maps.drawing.OverlayType.POLYGON,
								]
							},
							markerOptions: {draggable: true},
							polygonOptions: polyOptions,
							});
					}			
						drawingManager.setMap(map);
					
						
					google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
					var Event = event.type;
					selectedShape = event;
						if (event.type == event.type) {
								if(Event=='polygon' || Event=='polyline'){
									coords = event.overlay.getPath().getArray();
								}
							
							infowind(coords,event.type,capa,asignacion_distribuidor,asignacion_informes,asignacion_zonas,asignacion_colores,'insertar');
						}
							
					});	
						
						
				function infowind(coordenadas,Event,capa,Distribuidor,Comuna,Zona,asignacion_colores,Proceso){
					var coords ='';
					var largo = coordenadas.length;
					if(capa=='Distribuidor'){ perteneciente = Distribuidor; }
					if(capa=='Comunas'){ perteneciente = Comuna; }
					if(capa=='Zonas'){ perteneciente = Zona; }
					html = '<div><table>';
							html+='<textarea style="display:none" name="coordenadas" id="coordenadas" >'+coordenadas+'</textarea>';
							html+='<input type="hidden" name="largocords" id="largocords" value="'+largo+'">';
							
							
							html+='<tr><td> '+capa+' : <select class="inputtext"  name="comboboxgeneral" id="comboboxgeneral" style="width:130px;" ><option value="0" selected>Seleccione</option>';		
									var informes2 = perteneciente.split('//');	
									var contador2 = 0;
									while(informes2[contador2]!=''){
										var parseinforme2 = informes2[contador2].split('@@');
											html = html + '<option value="'+parseinforme2[0]+'"  rel="external">'+URLDecode(parseinforme2[1])+'</option>';
									contador2 ++;
									}
									html = html + '</select></td></tr>';	
							html+='<tr><td> Color &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <select  class="inputtext"  name="cbocolordata" id="cbocolordata" style="width:130px;" ><option value="0" selected>Seleccione</option>';		
							var informes2 = asignacion_colores.split('//');	
							var contador2 = 0;
							while(informes2[contador2]!=''){
							var parseinforme2 = informes2[contador2].split('@@');
							html = html + '<option value="'+parseinforme2[0]+'"  rel="external">'+URLDecode(parseinforme2[1])+'</option>';
							contador2 ++;
							}
							html = html + '</select></td></tr>';								
							html+='<tr><td><hr></td></tr>';
							html+='<tr><td><input type="button" name="btn_poligon" id="btn_poligon" value="Guardar" onclick=GuardaPolygon("'+Event+'","'+capa+'","'+Proceso+'");></td>';
							html+='<td><input type="button" name="btn_canpoligon" id="btn_canpoligon" value="Cancelar" onclick=closeInfoWindow();></td></tr>';
							html+='</table></div>';
								infowindow = new google.maps.InfoWindow(
								{ 
									content: html
								});
								
								if(Event=='polygon' || Event=='polyline'){
									coords = coordenadas[0];
								}
								else if(Event=='marker')
								{
									coords = coordenadas;
								}
									infowindow.setPosition(coords);
									infowindow.open(map);
								
					}
					
					
						
			}
			else
			{
				alert('Para dibujar , solo debe seleccionar una capa');
				document.getElementById("rdo_dibujo").checked=false;
			}
}
//FIN DIBUJAR

var bermudaTriangle;
var ArreglosInternos = [];

	if(Filtro[0]=='Distribuidor')
	{ 

	    for (var i = 0; i < cant_filas; i++)
		{
			latitud = URLDecode(xml_entidad.getElementsByTagName("latitud").item(i).firstChild.data);
			longitud = URLDecode(xml_entidad.getElementsByTagName("longitud").item(i).firstChild.data);
			var ultimaCoordenada  = new google.maps.LatLng(latitud,longitud);
			ArreglosInternos.push(new google.maps.LatLng(latitud,longitud));
			Cod_interno =  xml_entidad.getElementsByTagName("Cod_interno").item(i).firstChild.data;	 
			color =  '#'+xml_entidad.getElementsByTagName("color").item(i).firstChild.data;	 	

            //EVITA QUE SE CAIGA AL DIBUJAR EL ULTIMO PUNTO
            if(i<cant_filas-1)
			  Cod_internomas = xml_entidad.getElementsByTagName("Cod_interno").item(i+1).firstChild.data;
			else
			  Cod_internomas = "aaa";
			
			if(Cod_interno!=Cod_internomas || i== cant_filas-1){
					var triangleCoords = ArreglosInternos;
					ArreglosInternos = [];
					strLatLngArray = [];
					ComunasPoligon = new google.maps.Polygon({
					paths: triangleCoords,
					editable: edit,
					draggable: drag,
					strokeWeight: 1,
					fillOpacity: 0.30,
					fillColor:color,
					strokeColor: color,
					cod_interno:Cod_interno,
					coordenadas:triangleCoords,
					});
					ComunasPoligon.setMap(map);
					
					google.maps.event.addListener(ComunasPoligon, 'click', function(event){
						var cod_interno = this.cod_interno;
						DatosEnGrilla(cod_interno,Filtro[0]);
						var latitud = event.latLng.lat();
						var longitud = event.latLng.lng();
						streetview(latitud,longitud);
					});		
										
					google.maps.event.addListener(ComunasPoligon, 'rightclick', function(event) {
					var vertices = this.getPath().getArray();
						document.getElementById('poligonospuntosedit').value = vertices;
						var largo = vertices.length;
						cod_interno = this.cod_interno;
						var type = 'polygon';
						var cords = document.getElementById('poligonospuntosedit').value;
						cadena_parametros ="general="+cod_interno+"&Cordenadas="+cords+"&objeto="+type+"&largo="+largo+"&Capa="+capa+"&Color=&Proceso=edit";
						showPopup('popup','¿Esta seguro de editar este poligono?','CONFIRM',cadena_parametros,'mapa_sucursales_di','EditaPolygons');
					});
					google.maps.event.addListener(ComunasPoligon, 'dragend', function(event) {
					var vertices = this.getPath().getArray();
						document.getElementById('poligonospuntosedit').value = vertices;
						var largo = vertices.length;
						cod_interno = this.cod_interno;
						var type = 'polygon';
						var cords = document.getElementById('poligonospuntosedit').value;
						cadena_parametros ="general="+cod_interno+"&Cordenadas="+cords+"&objeto="+type+"&largo="+largo+"&Capa="+capa+"&Color=&Proceso=edit";
						showPopup('popup','¿Esta seguro de editar este poligono?','CONFIRM',cadena_parametros,'mapa_sucursales_di','EditaPolygons');
					});
					
					
			}
		}		
	}

	if(Filtro[0]=='Comunas')
	{ 
	    for (var i = 0; i < cant_filas; i++){
			latitud = URLDecode(xml_entidad.getElementsByTagName("latitud").item(i).firstChild.data);
			longitud = URLDecode(xml_entidad.getElementsByTagName("longitud").item(i).firstChild.data);
			var ultimaCoordenada  = new google.maps.LatLng(latitud,longitud);
			ArreglosInternos.push(new google.maps.LatLng(latitud,longitud));
			Cod_interno =  xml_entidad.getElementsByTagName("Cod_interno").item(i).firstChild.data;	 	
			color =  '#'+xml_entidad.getElementsByTagName("color").item(i).firstChild.data;	 	
			//EVITA QUE SE CAIGA AL DIBUJAR EL ULTIMO PUNTO
            if(i<cant_filas-1)
			  Cod_internomas = xml_entidad.getElementsByTagName("Cod_interno").item(i+1).firstChild.data;
			else
			  Cod_internomas = "aaa";
			
			if(Cod_interno!=Cod_internomas || i== cant_filas-1){
					var triangleCoords = ArreglosInternos;
					ArreglosInternos = [];
					strLatLngArray = [];
					ComunasPoligon = new google.maps.Polygon({
					paths: triangleCoords,
					strokeWeight: 1,
					fillOpacity: 0.30,
					fillColor:color,
					strokeColor: color,
					editable: edit,
					draggable: drag,
					cod_interno:Cod_interno,
					coordenadas:ultimaCoordenada,
					});
					ComunasPoligon.setMap(map);
						google.maps.event.addListener(ComunasPoligon, 'click', function(event) {
							var cod_interno = this.cod_interno;
							DatosEnGrilla(cod_interno,Filtro[0]);
							var latitud = event.latLng.lat();
							var longitud = event.latLng.lng();
							streetview(latitud,longitud);						
						});
					
					google.maps.event.addListener(ComunasPoligon, 'rightclick', function(event) {
						var vertices = this.getPath().getArray();
						document.getElementById('poligonospuntosedit').value = vertices;
						var largo = vertices.length;
						cod_interno = this.cod_interno;
						var type = 'polygon';
						var cords = document.getElementById('poligonospuntosedit').value;
						cadena_parametros ="general="+cod_interno+"&Cordenadas="+cords+"&objeto="+type+"&largo="+largo+"&Capa="+capa+"&Color=&Proceso=edit";
						showPopup('popup','¿Esta seguro de editar este poligono?','CONFIRM',cadena_parametros,'mapa_sucursales_di','EditaPolygons');
					});
					google.maps.event.addListener(ComunasPoligon, 'dragend', function(event) {
					var vertices = this.getPath().getArray();
						document.getElementById('poligonospuntosedit').value = vertices;
						var largo = vertices.length;
						cod_interno = this.cod_interno;
						var type = 'polygon';
						var cords = document.getElementById('poligonospuntosedit').value;
						cadena_parametros ="general="+cod_interno+"&Cordenadas="+cords+"&objeto="+type+"&largo="+largo+"&Capa="+capa+"&Color=&Proceso=edit";
						showPopup('popup','¿Esta seguro de editar este poligono?','CONFIRM',cadena_parametros,'mapa_sucursales_di','EditaPolygons');
					});	
				}
		}		
	}

	if(Filtro[0]=='Zonas')
	{
				numerocolor = 0;
				for (var i = 0; i < cant_filas; i++)
				{	
					var colors = new Array("#FF0000", "#0000FF", "#00FF00", "#FFFF00", "#0099FF");
					/*
					strokeColor: colors[numerocolor],
					fillColor: colors[numerocolor],
					*/
					var cod_interno = URLDecode(xml_entidad.getElementsByTagName("cod_interno").item(i).firstChild.data);
					if(i<cant_filas-1)
					  cod_internomas = xml_entidad.getElementsByTagName("cod_interno").item(i+1).firstChild.data;
					else
					  cod_internomas = "aaa";
					  
					latitud = URLDecode(xml_entidad.getElementsByTagName("latitud").item(i).firstChild.data);
					longitud = URLDecode(xml_entidad.getElementsByTagName("longitud").item(i).firstChild.data);
					color =  '#'+xml_entidad.getElementsByTagName("color").item(i).firstChild.data;	 
					var ultimaCoordenada  = new google.maps.LatLng(latitud,longitud);
					ArreglosInternos.push(new google.maps.LatLng(latitud,longitud));
					//alert(i +'=='+ cant_filas)
						if(cod_interno!=cod_internomas || i == cant_filas-2){
							var triangleCoords = ArreglosInternos;
							Zonapoligon = new google.maps.Polygon({
							paths: triangleCoords,
							strokeWeight: 1,
							fillOpacity: 0.30,
							fillColor:color,
							strokeColor: color,
							editable: edit,
							draggable: drag,
							cod_interno:cod_interno,
							ruta:triangleCoords,
							coordenadas:ultimaCoordenada
							});
							Zonapoligon.setMap(map);
							google.maps.event.addListener(Zonapoligon, 'click', function(event) {
							var cod_interno=this.cod_interno;
							DatosEnGrilla(cod_interno,Filtro[0]);
							var latitud = event.latLng.lat();
							var longitud = event.latLng.lng();
							streetview(latitud,longitud);
							});
							google.maps.event.addListener(Zonapoligon, 'rightclick', function(event) {
								var vertices = this.getPath().getArray();
								document.getElementById('poligonospuntosedit').value = vertices;
								var largo = vertices.length;
								cod_interno = this.cod_interno;
								var type = 'polygon';
								var cords = document.getElementById('poligonospuntosedit').value;
								cadena_parametros ="general="+cod_interno+"&Cordenadas="+cords+"&objeto="+type+"&largo="+largo+"&Capa="+capa+"&Color=&Proceso=edit";
								showPopup('popup','¿Esta seguro de editar este poligono?','CONFIRM',cadena_parametros,'mapa_sucursales_di','EditaPolygons');
							});
							google.maps.event.addListener(Zonapoligon, 'dragend', function(event) {
								var vertices = this.getPath().getArray();
								document.getElementById('poligonospuntosedit').value = vertices;
								var largo = vertices.length;
								cod_interno = this.cod_interno;
								var type = 'polygon';
								var cords = document.getElementById('poligonospuntosedit').value;
								cadena_parametros ="general="+cod_interno+"&Cordenadas="+cords+"&objeto="+type+"&largo="+largo+"&Capa="+capa+"&Color=&Proceso=edit";
								showPopup('popup','¿Esta seguro de editar este poligono?','CONFIRM',cadena_parametros,'mapa_sucursales_di','EditaPolygons');
							});
							ArreglosInternos = [];
							strLatLngArray = [];
							triangleCoords = '';
						}
					numerocolor ++;
					if(numerocolor==4){ numerocolor = 0; }
				}
				
				
	}	
	
	if(Filtro[0]=='Puntos' || Filtro[1]=='Puntos')
	{
		if(Filtro[1]=='Puntos'){
		cant_filas = xml_entidad.attributes.getNamedItem("cant_filas2").nodeValue;
		}	
		
		//alert(triangleCoords);
		
		for (var i = 0; i < cant_filas; i++)
		{
				var infowindow = new google.maps.InfoWindow(), marker, i;
				latitud_gps = URLDecode(xml_entidad.getElementsByTagName("latitud_gps").item(i).firstChild.data);
				longitud_gps = URLDecode(xml_entidad.getElementsByTagName("longitud_gps").item(i).firstChild.data);
				id_mueble = URLDecode(xml_entidad.getElementsByTagName("id_mueble").item(i).firstChild.data);
				id_formato = URLDecode(xml_entidad.getElementsByTagName("id_formato").item(i).firstChild.data);
				var latLng = new google.maps.LatLng(latitud_gps,longitud_gps);

				
				if(ventana =='mapa_latitud')
				{
					var marker = new google.maps.Marker({
					position: latLng,
					});
				}
				else
				{
					//var Color = "../plugins/imagenes/plataforma/circulo_negro.png
					var colors = new Array("#000000","#FF0000","#0066FF","#FFFFFF", "#CCCCCC", "#CC6666", "#FF9999", "#FF3300", "#CC6633", "#FF6600", "#FF9966", "#663300", "#FFCC99", "#FF9900", "#FFCC00", "#CCFF00", "#99FF00", "#336600", "#003399", "#000066", "#CC00FF", "#CC99CC", "#330033", "#FF00FF", "#FF0099", "#FF0066", "#FF0033", "#FF33FF", "#0000FF");
					if(Colores=='0'){
						var Color = colors[0];
					}else if(Colores == '1'){
						var Color = colors[id_mueble];
					}else if(Colores == '2'){
						var Color = colors[id_formato];
					}				
					/*BIB*/
					
					
					/*BIB*/
						var lineSymbol = {
						path: google.maps.SymbolPath.CIRCLE,
						scale: 3,
						strokeColor: Color
						};

					//icon: pinImage
					if(document.getElementById('var_s_perfil').value=='1' &&  Dibujar=='1'){
					var marker = new google.maps.Marker({
					position: latLng,
					icon: lineSymbol,
					editable: true,
					map: map,
					draggable: true
					});
					}else{
					var marker = new google.maps.Marker({
					position: latLng,
					icon: lineSymbol,
					editable: true,
					map: map,
					draggable: true,
					});
					}
				}
					
				//DRAG MOVE DEL MARKER
				google.maps.event.addListener(marker, 'dragend', (function(marker, i) { 
				return function() {
				Codigo = URLDecode(xml_entidad.getElementsByTagName("cod_interno").item(i).firstChild.data);
				coords =  marker.getPosition();
				cadena_parametros = "Codigo="+Codigo+"&Cordenadas="+coords+"&ventana="+ventana;
				showPopup('popup','¿Esta seguro de mover este punto?','CONFIRM',cadena_parametros,'mapa_sucursales_di','muevepuntos');
				}
				})
				(marker, i));


				//CREAR EVENTO CLICK DEL MARCADOR 
				if(Clickeablepoint==true)
				{
					google.maps.event.addListener(marker, 'click', (function(marker, i){
						return function(){
						latitud_gps = URLDecode(xml_entidad.getElementsByTagName("latitud_gps").item(i).firstChild.data);
						longitud_gps = URLDecode(xml_entidad.getElementsByTagName("longitud_gps").item(i).firstChild.data);
						streetview(latitud_gps,longitud_gps);
						cod_interno = URLDecode(xml_entidad.getElementsByTagName("cod_interno").item(i).firstChild.data); 
						if(Filtro[0]=='Puntos'){
						DatosEnGrilla(cod_interno,Filtro[0]);}
						if(Filtro[1]=='Puntos'){
						DatosEnGrilla(cod_interno,Filtro[1]);}
						}
					})
					(marker, i));
				}
	
		}

	}
 
 
}	



function GuardaPolygon(Event,Capa,Proceso){
var strMsgError='';
var general  = '';

	var cords = document.getElementById('coordenadas').value;
	var largo = document.getElementById('largocords').value;
	var Color = document.getElementById('cbocolordata').value;

		general = document.getElementById('comboboxgeneral').value;
		if (general=='0'){
					strMsgError += '\n\t\t - Debe seleccionar Dato';
			}
			if (Color=='0'){
					strMsgError += '\n\t\t - Debe seleccionar Color';
			}
	
	
		if ( strMsgError != '' ){
		alert( strMsgError );
		return false;
		}
		else
		{
			cadena_parametros ="general="+general+"&Cordenadas="+cords+"&objeto="+Event+"&largo="+largo+"&Capa="+Capa+"&Color="+Color+"&Proceso="+Proceso;
			loadurl_xml('creacion_poligonos.php',cadena_parametros,triggered_mapa_drawing);		
		}
}


function EditaPolygons(cod_interno,cadena_parametros){
hidePopup('popup');
document.getElementById('poligonospuntosedit').value='';
loadurl_xml('creacion_poligonos.php',cadena_parametros,triggered_mapa_drawing);	
}



function muevepuntos(a,b){
hidePopup('popup');
loadurl_xml('cambio_lat_long.php',b,triggered_mapa_Lat_Long);
}


 function closeInfoWindow(){
				filtromapa();
}


function DatosEnGrilla(cod_interno,capa){
//alert(cod_interno+'-'+capa)
var Cadena = document.getElementById('filtrosBK').value;
cadena_parametros = Cadena+"&cod_interno="+cod_interno+"&CapaGeneral="+capa;
loadurl_xml('ConsultaDatosmaps.php',cadena_parametros,triggered_mapa_resultdata);
}


function Ingresarmapa(a,b,c){
$("#"+b).multiselect('select', c);
document.getElementById(a).checked=true;
filtromapa();
}

function limpiacbo(){
var distribuidor =  $('#distribuidor').val();
		var Comuna =  $('#Comunas').val();
		var zonas = $('#Zonas').val();
		var Vendedor = $('#Vendedor').val();
		var Datencion = $('#Datencion').val();
		var Cluster = $('#Cluster').val();
		var Formato = $('#Formato').val();
		var Colores = $('#Colores').val();

if(distribuidor!=null){$("#distribuidor").multiselect('deselect', distribuidor);}
if(Comuna!=null){$("#Comunas").multiselect('deselect', Comuna);}
if(zonas!=null){$("#Zonas").multiselect('deselect', zonas);}
if(Vendedor!=null){$("#Vendedor").multiselect('deselect', Vendedor);}
if(Datencion!=null){$("#Datencion").multiselect('deselect', Datencion);}
if(Cluster!=null){$("#Cluster").multiselect('deselect', Cluster);}
if(Formato!=null){$("#Formato").multiselect('deselect', Formato);}
if(Colores!=null){$("#Colores").multiselect('deselect', Colores);}

}


function limpiar(){

	limpiacbo();
	var Capas=document.getElementsByName('rdo_capas');
	var Filtro=[];
for (x=0;x<Capas.length;x++)
	 {
		if (Capas[x].checked==true)
	      {
			Capas[x].checked=false;
	      }
	 }
	document.getElementById('DataClick').innerHTML="";
	document.getElementById('bibliografia').innerHTML="";
	document.getElementById('bib').style.display="none";	 
document.getElementById("rdo_distribuidor").checked=true;
document.getElementById("rdo_dibujo").checked=false;
document.getElementById("txtLimiteDatos").value=500;
mapaprimario();
}




function Eliminarpoligon(a,b){
cadena_parametros ="Capa="+a+"&Codigo="+b;
loadurl_xml('eliminar_poligonos.php',cadena_parametros,triggered_mapa_delete);		
}


function ValidaCamposCombobox(filtro1,filtro2){

var distribuidor =  $('#distribuidor').val();
		var Comuna =  $('#Comunas').val();
		var zonas = $('#Zonas').val();
		var Vendedor = $('#Vendedor').val();
		var Datencion = $('#Datencion').val();
		var Cluster = $('#Cluster').val();
		var Formato = $('#Formato').val();
		if(distribuidor == null){distribuidor = '';}
		if(Comuna == null){Comuna = '';}
		if(zonas == null){zonas = '';}
		if(Vendedor == null){Vendedor = '';}
		if(Datencion == null){Datencion = '';}
		if(Cluster == null){Cluster = '';}
		if(Formato == null){Formato = '';}

		if(filtro1=='Puntos' || filtro2=='Puntos')
		{
		}else{
				if(filtro1=='Distribuidor'){
					if(Comuna!='' || zonas!='' || Vendedor!='' || Datencion!='' || Cluster!='' || Formato!=''){
						$("#Comunas").multiselect('deselect', Comuna);
						$("#Zonas").multiselect('deselect', zonas);
						$("#Vendedor").multiselect('deselect', Vendedor);
						$("#Datencion").multiselect('deselect', Datencion);
						$("#Cluster").multiselect('deselect', Cluster);
						$("#Formato").multiselect('deselect', Formato);
						//alert('Se ha modificado el filtro');
					}
				}
				
				if(filtro1=='Comunas'){
					if(zonas!='' || Vendedor!='' || Datencion!='' || Cluster!='' || Formato!=''){
						$("#Zonas").multiselect('deselect', zonas);
						$("#Vendedor").multiselect('deselect', Vendedor);
						$("#Datencion").multiselect('deselect', Datencion);
						$("#Cluster").multiselect('deselect', Cluster);
						$("#Formato").multiselect('deselect', Formato);
						//alert('Se ha modificado el filtro');	
					}
				}
				
				if(filtro1=='Zonas'){
					if(distribuidor!='' || Vendedor!='' || Datencion!='' || Cluster!='' || Formato!=''){
						$("#distribuidor").multiselect('deselect', distribuidor);
						$("#Vendedor").multiselect('deselect', Vendedor);
						$("#Datencion").multiselect('deselect', Datencion);
						$("#Cluster").multiselect('deselect', Cluster);
						$("#Formato").multiselect('deselect', Formato);
						//alert('Se ha modificado el filtro');	
					}
				}
			
		}

}


function retornaresult(Data){
var strData=[];
		if(Data[0]=='multiselect-all'){
			lngData = Data.length;
			for(i=1;i<lngData;i++){
				strData.push(Data[i]);
			}
		}
		else{
			strData = Data;
		}
	return 	strData;
}


function muevemapas(Data){
document.getElementById("latgeneral").value=Data;
		var map2 = new google.maps.Map(document.getElementById('map_canvas2'),{
			zoom: 7,
			center:Data,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true,
			scrollwheel: false,
			panControl: false,
			zoomControl: false,
			mapTypeControl: false,
			scaleControl: false,
			streetViewControl: false,
			overviewMapControl: false
		});
		
		lat = document.forms["mapa"].elements["lat"].value;
		long = document.forms["mapa"].elements["long"].value;
		var latlng = new google.maps.LatLng(lat, long);
		var lineSymbol = {
		path: google.maps.SymbolPath.CIRCLE,
		scale: 3,
		strokeColor: '#FF0000'
		};
						
		var marker = new google.maps.Marker({
			position: Data,
			map: map2,
			icon: lineSymbol,
			title:"Mi ubicación!"
		});
		
		
		
}



function streetview(lat,lon){
var latlng = new google.maps.LatLng(lat, lon);
	var panoramaOptions = {
	position: latlng,
	pov: {heading: 34,pitch: 10,}
	};
	var panorama = new  google.maps.StreetViewPanorama(document.getElementById('pano'),panoramaOptions);
	map.setStreetView(panorama);
}



function resumen(cadena_parametros){
	var data = '';
				 datos = cadena_parametros.split('&');
				for (x=1;x<datos.length;x++){
				 //data+='<li>';
					data+='<td>';
					 data+=datos[x];
					data+='</td>/  ';
				 //data+='</li>';			
				}
			
	document.getElementById('resumenmapa').innerHTML=data;
}


function filtroColor(){
	var Capas=document.getElementsByName('rdo_capas');
	var Filtro=[];
for (x=0;x<Capas.length;x++)
	 {
		if (Capas[x].checked==true)
	      {
			Filtro.push(Capas[x].value);
	      }
	 }
	 Filtroln = Filtro.length;
	 if(Filtro[0]=='Puntos' || Filtro[1]=='Puntos'){
		filtromapa();
	 }else{
		if(Filtroln>2){
			
			 alert('Solo debe haber un maximo de 2 selecciones');
		}else{
			alert('Solo puntos sera un filtro de color');
			$("#Colores").multiselect('deselect', $('#Colores').val());
		}
	 }
}


function abrebibliografia(Color){
var colors = new Array("#000000","#FF0000","#0066FF","#FFFFFF", "#CCCCCC", "#CC6666", "#FF9999", "#FF3300", "#CC6633", "#FF6600", "#FF9966", "#663300", "#FFCC99", "#FF9900", "#FFCC00", "#CCFF00", "#99FF00", "#336600", "#003399", "#000066", "#CC00FF", "#CC99CC", "#330033", "#FF00FF", "#FF0099", "#FF0066", "#FF0033");
var signifcolores = new Array("","Almacén","Botillería","Colegio", "Confitería", "Kiosco", "Minimarket", "Estación de servicio", "Tienda de conveniencia", "Agencia", "Bazar", "Cafeteria", "Carro", "Casino", "Ciber", "Distribuidora", "Ferreteria", "Gimnasio", "Librería", "Mayorista", "No Tradicional", "Panadería", "Pastelería", "Restaurant", "Tabaquería", "Universidad", "Verduleria", "", "");
var colors2 = new Array("#000000","#FF0000","#0066FF");
var signifcolores2 = new Array("","Si Tiene","No Tiene");
var data = '';
var colo='';
var html='';
var largo=0;
	if($('#Colores').val()!='0'){
		if(Color=='1'){
			colo = colors2;
			html = signifcolores2;
			largo = colors2.length
		}else if(Color=='2'){
			colo = colors;
			html = signifcolores;
			largo =colors.length
		}
		
		data+='<table style="width:100%">';
	for(x=1;x<largo;x++){
			if(x%2=='1'){
				data+='<tr>';
				}
				
				data+='<td>';
				data+='<input type="text"  style="width:15px;height:15px;border-radius:7px; border-color:'+colo[x]+'; background-Color:'+colo[x]+';" disabled>&nbsp;'+html[x]+'';
				data+='</td>';
			if(x%2=='0'){
				data+='</tr>';
				}
		
	}
	data+='</table>';
	document.getElementById('bibliografia').innerHTML=data;	
	document.getElementById('bib').style.display="block";
	}else{
	document.getElementById('bibliografia').innerHTML="";
	document.getElementById('bib').style.display="none";
	}
}


function openFijo(){

	
	if(document.getElementById('bibliografia').style.display=='block')
	{
		document.getElementById('bibliografia').style.display='none';
		document.getElementById('imagenDespliege').src='../plugins/imagenes/round_add_16x16.png';
	}
	else
	{
		document.getElementById('bibliografia').style.display='block';
		document.getElementById('imagenDespliege').src='../plugins/imagenes/cerrar.png';
	}
}


function MostrarMapa(Diva,Divb,tipo){
	if(tipo=='1'){
	document.getElementById(Diva).style.height ="830px";
	document.getElementById(Divb).style.display="none";
	document.getElementById(Diva).style.display="block";
	
	}else{
	document.getElementById(Diva).style.height ="430px";
		document.getElementById(Divb).style.height ="400px";
		document.getElementById(Diva).style.display="block";
		document.getElementById(Divb).style.display="block";
		

	}
	

		google.maps.event.trigger(map, 'resize');
		google.maps.event.trigger(panorama, 'resize');

}


function verinterior(cod_interno,textbox,combobox){
limpiacbo();
var Capas=document.getElementsByName('rdo_capas');
	var Filtro=[];
for (x=0;x<Capas.length;x++)
	 {
		if (Capas[x].checked==true)
	      {
			Capas[x].checked=false;
	      }
	 }
document.getElementById(textbox).checked=true;
$("#"+combobox).multiselect('select', cod_interno);
filtromapa();
}

function DataMapaporCapa(xml_root){
var xml_entidad = xml_root.firstChild;
var html='';
var pesoprom =0;
var peso =0;
   capa = xml_root.attributes.getNamedItem("capa").nodeValue;
   cant_filas = xml_entidad.attributes.getNamedItem("cant_filas").nodeValue;
    if(capa=='Distribuidor'){

			cod_interno = URLDecode(xml_entidad.getElementsByTagName("cod_interno").item(0).firstChild.data);
			nombre_dist = URLDecode(xml_entidad.getElementsByTagName("nombre_dist").item(0).firstChild.data);
			comunas = URLDecode(xml_entidad.getElementsByTagName("comunas").item(0).firstChild.data);
			puntos = URLDecode(xml_entidad.getElementsByTagName("puntos").item(0).firstChild.data);
			venta = URLDecode(xml_entidad.getElementsByTagName("venta").item(0).firstChild.data);
			ventames = URLDecode(xml_entidad.getElementsByTagName("ventames").item(0).firstChild.data);
			 peso = formatNumber(venta,'$');
			 pesoprom = formatNumber(ventames,'$');
			html +='<div>Distribuidor = <b>'+nombre_dist+'</b></div>'; 
			html +='<div>N° de comunas = <b>'+comunas+'</b>&nbsp;&nbsp;<input type="button" id="verdatainternior" value="Ver" onclick=verinterior("'+cod_interno+'","rdo_comunas","distribuidor");></div>'; 
			html +='<div>N° de puntos = <b>'+puntos+'</b>&nbsp;&nbsp;<input type="button" id="verdatainternior" value="Ver" onclick=verinterior("'+cod_interno+'","rdo_puntos","distribuidor");></div>'; 
			html +='<div>venta promedio 2013 = <b>'+pesoprom+'</b></div>'; 
			html +='<div>venta 2013 = <b>'+peso+'</b></div>';
			
		
	}	
   if(capa=='Comunas'){
		
			cod_interno = URLDecode(xml_entidad.getElementsByTagName("cod_interno").item(0).firstChild.data);
			nombre_comuna = URLDecode(xml_entidad.getElementsByTagName("nombre_comuna").item(0).firstChild.data);
			nombre_region = URLDecode(xml_entidad.getElementsByTagName("nombre_region").item(0).firstChild.data);
			distribuidor = URLDecode(xml_entidad.getElementsByTagName("distribuidor").item(0).firstChild.data);
			zonas = URLDecode(xml_entidad.getElementsByTagName("zonas").item(0).firstChild.data);
			puntos = URLDecode(xml_entidad.getElementsByTagName("puntos").item(0).firstChild.data);
			venta = URLDecode(xml_entidad.getElementsByTagName("venta").item(0).firstChild.data);
			ventames = URLDecode(xml_entidad.getElementsByTagName("ventames").item(0).firstChild.data);
			 peso = formatNumber(venta,'$');
			 pesoprom = formatNumber(ventames,'$');
			html +='<div>Comuna = <b>'+nombre_comuna+'</b></div>'; 
			html +='<div>Región = <b>'+nombre_region+'</b></div>'; 
			html +='<div>Distribuidor = <b>'+distribuidor+'</b></div>'; 
			html +='<div>N° de cuadrantes = <b>'+zonas+'</b>&nbsp;&nbsp;<input type="button" id="verdatainternior" value="Ver" onclick=verinterior("'+cod_interno+'","rdo_zonas","Comunas");></div>'; 
			html +='<div>N° de puntos = <b>'+puntos+'</b>&nbsp;&nbsp;<input type="button" id="verdatainternior" value="Ver" onclick=verinterior("'+cod_interno+'","rdo_puntos","Comunas");></div>'; 
			html +='<div>venta promedio 2013 = <b>'+pesoprom+'</b></div>'; 
			html +='<div>venta 2013 = <b>'+peso+'</b></div>'; 			
		
	}	
	if(capa=='Zonas'){
			cod_interno = URLDecode(xml_entidad.getElementsByTagName("cod_interno").item(0).firstChild.data);
			nombre_comuna = URLDecode(xml_entidad.getElementsByTagName("nombre_comuna").item(0).firstChild.data);
			nombre_zona = URLDecode(xml_entidad.getElementsByTagName("nombre_zona").item(0).firstChild.data);
			puntos = URLDecode(xml_entidad.getElementsByTagName("puntos").item(0).firstChild.data);
			venta = URLDecode(xml_entidad.getElementsByTagName("venta").item(0).firstChild.data);
			ventames = URLDecode(xml_entidad.getElementsByTagName("ventames").item(0).firstChild.data);
			 pesoprom = formatNumber(ventames,'$');
			 peso = formatNumber(venta,'$');
			html +='<div>Cuadrante = <b>'+nombre_zona+'</b></div>'; 
			html +='<div>Comuna = <b>'+nombre_comuna+'</b></div>'; 
			html +='<div>N° de puntos = <b>'+puntos+'</b>&nbsp;&nbsp;<input type="button" id="verdatainternior" value="Ver" onclick=verinterior("'+cod_interno+'","rdo_puntos","Zonas");>';
			html +='&nbsp;&nbsp;<input type="button" id="verdatainternior" value="xls" onclick=exportarpuntos("'+cod_interno+'","Zonas");>';
			html +='</div></div>'; 
			html +='<div>venta promedio 2013 = <b>'+pesoprom+'</b></div>'; 
			html +='<div>venta 2013 = <b>'+peso+'</b></div>'; 
	}
	if(capa=='Puntos'){
			cod_interno = URLDecode(xml_entidad.getElementsByTagName("cod_interno").item(0).firstChild.data);
			codigo_local = URLDecode(xml_entidad.getElementsByTagName("codigo_local").item(0).firstChild.data);
			sucursal = URLDecode(xml_entidad.getElementsByTagName("sucursal").item(0).firstChild.data);
			direccion = URLDecode(xml_entidad.getElementsByTagName("direccion").item(0).firstChild.data);
			distribuidor = URLDecode(xml_entidad.getElementsByTagName("distribuidor").item(0).firstChild.data);
			nombre_comuna = URLDecode(xml_entidad.getElementsByTagName("nombre_comuna").item(0).firstChild.data);
			mueble = URLDecode(xml_entidad.getElementsByTagName("mueble").item(0).firstChild.data);
			nombre_formato = URLDecode(xml_entidad.getElementsByTagName("nombre_formato").item(0).firstChild.data);
			diavisita = URLDecode(xml_entidad.getElementsByTagName("diavisita").item(0).firstChild.data);
			nombre_zona = URLDecode(xml_entidad.getElementsByTagName("nombre_zona").item(0).firstChild.data);
			venta = URLDecode(xml_entidad.getElementsByTagName("venta").item(0).firstChild.data);
			ventames = URLDecode(xml_entidad.getElementsByTagName("ventames").item(0).firstChild.data);
			pesoprom = formatNumber(ventames,'$');
			peso = formatNumber(venta,'$');
			html +='<div>Código local = <b>'+codigo_local+'</b></div>'; 
			html +='<div>Nombre = <b>'+sucursal+'</b></div>'; 
			html +='<div>Direccion = <b>'+direccion+'</b></div>'; 
			html +='<div>Comuna = <b>'+nombre_comuna+'</b></div>'; 
			html +='<div>Cuadrante = <b>'+nombre_zona+'</b></div>'; 
			html +='<div>Mueble = <b>'+mueble+'</b></div>'; 
			html +='<div>Formato = <b>'+nombre_formato+'</b></div>'; 
			html +='<div>Día visita = <b>'+diavisita+'</b></div>'; 
			html +='<div>venta promedio 2013 = <b>'+pesoprom+'</b></div>'; 
			html +='<div>venta 2013 = <b>'+peso+'</b></div>'; 
	}
	if(document.getElementById('rdo_dibujo').checked==true){
		if(capa!='Puntos'){
			html +='<input type="button" id="deletepoligon" value="Eliminar" onclick=Eliminarpoligon("'+capa+'","'+cod_interno+'");>';
		}	
	}
   document.getElementById('DataClick').innerHTML=html;
}

function exportarpuntos(cod_interno,capa){
cadena_parametros = "Codigo="+cod_interno+"&capa="+capa;
showPopup('popup','¿Esta seguro de exportar?','CONFIRM',cadena_parametros,'mapa_sucursales_di','exportardata_di');	
}

function exportardata_di(a,b){
loadurl_xml('descargapuntos.php',b,triggered_mapa_descarga_data);
showPopup('popup','Cargando...','SAVE','','mapa_sucursales_di');
}

function formatNumber(num,prefix){
prefix = prefix || '';
num += '';
var splitStr = num.split('.');
var splitLeft = splitStr[0];
var splitRight = splitStr.length > 1 ? '.' + splitStr[1] : '';
var regx = /(\d+)(\d{3})/;
while (regx.test(splitLeft)) {
splitLeft = splitLeft.replace(regx, '$1' + ',' + '$2');
}
return prefix + splitLeft + splitRight;
}

function unformatNumber(num) {
return num.replace(/([^0-9\.\-])/g,'')*1;
}