import supertest from 'supertest';

import {app} from '../app';

describe('GET /', () => {

    it('Should return 200 and return Gan Basic Setup', async () => {
        const test = await supertest(app)
            .get('/')
            .expect(200);

        expect(test.text).toBe('Gan Basic setup');
    })
});