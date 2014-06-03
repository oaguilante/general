//INDICE DE FUNCIONES (capa MARKUP LOGIC)

//MANIPULACION DE DOM

//01. setFocus
//02. getElementsIndex
//03. addOption
//04. limpiar_ventana
//05. OpenCenWindow
//08. abrirVentanaConfirmar
//09. abrirVentana
//13. existeBlancoEnSelect
//18. ventanaAyuda
//19. saveScrollPositions
//20. scroll_pantalla
//26. grid_como_array
//27. primeraOpcion
//28. opcionAnterior
//29. opcionSiguiente
//30. ultimaOpcion
//31. buscarPagina
//49. addEvent
//50. removeEvent
//51. appendElement
//52. showPopup
//53. hidePopup
//54. greyout
//55. greyoutResize
//56. add_to_list: agregar un mail/tarea a una lista
//57. remove_from_list
//58. scrollTop
//59. alert_pro
//60. getDateObject
//62. cambiarColorFondoCampos
//63. dibujaGraficos
//70. mostrar_loader
//71. ocultar_loader
//73. verde_o_rojo
//74. volver

//LOGICA AUXILIAR

//06. URLEncode
//07. URLDecode
//10. buscar_id
//11. number_format
//12. isset
//14. dinero_a_entero
//15. entero_a_dinero
//16. create_XMLHttpRequestObject
//17. addCommas
//21. string_to_array
//24. string_a_fecha_mysql
//25. fecha_mysql_a_string
//32. getXMLChart
//40. array_to_string
//42. timestamp_mysql_a_timestamp_chile
//43. str2xml //ESTA COMENTADA
//44. xml2str //ESTA COMENTADA
//45. maximaLongitud
//46. timestamp_mysql_a_hora_chile
//48. quitar_ceros_a_la_izquierda
//64. trim
//66. posicion_campo
//68. barcode_scan
//69. UrlExists
//72. dias_entre_fechas

//LOGICA DE VALIDACION

//33. validar_rut
//34. validar_email
//35. validar_fecha
//36. validar_numero_entero
//37. validar_codigobarras
//38. es_numero
//41. validar_hora_hhmm
//47. validar_numero_decimal

//DISPONIBLES
//22. 
//23. 
//39. 
//61. 
//65.
//67.

//01.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: establece el elemento que contiene el foco
//13.10.2013 GPS
//ELIMINAR!

function setFocus(_campo) {
  document.getElementById(_campo).focus();
}

//01.///////////////////////////////////////////////////////////////////////////////////////////////


//02.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: devuelve el numero de índice de un campo dentro del form
//13.10.2013 GPS

function getElementsIndex(_element) {

  if (_element.form) {
    for (var i=0; i<_element.form.elements.length;i++) {
      if (_element==_element.form.elements[i]) {
        return i;
      }
    }
    return -1;
  }
  else {
    return -1;
  }
}

//02.///////////////////////////////////////////////////////////////////////////////////////////////


//03.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: crear opción OPTION en un SELECT
//13.10.2013 GPS

function addOption(_selectbox,_text,_value) {
  var _optn = document.createElement("OPTION");
  _optn.text = _text;
  _optn.value = _value;
  _selectbox.options.add(_optn);
}

//03.///////////////////////////////////////////////////////////////////////////////////////////////


//04.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: recarga/resetea la pantalla, borrando todo
//13.10.2013 GPS

function limpiar_ventana() {
  //window.location.reload();
  
  //PARA QUE AL LIMPIAR, NO CONSERVE LAS VARIABLES DE LA URL
  _host = document.forms["ventanaForm"].elements["host"].value;
  _ventana = document.forms["ventanaForm"].elements["ventana"].value;
  
  window.location = "http://"+_host+"/aplicacion/window.php?ventana="+_ventana;
}

//04.///////////////////////////////////////////////////////////////////////////////////////////////


//05.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: abre una ventana centrada en la pantalla
//13.10.2013 GPS

function OpenCenWindow(_url, _winname, _width, _height, _scroll, _fullscreen) {

  var _sw;
  var _x = 0.5 *(window.screen.width - _width);
  var _y = 0.5 *(window.screen.height - _height);
  var _posStr = ", screenX=" + _x + ", screenY=" + _y;
  if (typeof (_sw) != 'undefined')  {
    _sw.close(); 
  }
  if (document.all) {
    _posStr = ", left=" + _x + ", top=" + _y;
  }

  if(_fullscreen=="")
    _fullscreen = "no";
  
  var _pStr = 'resizable, status=no, fullscreen=' + _fullscreen + ', width=' + _width + ', height=' + _height + ', alwaysRaised=1, addressbar=no, titlebar=no, toolbar=no, menubar=no, status=no, scrollbars=' + _scroll;
  var _sw = window.open (_url, _winname, _pStr+_posStr );
  //_sw.document.title = "";

  return false;
}

//05.///////////////////////////////////////////////////////////////////////////////////////////////


//06.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA: codifica un string para ser enviado en el url
//13.10.2013 GPS

function URLEncode(_url) {
   
  var _SAFECHARS = "0123456789" +			// Numérico
	          "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +	// Alfabetico mayúscula
		  "abcdefghijklmnopqrstuvwxyz" +    // Alfabetico minúscula
		  "-_.!~*'()";				// caracteres RFC2396
  var _HEX = "0123456789ABCDEF";
  var _plaintext = _url;
  var _encoded = "";

  for (var _i = 0; _i < _plaintext.length; _i++ ) {
    var _ch = _plaintext.charAt(_i);
    if (_ch == " ") {
      _encoded += "+";        // x-www-urlencoded, en vez de %20
    }
    else if (_SAFECHARS.indexOf(_ch) != -1) {
      _encoded += _ch;
    }
    else {
      var _charCode = _ch.charCodeAt(0);
      if (_charCode > 255) {
        alert( "Unicode Character '" + _ch + "' cannot be encoded using standard URL encoding.\n" + "(URL encoding only supports 8-bit characters.)\n" + "A space (+) will be substituted." );
        _encoded += "+";
      } 
      else {
        _encoded += "%";
        _encoded += _HEX.charAt((_charCode >> 4) & 0xF);
        _encoded += _HEX.charAt(_charCode & 0xF);
      }
    }
  }

  return _encoded;
}

//06.///////////////////////////////////////////////////////////////////////////////////////////////


//07.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA: decodifica un string enviado en el url
//13.10.2013 GPS

function URLDecode(_url) {
  
  var _HEXCHARS = "0123456789ABCDEFabcdef"; 
  var _encoded = _url;
  var _plaintext = "";
  var _i = 0;

  while (_i < _encoded.length) {
    var _ch = _encoded.charAt(_i);
    if (_ch == "+") {
      _plaintext += " ";
      _i++;
    }
    else if (_ch == "%") {
      if (_i < (_encoded.length-2) && _HEXCHARS.indexOf(_encoded.charAt(_i+1)) != -1 && _HEXCHARS.indexOf(_encoded.charAt(_i+2)) != -1 ) {
        _plaintext += unescape( _encoded.substr(_i,3) );
	    _i += 3;
      } 
      else {
        alert('Bad escape combination near ...'+ _encoded.substr(_i) );
	    _plaintext += "%[ERROR]";
	    _i++;
      }
    } 
    else {
      _plaintext += _ch;
      _i++;
    }
  } 
   
  return _plaintext;
}

//07.///////////////////////////////////////////////////////////////////////////////////////////////


//08.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: abre un popup que permite ingresar Si o No
//13.10.2013 GPS

function abrirVentanaConfirmar(_mensaje) {

  var _ventana = confirm(_mensaje);
  //var _ventana = showPopup('popup',_mensaje,'CONFIRM');

  return _ventana;
}

//08.///////////////////////////////////////////////////////////////////////////////////////////////


//09.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: abre popup con mensaje
//13.10.2013 GPS
//ELIMINAR!

function abrirVentana(_mensaje) {
  var _ventana = alert(_mensaje);
}

