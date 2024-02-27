function customerOnboardMailTemplate(name, email, userid, password, projectName){
    return `<br/>
    <b>Dear ${name},</b>
    <br/>
    <p>We're glad to onboard you on <b>Q-Ticket <i style="font-size: 12px;">(Powered by Quadrafort Technologies)</i></b>, where you can create and view your tickets regarding to <b>${projectName}</b></p>
    <p>You can access the portal by clicking the following link :<br/><a href="http://localhost:5001/">http://localhost:5001/</a></p>
    <p>For you benefit we've created a login credential and you can access the portal by below credential :</p>
    <b>User ID : ${userid || email}</b>
    <br/>
    <b>Temporary Password : ${password}</b>
    <br/>
    <p style="font-size: 14px;">Note : Above User ID is case sensitive, kindly copy this and paste it to form in login page</p>
    <br/>
    <b>Regards,</b>
    <br/>
    <b>Q-Ticket <i style="font-size: 12px;">(Powered by Quadrafort Technologies)</i></b>`;
}

function teamMemberOnboardMailTamplate(name, email, userid, password){
    return `<br/>
    <b>Dear ${name},</b>
    <br/>
    <p>We're glad to onboard you on <b>Q-Ticket <i style="font-size: 12px;">(Powered by Quadrafort Technologies)</i></b>, where you can view and log your tickets regarding to tickets.</p>
    <p>You can access the portal by clicking the following link :<br/><a href="http://localhost:5001/">http://localhost:5001/</a></p>
    <p>For you benefit we've created a login credential and you can access the portal by below credential :</p>
    <b>User ID : ${userid || email}</b>
    <br/>
    <b>Temporary Password : ${password}</b>
    <br/>
    <p style="font-size: 14px;">Note : Above User ID is case sensitive, kindly copy this and paste it to form in login page</p>
    <br/>
    <b>Regards,</b>
    <br/>
    <b>Q-Ticket <i style="font-size: 12px;">(Powered by Quadrafort Technologies)</i></b>`;
}

module.exports = { customerOnboardMailTemplate, teamMemberOnboardMailTamplate }