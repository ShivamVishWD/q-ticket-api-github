let all_ptojects;

async function getProjects() {
    try {
        const apiUrl = url + 'api/project/get';
        console.log('api url : ', apiUrl)
        let response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        response = await response.json();
        console.log('response : ', response)
        all_ptojects=response
        let rec_data = response
        console.log(rec_data, 'test')
        if (rec_data) {
            console.log(response.data.length)
            let tableContainer = document.getElementById('project_table')
            tableContainer.innerHTML = '';
            let table = document.createElement('table');
            tableContainer.appendChild(table);
            let tr = document.createElement('tr');
            let thead = document.createElement('th');
            thead.innerText = 'Name'
            let thead2 = document.createElement('th');
            thead2.innerText = 'Status'
            let thead3 = document.createElement('th');
            thead3.innerText = 'Actions'
            tr.appendChild(thead);
            tr.appendChild(thead2);
            tr.appendChild(thead3);
            table.appendChild(tr);
            console.log(response.data.length)
            if (rec_data.data.length > 0) {
                for (i = 0; i < rec_data.data.length; i++) {
                    console.log('here')
                    let tr1 = document.createElement('tr')
                    let td1 = document.createElement('td')
                    let td2 = document.createElement('td')
                    let td3 = document.createElement('td')
                    td1.innerHTML = rec_data.data[i].Name + ' - ' + rec_data.data[i].Alias
                    tr1.appendChild(td1)
                    td2.innerText = rec_data.data[i].Status
                    tr1.appendChild(td2)
                    // console.log(rec_data.data[i].Name);
                    td3.innerHTML =` 
                        <button class="btn btn-sm btn-outline-success" data-bs-toggle="modal" data-bs-target="#assign_modal" title="Assign Team Member" id="assign_trigger_btn${i}" onClick=\'handleAEDtrigger("${rec_data.data[i].Name}","assign")\'><i class="fa-solid fa-user-plus"></i></button>
                        <button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#editModal" title="Edit" id="edit_trigger_btn${i}" onClick=\'handleAEDtrigger("${rec_data.data[i].Name}","edit")\'><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn btn-sm btn-outline-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" title="Delete" id="delete_trigger_btn${i}" onClick=\'handleAEDtrigger("${rec_data.data[i].Name}","delete")\'><i class="fa-solid fa-trash"></i></button>
                    `
                    tr1.appendChild(td3)
                    table.appendChild(tr1)
                }
            }
            else {
                // alert('no data to show')
            }
        }
    } catch (error) {
        console.log('catch error : ', error);
    }
}

async function getManagers() {
    try {
        const apiUrl = url + 'api/employee/get?role="Manager"';
        console.log('api url : ', apiUrl)
        let response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        response = await response.json();
        console.log('response : ', response)
        if (response.status == 200) {
            let templateString = '<option value="">Reporting Manager</option>';
            for (let item of response.data) {
                templateString += '<option value="' + item._id + '">' + item.Name + '</option>';
            }
            document.getElementById('project-manager').innerHTML = templateString;
        }
    } catch (error) {
        console.log('error : ', error);
    }
}

getProjects();
// getManagers();

async function createproject(formData) {
    try {
        const apiUrl = url + 'api/project/insert';
        let response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(formData)
        })
        response = await response.json();
        console.log('response : ', response)
        if (response.status == 200) {
            alert('Project Added');
            window.location.reload();
        }
    } catch (error) {
        console.log('error : ', error)
    }
}


