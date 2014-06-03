//INDICE DE FUNCIONES

//00. abort_ajax
//01. loadurl_xml(url_destino,cadena_parametros,handler) => enviar al servidor
//02. triggered_xml
//03. triggered_local_caja_xml
//04. triggered_select_xml
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
//23. triggered_html

//00.///////////////////////////////////////////////////////////////////////////////////////////////

var token_sesion = window.sessionStorage.getItem("token_sesion");

function abort_ajax(){
  XMLHttpRequestObject.abort();
  
  if(document.forms["ventanaForm"].elements["nativa"].value==true)
	  ocultar_loader();
  
  alert("Hubo un problema en la conexión (Timeout)");
  
  if(document.forms["ventanaForm"].elements["nativa"].value==true)
   	  $('#boton_guardar').button("enable");
}

//00.///////////////////////////////////////////////////////////////////////////////////////////////

//01.///////////////////////////////////////////////////////////////////////////////////////////////
//08-10-2012 GPS

function loadurl_xml(url_destino,cadena_parametros,handler) {
  
  //alert(cadena_parametros);
  //alert(url_destino);
  //SIEMPRE DEBE EXISTIR ventanaForm EN LA VENTANA
  ventana = document.forms["ventanaForm"].elements["ventana"].value;
  nativa = document.forms["ventanaForm"].elements["nativa"].value;
  mobile = document.forms["ventanaForm"].elements["mobile"].value;
  
  //ACCESO A LOGICA CENTRALIZADA (archivo PageLogicPHP.php)
  url_servidor = window.localStorage.url_servidor;
  
  if(url_destino=="PageLogicPHP.php")
   url_destino = "http://"+url_servidor+"/aplicacion/InteractionLogic/"+url_destino;
  else if(url_destino=="cronjob.php")
    url_destino = "BusinessLogic/cron/"+url_destino;
  //ACCESO A LOGICA PARTICULAR (ubicada en carpeta BusinessLogic) - parámetro "action" en BD
  else{
  
    //REVISAR SI ES PHONEGAP O NO
    url_servidor = window.localStorage.url_servidor;
    
	//SI ES PHONEGAP
	if(url_servidor!=undefined && url_servidor!=""){
	  url_destino = "http://"+url_servidor+"/aplicacion/BusinessLogic/"+url_destino;
	}
    //SI NO ES PHONEGAP
	else{
	  url_destino = "BusinessLogic/"+url_destino;
	}
  }
 
  //ESTA FUNCION create_XMLHttpRequestObject() NO SE DEBE OBFUSCAR 
  XMLHttpRequestObject = create_XMLHttpRequestObject();

  XMLHttpRequestObject.onreadystatechange = handler;
  XMLHttpRequestObject.open("POST", url_destino, true);
  XMLHttpRequestObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  //alert(url_destino+"?"+cadena_parametros);
  
  if(ventana=="ficha_configuracion"){
    //GUARDAR URL USANDO LOCALSTORAGE EN EL MOVIL
	window.localStorage.url_servidor = document.forms["configuracionForm"].elements["url"].value;
	
	$('#boton_guardar').button("enable");
	ocultar_loader();
	
	mensaje = "¡Nuevo registro guardado con éxito!";
	alert(URLDecode(mensaje));
	
  }
  else{
    //TODOS LOS DEMAS CASOS
    XMLHttpRequestObject.send(cadena_parametros);
  }
  
  //DEFINIR TIMEOUT DE 15 SEGUNDOS PARA LA RESPUESTA AJAX (EXCEPTO PARA EL MAPA QUE PUEDE DEMORAR MAS EN DIBUJARSE)
  if(ventana!="mapa_sucursales" && ventana!="mapa_latitud" && ventana!="lista_sucursales" && ventana!="mapa_sucursales_di"){
    
	if(mobile=="true")
		
		if (ventana!='ficha_galeria_imagenes'){
		myVar=setTimeout(function(){abort_ajax()},15000);
	   }
  }
  else{
	if(ventana=="mapa_sucursales_di"){
		showPopup('popup','Cargando...','SAVE','','cargadorForm');
	 }
    if(nativa==true)
	  //mostrar_loader($('#boton_guardar'));
	  mostrar_loader("Cargando");
  }
  
}

//01.///////////////////////////////////////////////////////////////////////////////////////////////

