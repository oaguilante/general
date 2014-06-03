
function f_open_window_max(aURL, aWinName) {
   var wOpen;
   var sOptions;

   sOptions = 'status=yes,menubar=no,scrollbars=yes,resizable=yes,toolbar=no,location=no';
   sOptions = sOptions + ',width=' + (screen.availWidth - 10).toString();
   sOptions = sOptions + ',height=' + (screen.availHeight - 122).toString();
   sOptions = sOptions + ',screenX=0,screenY=0,left=0,top=0';

   wOpen = window.open( '', aWinName, sOptions );
   wOpen.location = aURL;
   wOpen.focus();
   wOpen.moveTo(0,0);
   wOpen.resizeTo( screen.availWidth, screen.availHeight );
   return wOpen;
}

function URLEncode(url) {
   
  var SAFECHARS = "0123456789" +			// Numeric
	          "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +	// Alphabetic
		  "abcdefghijklmnopqrstuvwxyz" +
		  "-_.!~*'()";				// RFC2396 Mark characters
  var HEX = "0123456789ABCDEF";
  var plaintext = url;
  var encoded = "";

  for (var i = 0; i < plaintext.length; i++ ) {
    var ch = plaintext.charAt(i);
    if (ch == " ") {
      encoded += "+";        // x-www-urlencoded, rather than %20
    }
    else if (SAFECHARS.indexOf(ch) != -1) {
      encoded += ch;
    }
    else {
      var charCode = ch.charCodeAt(0);
      if (charCode > 255) {
        alert( "Unicode Character '" + ch + "' cannot be encoded using standard URL encoding.\n" + "(URL encoding only supports 8-bit characters.)\n" + "A space (+) will be substituted." );
        encoded += "+";
      } 
      else {
        encoded += "%";
        encoded += HEX.charAt((charCode >> 4) & 0xF);
        encoded += HEX.charAt(charCode & 0xF);
      }
    }
  }

  return encoded;
};

function URLDecode(url) {
  
  var HEXCHARS = "0123456789ABCDEFabcdef"; 
  var encoded = url;
  var plaintext = "";
  var i = 0;

  while (i < encoded.length) {
    var ch = encoded.charAt(i);
    if (ch == "+") {
      plaintext += " ";
      i++;
    }
    else if (ch == "%") {
      if (i < (encoded.length-2) && HEXCHARS.indexOf(encoded.charAt(i+1)) != -1 && HEXCHARS.indexOf(encoded.charAt(i+2)) != -1 ) {
        plaintext += unescape( encoded.substr(i,3) );
	i += 3;
      } 
      else {
        alert( 'Bad escape combination near ...' + encoded.substr(i) );
	plaintext += "%[ERROR]";
	i++;
      }
    } 
    else {
      plaintext += ch;
      i++;
    }
  } 
   
  return plaintext;
};

function abrirVentana(mensaje) {
  var ventana = alert(mensaje);
}

function login_empresa(ventana_origen,mobile){

  //alert("LOGIN EMPRESA: "+mobile);
 
    mantencion=false;
  
    if(mantencion==false){
      if(document.loginFormEmpresa.tx_empresa.value=='' || document.loginFormEmpresa.tx_usuario.value=='' || document.loginFormEmpresa.tx_contrasena.value=='') {
	    alert("¡Debe ingresar usuario y contraseña!");
      }
      else {
        if(ventana_origen=="INDEX")
          path = '../';
        else if(ventana_origen=="LOGIN")
	      path = '';
		  //alert('a');
		  //mostrar_loader("Ingresando al sistema");	
		  //document.getElementById('btnEntrar').innerHTML = '<img src="images/cargando.gif" style="width:20px; height:15px;"></img>';
		  //ELIMINA ATRIBUTO ONCLICK CUANDO ENVIA LOS PARAMETROS.
		  //document.getElementById('btnEntrar').removeAttribute('onclick');
        
		  phonegap=document.loginFormEmpresa.phonegap.value;
	//	alert(phonegap);
		  if(phonegap==false)
		    loadurl_empresa(path+'autentificacion/login.php',mobile);
		  else if(phonegap==true)
		   loadurl_empresa("http://192.168.1.183/angular/autentificacion/login.php",mobile);
	//	$.mobile.changePage('file:///android_asset/www/principal/principal.html',{transition: 'none'});
        //location.href='file:///android_asset/www/principal/principal.html';
      }
    }
    else{
      alert("Estimado usuario, hoy no habra servicio debido a que la aplicacion esta siendo actualizada a una nueva version. Rogamos disculpar las molestias.");
    }
  
}


