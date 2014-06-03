//INDICE DE FUNCIONES (capa MARKUP LOGIC)

//LOGICA NEGOCIO

//01. validar_datos
//02. guardar_ficha(enviar_mail_tarea) => nulo - [PROCESO GUARDAR]
//03. eliminar_ficha(formulario) => nulo - [PROCESO ELIMINAR]
//04. buscar_ficha
//05. key_buscar_ficha
//13. volver_a_padre
//35. ver_documento
//36. limpiarCampos
//41. f_open_window_max
//49. editar_tarea(fila,host,form_grid,ventana_destino,tarea)

//AJAX (loadurl_xml)

//28. buscar_lista (paginador)
//31. cargar_Ventana
//32. 
//50. enviar_clave_al_mail
//51. cargar_selectbox_asociado
//57. probar_cron

//PARTICULAR CLIENTES

//06. definirCampoFoco
//07. enviar_mail(fila,servidor,formulario)
//08. camposFichaVacia
//09. camposFichaObligatorios(formulario) => true=campos obligatorios ingresados; false=campos obligatorios no ingresados
//10. activarDesactivarCamposId
//11. crearCadenaValoresFicha(formulario, id_fila) => cadena_valores
//12. abrir_ventana_ficha (ex-nuevo)
//14. datos_a_padre
//15. crearCadenaValoresAdicionalesFicha(formulario, id_fila) => cadena_valores_adicionales
//16. campoEsKeyId
//17. camposKeyIdDistintoVacio
//18. editar (SOLO GRID)
//19. calcular_total_fila
//20. cargar_datos_ficha
//21. 
//22. validar_campo_calculo
//23. calcular_total_grid
//24. calcular_vuelto
//25. validar_id_unico
//26. 
//27. calcular_iva_total
//29. 
//30. 
//33. calcular_caja_final_teorica
//34. calcular_diferencia
//37. limpiar
//38. select_box
//39. ventanaBuscar
//40. poblar_scroller
//42. exportar_a_excel_php	
//43. cambiar_numero_boleta
//44. crear_tarea_hija(host)
//45. ver_tarea_padre(host)
//46. ver_tareas_hijas(fila) 
//47. ver_tarea_padre_grid(fila)
//48. mostrar_ocultar_campos(fila)
//52. file_upload
//53. enviar_mail
//54. auto_check
//55. editar2
//56. check
//65. Ofline


//01.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA NEGOCIO: validar campos de un formulario
//20.10.2013 GPS

function validar_datos(formulario,campo_actual,validacion,campo_id,id_fila) {

  //alert(formulario+"-"+campo_actual+"-"+validacion+"-"+campo_id+"-"+id_fila);

  if(formulario=="") {
    //alert("Falta parametrizar el formulario");
  }
  else {
  
    //SI ES OBLIGATORIO, TIENE FONDO ROJO Y HAY ALGUN VALOR ESCRITO, QUITAR EL FONDO ROJO
	//if(document.forms[formulario].elements[campo_actual].value!='')
    //  document.forms[formulario].elements[campo_actual].style.background="#eeeded";
  
    //alert(validacion);
  
    //SIEMPRE QUE SEA UN NUMERO QUITAR CEROS A LA IZQUIERDA
    if(validacion=="NUMERO_DECIMAL" || validacion=="NUMERO_ENTERO"){
	  //SOLO SI ES DISTINTO DE CERO, CASO CONTRARIO LO QUE HACE ES BORRAR EL CERO Y NO PERMITE GUARDAR SI EL CAMPO ES OBLIGATORIO
	  if(document.forms[formulario].elements[campo_actual].value!="0")
        document.forms[formulario].elements[campo_actual].value = quitar_ceros_a_la_izquierda(document.forms[formulario].elements[campo_actual].value);
    }

    ventana = document.forms[formulario].var_ventana.value;

    //SI EL CAMPO ACTUAL ES DISTINTO DE VACIO
    if(document.forms[formulario].elements[campo_actual].value!='') {

      //validar el formato y contenido del campo.
      if(validacion=='RUT') 
        validado = validar_rut(formulario,campo_actual,document.forms[formulario].elements[campo_actual].value);
      else if(validacion=='EMAIL')
        validado = validar_email(formulario,campo_actual,document.forms[formulario].elements[campo_actual].value);
      else if(validacion=='NUMERO_ENTERO') 
        validado = validar_numero_entero(formulario,campo_actual,document.forms[formulario].elements[campo_actual].value);
      else if(validacion=='FECHA')
        validado = validar_fecha(formulario,campo_actual,document.forms[formulario].elements[campo_actual].value);
      else if(validacion=='CODIGOBARRAS')
        validado = validar_codigobarras(formulario,campo_actual,document.forms[formulario].elements[campo_actual].value); 
      else if(validacion=='HORA_HHMM')
        validado = validar_hora_hhmm(formulario,campo_actual,document.forms[formulario].elements[campo_actual].value); 
      else if(validacion=='NUMERO_DECIMAL')
        validado = validar_numero_decimal(formulario,campo_actual,document.forms[formulario].elements[campo_actual].value); 
	  else if(validacion=='PROYECTO_COPEC')
        validado = validar_proyecto_copec(formulario,campo_actual,document.forms[formulario].elements[campo_actual].value); 
	  else if(validacion=='ESTACION_COPEC')
        validado = validar_estacion_copec(formulario,campo_actual,document.forms[formulario].elements[campo_actual].value); 
      else if(validacion=='' || validacion==0)
        validado = true;

	  //alert(validado);
		
      //DETECTAR SI EL CAMPO ACTUAL ES UN KEY_ID
      campo_actual_es_id = campoEsKeyId(campo_actual,campo_id,id_fila);

	  //alert(campo_actual +"-"+ campo_id);
	  
      if(campo_actual_es_id==true && validado==true) {

	  //alert(campos_id_array_2.length);
	  
        //si key_id esta compuesto por más de un campo, si todos los campos contienen valores entonces buscar (esta variable esta en la función CampoEsKeyId)
        if(campos_id_array_2.length>1) {

          key_id_completo = camposKeyIdDistintoVacio(campo_actual,campo_id,formulario,id_fila); 

          if(key_id_completo==true)
            key_buscar_ficha(formulario,campo_actual,id_fila); 

        }
        //si key_id esta compuesto por solo un campo, buscar
        else {
          //alert("BUSCAR");
          key_buscar_ficha(formulario,campo_actual,id_fila); 
        }
 
      }
      else if(campo_actual=="descuentos" || campo_actual=="cargos"){
        calcular_iva_total(campo_actual,formulario);
      }
      else if(campo_actual=="efectivo" || campo_actual=="cheque" || campo_actual=="debito" || campo_actual=="credito" || campo_actual=="nota_credito"){
        calcular_vuelto(formulario);
      }
      //CIERRE DE CAJA
      else if(campo_actual=="retiroefectivo"){
        calcular_caja_final_teorica();
        calcular_diferencia();
      }
      //CIERRE DE CAJA
      else if(campo_actual=="cajafinalreal"){
        calcular_caja_final_teorica();
        calcular_diferencia();
      }



      //ACTUALIZAR VALORES EN EL GRID AL DEJAR EL CAMPO ACTUAL
      if(id_fila!="") {
        if((campo_actual=='cant'+id_fila || campo_actual=='descuento'+id_fila || campo_actual=='costo'+id_fila) && validado==true) {
          calcular_total_fila(formulario,id_fila);
          calcular_total_grid(formulario);
          calcular_vuelto(formulario); 
        }    
      }  


      //PARA CAMPOS CALCULADOS (FICHA COTIZACION), FALTA GENERALIZAR
      if(validado==true) {

        campo_resultado = "sub_total";
        campo_formula1 = "horas";
        campo_formula2 = "precio";

        if(campo_actual==campo_formula1 || campo_actual==campo_formula2) {
          if(document.forms[formulario].elements[campo_formula1].value!="" && document.forms[formulario].elements[campo_formula2].value!="")
            document.forms[formulario].elements[campo_resultado].value = document.forms[formulario].elements[campo_formula1].value * document.forms[formulario].elements[campo_formula2].value;
          else
            document.forms[formulario].elements[campo_resultado].value = "";
        } 

        campo_resultado = "total";
        campo_formula3 = "sub_total";
        campo_formula4 = "descuento";

        //LOS CAMPOS 1 y 2 INCIDEN EN EL RESULTADO, POR LO QUE SI CAMBIAN SE DEBE RECALCULAR TODO
        if(campo_actual==campo_formula1 || campo_actual==campo_formula2 || campo_actual==campo_formula3 || campo_actual==campo_formula4) {

          if(document.forms[formulario].elements[campo_formula3].value!="" && document.forms[formulario].elements[campo_formula4].value!="")
            document.forms[formulario].elements[campo_resultado].value = document.forms[formulario].elements[campo_formula3].value * (1 - document.forms[formulario].elements[campo_formula4].value/100);
          else
            document.forms[formulario].elements[campo_resultado].value = "";
        } 

      } 


    }
    //SI EL CAMPO ACTUAL ES VACIO
    else {
	

      //CUANDO SE BORRA EL CAMPO ID LIMPIAR LA FICHA Y DEJARLA EN BLANCO
      if(campo_actual==campo_id) {
        limpiar(formulario,campo_id,id_fila); 
      }

      //SI EL CAMPO POSEE UN VALOR DEFAULT, ESCRIBIRLO EN PANTALLA
      if(document.forms[formulario].var_valor_default.value!="") {
        metadata_string = document.forms[formulario].var_metadata.value;
        valor_default_string = document.forms[formulario].var_valor_default.value;

        campo_actual_sin_id_fila = campo_actual.replace(id_fila,"");
        col_campo_actual = buscar_id(campo_actual_sin_id_fila,string_to_array(metadata_string,"^"));
        valor_default_array = string_to_array(valor_default_string,"^");

        if(valor_default_array[col_campo_actual]!="") {
          if(valor_default_array[col_campo_actual]=="cero")
            valor_default = "0";
          else if(valor_default_array[col_campo_actual]=="cantidad_default")
            valor_default = "1";
        }
      else {
          valor_default = "";
        }

        document.forms[formulario].elements[campo_actual].value = valor_default;


      }

      //PARA QUE SI DEJO EN BLANCO EL MONTO LUEGO DE PONERLE EL VALOR DEFAULT CALCULE NUEVAMENTE 
      if(campo_actual=="efectivo" || campo_actual=="cheque" || campo_actual=="debito" || campo_actual=="credito" || campo_actual=="nota_credito"){
        calcular_vuelto(formulario);
      }
      else if(campo_actual=="descuentos" || campo_actual=="cargos"){
        calcular_iva_total(campo_actual,formulario);
      }

      //CALCULOS VARIOS DEL GRID
      if(document.forms[formulario].var_tipo_estructura.value=="grid") {

        if(campo_actual=="descuentos" || campo_actual=="cargos"){
          calcular_iva_total(campo_actual,formulario);
        }
        else if(campo_actual=="pago"){
          calcular_vuelto(formulario);
        }

        if(ventana!="liquidacion") {

          if((campo_actual=='cant'+id_fila || campo_actual=='descuento'+id_fila || campo_actual=='codigobarras'+id_fila)) {
            calcular_total_fila(formulario,id_fila);
            calcular_total_grid(formulario);
            calcular_vuelto(formulario); 
          }

        }

      }


      //PARA CAMPOS CALCULADOS (FICHA COTIZACION), FALTA GENERALIZAR
      if(validado==true) {

        campo_resultado = "sub_total";
        campo_formula1 = "horas";
        campo_formula2 = "precio";

        if(campo_actual==campo_formula1 || campo_actual==campo_formula2) {
          if(document.forms[formulario].elements[campo_formula1].value!="" && document.forms[formulario].elements[campo_formula2].value!="")
            document.forms[formulario].elements[campo_resultado].value = document.forms[formulario].elements[campo_formula1].value * document.forms[formulario].elements[campo_formula2].value;
          else
            document.forms[formulario].elements[campo_resultado].value = "";
        } 

        campo_resultado = "total";
        campo_formula3 = "sub_total";
        campo_formula4 = "descuento";

        //LOS CAMPOS 1 y 2 INCIDEN EN EL RESULTADO, POR LO QUE SI CAMBIAN SE DEBE RECALCULAR TODO
        if(campo_actual==campo_formula1 || campo_actual==campo_formula2 || campo_actual==campo_formula3 || campo_actual==campo_formula4) {

          if(document.forms[formulario].elements[campo_formula3].value!="" && document.forms[formulario].elements[campo_formula4].value!="")
            document.forms[formulario].elements[campo_resultado].value = document.forms[formulario].elements[campo_formula3].value * (1 - document.forms[formulario].elements[campo_formula4].value/100);
          else
            document.forms[formulario].elements[campo_resultado].value = "";
        } 

      } 


    }
  }
}

//01.///////////////////////////////////////////////////////////////////////////////////////////////

//02.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA NEGOCIO: guardar un formulario
//20.10.2013 GPS

function guardar_ficha(enviar_mail_tarea,formulario,nativa) {

  ventana = document.forms[formulario].var_ventana.value;
  IdSucursal = document.forms[formulario].var_id_sucursal.value;


  //alert("BOTON_GUARDAR: "+enviar_mail_tarea+"-"+formulario+"-"+nativa);

  //1.-VALIDAR QUE TODAS LAS ENTIDADES DE LA VENTANA QUE SE DEBAN GUARDAR, TENGAN TODOS LOS CAMPOS OBLIGATORIOS DISTINTOS DE VACIO
  if(formulario!="")
    entidades_ventana_array = [formulario];
  else
    entidades_ventana_array = string_to_array(document.forms["ventanaForm"].nombre_forms_string.value,"^");
   
  cant_entidades_ventana = entidades_ventana_array.length;
 
  m = 0;
  validar_entidad = true;
  cadena_valores = "";

 
  
  //PARA CADA UNA DE LAS ENTIDADES DE LA VENTANA QUE SE DEBA GUARDAR
  while(m<cant_entidades_ventana && validar_entidad==true) {

    formulario = entidades_ventana_array[m];
	//alert(formulario);
	
	
	validar_entidad = camposFichaObligatorios(formulario);
    
	
	//validar_entidad = true;
    cadena_valores = cadena_valores + crearCadenaValoresFicha(formulario,"");
	//alert(cadena_valores);
    if(validar_entidad==false) {
      //<JasobNoObfsStr>
        //MOSTRAR EL MENSAJE DEVUELTO POR EL SERVER
	    mensaje = "Debe ingresar todos los campos obligatorios";
		if(nativa==true)
		  alert(mensaje);
		else if(nativa==false)
	      alert_pro(mensaje);
		 //</JasobNoObfsStr>
    }

  m=m+1;
  }
  //1.-FIN
  //alert(validar_entidad);
  //alert(cadena_valores);
  

  //2.-SI TODOS LOS FORMULARIOS DE LA VENTANA QUE SE DEBEN GUARDAR CONTIENEN VALORES EN TODOS LOS CAMPOS OBLIGATORIOS
  if(validar_entidad==true) {
    //2.1.-CASO PARTICULAR BOLETA DE VENTA: VALIDAR QUE EL PAGO INGRESADO EN LA BOLETA DE VENTA SEA MAYOR AL MONTO DE LA VENTA (EL DINERO ES SUFICIENTE)
    if(document.forms[formulario].var_ventana.value=="boleta") {

      if(parseInt(document.forms["formaPagoForm"].efectivo.value)>0 || parseInt(document.forms["formaPagoForm"].cheque.value)>0 || parseInt(document.forms["formaPagoForm"].debito.value)>0 || parseInt(document.forms["formaPagoForm"].credito.value)>0 || parseInt(document.forms["formaPagoForm"].nota_credito.value)>0) {

        document.forms[formulario].var_accion.value='boton_guardar';
        cadena_valores = cadena_valores + crearCadenaValoresAdicionalesFicha(formulario,"");
	
        //tipo_estructura = document.forms[formulario].elements["var_tipo_estructura"].value;

        //if(tipo_estructura=="ficha")
          loadurl_xml('PageLogicPHP.php',cadena_valores,triggered_xml);
        //else
          //loadurl_xml('PageLogicPHP.php',cadena_valores,triggered_xml);

      }
      else
        alert("El pago ingresado es menor al monto de la compra.");

    }
    //2.1.-FIN

	//2.2.-CASO PARTICULAR COPEC VALIDAR FECHA DE TERMINO ANTES DE CERRAR UNA TAREA
	else if(document.forms[formulario].var_ventana.value=="ficha_fecha_termino_tarea"){
	  
	  fecha_inicio = document.forms["fecha_termino_tareaForm"].elements["fecha_inicio"].value;
	  fecha_termino = document.forms["fecha_termino_tareaForm"].elements["fecha_termino"].value;
		
	  if(fecha_termino.substr(4,1)=="-");
	    fecha_termino = fecha_termino.substr(8,2)+"/"+fecha_termino.substr(5,2)+"/"+fecha_termino.substr(0,4);
		
	  //alert(fecha_inicio+"-"+fecha_termino);
		
	  if(string_a_fecha_mysql(fecha_inicio)<=string_a_fecha_mysql(fecha_termino)){
	  
	    tipo_fecha_termino = document.forms["fecha_termino_tareaForm"].elements["tipo_fecha_termino"].value;
	    mensaje = "Tarea se cerrará con fecha: "+fecha_termino;
	  
	    //SI ES UNA FECHA DE CIERRE REAL O DE CIERRE ESTIMADA, PEDIR CONFIRMAR EL CIERRE DE LA TAREA
	    if(tipo_fecha_termino=="1" || tipo_fecha_termino=="4"){
	      //showPopup('popup',URLDecode(mensaje),'CONFIRM','',formulario);
		  
		  var r=confirm(URLDecode(mensaje));
		  
		  if (r==true){
		    confirmar(formulario,'');
		  }
		 
		  
	    }
	    //SI ES UNA FECHA COMPROMETIDA, SOLO GUARDAR
	    else if(tipo_fecha_termino=="2"){
	      //CREAR EL STRING CON LOS DATOS A SER ENVIADOS AL ARCHIVO PHP
          document.forms[formulario].var_accion.value='boton_guardar';
          cadena_valores = cadena_valores + crearCadenaValoresAdicionalesFicha(formulario,"");
          cadena_valores = cadena_valores + "&enviar_mail_tarea=" + enviar_mail_tarea;
          loadurl_xml('PageLogicPHP.php',cadena_valores,triggered_xml);
	    }
	  
	  }
	  else{
	    alert_pro("Fecha de término no puede ser anterior a fecha de inicio");
	  }
	
	}
	//2.2.-FIN

    //2.3.-PARA TODOS LOS CASOS (EXCEPTO BOLETA DE VENTA Y FECHA DE TERMINO COPEC)
    else {

      //CREAR EL STRING CON LOS DATOS A SER ENVIADOS AL ARCHIVO PHP
      document.forms[formulario].var_accion.value='boton_guardar';
      cadena_valores = cadena_valores + crearCadenaValoresAdicionalesFicha(formulario,"");
	  
      cadena_valores = cadena_valores + "&enviar_mail_tarea=" + enviar_mail_tarea;
	  if (ventana=='informe_punto_venta' || ventana =='informe_punto_venta_spm'){
	    var TipoIngreso = '';
		  if(document.forms[formulario].var_tipoComunicacion.value==0){
			TipoIngreso = document.forms[formulario].var_on_of.value;
		  }
		  else{
		    TipoIngreso = document.forms[formulario].var_tipoComunicacion.value;	
		  }
	  }
	  else{
		TipoIngreso = 1;
	  }
	  
	  //Online O Ofline mas time envio
	  var f = new Date();
	  Fecha = f.getFullYear()+"-"+(f.getMonth() +1)+"-"+f.getDate()+" "+f.getHours()+":"+f.getMinutes()+":"+f.getSeconds();
		
	  //COMUNICACION ONLINE
	  if(TipoIngreso==1){
	 
		if(nativa==true){
		  //alert(cadena_valores);
	      
          $('#boton_guardar').button("disable");
	      mostrar_loader("Guardando...");
          var token = window.sessionStorage.getItem("token_sesion");
		  cadena_valores = cadena_valores+'&id_formato_envio=1&fecha_hora_envia='+Fecha+'&token_sesion='+token;
		  loadurl_xml('PageLogicPHP.php',cadena_valores,triggered_xml);          
	    } 
	    else if(nativa==false){ 
	      mensaje = "Guardando...";
	      showPopup('popup',URLDecode(mensaje),'SAVE','',formulario);
        } 
		//var token = window.sessionStorage.getItem("token_sesion");
		//cadena_valores = cadena_valores+'&id_formato_envio=1&fecha_hora_envia='+Fecha+'&token_sesion='+token;
        //loadurl_xml('PageLogicPHP.php',cadena_valores,triggered_xml);
        
	  }
	  //COMUNICACION OFFLINE
	  else if(TipoIngreso==2){
		cadena_valores = cadena_valores+'&id_formato_envio=2&fecha_hora_envia='+Fecha;
		IngresoDataOfline(cadena_valores,'IPDV','IPDV',ventana,IdSucursal);
	  }
	  //COMUNICACION ONLINE/OFFLINE
	  else if(TipoIngreso==3){
		if(!window.navigator.onLine){
		  cadena_valores = cadena_valores+'&id_formato_envio=2&fecha_hora_envia='+Fecha;
		  IngresoDataOfline(cadena_valores,'IPDV','IPDV',ventana,IdSucursal);
		}
		else{
		  $('#boton_guardar').button("disable");
		  mostrar_loader("Guardando...");
          var token = window.sessionStorage.getItem("token_sesion");
		  cadena_valores = cadena_valores+'&id_formato_envio=1&fecha_hora_envia='+Fecha+'&token_sesion='+token;
		  loadurl_xml('PageLogicPHP.php',cadena_valores,triggered_xml);
		  //sincronizacion();
		}
	  } 
	  //COMUNICACION OFFLINE/ONLINE
	  else if(TipoIngreso==4){
	    cadena_valores = cadena_valores+'&id_formato_envio=2&fecha_hora_envia='+Fecha;
		IngresoDataOfline(cadena_valores,'IPDV','IPDV',ventana,IdSucursal);
	  } 
	   
    } 
    //2.3-FIN

  }
  //2.-FIN

}

