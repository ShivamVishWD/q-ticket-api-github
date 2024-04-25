function customerOnboardMailTemplate(name, email, userid, password, projectName){
    return `<br/>
    <b>Hi ${name},</b>
    <br/>
    <p>We're glad to onboard you on <b>Q-Ticket by Quadrafort</b>, where you can create and view your tickets regarding to <b>${projectName}</b></p>
    <p>You can access the portal by clicking the following link :<br/><a href="https://qticket.quadrafort.com/login">https://qticket.quadrafort.com/login</a></p>
    <p>For you benefit we've created a login credential and you can access the portal by below credential :</p>
    <b>User ID : ${userid || email}</b>
    <br/>
    <b>Temporary Password : ${password}</b>
    <br/>
    <p style="font-size: 14px;">Note : Above User ID is case sensitive, kindly copy this and paste it to form in login page</p>
    <br/>
    <b>Regards,</b>
    <br/>
    <b>Q-Ticket by Quadrafort</b>`;
}

function teamMemberOnboardMailTamplate(name, email, userid, password){
    return `<br/>
    <b>Hi ${name},</b>
    <br/>
    <p>We're glad to onboard you on <b>Q-Ticket by Quadrafort</b>, where you can view and log your tickets regarding to tickets.</p>
    <p>You can access the portal by clicking the following link :<br/><a href="https://adminqticket.quadrafort.com/">https://adminqticket.quadrafort.com/</a></p>
    <p>For you benefit we've created a login credential and you can access the portal by below credential :</p>
    <b>User ID : ${userid || email}</b>
    <br/>
    <b>Temporary Password : ${password}</b>
    <br/>
    <p style="font-size: 14px;">Note : Above User ID is case sensitive, kindly copy this and paste it to form in login page</p>
    <br/>
    <b>Regards,</b>
    <br/>
    <b>Q-Ticket by Qudrafort></b>`;
}

function ticketCreationMailTemplate(requestName, projectName, ticketNo, updateDate){
    return `
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
            <td style="padding: 20px 0; text-align: center;">
                <h3 style="margin: 0;">New Ticket Created</h3>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px 0;">
                <p>Hi ${requestName},</p>
                <p>Thank you for reaching out.</p>
                <p>A new ticket has been created in the Q-Ticket System for project: <strong>${projectName}</strong>. Our team is currently working on assigning it to an available team member. You will receive further updates via email.</p>
                <p><strong>Ticket ID:</strong> ${ticketNo} | <strong>Date:</strong> ${updateDate}</p>
                <p>If you have any further questions or concerns, please let us know.</p>
                <p>Thanks,</p>
                <p>Q-Ticket by Quadrafort</p>
            </td>
        </tr>
    </table>`;
}

function ticketUpdateMailTemplate(updateType, assignToName, customerName, ticketNo, estimateDate, currentStatus){
    if(updateType == 'assign'){
        return `
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="720">
            <tr>
                <td style="padding: 20px 0; text-align: center;">
                    <h3 style="margin: 0;">Ticket Assign to ${assignToName}</h3>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px 0;">
                    <p>Hi ${customerName},</p>
                    <p>Ticket No: ${ticketNo} has been updated and assigned to team member: ${assignToName}. The estimated turn around time (TAT) will be updated shortly.</p>
                    <p>Thanks,</p>
                    <p>Q-Ticket by Quadrafort</p>
                </td>
            </tr>
        </table>`;
    }
    if(updateType == 'eta'){
        return `
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="720">
            <tr>
                <td style="padding: 20px 0; text-align: center;">
                    <h3 style="margin: 0;">Ticket turn around time (TAT) has been Updated</h3>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px 0;">
                    <p>Hi ${customerName},</p>
                    <p>Ticket No: ${ticketNo} has been updated, and the estimated turn around time (TAT) is ${estimateDate}.</p>
                    <p>Thanks,</p>
                    <p>Q-Ticket by Quadrafort</p>
                </td>
            </tr>
        </table>`;
    }
    if(updateType == 'status'){
        return `
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="720">
            <tr>
                <td style="padding: 20px 0; text-align: center;">
                    <h3 style="margin: 0;">Ticket Status Update to ${currentStatus}</h3>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px 0;">
                    <p>Hi ${customerName},</p>
                    <p>We're providing an update on the status of Ticket No: ${ticketNo}. The current status is now set to ${currentStatus}. Our team is actively working on addressing the issue or request.</p>
                    <p>If you have any questions or need further clarification, feel free to reach out.</p>
                    <p>Thanks,</p>
                    <p>Q-Ticket by Quadrafort</p>
                </td>
            </tr>
        </table>`;
    }
    if(updateType == 'close'){
        return `
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="720">
            <tr>
                <td style="padding: 20px 0; text-align: center;">
                    <h3 style="margin: 0;">Ticket Status Update</h3>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px 0;">
                    <p>Hi ${customerName},</p>
                    <p>WWe're pleased to inform you that your ticket (Ticket No: ${ticketNo}) has been successfully resolved. If you are satisfied with the resolution, please click the "Close" button below. If you require further assistance or if the issue persists, you can click the "Reopen" button.</p>
                    <div><button>Closed</button><button><Reopen/button></div>
                    <p>Your feedback is valuable to us, and we appreciate your cooperation.</p>
                    <p>Thanks,</p>
                    <p>Q-Ticket by Quadrafort</p>
                </td>
            </tr>
        </table>`;
    }
}

module.exports = { customerOnboardMailTemplate, teamMemberOnboardMailTamplate, ticketCreationMailTemplate, ticketUpdateMailTemplate }