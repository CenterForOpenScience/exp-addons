import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
    // TODO: What is the endpoint to find a list of all collections?
    findRecordUrlTemplate: '{+host}/v1/id/collections/{+jamNamespace}.{+id}',
    createRecordUrlTemplate: '{+host}/{+namespace}/namespaces/{+jamNamespace}/collections'
});
