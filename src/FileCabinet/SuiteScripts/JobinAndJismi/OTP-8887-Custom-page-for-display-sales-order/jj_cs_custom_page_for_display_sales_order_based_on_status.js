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
 * Description : This script is defined to execute the function, only when field change
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
    function (log, url) {


        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {

            try {

              if ( scriptContext.fieldId === "cust_status" ||  scriptContext.fieldId === "cust_customer" ||
                   scriptContext.fieldId === "cust_subsidiary" ||  scriptContext.fieldId === "cust_department" ) {

                    getFieldChangedValue(scriptContext);
                }

            } catch (error) {

              log.error("error", error.message);

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

              window.location.href = suiteletUrl;

            } catch (error) {

              log.error("error", error.message);
              
            }

        }

        return {
            fieldChanged: fieldChanged
        };

    });