//09.///////////////////////////////////////////////////////////////////////////////////////////////


//10.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA: busca la posición (index) de un string dentro de un array
//13.10.2013 GPS

function buscar_id(_string_buscado,_array_buscar_en) {

  _pos = "";
  _cant_buscar_en = _array_buscar_en.length;

  for(_i=0;_i<_cant_buscar_en;_i++) {
    if(_array_buscar_en[i]==_string_buscado)
      _pos = _i;
  }

  return _pos;
}

//10.///////////////////////////////////////////////////////////////////////////////////////////////


//11.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA: escribe un string en formato de número
//13.10.2013 GPS

function number_format(_a, _b, _c, _d) {

	//number_format(numero, decimales, coma, formato separador)
	_a = Math.round(_a * Math.pow(10, _b)) / Math.pow(10, _b);
	_e = _a + '';
	_f = _e.split('.');

	if(!_f[0]) _f[0] = '0';

	if(!_f[1]) _f[1] = '';

	if(_f[1].length < _b){
		_g = _f[1];
		for(_i = _f[1].length + 1; _i <= _b; _i++) {
			_g += '0';
		}
		_f[1] = _g;
	}

	if(_d != '' && _f[0].length > 3) {
		_h = _f[0];
		_f[0] = '';

		for(_j = 3; _j < _h.length; _j += 3) {
			_i = _h.slice(_h.length - _j, _h.length - _j + 3);
			_f[0] = _d + _i +  _f[0] + '';
		}

		_j = _h.substr(0, (_h.length % 3 == 0) ? 3 : (_h.length % 3));
		_f[0] = _j + _f[0];
	}

	_c = (_b <= 0) ? '': _c;

	return _f[0] + _c + _f[1];
}

//11.///////////////////////////////////////////////////////////////////////////////////////////////


//12.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA: determinar si una variable existe
//13.10.2013 GPS

function isset(_variable_name) {
  try {
    if (typeof(eval(_variable_name)) != 'undefined')
      if (eval(_variable_name) != null)
        return true;
    } 
    catch(e) { }
  return false;
}

//12.///////////////////////////////////////////////////////////////////////////////////////////////


//13.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: validar si existe un blanco en select
//20.10.2013 GPS

function existeBlancoEnSelect(_formulario,_select) {

  _existe = false; 
  _cant_opciones = document.forms[_formulario].elements[_select].options.length;
 
  for(_r=0;_r<_cant_opciones;_r++) {
    if(document.forms[_formulario].elements[_select].options[_r].text=="" && _existe==false)
      _existe = true;
  }

return _existe;

}

//13.///////////////////////////////////////////////////////////////////////////////////////////////


//14.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA: convierte formato dinero a entero
//13.10.2013 GPS

function dinero_a_entero(_texto_dinero) {

  //HAY QUE PONER 1 REPLACE POR CADA PUNTO QUE SE QUIERA ELIMINAR
  _texto_entero = parseInt(_texto_dinero.substr(2,_texto_dinero.length).replace(".","").replace(".","").replace(".","").replace(".",""));

return _texto_entero;

}

//14.///////////////////////////////////////////////////////////////////////////////////////////////


//15.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA: convierte formato entero a dinero
//13.10.2013 GPS

function entero_a_dinero(_texto_entero) {

_texto_dinero = "$ "+addCommas(_texto_entero.toString());
return _texto_dinero;

}

//15.///////////////////////////////////////////////////////////////////////////////////////////////


//16.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA: crea objeto http request xml para usar ajax
//13.10.2013

function create_XMLHttpRequestObject() {
  try {
    _ajaxobj = new ActiveXObject("Msxml2.XMLHTTP");
  } 
  catch (e) {
    try {
      _ajaxobj = new ActiveXObject("Microsoft.XMLHTTP");
    } 
    catch (E) {
      _ajaxobj = false;
    }
  }
   
  if (!_ajaxobj && typeof XMLHttpRequest!='undefined') {
    _ajaxobj = new XMLHttpRequest();
  }
  return _ajaxobj;

}

//16.///////////////////////////////////////////////////////////////////////////////////////////////


//17.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA: NI IDEA QUE HACE
//13.10.2013 GPS

function addCommas(_strValue) {

var _objRegExp = new RegExp('(-?[0-9]+)([0-9]{3})'); 

while(_objRegExp.test(_strValue)) {
  _strValue = _strValue.replace(_objRegExp, '$1.$2');
}

return _strValue;
}

//17.///////////////////////////////////////////////////////////////////////////////////////////////

//18.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: abre popup con ayuda para usar un campo (NO SE USA EN GRID)
//13.10.2013 GPS

function ventanaAyuda(_entidad,_campo,_info) {
 
if(_info=='')
  _info = "Sin información disponible.";

_mensaje = URLDecode(_campo).charAt(0).toUpperCase() + URLDecode(_campo).substring(1)+ ":" + "\n\n-" + URLDecode(_info);
  
alert(_mensaje);
//showPopup('popup',URLDecode(_mensaje),'ALERT','','','');

}

//18.///////////////////////////////////////////////////////////////////////////////////////////////

//19.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: guardar la posición del scroll de ventana
//13.10.2013 GPS

function saveScrollPositions(_theForm) {

  var _scrOfX = 0, _scrOfY = 0;

  if( typeof( window.pageYOffset ) == 'number' ) {
    //Netscape
    _scrOfY = window.pageYOffset;
    _scrOfX = window.pageXOffset;
  } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
    //DOM
    _scrOfY = document.body.scrollTop;
    _scrOfX = document.body.scrollLeft;
  } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
    //IE6
    _scrOfY = document.documentElement.scrollTop;
    _scrOfX = document.documentElement.scrollLeft;
  }

  document.forms[_theForm].elements["var_scrollx"].value = _scrOfX;
  document.forms[_theForm].elements["var_scrolly"].value = _scrOfY;

//alert(_scrOfX+","+_scrOfY);

}

//19.///////////////////////////////////////////////////////////////////////////////////////////////


//20.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: mueve la posición del scroll de la pantalla
//13.10.2013 GPS

function scroll_pantalla(_scrollx,_scrolly) {
  window.scrollTo(_scrollx,_scrolly);
}

//20.///////////////////////////////////////////////////////////////////////////////////////////////


//21.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA: transforma un string compuesto por varios valores en un array de 1 dimensión
//13.10.2013 GPS

function string_to_array(_string,_separador) {
  _string_array = _string.split(_separador);
  return _string_array;
}

//21.///////////////////////////////////////////////////////////////////////////////////////////////

//22.///////////////////////////////////////////////////////////////////////////////////////////////


//22.///////////////////////////////////////////////////////////////////////////////////////////////

//23.///////////////////////////////////////////////////////////////////////////////////////////////


//23.///////////////////////////////////////////////////////////////////////////////////////////////

//24.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA: convierte una fecha en formato Chile (DD/MM/YYYY) en una fecha en formato mysql (YYYY-MM-DD) 
//13.10.2013 GPS

function string_a_fecha_mysql(_texto) {
  _texto = _texto.substr(6,4) + "-" + _texto.substr(3,2) + "-" + _texto.substr(0,2);
  return _texto;
}

//24.///////////////////////////////////////////////////////////////////////////////////////////////

//25.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA: convierte una fecha en formato mysql (YYYY-MM-DD) en una fecha en formato Chile (DD/MM/YYYY)
//13.10.2013 GPS

function fecha_mysql_a_string(_texto) {
  _texto = _texto.substr(8,2) + "/" + _texto.substr(5,2) + "/" + _texto.substr(0,4);
  return _texto;
}

//25.///////////////////////////////////////////////////////////////////////////////////////////////

//26.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: transformar los valores de un grid en un array de 2 dimensiones
//13.10.2013 GPS

