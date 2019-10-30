import { Injectable } from "@nestjs/common";
import { Question } from '../questions/question.entity';
import { QuizzesService } from "../quizzes/quizzes.service";

@Injectable()
export class QuizSessionService {
    sessionsQuestionsMap = {};

    constructor(
        private readonly quizzesService: QuizzesService
    ) { }

    private initializeQuestionsForSession(sessionCode: string, questions: Question[], isForLearning: boolean) {
        const sessionData = {
            questions: [...questions],
            wronglyAnsweredQuestionsIndexes: [],
            nextQuestionIndex: 0,
            wereAllAnsweredAtLeastOnce: false,
            progressUnit: (1 / questions.length) * 100,
            progress: 0,
            waitingAnswerForQuestion: null,
            isForLearning
        };

        this.sessionsQuestionsMap[sessionCode] = sessionData;
    }

    getNextQuestionForSession(sessionCode) {
        const sessionData = this.sessionsQuestionsMap[sessionCode];
        console.log(sessionData)

        if (sessionData.nextQuestionIndex == sessionData.questions.length) {
            sessionData.wereAllAnsweredAtLeastOnce = true;
        }

        if (sessionData.waitingAnswerForQuestion) {
            return {
                question: sessionData.waitingAnswerForQuestion,
                done: false,
                progress: sessionData.progress
            }
        }

        if (sessionData.wereAllAnsweredAtLeastOnce) {
            console.log('all finished taking if any left...')
            if (sessionData.wronglyAnsweredQuestionsIndexes.length > 0) {
                const questionIndex = sessionData.wronglyAnsweredQuestionsIndexes[0];

                sessionData.waitingAnswerForQuestion = sessionData.questions[questionIndex];
                return {
                    question: sessionData.questions[questionIndex],
                    done: false,
                    progress: sessionData.progress
                }
            } else {
                return {
                    question: null,
                    done: true,
                    progress: sessionData.progress
                };
            }
        } else {
            sessionData.waitingAnswerForQuestion = sessionData.questions[sessionData.nextQuestionIndex];
            return {
                question: sessionData.questions[sessionData.nextQuestionIndex++],
                done: false,
                progress: sessionData.progress
            }
        }
    }

    validateAnswerForQuestion(sessionCode: string, questionId: number, optionSelectedOrderNumber: number) {
        const sessionData = this.sessionsQuestionsMap[sessionCode];
        const question = sessionData.questions.find(question => question.id === questionId);
        const questionIndexInQuestions = sessionData.questions.indexOf(question);

        if (question) {
            if (sessionData.waitingAnswerForQuestion.id === questionId) {
                sessionData.waitingAnswerForQuestion = null;
                if (sessionData.wereAllAnsweredAtLeastOnce) {
                    sessionData.wronglyAnsweredQuestionsIndexes.splice(
                        0,
                        1
                    );
                }
            }

            if (question.questionOptions[optionSelectedOrderNumber].amITheRightAnswer) {
                sessionData.progress += sessionData.progressUnit;
                return {
                    valid: true,
                    progress: sessionData.progress
                };
            } else {
                if (sessionData.isForLearning) {
                    console.log('Pushed to wrong answers')
                    sessionData.wronglyAnsweredQuestionsIndexes.push(questionIndexInQuestions);
                }
                return {
                    valid: false,
                    progress: 0
                };
            }
        } else {
            throw new Error('Question not found in session.');
        }
    }

    async createNewSessionForQuiz(quizId, isForLearning) {
        let nextSessionId;
        do {
            nextSessionId = Math.ceil(Math.random() * 1000);
        } while (this.sessionsQuestionsMap[nextSessionId]);

        this.initializeQuestionsForSession(nextSessionId, await this.quizzesService.getAllQuestionsOfAQuiz(quizId), isForLearning);

        return nextSessionId;
    }

    getQuizStatistics(sessionId) {
        const session = this.sessionsQuestionsMap[sessionId];
        return {
            progress: Math.round(session.progress)
        }
    }
}