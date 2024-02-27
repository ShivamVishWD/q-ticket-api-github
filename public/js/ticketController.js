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
        console.log('project id : ',project_id)
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
            tr.appendChild(thead);
            tr.appendChild(thead2);
            tr.appendChild(thead3);
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
                    td1.innerHTML=`<a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#ticket_detail_modal" onClick=\'showSingleTicket(${JSON.stringify(response.data[i])})\'>${response.data[i].TicketNumber}</a>`
                    tr1.appendChild(td1)
                    td2.innerText=response.data[i].Subject
                    tr1.appendChild(td2)

                    td3.innerText=response.data[i].Description
                    tr1.appendChild(td3)
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

async function showSingleTicket(ticketDetail) {
    try{
        console.log(ticketDetail)
    }catch(error){
        console.log('error : ',error)
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