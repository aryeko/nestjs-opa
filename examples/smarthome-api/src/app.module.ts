import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuthzModule } from './authz/authz.module';
import { AppController } from './app.controller';

@Module({
  imports: [AuthModule, AuthzModule],
  controllers: [AppController],
})
export class AppModule {}
