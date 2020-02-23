import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Test } from "./test.entity";
import { Repository } from 'typeorm';
import { User } from "src/users/user.entity";

@Injectable()
export class TestsService {
    constructor(
        @InjectRepository(Test) private readonly testsRepository: Repository<Test>
    ) { }

    async createTest(testName: string, owner: User): Promise<any> {
        const test: Test = new Test();
        test.name = testName;
        test.owner = owner;
        const { owner: testOwner, ...testWithoutOwner } = await this.testsRepository.save(test);
        return testWithoutOwner;
    }
}