// const cron = require('node-cron');
// const { rsiTradingLogicInternal } = require('./tradingController');

// async function scheduleRSITrades() {
//     // Runs every 5 min
//     cron.schedule('*/5 * * * *', async () => {
//         try {
//             console.log('Running RSI Trading Logic...');
//             const result = await rsiTradingLogicInternal('BTC-USD');
//             console.log('Cron result:', result);
//         }   catch (error) {
//             console.error('Error during scheduled RSI trade:', error);
//         }
//     });
// }

// module.exports = {
//     scheduleRSITrades
// };