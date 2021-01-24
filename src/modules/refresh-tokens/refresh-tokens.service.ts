import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { RefreshTokensRepository } from './refresh-tokens.repository'

@Injectable()
export class RefreshTokensService {
	constructor(private readonly tokens: RefreshTokensRepository, private readonly jwt: JwtService) {}
}
