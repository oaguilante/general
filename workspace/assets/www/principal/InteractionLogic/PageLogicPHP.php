<?php

@session_start();
$activar_log_sql = 1;

//INCLUDE DE ARCHIVOS
require_once('../StorageLogic/database.php');
require_once('../BusinessLogic/CargarParametros.php');
require_once('../BusinessLogic/Ficha.php');
require_once('../BusinessLogic/Documento.php');
require_once('../BusinessLogic/FuncionesAuxiliares.php');

//VARIABLES DE SESION
$s_cod_interno = $_SESSION['s_cod_interno'];
$s_nombre = $_SESSION['s_nombre'];
$s_host = $_SESSION['s_host'];
$s_base_datos = $_SESSION['s_base_datos'];

/*
$s_cod_interno = "26";
$s_nombre = "Soporte";
$s_host = "192.168.1.183";
$s_base_datos = "angarcor";
*/





//CARGAR EL ARCHIVO DE EQUIVALENCIAS DE JASOB
if($s_host=="localhost/angular_obfuscated")
  require_once('../../jasob_angular_obfuscated.php');
else
  require_once('../../jasob_angular.php');

//PARAMETROS SISTEMA
$base_datos = $s_base_datos;










//PARAMETROS ADICIONALES VENTANA QUE LLEGAN DESDE EL CLIENTE
$ventana = cargarVariablePost("ventana",'');
$entidad = cargarVariablePost(var_entidad,'');
$accion = cargarVariablePost(var_accion,'');
$form = cargarVariablePost("form",'');
$camposId = cargarVariablePost("camposId",'');
$id_fila = cargarVariablePost(var_id_fila,'');
$pagina = cargarVariablePost("pagina",'');
$scrollx = cargarVariablePost("scrollx",'');
$scrolly = cargarVariablePost("scrolly",'');
$id_caja = cargarVariablePost("id_caja",'');
$id_punto_venta = cargarVariablePost("id_punto_venta",'');
$padre = cargarVariablePost("padre",'');
$enviar_mail_tarea = cargarVariablePost("enviar_mail_tarea",'');
////////

$caja = cargarVariablePost("caja",'');
$punto_venta = cargarVariablePost("punto_venta",'');
$fecha = cargarVariablePost("fecha",'');

//GENERALIZAR!!! SOLO SE USA EN APLICACION COPEC, VENTANA_DETALLE GRUPO (ES EL ID)
$id_grupo = cargarVariablePost("id_grupo",'');

//DEJAR SOLO UN CAMPO ID EN EL CASO QUE HAYA MAS QUE UNO, PUEDE SER CUALQUIERA DE LOS DOS, PERO SE DEJARA EL PRIMERO (CON TODOS LOS CAMPOS QUE LO COMPONEN).
$camposId_array = explode(";",$camposId);
$camposId = $camposId_array[0];

//ESTO SE DEBE JUNTAR CON EL DE ARRIBA, NO TIENE SENTIDO QUE ESTEN SEPARADOS (PERMITE ENVIAR DOS KEY_ID CON TODOS LOS CAMPOS DE CADA UNO)
$todos_camposId_array[0] = $camposId_array[0];

if($camposId_array[1]<>"")
  $todos_camposId_array[1] = $camposId_array[1];

//PARAMETROS PHP DE LA VENTANA
$parametros = cargar_parametros_ventana($ventana);
$tipo_uso_formulario = $parametros[0]["tipo_uso_formulario"];

//PARAMETROS ENTIDAD VENTANA BD (USAR ENTIDAD QUE EMITE: se usa para cargar los parametros necesarios para devolver los datos al form de un grid cuando la entidad es un filtro, por lo cual la entidad es la que emite)
$parametros2 = cargar_parametros_entidad_ventana($entidad,$ventana);
$tipo_estructura = $parametros2[0]["tipo_estructura"];
$form_grid_filtro = $parametros2[0]["form_grid_filtro"];

