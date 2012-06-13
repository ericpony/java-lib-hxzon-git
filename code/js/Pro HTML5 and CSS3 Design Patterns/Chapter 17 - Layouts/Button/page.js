$(document).ready(function(e){
	$('#form1').submit(function(e){
		if(!confirm('Are you sure?')){
			e.preventDefault();
		}
	});
	$('#message').click(function(e){
		alert('Hi There');
	});
	$('#button').click(function(e){
		alert('Hi There');
	});
	$('#link').click(function(e){
		if(!confirm('Jump here?')){
			e.preventDefault();
		}
	});
	$('#change').click(function(e){
		try{
			var result = prompt('Enter content:',  $(this).text() );
			if ( result ) $(this).text( result ); 
		}catch(ex){ e.preventDefault(); }
	});
	$('#submit4').click(function(e){
		$('#form1').submit();
	});
	$('#reset2').click(function(e){
		$('#form1').reset();
	});
});