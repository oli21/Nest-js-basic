import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {JwtModule} from "@nestjs/jwt"
import { JwtStrategy } from './strategy';
import { ConfigService } from '@nestjs/config';


@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ConfigService],
  imports: [JwtModule.register({})]
})
export class AuthModule {}
