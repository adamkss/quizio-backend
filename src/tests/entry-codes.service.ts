import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntryCode, EntryCodeStatus } from "./entry-code.entity";
import { Repository } from "typeorm";
import { Test } from "./test.entity";

@Injectable()
export class EntryCodesService {
    constructor(
        @InjectRepository(EntryCode) private readonly entryCodesRepository: Repository<EntryCode>,
    ) { }

    async generateNewCode(test: Test, numberOfNewEntryCodes) {
        return Promise.all([...Array(numberOfNewEntryCodes).keys()].map(() => {
            return new Promise(async (res, rej) => {
                const code: EntryCode = new EntryCode();
                code.test = test;
                await this.entryCodesRepository.save(code);
                code.code = `${test.id}-${code.id}`;
                await this.entryCodesRepository.save(code);
                res(code);
            })
        }));
    }

    async getEntryCodeById(entryCodeId): Promise<EntryCode> {
        return this.entryCodesRepository.findOne(entryCodeId);
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
        const entryCode: EntryCode = await this.getEntryCodeById(entryCodeId);
        entryCode.name = newName;
        await this.entryCodesRepository.save(entryCode);
    }

    async getAllUnfinishedEntryCodesOfATest(test: Test): Promise<EntryCode[]> {
        return (await test.entryCodes).filter(entryCode => entryCode.status != EntryCodeStatus.DONE);
    }
}