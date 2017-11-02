angular.module('StaticWebsite', ['ngSanitize', 'ac']);

angular.module('StaticWebsite').controller('MainController', ['$scope', '$http', '$timeout',
function($scope, $http, $timeout) {

  $scope.state = {
    selected_user: null,
  };

  $scope.redirectToSelectedUser = function(){
    window.location = $scope.state.selected_user.url;
  };

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

  var fetchExternalArticles = function(){
    $http({
      method: "GET",
      url: "https://iima.almaconnect.com/api/news.json"
    }).success(function(response){
      $scope.external_articles = response.data;
    });
  };
  fetchExternalArticles();

  $scope.distinguished_alumni = [
    {
      image_url: "/images/raghuram_rajan.jpg",
      name: "Raghuram Rajan",
      other_info: "PGP 1985, Young Alumni Achiever 2015"
    },
    {
      image_url: "/images/raghuram_rajan.jpg",
      name: "Raghuram Rajan",
      other_info: "PGP 1985, Young Alumni Achiever 2015"
    },
    {
      image_url: "/images/raghuram_rajan.jpg",
      name: "Raghuram Rajan",
      other_info: "PGP 1985, Young Alumni Achiever 2015"
    },
    {
      image_url: "/images/raghuram_rajan.jpg",
      name: "Raghuram Rajan",
      other_info: "PGP 1985, Young Alumni Achiever 2015"
    },
    {
      image_url: "/images/raghuram_rajan.jpg",
      name: "Raghuram Rajan",
      other_info: "PGP 1985, Young Alumni Achiever 2015"
    },
    {
      image_url: "/images/raghuram_rajan.jpg",
      name: "Raghuram Rajan",
      other_info: "PGP 1985, Young Alumni Achiever 2015"
    },
    {
      image_url: "/images/raghuram_rajan.jpg",
      name: "Raghuram Rajan",
      other_info: "PGP 1985, Young Alumni Achiever 2015"
    },
    {
      image_url: "/images/raghuram_rajan.jpg",
      name: "Raghuram Rajan",
      other_info: "PGP 1985, Young Alumni Achiever 2015"
    },
    {
      image_url: "/images/raghuram_rajan.jpg",
      name: "Raghuram Rajan",
      other_info: "PGP 1985, Young Alumni Achiever 2015"
    },
    {
      image_url: "/images/raghuram_rajan.jpg",
      name: "Raghuram Rajan",
      other_info: "PGP 1985, Young Alumni Achiever 2015"
    },
  ];

  var fetchUpcomingEvents = function(){
    $http({
      method: "GET",
      url: "https://iima.almaconnect.com/api/events.json"
    }).success(function(response){
      $scope.upcoming_events = response.data;
    });
  };
  fetchUpcomingEvents();

  var fetchMemories = function(){
    $http({
      method: "GET",
      url: "https://iima.almaconnect.com/api/memories.json"
    }).success(function(response){
      $scope.memories = response.data;
    });
  };
  fetchMemories();
}]);