//PARAMETROS DE LOS CAMPOS DE LA VENTANA Y LA ENTIDAD (USAR ENTIDAD QUE EMITE: se usa para obtener el formato visual de los campos, por lo cual, siempre corresponde a la entidad que envía los campos)
//$parametros = cargar_parametros_campo_desde_bd($ventana,$entidad);
$parametros_y_log_sql = cargar_parametros_campo($ventana,$entidad,"S",$log_sql);

$parametros = $parametros_y_log_sql["result_array"];
$log_sql = $parametros_y_log_sql["log_sql"];

//SI LA ENTIDAD ES UN FILTRO, PASAR A UTILIZAR LA ENTIDAD DEL GRID PARA RECIBIR LOS DATOS. 
//SI ES UN GRID, UTILIZAR LA ENTIDAD DEL GRID PARA RECIBIR LOS DATOS.

if($tipo_estructura=="filtro" || $tipo_estructura==3) {
  //YA NO SE DEBERIA CAMBIAR A LOS VALORES DEL GRID ACA CUANDO ES UN FILTRO, PARA QUE SE BUSQUE EN BASE A LOS CAMPOS DEL FILTRO 
  //$entidad = substr($form_grid_filtro,0,strlen($form_grid_filtro)-4);
  //$form = $form_grid_filtro;
}

$parametros_entidad_campo_y_log_sql = cargar_parametros_campo($ventana,$entidad,"S",$log_sql);

$parametros_entidad_campo = $parametros_entidad_campo_y_log_sql["result_array"];
if($activar_log_sql==1)
  $log_sql = $parametros_entidad_campo_y_log_sql["log_sql"];

$cant_parametros_entidad_campo = count($parametros_entidad_campo);



//CARGAR PARAMETROS DE LOS CAMPOS DE LA ENTIDAD
for($i=0;$i<$cant_parametros_entidad_campo;$i++) {
  $nombres_campos[$i] = strtolower($parametros_entidad_campo[$i]["metadata_nombre"]);
  $desde_bd[$i] = strtolower($parametros_entidad_campo[$i]["desde_bd"]);
  $valores_select[$i] = strtolower($parametros_entidad_campo[$i]["valores_select"]);
  $tipo[$i] = strtolower($parametros_entidad_campo[$i]["tipo"]);
}
    



//CARGAR VALORES DE LOS CAMPOS DE LA ENTIDAD Y DEJARLOS EN FORMATO MYSQL
for($i=0; $i<$cant_parametros_entidad_campo; $i++) {

  //$valores_campos[$i] = urldecode(cargarVariablePost($nombres_campos[$i],''));
  //$valores_campos[$i] = htmlentities(cargarVariablePost($nombres_campos[$i]));
   
  //HACE QUE LOS SIGNOS + EN PROMOCIONES ARCOR SE USEAN BIEN EN EL SQL Y SE VEAN EN LAS LISTAS
  $valores_campos[$i] = cargarVariablePost($nombres_campos[$i],'');
  
 
  
  //CAMBIAR EL VALOR DE LOS CAMPOS DESDE EL FORMATO VISUAL AL FORMATO DE MYSQL
  $formato_visual = $parametros_entidad_campo[$i]["formato_visual"];

  if($formato_visual=="FECHA" || $formato_visual=="1")
    $valores_campos[$i] = fechaChileAFechaMysql($valores_campos[$i]);
  else if(($formato_visual=="TIMESTAMP" || $formato_visual=="3") && $valores_campos[$i]!="")
    $valores_campos[$i] = timestampChileATimestampMysql($valores_campos[$i]);
  else if(($formato_visual=="MONEDA" || $formato_visual=="2") && $tipo_estructura<>"filtro")
    $valores_campos[$i] = moneda_a_numero($valores_campos[$i]);

  //CAMBIAR EL VALOR NO UNICO DE "CAJA" POR EL VALOR "UNICO" PARA SER USADO EN LOS SQL (para cuando el campo caja es parte de la entidad)
  if($nombres_campos[$i]=="caja") {
    $pos_campo_punto_venta = array_search("punto_venta",$nombres_campos);
    $pos_campo_caja = array_search("caja",$nombres_campos);

    //BUSCAR EL ID UNICO DE LA CAJA
    $id_unico_caja_y_log_sql = verIdUnicoCaja($valores_campos[$pos_campo_punto_venta],$valores_campos[$pos_campo_caja],$log_sql);
    $id_caja = $id_unico_caja_y_log_sql["id_unico_caja"];
    $log_sql = $id_unico_caja_y_log_sql["log_sql"];

    //ESTE VALOR ESTABA AFUERA PERO LO METI ADENTRO (NO, SE USA ARRIBA PARA GUARDAR LA CAJA INICIAL?? PROBAR) -> LO VOLVI A SACARE Y FUNCION BIEN!
    $valores_campos[$pos_campo_caja] = $id_caja;

    //HACER ESTO SOLO SI LA CAJA YA EXISTE EN LA BASE DE DATOS (SI ES EL INSERT DE LA CAJA NO HACERLO PUES EL ID_INTERNO AUN NO EXISTE)
    if($ventana=="maestro_cajas" && $id_caja!="") {
      $nombres_campos[$pos_campo_caja] = "cod_interno";
      $camposId = ereg_replace("caja","cod_interno",$camposId); 
      //$valores_campos[$pos_campo_caja] = $id_caja;
    }

  }

}

  //if($i==0) {
    $nombres_campos_string = crear_string_desde_array($nombres_campos,",,");
    $valores_campos_string = crear_string_desde_array($valores_campos,",,");
	
  //}


  
