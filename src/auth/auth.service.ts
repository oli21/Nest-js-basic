import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    delete dto.password;
    console.log(dto);
    try {
      const user = await this.prisma.user.create({
        data: {
          ...dto,
          hash,
        },
      });
      delete user.hash;
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('email already exists');
        }
      }

      throw error;
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }

    const isPasswordMatch = await argon.verify(user.hash, dto.password);

    if (!isPasswordMatch) {
      throw new ForbiddenException("Credential doesn't match");
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const access_token = await this.jwt.signAsync(
      { sub: userId, email },
      { expiresIn: '15m', secret: process.env.JWT_SECRET },
    );

    return { access_token };
  }
}
