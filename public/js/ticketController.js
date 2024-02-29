let editorInstance = '';
/*
ClassicEditor
        .create(document.querySelector('#ticket-description'), {
            // Add any other configuration options you need
            ckfinder: {
                // CKFinder configuration file path (e.g., use the connector script provided with CKFinder)
                // uploadUrl: url+api/addImage,
            }
        })
        .then(editor => {
            editorInstance = editor;
        })
        .catch(error => {
            console.error('Error initializing CKEditor 5:', error);
        });
*/
async function ticketOfProject(project_id){
    try{
        // console.log('project id : ',project_id)
        let projectId = null;
        if(project_id)
            projectId = project_id
        else
            projectId = document.getElementById('project-option').value
        console.log('project id : ',projectId)
        if(projectId != ''){
            const apiUrl = url + 'api/ticket/get?project='+projectId;
            console.log('api url : ',apiUrl)
            let response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer '+token
                }
            });
            response = await response.json();
            console.log('response : ',response)
            let tableContainer=document.getElementById('ticket_table')
            tableContainer.innerHTML = '';
            let table=document.createElement('table');
            table.classList.add('table');
            table.classList.add('table-bordered');
            tableContainer.appendChild(table);
            let tr=document.createElement('tr');
            let thead=document.createElement('th');
            thead.innerText='Ticket Number'
            let thead2=document.createElement('th');
            thead2.innerText='Subject'
            let thead3=document.createElement('th');
            thead3.innerText='Description'
            let thead4=document.createElement('th');
            thead4.innerText='Status'
            let thead5=document.createElement('th');
            thead5.innerText='Type'
            let thead6=document.createElement('th');
            thead6.innerText='Assigned To'
            tr.appendChild(thead);
            tr.appendChild(thead2);
            tr.appendChild(thead3);
            tr.appendChild(thead6);
            tr.appendChild(thead4);
            tr.appendChild(thead5);
            table.appendChild(tr);
            if(response.data.length>0){
                for(i=0;i<response.data.length;i++){
                    console.log('here')
                    let tr1=document.createElement('tr')
                    let td1=document.createElement('td')
                    let td2=document.createElement('td')
                    let td3=document.createElement('td')
                    let td4=document.createElement('td')
                    let td5=document.createElement('td')
                    let td6=document.createElement('td')
                    td1.innerHTML=`<a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#ticket_detail_modal" onClick=\'showSingleTicket(${JSON.stringify(response.data[i])})\'>${response.data[i].TicketNumber}</a>`
                    tr1.appendChild(td1)
                    td2.innerText=response.data[i].Subject
                    tr1.appendChild(td2)

                    td3.innerText=response.data[i].Description
                    tr1.appendChild(td3)

                    if(response.data[i].AssignTo ==  null){
                        td6.innerText="Not Assign Yet";
                    }else{
                        td6.innerText=response.data[i].AssignTo.Name;
                    }
                    tr1.appendChild(td6);
                    

                    td4.innerHTML=`<b>${response.data[i].Status}</b>`
                    tr1.appendChild(td4)
                    td5.innerHTML=getTypeBadge(response.data[i].TicketType)
                    tr1.appendChild(td5)
                    table.appendChild(tr1)
                }
            }
            else{
                let tr1=document.createElement('tr');
                tr1.setAttribute("align", "center");
                let td1=document.createElement('td');
                td1.setAttribute("colspan", "5");
                td1.innerText="No Data Found";
                tr1.appendChild(td1);
                table.appendChild(tr1);
            }
        }
    }catch(error){
        console.log('error : ',error)
    }
}
let employee_list;
async function getEmployeesOfProject(projectId){
    try{
        console.log('projects Is ID : ', projectId)
        let fetchUrl =  'api/employee/get?project='+projectId;
        const apiUrl = url + fetchUrl;
        console.log('api url : ',apiUrl)
        let response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+token
            }
        });
        response = await response.json();
        console.log('response employee : ',response)
        employee_list=response;
    }catch(error){
        console.log('catch error : ',error);
    }
}

