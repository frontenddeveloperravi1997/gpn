import * as appInsights from 'applicationinsights';
import { DefaultAzureCredential } from '@azure/identity';
import debug from 'lib/_platform/logging/debug-log';

const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
// complete = dependency-corrolation,requests,performance,performance-extended,exceptions,dependencies,console,console-log,live
const configurationSettings = (process.env.APPLICATIONINSIGHTS_CONFIGURATION || '').split(',');

if (connectionString) {
  appInsights
    .setup(connectionString)
    .setAutoDependencyCorrelation(configurationSettings.includes('dependency-corrolation'))
    .setAutoCollectRequests(configurationSettings.includes('requests'))
    .setAutoCollectPerformance(
      configurationSettings.includes('performance'),
      configurationSettings.includes('performance-extended')
    )
    .setAutoCollectExceptions(configurationSettings.includes('exceptions'))
    .setAutoCollectDependencies(configurationSettings.includes('dependencies'))
    .setAutoCollectConsole(
      configurationSettings.includes('console'),
      configurationSettings.includes('console-log')
    )
    .setUseDiskRetryCaching(true)
    .setSendLiveMetrics(configurationSettings.includes('live'))
    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI);

  //https://learn.microsoft.com/en-us/azure/azure-monitor/app/azure-ad-authentication?tabs=nodejs
  const authenticatedUser = process.env.AZURE_CLIENT_ID;
  if (authenticatedUser) {
    //DefaultAzureCredential will use AZURE_CLIENT_ID if it exists
    const credential = new DefaultAzureCredential();
    appInsights.defaultClient.config.aadTokenCredential = credential;

    debug.dataweavers('Application Insights Integration - applying default credential');
  }

  appInsights.start();

  debug.dataweavers('Initialised Application Insights Integration');
}
