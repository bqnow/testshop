export const TEST_USERS = {
    standard: {
        username: process.env.TEST_USER_NAME || 'consultant',
        password: process.env.TEST_USER_PASSWORD || 'pwd'
    }
};

export const PRODUCTS = {
    laptop: {
        id: '1',
        name: 'Premium Wireless Headphones', // ID 1 in seed data
        category: 'Electronics'
    },
    buggyValues: {
        id: '999'
    }
};
