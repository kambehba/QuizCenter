(function () {
    'use strict';

    angular
      .module('app.quiz')
      .controller('QuizController', ['$scope', 'firebaseDataService', QuizController]);

    function QuizController($scope, firebaseDataService) {

        var vm = this;
        var appMode = "";
        var currentQuestionNumber = 0;
        var questionIds = [];
        hideAllPageSection();
        vm.showStartPage = true;
        vm.quizList = [];
        vm.quiz = { id: 0, name: "" };
        vm.question = { id: 0, text: "", quizId: 0 };
        vm.questions = [];
        vm.answer = { id: 0, text: "", isCorrectAnswer: "", questionId: 0 };
        vm.answers = [];
        
      
        ///***view model methods***///

        vm.MakeQuizClick = function () {
            appMode = "Take";
            hideAllPageSection();
            vm.showPageIsLoading = true;
            loadAllQuizez(appMode);
        }

        vm.TakeQuizClick = function () {
            appMode = "Make";
            hideAllPageSection();
            vm.showTakeQuizList = true;
            loadAllQuizez(appMode);
           
        }

        vm.StartQuiz = function (quiz) {
            hideAllPageSection();
            vm.showQuizMainPage = true;

            firebaseDataService.getQuestionIdsByQuizId(quiz.id).then(function (promise) {
                questionIds = promise;
                loadQuestion();

            });



            firebaseDataService.getQuestionsByQuizId(quiz.id).then(function (promise) {
                vm.quiz.id = quiz.id;
                vm.questions = promise;


            });


        }

        vm.goToCreateQuizPage = function () {
            hideAllPageSection();
            vm.showCreateQuiz = true;

        }

        vm.createQuiz = function () {
            hideAllPageSection();
            vm.showMakeQuizList = true;
            firebaseDataService.addQuiz(vm.quiz).then(function (promise) {
                loadAllQuizez(appMode);
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


        ///***private methods***///

        function loadAllQuizez(appMode) {
            firebaseDataService.getAllQuizes().then(function (promise) {
                vm.quizList = promise;
                hideAllPageSection();
                if (appMode == "Take") vm.showMakeQuizList = true;
                if (appMode == "Make") vm.showTakeQuizList = true;
               
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
            vm.showStartPage = false;
            vm.showCreateQuiz = false;
            vm.showQuestionList = false;
            vm.showAddNewAnswer = false;
            vm.showAnswerList = false;
            vm.showMakeQuizList = false;
            vm.showAddNewQuestion = false;
            vm.showPageIsLoading = false;
            vm.showTakeQuizList = false;
            vm.showQuizMainPage = false;

        }

        function loadQuestion() {

            if (currentQuestionNumber < questionIds.length) {
                var questionId = questionIds[currentQuestionNumber];

                firebaseDataService.getQuestionById(vm.quiz.id, questionId).then(function (promise) {
                    vm.question = promise;
                    currentQuestionNumber += 1;
                    loadAnswersByQuestionId(questionId);

                });

            }
        }

        function loadAnswersByQuestionId(questionId) {
            firebaseDataService.getAnswersByQuestionId(vm.quiz.id, questionId).then(function (promise) {
                vm.answers = promise;

            });
        }



    }/*****end of ProjectController******/

})();
