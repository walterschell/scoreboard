var events;
var max_updates = null;
//max_updates = 2;
var auto_shift_offset = 0; //this is a hack. Pixel aligning tables sux
var col_width = 0;

function update_timestamp()
{
	$Div = $('#timestamp');
	var d = new Date;
	$Div.html(d.toLocaleString());
}
	
function sort_table()
{
	$Table = $('#scoretable');
	$Table.css({position:'relative',height:$Table.height(),display:'block', width:'100%'});
	var $Tr = $('#scoretable>tbody>tr');
	$Tr.children('td').wrapInner('<div class="animate_hack"></div>');
	var base_offset;
	var row_height;
	var table_height;
	
	$Tr.each(function(index, element){
		$(element).find('.animate_hack').each(function(index2, div) {
		  
		//$(div).css('width',$(div).width());});
		$(div).css('width', col_width-9); });
		var Div = $(element).find('.animate_hack')[0];
		
		if (Div ==null)
		{
			console.log('Div is NULL');
		}
		var iY = $(Div).offset().top;
		//var iY = $(element).children('td > div:first-child').offset().top;
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
	var shift_offset = base_offset - $('#scoretable>thead').offset().top;
	shift_offset = base_offset - row_height + auto_shift_offset;
	console.log('Shift Offset is :' + shift_offset);
	$Tr.tsort('td.Total', {'order':'desc'}).each(function(index, element){
		var $Element = $(element);
		//var iFr = $.data(element,'h') +base_offset ;
		var iFr = $.data(element,'h') - shift_offset;
		var iTo = (index * row_height) + base_offset - shift_offset;
		console.log('Index: '+ index +' From: ' + iFr + ' To: ' + iTo);
		//$Element.children('td').wrapInner('<div></div>').children('div').slideUp();
		//$Element.children('td').wrapInner('<div></div>').children('div').css({position:'absolute', top:iFr}).animate({top:iTo}, 500);
				//var auto_adjust_amt = 0;
				$Element.children('td').children('div').css({position:'absolute', top:iFr}).animate({top:iTo}, 500,} );
			  //console.log('Audo adjust amt: ' + auto_adjust_amt);
			  //auto_shift_offset += auto_adjust_amt;
			  console.log('Auto shfit offset: ' + auto_shift_offset);
		//$Element.children('td').wrapInner('<div></div>').children('div').css({top:iFr}).animate({top:iTo}, 500);
		
	});
	update_timestamp();
}

function update_scores()
{
	$.getJSON('./scores.json', function(data){
		$.each(data, function(key, val) {
			$tr = $('#' + key);
			$tr.empty();
			$td = $('<td class="Handle">' + key + '</td>');
			$tr.append($td);
			$.each(val, function(index, val2) {
				$td = $('<td class="'+events[index]+'">&nbsp</td>');
				if (val2 != null)
				{
					$td.html(val2);
				}
				$tr.append($td);
			  
			});
		});
		sort_table();
	});
	
	if (max_updates > 0)
	{
		setTimeout(update_scores, 2000);
		max_updates -= 1;
	}
	else if (max_updates == null)
	{
		setTimeout(update_scores, 2000);
	}
}


$(document).ready(
	function() 
	{
		$('#FOO').html('Hurray!');	

		$.getJSON('./events.json', function(data) {
			events = data;
			$.each(data, function(index, val) {
				
				$('#scoretable>thead>tr').append($('<th>' + val + '</th>'));
				var num_headers = $('th').length;
				var new_width = $(document).width() / num_headers;
				console.log('Setting width on '+num_headers +' headers to: ' + new_width);
				$('th').width(new_width);
				col_width = new_width;
			 });
		

			
			
		});
		
		$.getJSON('./scores.json', function(data) {
			$.each(data, function(key, val) {
				
				
				
			  $row = $('<tr id="' + key +'"></tr>');
			  $td = $('<td class="Handle">' + key + '</td>');
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
