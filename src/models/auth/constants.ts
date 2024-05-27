import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'in2d0ii2d72dcs0h82hd02cj29c2';
export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true);
