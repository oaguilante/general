//INDICE DE FUNCIONES

//AJAX

//00. abort_ajax
//01. loadurl_xml(url_destino,cadena_parametros,handler) => enviar al servidor
//02. triggered_xml
//03. triggered_local_caja_xml
//04. triggered_select_xml

//POR ASIGNAR

//05. triggered_mapa_xml
//06. aaa
//07. triggered_lista_xml2
//08. triggered_lista_xml
//09. RellenaPopup
//10. triggered_xml2
//11. ResponseFoto
//12. sincronizaimg
//13. deleteImg
//14. triggered_xml_cerrado
//15. FiltroMapa
//16. triggered_mapa_Lat_Long
//17. triggered_mapa_xml2
//18. triggered_mapa_xml3
//19. triggered_mapa_drawing
//20. triggered_mapa_delete
//21. triggered_mapa_descarga_data
//22. triggered_mapa_resultdata

//24. triggered_xml_graficos
//25. triggered_georef_xml
//26. triggered_sincronizacion_tablas
//27. triggered_grafico_di_xml

//23. triggered_html
//28. triggered_html1

//00.///////////////////////////////////////////////////////////////////////////////////////////////
//AJAX: abortar petición ajax
//06.04.2014 GPS

function abort_ajax(){

  XMLHttpRequestObject.abort();
  
  if(document.forms["ventanaForm"].elements["nativa"].value==true){
    ocultar_loader();
  }
  
  alert("Hubo un problema en la conexión (Timeout)");
  
  //CASO PARTICULAR MULTICAJA: si se intenta georeferenciar direccion y no hay conexion, poner una marca para que permita guardar offline.
  if(document.forms["ventanaForm"].elements["ventana"].value=="informe_potencial_cliente"){
    document.forms["potencial_clienteForm"].elements["lat_direccion"].value = "0";
    document.forms["potencial_clienteForm"].elements["lon_direccion"].value = "0";	
  }
  
  //ACTIVAR EL BOTON GUARDAR
  if(document.forms["ventanaForm"].elements["nativa"].value==true){
   	  $('#boton_guardar').button("enable");
  }
}

//00.///////////////////////////////////////////////////////////////////////////////////////////////

//01.///////////////////////////////////////////////////////////////////////////////////////////////
//AJAX: enviar datos al servidor usando ajax
//06.04.2014 GPS

function loadurl_xml(_url_destino,_cadena_parametros,_handler,_mensaje_loading) {
  
  //alert(_cadena_parametros);

  //SIEMPRE DEBE EXISTIR ventanaForm EN LA VENTANA
  _ventana = document.forms["ventanaForm"].elements["ventana"].value;
  _nativa = document.forms["ventanaForm"].elements["nativa"].value;
  
  //ESTA VARIABLE DESPUES SE ACCEDE DESDE LOS TRIGGERED (OJO AL CAMBIAR EL NOMBRE)
  mobile = document.forms["ventanaForm"].elements["mobile"].value;
  //REVISAR SI ES PHONEGAP O NO
    _url_servidor = window.localStorage.url_servidor;
    
  //ACCESO A LOGICA CENTRALIZADA (archivo PageLogicPHP.php)
  if(_url_destino=="PageLogicPHP.php"){
    
    if(_url_servidor!=undefined && _url_servidor!=""){
    _url_destino = "http://"+_url_servidor+"/aplicacion/InteractionLogic/"+_url_destino;    
    }else{
	_url_destino = "InteractionLogic/"+_url_destino;
    }
  }else if(_url_destino=="cronjob.php")
	_url_destino = "BusinessLogic/cron/"+_url_destino;
  else if(_url_destino=="action_buscar_sucursales.php" || _url_destino=="action_listar_sucursales.php" || _url_destino=="action_latitud.php" || _url_destino=="cambio_lat_long.php" || _url_destino=="localcerrado.php"){
	
	
	
	//_url_destino = "BusinessLogic/mapa/"+_url_destino;	
	
	
	
	 
	
	//_url_servidor = "192.168.1.183/angular";
    
	//SI ES PHONEGAP
	if(_url_servidor!=undefined && _url_servidor!=""){
	  _url_destino = "http://"+_url_servidor+"/aplicacion/BusinessLogic/mapa/"+_url_destino;
	}
    //SI NO ES PHONEGAP
	else{
	  _url_destino = "BusinessLogic/mapa/"+_url_destino;
	}
	
	
	//alert(_url_destino);
	
	
	
	
  }
  else if(_url_destino=="interaccion_mapa.php" || _url_destino=="eliminar_poligonos.php" || _url_destino=="descargapuntos.php" || _url_destino=="creacion_poligonos.php" || _url_destino=="ConsultaDatosmaps.php" || _url_destino=="Graficos_mapa_di.php")
	_url_destino = "BusinessLogic/mapa_di/"+_url_destino;	
  else if(_url_destino=="action_activar_proyecto.php" || _url_destino=="action_enviar_mail.php" || _url_destino=="action_kpi_copec.php")
	_url_destino = "BusinessLogic/proyectos/"+_url_destino;
  else if(_url_destino=="galeriaimagenes.php" || _url_destino=="Grilla_sucursales_galeriaimagenes.php")
	_url_destino = "BusinessLogic/galeria_imagenes/"+_url_destino;
  //ACCESO A LOGICA PARTICULAR (ubicada en carpeta BusinessLogic) - parámetro "action" en BD
  else{
  
    //REVISAR SI ES PHONEGAP O NO
    _url_servidor = window.localStorage.url_servidor;
    
	//SI ES PHONEGAP
	if(_url_servidor!=undefined && _url_servidor!=""){
	  _url_destino = "http://"+_url_servidor+"/aplicacion/BusinessLogic/"+_url_destino;
	}
    //SI NO ES PHONEGAP
	else{
	  _url_destino = "BusinessLogic/"+_url_destino;
	}
	
  }
 
  //ESTA FUNCION create_XMLHttpRequestObject() NO SE DEBE OBFUSCAR 
  XMLHttpRequestObject = create_XMLHttpRequestObject();

  XMLHttpRequestObject.onreadystatechange = _handler;
  XMLHttpRequestObject.open("POST",_url_destino,true);
  XMLHttpRequestObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  //alert(_url_destino+"?"+_cadena_parametros);
  
  if(_ventana=="ficha_configuracion"){
    //GUARDAR URL USANDO LOCALSTORAGE EN EL MOVIL
	window.localStorage.url_servidor = document.forms["configuracionForm"].elements["url"].value;
	
	$('#boton_guardar').button("enable");
	ocultar_loader();
	
	_mensaje = "¡Nuevo registro guardado con éxito!";
	alert(URLDecode(_mensaje));
	
  }
  else{
    //TODOS LOS DEMAS CASOS
	XMLHttpRequestObject.send(_cadena_parametros);
  }
  
  if(_ventana=="mapa_sucursales" || _ventana=="mapa_latitud" || _ventana=="lista_sucursales" || _ventana=="mapa_sucursales_di"){
    
	if(_ventana=="mapa_sucursales_di"){
	  showPopup('popup','Cargando...','SAVE','','cargadorForm');
	}
	
    if(_nativa==true){
	  mostrar_loader("Cargando");
	}
	
  }
  else{
	
	if(mobile=="true" && _ventana!='ficha_galeria_imagenes'){
	
	  if(_mensaje_loading==undefined){
	    _mensaje_loading = "";
	  }
	  
	  if(_mensaje_loading!=""){
 	    mostrar_loader(_mensaje_loading);
	  }
	  
	  //DEFINIR TIMEOUT DE 15 SEGUNDOS PARA LA RESPUESTA AJAX
	  myVar=setTimeout(function(){abort_ajax()},15000);
	}
	
  }
  
}

//01.///////////////////////////////////////////////////////////////////////////////////////////////

//02.///////////////////////////////////////////////////////////////////////////////////////////////
//AJAX: dibujar en pantalla datos usando ajax
//06.04.2014 GPS

