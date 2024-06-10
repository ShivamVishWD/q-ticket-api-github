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
                    // td1.innerHTML=`<a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#ticket_detail_modal" onClick=\'showSingleTicket(${JSON.stringify(response.data[i])})\'>${response.data[i].TicketNumber}</a>`
                    td1.innerHTML=`<a href="ticket/${response.data[i].TicketNumber}">${response.data[i].TicketNumber}</a>`
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
                baseUrlForAttachments = null;
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
//let employee_list;
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
        let select=document.getElementById('update_assigneee');
        select.innerHTML='';
        if(response.status == 200){
            for(i=0;i<response.data.length;i++){
                let option_tag=document.createElement('option');
                option_tag.setAttribute('value', response.data[i]._id);
                option_tag.innerText=response.data[i].Name;
                select.appendChild(option_tag);
            }
        }
        // employee_list=response;
    }catch(error){
        console.log('catch error : ',error);
    }
}


if(document.getElementById('update-assignee') != null){
    document.getElementById('update-assignee').addEventListener('click', ()=>{
        document.getElementById('assign_employee_modal').classList.add('show');
        document.getElementById('assign_employee_modal').style.display="block";
    })
}

if(document.getElementById('estimate-update-modal-btn') != null){
    document.getElementById('estimate-update-modal-btn').addEventListener('click', ()=>{
        document.getElementById('update_Time_employee_modal').classList.add('show');
        document.getElementById('update_Time_employee_modal').style.display="block";
    })
}
// modal 6 handle
if(document.getElementById('close_time_modal') != null){
    document.getElementById('close_time_modal').addEventListener('click',() =>{
        document.getElementById('update_Time_employee_modal').classList.remove('show');
        document.getElementById('update_Time_employee_modal').classList.add('fade');
        document.getElementById('update_Time_employee_modal').style.display="none";
    })
}

if(document.getElementById('close_time_modal_btn') != null){
    document.getElementById('close_time_modal_btn').addEventListener('click',() =>{
        document.getElementById('update_Time_employee_modal').classList.remove('show');
        document.getElementById('update_Time_employee_modal').classList.add('fade');
        document.getElementById('update_Time_employee_modal').style.display="none";
    })
}



// end here

// modal 5 handle 

if(document.getElementById('close_assign_modal') != null){
    document.getElementById('close_assign_modal').addEventListener('click',() =>{
        document.getElementById('assign_employee_modal').classList.remove('show');
        document.getElementById('assign_employee_modal').classList.add('fade');
        document.getElementById('assign_employee_modal').style.display="none";
    })
}

if(document.getElementById('close_assign_modal_btn') != null){
    document.getElementById('close_assign_modal_btn').addEventListener('click',() =>{
        document.getElementById('assign_employee_modal').classList.remove('show');
        document.getElementById('assign_employee_modal').classList.add('fade');
        document.getElementById('assign_employee_modal').style.display="none";
    })
}


// end here 

// modal 7 handle
if(document.getElementById('status-update') != null){
    document.getElementById('status-update').addEventListener('click', ()=>{
        document.getElementById('update_statuss_modal').classList.add('show');
        document.getElementById('update_statuss_modal').style.display="block";
    })
}

if(document.getElementById('close_update_status_modal') != null){
    document.getElementById('close_update_status_modal').addEventListener('click',() =>{
        document.getElementById('update_statuss_modal').classList.remove('show');
        document.getElementById('update_statuss_modal').classList.add('fade');
        document.getElementById('update_statuss_modal').style.display="none";
    })
}

if(document.getElementById('close_update_status_modal_btn') != null){
    document.getElementById('close_update_status_modal_btn').addEventListener('click',() =>{
        document.getElementById('update_statuss_modal').classList.remove('show');
        document.getElementById('update_statuss_modal').classList.add('fade');
        document.getElementById('update_statuss_modal').style.display="none";
    })
}

// end here  

if(document.getElementById('time-log-btn') != null){
    document.getElementById('time-log-btn').addEventListener('click', ()=>{
        document.getElementById('time_log_modal').classList.add('show');
        document.getElementById('time_log_modal').style.display="block";
    })
}

if(document.getElementById('close_time_log_modal') != null){
    document.getElementById('close_time_log_modal').addEventListener('click',() =>{
        document.getElementById('time_log_modal').classList.remove('show');
        document.getElementById('time_log_modal').classList.add('fade');
        document.getElementById('time_log_modal').style.display="none";
    })
}

if(document.getElementById('close_time_log_modal_btn') != null){
    document.getElementById('close_time_log_modal_btn').addEventListener('click',() =>{
        document.getElementById('time_log_modal').classList.remove('show');
        document.getElementById('time_log_modal').classList.add('fade');
        document.getElementById('time_log_modal').style.display="none";
    })
}

