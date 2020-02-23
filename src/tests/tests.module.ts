import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from './test.entity';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Test]),
        UsersModule
    ],
    providers: [TestsService],
    controllers: [TestsController]
})
export class TestsModule { }