document.getElementById('assigner_detail').addEventListener('click', ()=>{
    document.getElementById('assign_employee_modal').classList.add('show');
    document.getElementById('assign_employee_modal').style.display="block";

    let select=document.getElementById('update_assigneee');
    select.innerHTML='';

    for(i=0;i<employee_list.data.length;i++){
        let option_tag=document.createElement('option');
        option_tag.setAttribute('value', employee_list.data[i]._id);
        option_tag.innerText=employee_list.data[i].Name;
        select.appendChild(option_tag);
    }

    console.log(employee_list,'employee_list')


})
document.getElementById('estimate_detail').addEventListener('click', ()=>{
    document.getElementById('update_Time_employee_modal').classList.add('show');
    document.getElementById('update_Time_employee_modal').style.display="block";

 

  


})
// modal 6 handle

document.getElementById('close_time_modal').addEventListener('click',() =>{
    document.getElementById('update_Time_employee_modal').classList.remove('show');
    document.getElementById('update_Time_employee_modal').classList.add('fade');
    document.getElementById('update_Time_employee_modal').style.display="none";


})
document.getElementById('close_time_modal_btn').addEventListener('click',() =>{
    document.getElementById('update_Time_employee_modal').classList.remove('show');
    document.getElementById('update_Time_employee_modal').classList.add('fade');
    document.getElementById('update_Time_employee_modal').style.display="none";


})



// end here

// modal 5 handle 

document.getElementById('close_assign_modal').addEventListener('click',() =>{
    document.getElementById('assign_employee_modal').classList.remove('show');
    document.getElementById('assign_employee_modal').classList.add('fade');
    document.getElementById('assign_employee_modal').style.display="none";


})
document.getElementById('close_assign_modal_btn').addEventListener('click',() =>{
    document.getElementById('assign_employee_modal').classList.remove('show');
    document.getElementById('assign_employee_modal').classList.add('fade');
    document.getElementById('assign_employee_modal').style.display="none";


})

// end here 

// modal 7 handle

document.getElementById('status_detail').addEventListener('click', ()=>{
    document.getElementById('update_statuss_modal').classList.add('show');
    document.getElementById('update_statuss_modal').style.display="block";

})

document.getElementById('close_update_status_modal').addEventListener('click',() =>{
    document.getElementById('update_statuss_modal').classList.remove('show');
    document.getElementById('update_statuss_modal').classList.add('fade');
    document.getElementById('update_statuss_modal').style.display="none";


})
document.getElementById('close_update_status_modal_btn').addEventListener('click',() =>{
    document.getElementById('update_statuss_modal').classList.remove('show');
    document.getElementById('update_statuss_modal').classList.add('fade');
    document.getElementById('update_statuss_modal').style.display="none";


})


// end here  


async function updateStatus(){
    let updated_Status=document.getElementById('user_update_status').value;
    console.log(updated_Status,'user updates status');
    let ticket_id;
    ticket_id=current_ticket_id
    if(updated_Status!=''){

     let updated_status_obj={
        status:updated_Status
     }
        try{
            const apiUrl = url + 'api/ticket/update?id='+ticket_id;
            // console.log(apiUrl,'api url console')
            let response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+token
                },
                body: JSON.stringify(updated_status_obj)
            })
            response = await response.json();
            console.log('response update status : ',response)
            if(response.status == 200){
                alert('Status updated sucessfully');
                // window.location.reload();
            }
        }catch(error){
            console.log('error : ',error)
        }
    }
    else{
        alert('Please Select Value');
    }
}








