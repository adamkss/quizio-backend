import { Module } from "@nestjs/common";
import { QuizService } from "./Quiz.service";
import { CoursesModule } from "../courses/courses.module";

@Module({
    imports: [CoursesModule],
    providers: [QuizService],
    controllers: [],
    exports: [QuizService]
})
export class QuizModule {

}