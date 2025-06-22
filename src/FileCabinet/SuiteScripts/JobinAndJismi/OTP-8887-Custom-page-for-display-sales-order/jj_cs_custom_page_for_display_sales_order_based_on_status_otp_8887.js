/**
 * @NApiVersion 2.x
 * 
 * @NScriptType ClientScript
 * 
 * @NModuleScope SameAccount
 */

/************************************************************************************* 
 ********* 
 * 
 * OTP-8887 : Custom page for display sales order based on the status
 * 
 *************************************************************************************
 **********
 *
 * Author : Jobin and Jismi IT Services
 * 
 * Date Created : 09-Jun-2025
 * 
 * Description : This script is defined to execute the function, only when Save Record
 *               is triggered. After submitting Suitelet form, the script will receive
 *               the values & send back to Suitelet as parameters, there by enhance the
 *               interactivity & helps to dynamically update the sublist with data based
 *               on the filters.
 * 
 * REVISION HISTORY
 * 
 * @version 1.0 09-Jun-2025 : Created the initial build by JJ0400
 * 
 * 
***************************************************************************************
***********/

define(['N/log', 'N/url'],
/**
 * @param{log} log
 * @param{url} url
 */
function(log, url) {
  /**
   * Validation function to be executed when record is saved.
   *
   * @param {Object} scriptContext
   * @param {Record} scriptContext.currentRecord - Current form record
   * @returns {boolean} Return true if record is valid
   *
   * @since 2015.2
   */
  function saveRecord(scriptContext) {
    try {
      if (scriptContext.currentRecord) {
        getFieldChangedValue(scriptContext);
      }
    } catch (error) {
      log.error("error", error.message);
    }
    return false;
  }

  /**
   * Function to reset filters and redirect to the Suitelet URL.
   * @returns {void}
   *
   * @since 2015.2
   */

  function onResetFilters() {

    try {
      var suiteletUrl = url.resolveScript({
        scriptId: "customscript_jj_sl_sales_order_status",
        deploymentId: "customdeploy_jj_sl_sales_order_status",
      });
      window.location.href = suiteletUrl;
    } catch (e) {
      log.error("Reset Error", e.message);
    }

  }

  /**
   * Function to fetch and return values entered in the form
   * @param {Object} scriptContext
   * @param {Record} scriptContext.currentRecord - Current form record
   */

  function getFieldChangedValue(scriptContext) {
    try {
      let newRec = scriptContext.currentRecord;

      let customStatus = newRec.getValue("cust_status");
      let customCustomer = newRec.getValue("cust_customer");
      let customSubsidiary = newRec.getValue("cust_subsidiary");
      let customDepartment = newRec.getValue("cust_department");

      let suiteletUrl = url.resolveScript({
        scriptId: "customscript_jj_sl_sales_order_status",
        deploymentId: "customdeploy_jj_sl_sales_order_status",
        params: {
          returnStatus: customStatus,
          returnCustomer: customCustomer,
          returnSubsidiary: customSubsidiary,
          returnDepartment: customDepartment,
        },
      });

      window.onbeforeunload = null;
      window.location.href = suiteletUrl;
    } catch (error) {
      log.error("error", error.message);
    }
  }

  return {
    saveRecord: saveRecord,
    onResetFilters: onResetFilters,
  };
});