function triggered_xml_graficos() {

  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {

    //alert("TRIGGERED_XML_GRAFICOS");
    var xml_data = XMLHttpRequestObject.responseXML;
    var text_data = XMLHttpRequestObject.responseText;
    //alert(text_data);

	//DIBUJAR GRAFICO CON LOS DATOS DEL XML (GENERALIZAR EL NOMBRE DE LOS GRAFICOS)
	nombre_grafico_array = new Array("estados_proyectos","aperturas_ano","etapas_proyectos");
	text_data_array = string_to_array(text_data,"#");
	dibujaGraficos(nombre_grafico_array,text_data_array);
	
  }
  
}

//01.///////////////////////////////////////////////////////////////////////////////////////////////

//02.///////////////////////////////////////////////////////////////////////////////////////////////

function triggered_xml() {

  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==404) {
    //NO EJECUTAR TIMEOUT SI LLEGA LA RESPUESTA AJAX
	if(mobile=="true")
      clearTimeout(myVar);
	
	if(document.forms["ventanaForm"].elements["nativa"].value==true)
	  ocultar_loader();
	
	//MOSTRAR EL MENSAJE
    alert_box_type = document.forms["ventanaForm"].elements["alert_box_type"].value;
	mensaje = "Hubo un problema en la conexión (Error 404)";
	 
    //ALERT COMO VENTANA
	if(alert_box_type==0 || document.forms["ventanaForm"].elements["nativa"].value==true)
      alert(URLDecode(mensaje));
    //ALERT COMO DIV CON FONDO NEGRO
    else if(alert_box_type==1)     
      showPopup('popup',URLDecode(mensaje),'ALERT','','','');

	if(document.forms["ventanaForm"].elements["nativa"].value==true)
   	  $('#boton_guardar').button("enable");
	
  }
  
  //SI LA RESPUESTA ES CORRECTA
  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {

    //alert("TRIGGERED_XML");
	
	//NO EJECUTAR TIMEOUT SI LLEGA LA RESPUESTA AJAX
	if(mobile=="true")
      clearTimeout(myVar);

	if(document.forms["ventanaForm"].elements["nativa"].value==true){
      ocultar_loader();
	  //$('#boton_guardar').toggleClass('ui-btn-down-e');
   	  $('#boton_guardar').button("enable");
	}
   
    var xml_data = XMLHttpRequestObject.responseXML;
    var text_data = XMLHttpRequestObject.responseText;
	
	//alert(text_data);
	
    if(text_data=="SESION_EXPIRADA") {
         var a=window.localStorage.getItem('ultima_aplicacion');
         var url = 'http://192.168.1.183/angular/login.php?a='+a;
         alert('Su sesi\xf3n ha expirado');
         document.location.href=url;
       }    
    else if(text_data!="") {

      var xml_root = xml_data.documentElement;
	 
      //CARGAR PARAMETROS GENERALES DEL XML
      existe_ficha = xml_root.attributes.getNamedItem("existe_ficha").nodeValue;
      mensaje = xml_root.attributes.getNamedItem("mensaje").nodeValue;
	  codigo_respuesta = xml_root.attributes.getNamedItem("codigo_respuesta").nodeValue;
      sql = xml_root.attributes.getNamedItem("sql").nodeValue;
      accion = xml_root.attributes.getNamedItem("accion").nodeValue;
      scrollx = xml_root.attributes.getNamedItem("scrollx").nodeValue;
      scrolly = xml_root.attributes.getNamedItem("scrolly").nodeValue;  
	  
	  //CANTIDAD DE ENTIDADES EN SIEMPRE 1 EXCEPTO EN CASO DE FICHA_MERCADERISTA QUE ES 2
	  cant_entidades = xml_root.attributes.getNamedItem("cant_entidades").nodeValue;  
     
      //LOG SQL PARA DEBUG
      log_sql = URLDecode(xml_root.attributes.getNamedItem("log_sql").nodeValue);
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
          var xml_entidad = xml_root.firstChild;
		else if(l==1)
		  var xml_entidad = xml_root.lastChild;
		
	
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
			    //cant_total_registros = xml_root.attributes.getNamedItem("cant_total_registros1").nodeValue;
				cant_total_registros = cant_filas;
			  else
			    //SE DEVUELVE EL TOTAL EN LA PRIMERA ENTIDAD (HAY UN FILTRO Y UN GRID)
                cant_total_registros = xml_root.attributes.getNamedItem("cant_total_registros").nodeValue;
			  
		
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

      var xml_entidad = xml_root.firstChild;
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
		var xml_entidad = xml_root.firstChild;
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
      var xml_entidad = xml_root.firstChild;
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

function triggered_local_caja_xml() {

  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {

    //alert("TRIGGERED_XML_LOCAL_CAJA");
    var xml_data = XMLHttpRequestObject.responseXML;
    var text_data = XMLHttpRequestObject.responseText;
    //alert(text_data);

    var xml_root = xml_data.documentElement;


    //CARGAR PARAMETROS GENERALES XML
    existe_ficha = xml_root.attributes.getNamedItem("existe_ficha").nodeValue;


    id_punto_venta = xml_root.attributes.getNamedItem("id_punto_venta").nodeValue;
    punto_venta = xml_root.attributes.getNamedItem("punto_venta").nodeValue;

    id_caja = xml_root.attributes.getNamedItem("id_caja").nodeValue;
    caja = xml_root.attributes.getNamedItem("caja").nodeValue;

    //mensaje = xml_root.attributes.getNamedItem("mensaje").nodeValue;
    //sql = URLDecode(xml_root.attributes.getNamedItem("sql").nodeValue);
    
    formulario = "localCajaForm";
    ventana_siguiente = document.forms[formulario].var_ventana_siguiente.value;
    host = document.forms["ventanaForm"].host.value;

    if(existe_ficha=="1")
      window.location = "http://"+host+"/aplicacion/window.php?ventana="+ventana_siguiente+"&punto_venta="+id_punto_venta+"&punto_venta_show="+punto_venta+"&caja="+id_caja+"&caja_show="+caja;
    else
      alert("La caja '"+document.forms[formulario].caja.value+"' no existe en el punto de venta '"+document.forms[formulario].punto_venta.value+"'");

  }

}

//03.///////////////////////////////////////////////////////////////////////////////////////////////

//04.///////////////////////////////////////////////////////////////////////////////////////////////

function triggered_select_xml() {

  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {

    //alert("TRIGGERED_SELECT_CAJA");
    var xml_data = XMLHttpRequestObject.responseXML;
    var text_data = XMLHttpRequestObject.responseText;
    //alert(text_data);

    //ABRIR NODO PRINCIPAL DEL XML (GENERAL)
    var xml_root = xml_data.documentElement;
	
	//LOG SQL PARA DEBUG
    log_sql = URLDecode(xml_root.attributes.getNamedItem("var_sql").nodeValue);
    log_sql_array = log_sql.split("^");
    cant_log_sql_array = log_sql_array.length;

    log = "LOG SQL: \r\r"+URLDecode(log_sql_array[0]);

	for(i=1;i<cant_log_sql_array;i++)
      log = log +"\r\r"+ log_sql_array[i];

    //if(log!="LOG SQL: \r\r")
    //  alert(log);
    ////// 
   
    //ABRIR PRIMER NODO SECUNDARIO (ENTIDAD)
    var xml_entidad = xml_root.firstChild;
    cant_filas = xml_entidad.attributes.getNamedItem("cant_filas").nodeValue;
    formulario = xml_entidad.attributes.getNamedItem("formulario").nodeValue;
	

	
	//SUBFORMULARIO
	if(formulario=="informe_punto_ventaForm")
	  campo = xml_root.attributes.getNamedItem("campo_asociado").nodeValue+ "0";
	else
	  campo = xml_root.attributes.getNamedItem("campo_asociado").nodeValue;
	
    var metadata = new Array();
    metadata[0] = "cod_interno";
	
	//SUBFORMULARIO
	if(formulario=="informe_punto_ventaForm")
	  metadata[1] = "id_detalle_promocion";
	else
      metadata[1] = campo;
	
    //alert(formulario+"-"+campo);

		
	
	
    //VACIAR ELEMENTOS ACTUALES DEL SELECT
    document.forms[formulario].elements[campo].options.length=0;

	
    //CARGAR EL SELECT CON UN BLANCO SI ESTA ACTIVA ESA OPCION
    selectbox = document.forms[formulario].elements[campo];
    text = "";
    value = 99;
    addOption(selectbox,text,value);

	//alert(cant_filas);
	
	
	
    //CARGAR EL SELECT
    for(s=0;s<cant_filas;s++) {

      //alert(URLDecode(xml_entidad.getElementsByTagName[metadata[1]].item(s).firstChild.data));
      selectbox = document.forms[formulario].elements[campo];
      text = URLDecode(xml_entidad.getElementsByTagName(metadata[1]).item(s).firstChild.data);
      value = URLDecode(xml_entidad.getElementsByTagName(metadata[0]).item(s).firstChild.data);
      addOption(selectbox,text,value);

    }

    //SI SOLO HAY UNA OPCION EN EL SELECT (ADEMAS DE VACIO) ESA DEBE ELEGIRSE POR DEFAULT
    if(document.forms[formulario].elements[campo].options.length==2 && document.forms[formulario].elements[campo].options[0].text=="")
      document.forms[formulario].elements[campo].selectedIndex = 1;

  }

}

//04.///////////////////////////////////////////////////////////////////////////////////////////////

//05.///////////////////////////////////////////////////////////////////////////////////////////////

function triggered_mapa_xml() {

  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {
    //alert("TRIGGERED_XML_MAPA");
	if(ventana=="mapa_sucursales_di"){
		hidePopup('popup');
	}
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
 
    inicializando(lat,long,mensaje,distancia,mobile,host,xml_root,tipo_key_id);
  }
}

//05.///////////////////////////////////////////////////////////////////////////////////////////////

//06.///////////////////////////////////////////////////////////////////////////////////////////////

function aaa(codigo_local,distancia,latitud_usuario,longitud_usuario,id_cargo,Mercaderista){

  mobile=true;
  server=document.forms["ventanaForm"].elements["host"].value;
  latitud_gps=latitud_usuario;
  longitud_gps=longitud_usuario;
  latitud_punto="";
  longitud_punto="";
  
  //alert(id_cargo);
  //Logica De id_canal mas id cargo ? 
  
  //SUPERVISOR SPM/MAY
  if(id_cargo=="1" || id_cargo=="3")
    ventana="informe_punto_venta";
  //SUPERVISOR COB
  else if(id_cargo=="2")
    ventana="informe_spv_cobertura";

  distancia = parseFloat(Math.round(distancia * 100) / 100).toFixed(1);
  alert('a');
  
  /*html = html + "<br>Código cliente: "+codigo_local;
  infowindow.setContent(html);*/
  //loadContent(mobile,server,codigo_local,latitud_gps,longitud_gps,latitud_punto,longitud_punto,distancia,ventana,Mercaderista);
  
}

//06.///////////////////////////////////////////////////////////////////////////////////////////////

//07.///////////////////////////////////////////////////////////////////////////////////////////////

function triggered_lista_xml2(){

  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200){

    //alert("TRIGGERED_LISTA_XML");
	var xml_data = XMLHttpRequestObject.responseXML;
	var text_data = XMLHttpRequestObject.responseText;
	
	//xml_data = new ActiveXObject("Microsoft.XMLDOM");
    //xml_data.async = false;
    //while(xml_data.readyState != 4) {};
    //xml_data.load("employee.xml");
    //readXML();
	
	//var xml_data = document.implementation.createDocument("","",null);
	//xml_data.load('employee.xml'); // TODO: validate true
	//xml_data.onload = readXML;

    //alert(text_data);
	
	alert(text_data);
	//alert(xml_data);
	
	var xml_root = xml_data.documentElement;

	//NOMBRE DE LA PRIMERA ETIQUETA (ETIQUETA MADRE)
    alert(xml_root.tagName);

	alert(xml_root.attributes.getNamedItem("latitud_usuario").nodeValue);
	
    //CARGAR PARAMETROS GENERALES XML
	//latitud_usuario = xml_root.attributes.getNamedItem("latitud_usuario").nodeValue;
	
	//alert("FIREFOX2"+latitud_usuario);
	
	//longitud_usuario = xml_root.attributes.getNamedItem("longitud_usuario").nodeValue;
	//id_cargo = xml_root.attributes.getNamedItem("id_cargo").nodeValue;
   
	//var xml_entidad = xml_root.firstChild;
    //cant_filas = xml_entidad.attributes.getNamedItem("id").nodeValue;
	//asignacion_informes = xml_entidad.attributes.getNamedItem("asignacion_informes").nodeValue;
	//html2 = "";
	//html = "";
	

	//NOMBRE DE LA PRIMERA ETIQUETA
	alert(xml_root.childNodes[0].tagName);
	
	//VALOR DE LA PRIMERA ETIQUETA
	alert(xml_root.childNodes[0].textContent);
	
	//VALOR DEL ATRIBUTO ID DE LA PRIMERA ETIQUETA
	alert(xml_root.childNodes[0].attributes.getNamedItem("id").nodeValue);

  }

} 
	
//07.///////////////////////////////////////////////////////////////////////////////////////////////

//08.///////////////////////////////////////////////////////////////////////////////////////////////
	
function triggered_lista_xml(){

  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200){

    //alert("TRIGGERED_LISTA_XML");
	var xml_data = XMLHttpRequestObject.responseXML;
    var text_data = XMLHttpRequestObject.responseText;
    //alert(text_data);

	if(document.forms["ventanaForm"].elements["nativa"].value==true)
	  ocultar_loader();
	
	var xml_root = xml_data.documentElement;

    //CARGAR PARAMETROS GENERALES XML
	latitud_usuario = xml_root.attributes.getNamedItem("latitud_usuario").nodeValue;
	longitud_usuario = xml_root.attributes.getNamedItem("longitud_usuario").nodeValue;
	id_cargo = xml_root.attributes.getNamedItem("id_cargo").nodeValue;
   
	var xml_entidad = xml_root.firstChild;
    cant_filas = xml_entidad.attributes.getNamedItem("cant_filas").nodeValue;
	asignacion_informes = URLDecode(xml_entidad.attributes.getNamedItem("asignacion_informes").nodeValue);
	
	html2 = "";
	html = "";
	
	for(i=0;i<cant_filas;i++){
				cod_interno = URLDecode(xml_entidad.getElementsByTagName("cod_interno").item(i).firstChild.data);		
				id_canal = URLDecode(xml_entidad.getElementsByTagName("id_canal").item(i).firstChild.data);		
				codigo_local = URLDecode(xml_entidad.getElementsByTagName("codigo_local").item(i).firstChild.data);		
				latitud_gps = URLDecode(xml_entidad.getElementsByTagName("latitud_gps").item(i).firstChild.data);		
				longitud_gps = URLDecode(xml_entidad.getElementsByTagName("longitud_gps").item(i).firstChild.data);		
				denominacion = URLDecode(xml_entidad.getElementsByTagName("denominacion").item(i).firstChild.data);		
				distancia = URLDecode(xml_entidad.getElementsByTagName("distancia").item(i).firstChild.data);		
				
				var comillas = "'";
				var codI =comillas +cod_interno+ comillas;
				var idcana =comillas +id_canal+ comillas;
				var codLoc =comillas +codigo_local+ comillas;
				var latgp =comillas +latitud_gps+ comillas;
				var longp =comillas +longitud_gps+ comillas;
				var dem =comillas +denominacion+ comillas;
				var distam =comillas +distancia+ comillas;
								
				
				html2 = html2 + '<li> <a onclick="RellenaPopup('+codI+' , '+idcana+' , '+codLoc+','+latgp+','+longp+','+dem+','+distam+');">';
				html2 = html2 + '</h2>'+codigo_local+'</h2>';
				html2 = html2 + '<h2>'+denominacion+'</h2>';
				html2 = html2 + '<p>Distancia: '+ parseFloat(Math.round(distancia * 100) / 100).toFixed(1) +' Km.</p>';
				html2 = html2 + '</a></li>';
			/*FIN CREACION DE LA LISTA*/
	}
	document.getElementById("lista_sucursales").innerHTML = html2;
	$('#lista_sucursales').listview('refresh');
  }

}
//08.///////////////////////////////////////////////////////////////////////////////////////////////

