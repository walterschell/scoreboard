var events;
//var max_updates = 5;

function sort_table()
{
	//$Table = $('#scoretable');
	//$Table.css({position:'relative',height:$Table.height(),display:'block'});
	var $Tr = $('#scoretable>tbody>tr');
	//$Tr.children('td').wrapInner('<div></div>');
	var base_offset;
	var row_height;
	$Tr.each(function(index, element){
		var iY = $(element).offset().top;
		//var iY = $(element).position().top;
		
		$.data(element,'h', iY);
		if (index == 0) 
		{
			
			base_offset = $(element).offset().top;
			console.log('Base offset is: ' + base_offset);
		}
		if (index == 1) row_height = iY - base_offset;
		//if (index == 1) row_height = iY;
		
	});
	$Tr.tsort('td.Total', {'order':'desc'}).each(function(index, element){
		var $Element = $(element);
		//var iFr = $.data(element,'h') +base_offset ;
		var iFr = $.data(element,'h');
		var iTo = (index * row_height) + base_offset;
		console.log('Index: '+ index +' From: ' + iFr + ' To: ' + iTo);
		//$Element.children('td').wrapInner('<div></div>').children('div').slideUp();
		$Element.children('td').wrapInner('<div></div>').children('div').css({position:'absolute', top:iFr}).animate({top:iTo}, 500);
		//$Element.children('td').wrapInner('<div></div>').children('div').css({top:iFr}).animate({top:iTo}, 500);
	});
}

function update_scores()
{
	$.getJSON('./scores.json', function(data){
		$.each(data, function(key, val) {
			$tr = $('#' + key);
			$tr.empty();
			$td = $('<td>' + key + '</td>');
			$tr.append($td);
			$.each(val, function(index, val2) {
				$td = $('<td class="'+events[index]+'"></td>');
				if (val2 != null)
				{
					$td.html(val2);
				}
				$tr.append($td);
			  
			});
		});
		sort_table();
	});
	
//	if (max_updates > 0)
//	{
		setTimeout(update_scores, 2000);
	//	max_updates -= 1;
	//}
}


$(document).ready(
	function() 
	{
		$('#FOO').html('Hurray!');	
		
		$.getJSON('./events.json', function(data) {
			events = data;
			$.each(data, function(index, val) {
				$('#scoretable>thead>tr').append($('<th>' + val + '</th>'));
			 });
			
			
			
		});
		$.getJSON('./scores.json', function(data) {
			$.each(data, function(key, val) {
				
				
				
			  $row = $('<tr id="' + key +'"></tr>');
			  $td = $('<td>' + key + '</td>');
			  $row.append($td);
			  $.each(val, function(index, val2) {
			  	$td = $('<td class="'+events[index]+'"></td>');
			  	if (val2 != null)
			  	{
			  		$td.html(val2);
			  	}
			  	
				
				$row.append($td);
			  });
			  $('#scoretable>tbody').append($row);
			});	
			sort_table();		
		});
		
		setTimeout(update_scores, 2000);
	});
