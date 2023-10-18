import {Request, Response, NextFunction} from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
    // If the authorization header is missing, reject the request
    if(!req.headers.authorization){
        res.status(401).send("Access Denied - Missing Authorization header");
        return;
    }

    // Hardcoded auth token, this would be generated / verified with e.g. a JWT library
    if(req.headers.authorization != 'bearer dGhlc2VjcmV0dG9rZW4='){
        res.status(401).send("Access Denied");
        return;
    }

    next();
}