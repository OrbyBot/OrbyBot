const ServiceNow = require('servicenow-rest-api');

const serviceNow = new ServiceNow(
  process.env.SN_DOMAIN,
  process.env.SN_USER,
  process.env.SN_PASSWORD,
);

serviceNow.Authenticate();

export default serviceNow;