//09.///////////////////////////////////////////////////////////////////////////////////////////////
//ESTE ES EL EVENTO CLIC DE LA LISTA QUE GENERA EL POPUP CON EL CUADRO BLANCO
  
  
function RellenaPopup(cod_interno,id_canal,codigo_local,latitud,longitud,denominacion,distancia){
mobile=true;
host=document.forms["ventanaForm"].elements["host"].value;
cod_interno = URLDecode(cod_interno); 
				codigo_local = URLDecode(codigo_local);
				ventana = document.forms["ventanaForm"].elements["ventana"].value;
				var html = '';
				var aplicacion = document.forms["ventanaForm"].elements["aplicacion"].value;
				var id_canal = URLDecode(id_canal);
				comuna ='';
				id_sucursal_cliente ='';
				denominacion ='';
				distancia = myRound(URLDecode(distancia),1);
				latround = '';
				longround = '';
				latitud_gps=URLDecode(latitud);
				longitud_gps=URLDecode(longitud);
				var token_sesion = window.sessionStorage.getItem("token_sesion");
				
			servidor = "http://"+host+"/aplicacion/BusinessLogic/mapa/consulta_datos_punto.php";	
			$.post(servidor,
			{
				cod_interno:cod_interno,ventana:ventana,aplicacion:aplicacion,id_canal:id_canal,distancia:distancia,
				mobile:mobile,host:host,comuna:comuna,codigo_local:codigo_local,id_sucursal_cliente:id_sucursal_cliente,denominacion:denominacion,lat:latitud_gps,long:longitud_gps,
				latround:latround,longround:longround,token_sesion:token_sesion
			}, 
			function(data){
				document.getElementById("DataPopUp").innerHTML = data;
				$( "#PopupLoginLista" ).popup( "open");							
			});


}