function grid_como_array(_id_grid,_reg_sin_contar) {

_cant_registros = document.getElementById(_id_grid).rows.length-1;
_cant_columnas = document.getElementById(_id_grid).rows[0].cells.length-2;

var _datos_chart = new Array();

for(_i=1;_i<=_cant_registros-_reg_sin_contar;_i++) {

  var _elem_datos_chart = new Array();

  for(_j=0;_j<_cant_columnas;_j++) {
    _elemento = document.getElementById(_id_grid).rows[_i].cells[_j].children[0].value;

    if(_elemento.substr(0,1)=="$")
      _elem_datos_chart.push(dinero_a_entero(document.getElementById(_id_grid).rows[_i].cells[_j].children[0].value));
    else
      _elem_datos_chart.push(document.getElementById(_id_grid).rows[_i].cells[_j].children[0].value);
  }

  _datos_chart.push(_elem_datos_chart);

}

return _datos_chart;

}

//26.///////////////////////////////////////////////////////////////////////////////////////////////


//27.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: paginador botón inicio
//13.10.2013 GPS

function primeraOpcion(_formulario) {
  if(document.forms["paginadorForm"].elements["paginas"].selectedIndex > 0) {
    document.forms["paginadorForm"].elements["paginas"].selectedIndex = 0;
    _pagina = document.forms["paginadorForm"].elements["paginas"].selectedIndex;
    buscar_lista(_formulario,_pagina);
  }
}

//27.///////////////////////////////////////////////////////////////////////////////////////////////


//28.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: paginador botón anterior
//13.10.2013 GPS

function opcionAnterior(_formulario) {
  if(document.forms["paginadorForm"].elements["paginas"].selectedIndex > 0) {
    document.forms["paginadorForm"].elements["paginas"].selectedIndex = document.forms["paginadorForm"].elements["paginas"].selectedIndex - 1;
    _pagina = document.forms["paginadorForm"].elements["paginas"].selectedIndex;
    buscar_lista(_formulario,_pagina);
  }
}

//28.///////////////////////////////////////////////////////////////////////////////////////////////


//29.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: paginador botón siguiente
//13.10.2013 GPS

function opcionSiguiente(_formulario) {
  if(document.forms["paginadorForm"].elements["paginas"].selectedIndex < document.forms["paginadorForm"].elements["paginas"].length - 1) {
    document.forms["paginadorForm"].elements["paginas"].selectedIndex = document.forms["paginadorForm"].elements["paginas"].selectedIndex + 1;
    _pagina = document.forms["paginadorForm"].elements["paginas"].selectedIndex;
    buscar_lista(_formulario,_pagina);
  }
}

//29.///////////////////////////////////////////////////////////////////////////////////////////////


//30.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: paginador botón fin
//13.10.2013 GPS

function ultimaOpcion(_formulario) {
  if(document.forms["paginadorForm"].elements["paginas"].selectedIndex < document.forms["paginadorForm"].elements["paginas"].length - 1) {
    document.forms["paginadorForm"].elements["paginas"].selectedIndex = document.forms["paginadorForm"].elements["paginas"].length - 1;
    _pagina = document.forms["paginadorForm"].elements["paginas"].selectedIndex;
    buscar_lista(_formulario,_pagina);
  }
}

//30.///////////////////////////////////////////////////////////////////////////////////////////////


//31.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: paginador select por página
//13.10.2013 GPS

function buscarPagina(_formulario) {
  _pagina = document.forms["paginadorForm"].elements["paginas"].selectedIndex;
  buscar_lista(_formulario,_pagina);
}

//31.///////////////////////////////////////////////////////////////////////////////////////////////

//32.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA: generar xml para dibujar gráfico Fusionchart
//13.10.2013 GPS

function getXMLChart(_id_chart,_datos_chart) { 

  var _chartObj = getChartFromId(_id_chart);
  _cant_registros = _datos_chart.length;

  _strXML  = "<chart caption=' ' subCaption=' ' showPercentValues='1' pieSliceDepth='30' showBorder='1'>";
  for(_i=0;_i<_cant_registros;_i++) { 
    _strXML = _strXML + "<set label='"+_datos_chart[i][0]+"' value='"+_datos_chart[i][1]+"'/>";
  }
  _strXML = _strXML + "</chart>";

return _strXML;
  
}

//32.///////////////////////////////////////////////////////////////////////////////////////////////

//33.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA VALIDACION: validar rut Chile
//13.10.2013 GPS

function validar_rut(_form,_metadata,_crut) {

  if(_crut.charAt(_crut.length-2)!='-') {
    alert("El RUT ingresado no es v\u00E1lido.");
    window.document.forms[_form].elements[_metadata].focus();
    return false;
  }

  _tmpstr = '';

  for(_i=0;_i<_crut.length;_i++)
    if(_crut.charAt(_i)!=' ' && _crut.charAt(_i)!='-')
      _tmpstr = _tmpstr + _crut.charAt(_i);
    else {
      if(_crut.charAt(_i)==' ') {
        alert("El RUT ingresado no es v\u00E1lido.");
        window.document.forms[_form].elements[_metadata].focus();
        return false;
      }
    }

  _crut = _tmpstr;
  _largo = _crut.length;

  if (_largo>2)
    _rut = _crut.substring(0,_largo-1);
  else
    _rut = _crut.charAt(0);

  _dv = _crut.charAt(_largo-1);

  if(_rut==null || _dv==null)
    return 0;

  var _dvr = '0';

  _suma = 0; 
  _mul  = 2;

  for(_i=_rut.length-1;_i>=0;_i--) {
    _suma = _suma + _rut.charAt(_i) * _mul;
    if (_mul == 7)
      _mul = 2;
    else
      _mul++;
  }

  _res = _suma % 11;

  if (_res==1)
    _dvr = 'k';
  else if (_res==0)
    _dvr = '0';
  else {
    _dvi = 11-_res;
    _dvr = _dvi + "";
  }

  if (_dvr!=_dv.toLowerCase()) {
    alert("El RUT ingresado no es v\u00E1lido.");
    window.document.forms[_form].elements[_metadata].focus();
    return false;
  }

return true;
}

//33.///////////////////////////////////////////////////////////////////////////////////////////////

//34.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA VALIDACION: validar email
//13.10.2013 GPS

function validar_email(_formulario,_metadata,_sText) {
  var _reEmail = /^(?:\w+\.?)*\w+@(?:\w+\.)+\w+$/;
  _validado = _reEmail.test(_sText);

  if(_validado==false) {
    alert("El EMAIL ingresado no es v\u00E1lido.");
    window.document.forms[_formulario].elements[_metadata].focus();
    return false;
  }
  else
    return true;
  
}

//34.///////////////////////////////////////////////////////////////////////////////////////////////

//35.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA VALIDACION: validar fecha
//13.10.2013 GPS

function validar_fecha(_formulario,_metadata,_sText) {

  //LARGO
  if(_sText.length==10) {
    //CARACTERES Y FORMATO
	
	//AL USAR TYPE=DATE EN MOVIL LA FECHA SE CAPTURA CON FORMATO YYYY-MM-DD POR LO QUE SE DEBE CONVERTIR A DD/MM/AAAA
	if(_sText.substr(4,1)=="-");
	  _sText = _sText.substr(8,2)+"/"+_sText.substr(5,2)+"/"+_sText.substr(0,4);
	
    var _reDate = /(?:0[1-9]|[12][0-9]|3[01])\/(?:0[1-9]|1[0-2])\/(?:19|20\d{2})/;
    _validado = _reDate.test(_sText);
  }
  else {
    _validado = false;
  }
  
  //MENSAJE FECHA NO VALIDA
  if(_validado==false) {
    alert("La FECHA ingresada no es válida.");
    window.document.forms[_formulario].elements[_metadata].focus();
    return false;
  }
  else 
    return true;
}

//35.///////////////////////////////////////////////////////////////////////////////////////////////

//36.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA VALIDACION: validar número entero
//13.10.2013 GPS