function triggered_xml() {

  //EN CASO DE ERROR 404
  if(XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==404){
  
    //NO EJECUTAR TIMEOUT SI LLEGA LA RESPUESTA AJAX
	if(mobile=="true"){
      clearTimeout(myVar);
	}
	
	//OCULTAR LOADER
	if(document.forms["ventanaForm"].elements["nativa"].value==true){
	  ocultar_loader();
	}
	
	//MOSTRAR EL MENSAJE DE ERROR
    _alert_box_type = document.forms["ventanaForm"].elements["alert_box_type"].value;
	_mensaje = "Hubo un problema en la conexión (Error 404)";
	 
    //ALERT COMO VENTANA
	if(_alert_box_type==0 || document.forms["ventanaForm"].elements["nativa"].value==true)
      alert(URLDecode(_mensaje));
    //ALERT COMO DIV CON FONDO NEGRO
    else if(_alert_box_type==1)     
      showPopup('popup',URLDecode(_mensaje),'ALERT','','','');

	if(document.forms["ventanaForm"].elements["nativa"].value==true){
   	  $('#boton_guardar').button("enable");
	}
	
  }
  
  //SI LA RESPUESTA ES CORRECTA
  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {

	//NO EJECUTAR TIMEOUT SI LLEGA LA RESPUESTA AJAX
	if(mobile=="true"){
      clearTimeout(myVar);
    }
	
	//OCULTAR LOADER
	if(document.forms["ventanaForm"].elements["nativa"].value==true){
      ocultar_loader();
	  //PRIMERA CLASE QUITA EL COLOR AZUL DEL BOTON Y LA SEGUNDA QUITA EL BORDE DEL FOCO 
      $(".ui-btn-active").removeClass('ui-btn-active ui-focus');
	  $('#boton_guardar').button("enable");
	}
   
    var _xml_data = XMLHttpRequestObject.responseXML;
    var _text_data = XMLHttpRequestObject.responseText;

	//alert(_text_data);
	//alert(_xml_data);
	if(_text_data=="SESION_EXPIRADA") {
	  var _a=window.localStorage.getItem('ultima_aplicacion');
	  var _host =document.forms["ventanaForm"].elements["host"].value;
	  var _url = 'http://'+_host+'/login.php?a='+_a;
	  alert('Su sesi\xf3n ha expirado');
	  document.location.href=_url;
	}
    else if(_text_data!="") {

      var _xml_root = _xml_data.documentElement;
	 
      //CARGAR PARAMETROS GENERALES DEL XML
      existe_ficha = _xml_root.attributes.getNamedItem("existe_ficha").nodeValue;
      mensaje = _xml_root.attributes.getNamedItem("mensaje").nodeValue;
	  codigo_respuesta = _xml_root.attributes.getNamedItem("codigo_respuesta").nodeValue;
      sql = _xml_root.attributes.getNamedItem("sql").nodeValue;
      accion = _xml_root.attributes.getNamedItem("accion").nodeValue;
      scrollx = _xml_root.attributes.getNamedItem("scrollx").nodeValue;
      scrolly = _xml_root.attributes.getNamedItem("scrolly").nodeValue;  
	  
	  //CANTIDAD DE ENTIDADES EN SIEMPRE 1 EXCEPTO EN CASO DE FICHA_MERCADERISTA QUE ES 2
	  cant_entidades = _xml_root.attributes.getNamedItem("cant_entidades").nodeValue;  
    
      //LOG SQL PARA DEBUG
      log_sql = URLDecode(_xml_root.attributes.getNamedItem("log_sql").nodeValue);
      log_sql_array = log_sql.split("^");
      cant_log_sql_array = log_sql_array.length;

      log = "LOG SQL: \r\r"+URLDecode(log_sql_array[0]);

	  //alert(log);
	  //alert(existe_ficha);
	  
      //SI SE ENVIAN (DESDE EL SERVIDOR) DATOS PARA PONER EN LA PANTALLA
      if(existe_ficha=="true") {

        //alert("EXISTE FICHA: "+accion);
		for(l=0;l<cant_entidades;l++){
		
		//CARGAR PARAMETROS DE LA ENTIDAD
		if(l==0)
          var xml_entidad = _xml_root.firstChild;
		else if(l==1)
		  var xml_entidad = _xml_root.lastChild;
		
	
        entidad = xml_entidad.attributes.getNamedItem("entidad").nodeValue;
        formulario = xml_entidad.attributes.getNamedItem("formulario").nodeValue;
        id_fila = xml_entidad.attributes.getNamedItem("id_fila").nodeValue;
        cant_filas = xml_entidad.attributes.getNamedItem("cant_filas").nodeValue;
    
        ventana = document.forms[formulario].var_ventana.value;
        metadata = document.forms[formulario].var_metadata.value.split("^");
        desde_bd = document.forms[formulario].var_desde_bd.value.split("^");
        tipo_estructura = document.forms[formulario].var_tipo_estructura.value.split("^");
        formato_visual = document.forms[formulario].var_formato_visual.value.split("^");
        tipo = document.forms[formulario].var_tipo.value.split("^");
        tipo_uso_formulario = document.forms[formulario].var_tipo_uso_formulario.value;
		
		
		//GENERALIZAR: PARA CARGAR LA SEGUNDA ENTIDAD EN FICHA_MERCADERISTA (el tipo de uso formulario actualmente esta a nivel de ventana, por lo que no es posible diferenciarlo anivel de entidad, repensar...)
		if(ventana=="ficha_mercaderista" && formulario=="grid_sala_mercaderistaForm")
		  tipo_uso_formulario = "lista datos transaccion";
		
		
        key_id = document.forms[formulario].var_key_id.value;
        mostrar_cant_registros = document.forms[formulario].var_mostrar_cant_registros_grid.value;
        paginar = document.forms[formulario].var_paginar.value;
        blanco_al_guardar = document.forms["ventanaForm"].blanco_al_guardar.value;
		nativa = document.forms["ventanaForm"].nativa.value;
	  
	    document.forms[formulario].var_existe.value = existe_ficha;

		//alert(tipo_uso_formulario);
		
        //DEJAR EL GRID EN BLANCO ANTES DE CARGAR NUEVOS DATOS EN EL, SOLO SI ES UNA LISTA
        if(tipo_uso_formulario=="lista datos ficha" || tipo_uso_formulario=="lista datos transaccion" || tipo_uso_formulario=="reporte") {

		  //alert(entidad);
          var rows = document.getElementById(entidad).rows;
 
          while (rows.length > 2 ) {
            var mytr = rows[2];
            mytr.parentNode.removeChild(mytr);
          }

		  //alert("OK3");
		  
          //GENERALIZAR ESTO COPEC PROYECTOS!!
          if(ventana=="lista_permiso_rol")
            document.forms[formulario].elements["habilitado0"].checked = false;

          document.forms[formulario].var_fila_actual.value = 1;

        }
        ////////
		
	    
	
        //SI SE USA: PERMITE GUARDAR LOS CAMPOS QUE SE BUSCARON EN EL FILTRO, PARA DESPUES PODER UTILIZAR EL PAGINADOR CON LOS MISMOS DATOS (SOLO SI LA CONSULTA DEVUELVE INFO)
        if(document.forms[formulario].elements["var_form_grid_filtro"].value!=""){
		  
		  a = document.forms[formulario].elements["var_form_grid_filtro"].value;
		  
          if(document.forms[a].var_tipo_estructura.value=="filtro" || document.forms[a].var_tipo_estructura.value=="3"){
			document.forms[formulario].var_cadena_valores_filtro.value = _cadena_valores;
		  }
		   
        }
        ////////

		//alert(cant_filas);
		
        //POBLAR DATOS EN LA PANTALLA
        for(s=0;s<cant_filas;s++) {

		  //alert(metadata.length);
		
          for(j=0;j<metadata.length;j++) {
		  
		      //alert(desde_bd[j]);
		  
              if(desde_bd[j]=="s") {
			  
			    //alert("CAMPO: "+metadata[j]);

                //SI HAY UN ELEMENTO EN EL NODO
                if(xml_entidad.getElementsByTagName(metadata[j]).item(s).childNodes.length) {

				  //alert(tipo_uso_formulario);
				
                  //SI ENTIDAD ES GRID CON DATOS, GUARDAR ID_FILA
                  if(tipo_uso_formulario=="lista datos ficha" || tipo_uso_formulario=="lista datos transaccion" || tipo_uso_formulario=="reporte"){
                    id_fila = s;
                  }
				  
                    //FORMATEAR LOS VALORES ANTES DE PONERLOS EN PANTALLA (ESTO DEBE HACERSE EN SERVER)

                    //PARA DIBUJAR LAS FECHAS EN EL FORMATO QUE SE PRESENTAN EN PANTALLA Y NO MYSQL (ESTO DEBE VENIR OK DESDE SERVER)
                    if(formato_visual[j]=="fecha") {
			          if(URLDecode(xml_entidad.getElementsByTagName(metadata[j]).item(s).firstChild.data)=="0000-00-00")
				        document.forms[formulario].elements[metadata[j]+id_fila].value = "";
				      else
                        document.forms[formulario].elements[metadata[j]+id_fila].value = fecha_mysql_a_string(URLDecode(xml_entidad.getElementsByTagName(metadata[j]).item(s).firstChild.data));             
                    }
                    //PARA DIBUJAR LOS VALORES DEL TIPO MONEDA
                    else if(formato_visual[j]=="moneda" && URLDecode(xml_entidad.getElementsByTagName(metadata[j]).item(s).firstChild.data)!="")
                      document.forms[formulario].elements[metadata[j]+id_fila].value = entero_a_dinero(URLDecode(xml_entidad.getElementsByTagName(metadata[j]).item(s).firstChild.data));
                    //PARA DIBUJAR LOS VALORES DEL TIPO TIMESTAMP
                    else if(formato_visual[j]=="timestamp" && URLDecode(xml_entidad.getElementsByTagName(metadata[j]).item(s).firstChild.data)!="")
                     document.forms[formulario].elements[metadata[j]+id_fila].value = timestamp_mysql_a_timestamp_chile(URLDecode(xml_entidad.getElementsByTagName(metadata[j]).item(s).firstChild.data));             
                    //PARA DIBUJAR LOS VALORES DEL TIPO HORA
				    else if(formato_visual[j]=="hora" && URLDecode(xml_entidad.getElementsByTagName(metadata[j]).item(s).firstChild.data)!="")
                     document.forms[formulario].elements[metadata[j]+id_fila].value = timestamp_mysql_a_hora_chile(URLDecode(xml_entidad.getElementsByTagName(metadata[j]).item(s).firstChild.data));             
                    ////////
					
                //SI NO HAY UN ELEMENTO EN EL NODO
                else {

                  //PARA PONER EL PRECIO DE LIQUIDACION EN PANTALLA 
                  if(ventana=="boleta" && metadata[j]=="venta") {

                    aa = URLDecode(xml_entidad.getElementsByTagName(metadata[j]).item(s).firstChild.data);
                    pos = aa.search("@") + 1;

                    if(pos>0) {
                      bb = aa.substr(pos,aa.length-pos);
                      document.forms[formulario].elements[metadata[j]+id_fila].value = bb;

                      //PINTAR CELDAS DE AMARILLO CUANDO ES LIQUIDACION
                      document.forms[formulario].elements[metadata[j-4]+id_fila].style.background = "FFFFCC";
                      document.forms[formulario].elements[metadata[j-3]+id_fila].style.background = "FFFFCC";
                      document.forms[formulario].elements[metadata[j-2]+id_fila].style.background = "FFFFCC";
                      document.forms[formulario].elements[metadata[j-1]+id_fila].style.background = "FFFFCC";
                      document.forms[formulario].elements[metadata[j]+id_fila].style.background = "FFFFCC";
                      document.forms[formulario].elements[metadata[j+2]+id_fila].style.background = "FFFFCC";
                    }
                    else {
                      document.forms[formulario].elements[metadata[j]+id_fila].value = aa;
                    }

                  }
                  else {

                    //alert("OK3");

					
					
                    //alert(tipo[j]+metadata[j]+id_fila+URLDecode(xml_entidad.getElementsByTagName(metadata[j]).item(s).firstChild.data));

                    //SOLO SI EL CAMPO ES DE TIPO LINK, CAMBIAR EL VALOR VISUAL DEL LINK TAMBIEN
                    if(tipo[j]=="link") {
				  
				      if(ventana=="lista_proyecto") {
				        padre = ventana;
					    id_proyecto = document.forms[formulario].elements["id_proyecto"+id_fila].value;
					    adicional = "&padre="+padre+"&id_proyecto="+id_proyecto;
                      }
					  else
					    adicional = "";
					
                      document.getElementById("link_"+metadata[j]+id_fila).innerHTML = "<a href='../aplicacion/window.php?ventana=detalle_proyecto"+adicional+"'>"+URLDecode(xml_entidad.getElementsByTagName(metadata[j]).item(s).firstChild.data)+"</a>";
                    }
					else if(tipo[j]=="lista" || tipo[j]=="6") {
					
                    }
					
					
					
                   

				  
				  
				  
				  
				  //alert(tipo[j]);
				  
                  if(tipo[j]=="input_list" || tipo[j]=="select_list") {
                    list = metadata[j];
 
                    options = URLDecode(xml_entidad.getElementsByTagName(metadata[j]).item(s).firstChild.data);
                    options_array = options.split(",");

					//POBLAR LA LISTA CON LAS OPCIONES QUE VIENEN DE LA BD
                    for(m=0;m<options_array.length;m++) {
				      //new Option([text], [value], [defaultSelected], [selected])
					  //document.forms[formulario].elements[list].add(new Option(options_array[m], "0"), null); 
					  
					  optionindex_a = options_array[m];
					  
					  //alert(options_array[m]);
					  
					  if(tipo[j]=="input_list" ) {
					    document.forms[formulario].elements[list].add(new Option(options_array[m], options_array[m]), null); 
					  }
					  else if(tipo[j]=="select_list") {
					    input_a = "tareas_predecesoras";
                        document.forms[formulario].elements[list].add(new Option(document.forms[formulario].elements[input_a].options[optionindex_a].text, options_array[m]), null); 
                      }
      				}
            	  }
                  else {
				  
				    
				  
				    //PARA ASIGNAR VALOR A LA MAYORIA DE LOS CASOS (IMPORTANTE!!!)
					
					
					
					
					document.forms[formulario].elements[metadata[j]+id_fila].value = URLDecode(xml_entidad.getElementsByTagName(metadata[j]).item(s).firstChild.data);
                
				    //PARA SELECT EN JQUERY MOBILE
					if(nativa==true){
					  if(tipo[j]=="select"){
					    if(xml_entidad.getElementsByTagName(metadata[j]).item(s).firstChild.data!="" && xml_entidad.getElementsByTagName(metadata[j]).item(s).firstChild.data!="0"){
					      campo = "select#"+metadata[j];
					      var myselect = $(campo);
                          myselect[0].selectedValue = 3;
                          myselect.selectmenu("refresh");
					    }
				      }
				    }
					
                  }

					
					
					
					
					
					
					
					
					
					
					
					
                  //document.forms[formulario].elements[metadata_a[j]+id_fila].value = URLDecode(xml_entidad.getElementsByTagName(metadata[j]).item(s).firstChild.data);
                  //alert("OK5");

                }

              }


			  
			  
			  
			  
			  
              //PARA LOS CHECKBOX (SI DIESE PROBLEMAS, AGREGAR QUE USE ESTE CODIGO SOLO CUANDO EL TIPO DEL CAMPO SEA CHECKBOX Y NO SIEMPRE)
              if(tipo_uso_formulario!="reporte") {

                //alert(document.forms[formulario].elements[metadata[j]+id_fila].value);

                if(document.forms[formulario].elements[metadata[j]+id_fila].value=="1")
                  document.forms[formulario].elements[metadata[j]+id_fila].checked = true;
                else if(document.forms[formulario].elements[metadata[j]+id_fila].value=="0")
                  document.forms[formulario].elements[metadata[j]+id_fila].checked = false;
              }

			  
			  
			  
			  
			  
			  
            }

            //SI NO HAY UN ELEMENTO EN EL NODO
            else {
			  if(tipo[j]!="lista" && tipo[j]!="6") 
                document.forms[formulario].elements[metadata[j]+id_fila].value = "";
            }

          }

        //FIN COLUMNAS
        }



		//alert(tipo_uso_formulario);
		

        //ESTE CICLO DEBERIA ESTAR DENTRO DEL SIGUIENTE
        //SI ES UN GRID QUE MUESTRA DATOS
        if(tipo_uso_formulario=="lista datos ficha" || tipo_uso_formulario=="lista datos transaccion" || tipo_uso_formulario=="reporte") {



          //SI NO ES LA ULTIMA FILA
          if(s!=cant_filas-1) {
            //alert("ADDROW");
            addrow(entidad, 'add', document.forms[formulario].var_accion_jscript.value,document.forms[formulario].var_modo.value,document.forms[formulario].var_edit_row.value,document.forms[formulario].var_del_row.value,"col_cantidad","col_monto","col_descuento","col_total","cols_id",document.forms[formulario].var_key_id.value,formulario,document.forms[formulario].var_id_first_key_id.value,document.forms[formulario].var_tipo.value);
          }
          else if(tipo_uso_formulario!="reporte" || tipo_uso_formulario!=4) {



		  
            if(mostrar_cant_registros=="S" || mostrar_cant_registros==1) {

			
              //POBLAR EL INDICADOR DE REGISTROS ACTUALMENTE EN PANTALLA Y EL PAGINADOR (SOLO SI MOSTRAR_CANT_REGISTROS_GRID ESTA ACTIVADA)
			  if(ventana=="ficha_mercaderista")
			    //SE DEVUELVE EL TOTAL EN LA SEGUNDA ENTIDAD (HAY UNA FICHA Y UN GRID)
			    //cant_total_registros = _xml_root.attributes.getNamedItem("cant_total_registros1").nodeValue;
				cant_total_registros = cant_filas;
			  else
			    //SE DEVUELVE EL TOTAL EN LA PRIMERA ENTIDAD (HAY UN FILTRO Y UN GRID)
                cant_total_registros = _xml_root.attributes.getNamedItem("cant_total_registros").nodeValue;
			  
		
              if(paginar=="S") {
                pagina = document.forms["paginadorForm"].elements["paginas"].value;
                cant_registros_pagina = parseInt(document.forms["paginadorForm"].elements["cant_registros_pagina"].value);
              }
              else { 
                pagina = 1;
                cant_registros_pagina = 10000;
              }

		      //CALCULAR NUMERO DEL REGISTRO INICIAL QUE SE VA A MOSTRAR EN LA PAGINA
              if(cant_total_registros<=cant_registros_pagina)
                registro_inicial = 1;
              else
                registro_inicial = (pagina-1) * cant_registros_pagina + 1;
				
			  //CALCULAR NUMERO DEL REGISTRO FINAL QUE SE VA A MOSTRAR EN LA PAGINA
              if(pagina*cant_registros_pagina > cant_total_registros)
                registro_final = cant_total_registros
              else
                registro_final = pagina*cant_filas;

              document.getElementById("cuenta_resultados").innerHTML = "<font face='Arial' size='2'><SUP>&nbspMostrando&nbspregistros&nbsp"+number_format(registro_inicial, 0, ",", ".")+"&nbspal&nbsp"+number_format(registro_final, 0, ",", ".")+"&nbspde&nbspun&nbsptotal&nbspde&nbsp"+number_format(cant_total_registros, 0, ",", ".")+"</SUP></font>";
 
            }
        

            if(paginar=="S") {

              //AGREGAR NUMEROS DE PAGINA AL SELECT DEL PAGINADOR
              if(registro_inicial==1) {
                document.forms["paginadorForm"].elements["paginas"].length=0;

                for(i=0;i<Math.ceil(cant_total_registros/registro_final);i++)
                  addOption(document.forms["paginadorForm"].elements["paginas"],i+1,i+1); 

              }

            }



          }

        }

      //FIN FILAS
      }
    

      //alert("OK3");
      scroll_pantalla(scrollx,scrolly);



		//TIPO USO FORMULARIO ESTA PARA LA LISTA DE PROVEEDORES, QUIZA PARA LISTAS CON TOTALES HAYA QUE CAMBIARLO
      if(tipo_estructura=="grid" && tipo_uso_formulario!="lista datos ficha" && tipo_uso_formulario!="lista datos transaccion" && tipo_uso_formulario!="reporte") {

        //NO SE CALCULA ESTO EN LA LIQUIDACION NI EN ORDEN DE COMPRA NI EN RECETA, PUES NO INCLUYEN TOTALES. PONERLOS COMO PARAMETRO PARA VER SI SE CALCULAN O NO (SOLO NICOLE).
        //if(ventana!="liquidacion" && ventana!="ver_liquidacion" && ventana!="orden_produccion" && ventana!="recetas" && ventana!="ingresar_cargo") {
 	      //calcular_total_fila(formulario,id_fila); 
          //calcular_total_grid(formulario);
          //calcular_vuelto(formulario); 
        //}

        //SOLO AGREGAR UNA FILA SI ACTUALMENTE ESTOY EN LA ULTIMA FILA
        if(parseInt(id_fila) + 1== document.forms[formulario].var_fila_actual.value) {


          entidad = document.forms[formulario].var_entidad.value.split("^");
          addrow(entidad, 'add', document.forms[formulario].var_accion_jscript.value,document.forms[formulario].var_modo.value,document.forms[formulario].var_edit_row.value,document.forms[formulario].var_del_row.value,"col_cantidad","col_monto","col_descuento","col_total","cols_id",document.forms[formulario].var_key_id.value,formulario,document.forms[formulario].var_id_first_key_id.value,document.forms[formulario].var_tipo.value);
 


         key_id_array = string_to_array(key_id,",");
          //AL AGREGAR UNA FILA AL GRID PONER EL FOCO EN EL PRIMER CAMPO KEY_ID 
          //document.forms[formulario].elements[key_id_array[0]+parseInt(parseInt(id_fila)+1)].focus();
        }

      }




      //alert("OK4");






      //PARA DESACTIVAR CAMPOS EN LAS FICHAS CUANDO SI SE DEVUELVEN DATOS
      //<JasobNoObfsJSStr>
      if(tipo_estructura!="grid" && tipo_estructura!="4" && (tipo_uso_formulario=="datos maestros" || tipo_uso_formulario=="1")) {
      //</JasobNoObfsJSStr>

	    //alert(accion);
	  
        if(accion=="boton_eliminar_borrar"){
          activarDesactivarCamposId(formulario,"ACTIVAR"); 
		}
        else if(accion=="boton_buscar" || accion=="key_buscar" || accion=="boton_guardar"){
		  if(ventana!="soporte")
            activarDesactivarCamposId(formulario,"DESACTIVAR"); 
		}
	}



    //alert(mensaje);

      //MENSAJE CUANDO SE DEVUELVEN DATOS AL CLIENTE
      if(mensaje!=""){
	  
	    //MOSTRAR EL MENSAJE DEVUELTO POR EL SERVER
        alert_box_type = document.forms["ventanaForm"].elements["alert_box_type"].value;
       
        //ALERT COMO VENTANA
		if(alert_box_type==0 || nativa==true){
          alert(URLDecode(mensaje));
		  //LUEGO DE MOSTRAR EL MENSAJE, VOLVER A LA VENTANA ANTERIOR
		  if(ventana=="ficha_tarea_cerrar")
		    window.history.back();
		}
        //ALERT COMO DIV CON FONDO NEGRO
        else if(alert_box_type==1){
          showPopup('popup',URLDecode(mensaje),'ALERT','','',codigo_respuesta);
			
				
	    }
	  
      }



	  
	  
	  //BORRAR MONTO, MEDIO DE PAGO (los que no tienen un valor default) Y ACTUALIZAR FOLIO
	  
	  
	  
	  
	  
	 
	  
	  //SI ESTA ACTIVADA LA OPCION BLANCO AL GUARDAR DEJAR LA FICHA EN BLANCO (ESTA SE USA EN BOLETA VENTA EXPRESS PARA QUE ACTUALICE EL FOLIO)
      if(accion=="boton_guardar" && blanco_al_guardar=="S") {
	  
	    //FALTA GENERALIZAR A TODOS LOS FORMULARIOS
	    if(ventana=="ficha_boleta_express" || ventana=="ficha_compra_express" || ventana=="soporte")
          
		  //SI SE USA ESTA FUNCION, SE LIMPIA LA PANTALLA (RELOAD DE PAGINA) SIN ESPERAR A PRESIONAR ACEPTAR EN EL ALERT (SOLO CUANDO SE USA EL ALERT NEGRO, CON EL ALERT TRADICIONAL FUNCIONA BIEN)
		  //limpiar_ventana();
		  
		  //ESTA FUNCION LIMPIA LA PANTALLA CAMPO POR CAMPO (SIN RELOAD)
		  limpiar(formulario,"","","");
		
		//ESTO SE USA EN DEMO Y MORDOJ!!!!
		if(ventana=="ficha_boleta_express"){
		  //document.forms[formulario].elements["folio"].value = parseInt(document.forms[formulario].elements["folio"].value) + 1;
		  //document.forms[formulario].elements["monto"].value = "";
		  //document.forms[formulario].elements["id_medio_pago"].value = "";
		}
		
      }
	  
	  
	 
	
	  
	  
	  
	  } //FIN FOR DE LAS ENTIDADES
	  
	  


    }
	//NO SE ENVIAN (DESDE EL SERVIDOR) DATOS PARA PONER EN LA PANTALLA
    else if(existe_ficha=="false" && mensaje!="") {

      //alert("NO EXISTE FICHA Y CON MENSAJE");

      var xml_entidad = _xml_root.firstChild;
      formulario = xml_entidad.attributes.getNamedItem("formulario").nodeValue;
	  
      tipo_uso_formulario = document.forms[formulario].var_tipo_uso_formulario.value;
	  //alert(tipo_uso_formulario);
	  
      blanco_al_guardar = document.forms["ventanaForm"].blanco_al_guardar.value;

	  //alert(tipo_uso_formulario);
    
      //ESTE BLOQUE SOLO SE UTILIZA PARA LAS FICHAS (no en las transacciones)
      if(tipo_uso_formulario!="transaccion" && tipo_uso_formulario!="") {

        if(accion=="boton_eliminar")
          activarDesactivarCamposId(formulario,"ACTIVAR"); 
        else if((accion=="boton_buscar" || accion=="key_buscar" || accion=="boton_guardar") && URLDecode(mensaje)=='¡Se encontraron múltiples registros, ingrese más datos para limitar la búsqueda.')
          activarDesactivarCamposId(formulario,"ACTIVAR"); 
        else if((accion=="boton_buscar" || accion=="key_buscar" || accion=="boton_guardar") && URLDecode(mensaje)=='¡No existen registros coincidentes')
          activarDesactivarCamposId(formulario,"ACTIVAR"); 
        else if(accion=="boton_buscar" || accion=="key_buscar" || accion=="boton_guardar") 
          activarDesactivarCamposId(formulario,"DESACTIVAR"); 

      }

      //alert("BORRAR");

      //SI SE BORRA UNA FICHA DEJAR LA PANTALLA EN BLANCO
      if(accion=="boton_eliminar") {
        limpiarCampos(formulario,"^","");
        //limpiar_ventana();
      } 

      ////////

	  
  

      //SI ESTA ACTIVADA LA OPCION BLANCO AL GUARDAR DEJAR LA FICHA EN BLANCO (ESTO DEBE MANTENERSE PERO ARREGLARSE)
      if(accion=="boton_guardar" && blanco_al_guardar=="S") {
        //activarDesactivarCamposId(formulario,"ACTIVAR"); 
        //limpiarCampos(formulario,"^","");
        //limpiar_ventana();
      }

	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  if(URLDecode(mensaje)=="¡Registro ya existe!") {
        //activarDesactivarCamposId(formulario,"ACTIVAR"); 
        limpiarCampos(formulario,"^","");
        //limpiar_ventana();
      }
	  
	  

       
	   
	   
	   
	   
	  //SI SE ESTA ELIMINANDO UNA FILA DE UN GRID
      if(accion=="boton_eliminar_grid") {
		var xml_entidad = _xml_root.firstChild;
        entidad = xml_entidad.attributes.getNamedItem("entidad").nodeValue;
		id_fila = xml_entidad.attributes.getNamedItem("id_fila").nodeValue;
		quitar_fila_grid(entidad,id_fila);
      }
	   
	
	  //MOSTRAR EL MENSAJE DEVUELTO POR EL SERVER
      alert_box_type = document.forms["ventanaForm"].elements["alert_box_type"].value;
	  nativa = document.forms["ventanaForm"].elements["nativa"].value;
       
      //ALERT COMO VENTANA
      //if(alert_box_type==0)
	  if(alert_box_type==0 || nativa==true)
        alert(URLDecode(mensaje));
      //ALERT COMO DIV CON FONDO NEGRO
      else if(alert_box_type==1)     
        showPopup('popup',URLDecode(mensaje),'ALERT','','',codigo_respuesta);
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
	   
    }




	
	
	
	
	
	
	

	
	
	
    //MENSAJE CUANDO NO SE DEVUELVEN DATOS AL CLIENTE Y ES PARTE DE UNA TRANSACCION
    else if(existe_ficha=="false" && mensaje=="") {

      //alert("NO EXISTE FICHA Y SIN MENSAJE:"+accion);

      //CARGAR PARAMETROS DE LA ENTIDAD
      var xml_entidad = _xml_root.firstChild;
      formulario = xml_entidad.attributes.getNamedItem("formulario").nodeValue;
 
      

      //POR EJEMPLO CUANDO BUSCO UN RUT DE CLIENTE PERO DESDE LA VENTANA BOLETA
      if(document.forms[formulario].var_ficha_desde_transaccion.value=="S") {

        alert('¡Registro no existe en la base de datos!');

        //CARGAR PARAMETROS DE LA ENTIDAD
        tipo_estructura = document.forms[formulario].var_tipo_estructura.value.split("^");
        id_fila = xml_entidad.attributes.getNamedItem("id_fila").nodeValue;

        key_id = document.forms[formulario].var_key_id.value;
        key_id_array = string_to_array(key_id,",");



        if(tipo_estructura=="ficha")
          document.forms[formulario].elements[key_id_array[0]].focus();
        else
          document.forms[formulario].elements[key_id_array[0]+id_fila].focus();

      }

      if(ventana=="factura")  {

        //abrir_ventana_ficha("producto","localhost/angular");
        
      }


    }

	
	
	
	

    ventana = document.forms[formulario].var_ventana.value;

    if(ventana=="consultas")  {

      //HACER EL GRAFICO CON JAVASCRIPT
      var chart1 = new FusionCharts("../fusioncharts/Pie2D.swf", "chart1Id", "600", "400", "0", "1"); 

      id_grid = "gridConsultasgridConsultas";
      datos_chart = grid_como_array(id_grid, 1);

      //alert(datos_chart);

      strXML = getXMLChart('chart1Id',datos_chart);

      //alert(strXML);

      chart1.setDataXML(strXML);
      chart1.render("chart1div");
 
    }
    
  }

  }
 
}

