import { Module } from "@nestjs/common";
import { QuizSessionService } from "./QuizSession.service";
import { QuizSessionController } from './QuizSession.controller';
import { QuizzesModule } from "src/quizzes/quizzes.module";

@Module({
    imports: [QuizzesModule],
    providers: [QuizSessionService],
    controllers: [QuizSessionController],
    exports: [QuizSessionService]
})
export class QuizSessionModule {

}