//09.///////////////////////////////////////////////////////////////////////////////////////////////

//10.///////////////////////////////////////////////////////////////////////////////////////////////

function triggered_xml2(){
	if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) 
	{
	
		if(mobile=="true")
		clearTimeout(myVar);
		var xml_data = XMLHttpRequestObject.responseXML;
		var text_data = XMLHttpRequestObject.responseText;
			//alert(text_data);
		if(text_data!="") 
		{
			var xml_root = xml_data.documentElement;
			existe_ficha = xml_root.attributes.getNamedItem("existe_ficha").nodeValue;
			mensaje = xml_root.attributes.getNamedItem("mensaje").nodeValue;
			//alert(URLDecode(mensaje));
			var Id = document.getElementById('var_OfflineDelete').value;
			document.getElementById('var_OfflineDelete').value='';
			
					var db = openDatabase('IPDV', '1.0', '', 3 * 1024 * 1024);
					db.transaction(function (tx) {
					tx.executeSql('SELECT * FROM IPDV order by id desc limit 1', [], function (tx, results) {
					var Termino = results.rows.item(0).id;
						if(Id != Termino){
							sincronizacion();
						}
						else{
							alert(Termino+' Registro(s) sincronizados con \xe9xito');
							document.getElementById('var_cantidadOff').innerHTML='<b>Cantidad de registros : 0</b>';
							sincronizaimg();
							ocultar_loader();
						}
					});
				});
			deleteData(Id,'IPDV');	
		}
	}
		
}

