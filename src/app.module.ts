import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorsMiddleware } from './middleware/cors.middleware';
import { QuizSessionModule } from './quiz_session/QuizSession.module';
import { CoursesModule } from './courses/courses.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { QuestionsModule } from './questions/questions.module';
import { QuestionOptionsModule } from './question-options/question-options.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TestsModule } from './tests/tests.module';
import { TestSessionModule } from './test-session/TestSession.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggingModule } from './logging/logging.module';
import { ElasticSearchModule } from './elasticsearch/elastic-search.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ElasticSearchModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<any>('DB_TYPE'),
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    QuizSessionModule,
    CoursesModule,
    QuizzesModule,
    QuestionsModule,
    QuestionOptionsModule,
    AuthModule,
    UsersModule,
    TestsModule,
    TestSessionModule,
    LoggingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes('*');
  }
}