//02.///////////////////////////////////////////////////////////////////////////////////////////////

//03.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA NEGOCIO: eliminar un formulario
//20.10.2013 GPS

function eliminar_ficha(_formulario) {

  //alert("BOTON_ELIMINAR: "+_formulario);

  //SI EL FORMULARIO ESTA VACIO
  if(camposFichaVacia(_formulario,"")==true) {
    abrirVentana("¡Debe ingresar al menos un valor para eliminar!");
	_metadata = string_to_array(document.forms[_formulario].elements["var_metadata"].value,"^"); 
    setFocus(_metadata[0]);
  }

  //SI EL FORMULARIO NO ESTA VACIO
  else {

    //<JasobNoObfs>
    if(isset(document.forms[_formulario].estado)==true) {
 
      if(document.forms[_formulario].estado.value==0)
      //</JasobNoObfs>
        _ventana_check = abrirVentanaConfirmar("No se puede eliminar directamente una ficha activa.\n¿Desea desactivar la ficha?");
      else
        _ventana_check = abrirVentanaConfirmar("Seguro desea eliminar la ficha?");

    }
    else 
      _ventana_check = abrirVentanaConfirmar("Seguro desea eliminar la ficha?");
    
    if(_ventana_check) {
      document.forms[_formulario].var_accion.value='boton_eliminar';
      _cadena_valores = crearCadenaValoresFicha(_formulario,""); 
      _cadena_valores = _cadena_valores + crearCadenaValoresAdicionalesFicha(_formulario,"");
      loadurl_xml('PageLogicPHP.php',_cadena_valores,triggered_xml);
    }

  }

}

//03.///////////////////////////////////////////////////////////////////////////////////////////////


//04.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA NEGOCIO: buscar un formulario
//20.10.2013 GPS

function buscar_ficha(_formulario,_server){

  //alert("BOTON_BUSCAR: "+_formulario+"-"+_server);

  _tipo_uso_formulario = document.forms[_formulario].elements["var_tipo_uso_formulario"].value;
  _metadata = string_to_array(document.forms[_formulario].elements["var_metadata"].value,"^"); 

  //SI EL FORMULARIO ESTA VACIO (SE PERMITE QUE SEA VACIO EL FILTRO, SOLO CUANDO ES UN INFORME CON GRAFICOS)
  if(camposFichaVacia(_formulario,"")==true && _tipo_uso_formulario!="grafico"){
	//alert_pro("¡Debe ingresar al menos un valor para buscar!");
	alert("¡Debe ingresar al menos un valor para buscar!");
  }

  //SI EL FORMULARIO NO ESTA VACIO
  else {

    if(document.forms[_formulario].elements["var_tipo_estructura"].value=="filtro" || document.forms[_formulario].elements["var_tipo_estructura"].value=="3"){
      document.forms[_formulario].var_accion.value='buscar_lista';
	  
      //ES PARA QUE AL BUSCAR LISTA DESDE EL BOTON SIEMPRE BUSQUE LA PRIMERA PAGINA DE REGISTROS
      if(document.forms[_formulario].elements["var_paginar"].value=="S"){
        document.forms["paginadorForm"].elements["paginas"].value = 1;
      }
    }
    else{
      document.forms[_formulario].var_accion.value='boton_buscar';
    }
	 
    _cadena_valores = crearCadenaValoresFicha(_formulario,""); 
    _cadena_valores = _cadena_valores + crearCadenaValoresAdicionalesFicha(_formulario,"");
	
    //MEJORA FUTURA: DEBIESE HABER UN CAMPO EN BD PARA INDICAR LA RUTINA JS QUE SE EJECUTA AL PRESIONAR CADA BOTON
    if(document.forms[_formulario].var_ventana.value=="consultas")
      _archivo_action_php = "action_consultas.php";
	if(document.forms[_formulario].var_ventana.value=="graficos_kpi")
      _archivo_action_php = "action_kpi_copec.php";
    else
      _archivo_action_php = "PageLogicPHP.php";

	_ventana_siguiente = document.forms[_formulario].var_ventana_siguiente.value;
	
	//SI ES UNA VENTANA PREVIA  
	if(_ventana_siguiente!=""){
	  //REDIRECT A LA PAGINA QUE CORRESPONDE, ENVIANDO TODOS LOS CAMPOS DE LA VENTANA
	  _metadata = document.forms[_formulario].elements["var_metadata"].value;
	  _valor_campo_a_enviar = document.forms[_formulario].elements[_metadata].value;
	  window.location = "http://"+_server+"/aplicacion/window.php?ventana="+_ventana_siguiente+"&"+_metadata+"="+_valor_campo_a_enviar;
	}
	else{
	  if(document.forms[_formulario].var_tipo_uso_formulario.value=="grafico"){
	    loadurl_xml(_archivo_action_php,_cadena_valores,triggered_xml_graficos);
	  }
	  else {
	    //alert(_archivo_action_php+"-"+_cadena_valores);
	    loadurl_xml(_archivo_action_php,_cadena_valores,triggered_xml);
	  }
    }
	
  }

} 

//04.///////////////////////////////////////////////////////////////////////////////////////////////


//05.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA NEGOCIO: validar campos de un formulario
//20.10.2013 GPS

function key_buscar_ficha(_formulario,_metadata,_id_fila) {

  //alert("BOTON_BUSCAR: "+_formulario+"-"+_metadata+"-"+_id_fila);

  //SI EL FORMULARIO ESTA VACIO
  if(camposFichaVacia(_formulario,_id_fila)==true) {
    abrirVentana("¡Debe ingresar al menos un valor para buscar!");
    setFocus(_metadata[0]);
  }

  //SI EL FORMULARIO NO ESTA VACIO
  else {

    //SI NO ES UNA TRANSACCION, BUSCAR DATOS ASOCIADOS A LA LLAVE
    _tipo_uso_formulario = document.forms[_formulario].elements["var_tipo_uso_formulario"].value;
  
    if(_tipo_uso_formulario!="transaccion") {
  
      if(_formulario=="impuestosForm")
        document.forms[_formulario].var_accion.value='calcular_impuestos';
      else
        document.forms[_formulario].var_accion.value='key_buscar';

      _cadena_valores = crearCadenaValoresFicha(_formulario,_id_fila); 
      _cadena_valores = _cadena_valores + crearCadenaValoresAdicionalesFicha(_formulario,_id_fila);
      _archivo_action_php = "PageLogicPHP.php";

      loadurl_xml(_archivo_action_php,_cadena_valores,triggered_xml);
    }
	
  }
  
} 

//05.///////////////////////////////////////////////////////////////////////////////////////////////


//06.///////////////////////////////////////////////////////////////////////////////////////////////

function definirCampoFoco(_campo_foco, _padre, _ventana) {

  //alert(_campo_foco +"-"+ _padre +"-"+ _ventana);

  //PARA QUE ES ESTE IF???
  if(_padre=="" && _ventana=="lista_tarea")
    window.name = '';
  else
    window.name = 'nw';

  //FORMATO CAMPO campo_foco: nombre_formulario.nombre_campo	
  _campo_foco_array = string_to_array(_campo_foco,".");
  
  //alert(_campo_foco);
 
  //SI HAY UN CAMPO PARA PONER EL FOCO INICIAL
  if(_campo_foco!="") {

    //SI EXISTE EL CAMPO COD_INTERNO Y ES DISTINTO DE VACIO, DARLE EL FOCO PARA QUE CARGUE LA FICHA 
	//alert(_campo_foco_array[0]);

	if(isset(document.forms[_campo_foco_array[0]].elements["cod_interno"])){
	  if(document.forms[_campo_foco_array[0]].elements["cod_interno"].value!=""){
        document.forms[_campo_foco_array[0]].elements["cod_interno"].focus();
      } 
    } 

    //DAR FOCO A CAMPO FOCO DEFINITIVO
    document.forms[_campo_foco_array[0]].elements[_campo_foco_array[1]].focus();

  } 

} 

//06.///////////////////////////////////////////////////////////////////////////////////////////////

//07.///////////////////////////////////////////////////////////////////////////////////////////////


//NO UTILIZAR!!!!


function enviar_mail(fila,servidor,formulario) {

  //alert("ENVIAR MAIL: " + fila + "-" + servidor + "-" + formulario);

  if(formulario=="grid_tareaForm")
    //ES UN INPUTBOX
    responsable = document.forms[formulario].elements["cod_responsable"+fila].value; 
  else {
    //ES UN SELECTBOX
    var index = document.forms[formulario].elements["cod_responsable"+fila].selectedIndex;
    responsable = document.forms[formulario].elements["cod_responsable"+fila].options[index].text; 
  }

  descripcion = document.forms[formulario].elements["descripcion"+fila].value; 

  if(responsable!="" && descripcion!="") {

    ventanaConfirmar = abrirVentanaConfirmar("¿Enviar mail a "+responsable+" recordándole la actividad: "+descripcion+"?"); 

    if(ventanaConfirmar==true) {
      loadurl_xml("action_enviar_mail.php","formulario="+formulario+"&descripcion="+descripcion+"&responsable="+responsable,triggered_xml);
    }

  }
  else
    alert("Debe seleccionar una tarea para enviar.");

} 

//07.///////////////////////////////////////////////////////////////////////////////////////////////


//08.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA NEGOCIO: validar si una entidad del tipo ficha tiene todos sus campos en blanco o no
//12.03.2014 GPS

function camposFichaVacia(_formulario,_id_fila){

  _metadata = document.forms[_formulario].elements["var_metadata"].value.split("^");
  _tipo = document.forms[_formulario].elements["var_tipo"].value.split("^");
  _cant_metadata = _metadata.length; 
  _expresion = "";

  for(_i=0;_i<_cant_metadata;_i++){

    if(_tipo[_i]=='input'){
      _expresion = _expresion + "document.forms[_formulario].elements[_metadata["+_i+"]+_id_fila].value=='' & ";
    } 
    else if(_tipo[_i]=='select'){
      if(existeBlancoEnSelect(_formulario,_metadata[_i])) {
        _expresion = _expresion + "document.forms[_formulario].elements[_metadata["+_i+"]+_id_fila].value=='99' & ";
      }
    }
	else if(_tipo[_i]=='hidden'){
      _expresion = _expresion + "document.forms[_formulario].elements[_metadata["+_i+"]+_id_fila].value=='' & ";
    } 

  }

  _expresion = _expresion.substr(0,_expresion.length-2);

  if(eval(_expresion)) 
    _fichaVacia = true;
  else
    _fichaVacia = false;

return _fichaVacia;

}

//08.///////////////////////////////////////////////////////////////////////////////////////////////


//09.///////////////////////////////////////////////////////////////////////////////////////////////
//21-02-2014 GPS

function camposFichaObligatorios(formulario) {

  var_ventana = document.forms[formulario].elements["var_ventana"].value;

  if(formulario=="") {
    alert("Falta parametrizar el formulario en la BD");
    fichaConObligatorios = false;
  }
  else {
  
    fichaConObligatorios = "";
    tipo_estructura = document.forms[formulario].elements["var_tipo_estructura"].value;
    metadata_obligatoria = document.forms[formulario].elements["var_campos_requeridos"].value.split("^");
    tipo = document.forms[formulario].elements["var_tipo_requeridos"].value.split("^");
    cant_metadata = metadata_obligatoria.length; 
    expresion = "";

	//alert(metadata_obligatoria);
	
	//SI HAY CAMPOS OBLIGATORIOS EN LA ENTIDAD
    if(metadata_obligatoria!="") {

      //alert(tipo_estructura);
      if(tipo_estructura=="ficha" || tipo_estructura=="2" || tipo_estructura=="datos" || tipo_estructura=="1"){
     
        for(i=0;i<cant_metadata;i++){
		
		  //alert(tipo[i]);
          if(tipo[i]=='INPUT' || tipo[i]=='TEXTAREA' || tipo[i]=='PASSWORD'){
            expresion = expresion + "document.forms[formulario].elements[metadata_obligatoria["+i+"]].value!='' & ";
		  }
		  else if(tipo[i]=='CHECKBOX'){
            
			nativa = document.forms["ventanaForm"].elements["nativa"].value;
			
			if(nativa==false)
			  expresion = expresion + "document.forms[formulario].elements[metadata_obligatoria["+i+"]].value!='' & ";
			else if(nativa==true)
			  expresion = expresion + "document.forms[formulario].elements[metadata_obligatoria["+i+"]].options[document.forms[formulario].elements[metadata_obligatoria["+i+"]].selectedIndex].text!='' & ";
			
		  }
          else if(tipo[i]=='SELECT'){
			//SI HAY BLANCO_EN_SELECT
			if(document.forms[formulario].elements[metadata_obligatoria[i]].selectedIndex==-1){
			  expresion = expresion + "document.forms[formulario].elements[metadata_obligatoria["+i+"]].selectedIndex!=-1 & ";
			}
			else{
			  expresion = expresion + "document.forms[formulario].elements[metadata_obligatoria["+i+"]].options[document.forms[formulario].elements[metadata_obligatoria["+i+"]].selectedIndex].text!='' & ";
			  //document.forms[formulario].elements[metadata_obligatoria[i]].style.backgroundColor = '#f3f3f3';
			}
		  }
          else if(tipo[i]=='LISTA'){
		
		    //VALIDACION LISTAS AZULES
		 
		    //EVALUACION MERCADERISTA
			/*
		    if(isset(document.forms[formulario].elements["id_mercaderista"+i])==true){
			  if(document.forms[formulario].elements["cumple_horario"+i].value=='99' || document.forms[formulario].elements["uniforme"+i].value=='99' || 
			  document.forms[formulario].elements["material_limpieza"+i].value=='99'|| document.forms[formulario].elements["material_trabajo"+i].value=='99' || 
			  document.forms[formulario].elements["producto_flejes"+i].value=='99'|| document.forms[formulario].elements["limpieza_gondola"+i].value=='99' || 
			  document.forms[formulario].elements["limpieza_producto"+i].value=='99'|| document.forms[formulario].elements["exhibicion"+i].value=='99'){
			    fichaConObligatorios = false;
			    return fichaConObligatorios;
			  }
		    }
		    */
		 
		    //PRODUCTOS INFORME DE TOMA DE PRECIOS
			if(var_ventana=='informe_toma_precios' && metadata_obligatoria[i]=='levantamiento_productos'){
			  var tipo_subformulario = ["CHECKBOX","CHECKBOX","INPUT"];
			  var metadata_obligatoria_subformulario = ["id_hay_stock","id_tiene_fleje","precio_sala"];
			}
			//EVALUACION MERCADERISTA IPdV
			else if((var_ventana=='informe_punto_venta' || var_ventana=='informe_punto_venta_spm') && metadata_obligatoria[i]=='evaluacion2'){
			  var tipo_subformulario = ["SELECT","SELECT","SELECT"];
			  var metadata_obligatoria_subformulario = ["cumple_horario","uniforme","material_limpieza"];
			}
			
			//alert(isset(document.forms[formulario].elements[metadata_obligatoria_subformulario[0]+i]));
			//alert(isset(document.forms[formulario].elements["id_mercaderista0"]));
			
			//VALIDAR QUE HAYAN ELEMENTOS EN LA LISTA Y POR ENDE SE HAYA DIBUJADO AL MENOS UN SUBFORMULARIO
			if(isset(document.forms[formulario].elements[metadata_obligatoria_subformulario[0]+i])==true){
			
			  var cant_elementos_lista =  $('#'+metadata_obligatoria[i]).children().size(); 
			
			  //VALIDAR CADA SUBFORMULARIO DE LA LISTA
			  for(k=0;k<cant_elementos_lista;k++){
			    //VALIDAR CADA CAMPO DEL SUBFORMULARIO 
			    for(j=0;j<metadata_obligatoria_subformulario.length;j++){
			      if(tipo_subformulario[j]=='INPUT'){
                    expresion = expresion + "document.forms[formulario].elements['"+metadata_obligatoria_subformulario[j]+k+"'].value!='' & ";
		          }
			      else if(tipo_subformulario[j]=='CHECKBOX'){
			        expresion = expresion + "document.forms[formulario].elements['"+metadata_obligatoria_subformulario[j]+k+"'].options[document.forms[formulario].elements['"+metadata_obligatoria_subformulario[j]+k+"'].selectedIndex].text!='' & ";
		          }
			      else if(tipo_subformulario[j]=='SELECT'){
			        //SI HAY BLANCO_EN_SELECT
			        if(document.forms[formulario].elements[metadata_obligatoria_subformulario[j]+k].selectedIndex==-1){
			          expresion = expresion + "document.forms[formulario].elements['"+metadata_obligatoria_subformulario[j]+k+"'].selectedIndex!=-1 & ";
			        }
				    //SI NO HAY BLANCO_EN_SELECT
			        else{
			          expresion = expresion + "document.forms[formulario].elements['"+metadata_obligatoria_subformulario[j]+k+"'].options[document.forms[formulario].elements['"+metadata_obligatoria_subformulario[j]+k+"'].selectedIndex].text!='' & ";
			        }
		          }
			    }
			  }
			  
			}
			  
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		   
		    
			
		    //INFORME DE PUNTO DE VENTA MAY
		    if(var_ventana=='informe_punto_venta'){
		    
			  //PROMOCIONES ACTIVAS
			  if(isset(document.forms[formulario].elements["id_accion_activa"+i])==true){
			    if(document.forms[formulario].elements["id_estado_promocion"+i].value=='99'){
			      fichaConObligatorios = false;
				  return fichaConObligatorios;
			    }
			  }
			  //PROMOCIONES FUTURAS  
			  if(isset(document.forms[formulario].elements["id_accion_futura"+i])==true){
			    if(document.forms[formulario].elements["negociado"+i].value=='99' || document.forms[formulario].elements["espacio"+i].value=='99' || 
			    document.forms[formulario].elements["materiales"+i].value=='99' || document.forms[formulario].elements["informado"+i].value=='99'){
			      fichaConObligatorios = false;
			      return fichaConObligatorios;
			    }
		      }
				  	  
		    }
		    //INFORME DE PUNTO DE VENTA SPM Y COB
		    else if(var_ventana=='informe_punto_venta_spm' || var_ventana=='informe_spv_cobertura'){
		    
			  //PROMOCIONES ACTIVAS
		      if(isset(document.forms[formulario].elements["id_accion_activa"+i])==true){
			    if(document.forms[formulario].elements["id_sala_informada"+i].value=='99' || document.forms[formulario].elements["exhibicion_adicional"+i].value=='99' || 
			    document.forms[formulario].elements["id_producto_suficiente"+i].value=='99' || document.forms[formulario].elements["carteleria_promociones"+i].value=='99' || 
			    document.forms[formulario].elements["precio_corresponde"+i].value=='99'){
			      fichaConObligatorios = false;
				  return fichaConObligatorios;
			    }
			  }
			  //PROMOCIONES FUTURAS  
			  if(isset(document.forms[formulario].elements["id_accion_futura"+i])==true){
			    if(document.forms[formulario].elements["id_sala_informada_futura"+i].value=='99' || document.forms[formulario].elements["id_producto_suficiente_futura"+i].value=='99' || 
			    document.forms[formulario].elements["carteleria_promociones_futura"+i].value=='99'){
			      fichaConObligatorios = false;
				  return fichaConObligatorios;
			    }
			  }
		    }
			
	      }
	
        }  
		   
		//alert(expresion)
        expresion = expresion.substr(0,expresion.length-2);
        //alert(expresion+formulario);
 
        if(eval(expresion)){
          fichaConObligatorios = true;
		}
        else{
          fichaConObligatorios = false;
        }
		
		//alert(fichaConObligatorios);
		
      }
      else if(tipo_estructura=="grid" || tipo_estructura=="4"){

	    //alert("VALIDAR_GRID");
        if(validarGrid(formulario)) 
          fichaConObligatorios = true;
        else
          fichaConObligatorios = false;
		  
      }
	  else{
	    fichaConObligatorios = false;
	    alert("ERROR DE PARAMETRIZACION\nTipo de estructura no reconocido: "+tipo_estructura);
		die();
      }
	  
    }
	//SI NO HAY CAMPOS OBLIGATORIOS DEFINIDOS PARA LA ENTIDAD...
    else {
	  //...Y ADEMAS ES UN GRID
	  if(tipo_estructura=="grid" || tipo_estructura=="4")  {
	  
	    id_grid = document.forms[formulario].var_entidad.value;
	    cant_filas = document.getElementById(id_grid).rows.length - 1;
	  
	    if(cant_filas==1)
	      fichaConObligatorios = false;
		else
		  fichaConObligatorios = true;
		
		
	  }
	  else {
        fichaConObligatorios = true;
	  }
    }
  }

//alert("VALIDA: "+fichaConObligatorios+"-"+tipo_estructura);

return fichaConObligatorios;

}

