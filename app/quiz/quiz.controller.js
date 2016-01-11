(function () {
    'use strict';

    angular
      .module('app.quiz')
      .controller('QuizController', ['$scope', 'firebaseDataService', QuizController]);

    function QuizController($scope, firebaseDataService) {

        var vm = this;
        hideAllPageSection();
        vm.showPageIsLoading = true;
        vm.quizList = [];
        vm.quiz = { id: 0, name: "" };
        vm.question = { id: 0, text: "", quizId: 0 };
        vm.questions = [];
        vm.answer = { id: 0, text: "", isCorrectAnswer: "", questionId: 0 };
        vm.answers = [];

        loadAllQuizez();

        vm.goToCreateQuizPage = function () {
            hideAllPageSection();
            vm.showCreateQuiz = true;

        }

        vm.createQuiz = function () {
            hideAllPageSection();
            vm.showQuizList = true;
            firebaseDataService.addQuiz(vm.quiz).then(function (promise) {
                loadAllQuizez();
            });
        }

        vm.UpdateQuiz = function (quiz) {
            hideAllPageSection();
            vm.showQuestionList = true;
            vm.quiz.name = quiz.name;

            firebaseDataService.getQuestionByQuizId(quiz.id).then(function (promise) {
                vm.quiz.id = quiz.id;
                vm.questions = promise;
            });
        }

        vm.AddNewQuestion = function () {
            hideAllPageSection();
            vm.showQuestionList = true;

            firebaseDataService.addQuestion(vm.question.text, vm.quiz.id).then(function (promise) {
                loadQuestionsByQuizId(vm.quiz.id);
            });
        }

        vm.UpdateQuestion = function (question) {
            hideAllPageSection();
            vm.showAnswerList = true;
            vm.question.id = question.id;
            vm.question.text = question.text;
            firebaseDataService.getAnswersByQuestionId(vm.quiz.id, question.id).then(function (promise) {
                vm.question.id = question.id;
                vm.answers = promise;
            });
        }

        vm.goToAddNewQuestion = function () {
            hideAllPageSection();
            vm.showAddNewQuestion = true;

        }

        vm.goToAddNewAnswer = function () {
            hideAllPageSection();
            vm.showAddNewAnswer = true;

        }

        vm.AddNewAnswer = function () {
            hideAllPageSection();
            vm.showAnswerList = true;

            firebaseDataService.addAnswer(vm.answer, vm.quiz.id, vm.question.id).then(function (promise) {
                loadAnswersByQuestionId(vm.quiz.id, vm.question.id);

            });
        }


        //private methods

        function loadAllQuizez() {
            firebaseDataService.getAllQuizes().then(function (promise) {
                vm.quizList = promise;
                hideAllPageSection();
                vm.showQuizList = true;
            });
        }

        function loadQuestionsByQuizId(quizId) {
            firebaseDataService.getQuestionByQuizId(quizId).then(function (promise) {
                vm.questions = promise;
            });
        }

        function loadAnswersByQuestionId(quizId, questionId) {
            firebaseDataService.getAnswersByQuestionId(quizId, questionId).then(function (promise) {
                vm.answers = promise;
            });
        }

        function hideAllPageSection() {
            vm.showCreateQuiz = false;
            vm.showQuestionList = false;
            vm.showAddNewAnswer = false;
            vm.showAnswerList = false;
            vm.showQuizList = false;
            vm.showAddNewQuestion = false;
            vm.showPageIsLoading = false;

        }



    }/*****end of ProjectController******/

})();
