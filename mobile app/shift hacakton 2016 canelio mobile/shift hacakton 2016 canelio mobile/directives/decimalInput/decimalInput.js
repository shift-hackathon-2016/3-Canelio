App.directive('decimalInput', function ($rootScope, $interval) {
    return {
        restrict: "E",
        templateUrl: 'directives/decimalInput/decimalInput.html',
        link: function ($scope, $element, $attrs) {
            if (typeof $scope.navigateBack !== "function"){
                $scope.navigateBack = function () {
                    $rootScope.goBack();

                }
            }

            
            $('.decimalInputContainer .input').html($scope.decimalInput_DefaultValue);


            $scope.decimalInput_addNumber = function (el) {
                var add = $(el).children('.number').text();
                var before = $('.decimalInputContainer .input').append(add);
            }

            $scope.decimalInput_deleteSign = function () {
                var text = $('.decimalInputContainer .input').text();
                text = text.substring(0, text.length - 1);
                $('.decimalInputContainer .input').text(text);
            }

            $('.decimalInputContainer .numberContainer').on('touchstart', function (e) {
                $scope.decimalInput_addNumber(this);
                $(this).addClass('numberContainerActive');
            });

            $('.decimalInputContainer .numberContainer').on('touchend', function (e) {
                $(this).removeClass('numberContainerActive');
            });
            $('.decimalInputContainer .numberContainer').on('mouseleave', function (e) {
                $(this).removeClass('numberContainerActive');
            });


            $('.decimalInputContainer .deleteContainer').on('touchstart', function (e) {
                $scope.decimalInput_deleteSign();
                $scope.decimalInput_deleteMouseDown();
            });
            $('.decimalInputContainer .deleteContainer').on('touchend', function (e) {
                $scope.decimalInput_deleteMouseUp();
            });
            $('.decimalInputContainer .deleteContainer').on('mouseleave', function (e) {
                $scope.decimalInput_deleteMouseUp();
            });



            $scope.decimalInput_reset = function () {
                $scope.decimalInput_visible = !$scope.decimalInput_visible;
                $('.decimalInputContainer .input').text('');
            }



            $scope.decimalInput_delete = function () {
                if($scope.decimalInput_input.length != 0){
                    $scope.decimalInput_input= $scope.decimalInput_input.substring(0, $scope.decimalInput_input.length - 1);
                }
            }

            $scope.decimalInput_deleteMouseDown = function () {
                $interval.cancel($scope.decimalInput_deleteInterval);
                $scope.decimalInput_deleteInterval = $interval(function () {
                    $('.decimalInputContainer .input').text('');
                }, 500);
            }

            $scope.decimalInput_deleteMouseUp = function () {
                $interval.cancel($scope.decimalInput_deleteInterval);
            }

            

            var width = $('body').width();
            var edgeNumWidth = Math.floor((width - 2) / 3);
            var midNumWidth = ((width - 2) % 3) + edgeNumWidth;

            $scope.decimalInput_getNumStyle = function (position) {
                var width = edgeNumWidth;
                if (position == 'mid') {
                    width = midNumWidth;
                }
                return {width:width}
            }

            $scope.decimalInput_inputFiledStyle = function () {
                var right = edgeNumWidth + 6;
                return {right:right}
            }

            $scope.decimalInput_saveStyle = function () {
                var left = edgeNumWidth+ midNumWidth + 6;
                return { left: left }
            }

        }
    }
});