//09.///////////////////////////////////////////////////////////////////////////////////////////////


//10.///////////////////////////////////////////////////////////////////////////////////////////////

function activarDesactivarCamposId(formulario,accion) {

  campos_objeto = document.forms[formulario].elements["var_key_id"];
  campos = document.forms[formulario].elements["var_key_id"].value;
  tipo = document.forms[formulario].elements["var_tipo"].value;
  metadata = document.forms[formulario].elements["var_metadata"].value;
  
  //GENERALIZAR ESTO COPEC: SI EL CAMPO_ID NO EXISTE O ESTA OCULTO (HIDDEN), QUE NO TRATE DE ACTIVAR NI DE DESACTIVARLO
  //cant_campos = 1;
  //campos_array = string_to_array(campos,";");
  //cant_campos = campos_array.length; 
  
  //for(i=0;i<cant_campos;i++){
  //  if(isset(campos)==false || tipo_array[i]=="hidden")
  //    campos = "";
  //}
 
  if(isset(campos_objeto)==true && campos!="") {

    //SIEMPRE SE DESACTIVA O ACTIVA EL PRIMER SET DE CAMPOS ID (EN EL CASO QUE HAYA MAS DE UNO)
    campos_array = string_to_array(campos,";");
    campos = campos_array[0];
    
    campos_array = campos.split(",");
    cant_campos = campos_array.length; 

	tipo_array = string_to_array(tipo,"^");
	metadata_array = string_to_array(metadata,"^");
	
	//alert(cant_campos);
	
    for(i=0;i<cant_campos;i++) {
	
      //BUSCAR POSICION DE CADA ELEMENTO DEL CAMPO ID EN LA METADATA
      pos_campo_id = posicion_campo(campos_array[i],metadata_array);
	  
	  //alert(isset(document.forms[formulario].elements[campos_array[i]]));
	  //alert(tipo_array[pos_campo_id]);
	 
      if(isset(document.forms[formulario].elements[campos_array[i]])!=false && tipo_array[pos_campo_id]!="hidden"){
        if(accion=="DESACTIVAR")
          document.forms[formulario].elements[campos_array[i]].disabled = true;
        else if(accion=="ACTIVAR")
          document.forms[formulario].elements[campos_array[i]].disabled = false;
      }
		
    }

  }

}

//10.///////////////////////////////////////////////////////////////////////////////////////////////


//11.///////////////////////////////////////////////////////////////////////////////////////////////

function crearCadenaValoresFicha(formulario,id_fila) {

  nativa = document.forms["ventanaForm"].elements["nativa"].value;
  entidad = document.forms[formulario].elements["var_entidad"].value;
  metadata = document.forms[formulario].elements["var_metadata"].value.split("^");
  tipo = document.forms[formulario].elements["var_tipo"].value.split("^");
  formato_visual = document.forms[formulario].elements["var_formato_visual"].value.split("^");
  tipo_entidad = document.forms[formulario].elements["var_tipo_estructura"].value;
  var_ventana = document.forms[formulario].elements["var_ventana"].value;
  cant_metadata = metadata.length;
  valor = "";
  cadena_valores = "";
  grid_completo = "";
  hacia_bd = document.forms[formulario].elements["var_hacia_bd"].value.split("^");
  
  //alert(hacia_bd);
  
  if(id_fila=="")
    grid_completo = true;

  //SI ESTOY GUARDANDO Y HAY UN GRID AGREGAR TODOS LOS VALORES DEL GRID. SI ESTOY BUSCANDO EN UNA FICHA AGREGO SOLO UN REGISTRO.
  if(tipo_entidad=="grid" && grid_completo==true) { 
    cant_registros_por_entidad = parseInt(document.forms[formulario].elements["var_filas"].value)+1;
    //id_fila = 0;
  }
  else {
    cant_registros_por_entidad = 1;
  }

  //alert(cant_registros_por_entidad);
 
  //POR CADA UNO DE LOS REGISTROS DE LA ENTIDAD
  for(a=0;a<cant_registros_por_entidad;a++) {

    for(i=0;i<cant_metadata;i++) {
	
	if(hacia_bd[i]=="s") {
	
      if(tipo[i]=='input' || tipo[i]=='hidden' || tipo[i]=='textarea' || tipo[i]=='password') {
        //CUANDO ESTOY GUARDANDO Y HAY UN GRID AGREGAR TODOS LOS VALORES DEL GRID
        if(tipo_entidad=="grid" && grid_completo==true){
          valor = document.getElementById(entidad).rows[a+1].cells[i].children[0].value;
		}
        //CUANDO ESTOY BUSCANDO EN UNA FICHA O UN GRID, USAR SOLO EL ELEMENTO CORRESPONDIENTE (1 FILA)
        else{
		
          valor = document.forms[formulario].elements[metadata[i]+id_fila].value;  
		  
		  //CONVERTIR FORMATO DE FECHA
		  if(valor.substr(4,1)=="-")  
		    valor = valor.substr(8,2)+"/"+valor.substr(5,2)+"/"+valor.substr(0,4);
		  
		  
		  
		  
		}
      }
      else if(tipo[i]=='select') {
        //CUANDO ESTOY GUARDANDO Y HAY UN GRID AGREGAR TODOS LOS VALORES DEL GRID
        if(tipo_entidad=="grid" && grid_completo==true) {

          if(document.getElementById(entidad).rows[a+1].cells[i].children[0].value==99)
            valor = "";
          else
            valor = document.getElementById(entidad).rows[a+1].cells[i].children[0].value;
        }
        //CUANDO ESTOY BUSCANDO EN UNA FICHA O UN GRID, USAR SOLO EL ELEMENTO CORRESPONDIENTE (1 FILA)
        else {
          if(document.forms[formulario].elements[metadata[i]+id_fila].value==99)
            valor = "";
          else
            valor = document.forms[formulario].elements[metadata[i]+id_fila].value;
        }

      }
      else if(tipo[i]=='checkbox') {
	  
	    if(nativa==false){
          if(document.forms[formulario].elements[metadata[i]+id_fila].checked==1)
            valor = "1";
          else if(document.forms[formulario].elements[metadata[i]+id_fila].checked==0)
            valor = "0";
		}
		else if(nativa==true){
		  //EL CHECKBOX DE JQUERY EN REALIDAD ES UN SELECT
		  valor = document.forms[formulario].elements[metadata[i]].value;
		} 
		  
      }
      else if(tipo[i]=='input_list' || tipo[i]=='select_list') {
       
          list = metadata[i];
          cant_options = document.forms[formulario].elements[list].length;

          valor = "";

          for(m=0;m<cant_options;m++) {
		    //TOMAR EL VALOR DE LA OPCION Y NO EL TEXTO VISIBLE
            valor = valor + document.forms[formulario].elements[list].options[m].value + ',';
			
          }

          //QUITAR EL ULTIMO SIMBOLO DE SEPARACION
          if(valor.charAt(valor.length-1)==",")
            valor = valor.substring(0, valor.length-1);

		
		  //ORDENAR LOS ID_TAREA DE MENOR A MAYOR (SOLO AL GUARDAR)
		  if(valor!="") {
		    valor_array = string_to_array(valor,",");
		    valor_array.sort(function(a,b){return a - b});
		    valor = array_to_string(valor_array,",");
          }
		  
      }
	  else if(tipo[i]=='lista'){
	 
	    //ARCOR: ESTO SE DEBE GENERALIZAR!! 
	
	    //TRABAJAR
	
		if(metadata[i]=="levantamiento_productos"){
				
					z = 0;
					valor="";
					//MIENTRAS EL ID TENGA UN VALOR...
					while(isset(document.forms[formulario].elements["id_producto"+z+""])==true){
						valor = valor + document.forms[formulario].elements["id_producto"+z+""].value;
						valor = valor + "," + document.forms[formulario].elements["id_hay_stock"+z+""].value;
						valor = valor + "," + document.forms[formulario].elements["id_tiene_fleje"+z+""].value;
						valor = valor + "," + document.forms[formulario].elements["precio_sala"+z+""].value;
						valor = valor + "," + document.forms[formulario].elements["id_exhibicion_adicional"+z+""].value;
						valor = valor + "," + document.forms[formulario].elements["id_pedido_sala"+z+""].value + "#"; 
						z = z + 1;
					}
		}
	
		if(metadata[i]=="promociones_activas"){
				
					z = 0;
					valor="";
					while(isset(document.forms[formulario].elements["id_estado_promocion"+z+""])==true){
						valor = valor + document.forms[formulario].elements["id_accion_activa"+z+""].value;
						valor = valor + "," + document.forms[formulario].elements["id_estado_promocion"+z+""].value;
						valor = valor + "," + document.forms[formulario].elements["id_detalle_promocion"+z+""].value;
						valor = valor + "," + document.forms[formulario].elements["stock_promocion"+z+""].value;
						valor = valor + "," + document.forms[formulario].elements["carteleria_promociones"+z+""].value;
						valor = valor + "," + document.forms[formulario].elements["observaciones_promocion"+z+""].value;  
						valor = valor + "," + document.forms[formulario].elements["exhibicion_adicional"+z+""].value + "#";  
						z = z + 1;
					}
		}
		
		if(metadata[i]=="promociones_activas_spm" || metadata[i]=="promociones_activas_cob"){
			z = 0;
					valor="";
					
					while(isset(document.forms[formulario].elements["id_accion_activa"+z+""])==true){
					//alert(document.forms[formulario].elements["exhibicion_adicional"+z+""].value);
						valor = valor + document.forms[formulario].elements["id_accion_activa"+z+""].value;
						valor = valor + "," + document.forms[formulario].elements["id_sala_informada"+z+""].value;
						valor = valor + "," + document.forms[formulario].elements["id_producto_suficiente"+z+""].value;
						valor = valor + "," + document.forms[formulario].elements["carteleria_promociones"+z+""].value;
						valor = valor + "," + document.forms[formulario].elements["exhibicion_adicional"+z+""].value;
						valor = valor + "," + document.forms[formulario].elements["precio_corresponde"+z+""].value;
						valor = valor + "," + document.forms[formulario].elements["precio_sala"+z+""].value + "#";  
						z = z + 1;
					}
		}

		if(metadata[i]=="promociones_futuras"){
			
				r = 0;
				valor="";
				while(isset(document.forms[formulario].elements["negociado"+r+""])==true){
				valor = valor + document.forms[formulario].elements["id_accion_futura"+r+""].value;
				valor = valor + "," + document.forms[formulario].elements["negociado"+r+""].value;
				valor = valor + "," + document.forms[formulario].elements["espacio"+r+""].value;
				valor = valor + "," + document.forms[formulario].elements["materiales"+r+""].value;
				valor = valor + "," + document.forms[formulario].elements["informado"+r+""].value+ "#";  

				r = r + 1;
				}
		}
		
		if(metadata[i]=="promociones_futuras_spm" || metadata[i]=="promociones_futuras_cob"){
		r = 0;
				valor="";
				while(isset(document.forms[formulario].elements["id_accion_futura"+r+""])==true){
				valor = valor + document.forms[formulario].elements["id_accion_futura"+r+""].value;
				valor = valor + "," + document.forms[formulario].elements["id_sala_informada_futura"+r+""].value;
				valor = valor + "," + document.forms[formulario].elements["id_producto_suficiente_futura"+r+""].value;
				valor = valor + "," + document.forms[formulario].elements["carteleria_promociones_futura"+r+""].value+ "#";  
				r = r + 1;
				}
				
				//alert(valor);
				
		}
		
		//Evaluacion mercaderista
			if(metadata[i]=="evaluacion2"){
			j = 0;
			valor="";
			  while(isset(document.forms[formulario].elements["id_mercaderista"+j+""])==true){
			  
				valor = valor + document.forms[formulario].elements["id_mercaderista"+j+""].value;
				valor = valor + "," + document.forms[formulario].elements["cumple_horario"+j+""].value;
				valor = valor + "," + document.forms[formulario].elements["uniforme"+j+""].value;
				valor = valor + "," + document.forms[formulario].elements["material_limpieza"+j+""].value;
				valor = valor + "," + document.forms[formulario].elements["material_trabajo"+j+""].value+",";
				var fifo=document.getElementsByName('gpsfifo0');
					if(fifo=='[object NodeList]'){
							for (fi=0;fi<fifo.length;fi++)
							{
								 valor = valor + document.getElementById("IDSioNofifo0"+fi).value;
								 valor = valor + "@" + document.getElementById("SioNofifo0"+fi).value + "*";
								
							}	
							valor = valor + ",";
						}
				var promo=document.getElementsByName('gpsflejes_promocion0');
					if(promo=='[object NodeList]'){
								for (pro=0;pro<promo.length;pro++)
								{
									 valor = valor + document.getElementById("IDSioNoflejes_promocion0"+pro).value;
									 valor = valor + "@" + document.getElementById("SioNoflejes_promocion0"+pro).value + "*";
									
								}	
						//valor = valor + "@@@,";		
					}	
				valor = valor + "," + document.forms[formulario].elements["producto_flejes"+j+""].value;  
				valor = valor + "," + document.forms[formulario].elements["limpieza_gondola"+j+""].value;  
				valor = valor + "," + document.forms[formulario].elements["limpieza_producto"+j+""].value;  
				valor = valor + "," + document.forms[formulario].elements["exhibicion"+j+""].value+",";
				var quieb=document.getElementsByName('gpsquiebre0');
					if(quieb=='[object NodeList]'){
								for (qui=0;qui<quieb.length;qui++)
								{
									 valor = valor + document.getElementById("IDSioNoquiebre0"+qui).value;
									 valor = valor + "@" + document.getElementById("SioNoquiebre0"+qui).value + "*";
									
								}
						//valor = valor + "@@@,";
					}	
				valor = valor + "," + document.forms[formulario].elements["comentario"+j+""].value+ "#"; 
					
					
				 j = j + 1;
			  }
			  
			} 
			//Fin Evaluacion mercaderista
      }
	  
	  else if(tipo[i]=='lista_basica_check'){
	 
	    cant_elementos_lista = document.getElementsByName("gps"+metadata[i]).length;
		//alert(metadata[i]+'-'+cant_elementos_lista);
		valor = "";
		
		for(p=0;p<cant_elementos_lista;p++){
		  valor = valor + document.forms[formulario].elements["IDSioNo"+metadata[i]+p].value;
		  valor = valor + "," + document.forms[formulario].elements["SioNo"+metadata[i]+p].value + "#";
		}	
		
      }
      //PARA HACER UN SOLO STRING QUE CONTENGA TODOS LOS DATOS DEL GRID
      if(tipo_entidad=="grid" && grid_completo==true) { 

        if(a==0 && i==0)
          cadena_valores = cadena_valores + "valores_grid=";

        cadena_valores = cadena_valores + URLEncode(valor) + '^';

        if(i==cant_metadata-1 && a!=cant_registros_por_entidad-1)
          cadena_valores = cadena_valores.substr(0,cadena_valores.length-1) + '#';
        else if(i==cant_metadata-1 && a==cant_registros_por_entidad-1)
          cadena_valores = cadena_valores.substr(0,cadena_valores.length-1) + '&';

      }
      else { 
        
		
		
		cadena_valores = cadena_valores + metadata[i] + '=' + URLEncode(valor) + '&';
      }
	  
	}
	
    }

	//alert(cadena_valores);
	
    //SI HAY MAS DE UN REGISTRO, PARA PODER RECORRER EL GRID
    if(tipo_entidad=="grid" && grid_completo==true)
      id_fila = id_fila + 1;

  }

return cadena_valores;

}

//11.///////////////////////////////////////////////////////////////////////////////////////////////


//12.///////////////////////////////////////////////////////////////////////////////////////////////

//PARA EDITAR FICHAS DESDE UNA TRANSACCION
function abrir_ventana_ficha(ventana_padre,entidad,host) {

  //alert("ABRIR VENTANA FICHA: "+ventana+"--"+entidad+"--"+host);

  //PARAMETROS
  largo_ventana = 460;
  ancho_ventana = 780;
  nombre_ventana = entidad;

  //CLIENTE
  if(entidad=='cliente') {
    ventana_hija = "ficha_cliente";
    //ventana_padre = "boleta";
    //entidad = "cliente";
    //path_origen = "boleta.php";
    formulario = "clientesForm";
    campo_id = "rut";
  }
  //PROVEEDOR
  else if(entidad=='proveedor') {
    ventana_hija = "ficha_proveedor";
    //ventana_padre = "factura";
    //entidad = "proveedor";
    //path_origen = "factura.php";
    formulario = "proveedoresForm";
    campo_id = "rut";
  }
  //PRODUCTO
  else if(entidad=='producto') {
    ventana_hija = "ficha_producto";
    //ventana_padre = "factura";
    //entidad = "producto";
    //path_origen = "factura.php";
    formulario = "gridForm";
    campo_id = "marca0";
  }
  //PACIENTE
  else if(entidad=='paciente') {
    ventana_hija = "ficha_paciente";
    //ventana_padre = "factura";
    //entidad = "producto";
    //path_origen = "factura.php";
    formulario = "pacientesForm";
    campo_id = "rut_paciente";
  }
  //PACIENTE
  else if(entidad=='grid_reservas') {
    ventana_hija = "ingresar_reserva";
    //ventana_padre = "factura";
    //entidad = "producto";
    //path_origen = "factura.php";
    formulario = "grid_reservasForm";
    campo_id = "fecha_reserva";
  }
  //TAREA
  else if(entidad=='grid_tarea') {

    largo_ventana = 690;
    ancho_ventana = 850;

    ventana_hija = "ficha_tarea";
    //ventana_padre = "factura";
    //entidad = "producto";
    //path_origen = "factura.php";
    formulario = "filtro_tareaForm";
    campo_id = "descripcion";
  }
  //ESTACIONES
  else if(entidad=='grid_estaciones') {

    largo_ventana = 690;
    ancho_ventana = 850;

    ventana_hija = "ficha_estacion";
    //ventana_padre = "factura";
    //entidad = "producto";
    //path_origen = "factura.php";
    formulario = "grid_estacionesForm";
    campo_id = "estacion";
  }
  OpenCenWindow("http://"+host+"/aplicacion/window.php?ventana="+ventana_hija+"&"+campo_id+"="+document.forms[formulario].elements[campo_id].value+"&padre="+ventana_padre+"&entidad="+entidad, nombre_ventana, ancho_ventana, largo_ventana, "yes");
 
}

