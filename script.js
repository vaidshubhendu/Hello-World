var chatScript = function(){
    var isConnectionEstablished = false;
    // CREATE A REFERENCE TO FIREBASE
    var messagesRef = new Firebase('https://torrid-torch-108.firebaseio.com/');
    // REGISTER DOM ELEMENTS
    var messageField = $('#messageInput');
    var nameField = $('#nameInput');
    var messageList = $('#example-messages');
    // LISTEN FOR KEYPRESS EVENT
    messageField.keypress(function (e) {
        if (e.keyCode == 13) {
            //FIELD VALUES
            var username = nameField.val();
            var message = messageField.val();

            //SAVE DATA TO FIREBASE AND EMPTY FIELD
            messagesRef.push({name:username, text:message});
            messageField.val('');
        }
    });
    // Add a callback that is triggered for each chat message.
    messagesRef.limitToLast(5).on('child_added', function (snapshot) {
        //GET DATA
        var data = snapshot.val();
        var username = data.name || "Anonymous";
        var message = data.text;
        if(!isConnectionEstablished){
            isConnectionEstablished = true;
            $('.loader').remove();
        }
        //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
        if(username === 'Anonymous') var messageElement = $("<li class='isUserClient'>");
        else var messageElement = $("<li class='isNotUserClient'>");
        var nameElement = $("<strong class='example-chat-username'></strong>")
        nameElement.text(username+' : ');
        messageElement.text(message).prepend(nameElement);

        //ADD MESSAGE
        messageList.append(messageElement)

        //SCROLL TO BOTTOM OF MESSAGE LIST
        messageList[0].scrollTop = messageList[0].scrollHeight;
        resizeAndSanitizeText();
    });
};

// INITIALIZE APP
$( window ).ready(function() {
    chatScript();
    $( window ).resize();
});

// RESIZE HEIGHT
$( window ).resize(function() {
    resizeAndSanitizeText();
    var messageList = $('#example-messages');
    var calculateHeight = $('.l-demo-container').outerHeight() - ($('.example-chat-toolbar').outerHeight()+ $('.header').outerHeight() + $('.footer').outerHeight() + 2);
    $('.example-chat-messages').outerHeight(calculateHeight+'px');
    //SCROLL TO BOTTOM OF MESSAGE LIST
    messageList[0].scrollTop = messageList[0].scrollHeight;
});

//SET TEXT ON RESIZE
var resizeAndSanitizeText = function(){
    $('.example-chat-messages li').each(function( index ) {
        if($(this).hasClass('isUserClient')){
            $(this).addClass('speechUser');
        }
        else{
            $(this).addClass('speechNotUser');
        }
    });
};
