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
}

