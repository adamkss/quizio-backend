import { Injectable } from "@nestjs/common";
import JavaQuestionsArray from "./javaQuestions.json";

@Injectable()
export class QuizService {
    sessionsQuestionsMap = {};

    private initializeQuestionsForSession(sessionCode: string) {
        const sessionData = {
            questions: [...JavaQuestionsArray],
            wronglyAnsweredQuestionsIndexes: [],
            nextQuestionIndex: 0,
            wereAllAnsweredAtLeastOnce: false,
            progressUnit: (1 / JavaQuestionsArray.length) * 100
        };

        this.sessionsQuestionsMap[sessionCode] = sessionData;
    }

    getNextQuestionForSession(sessionCode) {
        if (!this.sessionsQuestionsMap[sessionCode])
            this.initializeQuestionsForSession(sessionCode);

        const sessionData = this.sessionsQuestionsMap[sessionCode];
        if (sessionData.nextQuestionIndex == sessionData.questions.length) {
            console.log('all finished taking if any left...')
            console.log(sessionData.wronglyAnsweredQuestionsIndexes)
            console.log(sessionData.wronglyAnsweredQuestionsIndexes.length)
            if (sessionData.wronglyAnsweredQuestionsIndexes.length > 0) {
                const questionIndex = sessionData.wronglyAnsweredQuestionsIndexes[0];
                sessionData.wronglyAnsweredQuestionsIndexes.splice(
                    sessionData.wronglyAnsweredQuestionsIndexes.indexOf(questionIndex),
                    1
                );
                console.log(questionIndex)
                return {
                    question: sessionData.questions[questionIndex],
                    done: false
                }
            } else {
                return {
                    question: null,
                    done: true
                };
            }
        } else {
            return {
                question: sessionData.questions[sessionData.nextQuestionIndex++],
                done: false
            }
        }
    }

    validateAnswerForQuestion(sessionCode: string, questionId: number, optionSelectedId: number) {
        const sessionData = this.sessionsQuestionsMap[sessionCode];
        const question = sessionData.questions.find(question => question.id === questionId);
        const questionIndexInQuestions = sessionData.questions.indexOf(question);

        if (question) {
            if (sessionData.nextQuestionIndex === sessionData.questions.length) {
                // if (sessionData.wereAllAnsweredAtLeastOnce)
                //     //When we are here that means that the question was once answered incorrectly
                //     sessionData.wronglyAnsweredQuestionsIndexes.splice(0, 1);
                // else
                //     sessionData.wereAllAnsweredAtLeastOnce = true;
            }
            if (question.rightAnswerId === optionSelectedId) {
                return {
                    valid: true,
                    progress: sessionData.progressUnit
                };
            } else {
                console.log('Pushed to wrong answers')
                sessionData.wronglyAnsweredQuestionsIndexes.push(questionIndexInQuestions);
                return {
                    valid: false,
                    progress: 0
                };
            }
        } else {
            throw new Error('Question not found in session.');
        }
    }
}