function validar_numero_entero(_formulario,_metadata,_sText) {

  _i=0;
  _punto_validado=false;

  while(_i<_sText.length && _punto_validado==false) {
    if(_sText.charAt(_i)=='.')
      _punto_validado = true;

  _i=_i+1;
  }

  _validado = isNaN(_sText);

  if(_validado==true || _punto_validado==true) { 
    alert("El NUMERO ingresado no es v\u00E1lido.");
    window.document.forms[_formulario].elements[_metadata].focus();
    return false;
  }
  else { 
    return true;
  }
}

//36.///////////////////////////////////////////////////////////////////////////////////////////////

//37.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA VALIDACION: validar código de barras
//13.10.2013 GPS

function validar_codigobarras(_formulario,_metadata,_sText) {
 
  _largo = _sText.length;
  _digito_validador = _sText.charAt(_largo-1);
  _ceros='';

  for(_i=1;_i<13-_largo;_i++) {
    _ceros = _ceros+"0";
  }

  _cod_interno = _ceros+_sText;

  //_check_digit = createCheckDigitEAN13(_cod_interno);
 
  //if(_digito_validador==_check_digit)
    _validado=true;

  if(_validado==false) {
    alert("El CODIGO DE BARRAS ingresado no es v\u00E1lido.");
    window.document.forms[_formulario].elements[_metadata].focus();
    return false;
  }
  else {
    window.document.forms[_formulario].elements[_metadata].value=_cod_interno;
    return true;
  }
}

//37.///////////////////////////////////////////////////////////////////////////////////////////////

//38.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA VALIDACION: validar si es un número
//13.10.2013 GPS

function es_numero(_input) {

  if(_input!='') {
    var _ValidChars = "0123456789";
    var _IsNumber=true;
    var _Char;

    for (_i=0;_i<_input.length && _IsNumber==true;_i++) {
      _Char = _input.charAt(_i);
      if (_ValidChars.indexOf(_Char) == -1) {
        _IsNumber = false;
      }
    }
    return _IsNumber;
  }
  else {
    _IsNumber = false;
    return _IsNumber;
  }

}

//38.///////////////////////////////////////////////////////////////////////////////////////////////

//39.///////////////////////////////////////////////////////////////////////////////////////////////


//39.///////////////////////////////////////////////////////////////////////////////////////////////

//40.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA: convertir un array de 1 dimensión en un string
//13.10.2013 GPS

function array_to_string(_array,_separador) {
 
  _string = "";
  _cant_elementos = _array.length;

  for(_r=0;_r<_cant_elementos;_r++) {
    _string = _string + _separador + _array[_r];
  }

  _string = _string.substr(1,_string.count);

return _string;

}

//40.///////////////////////////////////////////////////////////////////////////////////////////////

//41.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA VALIDACION: validar si es una hora (HH:MM)
//13.10.2013 GPS

function validar_hora_hhmm(_formulario,_metadata,_sText) {

  //alert(_formulario+"---"+_metadata+"---"+_sText);

  _hora=_sText;

  if(_hora.length>5 || _hora.length!=5)  {
    alert("La HORA ingresada no es v\u00E1lida.");
    window.document.forms[_formulario].elements[_metadata].focus();
    return false;
  }

  _a=_hora.charAt(0);
  _b=_hora.charAt(1);
  _c=_hora.charAt(2);
  _d=_hora.charAt(3);

  if((_a>=2 && _b>3) || _c!=":" || _d>5 || es_numero(_a+_b)==false) {
    alert("La HORA ingresada no es v\u00E1lida.");
    window.document.forms[_formulario].elements[_metadata].focus();
    return false;
  }
  else
    return true;

}

//41.///////////////////////////////////////////////////////////////////////////////////////////////

//42.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA: convertir un timestamp Mysql (AAAA-MM-DD HH:MM) a un timestamp Chile (DD-MM-AAAA HH:MM)
//13.10.2013 GPS

function timestamp_mysql_a_timestamp_chile(_texto) {
  _texto = _texto.substr(8,2) + "/" + _texto.substr(5,2) + "/" + _texto.substr(0,4) + " " + _texto.substr(11,8);
  return _texto;
}

//42.///////////////////////////////////////////////////////////////////////////////////////////////

//43.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA: convertir un string en XML (NO SE USA PERO PODRIA SERVIR)
//13.10.2013 GPS
/*
function str2xml(_strXML) {
 
  //código para IE
  if (window.ActiveXObject) { 
    var _doc=new ActiveXObject("Microsoft.XMLDOM"); 
    _doc.async="false"; 
    _doc.loadXML(_strXML); 
    } 
  //código para Mozilla, Firefox, Opera, etc. 
  else { 
    var _parser=new DOMParser(); 
    var _doc=_parser.parseFromString(_strXML,"text/xml"); 
  }

//documentElement siempre representa el nodo raíz 
return _doc; 
}
*/

//43.///////////////////////////////////////////////////////////////////////////////////////////////

//44.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA: convertir un XML en string (NO SE USA PERO PODRIA SERVIR)
//13.10.2013 GPS
/*
function xml2str(_xmlDom) { 
  var _strs = null; 
  var _doc = _xmlDom.documentElement; 

  if(_doc.xml == undefined) { 
    _strs = (new XMLSerializer()).serializeToString(_xmlDom); 
  }
  else 
    _strs = _doc.xml; 
    
  return _strs; 
} 
*/
//44.///////////////////////////////////////////////////////////////////////////////////////////////

//45.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA: definir la máxima longitud para un texto
//13.10.2013 GPS

function maximaLongitud(_texto,_maxlong) {

  var _tecla, _int_value, _out_value;
 
  if (_texto.value.length > _maxlong) {
  
    /*con estas 3 sentencias se consigue que el texto se reduzca al tamaño maximo permitido, sustituyendo lo que se haya introducido, por los primeros caracteres hasta dicho limite*/
    _in_value = _texto.value;
    _out_value = _in_value.substring(0,_maxlong);
    _texto.value = _out_value;
	
    alert("La longitud máxima es de " + _maxlong + " caracteres.");
    return false;
  }

return true;
}

//45.///////////////////////////////////////////////////////////////////////////////////////////////

//46.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA: convertir un timestamp Mysql (AAAA-MM-DD HH:MM) a una hora Chile (HH:MM)
//13.10.2013 GPS

function timestamp_mysql_a_hora_chile(_texto) {
  _texto = _texto.substr(11,8);
  return _texto;
}

//46.///////////////////////////////////////////////////////////////////////////////////////////////

//47.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA VALIDACION: validar que un número sea decimal
//13.10.2013 GPS

function validar_numero_decimal(_formulario,_metadata,_sText) {

  //alert(_formulario+"---"+_metadata+"---"+_sText);

  _signo_decimal="."; 
  
  if(_signo_decimal==".")
    var _pattern = /^[0-9]+(.[0-9]{1,4})?$/; 
	//var _pattern = /^-?[0-9]+(.[0-9]{1,2})?$/; 
  
  if (_sText.match(_pattern)==null) {
    _validado=false;
  } 
  else {

    //VALIDAR QUE NO HAYAN COMAS (EL SEPARADOR DE PUNTOS ES EL PUNTO)
    _i=0;
    _punto_validado=true;

    while(_i<_sText.length && _punto_validado==true) {
      if(_sText.charAt(_i)==',')
        _punto_validado = false;

    _i=_i+1;
    }

    if(_punto_validado==true)
      _validado=true;
    else
      _validado=false;
  }

  if(_validado==false) { 
    alert("El NUMERO ingresado no es v\u00E1lido.");
    window.document.forms[_formulario].elements[_metadata].focus();
    return false;
  }
  else { 
    return true;
  }

}

//47.///////////////////////////////////////////////////////////////////////////////////////////////

//48.///////////////////////////////////////////////////////////////////////////////////////////////
//LOGICA: eliminar los ceros a la izquierda de un valor
//13.10.2013 GPS

function quitar_ceros_a_la_izquierda(_texto) {

  _signo_decimal="."; 

  for(_i=0;_i<_texto.length;_i++) {
    if(_texto.substr(_i,1)!="0") {
      var _fin = _i; 
      _i = _texto.length;
    }
    else {
      if(_texto.substr(_i+1,1)==_signo_decimal) {
        var _fin = _i; 
        _i = _texto.length;
      }
    }
  }

  _texto_sin_ceros = _texto.substr(_fin,_texto.length-_fin);
 
  return _texto_sin_ceros;

}

