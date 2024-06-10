var url = Base_url;
console.log(profile)
function handleForm(formName){
    console.log('Base_url : ',Base_url)
    let formFields = document.getElementById(formName).querySelectorAll('.form-control');
    let mandatoryFields = [];
    let formObj = {};
    for(let item of formFields){
        if(!item?.value)
            mandatoryFields.push(item.name);
        else
            formObj[item.name] = item.value;
    }
    if(mandatoryFields.length > 0){
        alert('Mandatory Fields : '+mandatoryFields.join(', '))
        return;
    }
    if(formName == 'adminLogin'){
        userLogin(formObj)
    }
    if(formName == 'project'){
        createproject(formObj)
    }
    if(formName == 'customer'){
        addcustomer(formObj)
    }
    if(formName == 'employee'){
        formObj = {
            ...formObj,
            project: [formObj?.project]
        }
        addemployee(formObj)
    }
    if(formName == 'ticket'){
        createTicket(formObj)
    }
}

async function getLoggedInUserDetail(){
    try{
        var userProject = null;
        const apiUrl = url + 'api/employee/get?id='+userid;
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
            if(response.data.length > 0){
                let template = '';
                for(let item of response.data[0].Project){
                    template += `<button style="margin-left: 0.5rem;" value=${item._id} onClick=\'ticketOfProject(${JSON.stringify(item._id)})\'>${item.Name} - ${item.Alias}</button>`;
                    userProject = item._id;
                }
                if(document.getElementById('existingProject') != null)
                    document.getElementById('existingProject').innerHTML = template;
                if(profile && (profile != 'employee' || profile != 'Employee'))
                    getProjects(userProject);
                if(profile && (profile != 'employee' || profile != 'Employee'))
                    getEmployees(userProject);
            }
        }
    }catch(error){
        console.log('error : ',error)
    }
}

async function getProjects(projectId){
    try{
        let fetchUrl = projectId ? 'api/project/get?id='+projectId : 'api/project/get';
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
        console.log('response projects : ',response)
        if(response.status == 200){
            let templateString = '<option value="">Select a Project</option>';
            for(let item of response.data){
                templateString += '<option value="'+item._id+'">'+item.Name+' - '+ item.Alias +'</option>';
            }
            document.querySelectorAll('#project-option').forEach(item => {
                item.innerHTML = templateString;
            })
        }
    }catch(error){
        console.log('error : ',error)
    }
}
if(profile && profile != 'admin' && profile != 'Admin')
    getLoggedInUserDetail();
if(profile && (profile == 'admin' || profile == 'Admin'))
    getProjects();