function login_demo() {

  //alert("LOGIN DEMO");	
  loadurl_demo('../autentificacion/login.php');
	  
}

function login_persona() {

//alert("LOGIN PERSONA");

  if(document.loginFormPersona.tx_usuario.value=='' || document.loginFormPersona.tx_contrasena.value=='') {
    abrirVentana("¡Debe ingresar usuario y contraseña!");
  }
  else {
    loadurl('../autentificacion/action_login.php');
    //loadurl('../autentificacion/action_login_persona.php');
  }
}


function registro() {

//alert("REGISTRO");

  if(document.form1.nombre.value=='Nombre:' || document.form1.apellidos.value=='Apellidos:' || document.form1.mail.value=='Correo Electronico:') {
    abrirVentana("Debes completar todos los campos para poder registrarte.");
  }
  else {
    if(cmail(document.form1.mail.value)==false)
      abrirVentana("Ingresa un mail valido.");
    else
      loadurl_registro_usuarios('../registro/action_registro.php');
  }

}

function loadurl(dest) {

 try {
   //object detection for any browser.
   xmlhttp = window.XMLHttpRequest?new XMLHttpRequest():
   new ActiveXObject("Microsoft.XMLHTTP");
 }
 catch (e) {
   //browser doesn't support ajax.
 }
 
 //triggers an event
 xmlhttp.onreadystatechange = triggered;
 
 //takes in the HTTP method and url.
 xmlhttp.open("POST", dest, true);
 
 // send the request. if this is a POST request we would have sent post variables: send("name=aleem&gender=male)
 xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

 xmlhttp.send("tx_usuario="+URLEncode(document.loginFormPersona.tx_usuario.value)+"&tx_contrasena="+URLEncode(document.loginFormPersona.tx_contrasena.value));

//var xmlDoc = str2xml("<root></root>"); 
//alert(xmlDoc.childNodes.length); 
//alert("Xml string is:" + xml2str(xmlDoc));

}

function loadurl_empresa(dest,mobile) {

 try {
   //object detection for any browser.
   xmlhttp = window.XMLHttpRequest?new XMLHttpRequest():
   new ActiveXObject("Microsoft.XMLHTTP");
 }
 catch (e) {
   //browser doesn't support ajax.
 }
 
 //triggers an event
 xmlhttp.onreadystatechange = triggered_empresa;
 
 //takes in the HTTP method and url.
 xmlhttp.open("POST", dest, true);
 
 // send the request. if this is a POST request we would have sent post variables: send("name=aleem&gender=male)
 xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
 xmlhttp.send("tx_empresa="+URLEncode(document.loginFormEmpresa.tx_empresa.value)+"&tx_usuario="+URLEncode(document.loginFormEmpresa.tx_usuario.value)+"&tx_contrasena="+URLEncode(document.loginFormEmpresa.tx_contrasena.value)+"&mobile="+URLEncode(mobile)+"&tx_phonegap="+URLEncode(document.loginFormEmpresa.tx_phonegap.value));

}

