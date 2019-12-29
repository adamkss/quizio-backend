import { Module } from "@nestjs/common";
import { QuizSessionService } from "./QuizSession.service";
import { QuizSessionController } from './QuizSession.controller';
import { QuizzesModule } from "../quizzes/quizzes.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuizSession } from "./QuizSesssion.entity";

@Module({
    imports: [QuizzesModule, TypeOrmModule.forFeature([QuizSession])],
    providers: [QuizSessionService],
    controllers: [QuizSessionController],
    exports: [QuizSessionService]
})
export class QuizSessionModule {

}