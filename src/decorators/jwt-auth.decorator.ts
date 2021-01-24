import { applyDecorators, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard'

export function JwtAuth(...additionalGuards: any[]) {
	return applyDecorators(UseGuards(JwtAuthGuard, ...additionalGuards))
}
