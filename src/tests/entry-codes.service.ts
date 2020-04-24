import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntryCode, EntryCodeStatus } from "./entry-code.entity";
import { Repository } from "typeorm";
import { Test } from "./test.entity";
import { ElasticSearchService } from "../elasticsearch/elastic-search.service";
import { SQSService } from "../sqs/sqs.service";
import { SNSService } from "src/sns/sns.service";
import { v4 as uuid } from 'uuid';

@Injectable()
export class EntryCodesService {
    constructor(
        @InjectRepository(EntryCode) private readonly entryCodesRepository: Repository<EntryCode>,
        @Inject(forwardRef(() => ElasticSearchService))
        private readonly elasticSearchService: ElasticSearchService,
        private readonly sqsService: SQSService,
        private readonly snsService: SNSService
    ) { }

    async generateNewCode(test: Test, numberOfNewEntryCodes) {
        return Promise.all([...Array(numberOfNewEntryCodes).keys()].map(() => {
            return new Promise(async (res, rej) => {
                let code: EntryCode = new EntryCode();
                code.test = test;
                await this.entryCodesRepository.save(code);
                code.code = `${test.id}-${code.id}`;
                code = await this.entryCodesRepository.save(code);
                this.elasticSearchService.copyEntryCodeToElasticsearch(code);
                res(code);
            })
        }));
    }

    async getEntryCodeById(entryCodeId): Promise<EntryCode> {
        return this.entryCodesRepository.findOne(entryCodeId, {
            relations: ['test']
        });
    }

    async getEntryCodeByCode(code: String): Promise<EntryCode> {
        return await this.entryCodesRepository.findOne({
            where: {
                code: code
            },
            relations: ['test']
        });
    }

    async getAllEntryCodesOfATest(test: Test): Promise<EntryCode[]> {
        return await test.entryCodes;
    }

    async updateNameOfEntryCode(entryCodeId, newName) {
        let entryCode: EntryCode = await this.getEntryCodeById(entryCodeId);
        entryCode.name = newName;
        entryCode = await this.entryCodesRepository.save(entryCode);
        this.elasticSearchService.copyEntryCodeToElasticsearch(entryCode);
    }

    async getAllUnfinishedEntryCodesOfATest(test: Test): Promise<EntryCode[]> {
        return (await test.entryCodes).filter(entryCode => entryCode.status != EntryCodeStatus.DONE);
    }

    async getAllFinishedEntryCodesOfATest(test: Test): Promise<any[]> {
        const entryCodes: EntryCode[] = await this.entryCodesRepository
            .find({
                where: {
                    test: test,
                    status: EntryCodeStatus.DONE
                },
                relations: ['testSession']
            })
        return entryCodes;
    }

    async updateStateOfEntryCode(entryCode: EntryCode, status: EntryCodeStatus) {
        entryCode.status = status;
        this.elasticSearchService.copyEntryCodeToElasticsearch(entryCode);
        await this.entryCodesRepository.save(entryCode);
    }

    async getAllEntryCodesWithOwningTest(): Promise<EntryCode[]> {
        return await this.entryCodesRepository.find({
            relations: ['test']
        });
    }

    async exportEntryCodesToPDF(data): Promise<any> {
        try {
            const uniqueId = uuid();
            await this.sqsService.sendMessageToPDFsToExportQueue({ id: uniqueId, data });
            return new Promise((res, rej) => {
                this.snsService.subscribeToPDFExportTopic(({ id, url }) => {
                    if (id == uniqueId)
                        res({url});
                })
            })
        } catch {
            return Promise.reject(false);
        }
    }
}