//48.///////////////////////////////////////////////////////////////////////////////////////////////

//49.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: SE USA?
//13.10.2013 GPS

function addEvent(_obj ,_evt, _fnc) {
  if (_obj.addEventListener)
    _obj.addEventListener(_evt,_fnc,false);
  else if (_obj.attachEvent)
    _obj.attachEvent('on'+_evt,_fnc);
  else
    return false;
  return true;
}

//49.///////////////////////////////////////////////////////////////////////////////////////////////

//50.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: SE USA?
//13.10.2013 GPS

function removeEvent(_obj ,_evt, _fnc) {
  if (_obj.removeEventListener)
    _obj.removeEventListener(_evt,_fnc,false);
  else if (_obj.detachEvent)
    _obj.detachEvent('on'+_evt,_fnc);
  else
    return false;

return true;
}

//50.///////////////////////////////////////////////////////////////////////////////////////////////

//51.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: SE USA?
//13.10.2013 GPS

function appendElement(_node,_tag,_id,_htm) {
  var _ne = document.createElement(_tag);
  if(_id) 
    _ne.id = _id;
  if(_htm) 
    _ne.innerHTML = _htm;
  _node.appendChild(_ne);
}

//51.///////////////////////////////////////////////////////////////////////////////////////////////
       
//52.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: mostrar el popup con fondo negro
//13.10.2013 GPS

function showPopup(_p,_mensaje,_tipo_popup,_fila_actual,_formulario,_codigo_respuesta) {	 
	
  //alert("SHOW_POPUP");
	 
  //OSCURECER EL FONDO (SOLO PARA NO NATIVA)
  greyout(true,140);

  //CALCULAR ALTURA Y ANCHO DE LA PANTALLA
  var _myWidth = 0, _myHeight = 0;
  
  if(typeof(window.innerWidth)=='number') {
    //No IE
    _myWidth = window.innerWidth;
    _myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ en 'standards compliant mode'
    _myWidth = document.documentElement.clientWidth;
    _myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    _myWidth = document.body.clientWidth;
    _myHeight = document.body.clientHeight;
  }

  //DEFINIR ANCHO Y ALTO DEL DIV POPUP
	if(_tipo_popup=="IMG") { 
	 _div_width = 800;
	  _div_height = 600;
	  }else{
	  _div_width = 550;
	  _div_height = 160;
	 }
  var _obj = document.getElementById(_p);

  _obj.style.position = 'fixed';
  _obj.style.width = _div_width+'px';
  _obj.style.height = _div_height+'px';

  //DEFINIR LA UBICACIONES DEL DIV EN LA PANTALLA
  document.getElementById(_p).style.top = parseInt(_myHeight)/2 - _div_height/2 + 'px';
  document.getElementById(_p).style.left = parseInt(_myWidth)/2 - _div_width/2 + 'px';
  document.getElementById(_p).style.display = 'block';

  //alert(_tipo_popup);
  
  if(_tipo_popup=="ALERT") {
    document.getElementById(_p).innerHTML  = '<div class="popuptitle"></div><div class="popupbody"><p><p>'+_mensaje+'</p><p><p><input type="button" value="Aceptar" onClick="hidePopup(' + "'" + 'popup' + "'" + ','+ "'" +_codigo_respuesta+ "'" +')"/></div>';
  }
  else if(_tipo_popup=="IMG") {
	//var text = _fila_actual.replace("@","-");
	var text = ReplaceAll(_fila_actual,"@"," ");
    document.getElementById(_p).innerHTML  = '<div class="popuptitle" ></div><div class="popupbody"><img src="'+_mensaje+'" width="740px;" height="500px;"></img><p style="font-size:15px;font-family:Georgia, Times New Roman, serif; font-style: normal;">'+text+'</p><input type="button" value="Cerrar" onClick="hidePopup(' + "'" + 'popup' + "'" + ','+ "'" +_codigo_respuesta+ "'" +')"/></div>';
  }
  else if(_tipo_popup=="SAVE") {
  
	_div_width = 550;
    _div_height = 160;
	
    _obj.style.width = _div_width+'px';
    _obj.style.height = _div_height+'px';
  
    document.getElementById(_p).innerHTML  = '<div class="popuptitle"></div><div class="popupbody"><div id="loading"></div><p><p><p><div style="height: 34px;"></div>'+_mensaje+'</p></div>';
 
    var _loading = document.getElementById("loading");
    _loading.style.display = "block";
	_loading.style.top = "30px";
  }
  else if(_tipo_popup=="CONFIRM") {

    //COPEC: GENERALIZAR SACANDO EL NOMBRE DE LA FUNCION DE ACA (COPEC)
    if(_formulario=="gridProyectoForm" || _formulario=="grid_archivos_proyectoForm")
	  _funcion = "eliminar_registro";
	  
    else if(_formulario=="cargadorForm")
	  _funcion = "carga";
	  
	else if(_formulario=="descargarForm")
	  _funcion = "Descargafichero";
	  
	  else if(_formulario=="mapa_sucursales_di")
	  _funcion = "muevepuntos";
	  
	//COPEC: FORMULARIO DONDE SE CIERRA UNA TAREA 
	else if(_formulario=="fecha_termino_tareaForm")
	  _funcion = "confirmar";
    else
	  _funcion = "eliminar_registro";

    document.getElementById(_p).innerHTML  = '<div class="popuptitle"></div><div class="popupbody"><p><p>'+_mensaje+'</p><p><p><input type="button" name= "boton_aceptar" id="boton_aceptar" value="Aceptar" onClick="'+_funcion+'(' + "'" + _formulario + "'" + ',' + "'" + _fila_actual + "'" + ');return true;"/>&nbsp;&nbsp&nbsp<input type="button" value="Cancelar" onClick="hidePopup(' + "'" + 'popup' + "'" + ');return false;"/></div>';
  
  }
  else if(_tipo_popup=="INPUT") {
    _div_width = 450;
    _div_height = 208;
    _obj.style.width = _div_width+'px';
    _obj.style.height = _div_height+'px';
	
	//FECHA_HOY
	var _currentTime = new Date();
	var _day = _currentTime.getDate();
	if(_day<10)
	  _day = "0" + _day;
    var _month = _currentTime.getMonth() + 1;
	if(_month<10)
	  _month = "0" + _month;
    var _year = _currentTime.getFullYear();
    var _fecha_hoy = _day + "/" + _month + "/" + _year;
    ////////
	
	//COPEC: SOLO SE OCUPA PARA ACTIVAR PROYECTOS
	_a = '<div class="popuptitle"></div>';
	_a = _a + '<div class="popupbody"><p><p>';
	_a = _a + '<form name="input_form">';
	_a = _a + '<div style="vertical-align: middle;">';
	_a = _a + 'Fecha inicio:&nbsp;';
	_a = _a + '<input type="input" size="15" name="input_field" value="'+_fecha_hoy+'"><br>';
	_a = _a + '</div>';
	_a = _a + '<div style="vertical-align: middle;">';
	_a = _a + 'Tipo fecha:&nbsp;&nbsp;&nbsp;';
	_a = _a + '<select width="100" name="tipo_fecha_inicio">';
	_a = _a + '<OPTION VALUE="1">apertura real</OPTION>';
	_a = _a + '<OPTION VALUE="4">apertura estimada</OPTION>';
	_a = _a + '</select>';
	_a = _a + '</div>';
	_a = _a + '</form>';
	_a = _a + '<br><p>';
	_a = _a + '<input type="button" value="Aceptar" onClick="activar(' + "'" + _fila_actual + "'" + ',' + "'" + _formulario + "'" + ');return true;"/>';
	_a = _a + '&nbsp;&nbsp&nbsp';
	_a = _a + '<input type="button" value="Cancelar" onClick="hidePopup(' + "'" + 'popup' + "'" + ');return false;"/>';
	_a = _a + '</div>';
	
    document.getElementById(_p).innerHTML  = _a;
	
  }
  else if(_tipo_popup=="FILE") {
    //_p = "";
	_mensaje = "";
	_tipo_popup = "";
	//_fila_actual = "";
	_formulario = "";
	_codigo_respuesta = "";
	//_obj = "";
	
    popup_upload(_p,_mensaje,_tipo_popup,_fila_actual,_formulario,_codigo_respuesta,_obj);
  }
 
  
}