//10.///////////////////////////////////////////////////////////////////////////////////////////////

//11.///////////////////////////////////////////////////////////////////////////////////////////////

function ResponseFoto(){
	if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {
	if(mobile=="true")
	clearTimeout(myVar);
	var Id = document.getElementById('var_OfflineDeleteImg').value;
	var xml_data = XMLHttpRequestObject.responseXML;
	var text_data = XMLHttpRequestObject.responseText;
		if(text_data==1){
			deleteImg(Id,'Fotos');	
		}
	}
}

//11.///////////////////////////////////////////////////////////////////////////////////////////////

//12.///////////////////////////////////////////////////////////////////////////////////////////////

function sincronizaimg(){
			var db = openDatabase('IPDV', '1.0', '', 3 * 1024 * 1024);
			db.transaction(function (tx) {
				tx.executeSql('SELECT * FROM Fotos', [], function (tx, results) {
					var len = results.rows.length, i;
					//alert(len)
					if(len>0)
					{ 
							var id = results.rows.item(0).id;
							//alert(id)
							var fecha = results.rows.item(0).fecha;
							var tipoinforme = results.rows.item(0).tipoinforme;
							var campo = results.rows.item(0).campo;
							var idsucursal = results.rows.item(0).idsucursal;
							var user = results.rows.item(0).user;
							var codlocal = results.rows.item(0).codlocal;
							
							var nombrearchivo = results.rows.item(0).nombrearchivo;
							var tipoarchivo = results.rows.item(0).tipoarchivo;
							var tamano = results.rows.item(0).tamano;
							var data = results.rows.item(0).data;
							var cadena_valores = 'DataTotal='+fecha+'|||'+tipoinforme+'|||'+campo+'|||'+idsucursal+'|||'+user+'|||'+codlocal+'|||'+nombrearchivo+'|||'+tipoarchivo+'|||'+tamano+'|||'+data;
							document.getElementById('var_OfflineDeleteImg').value=id;		
								
							loadurl_xml('FotoOffline.php',cadena_valores,ResponseFoto);
					}
										
				});
	});
}

