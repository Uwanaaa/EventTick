import cron from 'node-cron';
import { Matches } from '../models/matches';


cron.schedule('*/10 * * * *', async () => { // Runs every 10 minutes
    const now = new Date();
    const expiredMatches = await Matches.find({ expiresAt: now.toISOString , isActive: true });

    for (let match of expiredMatches) {
        match.isActive = false;
        await match.save();
        console.log(`Match between ${match.user1} and ${match.user2} expired.`);
    }
});
