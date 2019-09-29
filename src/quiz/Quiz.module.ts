import { Module } from "@nestjs/common";
import { QuizService } from "./Quiz.service";

@Module({
    imports: [],
    providers: [QuizService],
    controllers: [],
    exports: [QuizService]
})
export class QuizModule {

}