function loadurl_demo(dest) {

 try {
   //object detection for any browser.
   xmlhttp = window.XMLHttpRequest?new XMLHttpRequest():
   new ActiveXObject("Microsoft.XMLHTTP");
 }
 catch (e) {
   //browser doesn't support ajax.
 }
 
 //triggers an event
 xmlhttp.onreadystatechange = triggered_demo;
 
 //takes in the HTTP method and url.
 xmlhttp.open("POST", dest, true);
 
 // send the request. if this is a POST request we would have sent post variables: send("name=aleem&gender=male)
 xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 
 xmlhttp.send("tx_empresa=demo&tx_usuario=demo&tx_contrasena=123");

}

function loadurl_registro_usuarios(dest) {

 try {
   //object detection for any browser.
   xmlhttp = window.XMLHttpRequest?new XMLHttpRequest():
   new ActiveXObject("Microsoft.XMLHTTP");
 }
 catch (e) {
   //browser doesn't support ajax.
 }
 
 //triggers an event
 xmlhttp.onreadystatechange = triggered;
 
 //takes in the HTTP method and url.
 xmlhttp.open("POST", dest, true);
 
 // send the request. if this is a POST request we would have sent post variables: send("name=aleem&gender=male)
 xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 xmlhttp.send("tx_nombre="+URLEncode(document.form1.nombre.value)+"&tx_apellidos="+URLEncode(document.form1.apellidos.value)+"&tx_mail="+URLEncode(document.form1.mail.value));

}

function triggered() {
  //readyState codes: 0=Uninitialised 1=Loading 2=Loaded 3=Interactive 4=Completed
  if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {

    data0 = xmlhttp.responseText;
    data1=data0.split("^");

//alert("CHA");

    data=data1[0];
    host=data1[1]; 
    nombre_ventana=data1[2]; 
    nueva=data1[3];   

    if(data!="OK"){
      alert(URLDecode(data));

      //FORMULARIO REGISTRO

      document.form1.nombre.value = "Nombre:";
      document.form1.apellidos.value = "Apellidos:";
      document.form1.mail.value = "Correo Electr\xf3nico:";
    }
    else {
      //document.loginForm.tx_empresa.value = "";
      document.loginFormPersona.tx_usuario.value = "";
      document.loginFormPersona.tx_contrasena.value = "";

      //VALIDAR QUE SOLO SE HAGA UN LOGIN DESDE UNA INSTANCIA DE NAVEGADOR. SI SE HACE MAS DE UNO SE SOBREESCRIBEN LAS VARIABLES DE SESION.
      //if(nueva=="si" || nueva=="si ") {
        doble_slash = "/"+"/";
        //myPage = f_open_window_max('http:'+doble_slash+host+'/principal/principal.php',nombre_ventana);

        window.location='http:'+doble_slash+host+'/principal/principal.php';

      //}
      //else {
      //  alert("Se encuentra abierta una sesión iniciada desde esta ventana.\nAbra una nueva ventana si desea ingresar al sistema.");
      //}

    }
  }
}

