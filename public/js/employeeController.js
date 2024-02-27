let projectOfEmployee = [];
let allProjects = [];

async function getEmployees(projectId){
    try{
        let fetchUrl = profile == 'manager' ? projectId ? 'api/employee/get?role=Team Member&project='+projectId : 'api/employee/get?role=Team Member' : 'api/employee/get'
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
        console.log('response : ',response)
        let rec_data=response
        console.log(rec_data,'test')
        if(rec_data){
            console.log(response.data.length)
            let tableContainer=document.getElementById('employee_table')
            tableContainer.innerHTML = '';
            let table=document.createElement('table');
            tableContainer.appendChild(table);
            let tr=document.createElement('tr');
            let thead=document.createElement('th');
            thead.innerText='Name'
            let thead2=document.createElement('th');
            thead2.innerText='Email'
            tr.appendChild(thead);
            tr.appendChild(thead2);
            table.appendChild(tr);
            console.log(response.data.length)
            if(rec_data.data.length>0){
                for(i=0;i<rec_data.data.length;i++){
                    console.log('here')
                    let tr1=document.createElement('tr')
                    let td1=document.createElement('td')
                    let td2=document.createElement('td')
                    td1.innerHTML=rec_data.data[i].Name
                    tr1.appendChild(td1)
                    td2.innerText=rec_data.data[i].Email
                    tr1.appendChild(td2)
                    table.appendChild(tr1)
                }
            }
            else{
                // alert('no data to show')
            }
        }
    }catch(error){
        console.log('catch error : ',error);
    }
}

getEmployees();

async function addemployee(formData){
    try{
        const apiUrl = url + 'api/employee/insert';
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
            alert('Team Added');
            window.location.reload();
        }
    }catch(error){
        console.log('error : ',error)
    }
}