//12.///////////////////////////////////////////////////////////////////////////////////////////////


//13.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA NEGOCIO: volver a la ventana padre
//12.03.2014 GPS

function volver_a_padre(_formulario,_fila) {

  _campo_padre = document.forms[_formulario].elements["var_key_id"].value;

  //FICHA DESDE TRANSACCION
  opener.document.forms[_formulario].elements[_campo_padre].value = document.forms[_formulario].elements[_campo_padre].value;
  window.close();
  opener.document.forms[_formulario].elements[_campo_padre].focus();
   
}

//13.///////////////////////////////////////////////////////////////////////////////////////////////


//14.///////////////////////////////////////////////////////////////////////////////////////////////

function datos_a_padre(formulario,metadata,fila,opener) {

  //alert("DATOS A PADRE: "+formulario+"--"+metadata+"--"+fila);

  //se llama cant en factura pero parece se llama cantidad en inventario
  //este no debe estar en factura 


  if(ventana=="ficha_producto" && opener.ventana=="inventario")
    opener.document.forms['gridForm'].elements['cantidad'+fila].value = document.forms['productosForm'].elements['cantidad'].value;
    opener.document.forms['gridForm'].elements['codigobarras'+fila].value = document.forms['productosForm'].elements['codigobarras'].value;
    opener.document.forms['gridForm'].elements['descripcion'+fila].value = document.forms['productosForm'].elements['descripcion'].value;

  //este no debe estar en factura
  if(ventana=="ficha_producto" && opener.ventana=="inventario")
    opener.document.forms['gridForm'].elements['familia'+fila].value = document.forms['productosForm'].elements['familia'].value;
    opener.document.forms['gridForm'].elements['costo'+fila].value = document.forms['productosForm'].elements['costo'].value;
    opener.document.forms['gridForm'].elements['venta'+fila].value = document.forms['productosForm'].elements['venta'].value;

  //este es el total en factura
  if(opener.ventana=="factura") {
    if(opener.document.forms['gridForm'].elements['cant'+fila].value)
      opener.document.forms['gridForm'].elements['total'+fila].value = parseInt(document.forms['productosForm'].elements['costo'].value) * parseInt(opener.document.forms['gridForm'].elements['cant'+fila].value);
  }
  //este es el total en inventario
  else if(opener.ventana=="inventario") {
    if(opener.document.forms['gridForm'].elements['cantidad'+fila].value)
      opener.document.forms['gridForm'].elements['total'+fila].value = parseInt(document.forms['productosForm'].elements['venta'].value) * parseInt(opener.document.forms['gridForm'].elements['cantidad'+fila].value);
  }

  //ponerlo en marca primero, para qeu el sacarlo cargue la ficha y el codigo de barras
  //opener.document.forms['gridForm'].elements['marca'+fila].focus();
  //window.close();
  //}
  //if(window.opener.document.forms[formulario].var_ventana.value=='boleta')
  //  window.opener.document.gridForm.codigobarras0.focus();
  //else if(window.opener.document.forms[formulario].var_ventana.value=='factura')
  //  window.opener.document.gridForm.marca0.focus();

}

//14.///////////////////////////////////////////////////////////////////////////////////////////////


//15.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA NEGOCIO: crear cadena con valores adicionales a enviar al servidor
//20.10.2013 GPS

function crearCadenaValoresAdicionalesFicha(formulario,id_fila) {

  paginar = document.forms[formulario].elements["var_paginar"].value;

  scrolly = scrollTop();
  scrollx = document.forms[formulario].var_scrolly.value;

  //alert("X: "+scrollx+",Y: "+scrolly);

  //SIEMPRE QUE NO HAYA PAGINADOR SE ENVIA LA PAGINA 1
  if((document.forms[formulario].var_tipo_uso_formulario.value=="lista datos ficha" || document.forms[formulario].var_tipo_uso_formulario.value=="lista datos transaccion") && paginar=="S")
    paginador = '&pagina='+URLEncode(document.forms["paginadorForm"].elements["paginas"].value);
  else
    paginador = '&pagina=1';
  ////
 

 
  /////////////////////////////////////ESTO ESTA MAL GENERALIZADO, ARREGLAR 
  
  tipo_estructura = document.forms[formulario].elements["var_tipo_estructura"].value;
 
  //alert(tipo_estructura);
 
  if(tipo_estructura=="grid" || tipo_estructura=="4"){
    //FILTRO GRID
    form_filtro = document.forms[formulario].elements["var_form_grid_filtro"].value;
	
	if(form_filtro!="")
      tipo_estructura_filtro = document.forms[form_filtro].elements["var_tipo_estructura"].value;
	else
	  tipo_estructura_filtro = "";
  }
  else
    //FILTRO GRAFICOS
    tipo_estructura_filtro = "datos";
  
  //alert(tipo_estructura_filtro);
  
  //SI ES UN FORMULARIO QUE CONTIENE UN ID CON UN VALOR
  if(tipo_estructura_filtro=="datos")
    tiene_referencia = "S";
  else
	tiene_referencia = "N";
 
  ///////////////////////////////////////////////////////////////////////////


  //DEBE APLICAR SOLO SI LA ENTIDAD ES UN GRID CON PAGINADOR ACTIVO (NO SI ES UN FILTRO, PUES SE CAE)
  if(paginar=="S" && tiene_referencia=="S"){
	
    //AGREGAR KEY_ID PARA QUE CUANDO SE USA EL PAGINADOR NO SE PIERDA LA REFERENCIA (IMPORTANTE PARA PASAR VARIABLES AL USAR PAGINADOR)
    key_id_array = string_to_array(document.forms[formulario].var_key_id.value,",");
    cant_key_id_array = key_id_array.length;
	
    adicional = "";
    formulario_filtro = document.forms[formulario].var_form_grid_filtro.value;
	
    for(i=0;i<cant_key_id_array;i++) {
      adicional = adicional + "&"+key_id_array[i]+"="+document.forms[formulario_filtro].elements[key_id_array[i]].value;
    }
    
  }
  else
    adicional = "";
  //////
  
   cadena_valores_adicionales = 'ventana='+URLEncode(document.forms[formulario].var_ventana.value)+'&entidad='+URLEncode(document.forms[formulario].var_entidad.value)+'&accion='+URLEncode(document.forms[formulario].var_accion.value)+'&form='+URLEncode(formulario)+'&camposId='+document.forms[formulario].elements["var_key_id"].value+'&id_fila='+URLEncode(id_fila)+paginador+'&scrollx='+scrollx+'&scrolly='+scrolly+'&id_caja='+document.forms[formulario].var_id_caja.value+'&id_punto_venta='+document.forms[formulario].var_id_punto_venta.value+'&padre='+document.forms[formulario].var_padre.value+adicional;
  //alert(cadena_valores_adicionales);
  
return cadena_valores_adicionales;

}

//15.///////////////////////////////////////////////////////////////////////////////////////////////


//16.///////////////////////////////////////////////////////////////////////////////////////////////

function campoEsKeyId(campo_actual,campo_id,id_fila) {

  if(campo_id!="") {

    //SEPARAR LOS CAMPOS ID (EN EL CASO QUE TENGA MAS QUE UNO)
    campos_id_array = string_to_array(campo_id,";");
    
    campo_actual_es_id = false;

    for(z=0;z<campos_id_array.length;z++) {

      //SEPARAR LOS CAMPOS QUE CONFORMAN UN CAMPO ID (UN CAMPO ID SE PUEDE COMPONER POR VARIOS CAMPOS)
      campos_id_array_2 = string_to_array(campos_id_array[z],",");

      i=0; 

      while(i<campos_id_array_2.length) {

        //alert(campo_actual+"--"+campos_id_array_2[i]+id_fila);

        if(campo_actual==campos_id_array_2[i]+id_fila  && campo_actual_es_id==false) {
          campo_actual_es_id = true;
        }
      i=i+1;
      }
    }
    
  }
  else
    campo_actual_es_id = false;

//alert(campo_actual_es_id);

return campo_actual_es_id;

}

//16.///////////////////////////////////////////////////////////////////////////////////////////////


//17.///////////////////////////////////////////////////////////////////////////////////////////////

function camposKeyIdDistintoVacio(campo_actual,campo_id,formulario,id_fila) {

  //PARA SEPARAR TODOS LOS CAMPOS QUE CONFORMEN EL CAMPO ID ACTUAL, EN EL CASO QUE HAYA MAS DE UN CAMPO ID Y SELECCIONAR EL QUE CORRESPONDE USAR
  campos_id_array_0 = string_to_array(campo_id,";");
  a=0;

  while(a<campos_id_array_0.length) {

    posicion_campo_id = campos_id_array_0[a].indexOf(campo_actual);

    //SI ENCUENTRA EL CAMPO ACTUAL EN UN CAMPO ID
    if(posicion_campo_id>=0)
      campo_id = campos_id_array_0[a];

  a=a+1;
  }

  //alert("CAMPO ID A UTILIZAR:"+campo_id);
  
  campos_id_array = string_to_array(campo_id,",");
  
  metadata_array = string_to_array(document.forms[formulario].var_metadata.value,"^");
  tipo_array = string_to_array(document.forms[formulario].var_tipo.value,"^");

  i=0;
  key_id_completo = true;

  //alert("CANT CAMPO ID A UTILIZAR:"+campos_id_array.length);
  
  while(i<campos_id_array.length) {

    //BUSCAR POSICION DEL CAMPO EN LA METADATA
    pos_campo_id = posicion_campo(campos_id_array[i],metadata_array);
    //alert(pos_campo_id);

	//alert(tipo_array[pos_campo_id]+"-"+document.forms[formulario].elements[campos_id_array[i]+id_fila].value);
	
    if(tipo_array[pos_campo_id]=="input" && document.forms[formulario].elements[campos_id_array[i]+id_fila].value!="" && key_id_completo!=false) 
      key_id_completo = true;
    else if(tipo_array[pos_campo_id]=="select" && document.forms[formulario].elements[campos_id_array[i]+id_fila].value!="99" && key_id_completo!=false) 
      key_id_completo = true;
    else
      key_id_completo = false;

    i=i+1;

  }

return key_id_completo;

}

//17.///////////////////////////////////////////////////////////////////////////////////////////////


//18.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA NEGOCIO: editar fichas cuando son filas de un grid
//20.10.2013 GPS

function editar(fila,host,form_grid,ventana_destino){

  //alert("EDITAR: "+fila+"-"+host+"-"+form_grid+"-"+ventana_destino);

  //CARGAR PARAMETROS NECESARIOS
  fila1 = parseInt(fila)+1;
  entidad = document.forms[form_grid].var_entidad.value;
  tipo_uso_formulario = document.forms[form_grid].var_tipo_uso_formulario.value;
  fila_grid = entidad+fila;
  metadata_array = string_to_array(document.forms[form_grid].var_metadata.value,"^");
  cant_metadata = metadata_array.length;
  key_id_array = string_to_array(document.forms[form_grid].var_key_id.value,",");


  //GENERALIZAR ESTO!!!!!
  if(form_grid=="gridProyectoForm")
    key_id_array = string_to_array("codigo_es",",");
 





  cant_key_id = key_id_array.length;
  desde_bd_array = string_to_array(document.forms[form_grid].var_desde_bd.value,"^");
  cant_desde_bd = desde_bd_array.length;

 
  


  //BUSCAR NUMERO DE COLUMNA DEL GRID EN QUE ESTA EL KEY ID (EL UNICO KEY ID, PUEDE COMPONERSE DE VARIOS CAMPOS)
  columnas_id = new Array();

  for(i=0;i<cant_key_id;i++) {
    for(j=0;j<cant_metadata;j++) {
      if(metadata_array[j]==key_id_array[i])
        columnas_id[i] = j;
    }
  }

  
  
   
   
  //alert("OK");

  //BUSCAR LA PRIMERA COLUMNA DEL GRID QUE SE CARGA DESDE LA BD PARA DETERMINAR SI HAY DATOS CARGADOS EN ESA FILA DEL GRID
  //if(tipo_uso_formulario=="buscar" || tipo_uso_formulario=="lista datos transaccion") {
  //  primera_columna_desde_bd = 1;
  //}
  //else {

    i = 0;
    seguir = true; 
    primera_columna_desde_bd = "";

    while(i<cant_key_id && seguir==true) {

      if(desde_bd_array[i]=="s") {
        primera_columna_desde_bd = i;
        seguir = false;
      }
      else {
        seguir = true;
      }

    i=i+1;

    }

  //}

  //alert("OK"+"-"+fila_grid+"-"+primera_columna_desde_bd+"-"+document.getElementById(fila_grid).cells[primera_columna_desde_bd].children[0].value);


  //VERIFICAR QUE HAYA UNA FICHA CARGADA EN LA FILA DEL GRID PARA ASI PERMITIR EDITARLA
  if(document.getElementById(fila_grid).cells[primera_columna_desde_bd].children[0].value!='') {

  //alert("OK");
  
    //PARA EDITAR FICHAS DESDE DOCUMENTOS
    if(document.forms[form_grid].var_ventana.value=="boleta" || document.forms[form_grid].var_ventana.value=="factura" || document.forms[form_grid].var_ventana.value=="inventario") {

      url_ventana = "http://"+host+"/aplicacion/window.php";
      ventana_destino = "ficha_producto";
      entidad_destino = "producto";
      padre = "inventario";

	  //alert("OK");
	  
      cadena_parametros_ventana = url_ventana + "?" + "ventana=" +ventana_destino + "&fila=" + fila + "&padre=" + padre + "&entidad=" + entidad_destino + "&datos=" + datos + "&";

      for(i=0;i<cant_key_id;i++) {
        cadena_parametros_ventana = cadena_parametros_ventana + key_id_array[i] + "=" + document.getElementById(fila_grid).cells[columnas_id[i]].children[0].value + "&";
      }

      cadena_parametros_ventana = cadena_parametros_ventana.substr(0,cadena_parametros_ventana.length-1)

      if(tipo_ventana=="NO_MODAL")
        OpenCenWindow(cadena_parametros_ventana, "nw", 400, 590);
      else if(tipo_ventana=="MODAL")    
        window.showModalDialog(cadena_parametros_ventana,self,"dialogWidth:400px;dialogHeight:635px"); 
    }

    //PARA MOSTRAR DOCUMENTOS TRANSACCIONALES
    else {

	 
	
      url_ventana = "http://"+host+"/aplicacion/window.php";
     
	  //PARA PODER VOLVER AL DOCUMENTO DE ORIGEN
	  ventana = document.forms[form_grid].var_ventana.value;
	  padre = document.forms[form_grid].var_padre.value;
      
	  if(padre=="")
        padre = document.forms[form_grid].var_ventana.value;
	  else
	    padre = padre + "ZX" + ventana;
	  //////
	  
	  
	  

      //PARA VENTANA MODAL (ESTO BUSCAR LOS PARAMETROS DE LA VENTANA ACTUAL Y NO LA DE DESTINO)
      //largo_ventana_px = document.forms[form_grid].var_largo_ventana_px.value+"px";
      //ancho_ventana_px = document.forms[form_grid].var_ancho_ventana_px.value+"px";

      //PARA VENTANA NO MODAL (ESTO BUSCAR LOS PARAMETROS DE LA VENTANA ACTUAL Y NO LA DE DESTINO)
      //largo_ventana = document.forms[form_grid].var_largo_ventana_px.value;
      //ancho_ventana = document.forms[form_grid].var_ancho_ventana_px.value;

      nombre_ventana = "nw";

     largo_ventana = 700;
     ancho_ventana = 850;




//alert(document.forms[form_grid].var_key_id.value);




     //valores_key = new Array();

     //valores_key[0] = document.forms[form_grid].elements["fecha_reserva"+fila].value;
     //valores_key[1] = document.forms[form_grid].elements["hora_inicio_reserva"+fila].value;
     //valores_key[2] = document.forms[form_grid].elements["cod_doctor"+fila].value;

     //valores_key_id = valores_key_1+"-"+valores_key_2+"-"+valores_key_3;

     //BUSCAR CAMPOS ID DOCUMENTO
     //alert(key_id_array+"--"+valores_key_id);

      ////id_documento = array_to_string(valores_key,"^");



     
//alert(columnas_id[0]);

  

      // = document.getElementById(fila_grid).cells[columnas_id[0]].children[0].value;




      //cadena_parametros_ventana = url_ventana + "?" + "ventana=" +ventana_destino + "&padre=" + padre + "&ventana_nombre=" + id_documento;

	  
	 
	
	
		  
	  
		  
	  //CANTIDAD DE KEY_ID DE LA ENTIDAD
	  cant_key_id = key_id_array.length;
	  parametro = "";
	
	  //alert(cant_key_id);
	
	  //AGREGAR LOS DATOS DEL KEY_ID DE LA ENTIDAD A LA URL
	  for(i=0;i<cant_key_id;i++) {
	  
	    //alert(key_id_array[i]);
	    //alert(columnas_id[i]);
	  
	    parametro = parametro + key_id_array[i] + "=" + document.getElementById(fila_grid).cells[columnas_id[i]].children[0].value + "&";   
	  }    
      parametro = parametro.slice(0, -1);
   
	  //alert(parametro);
		  
	  //VER SI TIENE ENTIDAD MADRE (ENTIDAD BAJO LA CUAL EL ID DEL GRID TIENE SENTIDO)
	  entidad_madre = document.forms[form_grid].var_entidad_madre.value;
	  //alert(entidad_madre);
	
	  if(entidad_madre!=""){
	    form_entidad_madre = entidad_madre+"Form";
	
	    //BUSCAR CAMPOS KEY ID DE ENTIDAD MADRE
	    key_id_array = string_to_array(document.forms[form_entidad_madre].var_key_id.value,",");
	    cant_key_id_array = key_id_array.length;
	
	
	
	    //INCORPORARLOS A LA URL
	    for(i=0;i<cant_key_id_array;i++){
		  //alert(key_id_array[i]+"-"+form_entidad_madre);
	      parametros_adicionales_url = "&" + key_id_array[i] + "=" + document.forms[form_entidad_madre].elements[key_id_array[i]].value;
	    }
	  }
	  else
	    parametros_adicionales_url = "";
	 
	 
	 
	
	 
	 
	 
	 
		  
		  
	  //alert(padre);
		  
	  
	  //GENERALIZAR ESTO
	  //if(form_grid=="grid_panel_controlForm") {
	    cadena_parametros_ventana = url_ventana + "?" + "ventana=" +ventana_destino + "&padre=" + padre + "&" + parametro + parametros_adicionales_url;
	  //}
	  //else
      //  cadena_parametros_ventana = url_ventana + "?" + "ventana=" +ventana_destino + "&padre=" + padre + "&" + key_id_array[0] + "=" + id_documento;

	  
	  
	
	
	  //GENERALIZAR ESTO COPEC
	  if(ventana_destino=="ficha_tarea_template" || ventana_destino=="lista_archivos_tarea_template"){
	    id_template = document.forms[form_grid].elements["id_template"+fila].value;
	    cadena_parametros_ventana = cadena_parametros_ventana + "&id_template=" + id_template;
	  }
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  //PARAMETRIZADOR (PARA PODER MANTENER EL NOMBRE DE LA APLICACION QUE SE ESTA PARAMETRIZANDO)
	  if(ventana_destino=="param_ventana" || ventana_destino=="param_ventana_entidad" || ventana_destino=="param_ventana_campo"){
	    if(ventana_destino=="param_ventana")
	      aplicacion = document.forms["filtro_param_aplicacionForm"].elements["aplicacion"].value;
	    else if(ventana_destino=="param_ventana_entidad")
		  aplicacion = document.forms["datos_lista_ven_entForm"].elements["aplicacion"].value;
		else if(ventana_destino=="param_ventana_campo")
		  aplicacion = document.forms["filtro_param_lista_ventana_campoForm"].elements["aplicacion"].value;
		   
	    cadena_parametros_ventana = cadena_parametros_ventana + "&aplicacion=" + aplicacion;
	  }
	  
	  
	  
	  
	  
	  

      //MODAL NO FUNCIONA!!
      tipo_ventana = "NO_MODAL";

      if(tipo_ventana=="NO_MODAL")
        OpenCenWindow(cadena_parametros_ventana, "_self", ancho_ventana, largo_ventana, "yes");
      else if(tipo_ventana=="MODAL")    
        window.showModalDialog(cadena_parametros_ventana,self,"dialogWidth:"+ancho_ventana_px+";dialogHeight:"+largo_ventana_px); 

    }

  }
  else {
    alert("Imposible editar un registro en blanco");
  }

}

