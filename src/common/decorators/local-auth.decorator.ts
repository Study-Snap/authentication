import { applyDecorators, UseGuards } from '@nestjs/common'
import { LocalAuthGuard } from '../../modules/auth/guards/local-auth.guard'

export function LocalAuth(...additionalGuards: any[]) {
	return applyDecorators(UseGuards(LocalAuthGuard, ...additionalGuards))
}
