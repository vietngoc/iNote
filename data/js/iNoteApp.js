
var iNoteApp = angular.module('iNote', ['ui.bootstrap']);
iNoteApp.factory("dataService",['$window', function($window, $rootScope, $scope){
  return {
    save: function(key, value) {
      $window.localStorage[key] = angular.toJson(value);
    },
    get: function(key) {
      return angular.fromJson($window.localStorage[key]);
    },
    sync: function (key) {

    },
    backup: function (key){
      var blob = new Blob([key], { type: 'text/plain;charset=utf-8' });
      backupURL = URL.createObjectURL(blob);
    },
    restore: function (key){

    },
    clear: function(){
      $window.localStorage.clear();
    }
  }
}]);

iNoteApp.directive('noteList', function() {
   return {
    restrict : 'C',
    templateUrl : 'elm/note.html'
  }
});

iNoteApp.directive('contenteditable', function(){
  return{
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {
      function read() {
        ngModel.$setViewValue(element.html());
      }
      ngModel.$render = function () {
        element.html(ngModel.$viewValue || "");
      };
      element.bind("blur keyup change", function(){
        scope.$apply(read);
      });
    }
  };
});

iNoteApp.controller('NavBarCtrl',function ($rootScope, $scope, $modal){
  $scope.aboutApp = function (){
    var about = $modal.open({
      templateUrl: 'elm/about.html',
      controller: '',
      size: 'lg',
      });
  };

  $scope.addNote = function () {
    $rootScope.$broadcast("addNote")
  };

/*  $scope.syncNote = function() {
    var about = $modal.open({
      templateUrl: 'elm/sync.html',
      controller: '',
      size: '',
      resolve: {
        }
      });
  }; */

  /*  $scope.setting = function (){
    var setting = $modal.open({
        templateUrl: 'elm/setting.html',
        controller: 'SettingCtrl',
        size: '',
        resolve: {
          }
    });

  }; */

});
iNoteApp.controller('DashboardCtrl',function ($window, $rootScope, $scope){
  function sticky (lock, title, content){ this.lock = lock; this.title = title; this.content = content;  };

  var Notes = [];
  var Caches = JSON.parse($window.sessionStorage.iCache);
  var iNote = angular.fromJson($window.localStorage.iNote);

  Notes = iNote.Notes;
  for (var i in Caches){
    Notes[Notes.length] = new sticky (true, "", Caches[i]);
  };

  $scope.Notes = Notes;
  $scope.$on("addNote", function (event){
    Notes[Notes.length] = new sticky (true, "New Note", "Type text in here");
  });
  $scope.deleteNote = function (index) {
    Notes.splice(index, 1);
  };

$window.addEventListener('beforeunload', function(event) {
 $window.localStorage["iNote"] = angular.toJson(iNote);
 }, false);
});
iNoteApp.controller('SettingCtrl', function($window, $rootScope, $scope, $modalInstance ){
  var Style = {};
  var iNote = angular.fromJson($window.localStorage.iNote);

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
