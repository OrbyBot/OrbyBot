const sn = require('servicenow-rest-api');

const ServiceNow = new sn(
  process.env.SN_DOMAIN,
  process.env.SN_USER,
  process.env.SN_PASSWORD,
);

ServiceNow.Authenticate();

export default ServiceNow;
// ServiceNow.getSampleData('change_request', res => {
//   //
//   console.log(res);
// });
