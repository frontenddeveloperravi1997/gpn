export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('### Initialising Application Insights Connectivity ###');
    await import('lib/_platform/logging/applicationInsights');
  }
  return;
}