//02.///////////////////////////////////////////////////////////////////////////////////////////////

//03.///////////////////////////////////////////////////////////////////////////////////////////////
//AJAX: devolver local y caja
//06.04.2014 GPS

function triggered_local_caja_xml(){

  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200){

    //alert("TRIGGERED_XML_LOCAL_CAJA");
    var _xml_data = XMLHttpRequestObject.responseXML;
    var _text_data = XMLHttpRequestObject.responseText;
    //alert(_text_data);

    var _xml_root = _xml_data.documentElement;

    //CARGAR PARAMETROS GENERALES XML
    _existe_ficha = _xml_root.attributes.getNamedItem("existe_ficha").nodeValue;

    _id_punto_venta = _xml_root.attributes.getNamedItem("id_punto_venta").nodeValue;
    _punto_venta = _xml_root.attributes.getNamedItem("punto_venta").nodeValue;

    _id_caja = _xml_root.attributes.getNamedItem("id_caja").nodeValue;
    _caja = _xml_root.attributes.getNamedItem("caja").nodeValue;
    
    _formulario = "localCajaForm";
    _ventana_siguiente = document.forms[_formulario].var_ventana_siguiente.value;
    _host = document.forms["ventanaForm"].host.value;

    if(_existe_ficha=="1")
      window.location = "http://"+_host+"/aplicacion/window.php?ventana="+_ventana_siguiente+"&punto_venta="+_id_punto_venta+"&punto_venta_show="+_punto_venta+"&caja="+_id_caja+"&caja_show="+_caja;
    else
      alert("La caja '"+document.forms[_formulario].caja.value+"' no existe en el punto de venta '"+document.forms[_formulario].punto_venta.value+"'");

  }

}

