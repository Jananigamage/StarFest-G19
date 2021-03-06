$(document).ready(function(){
	setInterval(function(){
		updateUnreadMessageCount();	
	}, 60000);	
	setInterval(function(){
		updateUserChat();			
	}, 5000);
	$(".messages").animate({ 
		scrollTop: $(document).height() 
	}, "fast");		
	$(document).on('click', '.contact', function(){		
		$('.contact').removeClass('active');
		$(this).addClass('active');
		var to_user_id = $(this).data('touserid');
		showUserChat(to_user_id);
		$(".chatMessage").attr('id', 'chatMessage'+to_user_id);
		$(".chatButton").attr('id', 'chatButton'+to_user_id);
	});	
	$(document).on("click", '.submit', function(event) { 
		var to_user_id = $(this).attr('id');
		to_user_id = to_user_id.replace(/chatButton/g, "");
		sendMessage(to_user_id);
	}); 		
}); 
function sendMessage(to_user_id) {
	message = $(".message-input input").val();
	$('.message-input input').val('');
	if($.trim(message) == '') {
		return false;
	}
	$.ajax({
		url:"chat_action.php",
		method:"POST",
		data:{to_user_id:to_user_id, chat_message:message, action:'insert_chat'},
		dataType: "json",
		success:function(response) {
			var resp = $.parseJSON(response);			
			$('#conversation').html(resp.conversation);				
			$(".messages").animate({ scrollTop: $('.messages').height() }, "fast");
		}
	});	
}
function showUserChat(to_user_id){
	$.ajax({
		url:"chat_action.php",
		method:"POST",
		data:{to_user_id:to_user_id, action:'show_chat'},
		dataType: "json",
		success:function(response){
			$('#userSection').html(response.userSection);
			$('#conversation').html(response.conversation);	
			$('#unread_'+to_user_id).html('');
		}
	});
}
function updateUserChat() {
	$('li.contact.active').each(function(){
		var to_user_id = $(this).attr('data-touserid');
		$.ajax({
			url:"chat_action.php",
			method:"POST",
			data:{to_user_id:to_user_id, action:'update_user_chat'},
			dataType: "json",
			success:function(response){				
				$('#conversation').html(response.conversation);			
			}
		});
	});
}
function updateUnreadMessageCount() {
	$('li.contact').each(function(){
		if(!$(this).hasClass('active')) {
			var to_user_id = $(this).attr('data-touserid');
			$.ajax({
				url:"chat_action.php",
				method:"POST",
				data:{to_user_id:to_user_id, action:'update_unread_message'},
				dataType: "json",
				success:function(response){		
					if(response.count) {
						$('#unread_'+to_user_id).html(response.count);	
					}					
				}
			});
		}
	});
}