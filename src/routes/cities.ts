import { Request, Response } from 'express';

import { addresses } from '../data/addresses';

export default class Cities {

    public getCitiesByTag = (req: Request, res: Response) => {
        console.log('test');
        let singleAddress = addresses[0];
        res.send(singleAddress);
    }
}