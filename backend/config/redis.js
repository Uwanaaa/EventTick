import redis from 'redis'

export const redisClient = redis.createClient({
    'url':'rediss://red-cqojq3lds78s73c1tqs0:e5mtKopDCa1u6tSLYyEvuD9tBPdjJQGn@frankfurt-keyvalue.render.com:6379'
});

redisClient.on('connect', () => {
    console.log('Successfully connected to redis');
})

redisClient.on('error', (e) => {
    // console.error(` Redis exprienced an error: ${e}`);
})

