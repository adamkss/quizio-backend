import { Controller, Post, Get, Query, Delete, Param } from "@nestjs/common";
import { ElasticSearchService } from "./elastic-search.service";
import { EntryCodeStatus } from "../tests/entry-code.entity";

@Controller('elastic-search')
export class ElasticSearchController {
    constructor(
        private readonly elasticSearchService: ElasticSearchService
    ) { }

    @Post('/entryCodesFullCopies')
    async copyAllEntryCodes() {
        this.elasticSearchService.copyAllEntryCodesToElasticsearch();
    }

    @Get('/unfinished-entry-codes')
    async searchForUnfinishedEntryCodes(
        @Query('testId') testId,
        @Query('searchTerm') searchTerm: string
    ) {
        return await this.elasticSearchService.searchForUnfinishedEntryCode(searchTerm, testId, EntryCodeStatus.DONE.toString());
    }
    
    @Get('/finished-entry-codes')
    async searchForFinishedEntryCodes(
        @Query('testId') testId,
        @Query('searchTerm') searchTerm: string
    ) {
        return await this.elasticSearchService.searchForFinishedEntryCode(searchTerm, testId);
    }

    @Delete('/indexes/:indexName')
    async deleteIndexContent(@Param('indexName') indexName) {
        return await this.elasticSearchService.deleteEverythingFromIndex(indexName);
    }
}