async function updateAssignee(){
   let id_employee= document.getElementById('update_assigneee').value ;
   let ticket_id;

   if(id_employee!="select"){
    let update_value={
        assign:id_employee
    }
    ticket_id=current_ticket_id
    // console.log(ticket_id,'get ticket id')
    try{
        const apiUrl = url + 'api/ticket/update?id='+ticket_id;
        // console.log(apiUrl,'api url console')
        let response = await fetch(apiUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token
            },
            body: JSON.stringify(update_value)
        })
        response = await response.json();
        console.log('response update employee : ',response)
        if(response.status == 200){
            alert('updated sucessfully');
            window.location.reload();
        }
    }catch(error){
        console.log('error : ',error)
    }

   }else{
    console.log(id_employee,'vawdertyee')
   }
}
async function saveComment(){
    let u_comment=document.getElementById('comment_imput_value').value;
    // console.log(u_comment,'user enterd comment');
    let ticket_id;
    ticket_id=current_ticket_id

    if(u_comment!=""){
        let comment_obj={
            by:userid,
            name:username,
            comment:u_comment
        }
        try{
            const apiUrl = url + 'api/ticket/comment?id='+ticket_id;
            // console.log(apiUrl,'api url console')
            let response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+token
                },
                body: JSON.stringify(comment_obj)
            })
            response = await response.json();
            // console.log('response update comment : ',response)
            if(response.status == 200){
                alert('comment updated sucessfully');
                window.location.reload();
            }
        }catch(error){
            console.log('error : ',error)
        }
    }
    else{
        alert('comment cannot be blank')
    }
}

function handleInputBox(){
    document.getElementById('comment_imput_value').style.border="none";
    document.getElementById('input_container_id').style.border="1px solid rgba(128, 128, 128, 0.374)";
    document.getElementById('input_container_id').style.padding="20px 10px";
    document.getElementById('comment_action_box').style.display="block";
}

document.getElementById('comment_close_btn').addEventListener('click',()=>{
    document.getElementById('comment_imput_value').style.border="1px solid rgba(128, 128, 128, 0.374)";
    document.getElementById('input_container_id').style.border="none";
    document.getElementById('input_container_id').style.padding="0";
    document.getElementById('comment_action_box').style.display="none";
})

let current_ticket_id;
async function showSingleTicket(ticketDetail) {
    try{
        getEmployeesOfProject(ticketDetail?.Project?._id);
        console.log(ticketDetail,'tocket details');
        document.getElementById('ticket_no').innerText=ticketDetail.TicketNumber;
        document.getElementById("ticket_subject").innerText=ticketDetail.Subject;
        document.getElementById('createdby__detail').innerText=ticketDetail.CreatedBy?.Name ? ticketDetail.CreatedBy?.Name : "N/A";
        document.getElementById('ticket_des_text').innerText=ticketDetail.Description;
        document.getElementById('assigner_detail').innerText=ticketDetail.AssignTo != null ? ticketDetail.AssignTo?.Name : "Not Assigned Yet";
        document.getElementById('status_detail').innerText=ticketDetail.Status;
        document.getElementById('tickettype_detail').innerText=ticketDetail.TicketType;
        document.getElementById('ticketpriority_detail').innerText=ticketDetail.TicketPriority;
        document.getElementById('createdat_detail').innerText=ticketDetail.createdAt;
        document.getElementById('updatedat_detail').innerText=ticketDetail.updatedAt;
        document.getElementById('estimate_detail').innerText=ticketDetail.EstimateDateTime!= null ? ticketDetail.EstimateDateTime : document.getElementById('estimate_detail').innerText = 'Not updated yet';
        document.getElementById('actualtime_detail').innerText=ticketDetail.ActualDateTime;


        current_ticket_id=ticketDetail._id


        if(ticketDetail.Comments.length>0){
            let comment_sec=document.getElementById('user_coments_boxx');
            comment_sec.innerHTML = '';
          
            for(i=0;i<ticketDetail.Comments.length;i++){
                let parent_div=document.createElement('div');
                parent_div.setAttribute('class','user_comment_box mt-3');
                parent_div.setAttribute('id','comment_user_cont');
    
                let img_tag=document.createElement('img');
                img_tag.setAttribute('src','/imgs/user.png')
    
                let comment_div=document.createElement('div');
                comment_div.setAttribute('class','user_comment_container');
    
                let us_name=document.createElement('p');
                us_name.setAttribute('class','comment_user_name');
                us_name.innerText=ticketDetail.Comments[i].Name;
                
                let us_comment=document.createElement('p');
                us_comment.innerText=ticketDetail.Comments[i].Comment;
                us_comment.setAttribute('class','user_comments');
    
               
                parent_div.appendChild(img_tag);
                parent_div.appendChild(comment_div)
    
                comment_div.appendChild(us_name);
                comment_div.appendChild(us_comment);
    
                comment_sec.appendChild(parent_div)
    
            }       
        }else{
            document.getElementById('user_coments_boxx').innerHTML = '<br/><h5>No Comments Yet.</h5>'
        }




    }catch(error){
        console.log('error : ',error)
    }
}

