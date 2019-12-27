
function onDelete(e) {
    var p = $(e.target).parent();
    $.ajax({ 
      url:'/delete', 
      type:'post', 
      data:{task:`${p.text().trim()}`},
    });
    p.fadeOut('slow',()=>{
      p.remove()
    })
}
function onChange(e){
    var pp = $(e.target).parent().parent().attr('id');
    var p = $(e.target).parent();
    if (pp === 'tasklist') {
        $.ajax({ 
            url:'/progress', 
            type:'post', 
            data:{task:`${p.text().trim()}`,state:'progress'},
        });
        p.fadeOut('slow',()=>{
            $('#progresslist').append(p);
            p.fadeIn()
        })
    } else if (pp === 'progresslist') {
        $.ajax({ 
            url:'/done', 
              type:'post', 
              data:{task:`${p.text().trim()}`,state:'done'},
              });
        p.fadeOut(()=>{
            $('#donelist').append(p);
            p.fadeIn()
        })
    }
}


$(function(){
    $('#task').click((e)=>{
        $.ajax({ 
            url:'/create', 
            type:'post', 
            data:{task:`${$('#enter-task').val()}`,state:'task',id:'1'},
        });

        // 입력값 넣기
        var task = $("<p class='task border rounded text-left'></p>").text($('#enter-task ').val()+' ')
      
        //삭제버튼
        var del = $("<ion-icon name='trash' class='trash'> </ion-icon>").click((e)=>{
          onDelete(e)
        });
        
        var check = $("<ion-icon name='checkmark' class='check'>&nbsp</ion-icon>").click((e)=>{
            onChange(e)
        })
        // task 변수에 기능 추가
        task.append(check,del)
        // 할일 추가
        $("#tasklist").append(task)
        $("#enter-task").val('')
      })
    $('.trash').click((e)=>{
        onDelete(e);
    })
    $('.check').click((e)=>{
        onChange(e);
    })
})