//03.///////////////////////////////////////////////////////////////////////////////////////////////

//04.///////////////////////////////////////////////////////////////////////////////////////////////
//AJAX: cargar los select relacionados (regiones -> comunas)
//06.04.2014 GPS

function triggered_select_xml() {

  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {

  	//NO EJECUTAR TIMEOUT SI LLEGA LA RESPUESTA AJAX
	if(mobile=="true"){
      clearTimeout(myVar);
    }
	
    //alert("TRIGGERED_SELECT_XML");
    var _xml_data = XMLHttpRequestObject.responseXML;
    var _text_data = XMLHttpRequestObject.responseText;
    //alert(_text_data);

    //ABRIR NODO PRINCIPAL DEL XML (GENERAL)
    var _xml_root = _xml_data.documentElement;
	
	//LOG SQL PARA DEBUG
    _log_sql = URLDecode(_xml_root.attributes.getNamedItem("var_sql").nodeValue);
    _log_sql_array = _log_sql.split("^");
    _cant_log_sql_array = _log_sql_array.length;

    _log = "LOG SQL: \r\r"+URLDecode(_log_sql_array[0]);

	for(_i=1;_i<_cant_log_sql_array;_i++){
      _log = _log +"\r\r"+ _log_sql_array[_i];
    }
	
    //if(_log!="LOG SQL: \r\r")
    //  alert(_log);
    ////// 
   
    //ABRIR PRIMER NODO SECUNDARIO (ENTIDAD)
    var _xml_entidad = _xml_root.firstChild;
    _cant_filas = _xml_entidad.attributes.getNamedItem("cant_filas").nodeValue;
    _formulario = _xml_entidad.attributes.getNamedItem("formulario").nodeValue;
	
	//SUBFORMULARIO (AGREGAR UN CERO AL NOMBRE DEL CAMPO)
	if(_formulario=="informe_punto_ventaForm")
	  _campo = _xml_root.attributes.getNamedItem("campo_asociado").nodeValue+ "0";
	else
	  _campo = _xml_root.attributes.getNamedItem("campo_asociado").nodeValue;
	
    var _metadata = new Array();
    _metadata[0] = "cod_interno";
	
	//SUBFORMULARIO
	if(_formulario=="informe_punto_ventaForm"){
	  _metadata[1] = "id_detalle_promocion";
	}
	else{
      _metadata[1] = _campo;
	}
    
	//FALTA GENERALIZAR PDM: PARA CARGAR CAMPOS ASOCIADOS
	if(_formulario=="detalle_velacionForm" || _formulario=="recepcion_velacionForm" || _formulario=="traslado_velacionForm"){
      _metadata[2] = "nombre_difunto";
	  
	  //SI SE ENCONTRO EL REGISTRO EN EL SERVIDOR
	  if(_cant_filas>0){
	    _text0 = URLDecode(_xml_entidad.getElementsByTagName(_metadata[0]).item(0).firstChild.data);
	    _text = URLDecode(_xml_entidad.getElementsByTagName(_metadata[1]).item(0).firstChild.data);
	    _text1 = URLDecode(_xml_entidad.getElementsByTagName(_metadata[2]).item(0).firstChild.data);
		document.forms[_formulario].elements["id_numero_ot"].value = _text0;
	    document.forms[_formulario].elements["rut_difunto"].value = _text;
	    document.forms[_formulario].elements["nombre_difunto"].value = _text1;
	  }
	  //SI NO SE ENCONTRO EL REGISTRO EN EL SERVIDOR
	  else{
	    document.forms[_formulario].elements["id_numero_ot"].value = "";
	    document.forms[_formulario].elements["rut_difunto"].value = "";
	    document.forms[_formulario].elements["nombre_difunto"].value = "";
	  }
	  
	}
	
    //VACIAR ELEMENTOS ACTUALES DEL SELECT
    document.forms[_formulario].elements[_campo].options.length=0;

    //CARGAR EL SELECT CON UN BLANCO SI ESTA ACTIVA ESA OPCION
    _selectbox = document.forms[_formulario].elements[_campo];
    _text = "";
    _value = 99;
    addOption(_selectbox,_text,_value);

	//alert(_cant_filas);
	
    //CARGAR EL SELECT
    for(_s=0;_s<_cant_filas;_s++) {
      //alert(URLDecode(_xml_entidad.getElementsByTagName[_metadata[1]].item(_s).firstChild.data));
      _selectbox = document.forms[_formulario].elements[_campo];
      _text = URLDecode(_xml_entidad.getElementsByTagName(_metadata[1]).item(_s).firstChild.data);
      _value = URLDecode(_xml_entidad.getElementsByTagName(_metadata[0]).item(_s).firstChild.data);
      addOption(_selectbox,_text,_value);
    }

	//PRECARGAR LA PRIMERA OPCION (VACIO)
	document.forms[_formulario].elements["id_comuna"].selectedIndex = 0;
	$('#id_comuna').selectmenu('refresh');
	
    //SI SOLO HAY UNA OPCION EN EL SELECT (ADEMAS DE VACIO) ESA DEBE ELEGIRSE POR DEFAULT
    if(document.forms[_formulario].elements[_campo].options.length==2 && document.forms[_formulario].elements[_campo].options[0].text=="")
      document.forms[_formulario].elements[_campo].selectedIndex = 1;

	
	  
  }

}