//12.///////////////////////////////////////////////////////////////////////////////////////////////

//13.///////////////////////////////////////////////////////////////////////////////////////////////

function deleteImg(Id,Tabla){
var db = openDatabase('IPDV', '1.0', '', 3 * 1024 * 1024);
	db.transaction(function (tx) {
	tx.executeSql('delete from  '+Tabla+' where id = '+Id);
	sincronizaimg();
	});
}	

//13.///////////////////////////////////////////////////////////////////////////////////////////////

//14.///////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////local cerrado

function triggered_xml_cerrado() {

  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {

    //alert("TRIGGERED_XML_GRAFICOS");
    var xml_data = XMLHttpRequestObject.responseXML;
    var text_data = XMLHttpRequestObject.responseText;
    //alert(text_data);
	if(text_data=='1'){
		alert('¡Nuevo registro guardado con éxito!');
	}else if(text_data=='2'){
		alert('¡Ya se encuentra cerrado este local!');
	}
		ocultar_loader();
		infowindow.close();
	
  }
  
}

//14.///////////////////////////////////////////////////////////////////////////////////////////////

//15./////////////////////////////////////////////////////////////////////////////////////////////

function FiltroMapa(Tipo){
    //token_sesion = window.sessionStorage.getItem("token_sesion");
var token_sesion = window.sessionStorage.getItem("token_sesion"); 
 var Valor = document.getElementById('seleccion_idcanal').value;
 //window.location.href = "../aplicacion/window.php?ventana=mapa_sucursales&"+Tipo+"="+Valor+"";

 cadena_parametros = "tipo_key_id=ID_USUARIO&cod_interno=&id_canal="+Valor+"&ventana=mapa_sucursales&token_sesion="+token_sesion;
 loadurl_xml("mapa/action_buscar_sucursales.php",cadena_parametros,triggered_mapa_xml);
}