//$log_sql = logearSql($log_sql, $valores_campos_string, "VALORES","Ficha.php",$s_cod_interno." ".$s_nombre);
   
   
   
   
   
   
   

   
   
   
   
   
   
   
   
   
   
  
  
//LLAMAR A LA BUSINESS LOGIC CORRESPONDIENTE
if($ventana=="ficha_caja" && ($accion=='boton_buscar' || $accion=='key_buscar')) {
  $cierre_de_caja_y_log_sql = calcularCierreDeCaja($id_punto_venta,$id_caja,$fecha,$log_sql);
  $cierre_de_caja = $cierre_de_caja_y_log_sql["cierre_de_caja"];
  $log_sql = $cierre_de_caja_y_log_sql["log_sql"];
  $result_array = array($cierre_de_caja);
  $existe_ficha = "true";
  $mensaje = "";
}






//CASO PARTICULAR PARA CALCULAR IMPUESTOS PARA ANGULAR
else if($accion=="calcular_impuestos") {
  $datos_ficha = Impuesto($id_punto_venta,$id_caja,$fecha,$ventana,$entidad,$accion,$nombres_campos,$valores_campos,$camposId,$log_sql,$enviar_mail_tarea);
  $result_array = $datos_ficha["result_array"];
  $sql = $datos_ficha["sql"];
  $existe_ficha = $datos_ficha["existe_ficha"];
  $mensaje = $datos_ficha["mensaje"];
  $cant_registros_totales = $datos_ficha["cant_registros_totales"];
  $log_sql = $datos_ficha["log_sql"];
}

else if($tipo_uso_formulario=="transaccion" && $accion=="boton_guardar") {

  $datos_ficha = Documento($ventana,$accion);  
  //$datos_ficha = Transaccion($ventana,$accion);
  
  $result_array = $datos_ficha["result_array"];
  $sql = $datos_ficha["sql"];
  $existe_ficha = $datos_ficha["existe_ficha"];
  $mensaje = $datos_ficha["mensaje"];
  $cant_registros_totales = $datos_ficha["cant_registros_totales"];
  $log_sql = $datos_ficha["log_sql"];
}