//04.///////////////////////////////////////////////////////////////////////////////////////////////

//05.///////////////////////////////////////////////////////////////////////////////////////////////
//AJAX: cargar los puntos en el mapa
//06.04.2014 GPS

function triggered_mapa_xml() {

  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200){
  
    //alert("TRIGGERED_XML_MAPA");
	if(ventana=="mapa_sucursales_di"){
		hidePopup('popup');
	}
	
    var _xml_data = XMLHttpRequestObject.responseXML;
    var _text_data = XMLHttpRequestObject.responseText;
	
    //alert(_text_data);
	
    var _xml_root = _xml_data.documentElement;
	
    //CARGAR PARAMETROS GENERALES XML
    _tipo_key_id = _xml_root.attributes.getNamedItem("tipo_key_id").nodeValue;
	_lat = "";
    _long = "";
    _mensaje = "";
    _distancia = "";
	
	_host = document.forms["ventanaForm"].host.value;
	_mobile = document.forms["ventanaForm"].mobile.value;
	
    if(document.forms["ventanaForm"].elements["nativa"].value==true){
	  ocultar_loader();
    }
	
    inicializando(_lat,_long,_mensaje,_distancia,_mobile,_host,_xml_root,_tipo_key_id);
  }
}

//05.///////////////////////////////////////////////////////////////////////////////////////////////

//06.///////////////////////////////////////////////////////////////////////////////////////////////
//?????
//06.04.2014 GPS

function aaa(_codigo_local,_distancia,_latitud_usuario,_longitud_usuario,_id_cargo,_Mercaderista){

  _mobile=true;
  _server=document.forms["ventanaForm"].elements["host"].value;
  _latitud_gps=_latitud_usuario;
  _longitud_gps=_longitud_usuario;
  _latitud_punto="";
  _longitud_punto="";
  
  //alert(_id_cargo);
  //Logica De id_canal mas id cargo ? 
  
  //SUPERVISOR SPM/MAY
  if(_id_cargo=="1" || _id_cargo=="3")
    _ventana="informe_punto_venta";
  //SUPERVISOR COB
  else if(_id_cargo=="2")
    _ventana="informe_spv_cobertura";

  _distancia = parseFloat(Math.round(_distancia * 100) / 100).toFixed(1);
  
  /*_html = _html + "<br>Código cliente: "+_codigo_local;
  infowindow.setContent(_html);*/
  //loadContent(_mobile,_server,_codigo_local,_latitud_gps,_longitud_gps,_latitud_punto,_longitud_punto,_distancia,_ventana,_Mercaderista);
  
}

