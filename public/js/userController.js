async function userLogin(formData){
    console.log('form data : ',formData)
    let loginUrl = loginfor == 'admin' ? 'api/admin/login' : 'api/employee/login'
    let apiUrl = url+loginUrl;
    console.log('apiUrl : ',apiUrl)
    let response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    response = await response.json();
    console.log('response login : ',response);
    if(response.status == 200){
        if(loginfor == 'admin')
            window.location.replace('/dashboard');
        else if(loginfor == 'employee')
            window.location.replace('/tickets');
    }else
        alert('Wrong Credential');
}