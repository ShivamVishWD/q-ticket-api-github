let url = Base_url;

async function getCounts(){
    // Get Total no. of Projects
    try{
        const apiUrl = url + 'api/project/get?count';
        let response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+token
            }
        });
        response = await response.json();
        if(response.status == 200){
            document.getElementById('total-project').innerText = response.count;
        }
    }catch(error){
        console.log('error : ',error)
    }

    // Get Total no. of Customers
    try{
        const apiUrl = url + 'api/customer/get?count';
        let response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+token
            }
        });
        response = await response.json();
        if(response.status == 200){
            document.getElementById('total-customer').innerText = response.count;
        }
    }catch(error){
        console.log('error : ',error)
    }

    // Get Total no. of Tickets
    try{
        const apiUrl = url + 'api/ticket/get?count';
        let response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+token
            }
        });
        response = await response.json();
        if(response.status == 200){
            document.getElementById('total-ticket').innerText = response.count;
        }
    }catch(error){
        console.log('error : ',error)
    }

    // Get Total no. of Teams
    try{
        const apiUrl = url + 'api/employee/get?count';
        let response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer '+token
            }
        });
        response = await response.json();
        if(response.status == 200){
            document.getElementById('total-team').innerText = response.count;
        }
    }catch(error){
        console.log('error : ',error)
    }
}

getCounts();