//06.///////////////////////////////////////////////////////////////////////////////////////////////

//07.///////////////////////////////////////////////////////////////////////////////////////////////
//AJAX: cargar los puntos en la lista (PRUEBA FIREFOX) SE USA???
//06.04.2014 GPS

function triggered_lista_xml2(){

  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200){

    //alert("TRIGGERED_LISTA_XML");
	var _xml_data = XMLHttpRequestObject.responseXML;
	var _text_data = XMLHttpRequestObject.responseText;
	
	//alert(_text_data);

	var _xml_root = _xml_data.documentElement;

	//NOMBRE DE LA PRIMERA ETIQUETA (ETIQUETA MADRE)
    //alert(_xml_root.tagName);
	//alert(_xml_root.attributes.getNamedItem("latitud_usuario").nodeValue);
	
    //CARGAR PARAMETROS GENERALES XML
	//_latitud_usuario = _xml_root.attributes.getNamedItem("latitud_usuario").nodeValue;
	
	//alert("FIREFOX2"+_latitud_usuario);
	
	//_longitud_usuario = _xml_root.attributes.getNamedItem("longitud_usuario").nodeValue;
	//_id_cargo = _xml_root.attributes.getNamedItem("id_cargo").nodeValue;
   
	//var _xml_entidad = _xml_root.firstChild;
    //_cant_filas = _xml_entidad.attributes.getNamedItem("id").nodeValue;
	//_asignacion_informes = _xml_entidad.attributes.getNamedItem("asignacion_informes").nodeValue;
	//_html2 = "";
	//_html = "";
	
	//NOMBRE DE LA PRIMERA ETIQUETA
	//alert(_xml_root.childNodes[0].tagName);
	
	//VALOR DE LA PRIMERA ETIQUETA
	//alert(_xml_root.childNodes[0].textContent);
	
	//VALOR DEL ATRIBUTO ID DE LA PRIMERA ETIQUETA
	//alert(_xml_root.childNodes[0].attributes.getNamedItem("id").nodeValue);

  }

} 
	
//07.///////////////////////////////////////////////////////////////////////////////////////////////

//08.///////////////////////////////////////////////////////////////////////////////////////////////
//AJAX: cargar la lista en el móvil
//06.04.2014 GPS

function triggered_lista_xml(){

  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200){

    //alert("TRIGGERED_LISTA_XML");
	var _xml_data = XMLHttpRequestObject.responseXML;
    var _text_data = XMLHttpRequestObject.responseText;
    //alert(_text_data);

	if(document.forms["ventanaForm"].elements["nativa"].value==true){
	  ocultar_loader();
	}
	
	var _xml_root = _xml_data.documentElement;

    //CARGAR PARAMETROS GENERALES XML
	_latitud_usuario = _xml_root.attributes.getNamedItem("latitud_usuario").nodeValue;
	_longitud_usuario = _xml_root.attributes.getNamedItem("longitud_usuario").nodeValue;
	_id_cargo = _xml_root.attributes.getNamedItem("id_cargo").nodeValue;
   
	var _xml_entidad = _xml_root.firstChild;
    _cant_filas = _xml_entidad.attributes.getNamedItem("cant_filas").nodeValue;
	_asignacion_informes = URLDecode(_xml_entidad.attributes.getNamedItem("asignacion_informes").nodeValue);
	
	_html2 = "";
	_html = "";
	
	//alert("REGISTROS: "+_cant_filas);
	
	for(_i=0;_i<_cant_filas;_i++){
	  _cod_interno = URLDecode(_xml_entidad.getElementsByTagName("cod_interno").item(_i).firstChild.data);		
	  _id_canal = URLDecode(_xml_entidad.getElementsByTagName("id_canal").item(_i).firstChild.data);		
	  _codigo_local = URLDecode(_xml_entidad.getElementsByTagName("codigo_local").item(_i).firstChild.data);		
	  _latitud_gps = URLDecode(_xml_entidad.getElementsByTagName("latitud_gps").item(_i).firstChild.data);		
	  _longitud_gps = URLDecode(_xml_entidad.getElementsByTagName("longitud_gps").item(_i).firstChild.data);		
	  _denominacion = URLDecode(_xml_entidad.getElementsByTagName("denominacion").item(_i).firstChild.data);		
	  _distancia = URLDecode(_xml_entidad.getElementsByTagName("distancia").item(_i).firstChild.data);		
				
	  var _comillas = "'";
	  var _codI =_comillas +_cod_interno+ _comillas;
	  var _idcana =_comillas +_id_canal+ _comillas;
	  var _codLoc =_comillas +_codigo_local+ _comillas;
	  var _latgp =_comillas +_latitud_gps+ _comillas;
	  var _longp =_comillas +_longitud_gps+ _comillas;
	  var _dem =_comillas +_denominacion+ _comillas;
	  var _distam =_comillas +_distancia+ _comillas;
										
	  _html2 = _html2 + '<li> <a onclick="RellenaPopup('+_codI+' , '+_idcana+' , '+_codLoc+','+_latgp+','+_longp+','+_dem+','+_distam+');">';
	  _html2 = _html2 + '</h2>'+_codigo_local+'</h2>';
	  _html2 = _html2 + '<h2>'+_denominacion+'</h2>';
	  _html2 = _html2 + '<p>Distancia: '+ parseFloat(Math.round(_distancia * 100) / 100).toFixed(1) +' Km.</p>';
	  _html2 = _html2 + '</a></li>';
	/*FIN CREACION DE LA LISTA*/
	}
	
	
	
	document.getElementById("lista_sucursales").innerHTML = _html2;
	$('#lista_sucursales').listview('refresh');
  }

}
//08.///////////////////////////////////////////////////////////////////////////////////////////////

//09.///////////////////////////////////////////////////////////////////////////////////////////////
//: evento clic de la lista que genera el popup con el cuadro blanco
//06.04.2014 GPS

function RellenaPopup(_cod_interno,_id_canal,_codigo_local,_latitud,_longitud,denominacion,_distancia){
  mostrar_loader("Buscando datos");
  mobile=true;
  host=document.forms["ventanaForm"].elements["host"].value;
  cod_interno = URLDecode(_cod_interno); 
  codigo_local = URLDecode(_codigo_local);
  ventana = document.forms["ventanaForm"].elements["ventana"].value;
  var html = '';
  var aplicacion = document.forms["ventanaForm"].elements["aplicacion"].value;
  var id_canal = URLDecode(_id_canal);
  comuna ='';
  id_sucursal_cliente ='';
  denominacion ='';
  distancia = myRound(URLDecode(_distancia),1);
  latround = '';
  longround = '';
  latitud_gps=URLDecode(_latitud);
  longitud_gps=URLDecode(_longitud);
  var token_sesion = window.sessionStorage.getItem("token_sesion");
	  Height1 = consultarHeight();
			Width1 = consultarWidth();
	Height = Math.round(Height1 * 0.80);
	Width = Math.round(Width1 * 0.65);
  _servidor = "http://"+host+"/aplicacion/BusinessLogic/mapa/consulta_datos_punto.php";	
	
  $.post(_servidor,
	{
	cod_interno:cod_interno,ventana:ventana,aplicacion:aplicacion,id_canal:id_canal,distancia:distancia,
	mobile:mobile,host:host,comuna:comuna,codigo_local:codigo_local,id_sucursal_cliente:id_sucursal_cliente,denominacion:denominacion,lat:latitud_gps,long:longitud_gps,
	latround:latround,longround:longround,Height:Height,Width:Width,token_sesion:token_sesion
	}, 
	function(data){
	  ocultar_loader();	
	  document.getElementById("DataPopUp").innerHTML = data;
		$( "#PopupLoginLista" ).width(Width);
		$( "#PopupLoginLista" ).height(Height);
		$( "#PopupLoginLista" ).popup( "open");	
		
	});

}

//09.///////////////////////////////////////////////////////////////////////////////////////////////

//10.///////////////////////////////////////////////////////////////////////////////////////////////
//AJAX: respuesta del servidor luego de sincronizar los datos offline
//06.04.2014 GPS

function triggered_xml2(){

  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200){
	
    if(mobile=="true"){
	  clearTimeout(myVar);
	}
	
	var _xml_data = XMLHttpRequestObject.responseXML;
	var _text_data = XMLHttpRequestObject.responseText;
			
	//alert(_text_data);
		
	if(_text_data!=""){
	  var _xml_root = _xml_data.documentElement;
	  _existe_ficha = _xml_root.attributes.getNamedItem("existe_ficha").nodeValue;
	  _mensaje = _xml_root.attributes.getNamedItem("mensaje").nodeValue;
	  //alert(URLDecode(_mensaje));
	  var _Id = document.getElementById('var_OfflineDelete').value;
	  document.getElementById('var_OfflineDelete').value='';
			
	  var _db = openDatabase('IPDV', '1.0', '', 3 * 1024 * 1024);
	  _db.transaction(function (_tx) {
	    _tx.executeSql('SELECT * FROM IPDV order by id desc limit 1', [], function (_tx, results) {
		  var _Termino = results.rows.item(0).id;
		  if(_Id!=_Termino){
		    sincronizacion();
		  }
		  else{
		    alert(_Termino+' Registro(s) sincronizados con \xe9xito');
		    document.getElementById('var_cantidadOff').innerHTML='<b>Cantidad de registros : 0</b>';
		    sincronizaimg();
		    ocultar_loader();
		  }
	    });
	  });
	  
	  deleteData(_Id,'IPDV');	
	}
  
  }
		
}

//10.///////////////////////////////////////////////////////////////////////////////////////////////

//11.///////////////////////////////////////////////////////////////////////////////////////////////
//AJAX: respuesta del servidor luego de sincronizar las fotos offline
//06.04.2014 GPS

