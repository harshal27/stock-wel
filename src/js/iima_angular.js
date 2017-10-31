angular.module('StaticWebsite', ['ngSanitize', 'ac']);

angular.module('StaticWebsite').controller('MainController', ['$scope', '$http', '$timeout',
function($scope, $http, $timeout) {

  $scope.announcements = [
    {
      date: "July 25, 2017",
      title: "Conservation and Upgrade of CR1 Classroom",
      content: "Mr. Vishwavir Ahuja, MD & CEO, RBL Bank announced significant Infrastructure funding support to IIMA"
    },
    {
      date: "July 25, 2017",
      title: "Conservation and Upgrade of CR1 Classroom",
      content: "Mr. Vishwavir Ahuja, MD & CEO, RBL Bank announced significant Infrastructure funding support to IIMA"
    },
    {
      date: "July 25, 2017",
      title: "Conservation and Upgrade of CR1 Classroom",
      content: "Mr. Vishwavir Ahuja, MD & CEO, RBL Bank announced significant Infrastructure funding support to IIMA"
    },
    {
      date: "July 25, 2017",
      title: "Conservation and Upgrade of CR1 Classroom",
      content: "Mr. Vishwavir Ahuja, MD & CEO, RBL Bank announced significant Infrastructure funding support to IIMA"
    },
    {
      date: "July 25, 2017",
      title: "Conservation and Upgrade of CR1 Classroom",
      content: "Mr. Vishwavir Ahuja, MD & CEO, RBL Bank announced significant Infrastructure funding support to IIMA"
    },
  ];

  $scope.magazine_urls = [
    "/images/magazines/1.png",
    "/images/magazines/2.png",
    "/images/magazines/3.png",
    "/images/magazines/4.png",
    "/images/magazines/5.png",
    "/images/magazines/6.png",
    "/images/magazines/7.png",
    "/images/magazines/8.png",
  ];
}]);
