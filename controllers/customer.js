const { HandleError } = require("../helper/ErrorHandler");
const token = require("../middleware/JWT");
const customerModel = require("../models/customer");
const projectModel = require("../models/project");
const bcrypt = require("bcrypt");
const {
  customerOnboardMailTemplate,
} = require("../templates/mail/sendMailTemplates");
const { sendEmail } = require("../service/Mail");
require("dotenv/config");

const collectionFields = {
  id: "_id",
  name: "Name",
  email: "Email",
  password: "Password",
  project: "Project",
  active: "IsActive",
  delete: "IsDeleted",
  permission: "Permission",
  permissionType: "PermissionType",
  createby: "CreatedBy",
  updateby: "LastModifiedBy",
};

const customerController = {
  get: async (req, res) => {
    try {
      let filterObj = {};
      if (req.query && Object.keys(req.query).length > 0) {
        for (let key in req.query)
          filterObj[collectionFields[key]] = req.query[key];
      }

      filterObj = { ...filterObj, IsActive: true, IsDeleted: false };

      const result = await customerModel
        .find(filterObj)
        .populate("Project")
        .populate("CreatedBy")
        .populate("LastModifiedBy")
        .select("-Password");
      return res
        .status(200)
        .json({ status: 200, message: "Records Fetched", data: result });
    } catch (error) {
      return HandleError(error);
    }
  },

  count: async (req, res) => {
    try {
      let filterObj = {};
      if (req.query && Object.keys(req.query).length > 0) {
        for (let key in req.query)
          filterObj[collectionFields[key]] = req.query[key];
      }

      filterObj = { ...filterObj, IsActive: true, IsDeleted: false };

      const count = await customerModel.find(filterObj).countDocuments();
      return res
        .status(200)
        .json({ status: 200, message: "Total Customer", count: count });
    } catch (error) {
      return HandleError(error);
    }
  },

  login: async (req, res) => {
    try {
      if (!req.body && Object.keys(req.body).length == 0)
        return res
          .status(200)
          .json({ status: 400, message: "Request Body should not be empty" });

      let mandatoryFields = [];

      if (!req.body.email) mandatoryFields.push("email");
      if (!req.body.password) mandatoryFields.push("password");

      if (mandatoryFields.length > 0)
        return res.status(200).json({
          status: 400,
          message: "Mandatory Fields Error",
          fields: mandatoryFields,
        });

      const result = await customerModel
        .findOne({ Email: String(req.body.email).toLowerCase() })
        .populate("Project");
      if (result != null) {
        let valid = bcrypt.compareSync(req.body.password, result?.Password);
        if (valid) {
          const responseObj = {
            _id: result?._id,
            name: result?.Name,
            email: result?.Email,
            profile: "customer",
          };
          let jwtToken = await token.generateToken(responseObj);
          req.session.userotken = jwtToken?.token;
          req.session.userid = result?._id;
          req.session.profile = "customer";
          req.session.username = result?.Name;
          return res.status(200).json({
            status: 200,
            message: "Login Successful",
            user: {
              ...responseObj,
              project: {
                id: result?.Project?._id,
                name: result?.Project?.Name,
              },
            },
            token: jwtToken?.token,
          });
        }
      }
      return res.status(200).json({
        status: 401,
        message: "Wrong Credentials",
      });
    } catch (error) {
      return HandleError(error);
    }
  },

  verify: async (req, res) => {
    try {
      if (!req.body && Object.keys(req.body).length == 0)
        return res
          .status(200)
          .json({ status: 400, message: "Request Body should not be empty" });

      let mandatoryFields = [];

      if (!req.body.oldPassword) mandatoryFields.push("oldPassword");
      if (!req.body.newPassword) mandatoryFields.push("newPassword");

      if (mandatoryFields.length > 0)
        return res.status(200).json({
          status: 400,
          message: "Mandatory Fields Error",
          fields: mandatoryFields,
        });

      const getCustomer = await customerModel.findOne({
        _id: req?.authData?._id,
      });

      if (
        getCustomer &&
        bcrypt.compareSync(req.body.oldPassword, getCustomer?.Password)
      ) {
        const result = await customerModel.findOneAndUpdate(
          { _id: getCustomer?._id },
          { Password: bcrypt.hashSync(req.body.newPassword, 10) }
        );
        if (result)
          return res
            .status(200)
            .json({ status: 200, message: "Password updated" });
        else
          return res
            .status(200)
            .json({ status: 400, message: "Password not updated" });
      }
      else{
        return res
            .status(200)
            .json({ status: 401, message: "Password do not match" });
      }
    } catch (error) {
      return HandleError(error);
    }
  },

  update: async (req, res) => {
    try {
      if (
        req?.authData &&
        (req?.authData?.profile != "admin" ||
          req?.authData?.profile != "customer")
      )
        return res
          .status(200)
          .json({ status: 400, message: "Permission Denied" });

      let filterObj = {};
      let updateObj = {};

      if (!req.query || Object.keys(req.query).length == 0)
        return res
          .status(200)
          .json({ status: 400, message: "Filter crieteria missing" });

      if (!req.body || Object.keys(req.body).length == 0)
        return res
          .status(200)
          .json({ status: 400, message: "Update field is missing" });

      for (let key in req.query)
        filterObj[collectionFields[key]] = req.query[key];

      for (let key in req.body)
        updateObj[collectionFields[key]] = req.body[key];

      updateObj[collectionFields["updateby"]] = req?.authData?._id;
      const result = await customerModel
        .findOneAndUpdate(filterObj, updateObj, { new: true })
        .exec();
      if (result?._id)
        return res.status(200).json({ status: 200, message: "Record updated" });
      else
        return res
          .status(200)
          .json({ status: 400, message: "Record updation failed" });
    } catch (error) {
      return HandleError(error);
    }
  },

  delete: async (req, res) => {
    try {
      if (req?.authData && req?.authData?.profile != "admin")
        return res
          .status(200)
          .json({ status: 400, message: "Permission Denied" });

      let filterObj = {};

      if (!req.params || Object.keys(req.params).length == 0)
        return res
          .status(200)
          .json({ status: 400, message: "Filter crieteria missing" });

      for (let key in req.query)
        filterObj[collectionFields[key]] = req.query[key];

      const result = await customerModel
        .findOneAndUpdate(
          filterObj,
          {
            IsDeleted: true,
            IsActive: false,
            LastModifiedBy: req?.authData?._id,
          },
          { new: true }
        )
        .exec();
      if (result?._id)
        return res.status(200).json({ status: 200, message: "Record deleted" });
      else
        return res
          .status(200)
          .json({ status: 400, message: "Record deletion failed" });
    } catch (error) {
      return HandleError(error);
    }
  },

  insert: async (req, res) => {
    try {
      if (req?.authData && req?.authData?.profile != "admin")
        return res
          .status(200)
          .json({ status: 400, message: "Permission Denied" });

      if (!req.body || Object.keys(req.body).length == 0)
        return res
          .status(200)
          .json({ status: 400, message: "Request Body should not be empty" });

      let mandatoryFields = [];
      if (!req.body.name) mandatoryFields.push("name");
      if (!req.body.email) mandatoryFields.push("email");
      if (!req.body.password) mandatoryFields.push("password");
      if (!req.body.project) mandatoryFields.push("project");

      if (mandatoryFields.length > 0)
        return res.status(200).json({
          status: 400,
          message: "Mandatory Fields Error",
          fields: mandatoryFields,
        });
      const getData = await customerModel.findOne({ Email: String(req.body.email).toLowerCase() });
      if (getData?._id)
        return res
          .status(200)
          .json({ status: 400, message: "This Email is already used" });
      let decodedPassword = req.body.password;
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      let body = {};
      for (let key in req.body)
        body[collectionFields[key]] = key == 'email' ? String(req.body[key]).toLowerCase() : req.body[key];

      body[collectionFields["createby"]] = req?.authData?._id;
      body[collectionFields["updateby"]] = req?.authData?._id;
      const result = await new customerModel(body).save();
      const projectUpdate = await projectModel
        .findOneAndUpdate(
          { _id: req.body.project },
          { Customer: result?._id },
          { new: true }
        )
        .exec();
      if (result?._id) {
        if (process.env.ENVIRONMENT != "DEV")
        /*
          sendEmail(
            result?.Email,
            "Welcome to Q-Ticket",
            "",
            customerOnboardMailTemplate(
              result?.Name,
              result?.Email,
              result?.Email,
              decodedPassword,
              projectUpdate?.Name
            )
          );
        */
        return res
          .status(200)
          .json({ status: 200, message: "Customer Inserted", data: result });
      } else
        return res
          .status(200)
          .json({ staus: 400, message: "Customer Insertion failed" });
    } catch (error) {
      return HandleError(error);
    }
  },
};

module.exports = customerController;