function ResponseFoto(){
  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {
  
    if(mobile=="true"){
      clearTimeout(myVar);
	}
	
	var _Id = document.getElementById('var_OfflineDeleteImg').value;
	var _xml_data = XMLHttpRequestObject.responseXML;
	var _text_data = XMLHttpRequestObject.responseText;
	
	if(_text_data==1){
	  deleteImg(_Id,'Fotos');	
	}
	
  }
}

//11.///////////////////////////////////////////////////////////////////////////////////////////////

//12.///////////////////////////////////////////////////////////////////////////////////////////////
//: envia hacia el servidor las imagenes offline al sicronizar
//08.04.2014 GPS

function sincronizaimg(){
  
  var db = openDatabase('IPDV', '1.0', '', 3 * 1024 * 1024);
  db.transaction(function (tx){
    tx.executeSql('SELECT * FROM Fotos', [], function (tx, results){
	  var _len = results.rows.length, i;
	  //alert(_len)
	  if(_len>0){ 
	    var _id = results.rows.item(0).id;
	    //alert(_id)
	    var _fecha = results.rows.item(0).fecha;
	    var _tipoinforme = results.rows.item(0).tipoinforme;
	    var _campo = results.rows.item(0).campo;
	    var _idsucursal = results.rows.item(0).idsucursal;
	    var _user = results.rows.item(0).user;
	    var _codlocal = results.rows.item(0).codlocal;					
	    var _nombrearchivo = results.rows.item(0).nombrearchivo;
	    var _tipoarchivo = results.rows.item(0).tipoarchivo;
        var _tamano = results.rows.item(0).tamano;
	    var _data = results.rows.item(0).data;
	    var _cadena_valores = 'DataTotal='+_fecha+'|||'+_tipoinforme+'|||'+_campo+'|||'+_idsucursal+'|||'+_user+'|||'+_codlocal+'|||'+_nombrearchivo+'|||'+_tipoarchivo+'|||'+_tamano+'|||'+_data;
	  
	    document.getElementById('var_OfflineDeleteImg').value=_id;		
	    loadurl_xml('FotoOffline.php',_cadena_valores,ResponseFoto);
	  }					
    });
  });
}

//12.///////////////////////////////////////////////////////////////////////////////////////////////

//13.///////////////////////////////////////////////////////////////////////////////////////////////
//OFFLINE: elimina imagen desde la bd local
//08.04.2014 GPS

function deleteImg(_Id,_Tabla){
  var _db = openDatabase('IPDV', '1.0', '', 3 * 1024 * 1024);
  _db.transaction(function (_tx){
	_tx.executeSql('delete from  '+_Tabla+' where id = '+_Id);
	sincronizaimg();
  });
}	

//13.///////////////////////////////////////////////////////////////////////////////////////////////

//14.///////////////////////////////////////////////////////////////////////////////////////////////
//AJAX: respuesta del informe local cerrado
//08.04.2014 GPS

function triggered_xml_cerrado() {

  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {

    //alert("TRIGGERED_XML_GRAFICOS");
    var _xml_data = XMLHttpRequestObject.responseXML;
    var _text_data = XMLHttpRequestObject.responseText;
	
    //alert(_text_data);
	if(_text_data=='1'){
	  alert('¡Nuevo registro guardado con éxito!');
	}
	else if(_text_data=='2'){
	  alert('¡Ya se encuentra cerrado este local!');
	}
	ocultar_loader();
	infowindow.close();
	
  }
  
}

//14.///////////////////////////////////////////////////////////////////////////////////////////////

//15./////////////////////////////////////////////////////////////////////////////////////////////
//AJAX: filtro del mapa para mostrar solo un canal
//08.04.2014 GPS

function FiltroMapa(Tipo){

  _token_sesion = window.sessionStorage.getItem("token_sesion");
  var _Valor = document.getElementById('seleccion_idcanal').value;
  //window.location.href = "../aplicacion/window.php?ventana=mapa_sucursales&"+Tipo+"="+_Valor+"";

  _cadena_parametros = "tipo_key_id=ID_USUARIO&cod_interno=&id_canal="+_Valor+"&ventana=mapa_sucursales&token_sesion="+_token_sesion;
  loadurl_xml("action_buscar_sucursales.php",_cadena_parametros,triggered_mapa_xml);

}

//15./////////////////////////////////////////////////////////////////////////////////////////////

//16./////////////////////////////////////////////////////////////////////////////////////////////
//AJAX: cambio de la posición de un punto en el mapa (cualquier mapa)
//08.04.2014 GPS

function triggered_mapa_Lat_Long() {

  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200){
	hidePopup('popup');
  }
  
}

//16./////////////////////////////////////////////////////////////////////////////////////////////

//17./////////////////////////////////////////////////////////////////////////////////////////////
//AJAX: trae el primer mapa di (el que se carga inicialmente)
//08.04.2014 GPS

function triggered_mapa_xml2() {

  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200){
    hidePopup('popup');
    var _xml_data = XMLHttpRequestObject.responseXML;
    var _text_data = XMLHttpRequestObject.responseText;
    //alert(_text_data);
    var _xml_root = _xml_data.documentElement;
    //CARGAR PARAMETROS GENERALES XML
    _tipo_key_id = _xml_root.attributes.getNamedItem("tipo_key_id").nodeValue;
	
	//PARAMETROS
	_lat = "";
    _long = "";
    _mensaje = "";
    _distancia = "";
	_host = document.forms["ventanaForm"].host.value;
	_mobile = document.forms["ventanaForm"].mobile.value;
	
    if(document.forms["ventanaForm"].elements["nativa"].value==true){
	  ocultar_loader();
    }
	
    InicializedMapaFilter(_lat,_long,_mensaje,_distancia,_mobile,_host,_xml_root,_tipo_key_id);
  }
}

//17./////////////////////////////////////////////////////////////////////////////////////////////

//18./////////////////////////////////////////////////////////////////////////////////////////////
//TRAE EL MAPA DI UNA VEZ QUE SE LE HAN APLICADO FILTROS

function triggered_mapa_xml3() {

  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {
  hidePopup('popup');
    var xml_data = XMLHttpRequestObject.responseXML;
    var text_data = XMLHttpRequestObject.responseText;
    //alert(text_data);
    var xml_root = xml_data.documentElement;
    //CARGAR PARAMETROS GENERALES XML
    tipo_key_id = xml_root.attributes.getNamedItem("tipo_key_id").nodeValue;
	//PARAMETROS
	lat = "";
    long = "";
    mensaje = "";
    distancia = "";
	host = document.forms["ventanaForm"].host.value;
	mobile = document.forms["ventanaForm"].mobile.value;
    if(document.forms["ventanaForm"].elements["nativa"].value==true)
	  ocultar_loader();
 
    InicializedMapaDrawing(lat,long,mensaje,distancia,mobile,host,xml_root,tipo_key_id);
  }
}

//18./////////////////////////////////////////////////////////////////////////////////////////////

//19./////////////////////////////////////////////////////////////////////////////////////////////
//PARA CUANDO SE CREA Y GUARDA UN POLIGONO

function triggered_mapa_drawing() {

	if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {
	hidePopup('popup');
		var xml_data = XMLHttpRequestObject.responseXML;
		var text_data = XMLHttpRequestObject.responseText;
		if(text_data==2){
			alert('Poligono ya existe.')
			filtromapa();
		}
		if(text_data==1){
			filtromapa();
			
		}
		limpiaDatosSeleccion();
     } 
}

//19./////////////////////////////////////////////////////////////////////////////////////////////

//20./////////////////////////////////////////////////////////////////////////////////////////////
//PARA CUANDO SE ELIMINA UN POLIGONO

function triggered_mapa_delete() {

	if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {
		hidePopup('popup');
		var xml_data = XMLHttpRequestObject.responseXML;
		var text_data = XMLHttpRequestObject.responseText;
		if(text_data==1){
			alert('Poligono eliminado correctamente.');
			filtromapa();
			limpiaDatosSeleccion();
		}
    } 
}

//20./////////////////////////////////////////////////////////////////////////////////////////////

//21./////////////////////////////////////////////////////////////////////////////////////////////
//DESCARGA LOS PUNTOS DESDE EL MAPA DI

function triggered_mapa_descarga_data() {

	if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {
		hidePopup('popup');
		var xml_data = XMLHttpRequestObject.responseXML;
		var text_data = XMLHttpRequestObject.responseText;
		window.open(text_data,"_blank","toolbar=no, scrollbars=no, resizable=no,width=200, height=200");
    } 
}

//21./////////////////////////////////////////////////////////////////////////////////////////////

//22./////////////////////////////////////////////////////////////////////////////////////////////


function triggered_mapa_resultdata(){
	if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {
	hidePopup('popup');
		var xml_data = XMLHttpRequestObject.responseXML;
		var text_data = XMLHttpRequestObject.responseText;
		var xml_root = xml_data.documentElement;
		DataMapaporCapa(xml_root);
    }
}

//22./////////////////////////////////////////////////////////////////////////////////////////////



//24./////////////////////////////////////////////////////////////////////////////////////////////

function triggered_xml_graficos() {

  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {
  

  
	hidePopup('popup');
    var xml_data = XMLHttpRequestObject.responseXML;
    var text_data = XMLHttpRequestObject.responseText;
    //alert(text_data);

	//DIBUJAR GRAFICO CON LOS DATOS DEL XML (GENERALIZAR EL NOMBRE DE LOS GRAFICOS) - EL DIV DEL GRAFICO DEBE EXISTIR!!
	nombre_grafico_array = new Array("estados_proyectos","aperturas_ano","etapas_proyectos");
	//nombre_grafico_array = new Array("estados_proyectos");
	text_data_array = string_to_array(text_data,"#");
	
	 
    //openpopgraficos();
	
	
	
	 //myVar=setTimeout(function(){dibujaGraficos(nombre_grafico_array,text_data_array)},500);
	
	
	dibujaGraficos(nombre_grafico_array,text_data_array);
	
	
	
	
  }
  
}