else {
  $datos_ficha = Ficha($id_punto_venta,$id_caja,$fecha,$ventana,$entidad,$accion,$nombres_campos,$valores_campos,$camposId,$log_sql,$enviar_mail_tarea,$padre,$id_grupo,$todos_camposId_array,$valores_select,$tipo);
  $result_array = $datos_ficha["result_array"];
  
  //SE REQUIERE POR FICHA_MERCADERISTA
  $result_array1 = $datos_ficha["result_array1"];
  $cant_registros_totales1 = $datos_ficha["cant_registros_totales1"];
	
  
  $sql = $datos_ficha["sql"];
  $existe_ficha = $datos_ficha["existe_ficha"];
  $mensaje = $datos_ficha["mensaje"];
  $codigo_respuesta = $datos_ficha["codigo_respuesta"];
  $cant_registros_totales = $datos_ficha["cant_registros_totales"];
  $log_sql = $datos_ficha["log_sql"];
}


//CAMBIAR EL FORMATO MYSQL DE LOS CAMPOS POR EL FORMATO VISUAL

//CASO PARTICULAR CAJA: reemplazar en $result_array el valor correspondiente a "caja" (único) por el nombre de "caja" que llego desde el formulario (no único)
if(array_search("caja",$nombres_campos)==true) {
  $pos_campo_caja = array_search("caja",$nombres_campos);
 
  //PARA QUE EN ESTA VENTANA NO DIBUJE UN "" EN CAJA EN LA PRIMERA FILA
  if($ventana!="lista_boleta" && $ventana!="lista_cierre_caja") {
    if(is_int(intval($result_array[0][$pos_campo_caja])))
      $result_array[0][$pos_campo_caja] = $caja;
  }

}

if($ventana=="maestro_cajas" && $id_caja!="") {
  $pos_campo_caja = array_search("cod_interno",$nombres_campos);
  $nombres_campos[$pos_campo_caja] = "caja";
  $result_array[0][$pos_campo_caja] = $caja;
}




//DEVOLVER A SER VALORES DEL GRID, PARA QUE USE EL SQL QUE ESTA CONFIGURADO EN EL GRID (TODO ESTO ESTA COPIADO TAL CUAL DESDE ARRIBA) ARREGLAR!!!!!!!!!!!!!!!
if($tipo_estructura=="filtro" || $tipo_estructura==3) {
  $entidad = substr($form_grid_filtro,0,strlen($form_grid_filtro)-4);
  $form = $form_grid_filtro;
}



$parametros_entidad_campo_y_log_sql = cargar_parametros_campo($ventana,$entidad,"S",$log_sql);

$parametros_entidad_campo = $parametros_entidad_campo_y_log_sql["result_array"];
if($activar_log_sql==1)
  $log_sql = $parametros_entidad_campo_y_log_sql["log_sql"];

$cant_parametros_entidad_campo = count($parametros_entidad_campo);



//CARGAR NOMBRES DE LOS CAMPOS DE LA ENTIDAD
for($i=0;$i<$cant_parametros_entidad_campo;$i++) {
  $nombres_campos[$i] = strtolower($parametros_entidad_campo[$i]["metadata_nombre"]);
  $desde_bd[$i] = strtolower($parametros_entidad_campo[$i]["desde_bd"]);
}
    



