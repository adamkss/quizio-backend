import { Module, forwardRef } from '@nestjs/common';
import { ElasticSearchService } from './elastic-search.service';
import { ElasticSearchController } from './elastic-search.controller';
import { TestsModule } from '../tests/tests.module';

@Module({
    imports: [
        forwardRef(() => TestsModule)
    ],
    providers: [ElasticSearchService],
    controllers: [ElasticSearchController],
    exports: [ElasticSearchService]
})
export class ElasticSearchModule { }