//52.///////////////////////////////////////////////////////////////////////////////////////////////

//53.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: ocultar el popup con fondo negro
//13.10.2013 GPS

function hidePopup(_p,_codigo_respuesta) {
  greyout(false);
  document.getElementById(_p).style.display = 'none';
 
  //CAMBIAR EL COLOR DE FONDO DE LOS CAMPOS OBLIGATORIOS QUE ESTAN VACIOS, LUEGO DE OCULTAR EL ALERT (EN DESARROLLO)
  //cambiarColorFondoCampos('#FFCC99',_codigo_respuesta);	
}

//53.///////////////////////////////////////////////////////////////////////////////////////////////

//54.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: oscurecer el fondo en popup con fondo negro
//13.10.2013 GPS

function greyout(_d,_z) {
         
  var _obj = document.getElementById('greyout');

  if(!_obj) {
    appendElement(document.body,'div','greyout');
    _obj = document.getElementById('greyout');
    _obj.style.position = 'absolute';
    _obj.style.top = '0px';
    _obj.style.left = '0px';
    _obj.style.background = '#111';
    _obj.style.opacity = '.5';
    _obj.style.filter = 'alpha(opacity=50)';
  }
         
  if(_d) {
    var _ch = document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
    var _cw = document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth;
    var _sh = document.documentElement.scrollHeight ? document.documentElement.scrollHeight : document.body.scrollHeight;

    //MAXIMO DEL SCROLL VERTICAL
    if(document.body.scrollHeight) _sh = Math.max(_sh,document.body.scrollHeight)
      var _wh = document.documentElement.scrollHeight ? document.documentElement.scrollHeight : document.body.scrollHeight;

    //MAXIMO DEL SCROLL HORIZONTAL
    if(document.body.scrollWidth) _sh = Math.max(_sh,document.body.scrollWidth)
      var _sw = document.documentElement.scrollWidth ? document.documentElement.scrollWidth : document.body.scrollWidth;

	//SUPERPOSICION DE CAPAS EN EJE Z??
    if(!_z) {
      _z = 50; 
    }

    _obj.style.zIndex = _z;
    _obj.style.height = Math.max(_wh,_ch)+'px';
    _obj.style.width  = Math.max(_sw,_cw)+'px';

    _obj.style.display = 'block';
    addEvent(window,'resize',greyoutResize);
  }
  else {
    _obj.style.display = 'none';   
    removeEvent(window,'resize',greyoutResize);
  }

}

//54.///////////////////////////////////////////////////////////////////////////////////////////////

//55.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: NO TENGO CLARO QUE HACE
//13.10.2013 GPS

function greyoutResize() {

  var _ch = document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
  var _cw = document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth;
  var _sh = document.documentElement.scrollHeight ? document.documentElement.scrollHeight : document.body.scrollHeight;

  if(document.body.scrollHeight) _sh = Math.max(_sh,document.body.scrollHeight)
    var _sw = document.documentElement.scrollWidth ? document.documentElement.scrollWidth : document.body.scrollWidth;

  if(document.body.scrollWidth) _sh = Math.max(_sh,document.body.scrollWidth)
    var _wh = window.innerHeight ? window.innerHeight : document.body.offsetHeight;

  var _obj = document.getElementById('greyout');
    _obj.style.height = _ch+'px';
    _obj.style.width  = _cw+'px';
    _obj.style.height = Math.max(_wh,Math.max(_sh,_ch))+'px';
    _obj.style.width  = Math.max(_sw,_cw)+'px';
}

//55.///////////////////////////////////////////////////////////////////////////////////////////////

//56.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: permite agregar un elemento a una lista
//13.10.2013 GPS

//HAY QUE GENELARIZAR ESTA FUNCION
function add_to_list(_formulario,_list,_tipo) {

  _input = _list.substring(0,_list.length-5);
  _optionindex = document.forms[_formulario].elements[_input].selectedIndex;

  if(document.forms[_formulario].elements[_input].value=="") {
    alert_pro("¡Debe ingresar un valor para poder agregarlo a la lista!");
  }
  else if(document.forms[_formulario].elements[_input].value!="") {

    if(_tipo=="input_list"){
      document.forms[_formulario].elements[_list].add(new Option(document.forms[_formulario].elements[_input].value, document.forms[_formulario].elements[_input].value), null); 
    }
    else if(_tipo=="select_list") {
      //new Option([text], [value], [defaultSelected], [selected])
	  
	  //VALIDAR QUE LA OPCION QUE SE QUIERE AGREGAR NO ESTE YA INGRESADA EN LA LISTA
	  _id_tarea = document.forms[_formulario].elements[_input].options[_optionindex].value;
	  _cant_opciones_select = document.forms[_formulario].elements["tareas_predecesoras_list"].length; 
	  _i=0;
	  _seguir=true;
	  
	  while(_i<_cant_opciones_select && _seguir==true) {
	  
	    //alert(_id_tarea+"---"+document.forms[_formulario].elements["tareas_predecesoras_list"].options[_i].value);
	    if(_id_tarea==document.forms[_formulario].elements["tareas_predecesoras_list"].options[_i].value)
	      _seguir=false;
	    else
		  _seguir=true;
	 
	    _i=_i+1;
	  }
	  
	  //alert(_seguir);
	  
	  if(_seguir==true) 
        document.forms[_formulario].elements[_list].add(new Option(document.forms[_formulario].elements[_input].options[_optionindex].text, document.forms[_formulario].elements[_input].options[_optionindex].value), null); 
	  else
	    alert_pro("Tarea ya incorporada a la lista");
    }
	
  document.forms[_formulario].elements[_input].value = "";
  
  }
}

//56.///////////////////////////////////////////////////////////////////////////////////////////////

//57.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: permite quitar un elemento desde una lista
//13.10.2013 GPS

function remove_from_list(_formulario,_list) {

  _input = _list.substring(0,_list.length-5);

  if(document.forms[_formulario].elements[_list].length==0 || document.forms[_formulario].elements[_list].selectedIndex==-1) {
    alert_pro("¡Debe seleccionar un valor de la lista!");
  }
  else if(document.forms[_formulario].elements[_list].value!="") {
    _optionindex = document.forms[_formulario].elements[_list].selectedIndex;
    document.forms[_formulario].elements[_list].remove(_optionindex);
  }
  
}

//57.///////////////////////////////////////////////////////////////////////////////////////////////

//58.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: hacer un scroll hasta arriba
//13.10.2013 GPS

function scrollTop() { 
  
  // Netscape compliant    
  if (typeof(window.pageYOffset) === 'number') {        
    _scroll = window.pageYOffset;    
  }    
  // DOM compliant    
  else if (document.body && document.body.scrollTop) {       
    _scroll = document.body.scrollTop;    
  }    
  // IE6 standards compliant mode    
  else if (document.documentElement && document.documentElement.scrollTop) {        
    _scroll = document.documentElement.scrollTop;    
  }    
  // needed for IE6 (when vertical scroll bar is on the top)    
  else {        
    _scroll = 0;  
  }

return _scroll;

}

//58.///////////////////////////////////////////////////////////////////////////////////////////////

//59.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: mostar una ventana emergente
//13.10.2013 GPS

