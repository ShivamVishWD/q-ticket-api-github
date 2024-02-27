async function getCustomers(){
    try{
        const apiUrl = url + 'api/customer/get';
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
            let tableContainer=document.getElementById('costumer_table')
            let table=document.createElement('table');
            tableContainer.appendChild(table);
            let tr=document.createElement('tr');
            let thead=document.createElement('th');
            thead.innerText='Name'
            let thead2=document.createElement('th');
            thead2.innerText='Email'
            let thead3=document.createElement('th');
            thead3.innerText='Project Name'
            let thead4=document.createElement('th');
            thead4.innerText='Project Status'
            tr.appendChild(thead);
            tr.appendChild(thead2);
            tr.appendChild(thead3);
            tr.appendChild(thead4);
            table.appendChild(tr);
            console.log(response.data.length)
            if(rec_data.data.length>0){
                for(i=0;i<rec_data.data.length;i++){
                    console.log('here')
                    let tr1=document.createElement('tr')
                    let td1=document.createElement('td')
                    let td2=document.createElement('td')
                    let td3=document.createElement('td')
                    let td4=document.createElement('td')
                    td1.innerHTML=rec_data.data[i].Name
                    tr1.appendChild(td1)
                    td2.innerText=rec_data.data[i].Email
                    tr1.appendChild(td2)

                    td3.innerText=rec_data.data[i].Project.Name
                    tr1.appendChild(td3)
                    td4.innerText=rec_data.data[i].Project.Status
                    tr1.appendChild(td4)

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

async function getProjectsForCustomer(){
    try{
        const apiUrl = url + 'api/project/get';
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
        if(response.status == 200){
            let templateString = '<option value="">Select a Project</option>';
            for(let item of response.data){
                templateString += '<option value="'+item._id+'">'+item.Name+'</option>';
            }
            document.getElementById('project-option').innerHTML = templateString;
        }
    }catch(error){
        console.log('error : ',error)
    }
}

getCustomers();
getProjectsForCustomer();

async function addcustomer(formData){
    try{
        const apiUrl = url + 'api/customer/insert';
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
            alert('Customer Added');
            window.location.reload();
        }
    }catch(error){
        console.log('error : ',error)
    }
}