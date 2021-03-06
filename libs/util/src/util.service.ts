import { createHash, randomBytes } from 'crypto';
import { sign, verify } from 'jsonwebtoken';
import { ConfigService } from '@app/config';
import { Injectable } from '@nestjs/common';
import { TokenTypeEnum } from './token-type.enum';

@Injectable()
export class UtilService {
  private readonly secret: Buffer;

  private readonly tokenRegExp = /^Bearer .+$/;

  constructor(private readonly config_service: ConfigService) {
    this.secret = config_service.JWT_SECRET ? Buffer.from(config_service.JWT_SECRET) : randomBytes(16);
  }

  public static range(array: {}[]): number[] {
    return Array.from({ length: array.length }, ((value, key) => key));
  }

  public static parse_ids(ids: string): number[] {
    const result: number[] = new Array<number>();
    for(const loop_id of ids.split(',')) {
      result.push(Number(loop_id));
    }
    return result;
  }

  public async encode(content: string): Promise<string> {
    return createHash(this.config_service.ENCIPHERMENT).update(content).digest('base64');
  }

  public async create_token(email: string, type: TokenTypeEnum): Promise<string> {
    const expiresIn = type.match(TokenTypeEnum.access) ? '30 min' : '14 days';
    return sign({ id: email }, this.secret, { expiresIn });
  }

  public get_token_body(token: string): string {
    if (this.tokenRegExp.test(token)) {
      return token.split(' ', 2)[1];
    } else {
      return null;
    }
  }

  public async get_email_by_token(token: string): Promise<string> {
    try {
      const parsedToken = await verify(token, this.secret, {}) as undefined as { id: string };
      return parsedToken.id;
    } catch (e) {
      return null;
    }
  }
}
