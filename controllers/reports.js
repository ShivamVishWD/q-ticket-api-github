const { HandleError } = require("../helper/ErrorHandler");
const ticketModel = require("../models/ticket");
const projectModel = require("../models/project");
const adminModel = require("../models/admin");
const employeeModel = require("../models/employee");
const customerModel = require("../models/customer");
const moment = require("moment");

const collectionFields = {
  id: "_id",
  ticket: "TicketNumber",
  subject: "Subject",
  description: "Description",
  attachments: "Attachments",
  project: "Project",
  assign: "AssignTo",
  type: "TicketType",
  priority: "TicketPriority",
  logs: "Logs",
  estimate: "EstimateDateTime",
  actual: "ActualDateTime",
  status: "Status",
  logby: "LogBy",
  logtime: "LogTime",
  activity: "Activity",
  comment: "Comment",
  closeTime: "ClosedDateTime",
  reopenTime: "ReopenDateTime",
  by: "By",
  name: "Name",
  createby: "CreatedBy",
  updateby: "LastModifiedBy",
};

const statusList = [
  "New",
  "Open",
  "Ready To Dev",
  "Assign To Dev",
  "Dev Start",
  "Dev Done",
  "In QA",
  "QA Done",
  "Solved",
  "Closed",
  "Reopen",
];

const reportController = {
  count: async (req, res) => {
    try {
      let filterObj = {};
      if (req.query && Object.keys(req.query).length > 0) {
        for (let key in req.query)
          filterObj[collectionFields[key]] = req.query[key];
      }
      const last7Days = moment().subtract(7, "days").toDate();
      filterObj = {
        ...filterObj,
        IsActive: true,
        IsDeleted: false,
        createdAt: { $gte: last7Days },
      };

      const tickets = await ticketModel.find(filterObj);
      let statusCounts = {};
      let totalCount = 0;
      let wipCount = 0;
      statusList.forEach((status) => {
        statusCounts[status.toLowerCase().replace(/\s/g, "")] = 0;
      });

      // Count the occurrences of each status
      tickets.forEach((ticket) => {
        const status = ticket.Status.toLowerCase().replace(/\s/g, "");
        if (statusCounts.hasOwnProperty(status)) {
          statusCounts[status]++;
          totalCount++;
          if (status !== "new" && status !== "closed") {
            wipCount++;
          }
        }
      });

      return res.status(200).json({
        status: 200,
        message: "Total Tickets",
        count: { ...statusCounts, totalCount, wipCount },
      });
    } catch (error) {
      console.log("error : ", error);
      return HandleError(error);
    }
  },
};

module.exports = reportController;
