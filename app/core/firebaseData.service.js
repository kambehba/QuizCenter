(function () {
    'use strict';

    angular
      .module('app.core')
      .factory('firebaseDataService', ['$q', '$rootScope', '$location', '$timeout', 'FIREBASE_URL', firebaseDataService]);



    function firebaseDataService($q, $rootScope, $location, $timeout, FIREBASE_URL) {
        var dataRef = new Firebase(FIREBASE_URL);
        var quizes = [];
        var quizResource = new Firebase('https://dazzling-torch-8270.firebaseio.com/QuizCenter/quizes');
        var questionResource = new Firebase('https://dazzling-torch-8270.firebaseio.com/QuizCenter/questions');
        var quizId = 0;
        var selectedQuiz = { id: 0, name: "" };



        /*****service API******/
        return ({
            getAllQuizes: getAllQuizes,
            getQuestionIdsByQuizId:getQuestionIdsByQuizId,
            getQuestionByQuizId: getQuestionByQuizId,
            getAnswersByQuestionId: getAnswersByQuestionId,
            getQuestionsByQuizId: getQuestionsByQuizId,
            getAnswerIds:getAnswerIds,
            getQuestionById: getQuestionById,
            addQuiz: addQuiz,
            addQuestion: addQuestion,
            addAnswer: addAnswer,

        });


        /*****public methods******/

        function getAllQuizes() {

            var promise = [];
            var deferred = $q.defer();
            quizResource.once('value', function (snapshot) {
                promise = snapshot.val();
                deferred.resolve(promise);
            });
            return (deferred.promise);
        }

        function getQuestionById(quizId, questionId) {
            var questionsRef = new Firebase('https://dazzling-torch-8270.firebaseio.com/QuizCenter/quizes/' + quizId + '/questions/' + questionId);

            var promise = [];
            var deferred = $q.defer();
            questionsRef.once('value', function (snapshot) {
                promise = snapshot.val();
                deferred.resolve(promise);

            });
            return (deferred.promise);
        }

        function getAnswerIds(quizId, questionId) {
            var answersRef = new Firebase('https://dazzling-torch-8270.firebaseio.com/QuizCenter/quizes/' + quizId + '/questions/' + questionId +'/answers');

            var promise = [];
            var w = new Array();
            var deferred = $q.defer();
            answersRef.once('value', function (snapshot) {
                promise = snapshot.val();
                snapshot.forEach(function (childSnapshot) { w.push(childSnapshot.key()); });
                deferred.resolve(w);
                //deferred.resolve(promise);
            });
            return (deferred.promise);
        }

        function getQuestionsByQuizId(quizId) {
            var questionsRef = new Firebase('https://dazzling-torch-8270.firebaseio.com/QuizCenter/quizes/' + quizId + '/questions');
            var questionIdsRef = new Firebase('https://dazzling-torch-8270.firebaseio.com/QuizCenter/quizes/' + quizId + '/questions/ids');

            var promise = [];
            var w = new Array();
            var deferred = $q.defer();
            questionsRef.once('value', function (snapshot) {
                promise = snapshot.val();
                snapshot.forEach(function (childSnapshot) { w.push(childSnapshot.key()); });
                deferred.resolve(w);
                //deferred.resolve(promise);
            });
            return (deferred.promise);
        }

        function getQuestionIdsByQuizId(quizId) {
            var questionsRef = new Firebase('https://dazzling-torch-8270.firebaseio.com/QuizCenter/quizes/' + quizId + '/questions');

            var promise = new Array();
            var deferred = $q.defer();
            questionsRef.once('value', function (snapshot) {
                snapshot.forEach(function (childSnapshot) { promise.push(childSnapshot.key()); });
                deferred.resolve(promise);

            });
            return (deferred.promise);
        }

        function getQuestionByQuizId(quizId) {
            var questionRef = new Firebase('https://dazzling-torch-8270.firebaseio.com/QuizCenter/quizes/' + quizId + '/questions');
            var promise = [];
            var deferred = $q.defer();
            questionRef.once('value', function (snapshot) {
                promise = snapshot.val();
                deferred.resolve(promise);
            });
            return (deferred.promise);
        }

        function addQuiz(quiz) {

            getNextAvilableId("quiz").then(
                    function (promise) {
                        var id = promise.value;
                        var newItemRef = new Firebase('https://dazzling-torch-8270.firebaseio.com/QuizCenter/quizes/' + id);
                        newItemRef.set({ id:id, name: quiz.name, questions: [] });

                        //var promise = [];
                        //var deferred = $q.defer();
                        //newItemRef.once('value', function (snapshot) {
                        //    promise = snapshot.val();
                        //    deferred.resolve(promise);
                        //});
                        //return (deferred.promise);
                    });

            var promise = [];
            var deferred = $q.defer();
            quizResource.once('value', function (snapshot) {
                promise = snapshot.val();
                deferred.resolve(promise);
            });
            return (deferred.promise);


        }

        function addQuestion(question, quizId) {

            getNextAvilableId("question").then(
                    function (promise) {
                        var id = promise.value;
                        var newItemRef = new Firebase('https://dazzling-torch-8270.firebaseio.com/QuizCenter/quizes/' + quizId + '/' + 'questions/' + id);
                        newItemRef.set({ id:id, text: question });
                    }
                );
            var questionRef = new Firebase('https://dazzling-torch-8270.firebaseio.com/QuizCenter/quizes/' + quizId + '/questions');
            var promise = [];
            var deferred = $q.defer();
            questionRef.once('value', function (snapshot) {
                promise = snapshot.val();
                deferred.resolve(promise);
            });
            return (deferred.promise);
        }

        function addAnswer(answer, quizId, questionId) {
            getNextAvilableId("answer").then(
                    function (promise) {
                        var id = promise.value;
                        var newItemRef = new Firebase('https://dazzling-torch-8270.firebaseio.com/QuizCenter/quizes/' + quizId + '/questions/' + questionId + '/answers/' + id);
                        newItemRef.set({ id: id, text: answer.text, isCorrectAnswer: answer.isCorrectAnswer });
                    }
                );

            var promise = [];
            var deferred = $q.defer();
            quizResource.once('value', function (snapshot) {
                promise = snapshot.val();
                deferred.resolve(promise);
            });
            return (deferred.promise);
        }

        function getAnswersByQuestionId(quizId, QuestionId) {
            var answerRef = new Firebase('https://dazzling-torch-8270.firebaseio.com/QuizCenter/quizes/' + quizId + '/questions/' + QuestionId + '/answers');
            var promise = [];
            var deferred = $q.defer();
            answerRef.once('value', function (snapshot) {
                promise = snapshot.val();
                deferred.resolve(promise);
            });
            return (deferred.promise);
        }




        /*****private methods******/
        function getNextAvilableId(IdType) {

            if (IdType == "quiz")
                var idRef = new Firebase('https://dazzling-torch-8270.firebaseio.com/QuizCenter/quizId');
            if (IdType == "question")
                var idRef = new Firebase('https://dazzling-torch-8270.firebaseio.com/QuizCenter/questionId');
            if (IdType == "answer")
                var idRef = new Firebase('https://dazzling-torch-8270.firebaseio.com/QuizCenter/answerId');

            var promise = [];
            var deferred = $q.defer();
            idRef.once('value', function (snapshot) {
                promise = snapshot.val();
                deferred.resolve(promise);
                idRef.set({ value: promise.value + 1 });
            });


            return (deferred.promise);
        }

    } /*****end of firebaseDataService******/

})();


