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
        var answersIds = [];
        var isSelectedAnswerCorrect = false;
        var numberOfCorrectlyAnswerd = 0;
        hideAllPageSection();
        vm.showStartPage = true;
        vm.quizList = [];
        vm.quiz = { id: 0, name: "" };
        vm.question = { id: 0, text: "", quizId: 0 };
        vm.questions = [];
        vm.answer = { id: 0, text: "", isCorrectAnswer: "", questionId: 0 };
        vm.answers = [];
        vm.answer1 = "";
        vm.answer2 = "";
        vm.answer3 = "";
        vm.answer4 = "";
        vm.answer1BtnStyle = 0;
        vm.answer2BtnStyle = 0;
        vm.answer3BtnStyle = 0;
        vm.answer4BtnStyle = 0;
        vm.nextButtonText = "Next";

      
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
            
            firebaseDataService.getQuestionIdsByQuizId(quiz.id).then(function (promise) {
                questionIds = promise;
                loadQuestion();

            });

            firebaseDataService.getQuestionsByQuizId(quiz.id).then(function (promise) {
                vm.quiz.id = quiz.id;
                vm.questions = promise;
            });
        }

        vm.answer1Clicked = function () {
            UnselectAllAnswerButtons();
            vm.answer1BtnStyle = 1;
            isSelectedAnswerCorrect = vm.answers[answersIds[0]].isCorrectAnswer;
        }

        vm.answer2Clicked = function () {
            UnselectAllAnswerButtons();
            vm.answer2BtnStyle = 1;
            isSelectedAnswerCorrect = vm.answers[answersIds[1]].isCorrectAnswer;
        }

        vm.answer3Clicked = function () {
            UnselectAllAnswerButtons();
            vm.answer3BtnStyle = 1;
            isSelectedAnswerCorrect = vm.answers[answersIds[2]].isCorrectAnswer;
        }

        vm.answer4Clicked = function () {
            UnselectAllAnswerButtons();
            vm.answer4BtnStyle = 1;
            isSelectedAnswerCorrect = vm.answers[answersIds[3]].isCorrectAnswer;
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

        vm.nextBtnClick = function () {
            UnselectAllAnswerButtons();
            hideAllPageSection();
            if (isSelectedAnswerCorrect == true) {
                isSelectedAnswerCorrect = false;
                numberOfCorrectlyAnswerd++;
            }

            if (vm.nextButtonText == "Finish") { showQuizResult(); return; }
            
            if (IsLastQuestion()) { vm.nextButtonText = "Finish"; }

            loadQuestion();
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
            vm.showQuizResult = false;

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
                bindAnswers(questionId);
            });
        }

        function bindAnswers(questionId) {
            firebaseDataService.getAnswerIds(vm.quiz.id, questionId).then(function (promise) {
                answersIds = promise;

                vm.answer1 = vm.answers[answersIds[0]].text;
                vm.answer2 = vm.answers[answersIds[1]].text;
                vm.answer3 = vm.answers[answersIds[2]].text;
                vm.answer4 = vm.answers[answersIds[3]].text;

                vm.showQuizMainPage = true;
            });
        }

        function UnselectAllAnswerButtons() {
            vm.answer1BtnStyle = 0;
            vm.answer2BtnStyle = 0;
            vm.answer3BtnStyle = 0;
            vm.answer4BtnStyle = 0;
        }

        function IsLastQuestion() {
            if(currentQuestionNumber == questionIds.length-1)
            {
                return true;
            }
            return false;
        }

        function showQuizResult() {
            hideAllPageSection();
            vm.quizResult = (numberOfCorrectlyAnswerd * 100) / questionIds.length
            vm.showQuizResult = true;
        }
        



    }/*****end of ProjectController******/

})();