//18.///////////////////////////////////////////////////////////////////////////////////////////////


//19.///////////////////////////////////////////////////////////////////////////////////////////////

//CALCULA Y MUESTRA EN PANTALLA EL TOTAL DE UNA FILA DEL GRID
function calcular_total_fila(formulario_grid,id_fila) {

  //alert("CALCULAR TOTAL: "+formulario_grid+"-"+id_fila);

  id_fila_grid = document.forms[formulario_grid].var_entidad.value+id_fila;

  metadata = document.forms[formulario_grid].var_metadata.value;
  col_cantidad = buscar_id("cant",string_to_array(metadata,"^"));

  col_monto = buscar_id("costo",string_to_array(metadata,"^"));

  if(col_monto=="")
    col_monto = buscar_id("venta",string_to_array(metadata,"^"));

  col_descuento = buscar_id("descuento",string_to_array(metadata,"^"));
  col_total = buscar_id("total",string_to_array(metadata,"^"));

  //VALIDAR QUE TODOS SEAN NUMEROS
  valid1 = validar_campo_calculo(id_fila_grid,col_cantidad);
  valid2 = validar_campo_calculo(id_fila_grid,col_monto);

  if(col_descuento!="")
    valid3 = validar_campo_calculo(id_fila_grid,col_descuento);
  else
    valid3 = false;

  if(valid1==true && valid2==true && valid3==false) {
    evaluacion = "cantidad && monto";

    cantidad = document.getElementById(id_fila_grid).cells[col_cantidad].children[0].value;
    monto = document.getElementById(id_fila_grid).cells[col_monto].children[0].value;   
    descuento = 0;
  }
  else if(valid1==true && valid2==true && valid3==true) {
    evaluacion = "cantidad && monto && descuento";

    cantidad = document.getElementById(id_fila_grid).cells[col_cantidad].children[0].value;
    monto = document.getElementById(id_fila_grid).cells[col_monto].children[0].value;
    descuento = document.getElementById(id_fila_grid).cells[col_descuento].children[0].value;
  }

  //SI TODOS EXISTEN Y ESTAN VALIDADOS, CALCULAR EL TOTAL DE LA FILA
  if(eval(evaluacion)) {
    document.getElementById(id_fila_grid).cells[col_total].children[0].value = parseInt(cantidad) * (parseInt(monto) - parseInt(descuento));
  } 
  //SI NO HAY MONTO, DEJAR TODO EN CERO
  else {
    if(col_descuento!='')
      document.getElementById(id_fila_grid).cells[col_descuento].children[0].value = "0";
    if(col_total!='')
      document.getElementById(id_fila_grid).cells[col_total].children[0].value = "0";
  }
  
  //CALCULAR EL TOTAL DEL GRID
  //calcular_totales_grid(ventana,entidad,formulario_grid);

  //CALCULAR EL VUELTO
  //if(ventana=='boleta')
  //  calcular_vuelto(ventana,formulario_grid,document.forms[formulario_grid].pago.value);
}

//19.///////////////////////////////////////////////////////////////////////////////////////////////

//20.///////////////////////////////////////////////////////////////////////////////////////////////
//DEBE ESTAR COMPLETO EL CAMPO FOCO PARA QUE ESTA FUNCION OPERE CORRECTAMENTE

function cargar_datos_ficha(campo_foco){

  //alert("CARGAR DATOS FICHA");
  
 
  
  //FORMATO DEL CAMPO campo_foco: nombre_formulario.nombre_campo	
  campo_foco_array = string_to_array(campo_foco,".");
  
 
  
  //formulario = "tarea_templateForm";
  formulario = campo_foco_array[0];
  
  
  
  tiene_cod_interno = isset(document.forms[formulario].elements["cod_interno"]);
   
 
   
  //SI HAY CAMPO COD_INTERNO, USARLO COMO ID PARA EFECTO DE CARGAR LA FICHA
  if(tiene_cod_interno==true){
    campo_actual = "cod_interno";
    campo_id = "cod_interno";
  }
  //SI NO HAY CAMPO COD_INTERNO, USAR CAMPO FOCO COMO ID PARA EFECTO DE CARGAR LA FICHA
  else{
    campo_actual = campo_foco_array[1];
    campo_id = campo_foco_array[1];
  }
  
  //campo_actual = "id_template";
  //ARCOR: GENERALIZAR (PROBLEMA CON MOSTRAR COD_INTERNO)
  //if(formulario=="sucursal2Form" || formulario=="usuarioForm")
  //  campo_actual = "cod_interno";
  //else
  //  campo_actual = campo_foco_array[1];

  validacion = "";
  
  //campo_id = "id_template,id_tarea";
  //ARCOR: GENERALIZAR (PROBLEMA CON MOSTRAR COD_INTERNO)
  //if(formulario=="sucursal2Form" || formulario=="usuarioForm")
  //  campo_id = "cod_interno";
  //else
  //  campo_id = campo_foco_array[1];
 
  id_fila = "";

  //alert(campo_actual);
  
  if(document.forms[formulario].elements[campo_actual].value!="" && document.forms[formulario].elements[campo_actual].value!="99"){
    validar_datos(formulario,campo_actual,validacion,campo_id,id_fila);
  }
  
} 

//20.///////////////////////////////////////////////////////////////////////////////////////////////

//22.///////////////////////////////////////////////////////////////////////////////////////////////

function validar_campo_calculo(id_fila_grid,col_campo) {

  if(isset(col_campo)) {
    campo = document.getElementById(id_fila_grid).cells[col_campo].children[0].value;

    if(validar_numero_entero(formulario,metadata,campo)==false)
      validado = false; 
    else
      validado = true; 
  }
  
  return validado;

}

//22.///////////////////////////////////////////////////////////////////////////////////////////////


//23.///////////////////////////////////////////////////////////////////////////////////////////////

//CALCULA Y MUESTRA EN PANTALLA EL SUBTOTAL,EL IVA Y EL TOTAL DE UN GRID
function calcular_total_grid(formulario_grid) {

  entidad = document.forms[formulario_grid].var_entidad.value;

  //PARAMETROS
  sub_total_grid = "sub_total";
  total_grid = "total";
  tiene_totales = document.forms[formulario_grid].var_tiene_totales.value;
  calcula_sub_total = tiene_totales;
  calcula_total = tiene_totales;
  metadata = document.forms[formulario_grid].var_metadata.value;
  columna_total = buscar_id(total_grid,string_to_array(metadata,"^"));
  formulario_totales = document.forms[formulario_grid].var_form_totales.value;
  porcentaje_iva = "0.19";

  if(isset(document.forms[formulario_totales].descuentos.value))
    descuentos = document.forms[formulario_totales].descuentos.value;
  else
    descuentos = 0;

  if(isset(document.forms[formulario_totales].cargos.value))
    cargos = document.forms[formulario_totales].cargos.value;
  else
    cargos = 0;

  if(isset(document.forms[formulario_grid].var_filas.value))
    cant_filas = document.forms[formulario_grid].var_filas.value;
  else
    cant_filas = 0;

  //CALCULA EL SUB TOTAL DE UN GRID, EFECTUANDO LA SUMA LOS TOTALES DE CADA FILA, AVANZANDO FILA POR FILA.
  objeto_grid = document.getElementById(entidad);

  if(calcula_sub_total=='S') {
    sub_total = 0;

    for (i=0;i<=cant_filas;i++) {
      sub_total = sub_total + parseInt(objeto_grid.rows[i+1].cells[columna_total].children[0].value);
    }

  document.forms[formulario_totales].elements["sub_total"].value = sub_total;
    
  }

  //CALCULA EL TOTAL DE UN GRID, UTILIZANDO EL IVA, CARGOS Y DESCUENTOS.
  if(calcula_total=='S') {
    if(ventana=='factura' || ventana=='guiadespacho' || ventana=='notacredito') {
      iva = Math.round((parseInt(sub_total) - parseInt(descuentos) + parseInt(cargos))*parseFloat(porcentaje_iva));
      document.forms[formulario_totales].iva.value = iva;
    }
    else {
      iva = 0;
    }

    document.forms[formulario_totales].elements["total"].value = parseInt(sub_total) - parseInt(descuentos) + parseInt(cargos) + parseInt(iva);
  
  }

}

//23.///////////////////////////////////////////////////////////////////////////////////////////////


//24.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA NEGOCIO: calcular vuelto (SOLO NICOLE)
//20.10.2013 GPS

function calcular_vuelto(formulario) {

tipo_estructura = document.forms[formulario].var_tipo_estructura.value;

if(tipo_estructura=="grid")
  formulario_totales = document.forms[formulario].var_form_totales.value;
else
  formulario_totales = formulario;

formulario_pagos= "formaPagoForm";

ventana = document.forms[formulario].var_ventana.value;

  if(ventana=="boleta" || ventana=="factura_venta") {
    if(document.forms[formulario_pagos].efectivo.value!="0" || document.forms[formulario_pagos].cheque.value!="0" || document.forms[formulario_pagos].debito.value!="0" || document.forms[formulario_pagos].credito.value!="0" || document.forms[formulario_pagos].nota_credito.value!="0") {
      document.forms[formulario_pagos].elements("vuelto").value = parseInt(document.forms[formulario_pagos].efectivo.value) + parseInt(document.forms[formulario_pagos].cheque.value) + parseInt(document.forms[formulario_pagos].debito.value) + parseInt(document.forms[formulario_pagos].credito.value) + parseInt(document.forms[formulario_pagos].nota_credito.value) - parseInt(document.forms["totalGridBoletaForm"].total.value);
    }
    else
      document.forms[formulario_pagos].elements("vuelto").value = "0";
  }

}

//24.///////////////////////////////////////////////////////////////////////////////////////////////


//25.///////////////////////////////////////////////////////////////////////////////////////////////

function validar_id_unico(id_grid) {

cant_rows = document.getElementById(id_grid).getElementsByTagName("TR").length-1;
columna_id = 1;
validado = "SI";

  for(i=1;i<=cant_rows;i++) {

    id_actual = document.getElementById(id_grid).rows[i].cells[columna_id].children[0].value;

    for(k=1+i;k<=cant_rows;k++) {
      if(id_actual==document.getElementById(id_grid).rows[k].cells[columna_id].children[0].value)
        validado = "NO";
    }

  }

return validado;

}

//25.///////////////////////////////////////////////////////////////////////////////////////////////




//27.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA NEGOCIO: calcular IVA (SOLO NICOLE)
//20.10.2013 GPS

//CALCULA Y MUESTRA EN PANTALLA EL IVA Y EL TOTAL DE UN GRID (AL SACAR EL FOCO DE DESCUENTOS O CARGOS)
function calcular_iva_total(llamador,total_form_grid) {

  //PARAMETROS
  sub_total_grid = "sub_total";
  descuentos_grid = "descuentos";
  cargos_grid = "cargos";
  iva_grid = "iva";
  total_grid = "total";

  formulario_pagos = "formaPagoForm";

  ventana = document.forms[total_form_grid].var_ventana.value;
  descuentos = document.forms[total_form_grid].elements[descuentos_grid].value;
  cargos = document.forms[total_form_grid].elements[cargos_grid].value;

  if(es_numero(descuentos)==true) {

    if(es_numero(cargos)==true ) {

      if(descuentos=='') {
        descuentos = 0;
        document.forms[form_grid].elements[descuentos_grid].value = descuentos;
      }
      if(cargos=='') {
        cargos = 0;
        document.forms[form_grid].elements[cargos_grid].value = cargos;
      }

      sub_total = document.forms[total_form_grid].elements[sub_total_grid].value;

      if(ventana=='boleta' || ventana=='consumo_interno')
        iva = 0;
      else 
        iva = Math.round((parseInt(sub_total) - parseInt(descuentos) + parseInt(cargos))*porcentaje_iva);

      total = parseInt(sub_total) - parseInt(descuentos) + parseInt(cargos) + parseInt(iva);  

      if(ventana=='factura'  || ventana=='guiadespacho')
        document.forms[total_form_grid].elements[iva_grid].value = iva;

      document.forms[total_form_grid].elements[total_grid].value = total;  

      //alert("PAGO:"+document.forms[total_form_grid].pago.value);

      if((ventana=='boleta' || ventana=='cambio') && (document.forms[formulario_pagos].efectivo.value!="0" || document.forms[formulario_pagos].cheque.value!="0" || document.forms[formulario_pagos].debito.value!="0" || document.forms[formulario_pagos].credito.value!="0" || document.forms[formulario_pagos].nota_credito.value!="0"))
        calcular_vuelto(total_form_grid);

      if(ventana=='cambio')
        calcular_cambio(total_form_grid) 

    }
    else {
      if(llamador=="cargos") {
        //<JasobNoObfsStr>
        alert("El valor ingresado debe ser un número.");
        //</JasobNoObfsStr>
        document.forms[total_form_grid].elements[cargos_grid].focus();
      }
    }
  }
  else {
    if(llamador=="descuentos") {
      //<JasobNoObfsStr>
      alert("El valor ingresado debe ser un número.");
      //</JasobNoObfsStr>
      document.forms[total_form_grid].elements[descuentos_grid].focus();
    }
  }

}

//27.///////////////////////////////////////////////////////////////////////////////////////////////


//28.///////////////////////////////////////////////////////////////////////////////////////////////
//AJAX: buscar del paginador
//20.10.2013 GPS

function buscar_lista(_formulario,_pagina) {

  //alert("BOTON_BUSCAR: "+_formulario+"-"+_pagina);
  _id_fila = "";

  //GUARDAR LA POSICION DE LOS SCROLLER 
  saveScrollPositions(_formulario); 
  
  document.forms[_formulario].var_accion.value='buscar_lista';
  _cadena_valores = document.forms[_formulario].var_cadena_valores_filtro.value+"&"; 
  _cadena_valores = _cadena_valores + crearCadenaValoresAdicionalesFicha(_formulario,_id_fila);
  
  //alert(_cadena_valores);
  loadurl_xml('PageLogicPHP.php',_cadena_valores,triggered_xml);
 
} 

//28.///////////////////////////////////////////////////////////////////////////////////////////////


//29.///////////////////////////////////////////////////////////////////////////////////////////////


//29.///////////////////////////////////////////////////////////////////////////////////////////////


//30.///////////////////////////////////////////////////////////////////////////////////////////////

//30.///////////////////////////////////////////////////////////////////////////////////////////////


//31.///////////////////////////////////////////////////////////////////////////////////////////////
//AJAX:
//20.10.2013 GPS

function cargar_Ventana(_formulario) {

  _validar_entidad = camposFichaObligatorios(_formulario);

  if(_validar_entidad==false) {
      //<JasobNoObfsStr>
      alert("¡Debe ingresar todos los campos obligatorios!");
      //</JasobNoObfsStr>
  }
  else {

    _cadena_valores = crearCadenaValoresFicha(_formulario,""); 
    _cadena_valores = _cadena_valores + crearCadenaValoresAdicionalesFicha(_formulario,"");
    loadurl_xml('action_local_caja.php',_cadena_valores,triggered_local_caja_xml);
  }

}

//31.///////////////////////////////////////////////////////////////////////////////////////////////


//32.///////////////////////////////////////////////////////////////////////////////////////////////

//32.///////////////////////////////////////////////////////////////////////////////////////////////


//33.///////////////////////////////////////////////////////////////////////////////////////////////

//33.///////////////////////////////////////////////////////////////////////////////////////////////


//34.///////////////////////////////////////////////////////////////////////////////////////////////

//34.///////////////////////////////////////////////////////////////////////////////////////////////


//35.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA NEGOCIO: permite ver fichas desde una lista de transacciones
//20.10.2013 GPS

function ver_documento(_formulario, _num_fila) {

  //VENTANA DE VISUALIZACION
  if(document.forms[_formulario].ventana.value=="lista_boleta")
    _ventana = "ver_boleta_venta";
  else if(document.forms[_formulario].ventana.value=="lista_liquidacion")
    _ventana = "ver_liquidacion";

  //PADRE DE LA VENTANA (es la ventana actual)
  _padre = document.forms[_formulario].ventana.value;

  //CAMPO ID DEL GRID
  _campo = document.forms[_formulario].key_id.value+_num_fila;

  //NUMERO ID DEL DOCUMENTO QUE SE DESEA VER
  _id_documento = document.forms[_formulario].elements[_campo].value;
 
  OpenCenWindow("http://"+host+"/aplicacion/window.php?ventana="+_ventana+"&padre="+_padre+"&id_documento="+_id_documento, "nombre_ventana", "900", "1000", "yes");
 
}

//35.///////////////////////////////////////////////////////////////////////////////////////////////


//36.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA NEGOCIO: limpiar los campos en el formulario en pantalla
//13.03.2014 GPS

function limpiarCampos(_formulario, _separador_campos, _id_fila){

  _campos = document.forms[_formulario].elements["var_metadata"].value;
  _campos_array = _campos.split(_separador_campos);
  _cant_campos = _campos_array.length; 

  for(_i=0;_i<_cant_campos;_i++){

    if(_campos_array[_i]=="aplicacion_web" || _campos_array[_i]=="pantalla" || _campos_array[_i]=="nombre_usuario") {
    }
    else {
      if(_campos_array[_i]!="estado")
        document.forms[_formulario].elements[_campos_array[_i]+_id_fila].value = "";
      else if(_campos_array[_i]=="estado")
        document.forms[_formulario].elements[_campos_array[_i]+_id_fila].value = "0";
    }

  }

  if(_campos_array[0]=="cod_interno")
    document.forms[_formulario].elements[_campos_array[1]+_id_fila].focus();
  else
    document.forms[_formulario].elements[_campos_array[0]+_id_fila].focus();

}

//36.///////////////////////////////////////////////////////////////////////////////////////////////


//37.///////////////////////////////////////////////////////////////////////////////////////////////

//ESTA DONDE SE USA?? (en la funcion de abajo)

function limpiar(formulario,key_id,id_fila,search) { 

  //PARA EL CASO QUE ESTOY EN LA VENTANA SEARCH
  if(search=="SEARCH_WINDOW") {
    metadata = window.opener.document.forms[formulario].var_metadata.value.split("^");
    tipo_metadata = window.opener.document.forms[formulario].var_tipo.value.split("^");
    desde_bd = window.opener.document.forms[formulario].var_desde_bd.value.split("^");
  }
  else {
    metadata = document.forms[formulario].var_metadata.value.split("^");
    tipo_metadata = document.forms[formulario].var_tipo.value.split("^");
    desde_bd = document.forms[formulario].var_desde_bd.value.split("^");
  }

  //LIMPIAR CADA UNO DE LOS CAMPOS DE ACUERDO AL TIPO DE CAMPO (INPUT, SELECT, CHECKBOX)
  cant_metadata = metadata.length;

  for(i=0;i<cant_metadata;i++) {

    //alert(metadata[i] + "-" + tipo_metadata[i] + "-" + desde_bd[i]);
  
    if(desde_bd[i]=="s" || desde_bd[i]=="1") {

      //PARA EL CASO QUE ESTOY EN LA VENTANA SEARCH
      if(search=="SEARCH_WINDOW") {
        if(tipo_metadata[i]=="input" || tipo_metadata[i]=="textarea")
          window.opener.document.forms[formulario].elements[metadata[i]].value = "";
		else if(tipo_metadata[i]=="hidden")
          window.opener.document.forms[formulario].elements[metadata[i]].value = "";
        else if(tipo_metadata[i]=="select")
          window.opener.document.forms[formulario].elements[metadata[i]].selectedIndex = 0;
        else if(tipo_metadata[i]=="checkbox")
          window.opener.document.forms[formulario].elements[metadata[i]].checked = false;
        else if(tipo_metadata[i]=="")
          window.opener.document.forms[formulario].elements[metadata[i]].value = "";
      }
      else {
        if(tipo_metadata[i]=="input" || tipo_metadata[i]=="textarea")
          document.forms[formulario].elements[metadata[i]+id_fila].value = ""; 
		//SI SE DESCOMENTA BORRA LOS HIDDEN EN "SOPORTE" Y GRABARA MAL
		//else if(tipo_metadata[i]=="hidden")
        //  document.forms[formulario].elements[metadata[i]].value = "";
        else if(tipo_metadata[i]=="select")
          document.forms[formulario].elements[metadata[i]+id_fila].selectedIndex = 0;
        else if(tipo_metadata[i]=="checkbox")
          document.forms[formulario].elements[metadata[i]+id_fila].checked = false;
        else if(tipo_metadata[i]=="")
          document.forms[formulario].elements[metadata[i]+id_fila].value = "";
      }

    }

  }

  //DESBLOQUEAR LOS CAMPOS IDENTIFICADOR QUE FUERON BLOQUEADOS
  //key_id_array = document.forms[formulario].var_key_id.value.split(",");
  //cant_key_id = key_id_array.length;

  //for(i=0;i<cant_key_id;i++) {
  //  document.forms[formulario].elements[key_id_array[i]].disabled = false;
  //}

  //UBICAR EL FOCO EN EL CAMPO CORRESPONDIENTE
  //setFocus(key_id_array[0]);
 
}

