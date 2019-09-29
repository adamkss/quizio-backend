import { NestMiddleware, Injectable } from "@nestjs/common";

@Injectable()
export class CorsMiddleware implements NestMiddleware {
    use(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "content-type");
        res.header("Access-Control-Allow-Methods", "OPTIONS,GET,POST");
        next();
    }
}