async function updateTime(){
    let update_est_time = document.getElementById('update_estime_time_val').value
    console.log(update_est_time,'update time value');
    let ticket_id;
    ticket_id=current_ticket_id
    if(update_est_time!=""){
        console.log('entrred time',update_est_time );
        let update_time_obj={
            estimate:update_est_time
        }
        try{
            const apiUrl = url + 'api/ticket/update?id='+ticket_id;
            // console.log(apiUrl,'api url console')
            let response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+token
                },
                body: JSON.stringify(update_time_obj)
            })
            response = await response.json();
            console.log('response update est time : ',response)
            if(response.status == 200){
                document.getElementById('update_estime_time_val').value = '';
                alert('est time updated sucessfully');
                // window.location.reload();
            }
        }catch(error){
            console.log('error : ',error)
        }

    }else{
      console.log(  'Not entered time',update_est_time)
    }
}

function getTypeBadge(badgeCode) {
    if (badgeCode == 'Story'){
        return `<span class="badge text-bg-success" title="Story">Story</span>`;
    }
    else if (badgeCode == 'Task'){
        return `<span class="badge text-bg-warning" title="Task">Task</span>`;
    }
    else if (badgeCode == 'Bug'){
        return `<span class="badge text-bg-danger" title="Bug">Bug</span>`;
    }
    else if (badgeCode == 'Feature Request'){
        return `<span class="badge text-bg-info" title="Feature Request">Feature Request</span>`;
    }
}

async function createTicket(formData){
    try{
        
        console.log('formData : ',formData)
        // const data = editorInstance.getData();

        // array.append('BlogContent', data);
        const apiUrl = url + 'api/ticket/insert';
        let response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token
            },
            body: JSON.stringify(formData)
        })
        response = await response.json();
        console.log('response : ',response)
        if(response.status == 200){
            alert('Ticket Created');
            window.location.reload();
        }
    }catch(error){
        console.log('error : ',error)
    }
}

async function updateLogTime(){
    let updated_log_time= document.getElementById('input_time_track_value').value;
    let work_des=document.getElementById('time_log_work_description').value;
    let ticket_id;
    ticket_id=current_ticket_id
    if(updated_log_time!="" && work_des!=""){
        console.log(updated_log_time,'log time');
        console.log(work_des,'work description');

        console.log(userid,'userid');

        let log_time_obj={
            logby:userid,
            activity:work_des,
            logtime:updated_log_time
        }

        try{
            const apiUrl = url + 'api/ticket/log?id='+ticket_id;
            console.log(apiUrl,'api url console')
            let response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+token
                },
                body: JSON.stringify(log_time_obj)
            })
            response = await response.json();
            console.log('response update log time : ',response)
            if(response.status == 200){
                document.getElementById('input_time_track_value').value = '';
                document.getElementById('time_log_work_description').value = '';
                alert('log time updated sucessfully');
                // window.location.reload();
            }
        }catch(error){
            console.log('error : ',error)
        }


    }
    else{
        alert('please enter valid values');
    }
}