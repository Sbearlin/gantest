import request from 'supertest';

import {app} from '../app';

describe('GET /', () => {

    it('Should return 200 and return Gan Basic Setup', (done) => {
        request(app)
            .get(`/`)
            .expect(200)
            .end((err, res) => {
                if(err) return done(err);
                console.log(res.body);
                expect(res.body).toMatch("Gan Basic setup")
                done()
            })
    })
})