//24./////////////////////////////////////////////////////////////////////////////////////////////

//25./////////////////////////////////////////////////////////////////////////////////////////////

function triggered_georef_xml(){

  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200){

  	//NO EJECUTAR TIMEOUT SI LLEGA LA RESPUESTA AJAX
	if(mobile=="true"){
      clearTimeout(myVar);
	  ocultar_loader();
    }
  
    //alert("TRIGGERED_MOMI_XML");
	response = XMLHttpRequestObject.response.split(",");
	
	lat_direccion = response[0];
	lon_direccion = response[1];
	precision = response[2];
	
	//alert(lat_direccion+"-"+lon_direccion+"-"+precision);
	
	//SI LA PRECISION DE LA GEOREFERENCIACION ES EXACTA, AGREGAR LAT Y LON AL FORMULARIO
	if(precision=="ROOFTOP" || precision=="RANGE_INTERPOLATED"){
	
	  //GENERALIZAR: ESTO ES SOLO PARA MULTICAJA
	  document.forms["potencial_clienteForm"].elements["lat_direccion"].value = myRound(lat_direccion,7);
	  document.forms["potencial_clienteForm"].elements["lon_direccion"].value = myRound(lon_direccion,7);
	  
	  lat = document.forms["potencial_clienteForm"].elements["lat"].value;
	  lon = document.forms["potencial_clienteForm"].elements["lon"].value;
	  
	  //alert(lat+"-"+lon);
	  
	  //lat,lon: POSICION EQUIPO MOVIL;lat_direccion,lon_direccion: POSICION SUCURSAL
	  distancia = myRound(getDistanceFromLatLonInKm(lat,lon,lat_direccion,lon_direccion),1);
	  //max_distancia = 2;
	  
	  //alert(distancia);
	  
	  //SOLO ACEPTAR DIRECCION INGRESADA SI EL MOVIL ESTA A MAXIMO N KILOMETROS
	  //if(distancia>max_distancia){
	    //document.forms["potencial_clienteForm"].elements["lat_direccion"].value = "";
	    //document.forms["potencial_clienteForm"].elements["lon_direccion"].value = "";
	    //alert("Distancia máxima permitida al punto georeferenciado es de "+max_distancia+" Km.");
	  //}
	  //else{
	    document.forms["potencial_clienteForm"].elements["distancia"].value = distancia;
	    alert("Dirección georeferenciada con éxito.");
	  //}
	}
	
	else{
	  document.forms["potencial_clienteForm"].elements["lat_direccion"].value = "";
	  document.forms["potencial_clienteForm"].elements["lon_direccion"].value = "";
	  alert("Dirección ingresada no ha podido ser georeferenciada.");
	}

  }

} 

//25./////////////////////////////////////////////////////////////////////////////////////////////


//26./////////////////////////////////////////////////////////////////////////////////////////////
function triggered_sincronizacion_tablas(){

  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {
	mobile = document.forms["ventanaForm"].elements["mobile"].value;
    //alert("TRIGGERED_XML_GRAFICOS");
    var xml_data = XMLHttpRequestObject.responseXML;
    var text_data = XMLHttpRequestObject.responseText;
	
	var xml_root = xml_data.documentElement;
    var_mensaje = xml_root.attributes.getNamedItem("var_mensaje").nodeValue;
	var xml_entidad = xml_root.firstChild;
	if(mobile=='true'){
		clearTimeout(myVar);
	}

		cant_filas = xml_entidad.attributes.getNamedItem("cant_filas").nodeValue;
		d = new Date()
		DATETIME = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear();
		//TABLA QUE INGRESA, O PROCESO OFFLINE
		TABLA = 'COMUNAS';
		var _db = openDatabase("IPDV", '1.0', '', 3 * 1024 * 1024);
		_db.transaction(function (_tx) {
		 _tx.executeSql('DELETE FROM  '+TABLA);
		 _tx.executeSql('DELETE FROM  PROCESOS where cod_interno = 1');
		 
		_tx.executeSql('CREATE TABLE IF NOT EXISTS '+TABLA+' (cod_interno INTEGER PRIMARY KEY, id_region INTEGER, nombre_comuna TEXT, estado INTEGER)');
		_tx.executeSql('CREATE TABLE IF NOT EXISTS PROCESOS (cod_interno INTEGER PRIMARY KEY, Fecha TEXT, CantRegistros INTEGER, Proceso TEXT)');
				for(var i=0;i<cant_filas;i++){
					cod_interno = URLDecode(xml_entidad.getElementsByTagName("cod_interno").item(i).firstChild.data);
					id_region = URLDecode(xml_entidad.getElementsByTagName("id_region").item(i).firstChild.data);
					nombre_comuna = URLDecode(xml_entidad.getElementsByTagName("nombre_comuna").item(i).firstChild.data);
					estado = URLDecode(xml_entidad.getElementsByTagName("estado").item(i).firstChild.data);
					 _tx.executeSql('INSERT INTO '+TABLA+' (cod_interno, id_region, nombre_comuna,estado) VALUES ('+cod_interno+', "'+id_region+'", "'+nombre_comuna+'","'+estado+'")');
				}
				//AUTOINCREMENTABLE!!!!
				 _tx.executeSql('INSERT INTO PROCESOS (cod_interno, Fecha, CantRegistros, Proceso) VALUES (1, "'+DATETIME+'", '+cant_filas+',"'+TABLA+'")');
				 document.getElementById('registros_sincronizacion_'+TABLA).innerHTML = 'Registros : '+cant_filas+' el día '+DATETIME+'';	
			if(mobile=='true'){
				ocultar_loader();
			}else{
				hidePopup('popup');
			}
			alert('sincronizaci\xf3n exitosa');
		});
	
	 
	 
  }

} 

//26./////////////////////////////////////////////////////////////////////////////////////////////

//27./////////////////////////////////////////////////////////////////////////////////////////////

function triggered_grafico_di_xml(){
if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {
		hidePopup('popup');
		var text_data = XMLHttpRequestObject.responseText;
		openpopgraficos(text_data);
    } 

}

//27./////////////////////////////////////////////////////////////////////////////////////////////



//23./////////////////////////////////////////////////////////////////////////////////////////////

//RETORNA TODAS LAS FOTOS PARA MOSTAR EN GALERIA IMAGENES

function triggered_html(){
	if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {
		var text_data = XMLHttpRequestObject.responseText;
		var General = '';
		var primario = 0;
		var secundario = 0;		
		data = text_data.split('///');
		var limite = document.getElementById('hddlimitegaleria').value.split(',');
			
		
				if(limite[0]=='0'){
					primario = 1;
					document.getElementById('btnatrasgal').style.visibility="hidden";
					document.getElementById('btnadelantegal').style.visibility="visible";
				}else{
					primario = limite[0];
					document.getElementById('btnatrasgal').style.visibility="visible";
					document.getElementById('btnadelantegal').style.visibility="visible";
				}
			
		
		
		if(limite[1]>data[1]){
			secundario = data[1];
			document.getElementById('btnadelantegal').style.visibility="hidden";
		}else{
			secundario = limite[1];
		}
		
		
	document.getElementById('divcantidadgaleria').style.display="block";
	if(data[1]>0){	
	//TOTAL DE REGISTROS INNERHTML	
		document.getElementById('divcantidadgaleria').innerHTML='Mostrando '+primario+' al '+secundario+' de un total de '+data[1]+'';
	//TOTAL DE REGISTROS INNERHTML
	}else{
		document.getElementById('divcantidadgaleria').innerHTML='No existen registros';
	}
	
		General = data[0];
		document.getElementById('divgaleriaimg').innerHTML=General;
    }
}

//23./////////////////////////////////////////////////////////////////////////////////////////////

//28./////////////////////////////////////////////////////////////////////////////////////////////
function triggered_html1(){
	if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200){
	document.getElementById('formulario').innerHTML = '';
	mobile = document.forms["ventanaForm"].elements["mobile"].value;
	if(mobile=='true'){
		document.getElementById('ullistcelu').style.display='block';
	}
    var _xml_data = XMLHttpRequestObject.responseXML;
    var _text_data = XMLHttpRequestObject.responseText;
	var _xml_root = _xml_data.documentElement;
	var xml_entidad = _xml_root.firstChild;
	cant_filas = xml_entidad.attributes.getNamedItem("cant_filas").nodeValue;
	var tabla = '<table style="text_align:center;" class="estilo_td">';
	for(var i=0;i<cant_filas;i++){
		cod_interno = URLDecode(xml_entidad.getElementsByTagName("cod_interno").item(i).firstChild.data);
		codigo_local = URLDecode(xml_entidad.getElementsByTagName("codigo_local").item(i).firstChild.data);
		denominacion = URLDecode(xml_entidad.getElementsByTagName("denominacion").item(i).firstChild.data);
				
				if(mobile=='true'){
					var html='<li data-icon="false">';
					html+='<a onclick=buscargaleriaimg('+codigo_local+',1) rel="external">';
					html+='<p>'+denominacion+'</p>';
					html+='</a></li>';
					$("#formulario").append(html);
				}else{
					tabla+= '<tr>';
					tabla+= '<td>'+denominacion+'</td>';
					tabla+= '<td><a onclick=buscargaleriaimg('+codigo_local+',1)><img src="../plugins/imagenes/plataforma/lupa.png" border="0"></a></td>';
					tabla+= '</tr>';
					
				}
				
				
				
	}
	tabla+= '</table>';
	if(mobile=='true'){
		$("#formulario").listview("refresh");
	}else{
		document.getElementById('formulario').innerHTML = tabla;
	}

	
     	  
  }
}	
//28./////////////////////////////////////////////////////////////////////////////////////////////