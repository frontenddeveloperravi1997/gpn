# Corporate Headless application for Global Payments

## Developers - Getting Started

### Export SIF root certificate
To run JSS locally, you need to let nodejs know about the SIF root cert so it will accept the local self signed certificates. This is [Sitecore's walthrough on how to do this](https://doc.sitecore.com/xp/en/developers/hd/latest/sitecore-headless-development/walkthrough--configuring-sitecore-ca-certificates-for-node-js.html). Our recommendation is to use the environment variable method so that you don't have to change the `package.json` file. 

### Run JSS
Ensure that your Sitecore instance is up and running.
1. Checkout the repository
2. Push the new TDS project (GPN.Project.CorporateHeadless.Master) into your local Sitecore instance
3. Make a copy of .env.example file and name it .env.local (this file will not be committed to the repository)
4. Create a Sitecore API Key in "/sitecore/system/Settings/Services/API Keys" and configure CORS and Allowed Controllers to *
5. Ensure the SITECORE_API_HOST, SITECORE_API_KEY (from above) and GRAPH_QL_ENDPOINT point to your local Sitecore instance.
6. Open a Terminal and navigate to src/head/corporate
7. Run "npm install"
8. Run "npm run start:connected"
9. Open a browser and navigate to http://localhost:3000

_Note: changes to the code will automatically be recompiled when running in DEV mode._

## Developers - Connecting your local to a non-local environment

1. Update your local .env file
- SITECORE_API_HOST and GRAPH_QL_ENDPOINT point to the environment, i.e. "https://gpn-sc-xp-u2-cm.dataweavers.io" for UAT2.
- SITECORE_API_KEY - to the API key that is in the environment stored under "/sitecore/system/Settings/Services/API Keys"
2. Run "npm run start:connected"

## Developers - Access the GraphQL playground - Edge Schema Endpoint

https://doc.sitecore.com/xp/en/developers/hd/latest/sitecore-headless-development/sitecore-experience-edge-for-xm-preview-graphql-endpoint.html

1. Login to the Sitecore CM 
2. Navigate to "https://{sitecore-instance}/sitecore/api/graph/edge/ui", i.e. https://gpn-sc-xp-u2-cm.dataweavers.io/sitecore/api/graph/edge/ui
3. Add in the Sitecore API Key to the HTTP Headers section at the bottom:
{
  "sc_apikey":"00000000-0000-0000-0000-000000000000"
}
4. Paste or write query (Examples - https://doc.sitecore.com/xp/en/developers/hd/latest/sitecore-headless-development/query-examples-for-the-delivery-api.html#get-an-item-by-id-or-path)
5. Run the query 

Note: this is specifically for the edge schema, there are other endpoints, such as those for management. It will allow you to search content, get item info, gather the sites available and get the sitemap info. They are the content schemas currently available.

## Developers - Good Practice

# Exclude calls to third party services when DISABLE_SSG_FETCH is enabled
When creating a component or service that is dependent on a third party service, i.e. GraphQL call to Sitecore, it is essential that you wrap the call in a conditional statement to disable when DISABLE_SSG_FETCH is enabled, i.e.

if (!process.env.DISABLE_SSG_FETCH) {
    //this code will only run when we are building in an SSG mode.
}

This is to ensure that the pipeline builds can run in a disconnected state for verification and editing purposes.

# Exclude unnecesary GraphQL or third party calls when in editing mode

The Sitecore layout service will return layout data. In this layout data we can understand if the page is in an editing mode (layoutData.sitecore.context.pageEditing)

"const isPageEditing = layoutData.sitecore.context.pageEditing;"

It is good practice that any calls to the services, i.e. GraphQL calls or other external parties be wrapped in a conditional statement to disable them if in an editing mode, to improve performance.

# Consider caching

Caching can be used in the application, however OOTB this is not share across scaled instances and therefore it should be short lived and not dependent on updates down to the specific second.

See JSS’s memory cache usage as example: DictionaryService and CacheClient.

# Consider where and when component datasources will execute queries to dependent resources

Ensure you are not calling third parties or the GraphQL endpoints unnecessarily. i.e. consider when middleware will run and/or if a component will execute a call unnecessarily.

## Developers - Troubleshooting

### API Key issues

1. Ensure you have an API key generated under "/sitecore/system/Settings/Services/API Keys". If it doesn't exist then create it. It can help to publish it to put it in the cache. 
2. Set the SITECORE_API_KEY value in the .env or .env.local file in your codebase. 

