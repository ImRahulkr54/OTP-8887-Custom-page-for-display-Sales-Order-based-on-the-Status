/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

/******************************************************************************* 
 ********* 
 * 
 * OTP-8887 : Custom page for display sales order based on the status
 * 
 *******************************************************************************
 **********
 *
 * Author : Jobin and Jismi IT Services
 * 
 * Date Created : 09-Jun-2025
 * 
 * Description : This script is defined to custom form that will display sales orders
 *               which need to be fulfilled or billed. The form consists of a Sublist
 *               with several columns and filters such as Status, Subsidiary, Customer
 *               & Department. Data displayed in the Sublist should be update dynamically
 *               based on these filters.
 * 
 * REVISION HISTORY
 * 
 * @version 1.0 09-Jun-2025 : Created the initial build by JJ0400
*/

define(["N/log", "N/record", "N/search", "N/ui/serverWidget"], /**
 * @param{log} log
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */ (log, record, search, serverWidget) => {

    /**
     * Defines the Suitelet script trigger point.
     * @param {Object} scriptContext
     * @param {ServerRequest} scriptContext.request - Incoming request
     * @param {ServerResponse} scriptContext.response - Suitelet response
     * @since 2015.2
     */
    const onRequest = (scriptContext) => {

      try {

        if (scriptContext.request.method === "GET") {

          let form = serverWidget.createForm({
            title: "Sales Order",
          });

          form.clientScriptFileId = 2802;

          filterSublist(form, scriptContext, serverWidget, search);

          let filterSetup = createFilterSet(scriptContext);

          showResult(filterSetup, form, serverWidget, search);

          scriptContext.response.writePage({ pageObject: form });

        }

      } catch (error) {

        log.error("error :", error.message);
        
      }
    };

    /**
     * Create field group, filters, customer search and sublist.
     * @param {Form} form - UI form object.
     * @param {Object} scriptContext
     * @param {Object} serverWidget - serverWidget module.
     * @param {Object} search - search module.
     */

    function filterSublist(form, scriptContext, serverWidget, search) {

      let fieldGroup = form.addFieldGroup({
        id: "fieldGroup",
        label: "Filters",
      });

      let statusField = form.addField({
        id: "cust_status",
        type: serverWidget.FieldType.SELECT,
        label: "Status",
        container: "fieldGroup",
      });

      statusField.addSelectOption({
        text: "",
        value: "",
      });

      statusField.addSelectOption({
        text: "Pending Fulfillment",
        value: "SalesOrd:B",
      });

      statusField.addSelectOption({
        text: "Partially Fulfilled",
        value: "SalesOrd:D",
      });

      statusField.addSelectOption({
        text: "Pending Billing/Partially Fulfilled",
        value: "SalesOrd:E",
      });

      statusField.addSelectOption({
        text: "Pending Billing",
        value: "SalesOrd:F",
      });

      let customerField = form.addField({
        id: "cust_customer",
        type: serverWidget.FieldType.SELECT,
        label: "Customer",
        container: "fieldGroup",
      });

      let subsidiaryField = form.addField({
        id: "cust_subsidiary",
        type: serverWidget.FieldType.SELECT,
        label: "Subsidiary",
        source: "subsidiary",
        container: "fieldGroup",
      });

      let departmentField = form.addField({
        id: "cust_department",
        type: serverWidget.FieldType.SELECT,
        label: "Department",
        source: "department",
        container: "fieldGroup",
      });

      let custSearch = search.create({
        title: "Customer Search JJ",
        id: "jj_customer_search",
        type: search.Type.CUSTOMER,
        filters: [["isinactive", "is", "false"]],
        columns: ["entityid", "internalid"],
      });

      customerField.addSelectOption({
        text: "",
        value: "",
      });

      let runSearch = custSearch.run().each(function (result) {
        customerField.addSelectOption({
          value: result.getValue("internalid"),
          text: result.getValue("entityid"),
        });

        return true;
      });

      let customSublist = form.addSublist({
        id: "custpage_salesorder_sublist",
        type: serverWidget.SublistType.LIST,
        label: "Sales Orders",
      });

      customSublist.addField({
        id: "internal_id",
        label: "Internal ID",
        type: serverWidget.FieldType.INTEGER,
      });

      customSublist.addField({
        id: "doc_number",
        label: "Document No",
        type: serverWidget.FieldType.INTEGER,
      });

      customSublist.addField({
        id: "doc_date",
        label: "Date",
        type: serverWidget.FieldType.DATE,
      });

      customSublist.addField({
        id: "doc_status",
        label: "Status",
        type: serverWidget.FieldType.TEXT,
      });

      customSublist.addField({
        id: "customer_name",
        label: "Customer Name",
        type: serverWidget.FieldType.TEXT,
      });

      customSublist.addField({
        id: "cust_subsidiary",
        label: "Subsidiary",
        type: serverWidget.FieldType.TEXT,
      });

      customSublist.addField({
        id: "cust_department",
        label: "Department",
        type: serverWidget.FieldType.TEXT,
      });

      customSublist.addField({
        id: "cust_class",
        label: "Class",
        type: serverWidget.FieldType.TEXT,
      });

      customSublist.addField({
        id: "sub_total",
        label: "Sub Total",
        type: serverWidget.FieldType.CURRENCY,
      });

      customSublist.addField({
        id: "tax_total",
        label: "Tax Total",
        type: serverWidget.FieldType.CURRENCY,
      });

      customSublist.addField({
        id: "grand_total",
        label: "Grand Total",
        type: serverWidget.FieldType.CURRENCY,
      });

      let newStatus = scriptContext.request.parameters.returnStatus;
      let newCustomer = scriptContext.request.parameters.returnCustomer;
      let newSubsidiary = scriptContext.request.parameters.returnSubsidiary;
      let newDepartment = scriptContext.request.parameters.returnDepartment;

      statusField.defaultValue = newStatus || "";
      customerField.defaultValue = newCustomer || "";
      subsidiaryField.defaultValue = newSubsidiary || "";
      departmentField.defaultValue = newDepartment || "";

    }

    /**
     * Builds the filter set for sales order search based on request parameters.
     * @param {Object} scriptContext
     * @returns {Array} filterSet - The array of filters to apply to the sales order search.
     */

    function createFilterSet(scriptContext) {

      let newStatus = scriptContext.request.parameters.returnStatus;
      let newCustomer = scriptContext.request.parameters.returnCustomer;
      let newSubsidiary = scriptContext.request.parameters.returnSubsidiary;
      let newDepartment = scriptContext.request.parameters.returnDepartment;

      let filterSet = [["mainline", "is", "T"]];

      if (newStatus || (newCustomer && newCustomer !== "") || newSubsidiary || newDepartment) {

        if (newStatus) {
          filterSet.push("AND", ["status", "is", newStatus]);
        }

        if (newCustomer && newCustomer !== "") {
          filterSet.push("AND", ["customermain.internalid", "anyof", newCustomer]);
        }

        if (newSubsidiary) {
          filterSet.push("AND", ["subsidiary", "is", newSubsidiary]);
        }

        if (newDepartment) {
          filterSet.push("AND", ["department", "is", newDepartment]);
        }

      }

      return filterSet;

    }

    /**
   * Runs the sales order search using filters and refresh the sublist with results.
   * @param {Array} filterSetup - The filters to apply to the sales order search.
   * @param {Form} form - UI form object.
   * @param {Object} serverWidget - serverWidget module.
   * @param {Object} search - search module.
   */

    function showResult(filterSetup, form, serverWidget, search) {

      let customSublist = form.getSublist({ id: "custpage_salesorder_sublist" });

      let orderSearch = search.create({
        title: "Filter Search JJ",
        id: "jj_filter_search",
        type: search.Type.SALES_ORDER,
        filters: filterSetup,
        columns: [
          "internalid",
          "tranid",
          "trandate",
          "status",
          "entity",
          "subsidiary",
          "department",
          "class",
          search.createColumn({
            name: "formulanumeric",
            formula:
              "NVL2({taxtotal},{fxamount} - {taxtotal}/{currency.exchangerate},{fxamount})",
            label: "Subtotal",
          }),
          search.createColumn({
            name: "formulacurrency",
            formula: "{taxtotal}/{currency.exchangerate}",
            label: "Taxtotal",
          }),
          "fxamount",
        ],
      });

      let lineCount = 0;

      let runOrderSearch = orderSearch.run().each(function (result) {

        customSublist.setSublistValue({
          id: "internal_id",
          line: lineCount,
          value: result.getValue("internalid") || "",
        });

        customSublist.setSublistValue({
          id: "doc_number",
          line: lineCount,
          value: result.getValue("tranid") || "",
        });

        customSublist.setSublistValue({
          id: "doc_date",
          line: lineCount,
          value: result.getValue("trandate") || "",
        });

        customSublist.setSublistValue({
          id: "doc_status",
          line: lineCount,
          value: result.getValue("status") || "",
        });

        customSublist.setSublistValue({
          id: "customer_name",
          line: lineCount,
          value: result.getText("entity") || "",
        });

        customSublist.setSublistValue({
          id: "cust_subsidiary",
          line: lineCount,
          value: result.getText("subsidiary") || "",
        });

        customSublist.setSublistValue({
          id: "cust_department",
          line: lineCount,
          value: result.getText("department") || "Not Assigned",
        });

        customSublist.setSublistValue({
          id: "cust_class",
          line: lineCount,
          value: result.getText("class") || "Not Assigned",
        });

        customSublist.setSublistValue({
          id: "sub_total",
          line: lineCount,
          value: Number(result.getValue({ name: "formulanumeric" })).toFixed(2),
        });

        customSublist.setSublistValue({
          id: "tax_total",
          line: lineCount,
          value: Number(result.getValue({ name: "formulacurrency" }) || "0.00").toFixed(2),
        });

        customSublist.setSublistValue({
          id: "grand_total",
          line: lineCount,
          value: result.getValue("fxamount") || "",
        });

        lineCount++;

        return true;
      });

    }

    return { onRequest };
  });
