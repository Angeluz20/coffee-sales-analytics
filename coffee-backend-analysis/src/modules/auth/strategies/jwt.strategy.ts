import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy as strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        return payload; 
    }
}