function triggered_empresa() {
  //readyState codes: 0=Uninitialised 1=Loading 2=Loaded 3=Interactive 4=Completed
  if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
	
    usar_ssl = "N";
  
    data0 = xmlhttp.responseText;
    data1=data0.split("^");

    data=data1[0];
    host=data1[1]; 
    nombre_ventana=data1[2]; 
    nueva=data1[3]; 
	mobile=data1[4]; 
    token_sesion=data1[5];
    
    //alert(token_sesion);
	if(localStorage.getItem("url_servidor")!=null){ 
    window.sessionStorage.setItem("token_sesion",token_sesion);
     }
	//alert(host);
	
    if(data!="OK")
      alert_pro(URLDecode(data));
    else {
	
	  ultima_aplicacion = document.loginFormEmpresa.tx_empresa.value;
	  ultimo_usuario = document.loginFormEmpresa.tx_usuario.value;
	
      document.loginFormEmpresa.tx_empresa.value = "";
      document.loginFormEmpresa.tx_usuario.value = "";
      document.loginFormEmpresa.tx_contrasena.value = "";

      //VALIDAR QUE SOLO SE HAGA UN LOGIN DESDE UNA INSTANCIA DE NAVEGADOR. SI SE HACE MAS DE UNO SE SOBREESCRIBEN LAS VARIABLES DE SESION.
      //if(nueva=="si" || nueva=="si ") {
        doble_slash = "/"+"/";
        //myPage = f_open_window_max('http:'+doble_slash+host+'/principal/principal.php',nombre_ventana);

		if(usar_ssl=="S")
		  ssl = "s";
		else
		  ssl = "";
		
		
		//GUARDAR LOCALMENTE EL ULTIMO USUARIO LOGEADO PARA SUGERIRLO EN SIGUIENTE LOGIN
		guardar_usuario(ultima_aplicacion,ultimo_usuario);
		
		phonegap=document.loginFormEmpresa.phonegap.value;
		
		if(phonegap==false)
		  window.location='http'+ssl+':'+doble_slash+host+'/principal/principal.php';
	    else if(phonegap==true)
		  //window.location='file:///android_asset/www/principal/principal.html';
		  $.mobile.changePage('file:///android_asset/www/principal/principal.html',{transition: 'none'});
		  
      //}
      //else {
      //  alert("Se encuentra abierta una sesión iniciada desde esta ventana.\nAbra una nueva ventana si desea ingresar al sistema.");
      //}

    }
	//document.getElementById('btnEntrar').innerHTML = 'Entrar';
    //alert("TRIGGERED EMPRESA");
	//AGREGA ATRIBUTO UNA VEZ QUE TIENE LA RESPUESTA
	//document.getElementById('btnEntrar').setAttribute("onclick","login_empresa('INDEX')");
  }
}


function triggered_demo() {
  //readyState codes: 0=Uninitialised 1=Loading 2=Loaded 3=Interactive 4=Completed
  if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
 
    usar_ssl = "N";
  
    data0 = xmlhttp.responseText;
    data1=data0.split("^");

    data=data1[0];
    host=data1[1]; 
    nombre_ventana=data1[2]; 
    nueva=data1[3]; 
	
	//alert(host);
	
    if(data!="OK")
      alert_pro(URLDecode(data));
    else {
      //VALIDAR QUE SOLO SE HAGA UN LOGIN DESDE UNA INSTANCIA DE NAVEGADOR. SI SE HACE MAS DE UNO SE SOBREESCRIBEN LAS VARIABLES DE SESION.
      //if(nueva=="si" || nueva=="si ") {
        doble_slash = "/"+"/";
        //myPage = f_open_window_max('http:'+doble_slash+host+'/principal/principal.php',nombre_ventana);

		if(usar_ssl=="S")
		  ssl = "s";
		else
		  ssl = "";
		
        window.location='http'+ssl+':'+doble_slash+host+'/principal/principal.php';
		  
      //}
      //else {
      //  alert("Se encuentra abierta una sesión iniciada desde esta ventana.\nAbra una nueva ventana si desea ingresar al sistema.");
      //}

    }
  }
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

function cmail(texto) {
  var regla=/^[\w-_\.]+@[\w]{1}[\w-_\.]*[\w]{1}[\.]{1}[\w]{2,3}$/gi
  return regla.test(texto);
}

function comprobar() {
  var cadena=document.formy.tx_email_contacto.value;
    if((document.formy.tx_nombre.value == "" ) || (document.formy.tx_apellidos.value == "") || (document.formy.tx_email_contacto.value == "") || (document.formy.tx_comentarios.value == "")) {
      window.alert('Por favor, rellene todos los campos.');
      return false;
    }  
    if (cmail(cadena)==false) { 
      window.alert('Introduzca un Mail correcto.');
      return false;
    } 
  return true ;
} 

function str2xml(strXML) {
 
  if (window.ActiveXObject) { 
    var doc=new ActiveXObject("Microsoft.XMLDOM"); 
    doc.async="false"; 
    doc.loadXML(strXML); 
    } 
  // code for Mozilla, Firefox, Opera, etc. 
  else { 
    var parser=new DOMParser(); 
    var doc=parser.parseFromString(strXML,"text/xml"); 
  }

// documentElement always represents the root node 
return doc; 
}