//37.///////////////////////////////////////////////////////////////////////////////////////////////


//38.///////////////////////////////////////////////////////////////////////////////////////////////

function select_box(campo,form) {




  key_id = window.opener.document.forms[form].elements["var_key_id"].value;
  
  campo_id = "";

  
  
  //PARA SEPARAR TODOS LOS CAMPOS QUE CONFORMEN EL CAMPO ID ACTUAL, EN EL CASO QUE HAYA MAS DE UN CAMPO ID
  campos_id_array_0 = string_to_array(key_id,";");
  a=0;

  if(campos_id_array_0.length>1) {

    while(a<campos_id_array_0.length) {

      posicion_campo_id = campos_id_array_0[a].indexOf(campo);

      //SI ENCUENTRA EL CAMPO ACTUAL EN UN CAMPO ID
      if(posicion_campo_id>=0)
        campo_id = campos_id_array_0[a];

    a=a+1;
    }

  key_id = campo_id;

  }

  //alert(campo+"-"+form+"-"+key_id);

  if(campo==key_id) {
    opener.document.forms[form].elements[campo].disabled=false;

    //EL CAMPO DONDE VA SEARCH_WINDOW ES PARA QUE DIFERENCIE EL LIMPIAR CUANDO ES LA VENTANA SEARCH
    limpiar(form,key_id,"","SEARCH_WINDOW");

    window.opener.document.forms[form].elements[campo].value = document.form1.milista.options[document.getElementById('milista').selectedIndex].text;
    if(opener.document.forms[form].elements[campo].disabled==false){
	  //PERMITE QUE AL ELEGIR UN VALOR EN UN SEARCH, SE CARGUE LA FICHA COMPLETA ASOCIADA A ESE VALOR
      opener.document.forms[form].elements[campo].focus();
	  opener.document.forms[form].elements[campo].blur();
	  opener.document.forms[form].elements[campo].focus();
	} 
    window.close();
  } 
  else {
    window.opener.document.forms[form].elements[campo].value = document.form1.milista.options[document.getElementById('milista').selectedIndex].text;
    if(opener.document.forms[form].elements[campo].disabled==false) {
	  //PERMITE QUE AL ELEGIR UN VALOR EN UN SEARCH, SE CARGUE LA FICHA COMPLETA ASOCIADA A ESE VALOR
      opener.document.forms[form].elements[campo].focus();
	  opener.document.forms[form].elements[campo].blur();
	  opener.document.forms[form].elements[campo].focus();
    } 
    window.close();
  } 

}

//38.///////////////////////////////////////////////////////////////////////////////////////////////


//39.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA NEGOCIO: abre popup con valores disponibles para un campo
//13.03.2014 GPS

function ventanaBuscar(_entidad,_campo,_ventana) {
  //GENERALIZAR: ajustar automático el ancho en funcion del ancho de los datos que se muestran
  OpenCenWindow("MarkupLogic/search.php?ventana="+_ventana+"&entidad="+_entidad+"&campo="+_campo, "buscar_"+_ventana, 500, 440);
  //window.showModalDialog("http://"+host+"/aplicacion/search/search.php?ventana="+ventana+"&entidad="+entidad+"&campo="+campo,self,"dialogWidth:500px;dialogHeight:500px")
}

//39.///////////////////////////////////////////////////////////////////////////////////////////////


//40.///////////////////////////////////////////////////////////////////////////////////////////////

//40.///////////////////////////////////////////////////////////////////////////////////////////////


//41.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA NEGOCIO: abre una nueva ventana en tamaño máximo de la pantalla
//13.03.2014 GPS

function f_open_window_max(_aURL, _aWinName,_formulario) {

   var _wOpen;
   var _sOptions;

   //alert(_aURL +"-"+ _aWinName +"-"+ _formulario);

   _sOptions = 'status=yes,menubar=no,scrollbars=yes,resizable=yes,toolbar=no,location=no';
   _sOptions = _sOptions + ',width=' + (screen.availWidth-10).toString();
   _sOptions = _sOptions + ',height=' + (screen.availHeight-122).toString();
   _sOptions = _sOptions + ',screenX=0,screenY=0,left=0,top=0';

   var _thetime=new Date(); 
   var _nhours=_thetime.getHours(); 
   var _nmins=_thetime.getMinutes(); 
   var _nsecn=_thetime.getSeconds(); 

   _time = _nhours + "" + _nmins + "" + _nsecn;

   //alert(_aWinName + _time);

   //AL INCLUIR LA VARIABLE TIME TODAS LAS VENTANAS TENDRAN NOMBRES DISTINTOS, POR LO QUE SE PODRAN ABRIR MUCHAS A LA VEZ
   _wOpen = window.open( '', _aWinName + _time, _sOptions );

   //PARA QUE PASE LOS VALORES DEL FILTRO A PHP, PERO SIN CONSIDERAR CADENA_VALORES_ADICIONALES
   _posicion_ventana= document.forms[_formulario].var_cadena_valores_filtro.value.search("&ventana");

   //document.forms[_formulario].var_cadena_valores_filtro.value = document.forms[_formulario].var_cadena_valores_filtro.value.substring(0,_posicion_ventana);

   //_aURL = _aURL + "&" + document.forms[_formulario].var_cadena_valores_filtro.value;
   _aURL = _aURL + "&" + document.forms[_formulario].var_cadena_valores_filtro.value.substring(0,_posicion_ventana);

   //SOLO SI EL ULTIMO CARACTER ES UN &
   if(_aURL.substr(_aURL.length-1,_aURL.length)=="&")
     _aURL = _aURL.substr(0,_aURL.length-1);

   _wOpen.location = _aURL;
   _wOpen.focus();
   _wOpen.moveTo(0,0);
   _wOpen.resizeTo(screen.availWidth, screen.availHeight);
   //return _wOpen;
}

//41.///////////////////////////////////////////////////////////////////////////////////////////////


//42.///////////////////////////////////////////////////////////////////////////////////////////////

function exportar_a_excel_php(aURL,formulario) {
   
//PARA QUE PASE LOS VALORES DEL FILTRO A PHP PARA CONSTRUIR EL SQL
aURL = aURL + "&" + document.forms[formulario].var_cadena_valores_filtro.value;

//SOLO SI EL ULTIMO CARACTER ES UN &
if(aURL.substr(aURL.length-1,aURL.length)=="&")
  aURL = aURL.substr(0,aURL.length-1);

//GENERALIZAR COPEC: PARA PODER EXPORTAR LAS 8 TABLAS  
if(formulario=="grid_seguimiento8Form"){
  id_template = document.forms["datos_seguimientoForm"].elements["id_template"].value;
  aURL = aURL + "&id_template="+id_template;
}
  
//alert(aURL);

window.location = aURL;

}

//42.///////////////////////////////////////////////////////////////////////////////////////////////

//43.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA NEGOCIO: manejas 2 números de boleta (SOLO NICOLE y/o SALVADOR)
//20.10.2013 GPS

function cambiar_numero_boleta() {

  formulario = "datosForm";

  values = document.forms[formulario].elements['valores_boleta'].value;
  values_array = string_to_array(values,"^");

  if(document.forms[formulario].elements['tipo_documento'].value=="2")
    i = 0;
  else
    i = 1;

  document.forms[formulario].elements['numeroboleta'].value = values_array[i];

}

//43.///////////////////////////////////////////////////////////////////////////////////////////////

//44.///////////////////////////////////////////////////////////////////////////////////////////////

function crear_tarea_hija(host) {

  tarea_actual = document.forms["tareasForm"].elements["cod_interno"].value;

  if(tarea_actual!="") {

    tipo_ventana = "NO_MODAL";
    url_ventana = "http://"+host+"/aplicacion/window.php";
    ventana_destino = "ficha_tarea";

    padre = document.forms["ventanaForm"].elements["padre"].value;

    if(padre=="")
      padre="ficha_tarea";

    cadena_parametros_ventana = url_ventana + "?" + "ventana=" +ventana_destino + "&padre=" + padre + "&tarea_padre=" + tarea_actual + "&";
    cadena_parametros_ventana = cadena_parametros_ventana.substr(0,cadena_parametros_ventana.length-1)

    if(tipo_ventana=="NO_MODAL")
      OpenCenWindow(cadena_parametros_ventana, "nw", 400, 590);
    else if(tipo_ventana=="MODAL")    
      window.showModalDialog(cadena_parametros_ventana,self.location,"dialogWidth:400px;dialogHeight:635px"); 

  }
  else
    alert("Debe seleccionar una tarea antes de crear una tarea hija.");

}

//44.///////////////////////////////////////////////////////////////////////////////////////////////

//45.///////////////////////////////////////////////////////////////////////////////////////////////

function ver_tarea_padre(host) {

  if(document.forms["tareasForm"].elements["tarea_padre"].value!="") {

    tarea_padre = document.forms["tareasForm"].elements["tarea_padre"].options[document.forms["tareasForm"].elements["tarea_padre"].selectedIndex].text;

    if(tarea_padre!="") {

      tipo_ventana = "NO_MODAL";
      url_ventana = "http://"+host+"/aplicacion/window.php";
      ventana_destino = "ficha_tarea";

      //ESTA VARIABLE SE SETEA SOLO PARA QUE SE CARGUE LA FICHA AUTOMATICAMENTE CON DATOS
      padre = document.forms["ventanaForm"].elements["padre"].value;

      if(padre=="")
        padre="ficha_tarea";

      cadena_parametros_ventana = url_ventana + "?" + "ventana=" +ventana_destino + "&padre=" + padre + "&descripcion=" + "&descripcion=" + tarea_padre + "&";
      cadena_parametros_ventana = cadena_parametros_ventana.substr(0,cadena_parametros_ventana.length-1)

      if(tipo_ventana=="NO_MODAL")
        OpenCenWindow(cadena_parametros_ventana, "nw", 400, 590);
      else if(tipo_ventana=="MODAL")    
        window.showModalDialog(cadena_parametros_ventana,self,"dialogWidth:400px;dialogHeight:635px"); 

    }
    else
      alert("Debe seleccionar una tarea antes de acceder a la tarea padre.");

  }
  else
    alert("La tarea no tiene una tarea padre.");

}

//45.///////////////////////////////////////////////////////////////////////////////////////////////

//46.///////////////////////////////////////////////////////////////////////////////////////////////

function ver_tareas_hijas(fila) {

  tarea_padre = document.forms["grid_tareaForm"].elements["cod_interno"+fila].value;
  document.forms["filtro_tareaForm"].elements["descripcion"].value = "";
  document.forms["filtro_tareaForm"].elements["tarea_padre"].value = tarea_padre;

  document.getElementById('Buscar').click();

}

//46.///////////////////////////////////////////////////////////////////////////////////////////////

//47.///////////////////////////////////////////////////////////////////////////////////////////////

function ver_tarea_padre_grid(fila) {

  //EL NUMERO DE ESTA TAREA DEBE SER EL ID DE LA TAREA RAIZ
  if(document.forms["grid_tareaForm"].elements["tarea_padre"+fila].value!="" && document.forms["grid_tareaForm"].elements["tarea_padre"+fila].value!="9999") {

    document.forms["filtro_tareaForm"].elements["tarea_padre"].value = document.forms["grid_tareaForm"].elements["tarea_padre"+fila].value;
    tarea_padre = document.forms["filtro_tareaForm"].elements["tarea_padre"].options[document.forms["filtro_tareaForm"].elements["tarea_padre"].selectedIndex].text;
    document.forms["filtro_tareaForm"].elements["descripcion"].value = tarea_padre;
    document.forms["filtro_tareaForm"].elements["tarea_padre"].value = "";

    document.getElementById('Buscar').click();

  }

}

//47.///////////////////////////////////////////////////////////////////////////////////////////////


//48.///////////////////////////////////////////////////////////////////////////////////////////////

//48.///////////////////////////////////////////////////////////////////////////////////////////////


//49.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA NEGOCIO: permite abrir ventana para editar fichas
//13.03.2014 GPS

function editar_tarea(_fila,_host,_form_grid,_ventana_destino,_tarea) {

  //alert("EDITAR: "+_fila+"-"+_host+"-"+_form_grid+"-"+_ventana_destino+"-"+_tarea);

  _padre = "principal";
  _nombre_ventana = "nw";
  _largo_ventana = 700;
  _ancho_ventana = 850;

  _url_ventana = "http://"+_host+"/aplicacion/window.php"; 
  _cadena_parametros_ventana = _url_ventana + "?" + "ventana=" +_ventana_destino + "&padre=" + _padre + "&" + "descripcion=" + _tarea;

  _tipo_ventana="NO_MODAL";

  if(_tipo_ventana=="NO_MODAL")
    OpenCenWindow(_cadena_parametros_ventana, _nombre_ventana, _ancho_ventana, _largo_ventana, "yes");
  else if(_tipo_ventana=="MODAL")    
    window.showModalDialog(_cadena_parametros_ventana,self,"dialogWidth:"+ancho_ventana_px+";dialogHeight:"+largo_ventana_px); 

}

//49.///////////////////////////////////////////////////////////////////////////////////////////////


//50.///////////////////////////////////////////////////////////////////////////////////////////////
//AJAX: enviar clave al mail
//13.10.2013 GPS

function enviar_clave_al_mail(_fila,_formulario) {
  //alert("ENVIAR CLAVE AL MAIL");
  _cadena_valores = "id_usuario="+document.forms[_formulario].elements["cod_interno"+_fila].value;
  loadurl_xml('action_enviar_clave.php',_cadena_valores,triggered_xml);
}

//50.///////////////////////////////////////////////////////////////////////////////////////////////


//51.///////////////////////////////////////////////////////////////////////////////////////////////
//AJAX: cargar select asociado (Ej: comunas en base a una región)
//20.10.2013 GPS

function cargar_selectbox_asociado(nombre_campo_selectbox, formulario_selectbox) {

  //HAY UN PROBLEMA PARA CUANDO SON SUBFORMULARIOS!!

  //alert("CARGAR_SELECTBOX_ASOCIADO"+"---"+nombre_campo_selectbox+"---"+formulario_selectbox); 
 
  nombre_archivo_php = "action_select.php";
 
  if(formulario_selectbox=="informe_punto_ventaForm")
    nombre_variable = "id_estado_promocion";
  else
    nombre_variable = nombre_campo_selectbox;
  
  //VALOR QUE SE USARA COMO FILTRO PARA CARGAR EL SELECT ASOCIADO
  valor_select = document.forms[formulario_selectbox].elements[nombre_campo_selectbox].value;
 
  //CUANDO ES UN SUBFORMULARIO, DEBE TRAER EL DATO DEL CAMPO ASCOIADO DESDE EL SUBFORMULARIO (EN VEZ DEL FORMULARIO)
  campo_asociado_array = string_to_array(document.forms[formulario_selectbox].elements["var_campo_asociado"].value,"^");
  metadata_array = string_to_array(document.forms[formulario_selectbox].elements["var_metadata"].value,"^");
 
  //POSICION DEL SELECTBOX DENTRO DEL FORMULARIO
  if(formulario_selectbox=="informe_punto_ventaForm")
    posicion = 1;
  else
    posicion = posicion_campo(nombre_campo_selectbox, metadata_array);
 
  //VALOR EN BD DEL CAMPO_ASOCIADO
  trio_campo_asociado = campo_asociado_array[posicion];
  trio_campo_asociado_array = string_to_array(trio_campo_asociado,",");
  
  //SEPARAR LOS 3 VALORES
  if(formulario_selectbox=="informe_punto_ventaForm"){
    //campo_asociado = "id_detalle_promocionx";
	//campo_asociado_bd = "nombre_detalle_estado_promocionx";
	//tabla = "detalle_estado_promocionx";
	
	//ESTE VALOR ESTA RARO ACA
    //nombre_campo_selectbox = "id_estado_promocion";
  }
  else{
    campo_asociado = trio_campo_asociado_array[0];
    campo_asociado_bd = trio_campo_asociado_array[1];
    tabla = trio_campo_asociado_array[2];
  }
   
  cadena_valores = nombre_variable+"="+valor_select+"&formulario="+formulario_selectbox+"&campo="+nombre_campo_selectbox+"&campo_asociado="+campo_asociado+"&campo_asociado_bd="+campo_asociado_bd+"&tabla="+tabla;
  //alert(cadena_valores);

  loadurl_xml(nombre_archivo_php,cadena_valores,triggered_select_xml);

}

//51.///////////////////////////////////////////////////////////////////////////////////////////////

//52.///////////////////////////////////////////////////////////////////////////////////////////////

function file_upload() {

  if(document.forms["cotizacionesForm"].elements["var_existe"].value=="true")
    $('#file_upload').uploadifyUpload();
  else
    alert("No hay una ficha para adjuntar el archivo");

}

//52.///////////////////////////////////////////////////////////////////////////////////////////////

//53.///////////////////////////////////////////////////////////////////////////////////////////////


function enviar_mail() {

  //alert("ENVIAR MAIL");
  loadurl_xml("action_enviar_mail.php","",triggered_xml);

}

//53.///////////////////////////////////////////////////////////////////////////////////////////////

//54.///////////////////////////////////////////////////////////////////////////////////////////////

//SE DEBE ELIMINAR
function auto_check() {

  loadurl_xml("action_autocheck.php","",triggered_xml);

}

//54.///////////////////////////////////////////////////////////////////////////////////////////////

//55.///////////////////////////////////////////////////////////////////////////////////////////////

