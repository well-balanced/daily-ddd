function createToDoList() {
    var newName = $('#newName').val()
    $.ajax({
        url: '/new',
        type: 'post',
        data: {
            newName
        },
        success: function() {
            window.location.href = "/"
        }
    });
};

function login() {
    var username = $('#login_username').val();
    var password = $('#login_password').val();
    $.ajax({
        url: '/auth/login',
        type: 'post',
        data: {
            username,
            password
        },
        success: function() {
            $('#login').modal("hide");
            location.reload();
        },
        error: function(req) {
            $('.auth-flash-massage').text(req.responseText);
        }
    });
};

function register() {
    var username = $('#register_username').val();
    var password = $('#register_password').val();
    $.ajax({
        url: '/auth/register',
        type: 'post',
        data: {
            username,
            password
        },
        success: function(result) {
            alert(result);
            location.reload();
        },
        error: function(req,status,error) {
            $('.auth-flash-massage').text(req.responseText);
        }
    });
};

function onDelete(event) {
    var parent = $(event.target).parent();
    $.ajax({ 
      url: '/delete', 
      type: 'post', 
      data: {
          task:`${parent.text().trim()}`
        },
    });
    parent.fadeOut('slow',()=>{
        parent.remove();
    });
};

function onChange(event) {
    var grandParent = $(event.target).parent().parent().attr('id');
    var parent = $(event.target).parent();
    if (grandParent === 'tasklist') {
        $.ajax({ 
            url: '/progress', 
            type: 'post', 
            data: {
                task: `${parent.text().trim()}`,
                state: 'progress'
            },
        });
        parent.fadeOut('slow',() => {
            $('#progresslist').append(parent);
            parent.fadeIn();
        });
    } else if (grandParent === 'progresslist') {
        $.ajax({ 
            url: '/done', 
              type: 'post', 
              data: {
                  task:`${parent.text().trim()}`,
                  state:'done'
                },
              });
        parent.fadeOut(() => {
            $('#donelist').append(parent);
            parent.fadeIn();
        });
    }
};


$(function() {
    $('#task').click(() => {
        $.ajax({ 
            url: '/create', 
            type: 'post', 
            data: {
                task: `${$('#enter-task').val()}`,
                state: 'task',
                todoname: `${$('#current').text()}`
            },
        });
        var task = $("<p class='task border rounded text-left'></p>").text($('#enter-task ').val()+' ');

        var del = $("<ion-icon name='trash' class='trash'> </ion-icon>").click((event) => {
          onDelete(event);
        });
        
        var check = $("<ion-icon name='checkmark' class='check'>&nbsp</ion-icon>").click((event) => {
            onChange(event);
        });

        task.append(check,del);

        $("#tasklist").append(task);
        $("#enter-task").val('');
      });

    $('.trash').click((event) => {
        onDelete(event);
    });

    $('.check').click((event) => {
        onChange(event);
    });

    $('#add').click((event) => {
        event.preventDefault();
    });

    $('#newlist').click((event) => {
        $('#newtodo').modal("hide");
        createToDoList(event);
    });

    $('#login_password').keydown((event) => {
        if (event.keyCode == 13) {
            login(event);
        }
    });

    $('#login_button').click((event) => {
        login(event); 
    });
    
    $('#login_register_button').click(() => {
        $('#login').modal("hide");
        $('#register').modal("show");
    });

    $('#register_button').click((event) => {
        register(event);
    });

    $('.delete-todo-button').click((event) => {
       var target = $(event.target).parent();
       $.ajax({
           url: `/chart/${target.text()}`,
           data: {
               todoname: `${target.text()}`
            },
           type: 'delete',
           success: function() {
               window.location.href = "/";
           }
       });
    });
});