//15./////////////////////////////////////////////////////////////////////////////////////////////

//16./////////////////////////////////////////////////////////////////////////////////////////////

/////////////////Cambio latitud longitud

function triggered_mapa_Lat_Long() {

  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {

    /*alert("TRIGGERED_XML_GRAFICOS");
	var xml_data = XMLHttpRequestObject.responseXML;
	var text_data = XMLHttpRequestObject.responseText;	*/
	hidePopup('popup');

  }
  
}

//16./////////////////////////////////////////////////////////////////////////////////////////////

//17./////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////DRAWING

function triggered_mapa_xml2() {
//alert(XMLHttpRequestObject.readyState+'-'+XMLHttpRequestObject.status)
  if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200){
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
 
    InicializedMapaFilter(lat,long,mensaje,distancia,mobile,host,xml_root,tipo_key_id);
  }
}

//17./////////////////////////////////////////////////////////////////////////////////////////////

//18./////////////////////////////////////////////////////////////////////////////////////////////

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
		
     } 
}

//19./////////////////////////////////////////////////////////////////////////////////////////////

//20./////////////////////////////////////////////////////////////////////////////////////////////

function triggered_mapa_delete() {

	if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {
		hidePopup('popup');
		var xml_data = XMLHttpRequestObject.responseXML;
		var text_data = XMLHttpRequestObject.responseText;
		if(text_data==1){
			alert('Poligono eliminado correctamente.');
			filtromapa();
		}
    } 
}

//20./////////////////////////////////////////////////////////////////////////////////////////////

//21./////////////////////////////////////////////////////////////////////////////////////////////

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

//23./////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////GALERIA IMAGENES////////////////////////////
function triggered_html(){
	if (XMLHttpRequestObject.readyState==4 && XMLHttpRequestObject.status==200) {
		var text_data = XMLHttpRequestObject.responseText;
		var General = '';
		
		var primario = 0;
		var secundario = 0;
		var total = 0;
		
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
		
		General = data[0];
		document.getElementById('divcantidadgaleria').style.display="block";
	if(data[1]>0){	
	//TOTAL DE REGISTROS INNERHTML	
	document.getElementById('divcantidadgaleria').innerHTML='Mostrando '+primario+' al '+secundario+' de un total de '+data[1]+'';
	//TOTAL DE REGISTROS INNERHTML
	}else{
	document.getElementById('divcantidadgaleria').innerHTML='No existen registros';
	}
	
	
	document.getElementById('divgaleriaimg').innerHTML=General;
    }
}

//23./////////////////////////////////////////////////////////////////////////////////////////////