function alert_pro(_mensaje) { 

  //MOSTRAR EL MENSAJE DEVUELTO POR EL SERVER
  _alert_box_type = document.forms["ventanaForm"].elements["alert_box_type"].value;

  //ALERT COMO VENTANA
  if(_alert_box_type==0)
    alert(URLDecode(_mensaje));
  //ALERT COMO DIV CON FONDO NEGRO
  else if(_alert_box_type==1)     
    showPopup('popup',URLDecode(_mensaje),'ALERT');
	  
}  

//59.///////////////////////////////////////////////////////////////////////////////////////////////

//60.///////////////////////////////////////////////////////////////////////////////////////////////
//DOM: devuelve un objeto de tipo fecha a partir de una fecha en string
//13.10.2013 GPS

function getDateObject(_dateString,_dateSeperator) {

  var _curValue=_dateString;
  var _sepChar=_dateSeperator;
  var _curPos=0;
  var _cDate,_cMonth,_cYear;
 
  //extrae el dia
  _curPos=_dateString.indexOf(_sepChar);
  _cDate=_dateString.substring(0,_curPos);
 
  //extrae el mes 
  _endPos=_dateString.indexOf(_sepChar,_curPos+1); 
  _cMonth=_dateString.substring(_curPos+1,_endPos);
 
  //extrae el año
  _curPos=_endPos;
  _endPos=_curPos+5; 
  _cYear=_curValue.substring(_curPos+1,_endPos);
 
  //crea el objeto del tipo fecha
  _dtObject=new Date(_cYear,_cMonth,_cDate); 

  return _dtObject;
}

//60.///////////////////////////////////////////////////////////////////////////////////////////////

//61.///////////////////////////////////////////////////////////////////////////////////////////////


//61.///////////////////////////////////////////////////////////////////////////////////////////////

//62.////////////////////////////////////////////////////////////////////////////////////////////////  
//DOM: permite cambiar el color de fondo de un campo cuando falte algún campo obligatorio (no está en uso aún)
//13.10.2013 GPS

function cambiarColorFondoCampos(_color,_codigo_respuesta){

  //alert("cambiarColorFondoCampos");
  
  _tipo_estructura = document.forms[_formulario].elements["var_tipo_estructura"].value;
  _metadata_obligatoria = document.forms[_formulario].elements["var_campos_requeridos"].value.split("^");
  _tipo = document.forms[_formulario].elements["var_tipo_requeridos"].value.split("^");
  _cant_metadata = _metadata_obligatoria.length; 

  //SI HAY CAMPOS OBLIGATORIOS EN LA ENTIDAD
  if(_metadata_obligatoria!="") {

    if(_tipo_estructura=="ficha" || _tipo_estructura=="datos") {
     
      for(_i=0;_i<_cant_metadata;_i++) {

	    if(_tipo[_i]=='INPUT') {
		  //PINTAR FONDO INPUT  
		  if(document.forms[_formulario].elements[_metadata_obligatoria[_i]].value=='')
		    document.forms[_formulario].elements[_metadata_obligatoria[_i]].style.background = _color;
			
		  if(_codigo_respuesta!='01')
		    //PONER FOCO EN ULTIMO CAMPO OBLIGATORIO QUE ESTE VACIO, CUANDO FALTE ALGUN CAMPO OBLIGATORIO
		    document.forms[_formulario].elements[_metadata_obligatoria[_i]].focus();
	    }
        else if(_tipo[_i]=='SELECT') {
           //PINTAR FONDO SELECT  
		  //if(document.forms[_formulario].elements[_metadata_obligatoria[_i]].value=='')
		    document.forms[_formulario].elements[_metadata_obligatoria[_i]].style.background = _color;
			
		  if(_codigo_respuesta!='01')
		    //PONER FOCO EN ULTIMO CAMPO OBLIGATORIO QUE ESTE VACIO, CUANDO FALTE ALGUN CAMPO OBLIGATORIO
		    document.forms[_formulario].elements[_metadata_obligatoria[_i]].focus();
 	    }
      }
    }
  }
}

//62.////////////////////////////////////////////////////////////////////////////////////////////////  

//63.////////////////////////////////////////////////////////////////////////////////////////////////  
//DOM: permite dibujar un gráfico en Fusionchart (sacar de acá)
//13.10.2013 GPS

function dibujaGraficos(_nombre_grafico_array,_strXML_array){

  _cant_nombre_grafico_array = _nombre_grafico_array.length;
 
  for(_i=0;_i<_cant_nombre_grafico_array;_i++){
    var _chartReference = getChartFromId(_nombre_grafico_array[_i]);
    _chartReference.setDataXML(URLDecode(_strXML_array[_i]));
  }
  
  _chartReference.render();
  
}

//63.////////////////////////////////////////////////////////////////////////////////////////////////  

//64.////////////////////////////////////////////////////////////////////////////////////////////////  
//LOGICA: elimina espacios en blanco al comienzo y final de un string
//13.10.2013 GPS

function trim(_myString) {
  return _myString.replace(/^\s+/g,'').replace(/\s+$/g,'');
}

//64.//////////////////////////////////////////////////////////////////////////////////////////////// 

//65.//////////////////////////////////////////////////////////////////////////////////////////////// 


//65.//////////////////////////////////////////////////////////////////////////////////////////////// 

//66.////////////////////////////////////////////////////////////////////////////////////////////////  
//LOGICA: conocer la posición de un string dentro de un array de 1 dimensión
//13.10.2013 GPS

function posicion_campo(_campo, _metadata_array) {

  _cant_metadata_array = _metadata_array.length;
  
  for(_i=0;_i<_cant_metadata_array;_i++){
  
    if(_campo==_metadata_array[_i])
	  _posicion = _i;
  }
  
  return _posicion;
}

//66.//////////////////////////////////////////////////////////////////////////////////////////////// 

//67.////////////////////////////////////////////////////////////////////////////////////////////////  


//67.//////////////////////////////////////////////////////////////////////////////////////////////// 

//68.//////////////////////////////////////////////////////////////////////////////////////////////// 
//LOGICA: abrir lector de códigos de barra en el móvil
//13.10.2013 GPS

function barcode_scan(_host,_ventana_barcode,_campo_barcode){
  
  //setTimeout(function() {
    // if pic2shop not installed yet, go to App Store or Google Play
  //  window.location = "http://itunes.com/apps/pic2shop";
  //}, 25);
  
  //LEER CODIGO CON PIC2SHOP (ACE OK, GALAXY NOTE2 abre url en otro TAB)
  window.location="pic2shop://scan?callback=http%3A//"+_host+"/aplicacion/window.php?ventana="+_ventana_barcode+"%26"+_campo_barcode+"%3DEAN";
	
  //LEER CODIGO CON ZXING (BARCODE SCANNER [Ace OK, Galaxy Note2 OK] o SCANNER DE CODIGOS DE BARRA (QR)[Galaxy Note2 OK])
  //window.location="zxing://scan/?ret=http%3A%2F%2F"+_host+"%2Faplicacion%2Fwindow.php?ventana="+_ventana_barcode+"%26"+_campo_barcode+"="+"%7BCODE%7D";

  //&SCAN_FORMATS=UPC_A,EAN_13 (PARA DEFINIR QUE TIPO DE CODIGOS LEER)
	
} 

//68.//////////////////////////////////////////////////////////////////////////////////////////////// 

//69.//////////////////////////////////////////////////////////////////////////////////////////////// 
//LOGICA: chequea si una URL existe o no (SE USA?)
//13.10.2013 GPS

function UrlExists(_url){
  var _http = new XMLHttpRequest();
  _http.open('HEAD', _url, false);
  _http.send();
  return _http.status!=404;
}

//69.//////////////////////////////////////////////////////////////////////////////////////////////// 

//70.//////////////////////////////////////////////////////////////////////////////////////////////// 
//DOM: mostrar loader en aplicación móvil
//13.10.2013 GPS

function mostrar_loader(_mensaje){
  
  //alert("MOSTRAR LOADER");
  _theme = "a";
  _msgText = _mensaje;
  _textVisible = true;
  _textonly = false;
  _html = "";

  $.mobile.loading( "show", {
    text: _msgText,
    textVisible: _textVisible,
    theme: _theme,
    textonly: _textonly,
    html: _html			
  });
	
}

