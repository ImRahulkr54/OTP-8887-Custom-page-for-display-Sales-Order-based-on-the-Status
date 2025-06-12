/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/log', 'N/url'],
/**
 * @param{log} log
 * @param{url} url
 */
function(log, url) {
    

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
        
        if(scriptContext.fieldId==='cust_status' || scriptContext.fieldId==='cust_customer' ||
        scriptContext.fieldId==='cust_subsidiary' || scriptContext.fieldId==='cust_department' ) {

            var newRec = scriptContext.currentRecord;

            let status = newRec.getValue('cust_status');
            let customer = newRec.getValue('cust_customer');
            let subsidiary = newRec.getValue('cust_subsidiary');
            let department = newRec.getValue('cust_department');

            let suiteletUrl = url.resolveScript({
              scriptId: "customscript_jj_sl_sales_order_status",
              deploymentId: "customdeploy_jj_sl_sales_order_status",
              params: {
                        'returnStatus': status,
                        'returnCustomer': customer,
                        'returnSubsidiary': subsidiary,
                        'returnDepartment': department
                    }
            }); 

            window.location.href = suiteletUrl;

        }

    }



    return {
        fieldChanged: fieldChanged 
    };
    
});