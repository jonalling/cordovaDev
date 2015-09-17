angular.module('starter.directives', [])

////// worked but couldn't inject in controller
.directive('resize', function ($window) {

   function getComputedStyle (element, styleProp) {
		if (element.currentStyle) {
			return element.currentStyle[styleProp];
		} else if ($window.getComputedStyle) {
			return $window.getComputedStyle(element,null).getPropertyValue(styleProp);
		}
		return '';
   };

    return function (scope,element) {
        var fluidDiv = element[0].querySelector('#fluidDiv');

        function applyScopeVars () {
                scope.width = $window.innerWidth;
                scope.height = $window.innerHeight;
                scope.fluidHeight = parseInt(getComputedStyle(fluidDiv, 'height'), 10);
                scope.fluidWidth = parseInt(getComputedStyle(fluidDiv, 'width'), 10);


        }

        angular.element($window).bind('resize', function(){
            scope.$apply(function() {
               applyScopeVars();

            });
        });

        applyScopeVars();

    }

});