function xml2str(xmlDom) { 
  var strs = null; 
  var doc = xmlDom.documentElement; 

  if(doc.xml == undefined) { 
    strs = (new XMLSerializer()).serializeToString(xmlDom); 
  }
  else 
    strs = doc.xml; 
    
  return strs; 
} 

function alert_pro(mensaje) { 

  //alert('ALERT_PRO');

  //MOSTRAR EL MENSAJE DEVUELTO POR EL SERVER
  alert_box_type = 0;

  //ALERT COMO VENTANA
  if(alert_box_type==0)
    alert(URLDecode(mensaje));
  //ALERT COMO DIV CON FONDO NEGRO
  else if(alert_box_type==1)     
    showPopup('popup',URLDecode(mensaje),'ALERT');
	  
}  

//LOCALSTORAGE////////////////////////////////////////////////////

function guardar_usuario(aplicacion,usuario){
  window.localStorage.ultima_aplicacion = aplicacion;
  window.localStorage.ultimo_usuario = usuario;
}

function cargar_ultimo_usuario(){	
  if(window.localStorage.ultimo_usuario!=null){
    document.forms["loginFormEmpresa"].elements["tx_usuario"].value = window.localStorage.ultimo_usuario;
  }
}

function cargar_ultima_aplicacion(){	
  if(window.localStorage.ultima_aplicacion!=null){
    document.forms["loginFormEmpresa"].elements["tx_empresa"].value = window.localStorage.ultima_aplicacion;
  }
}


function Olvidopass(){
var strMsgError = '';	
	if(document.getElementById('tx_usuario').value=='' || document.getElementById('tx_usuario').value=='Mail:'){
		strMsgError += 'Debe ingresar usuario';
		document.getElementById('tx_usuario').focus();
	}
		if ( strMsgError != '' ){
		alert( strMsgError );
		return false;		
	}
	else
	{
			
			Loadreinicio('http://192.168.1.183/angular/aplicacion/BusinessLogic/ConsultaExiste.php','Consulta');
	}

}

function Loadreinicio(Destino,TipoIngreso){
 try {
   //object detection for any browser.
   xmlhttp = window.XMLHttpRequest?new XMLHttpRequest():
   new ActiveXObject("Microsoft.XMLHTTP");
 }
 catch (e) {
   //browser doesn't support ajax.
 }
 xmlhttp.onreadystatechange = Retornofn;
 xmlhttp.open("POST", Destino, true);
 xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 xmlhttp.send("txMail="+URLEncode(document.getElementById('tx_usuario').value)+"&proceso="+TipoIngreso);
}




function Retornofn() {

  if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {

    data = xmlhttp.responseText.split("@@");
	
	document.getElementById('hddIdUser').value=data[1];
	document.getElementById('hddEmail').value=data[2];
	if(data[0]==0){
		alert('Usuario inexistente');
		document.getElementById('tx_usuario').value = '';
		document.getElementById('tx_usuario').focus();
	}else if(data[0]==1){
		//alert(data[1])
		document.getElementById('hdd_Passcode').value = '%%%';
		CargandoCodigo();
		LoadreMail('http://192.168.1.183/angular/aplicacion/BusinessLogic/ConsultaExiste.php','Mail',data[1]);
		
	}else if(data[0]>=2){
		alert('Hay mas de un usuario con este mail, favor introducir mail completo');
		document.getElementById('tx_usuario').focus();
	}	 
    
  }

}


function LoadreMail(Destino,TipoIngreso,data){
 try {
   //object detection for any browser.
   xmlhttp = window.XMLHttpRequest?new XMLHttpRequest():
   new ActiveXObject("Microsoft.XMLHTTP");
 }
 catch (e) {
   //browser doesn't support ajax.
 }
 xmlhttp.onreadystatechange = ReturnMail;
 xmlhttp.open("POST", Destino, true);
 xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 xmlhttp.send("txMail="+URLEncode(document.getElementById('tx_usuario').value)+"&proceso="+TipoIngreso+"&data="+data);
}


