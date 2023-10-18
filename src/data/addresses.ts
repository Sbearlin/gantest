import parser from 'stream-json';
import StreamArray from 'stream-json/streamers/StreamArray';
import Chain from 'stream-chain';
import fs from 'fs';

import { IAddress } from '../interfaces/address';

export const importJson = async () => {
    console.log("Initializing app, loading data in");
    const pipeline = new Chain([
        fs.createReadStream('./src/data/addresses.json'),
        parser(),
        new StreamArray(),
    ]);

    for await ( const {value} of pipeline ) {
        addresses.push(value);
    }
    console.log("All address data loaded");
}

export var addresses : IAddress[] = [];