import { Module } from "@nestjs/common";
import { TestSessionService } from "./TestSession.service";
import { TestSessionController } from './TestSession.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { TestSession } from "./TestSession.entity";
import { TestsModule } from "../tests/tests.module";
import { TestSessionQuestionState } from "./TestSessionQuestionState.entity";
import { ElasticSearchModule } from "../elasticsearch/elastic-search.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([TestSession, TestSessionQuestionState]),
        TestsModule,
        ElasticSearchModule
    ],
    providers: [TestSessionService],
    controllers: [TestSessionController],
    exports: [TestSessionService]
})
export class TestSessionModule {

}