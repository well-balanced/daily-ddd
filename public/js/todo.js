
$(function(){
    $('#task').click((e)=>{
        $.ajax({ 
            url:'/create', 
            type:'post', 
            data:{task:`${$('#enter-task').val()}`,state:'task',id:'1'},
        });

        // 입력값 넣기
        var task = $("<p class='task border rounded text-left'></p>").text($('#enter-task').val()+' ')
      
        //삭제버튼
        var del = $("<ion-icon name='trash'></ion-icon>").click((e)=>{
          var p = $(e.target).parent();
          p.fadeOut('slow',()=>{
            p.remove()
          })
        })
        
        var check = $("<ion-icon name='checkmark'></ion-icon>").click((e)=>{
          var p = $(e.target).parent();
          console.log(p)
          p.fadeOut('slow',()=>{
            $('#progresslist').append(p);
            p.fadeIn(()=>{
              p.click(()=>{
                p.fadeOut(()=>{
                  $('#donelist').append(p);
                  p.fadeIn()
                })
              })
            });
          })
        })
        // task 변수에 기능 추가
        task.append(check,del)
        // 할일 추가
        $("#tasklist").append(task)
        $("#enter-task").val('')
      })
})