function ReturnMail() {

  if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200 || xmlhttp.status == 199)) {
	data = xmlhttp.responseText;
	//alert(data)
	
	document.getElementById('hdd_Passcode').value=data;
  }
  
} 

function CargandoCodigo(){
if(document.getElementById('hdd_nativa').value==1){
document.getElementById('logoPrincipal').style.display="none";
}
var Email = document.getElementById('hddEmail').value;
document.getElementById('pdata').innerHTML='Acabamos de enviar un c&oacute;digo de validaci&oacute;n al correo electr&oacute;nico <b>'+Email+'</b><br><br>Ingrese el c&oacute;digo a continuaci&oacute;n para seguir con el proceso de recuperaci&oacute;n de contrase&ntilde;a y/o desbloqueo de cuenta:';
document.getElementById('dvLogin').style.display = 'none';
document.getElementById('dvCodigoPass').style.display = 'block';

}


function VerificarCodigo(){
	var codigoentregado = document.getElementById('hdd_Passcode').value;
	var codigorescatado = document.getElementById('tx_codigo').value;
	if(codigoentregado == codigorescatado)
	{
		document.getElementById('pdata').innerHTML='Ingresa tu nueva contrase\xf1a en ambos campos para finalizar el proceso:';
		document.getElementById('dvCodigoPass').style.display = 'none';
		document.getElementById('dvcambiopass').style.display = 'block';
	}
	else
	{
		 alert('C\xf3digo incorrecto');
		 document.getElementById('tx_codigo').value='';
		 document.getElementById('tx_codigo').focus();
	}
	
}

function ingresoPass(){
var primera = document.getElementById('tx_primerapass').value;
var segunda = document.getElementById('tx_segundapass').value;
var strMsgError = '';
	if(primera=='Contraseña:' || primera==''){
		strMsgError += 'Debe ingresar contrase\xf1a';
	}else{
		if(primera.length<6)
		{
			strMsgError += 'Contrase\xf1a debe tener al menos 6 caracteres';
		}else
		{
				if(primera!=segunda){
					strMsgError += 'Contrase\xf1as no coinciden';
				}
		}
	}	
	
	if ( strMsgError != '' ){
		alert( strMsgError );
		return false;		
	}
	else
	{
			LoadCambioPass('http://192.168.1.183/angular/aplicacion/BusinessLogic/ConsultaExiste.php','CambioPass');
	}

}


function LoadCambioPass(Destino,TipoIngreso){
 try {
   //object detection for any browser.
   xmlhttp = window.XMLHttpRequest?new XMLHttpRequest():
   new ActiveXObject("Microsoft.XMLHTTP");
 }
 catch (e) {
   //browser doesn't support ajax.
 }
 xmlhttp.onreadystatechange = RetornoPass;
 xmlhttp.open("POST", Destino, true);
 xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
 xmlhttp.send("Password="+URLEncode(document.getElementById('tx_primerapass').value)+"&code="+document.getElementById('hddIdUser').value+"&proceso="+TipoIngreso);
}




function RetornoPass() {
  if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {

    data = xmlhttp.responseText;
	if(data=='OK'){
		alert('Contrase\xf1a guardada correctamente');
		
		if(document.getElementById('hdd_nativa').value!=1){
			document.getElementById('pdata').innerHTML='Ingresa tu correo electr&oacute;nico y contrase&ntilde;a para ingresar:';
		}else{
		var logo = document.getElementById('hddlogo').value;
		document.getElementById('logoPrincipal').style.display="block";
		document.getElementById('pdata').innerHTML='';
		}
		document.getElementById('dvLogin').style.display = 'block';
		document.getElementById('dvCodigoPass').style.display = 'none';
		document.getElementById('dvcambiopass').style.display = 'none';
		document.getElementById('hdd_Passcode').style.display = '%%%';
		
	}	
    
  }

}