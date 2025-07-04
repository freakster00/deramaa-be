import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { PropertyModule } from './property/property.module';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AgentVerificationModule } from './agent-verification/agent-verification.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: join(__dirname, '../.env'), 
    }),
    AuthModule,
    AccountModule, 
    PropertyModule,
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT), 
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities:[join(__dirname, '**', '*.entity.{ts,js}')],
      logging: false,
      synchronize: true, 
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      context: ({ req, res }) => ({ req, res }),
      includeStacktraceInErrorResponses:false,
      typePaths:["./**/*.graphql"],
      cache:'bounded',
      introspection:true,
      path: '/api'
    }),
    AgentVerificationModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      defaults: {
        from: process.env.SMTP_FROM,
     }
   })
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
