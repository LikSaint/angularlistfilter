'use string'

var purchaseApp = angular.module('purchaseApp', ['ngAnimate', 'ui.bootstrap', 'angularUtils.directives.dirPagination']);
purchaseApp.controller('purchaseController', function ($scope, $uibModal, $log) {
    $scope.list = {
        items: [
            {id: 1, money: 842.00, comment: 'Комментарий 1'},
            {id: 2, money: -15.01, comment: 'Комментарий 2'},
            {id: 3, money: -15.01, comment: 'Комментарий 2'},
            {id: 4, money: -15.01, comment: 'Комментарий 2'},
            {id: 5, money: -15.01, comment: 'Комментарий 2'},
            {id: 6, money: -15.01, comment: 'Комментарий 2'},
            {id: 7, money: -15.01, comment: 'Комментарий 2'},
            {id: 8, money: -15.01, comment: 'Комментарий 2'},
            {id: 9, money: -15.01, comment: 'Комментарий 2'},
            {id: 10, money: -15.01, comment: 'Комментарий 2'},
            {id: 11, money: -15.01, comment: 'Комментарий 2'},
            {id: 12, money: -15.01, comment: 'Комментарий 2'},
            {id: 13, money: -15.01, comment: 'Комментарий 2'},
            {id: 14, money: -15.01, comment: 'Комментарий 2'},
            {id: 15, money: -15.01, comment: 'Комментарий 2'},
            {id: 16, money: -15.01, comment: 'Комментарий 2'},
            {id: 17, money: -15.01, comment: 'Комментарий 2'},
            {id: 18, money: -15.01, comment: 'Комментарий 2'},
            {id: 19, money: -15.01, comment: 'Комментарий 2'},
            {id: 20, money: -15.01, comment: 'Комментарий 2'},
            {id: 21, money: 125.25, comment: 'Комментарий 3'},
            {id: 22, money: 125.25, comment: 'Комментарий 3'},
            {id: 23, money: 125.25, comment: 'Комментарий 3'},
            {id: 24, money: 125.25, comment: 'Комментарий 3'},
            {id: 25, money: 125.25, comment: 'Комментарий 3'},
            {id: 26, money: 125.25, comment: 'Комментарий 3'},
            {id: 27, money: 125.25, comment: 'Комментарий 3'}
        ]
    };
    $scope.animationsEnabled = true;
    $scope.calcTotal = function () {
        $scope.total = 0;
        angular.forEach($scope.list.items, function (s) {
                $scope.total += s.money;
            }
        );
    }
    $scope.calcTotal();
    $scope.open = function (currentID) {
        if (currentID != undefined) {
            $scope.currentID = currentID;
            $scope.newElem = false;
        } else {
            $scope.newElem = true;
            $scope.currentID = $scope.list.items.length + 1;
        }

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: "",
            scope: $scope,
            resolve: {
            }
        });

        modalInstance.result.then(function (items) {
            if ($scope.newElem) {
                $scope.list.items.push({
                    id: $scope.list.items.length + 1,
                    money: parseFloat(items.money),
                    comment: items.comment
                });
                $scope.calcTotal();
            } else {
                $scope.list.items[currentID - 1].money = parseFloat(items.money);
                $scope.list.items[currentID - 1].comment = items.comment;
                $scope.calcTotal();
            }

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.sortField = undefined;
    $scope.reverse = false;

    $scope.sort = function (fieldName) {
        if ($scope.sortField === fieldName) {
            $scope.reverse = !$scope.reverse;
            if(window.location.hash == "#" + fieldName + "down"){
                window.location.hash = "#" + fieldName + "up"
            } else {
                window.location.hash = "#" + fieldName + "down"
            };
        } else {
            $scope.sortField = fieldName;
            $scope.reverse = false;
            window.location.hash = "#" + fieldName + "up";
        }
    };

    $scope.isSortUp = function (fieldName) {
        return $scope.sortField === fieldName && !$scope.reverse;
    };
    $scope.isSortDown = function (fieldName) {
        return $scope.sortField === fieldName && $scope.reverse;
    };
    if(window.location.hash == "#idup"){
        $scope.sort('id');
    } else if(window.location.hash == "#iddown"){
        $scope.sort('id');
        $scope.reverse = true;
    }else if(window.location.hash == "#moneyup"){
        $scope.sort('money');
    } else if(window.location.hash == "#moneydown"){
        $scope.sort('money');
        $scope.reverse = true;
    }
});

angular.module('purchaseApp').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {
    if (!$scope.newElem) {
        $scope.money = $scope.list.items[$scope.currentID - 1].money;
        $scope.comment = $scope.list.items[$scope.currentID - 1].comment;
    }
    $scope.addItem = function (modalForm) {
        modalForm.addButton.$touched = true;
        if (modalForm.$valid) {
            $uibModalInstance.close($scope);
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
purchaseApp.directive('commentcheck', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (comment) {
                if (comment && !(/[^[/|,|!|?|;|:|"|'|\w|\s|\n|[а-я]|[0-9]]]*/ig.test(comment)) && comment.length < 512) {
                    ctrl.$setValidity('commentcheck', true);
                    return comment;
                } else {
                    ctrl.$setValidity('commentcheck', false);
                    return undefined;
                }
            });
        }
    };
});
purchaseApp.directive('moneycheck', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (money) {
                if (/-?[1-9]+.?[1-9]{0,2}/.test(money) && (money < 1000 && money > -1000 && money != 0)) {
                    ctrl.$setValidity('moneycheck', true);
                    return money;
                } else {
                    ctrl.$setValidity('moneycheck', false);
                    return undefined;
                }
            });
        }
    };
});