async function handleAEDtrigger(projectname, modalname) { 
    assign_selected_empl.members=[];


    if (modalname == "assign") {
        document.getElementById('Assign_modal_label').innerText = projectname;
        try {
            const apiUrl = url + 'api/employee/get?role=Team Member';
            let response = await fetch(apiUrl, {
                method: 'Get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            response = await response.json();
            console.log('response : ', response)
            if (response.status == 200) {
                let listContainer = document.getElementById('employe_list_container')
                listContainer.innerHTML = '';
                let empTable = document.createElement('table');
                listContainer.appendChild(empTable)
                listContainer.appendChild(empTable);
                let theadTr = document.createElement('tr');
                let theadTd0 = document.createElement('th');
                let theadTd1 = document.createElement('th');
                let theadTd2 = document.createElement('th');
                let theadTd3 = document.createElement('th');
                theadTd0.innerText = "S.NO";
                theadTd1.innerText = "Name";
                theadTd2.innerText = "Email";
                theadTd3.innerText = "Select";
                theadTr.appendChild(theadTd0);
                theadTr.appendChild(theadTd1);
                theadTr.appendChild(theadTd2);
                theadTr.appendChild(theadTd3);
                empTable.appendChild(theadTr);
                listContainer.appendChild(empTable)

                for (i = 0; i < response.data.length; i++) {
                    let empTr = document.createElement('tr');
                    let empTd0 = document.createElement('td');
                    let empTd1 = document.createElement('td');
                    let empTd2 = document.createElement('td');
                    let empTd3 = document.createElement('td');
                    empTd0.innerText = i + 1;
                    empTd1.innerText = response.data[i].Name;
                    empTd2.innerText = response.data[i].Email;
                    for(k=0;k<all_ptojects.data.length;k++){
                        if(projectname==all_ptojects.data[k].Name){
                            Project_ID=all_ptojects.data[k]._id;
                            console.log(Project_ID,'id of project')
                        }
                    }
                    empTd3.innerHTML = ` <div class="form-group-emp-select">
                    <input type="checkbox" id=${response.data[i].Name} value="${response.data[i]._id}" data-project="${projectname}" class="form-control" onChange=empAssignListHandler(event,"${projectname}")>
                    <label for=${response.data[i].Name}>Assign</label>
                  </div>`;

                    if (response.data[i].Project.length > 0) {
                        for (j = 0; j < response.data[i].Project.length; j++) {
                            if (response.data[i].Project[j].Name == projectname) {
                                console.log(response.data[i].Project[j].Name,'prohjectNAme')
                                empTd3.innerHTML = ` <div class="form-group-emp-select">
                    <input type="checkbox" id=${response.data[i].Name} value="${response.data[i]._id}" data-project="${projectname}" class="form-control" checked onChange=empAssignListHandler(event,"${projectname}")>
                    <label for=${response.data[i].Name}>Assign</label>
                  </div>`;
                  assign_selected_empl.members.push(response.data[i]._id)
                  console.log(assign_selected_empl,'forLoop')
                            }
                        }
                    } else {
                       
                    }

                    empTr.appendChild(empTd0);
                    empTr.appendChild(empTd1);
                    empTr.appendChild(empTd2);
                    empTr.appendChild(empTd3);
                    empTable.appendChild(empTr);

                }


            }
        } catch (error) {
            console.log('error : ', error)
        }
    }





    if (modalname == "edit") {
        for(k=0;k<all_ptojects.data.length;k++){
            if(projectname==all_ptojects.data[k].Name){
                Project_ID=all_ptojects.data[k]._id;
                console.log(Project_ID,'id of project')
            }
        }
    }


    
    if (modalname == "delete") {
        delete_project_obj.ProjectName = projectname;
        document.getElementById('DeleteLabel').innerText = `Delete ${projectname}`;
        console.log(all_ptojects,'ap')
        for(k=0;k<all_ptojects.data.length;k++){
            if(projectname==all_ptojects.data[k].Name){
                Project_ID=all_ptojects.data[k]._id;
                console.log(Project_ID,'id of project')
            }
        }
    }
}
let assign_selected_empl = {
    members:[]
};
let edit_project_obj = {
    "status": "",
    // manager: null
}
let delete_project_obj = {
    'ProjectName': "",
    "Delete": ""
}
let Project_ID;
let Employee_ID;

function empAssignListHandler(event, project) {
    let emp_name = event.target.value;
    console.log(project)
    // console.log(id_of);

    console.log(assign_selected_empl, 'array');

    if (event.target.checked) {
        console.log('checking');
        // assign_selected_empl.projectName = project;
        assign_selected_empl.members.push(emp_name)
        console.log(assign_selected_empl, 'array if');
    }
    if (!event.target.checked) {
        console.log('checking false');
        assign_selected_empl.members.pop(emp_name);
        console.log(assign_selected_empl, 'array ifFalse');
    }

    // if(assign_selected_empl.length>3){
    //     updateEmpAssign();
    // }


}

async function updateEmpAssign() {
    if (assign_selected_empl.members.length > 0) {
        let assign_detail_obj = assign_selected_empl;
        console.log(Project_ID,'IDDDDDDd')
        // for (let i = 0; i < assign_selected_empl.members.length; i++) {
        //     const key = `name${i}`;
        //     const value = assign_selected_empl.members[i];
        //     assign_detail_obj[key] = value;
        // }
        console.log(assign_detail_obj, 'testobj')

          try{
            const apiUrl = url + 'api/project/editteam?id='+Project_ID;
            let response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+token
                },
                body: JSON.stringify(assign_detail_obj)
            })
            response = await response.json();
            console.log('response : ',response)
            if(response.status == 200){
                alert('Employee assigned sucessfully !');
                window.location.reload();
            }
        }catch(error){
            console.log('error : ',error)
        }
    } else {
        alert('something went wrong')
    }

}
async function updateProject() {

    let selectedValue = document.getElementById('project_edit_status').value;
    let managerValue = document.getElementById('project-manager').value;

    if (selectedValue != "") {
        edit_project_obj.status = selectedValue;
        // edit_project_obj.manager = managerValue;
        console.log(Project_ID,edit_project_obj,'check d=edit')

          try{
            const apiUrl = url + 'api/project/update?id='+Project_ID;
            let response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+token
                },
                body: JSON.stringify(edit_project_obj)
            })
            response = await response.json();
            console.log('response : ',response)
            if(response.status == 200){
                alert('Status Updated sucessfully !');
                window.location.reload();
            }
        }catch(error){
            console.log('error : ',error)
        }

    }
    else {
        alert("please select at least one");
    }

}

async function deleteProject() {
    delete_project_obj.Delete = true;
    console.log(delete_project_obj, Project_ID,'oijuygtrdes');


      try{
        const apiUrl = url + 'api/project/delete/'+Project_ID;
        let response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token
            },
            // body: JSON.stringify(delete_project_obj)
        })
        response = await response.json();
        console.log('response : ',response)
        if(response.status == 200){
            alert('Project Deleted sucessfully !');
            window.location.reload();
        }
    }catch(error){
        console.log('error : ',error)
    }
}