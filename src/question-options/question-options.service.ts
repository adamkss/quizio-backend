import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionOption } from './questionOption.entity';
import { Repository } from 'typeorm';
import { Question } from 'src/questions/question.entity';

const getQuestionOptionsWithoutParentQuestion = (questionOptions: QuestionOption[]): QuestionOption[] => {
    return questionOptions.map(questionOption => ({
        ...questionOption,
        question: null
    }));
}

@Injectable()
export class QuestionOptionsService {
    constructor(
        @InjectRepository(QuestionOption) private readonly questionOptionsRepository: Repository<QuestionOption>,
    ) { }

    async addOptionToQuestion(question: Question, option: string): Promise<any[]> {
        let questionOption = new QuestionOption();
        questionOption.question = question;
        questionOption.title = option;
        questionOption.amITheRightAnswer = false;
        await this.questionOptionsRepository.save(questionOption);

        question.questionOptions = [...question.questionOptions, questionOption];

        return question.questionOptions.map(questionOption => ({ ...questionOption, question: null }));
    }

    async addQuestionOptionsToQuestion(question: Question, options: string[], rightAnswer: string) {
        for (const option of options) {
            const questionOption = new QuestionOption();
            questionOption.title = option;
            questionOption.question = question;
            if (option == rightAnswer) {
                questionOption.amITheRightAnswer = true;
            } else {
                questionOption.amITheRightAnswer = false;
            }
            await this.questionOptionsRepository.save(questionOption);
        }
    }

    async setNewRightAnswerToQuestion(question: Question, questionOptionId) {
        //first we set all question options to false
        await Promise.all(question.questionOptions.map(questionOption => {
            if (questionOption.id === questionOptionId)
                questionOption.amITheRightAnswer = true;
            else
                questionOption.amITheRightAnswer = false;
            return this.questionOptionsRepository.save(questionOption);
        }));

        return question.questionOptions.map(questionOption => ({ ...questionOption, question: null }));
    }

    async deleteAnswerFromQuestion(question: Question, questionOptionId): Promise<QuestionOption[]> {
        await this.questionOptionsRepository.delete(questionOptionId);
        return getQuestionOptionsWithoutParentQuestion(question.questionOptions);
    }

    async deleteQuestionOptions(questionOptions: QuestionOption[]): Promise<void> {
        await this.questionOptionsRepository.remove(questionOptions);
    }
}