//PARA CREAR UNA NUEVA FILA EN UN GRID (BOTON VERDE)
function editar2(fila,host,form_grid,ventana_destino){

  //alert("EDITAR2: "+fila+"-"+host+"-"+form_grid+"-"+ventana_destino);

  ventana = document.forms[form_grid].var_ventana.value;
  padre = document.forms[form_grid].var_padre.value;
  key_id_array = string_to_array(document.forms[form_grid].var_key_id.value,",");
  cant_key_id = key_id_array.length;
  
  //MODAL: ABRE LA FICHA EN UNA SEGUNDA VENTANA, NO_MODAL: USA LA MISMA VENTANA PARA ABRIR LA FICHA
  if(ventana=="ficha_informe_turno")
	tipo_ventana = "NO_MODAL";
  else
    tipo_ventana = "NO_MODAL";
  
  url_ventana = "http://"+host+"/aplicacion/window.php";
  nombre_ventana = "nw";
  largo_ventana = 700;
  ancho_ventana = 850;

  //PARA NO PERDER LA LISTA DE PADRES AL HACER DRILL DOWN
  if(padre=="")
    padre = ventana;
  else
    padre = padre+"ZX"+ventana;

  //KEBELCO: GENERALIZAR ESTO, PERMITE PASAR LOS ID DEL INFORME !!!
  if(ventana=="ficha_informe_turno"){

    //LOGICA PARA MANTENER VALOR
    mantener_valor = "&";
    var nombre = ["id_informe","id_turno","id_jefe_turno"];
	cant_campos=nombre.length;
  
    for(i=0;i<cant_campos;i++) {
      mantener_valor = mantener_valor + nombre[i] + "=" + document.forms["datos_informe_turnoForm"].elements[nombre[i]].value + "&";
    }
 
    mantener_valor = mantener_valor.substring(0,mantener_valor.length-1);
    //alert(mantener_valor);
	
  }
 
  
  
  
  //alert(ventana_destino);

  //ESTA LOGICA DE IFs PERMITE PASAR CAMPOS REQUERIDOS HACIA LA VENTANA DESTINO
  
  //COPEC
  if(ventana_destino=="ficha_tarea_template"){
    //HAY QUE ENVIAR EL id_template PARA QUE AL VOLVER SE CARGUEN LOS DATOS DE ESE TEMPLATE EN EL GRID (FILA ES SIEMPRE 0)
    id_template = document.forms[form_grid].elements["id_template"+fila].value;
    cadena_parametros_ventana = url_ventana + "?" + "ventana=" + ventana_destino + "&padre=" + padre + "&id_template=" + id_template;
  }
  //COPEC
  else if(ventana_destino=="ficha_archivo_tarea_template"){
    //HAY QUE ENVIAR EL id_template,id_tarea PARA QUE AL VOLVER SE CARGUEN LOS DATOS DE ESE TEMPLATE EN EL GRID (FILA ES SIEMPRE 0)
    id_template = document.forms[form_grid].elements["id_template"+fila].value;
	id_tarea = document.forms[form_grid].elements["id_tarea"+fila].value;
    cadena_parametros_ventana = url_ventana + "?" + "ventana=" + ventana_destino + "&padre=" + padre + "&id_template=" + id_template+ "&id_tarea=" + id_tarea;
  }
  //COPEC
  else if(ventana_destino=="ficha_subtarea_template"){
	form_datos = document.forms[form_grid].elements["var_form_grid_filtro"].value;
	fila = "";
	id_template = document.forms[form_datos].elements["id_template"+fila].value;
	id_tarea = document.forms[form_datos].elements["id_tarea"+fila].value;
    cadena_parametros_ventana = url_ventana + "?" + "ventana=" + ventana_destino + "&padre=" + padre + "&id_template=" + id_template+ "&id_tarea=" + id_tarea;
  }
  //GENERALIZAR KABELCO
  else if(ventana=="ficha_informe_turno"){
    form_datos = document.forms[form_grid].elements["var_form_grid_filtro"].value;
    id_turno = document.forms[form_datos].elements["id_turno"].value;
    id_jefe_turno = document.forms[form_datos].elements["id_jefe_turno"].value;
	id_informe = document.forms[form_datos].elements["id_informe"].value;
    cadena_parametros_ventana = url_ventana + "?" + "ventana=" + ventana_destino + "&padre=" + padre + "$id_informe="+id_informe+"&id_turno="+id_turno+"&id_jefe_turno="+id_jefe_turno;
  }
  
  //COPEC
  else if(ventana_destino=="ficha_tarea_proyecto"){
    form_datos_id = "datos_tarea_proyectoForm";
    id_proyecto = document.forms[form_datos_id].id_proyecto.value;
    id_tarea = document.forms[form_datos_id].id_tarea.value;
    cadena_parametros_ventana = url_ventana + "?" + "ventana=" + ventana_destino + "&padre=" + padre + "&id_proyecto=" + id_proyecto+ "&id_tarea=" + id_tarea;
  }
   //COPEC
  else if(ventana_destino=="ficha_fecha_termino_tarea"){
    //HAY QUE ENVIAR EL id_proyecto,id_tarea,id_template PARA QUE AL VOLVER SE CARGUEN LOS DATOS DE ESE TEMPLATE EN EL GRID (FILA ES SIEMPRE 0)
	form_datos_id = "datos_tarea_proyectoForm";
    id_proyecto = document.forms[form_datos_id].id_proyecto.value;
    id_tarea = document.forms[form_datos_id].id_tarea.value;
	id_template = document.forms[form_datos_id].elements["id_template"].value;
    cadena_parametros_ventana = url_ventana + "?" + "ventana=" + ventana_destino + "&padre=" + padre + "&id_proyecto=" + id_proyecto+ "&id_tarea=" + id_tarea + "id_template=" + id_template;
  }
  //SI SE NECESITA ENVIAR PARAMETROS ADICIONALES QUE CONTENGAN LOS KEY_ID	
  //else if(ventana_destino=="ficha_usuario" || ventana_destino=="ficha_cliente" || ventana_destino=="ficha_contactos" || ventana_destino=="ficha_empresa" || ventana_destino=="ficha_cargo" || ventana_destino=="ficha_rol" || ventana_destino=="ficha_template" || ventana_destino=="param_ventana" || ventana_destino=="param_ventana_entidad" || ventana_destino=="param_ventana_campo" || ventana_destino=="ficha_prospecto" || ventana_destino=="ficha_sucursal" || ventana_destino=="lista_contactos" || ventana_destino=="ficha_incidencia" || ventana_destino=="ficha_observacion" || ventana_destino=="ficha_boleta_express" || ventana_destino=="ficha_sucursal2" || ventana_destino=="ficha_ubicacion" || ventana_destino=="lista_compra_express" || ventana_destino=="param_botones_entidad" || ventana_destino=="param_graficos_ventana" || ventana_destino=="param_ficha_valores_select" || ventana_destino=="param_lista_valores_select" || ventana_destino=="ficha_compra_express" || ventana_destino=="param_cron_informes"|| ventana_destino=="ficha_menu" || ventana_destino=="ficha_agrega_sucursal") {
  else{
  
	//VER SI TIENE ENTIDAD MADRE (NO ESTOY CLARO DE DONDE VIENE EL CONCEPTO DE VENTANA_MADRE)
	if(ventana=="ficha_mercaderista")
	  entidad_madre = "ficha_mercaderista";
	else
	  entidad_madre = document.forms[form_grid].var_entidad_madre.value;
	
	//alert(entidad_madre);
	if(entidad_madre!=""){
	
	  form_entidad_madre = entidad_madre+"Form";

	  //BUSCAR CAMPOS KEY ID DE ENTIDAD MADRE
	  //SI HAY MAS DE 1 KEY_ID, UTILIZAR EL PRIMERO
	  primer_key_id_array = string_to_array(document.forms[form_entidad_madre].var_key_id.value,";");
	  
	  //SI EL KEY_ID TIENE MAS DE UN CAMPO, SEPARARLO EN SUS COMPONENTES
	  key_id_array = string_to_array(primer_key_id_array[0],",");
	  cant_key_id_array = key_id_array.length;
	
	  //INCORPORARLOS A LA URL
	  for(i=0;i<cant_key_id_array;i++){
	    //alert(key_id_array[i]+"-"+document.forms[form_entidad_madre].elements[key_id_array[i]].value);
	    parametros_adicionales_url = "&" + key_id_array[i] + "=" + document.forms[form_entidad_madre].elements[key_id_array[i]].value;
		
		//SOLO PERMITIR ABRIR EL FORMULARIO SIGUIENTE SI LOS KEY_ID SON DISTINTOS DE CERO
		if(document.forms[form_entidad_madre].elements[key_id_array[i]].value=="")
		  hay_key_id = false
		else
		  hay_key_id = true;
	  }
	  
	}
	else{
	  parametros_adicionales_url = "";
	  hay_key_id = true;
	}
	
	mantener_valor = "";
	
	//SOLO PERMITIR ABRIR EL FORMULARIO SIGUIENTE SI LOS KEY_ID SON DISTINTOS DE CERO
	if(hay_key_id==true)
      cadena_parametros_ventana = url_ventana + "?" + "ventana=" + ventana_destino + "&padre=" + padre + parametros_adicionales_url + mantener_valor;
  
  }
  
  //alert(ventana_destino);
  
  //PARAMETRIZADOR (PARA PODER MANTENER EL NOMBRE DE LA VENTANA, ENTIDAD Y APLICACION QUE SE ESTA PARAMETRIZANDO AL CREAR UN NUEVO REGISTRO)
  if(ventana_destino=="param_ventana" || ventana_destino=="param_ventana_entidad" || ventana_destino=="param_ventana_campo" || ventana_destino=="param_botones_entidad"){
	if(ventana_destino=="param_ventana"){
	  aplicacion = document.forms["filtro_param_aplicacionForm"].elements["aplicacion"].value;
	  ventana_nombre="";
	  entidad_nombre="";
	}
	else if(ventana_destino=="param_ventana_entidad"){
	  aplicacion = document.forms["datos_lista_ven_entForm"].elements["aplicacion"].value;
	  ventana_nombre = document.forms["datos_lista_ven_entForm"].elements["ventana_nombre"].value;
	  entidad_nombre="";
	}
	else if(ventana_destino=="param_ventana_campo"){
	  aplicacion = document.forms["filtro_param_lista_ventana_campoForm"].elements["aplicacion"].value;
	  ventana_nombre = document.forms["filtro_param_lista_ventana_campoForm"].elements["ventana_nombre"].value;
	  entidad_nombre = document.forms["filtro_param_lista_ventana_campoForm"].elements["entidad_nombre"].value;
	}
	else if(ventana_destino=="param_botones_entidad"){
	  aplicacion = document.forms["filtro_param_lista_botones_entidadForm"].elements["aplicacion"].value;
	  ventana_nombre = document.forms["filtro_param_lista_botones_entidadForm"].elements["ventana_nombre"].value;
	  entidad_nombre = document.forms["filtro_param_lista_botones_entidadForm"].elements["entidad_nombre"].value;
	}
			
	cadena_parametros_ventana = cadena_parametros_ventana + "&ventana_nombre=" + ventana_nombre + "&entidad_nombre=" + entidad_nombre + "&aplicacion=" + aplicacion;
  }
  
  //alert(cadena_parametros_ventana);
 
  ancho_ventana_px = 1000;
  largo_ventana_px = 820;
  
  if(tipo_ventana=="NO_MODAL")
    OpenCenWindow(cadena_parametros_ventana, "_self", ancho_ventana, largo_ventana, "yes");
  else if(tipo_ventana=="MODAL")    
    window.showModalDialog(cadena_parametros_ventana,self,"dialogWidth:"+ancho_ventana_px+";dialogHeight:"+largo_ventana_px); 
	
}

//55.///////////////////////////////////////////////////////////////////////////////////////////////

//56.///////////////////////////////////////////////////////////////////////////////////////////////
//COPEC!

function check(fila_actual, formulario) {

  //alert("CHECK");
  
  //GENERALIZAR ESTO COPEC
  if(formulario=="gridProyectoForm"){
    campo = "id_estado_proyecto"+fila_actual;
	mensaje = "Proyecto aún no ha sido activado";
  }
  else{
    campo = "estado_tarea"+fila_actual;
	mensaje = "Tarea aún no ha sido iniciada";
  }
  
  //PROYECTO: "No activado"; TAREA: "No iniciada"
  if(document.forms[formulario].elements[campo].value=="No activado" || document.forms[formulario].elements[campo].value=="No iniciada") {
    alert_pro(mensaje);
	return false;
  }
  else
    return true;
	
}

//56.///////////////////////////////////////////////////////////////////////////////////////////////


//57.///////////////////////////////////////////////////////////////////////////////////////////////
//AJAX: 
//20.10.2013 GPS

function probar_cron() {
  //alert("PROBAR_CRON");
  loadurl_xml("cronjob.php","",triggered_xml);
}

//57.///////////////////////////////////////////////////////////////////////////////////////////////

//58.///////////////////////////////////////////////////////////////////////////////////////////////

//PARA EDITAR FICHAS CUANDO SON FILAS DE UN GRID
function link(fila,host,form_grid,ventana_destino) {

  //alert("LINK"+"-"+fila+"-"+form_grid);

  //CARGAR PARAMETROS NECESARIOS
  fila1 = parseInt(fila)+1;
  entidad = document.forms[form_grid].var_entidad.value;
  tipo_uso_formulario = document.forms[form_grid].var_tipo_uso_formulario.value;
  fila_grid = entidad+fila;
  metadata_array = string_to_array(document.forms[form_grid].var_metadata.value,"^");
  cant_metadata = metadata_array.length;
  key_id_array = string_to_array(document.forms[form_grid].var_key_id.value,",");

  //alert(fila_grid);

  //GENERALIZAR ESTO!!!!!
  if(form_grid=="gridProyectoForm")
    key_id_array = string_to_array("codigo_es",",");
 

  cant_key_id = key_id_array.length;
  desde_bd_array = string_to_array(document.forms[form_grid].var_desde_bd.value,"^");
  cant_desde_bd = desde_bd_array.length;

  //NO SE QUE HACE ESTO
  if(document.forms[form_grid].var_ventana.value=="inventario") 
    tipo_ventana = "MODAL"; 	 	
  else 
    tipo_ventana = "NO_MODAL";
  


  //BUSCAR NUMERO DE COLUMNA DEL GRID EN QUE ESTA EL KEY ID (EL UNICO KEY ID, PUEDE COMPONERSE DE VARIOS CAMPOS)
  columnas_id = new Array();

  for(i=0;i<cant_key_id;i++) {
    for(j=0;j<cant_metadata;j++) {
      if(metadata_array[j]==key_id_array[i])
        columnas_id[i] = j;
    }
  }

  
  
   
   
  //alert("OK");

  //BUSCAR LA PRIMERA COLUMNA DEL GRID QUE SE CARGA DESDE LA BD PARA DETERMINAR SI HAY DATOS CARGADOS EN ESA FILA DEL GRID
  //if(tipo_uso_formulario=="buscar" || tipo_uso_formulario=="lista datos transaccion") {
  //  primera_columna_desde_bd = 1;
  //}
  //else {

    i = 0;
    seguir = true; 
    primera_columna_desde_bd = "";

    while(i<cant_key_id && seguir==true) {

      if(desde_bd_array[i]=="s") {
        primera_columna_desde_bd = i;
        seguir = false;
      }
      else {
        seguir = true;
      }

    i=i+1;

    }

  //}



  //alert("OK"+"-"+fila_grid+"-"+primera_columna_desde_bd+"-"+document.getElementById(fila_grid).cells[primera_columna_desde_bd].children[0].value);


  //VERIFICAR QUE HAYA UNA FICHA CARGADA EN LA FILA DEL GRID PARA ASI PERMITIR EDITARLA
  if(document.getElementById(fila_grid).cells[primera_columna_desde_bd].children[0].value!='') {

  //alert("OK");
  
    //PARA EDITAR FICHAS DESDE DOCUMENTOS
    if(document.forms[form_grid].var_ventana.value=="boleta" || document.forms[form_grid].var_ventana.value=="factura" || document.forms[form_grid].var_ventana.value=="inventario") {

      url_ventana = "http://"+host+"/aplicacion/window.php";
      ventana_destino = "ficha_producto";
      entidad_destino = "producto";
      padre = "inventario";

	  //alert("OK");
	  
      cadena_parametros_ventana = url_ventana + "?" + "ventana=" +ventana_destino + "&fila=" + fila + "&padre=" + padre + "&entidad=" + entidad_destino + "&datos=" + datos + "&";

      for(i=0;i<cant_key_id;i++) {
        cadena_parametros_ventana = cadena_parametros_ventana + key_id_array[i] + "=" + document.getElementById(fila_grid).cells[columnas_id[i]].children[0].value + "&";
      }

      cadena_parametros_ventana = cadena_parametros_ventana.substr(0,cadena_parametros_ventana.length-1)

      if(tipo_ventana=="NO_MODAL")
        OpenCenWindow(cadena_parametros_ventana, "nw", 400, 590);
      else if(tipo_ventana=="MODAL")    
        window.showModalDialog(cadena_parametros_ventana,self,"dialogWidth:400px;dialogHeight:635px"); 
    }

    //PARA MOSTRAR DOCUMENTOS TRANSACCIONALES
    else {

	// alert("OK2");
	
      url_ventana = "http://"+host+"/aplicacion/window.php";
     
      //PARA PODER VOLVER AL DOCUMENTO DE ORIGEN 
      padre = document.forms[form_grid].var_ventana.value;

      //PARA VENTANA MODAL (ESTO BUSCAR LOS PARAMETROS DE LA VENTANA ACTUAL Y NO LA DE DESTINO)
      //largo_ventana_px = document.forms[form_grid].var_largo_ventana_px.value+"px";
      //ancho_ventana_px = document.forms[form_grid].var_ancho_ventana_px.value+"px";

      //PARA VENTANA NO MODAL (ESTO BUSCAR LOS PARAMETROS DE LA VENTANA ACTUAL Y NO LA DE DESTINO)
      //largo_ventana = document.forms[form_grid].var_largo_ventana_px.value;
      //ancho_ventana = document.forms[form_grid].var_ancho_ventana_px.value;

      nombre_ventana = "nw";

     largo_ventana = 700;
     ancho_ventana = 850;




//alert(document.forms[form_grid].var_key_id.value);




     //valores_key = new Array();

     //valores_key[0] = document.forms[form_grid].elements["fecha_reserva"+fila].value;
     //valores_key[1] = document.forms[form_grid].elements["hora_inicio_reserva"+fila].value;
     //valores_key[2] = document.forms[form_grid].elements["cod_doctor"+fila].value;

     //valores_key_id = valores_key_1+"-"+valores_key_2+"-"+valores_key_3;

     //BUSCAR CAMPOS ID DOCUMENTO
     //alert(key_id_array+"--"+valores_key_id);

      ////id_documento = array_to_string(valores_key,"^");



     
//alert(columnas_id[0]);



      ////////id_documento = document.getElementById(fila_grid).cells[columnas_id[0]].children[0].value;


	  
	  


      //cadena_parametros_ventana = url_ventana + "?" + "ventana=" +ventana_destino + "&padre=" + padre + "&ventana_nombre=" + id_documento;

	  
	 
	
	  
	
	 
		  
	  //CANTIDAD DE KEY_ID
	  cant_key_id = key_id_array.length;
	  parametro = "";
	
	
	
	
	
//alert("HOLA"+cant_key_id);
	

	
	  if(cant_key_id>0){
	
	    //AGREGAR LOS DATOS DEL KEY_ID A LA URL
	    for(i=0;i<cant_key_id;i++) {
	      parametro = parametro + key_id_array[i] + "=" + document.getElementById(fila_grid).cells[columnas_id[i]].children[0].value + "&"; 
	    }    
        parametro = parametro.slice(0, -1);
		
   	  }
	 
	  
	 //alert(parametro);
	 
	 
	 
	 
	 
	 
	 
	 
	  //PARA NO PERDER LA LISTA DE PADRES AL HACER DRILL DOWN
  if(padre=="param_aplicacion")
    padre = "param_aplicacion";
  else if(padre=="param_aplicacionZXparam_lista_ven_ent")
    padre = "param_aplicacionZXparam_lista_ven_ent";
	 
	 
	 
	 
	
	 
	 
	 
	 
	  //alert(padre);
	 
	 //PQ ESTABA ESTO DESCOMENTADO??
      ////ventana_destino = "lista_contactos";
	  cadena_parametros_ventana = url_ventana + "?" + "ventana=" +ventana_destino + "&padre=" + padre + "&" + parametro;
	
	
	  //alert(cadena_parametros_ventana);
	
	
	
	
	
	
	
	
      //ENVIAR LOS CAMPOS DEL FILTRO QUE SEAN DISTINTOS DE VACIO (SOLO SI EL FILTRO ESTA EJECUTADO)
      ////formulario_filtro = "filtroClienteForm";
      ////valores_filtro = 	"&rut="+URLEncode(document.forms[formulario_filtro].rut.value);
	
	
	
	
	
	  //GENERALIZAR ESTO COPEC: PERMITE PASAR UN VALOR COMO REFERENCIA A LA NUEVA PAGINA
	  if(ventana_destino=="ficha_tarea_template" || ventana_destino=="lista_archivos_tarea_template"){
	    //DESDE FILA GRID
	    id_template = document.forms[form_grid].elements["id_template"+fila].value;
	    cadena_parametros_ventana = cadena_parametros_ventana + "&id_template=" + id_template;
	  }
	  else if(ventana_destino=="detalle_proyecto"){
	    //DESDE DATOS
	    id_template = document.forms["datos_seguimientoForm"].elements["id_template"].value;
	    cadena_parametros_ventana = cadena_parametros_ventana + "&id_template=" + id_template;
	  }
	  
	
	
	
	 //PARAMETRIZADOR (PARA PODER MANTENER EL NOMBRE DE LA APLICACION QUE SE ESTA PARAMETRIZANDO)
    if(ventana_destino=="param_lista_ven_ent" || ventana_destino=="param_lista_ventana_campo" || ventana_destino=="param_lista_botones_entidad" || ventana_destino=="param_lista_ventana_grafico"){
  
      if(ventana_destino=="param_lista_ven_ent")
	    aplicacion = document.forms["filtro_param_aplicacionForm"].elements["aplicacion"].value;
	  else if(ventana_destino=="param_lista_ventana_campo")
	    aplicacion = document.forms["datos_lista_ven_entForm"].elements["aplicacion"].value;
	  else if(ventana_destino=="param_lista_botones_entidad")
	    aplicacion = document.forms["datos_lista_ven_entForm"].elements["aplicacion"].value;
	  else if(ventana_destino=="param_lista_ventana_grafico")
	    aplicacion = document.forms["filtro_param_aplicacionForm"].elements["aplicacion"].value;
		
  	  cadena_parametros_ventana = cadena_parametros_ventana + "&aplicacion=" + aplicacion;
  }
	
	
	
	
	
	  ////cadena_parametros_ventana = cadena_parametros_ventana + valores_filtro;
      //alert(cadena_parametros_ventana);

	
	  
      if(tipo_ventana=="NO_MODAL")
        OpenCenWindow(cadena_parametros_ventana, "_self", ancho_ventana, largo_ventana, "yes");
      else if(tipo_ventana=="MODAL")    
        window.showModalDialog(cadena_parametros_ventana,self,"dialogWidth:"+ancho_ventana_px+";dialogHeight:"+largo_ventana_px); 

    }

  }
  else {
    alert("Imposible editar un registro en blanco");
  }

}