//CARGAR VALORES DE LOS CAMPOS DE LA ENTIDAD Y DEJARLOS EN FORMATO MYSQL
for($i=0; $i<$cant_parametros_entidad_campo; $i++) {
  $valores_campos[$i] = urldecode(cargarVariablePost($nombres_campos[$i],''));
  //$valores_campos[$i] = htmlentities(cargarVariablePost($nombres_campos[$i]));
  
  //CAMBIAR EL VALOR DE LOS CAMPOS DESDE EL FORMATO VISUAL AL FORMATO DE MYSQL
  $formato_visual = $parametros_entidad_campo[$i]["formato_visual"];

 
  
  if($formato_visual=="FECHA" || $formato_visual=="1")
    $valores_campos[$i] = fechaChileAFechaMysql($valores_campos[$i]);
  else if(($formato_visual=="TIMESTAMP" || $formato_visual=="3") && $valores_campos[$i]!="")
    $valores_campos[$i] = timestampChileATimestampMysql($valores_campos[$i]);
  else if(($formato_visual=="MONEDA" || $formato_visual=="2") && $tipo_estructura<>"filtro")
    $valores_campos[$i] = moneda_a_numero($valores_campos[$i]);

  //CAMBIAR EL VALOR NO UNICO DE "CAJA" POR EL VALOR "UNICO" PARA SER USADO EN LOS SQL (para cuando el campo caja es parte de la entidad)
  if($nombres_campos[$i]=="caja") {
    $pos_campo_punto_venta = array_search("punto_venta",$nombres_campos);
    $pos_campo_caja = array_search("caja",$nombres_campos);

    //BUSCAR EL ID UNICO DE LA CAJA
    $id_unico_caja_y_log_sql = verIdUnicoCaja($valores_campos[$pos_campo_punto_venta],$valores_campos[$pos_campo_caja],$log_sql);
    $id_caja = $id_unico_caja_y_log_sql["id_unico_caja"];
    $log_sql = $id_unico_caja_y_log_sql["log_sql"];

    //ESTE VALOR ESTABA AFUERA PERO LO METI ADENTRO (NO, SE USA ARRIBA PARA GUARDAR LA CAJA INICIAL?? PROBAR) -> LO VOLVI A SACARE Y FUNCION BIEN!
    $valores_campos[$pos_campo_caja] = $id_caja;

    //HACER ESTO SOLO SI LA CAJA YA EXISTE EN LA BASE DE DATOS (SI ES EL INSERT DE LA CAJA NO HACERLO PUES EL ID_INTERNO AUN NO EXISTE)
    if($ventana=="maestro_cajas" && $id_caja!="") {
      $nombres_campos[$pos_campo_caja] = "cod_interno";
      $camposId = ereg_replace("caja","cod_interno",$camposId); 
      //$valores_campos[$pos_campo_caja] = $id_caja;
    }

  }

}

////////////////////////////////////////////

//PARA DESACTIVAR EL SQL Y LOG SQL
$sql = "";
$log_sql = "";

//CREAR EL XML DE RESPUESTA
$xml = "";
$xml .= '<?xml version="1.0" standalone="yes"?>';

//GENERALIZAR!!!!
if($ventana=="ficha_mercaderista")
  $cant_entidades = 2;
else
  $cant_entidades = 1;

$xml .= '<raiz_xml '.var_mensaje.'="'.URLEncode($mensaje).'" '.var_existe_ficha.'="'.$existe_ficha.'" '.var_sql.'="'.URLEncode($sql).'" log_sql="'.URLEncode($log_sql).'" codigo_respuesta="'.$codigo_respuesta.'" '.var_accion.'="'.$accion.'" cant_total_registros="'.$cant_registros_totales.'" cant_total_registros1="'.$cant_registros_totales1.'" scrollx="'.$scrollx.'" scrolly="'.$scrolly.'" cant_entidades="'.$cant_entidades.'">';

for($i=0;$i<$cant_entidades;$i++){

  if($i==0){
    $xml .= crearXMLEntidad($entidad,$form,$nombres_campos,$result_array,$id_fila,$desde_bd);
  }
  //SOLO ENTRARA EN ESTA OPCION SI ES FICHA_MERCADERISTA
  else if($i==1){
  
    $entidad = "grid_sala_mercaderista";
	$form = "grid_sala_mercaderistaForm";
    $nombres_campos = array("cod_interno","codigo_local","denominacion");
    $id_fila = array("0","1","2");
	$desde_bd = array("s","s","s");
  
    $xml .= crearXMLEntidad($entidad,$form,$nombres_campos,$result_array1,$id_fila,$desde_bd);
  }
  
}

$xml .= '</raiz_xml>';

//CREAR UN ARCHIVO CON EL CONTENIDO DEL XML DE RESPUESTA
//$fp = fopen("datos_xml.xml","x");
//fwrite($fp,$xml);
//fclose($fp) ;

//QUITAR LOS SQL DEL XML Y LOGEAR SOLO EL XML
//$log_sql = logearSql($log_sql, URLDecode($xml), "GUARDAR - Xml de respuesta al cliente","PageLogicPHP.php",$s_cod_interno." ".$s_nombre);

header('Content-type: text/xml');

echo $xml;

?>