async function updateStatus(){
    let updated_Status=document.getElementById('user_update_status').value;
    console.log(updated_Status,'user updates status');

    if(updated_Status!=''){

        let updated_status_obj={
            status:updated_Status
        }
        try{
            const apiUrl = url + 'api/ticket/update?ticket='+ticketNo;
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
                window.location.reload();
            }else{
                alert("Something went Wrog, PLease Try Again Later")
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

    if(id_employee!="select"){
        let update_value={
            assign:id_employee
        }
        // console.log(ticket_id,'get ticket id')
        try{
            const apiUrl = url + 'api/ticket/update?ticket='+ticketNo;
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
    
    if(u_comment!=""){
        let comment_obj={
            by:userid,
            name:username,
            comment:u_comment
        }
        try{
            const apiUrl = url + 'api/ticket/comment?ticket='+ticketNo;
            let response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+token
                },
                body: JSON.stringify(comment_obj)
            })
            response = await response.json();
            if(response.status == 200){
                alert('comment updated sucessfully');
                window.location.reload();
            }else{
                alert("Something Went Wrong, Please Try Again Later");
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

if(document.getElementById('comment_close_btn') != null){
    document.getElementById('comment_close_btn').addEventListener('click',()=>{
        document.getElementById('comment_imput_value').style.border="1px solid rgba(128, 128, 128, 0.374)";
        document.getElementById('input_container_id').style.border="none";
        document.getElementById('input_container_id').style.padding="0";
        document.getElementById('comment_action_box').style.display="none";
    })
}

let current_ticket_id;

if(ticketNo && ticketNo != null && ticketNo != ''){
    getTicketDetail(ticketNo);
}

async function getTicketDetail(ticketNo) {
    try{
        let baseUrlForAttachments = null;
        const apiUrl = url + 'api/ticket/get?ticket='+ticketNo;
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
        baseUrlForAttachments = response.baseUrl;
        if(response.status == 200 && response.data.length > 0){
            const record = response.data[0];

            document.getElementById("ticket-subject").innerHTML = String(record?.Subject).charAt(0).toUpperCase() + String(record?.Subject).slice(1);
            document.getElementById("ticket-description").innerHTML = String(record?.Description).charAt(0).toUpperCase() + String(record?.Description).slice(1);
            
            document.getElementById("ticket-status").innerHTML = String(record?.Status).charAt(0).toUpperCase() + String(record?.Status).slice(1);
            document.getElementById("created-by").innerHTML = record?.CreatedBy?.Name || 'N/A';
            document.getElementById("created-at").innerHTML = record?.createdAt;
            document.getElementById("ticket-type").innerHTML = record?.TicketType;
            document.getElementById("assign-to").innerHTML = record?.AssignTo?.Name || 'N/A';
            document.getElementById("ticket-priority").innerHTML = record?.TicketPriority;
            document.getElementById("updated-at").innerHTML = record?.updatedAt;
            document.getElementById("estimate-time").innerHTML = record?.EstimateDateTime != null ? record?.EstimateDateTime : 'N/A';
            document.getElementById("actual-time").innerHTML = record?.ActualDateTime;

            if(record?.Comments.length > 0){
                let comment_sec=document.getElementById('user_coments_boxx');
                comment_sec.innerHTML = '';
            
                for(i=0;i<record.Comments.length;i++){
                    let parent_div=document.createElement('div');
                    parent_div.setAttribute('class','user_comment_box mt-3');
                    parent_div.setAttribute('id','comment_user_cont');
        
                    // let img_tag=document.createElement('img');
                    // img_tag.setAttribute('src','/imgs/user.png')
        
                    let comment_div=document.createElement('div');
                    comment_div.setAttribute('class','user_comment_container');
        
                    let us_name=document.createElement('h6');
                    us_name.setAttribute('class','comment_user_name');
                    us_name.innerText=record.Comments[i].Name;
                    
                    let us_comment=document.createElement('label');
                    us_comment.innerText=record.Comments[i].Comment;
                    us_comment.setAttribute('class','user_comments');
        
                
                    // parent_div.appendChild(img_tag);
                    parent_div.appendChild(comment_div)
        
                    comment_div.appendChild(us_name);
                    comment_div.appendChild(us_comment);
        
                    comment_sec.appendChild(parent_div)
        
                } 
            }else{
                document.getElementById('user_coments_boxx').innerHTML = '<br/><h5>No Comments Yet.</h5>'
            }

            if(record.Attachments.length > 0){
                let templateAttach = '';
                for(let imageUrl of record.Attachments){
                    templateAttach += `<img src='${baseUrlForAttachments}${imageUrl}' style="height: 200px; aspect-ratio: 1.5/1; display: block;"/>`
                }
                document.getElementById('ticket_attachments').innerHTML = templateAttach;
            }else{
                document.getElementById('ticket_attachments').innerHTML = '';
            }
            getEmployeesOfProject(record?.Project?._id)
        }else{
            window.history.back();
        }
    }catch(error){
        console.log('error : ',error)
        window.history.back();
    }
}

async function updateTime(){
    let update_est_time = document.getElementById('update_estime_time_val').value
    console.log(update_est_time,'update time value');

    if(update_est_time!=""){
        console.log('entrred time',update_est_time );
        let update_time_obj={
            estimate:update_est_time
        }
        try{
            const apiUrl = url + 'api/ticket/update?ticket='+ticketNo;
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
                window.location.reload();
            }else{
                alert("Something Went wrong, Please Try Again Later")
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
        return `<span class="badge text-bg-success" title="Story"><i class="fa-brands fa-readme"></i></span>`;
    }
    else if (badgeCode == 'Task'){
        return `<span class="badge text-bg-warning" title="Task"><i class="fa-solid fa-list"></i></span>`;
    }
    else if (badgeCode == 'Bug'){
        return `<span class="badge text-bg-danger" title="Bug"><i class="fa-solid fa-bug"></i></span>`;
    }
    else if (badgeCode == 'Feature Request'){
        return `<span class="badge text-bg-info" title="Feature Request"><i class="fa-solid fa-wand-magic-sparkles"></i></span>`;
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
            const apiUrl = url + 'api/ticket/log?ticket='+ticketNo;
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
                window.location.reload();
            }else{
                alert("Something Went Wrong, Please Try Again Later")
            }
        }catch(error){
            console.log('error : ',error)
        }


    }
    else{
        alert('please enter valid values');
    }
}