//58.///////////////////////////////////////////////////////////////////////////////////////////////

//59.///////////////////////////////////////////////////////////////////////////////////////////////

function url(_fila,_host,_form_grid) {

  //alert("URL");
  
  _entidad = document.forms[_form_grid].var_entidad.value;
  
  if(_fila!=""){
    _fila_grid = _entidad+_fila;
	_ventana_destino = document.getElementById(_fila_grid).cells[0].children[0].value;
  }
  else{
    _fila_grid = "ventana_nombre";
	_ventana_destino = document.forms[_form_grid].elements[_fila_grid].value;
  }
 
  _url_ventana = "http://"+_host+"/aplicacion/window.php";
  _aplicacion = document.forms['ventanaForm'].elements['aplicacion'].value;
  
  _cadena_parametros_ventana = _url_ventana + "?" + "ventana=" +_ventana_destino + "&aplicacion=" + _aplicacion;
  //alert(cadena_parametros_ventana);
	
  _ancho_ventana = "100%";
  _largo_ventana = "100%";
	
  OpenCenWindow(_cadena_parametros_ventana, "_blank", _ancho_ventana, _largo_ventana, "yes", "yes");
  
}

//59.///////////////////////////////////////////////////////////////////////////////////////////////

//60.///////////////////////////////////////////////////////////////////////////////////////////////

//60.///////////////////////////////////////////////////////////////////////////////////////////////

//61.///////////////////////////////////////////////////////////////////////////////////////////////

//PARAMETRIZADOR
function campo_por_defecto() {

  //alert("CAMPO POR DEFECTO");
  document.forms["param_ventana_campoForm"].elements["obligatorio"].value = "2";
  document.forms["param_ventana_campoForm"].elements["desde_bd"].value = "1";
  document.forms["param_ventana_campoForm"].elements["hacia_bd"].value = "1";
  document.forms["param_ventana_campoForm"].elements["background_color"].value = "3";
  document.forms["param_ventana_campoForm"].elements["tipo"].value = "1";
  document.forms["param_ventana_campoForm"].elements["validacion"].value = "8";
  document.forms["param_ventana_campoForm"].elements["text_align"].value = "1";
  document.forms["param_ventana_campoForm"].elements["desactivado"].value = "1";
  document.forms["param_ventana_campoForm"].elements["size"].value = "30";
  document.forms["param_ventana_campoForm"].elements["separador"].value = "2";
  document.forms["param_ventana_campoForm"].elements["formato_visual"].value = "4";
  document.forms["param_ventana_campoForm"].elements["boton_buscar_lupa"].value = "2";
  document.forms["param_ventana_campoForm"].elements["boton_info"].value = "1";
  document.forms["param_ventana_campoForm"].elements["tipo_campo_bd"].value = "1";
  
}

//61.///////////////////////////////////////////////////////////////////////////////////////////////

//62.///////////////////////////////////////////////////////////////////////////////////////////////

//FALTA GENERZLIZAR ESTA FUNCION
function link_boton(ventana_actual, ventana_destino) {

  //alert(ventana_actual+"-"+ventana_destino);

  servidor_web = document.forms["ventanaForm"].elements["host"].value;
  padre = document.forms["ventanaForm"].elements["padre"].value;
  if(padre!="")
    padre = padre + "ZX" + ventana_actual;
  else
    padre = ventana_actual;
	
  //FALTA GENERALIZAR: QUE PERMITA TENER MAS DE UN CAMPO
  
  //COPEC
  if(ventana_actual=="detalle_proyecto"){
   
	if(ventana_destino=="archivos_proyecto"){
	  campos = "id_proyecto";
      valores_campos = document.forms["datos_observaciones_proyectoForm"].elements[campos].value;
	  campos1 = "id_template";
	  valores_campos1 = document.forms["datos_proyectoForm"].elements[campos1].value;
	  campos2 = "";
      valores_campos2 = "";
	}
	else if(ventana_destino=="ficha_valorizacion"){
	  campos = "codigo_es";
      valores_campos = document.forms["datos_proyectoForm"].elements[campos].value;
	  campos1 = "id_template";
	  valores_campos1 = document.forms["datos_proyectoForm"].elements[campos1].value;
	  campos2 = "id_proyecto";
      valores_campos2 = document.forms["datos_observaciones_proyectoForm"].elements[campos2].value;
	}
	else if(ventana_destino=="flujograma_template"){
	  campos = "id_proyecto";
      valores_campos = document.forms["datos_observaciones_proyectoForm"].elements[campos].value;
	  campos1 = "id_template";
	  valores_campos1 = document.forms["datos_proyectoForm"].elements[campos1].value;
	  campos2 = "";
      valores_campos2 = "";
	}
	
  }
  
  else if(ventana_actual=="ficha_tarea_proyecto"){
   
    if(ventana_destino=="archivos_proyecto"){
	  campos = "id_proyecto";
      valores_campos = document.forms["datos_tarea_proyectoForm"].elements[campos].value;
	  campos1 = "id_template";
	  valores_campos1 = document.forms["datos_tarea_proyectoForm"].elements[campos1].value;
	  campos2 = "";
      valores_campos2 = "";
	} 
	else if(ventana_destino=="archivos_tarea"){
	  campos = "id_proyecto";
      valores_campos = document.forms["datos_tarea_proyectoForm"].elements[campos].value;
	  campos1 = "id_tarea";
	  valores_campos1 = document.forms["datos_tarea_proyectoForm"].elements[campos1].value;
	  campos2 = "";
      valores_campos2 = "";
	}
	
  }
  
  //ARCOR
  else if(ventana_actual=="ficha_sucursal2"){
    campos = "cod_interno";
    valores_campos = document.forms["sucursal2Form"].elements["cod_interno"].value;
	campos1 = "tipo_key_id";
	valores_campos1 = "ID_SUCURSAL";
	campos2 = "";
    valores_campos2 = "";
  }
  else if(ventana_actual=="ficha_sucursal3"){
    campos = "cod_interno";
    valores_campos = document.forms["sucursal3Form"].elements["cod_interno"].value;
	campos1 = "tipo_key_id";
	valores_campos1 = "ID_SUCURSAL";
	campos2 = "";
    valores_campos2 = "";
  }
  //ANGULAR
  else if(ventana_actual=="param_aplicacion" ){
    campos = "cod_interno";
	
	//SI LA VENTANA ES PARAM_SISTEMA SE REQUIERE QUE COD_INTERNO=1 PARA QUE CARGUEN LOS DATOS (se debe hacer que la aplicacion sea id_aplicacion y no cod_interno)
	if(ventana_destino=="param_sistema")
	  valores_campos = 1;
	else
      valores_campos = document.forms["filtro_param_aplicacionForm"].elements["aplicacion"].value;
	  
	campos1 = "";
	valores_campos1 = "";
	campos2 = "";
    valores_campos2 = "";
  }
  
  if(valores_campos!="") {
    window.open('http://'+servidor_web+'/aplicacion/window.php?ventana='+ventana_destino+'&padre='+padre+'&'+campos+'='+valores_campos+'&'+campos1+'='+valores_campos1+'&'+campos2+'='+valores_campos2,'_self',false); 
  }
  else{
    alert_pro("No se ha seleccionado un registro para buscar");
  }
  
}

//62.///////////////////////////////////////////////////////////////////////////////////////////////

//63.///////////////////////////////////////////////////////////////////////////////////////////////
//OFFLINE STORAGE

function crear_bd(){

  //CREAR BASE DE DATOS O ACCEDER A EXISTENTE
  var db = window.openDatabase("angular4", "", "Base de datos Angular", 1024);

  if (db.version != "1") {
    
	db.changeVersion(db.version, "1", function(tx) {
    
	  // User's first visit.  Initialize database.
      var tables = [
        { name: "tareas", columns: ["cod_interno INTEGER PRIMARY KEY, detalle TEXT, estado TEXT"]}       
      ];
 
      for (var index = 0; index < tables.length; index++) {
        var table = tables[index];
        tx.executeSql("CREATE TABLE " + table.name + "(" +
                      table.columns.join(", ") + ");");
      }
	  
    }, null, function() { loadData(db); });
  }
  else {
    // User has been here before, no initialization required.
    //loadData(db);
  }
 
//VACIAR LA TABLA
//sql = "DELETE FROM archivos_por_subir;";
//ejecutar_sql_bd(db, sql); 
 
//GUARDAR UN NUEVO REGISTRO
//sql = "INSERT INTO archivos_por_subir(nombre_archivo) VALUES('gustavo');";
//ejecutar_sql_bd(db, sql); 

//EDITAR UN REGISTRO EXISTENTE
//sql = "UPDATE archivos_por_subir SET nombre_archivo='padilla' WHERE nombre_archivo='gustavo');";
//ejecutar_sql_bd(db, sql); 
return db;

}

//63.///////////////////////////////////////////////////////////////////////////////////////////////

//64.///////////////////////////////////////////////////////////////////////////////////////////////
//OFFLINE STORAGE

var ejecutar_sql_bd = function(db, sql, callback){

  db.transaction(
    function(transaction){
	
      //INICIO TRANSACCION INSERT
	  transaction.executeSql(
	    (sql),
		[],
		
	    //SUCCESS CALLBACK FUNCTION
	    function(transaction, results){
	      //callback(results.insertId);
	    }
	
      );
      //FIN TRANSACCION INSERT
 
	}
	
  );
	
};
  
//64.///////////////////////////////////////////////////////////////////////////////////////////////


//65./////////////////////////////////////////////////////////////////////////////////////////////
//ofline
//Proceso Ofline
//Parametrizar, solo ipdv sincronizacion y delete

function IngresoDataOfline(Data,NombreBase,Tabla, ventana,IdSucursal){
var db = openDatabase(NombreBase, '1.0', '', 3 * 1024 * 1024);
db.transaction(function (tx) {
	tx.executeSql('CREATE TABLE IF NOT EXISTS '+Tabla+' (id INTEGER PRIMARY KEY, data TEXT, ventana TEXT, sucursal int)');
	tx.executeSql('SELECT count(1) as id  FROM '+Tabla+'', [], function (tx, results) {
     var LastId = results.rows.item(0).id + 1;
	 InsercionData(Data,NombreBase,Tabla,LastId,ventana,IdSucursal);
	});
});
}

function InsercionData(Data,NombreBase,Tabla,LastId, ventana,IdSucursal){
	var Maximo = parseInt(document.getElementById('var_cantidad_maxima_ofline').value);	

	var db = openDatabase('IPDV', '1.0', '', 3 * 1024 * 1024);
	db.transaction(function (tx) {
	tx.executeSql('SELECT count(1) as Resultado FROM IPDV where sucursal = '+IdSucursal+'', [], function (tx, results) {
	var len = results.rows.length, i;
	var Resultado = results.rows.item(0).Resultado;
			if (Resultado==0){
				var db = openDatabase(NombreBase, '1.0', '', 3 * 1024 * 1024);
				db.transaction(function (tx) {
						if(LastId <=  Maximo){
						tx.executeSql('INSERT INTO '+Tabla+' (id, data, ventana,sucursal) VALUES ('+LastId+', "'+Data+'", "'+ventana+'","'+IdSucursal+'")');
						alert('¡Registro grabado con exito! \n\n (Fuera de red)');
								if (document.getElementById("var_on_of").value==4){
									sincronizacion();
								}
						}
						else
						{
							alert('Limite offline excedido');
							var confi = confirm("\xBFEsta seguro de sincronizar?");
							if (confi)
							{
								sincronizacion();
							}
						}
				});
			}else
			{
				alert('¡Registro ya existe!');
			}
	});
	});

}

function sincronizacion(){

	if(!window.navigator.onLine){
		alert('Imposible sincronizar, fuera de linea');
	}
	else
	{		
			
			//mostrar_Sincronizando($('#boton_guardar'));
			mostrar_loader("Sincronizando");
			
				var db = openDatabase('IPDV', '1.0', '', 3 * 1024 * 1024);
				db.transaction(function (tx) {
					tx.executeSql('SELECT * FROM IPDV', [], function (tx, results) {
						var len = results.rows.length, i;
						if(len>0){
							var Data = results.rows.item(0).data;
							var Id = results.rows.item(0).id;
							var Ventana = results.rows.item(0).ventana;
							var cadena_valores = Data;
							document.getElementById('var_OfflineDelete').value=Id;
							//alert(cadena_valores)
							loadurl_xml('PageLogicPHP.php',cadena_valores,triggered_xml2);
							//deleteData(Id);
						}
						else
						{
							alert('No hay datos para sincronizar');
							ocultar_loader();
						}					
					});
				});
	}
}

function deleteData(Id,Base){
var db = openDatabase(Base, '1.0', '', 3 * 1024 * 1024);
	db.transaction(function (tx) {
	tx.executeSql('delete from  '+Base+' where id = '+Id);
	});
}


function EliminarDatosLocal(){
var confi = confirm("\xBFDesea borrar los datos almacenados locamente?");
		if (confi)
		{
			var db = openDatabase('IPDV', '1.0', '', 3 * 1024 * 1024);
			db.transaction(function (tx) {
			tx.executeSql('delete from  IPDV');
			});
			
			var db = openDatabase('IPDV', '1.0', '', 3 * 1024 * 1024);
			db.transaction(function (tx) {
			tx.executeSql('delete from  Fotos');
			});
			
			alert('Registros eliminados correctamente.')
			document.getElementById('var_cantidadOff').innerHTML='<b>Cantidad de registros : 0</b>';
		}
}
//65.///////////////////////////////////////////////////////////////////////////////////////////////


function ConsultaSincronizar(){
var db = openDatabase('IPDV', '1.0', '', 3 * 1024 * 1024);
	db.transaction(function (tx) {
	tx.executeSql('CREATE TABLE IF NOT EXISTS IPDV (id INTEGER PRIMARY KEY, data TEXT, ventana TEXT, sucursal int)');
	tx.executeSql('SELECT * FROM IPDV', [], function (tx, results) {
	var len = results.rows.length, i;
	document.getElementById('var_cantidadOff').innerHTML='<b>Cantidad de registros : '+len+'</b>';
	});
	});
}

function Zincronizable(){
var confi = confirm("\xBFEsta seguro de sincronizar?");
		if (confi)
		{
			sincronizacion();
		}

}





function copiar_ventana(formulario) {
  //alert("COPIAR_VENTANA: "+formulario);
  id_aplicacion_origen = document.forms[formulario].elements['id_aplicacion'].value;
  id_ventana_nombre_origen = document.forms[formulario].elements['id_formulario'].value;
  id_aplicacion_destino = document.forms[formulario].elements['id_aplicacion_dest'].value;
  ventana_nombre_destino = document.forms[formulario].elements['formulario_dest'].value;
  
  if(id_aplicacion_origen!="99" && id_ventana_nombre_origen!="99" && id_aplicacion_destino!="99" && ventana_nombre_destino!="99"){
    cadena_parametros = "id_proceso=1&id_aplicacion_origen="+id_aplicacion_origen+"&id_ventana_nombre_origen="+id_ventana_nombre_origen+"&id_aplicacion_destino="+id_aplicacion_destino+"&ventana_nombre_destino="+ventana_nombre_destino;
    //alert(cadena_parametros);
    loadurl_xml("param_copiaryborrar_ventana.php",cadena_parametros,triggered_xml);
  }
  else{
    alert_pro("Debe completar todos los campos obligatorios.");
  }
  
}




function borrar_ventana(formulario) {
  //alert("COPIAR_VENTANA: "+formulario);
  id_aplicacion_origen = document.forms[formulario].elements['id_aplicacion'].value;
  id_ventana_nombre_origen = document.forms[formulario].elements['id_formulario'].value;
  
  if(id_aplicacion_origen!="99" && id_ventana_nombre_origen!="99"){
    cadena_parametros = "id_proceso=2&id_aplicacion_origen="+id_aplicacion_origen+"&id_ventana_nombre_origen="+id_ventana_nombre_origen;
    //alert(cadena_parametros);
    loadurl_xml("param_copiaryborrar_ventana.php",cadena_parametros,triggered_xml);
  }
  else{
    alert_pro("Debe completar todos los campos obligatorios.");
  }
  
}


/////////////////////////////////GALERIA IMAGENES////////////////////////////
function buscargaleriaimg(formulario,Tipo){
var token = window.sessionStorage.getItem("token_sesion");        
if(Tipo==1){
document.getElementById('hddlimitegaleria').value="0,30";
}
	document.getElementById('divgaleriaimg').innerHTML="";
	var codigo_local = document.forms[formulario].elements['codigo_local'].value;
	var cbocampos = document.forms[formulario].elements['cbo_campos'].value;
	var limites = document.getElementById('hddlimitegaleria').value;
	mobile = document.forms["ventanaForm"].elements["mobile"].value;
	if(codigo_local==''){
		alert('debe ingresar al menos Código local');
	}else{
		 cadena_parametros = "codigo_local="+codigo_local+"&campos="+cbocampos+"&mobile="+mobile+"&limites="+limites+"&token_sesion="+token;
		document.getElementById('divgaleriaimg').style.display="block";
		document.getElementById('divGeneralgaleriaimg').style.display="block";
		 loadurl_xml("galeriaimagenes_phonegap.php",cadena_parametros,triggered_html);
	}
	
}


function popupimg(url,title,phonegap){
  mobile = document.forms["ventanaForm"].elements["mobile"].value;
  
  if(mobile=='false' && phonegap=='0'){
   showPopup('popup',url,'IMG',title,'');
  }else{
    document.getElementById('imgpopup_gal').src=url;
	$( "#img_popup" ).popup( "open" );
  }
}

function paginasiguiente(){
	var limites = '';
	var valor1 = 0;
	var valor2 = 1;
	limites = document.getElementById('hddlimitegaleria').value.split(',');
	valor1 = parseInt(limites[1]) + 1;
	valor2 = parseInt(limites[1]) + 30;
	document.getElementById('hddlimitegaleria').value = valor1+','+valor2;
	buscargaleriaimg('galeria_imagenesForm',2);
}

function Paginaanterior(){
	var limites = '';
	var valor1 = 0;
	var valor2 = 1;
	limites = document.getElementById('hddlimitegaleria').value.split(',');		
		valor1 = parseInt(limites[0]) - 30;
			if(valor1=='1'){
				valor1 = 0;
			}
		valor2 = parseInt(limites[1]) - 30;
		document.getElementById('hddlimitegaleria').value = valor1+','+valor2;
		buscargaleriaimg('galeria_imagenesForm',2);
}