//70.//////////////////////////////////////////////////////////////////////////////////////////////// 

//71.//////////////////////////////////////////////////////////////////////////////////////////////// 
//DOM: ocultar loader en aplicación móvil
//13.10.2013 GPS

function ocultar_loader(){
  $.mobile.loading("hide");
}

//71.//////////////////////////////////////////////////////////////////////////////////////////////// 

//72.//////////////////////////////////////////////////////////////////////////////////////////////// 
//LOGICA: calcular dias de diferencia entre 2 fechas
//13.10.2013 GPS

function dias_entre_fechas(_date1, _date2){

  //Obtener 1 día en milisegundos
  var _one_day=1000*60*60*24;

  //Convertir ambas fehcas a milisegundos
  var _date1_ms = _date1.getTime();
  var _date2_ms = _date2.getTime();

  //Calcular la diferencia en milisegundos
  var _difference_ms = _date2_ms - _date1_ms;
    
  //Convertir en días
  var _diffDays = Math.floor(_difference_ms/_one_day); 

  return _diffDays;
  
}

//72.//////////////////////////////////////////////////////////////////////////////////////////////// 

//73.//////////////////////////////////////////////////////////////////////////////////////////////// 
//DOM: en lista básica móvil cambiar el color del botón binario entre verde y rojo
//13.10.2013 GPS

 function verde_o_rojo(_Dom,_i){

 if(document.getElementById('SioNo'+_i).value=='0'){
   //VERDE
	document.getElementById(_Dom.id).style.background="#72C68B no-repeat right top";
	document.getElementById('SioNo'+_i).value='1';
    _campo = '#'+_i;
    $(_campo).find(".ui-icon").removeClass("ui-icon-grid").addClass("ui-icon-check");
  }

  else if(document.getElementById('SioNo'+_i).value=='1'){
    //ROJO
	document.getElementById(_Dom.id).style.background="#CB5151 no-repeat right top";
	document.getElementById('SioNo'+_i).value='2';
    _campo = '#'+_i;
    $(_campo).find(".ui-icon").removeClass("ui-icon-check").addClass("ui-icon-delete");
  }
  
  else{
    //NARANJO
	document.getElementById(_Dom.id).style.background="#F0ECE6 no-repeat right top";
	document.getElementById('SioNo'+_i).value='0';
	_campo = '#'+_i;
	$(_campo).find(".ui-icon").removeClass("ui-icon-delete").addClass("ui-icon-grid");
  }
	  
}
	
//72.//////////////////////////////////////////////////////////////////////////////////////////////// 

//73.//////////////////////////////////////////////////////////////////////////////////////////////// 
//DOM: en lista básica móvil cambiar el color del botón entre verde, rojo y naranjo
//13.10.2013 GPS

function opciones_ckeck(_Dom,_i,_campo,_funcionalidad){
var verde = ''; 
var neutro = ''; 
var rojo = ''; 
var naranjo = ''; 

 if(_funcionalidad==1){
	if(document.getElementById('SioNo'+_i).value=='1'){
		rojo = 1;
	}else{
		verde = 1;
	}	
 }else if(_funcionalidad==2){
	if(document.getElementById('SioNo'+_i).value=='0'){
		verde = 1;
	}else{
		neutro = 1
	}
	
 } else if(_funcionalidad==3){
	if(document.getElementById('SioNo'+_i).value=='0'){
		verde = 1;
	}else if(document.getElementById('SioNo'+_i).value=='1'){
		rojo = 1;
	}else{
		neutro = 1;
	}
	
 }else if(_funcionalidad==4){
	if(document.getElementById('SioNo'+_i).value=='0'){
		verde = 1;
	}else if(document.getElementById('SioNo'+_i).value=='1'){
		rojo = 1;
	}else if(document.getElementById('SioNo'+_i).value=='2'){
		naranjo = 1;
	}else{
		neutro = 1;
	}
	
 }
 
 if(neutro==1){
	//neutro
	document.getElementById(_Dom.id).style.background="#F0ECE6 no-repeat right top";
	document.getElementById('SioNo'+_i).value='0';
	_campo = '#'+_i;
	$(_campo).find(".ui-icon").removeClass("ui-icon-delete").addClass("ui-icon-grid");
 }
 
 if(verde==1){
	//VERDE
	document.getElementById(_Dom.id).style.background="#72C68B no-repeat right top";
	document.getElementById('SioNo'+_i).value='1';
    _campo = '#'+_i;
    $(_campo).find(".ui-icon").removeClass("ui-icon-grid").addClass("ui-icon-check");
 }
 
	if(rojo==1){
		document.getElementById(_Dom.id).style.background="#CB5151 no-repeat right top";
		document.getElementById('SioNo'+_i).value='2';
		_campo = '#'+_i;
		$(_campo).find(".ui-icon").removeClass("ui-icon-check").addClass("ui-icon-delete");
	}	

	if(naranjo==1){
		document.getElementById(_Dom.id).style.background="#FF9900 no-repeat right top";
		document.getElementById('SioNo'+_i).value='3';
		_campo = '#'+_i;
		$(_campo).find(".ui-icon").removeClass("ui-icon-delete").addClass("ui-icon-minus");
		
	}	
 
 
	  
}
	
//73.//////////////////////////////////////////////////////////////////////////////////////////////// 

//74.//////////////////////////////////////////////////////////////////////////////////////////////// 

//75.//////////////////////////////////////////////////////////////////////////////////////////////// 
//LOGICA AUXILIAR: reemplaza un elemento dentro de un string por otro (se usa en informe promociones)
//20.03.2014 GPS

//REEMPLAZA UN ELEMENTO DE UN STRING POR OTRO (SE USA EN INFORME PROMOCIONES) 
function ReplaceAll(_strValue,_strFind,_strReplace){

  if(_strFind=="undefined" || _strFind.length<=0){
    return _strValue;
  }
  _strValue = _strValue.replace(_strFind,_strReplace);
	
  if(_strValue.indexOf(_strFind)>= 0){
    _strValue = ReplaceAll(_strValue,_strFind,_strReplace);
  }
  
return _strValue;
}

//75.//////////////////////////////////////////////////////////////////////////////////////////////// 

//BUSCA POSICION GPS FORMULARIO CHECK IN (DELA)
//function buscarLocaliz(){
//  navigator.geolocation.getCurrentPosition(mostrarLocaliz);
//}

//FORMULARIO CHECK IN (DELA)
//function mostrarLocaliz(_loc){

//  var _tuLatitud = _loc.coords.latitude;
//  var _tuLongitud = _loc.coords.longitude;

//  document.forms["check_inForm"].elements["lat"].value= _tuLatitud;
//  document.forms["check_inForm"].elements["lon"].value= _tuLongitud;
//  document.forms["check_inForm"].elements["id_usuario"].value= document.getElementById("varUser").value;
//  guardar_ficha('NO_ENVIAR','check_inForm','1');
//}


//76.//////////////////////////////////////////////////////////////////////////////////////////////// 
 function base64_encode(data) {
  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
    ac = 0,
    enc = '',
    tmp_arr = [];

  if (!data) {
    return data;
  }

  do { // pack three octets into four hexets
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;

    // use hexets to index into b64, and append result to encoded string
    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join('');

  var r = data.length % 3;

  return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
}
//76.//////////////////////////////////////////////////////////////////////////////////////////////// 


//77.//////////////////////////////////////////////////////////////////////////////////////////////// 
function consultarHeight(){
			var screen = $.mobile.getScreenHeight();
			var header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight()  - 1 : $(".ui-header").outerHeight();
  //alert(header);
  var footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight();
  //alert(footer);
 
   
  var contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height();
  var content = screen - header - footer - contentCurrent;
  return content;

}

function consultarHeight2(){
	return (screen.height);
}

function consultarWidth(){
	return (screen.width);
}
//77.//////////////////////////////////////////////////////////////////////////////////////////////// 