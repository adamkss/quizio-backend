import { Controller, Post, Body, UseGuards, Req, Get } from "@nestjs/common";
import { TestsService } from "./tests.service";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "src/users/users.service";
import { User } from '../users/user.entity';

@Controller('tests')
export class TestsController {
    constructor(
        private readonly testsService: TestsService,
        private readonly usersService: UsersService
    ) { }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getAllTestsOfUser(@Req() request) {
        const user:User = await this.usersService.getUserById(request.user.id);
        return await user.ownedTests;
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createTest(@Req() request, @Body() { testName }): Promise<any> {
        const owner: User = await this.usersService.getUserById(request.user.id);

        return await this.testsService.createTest(testName, owner);
    }
}