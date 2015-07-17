/*global angular, Microsoft, DrawingTools, console*/

function infoBoxDirective() {
    'use strict';

    function link(scope, element, attrs, ctrls) {
        var infobox = new Microsoft.Maps.Infobox(),
            pushpinCtrl = ctrls[1];
        function updateLocation() {
            infobox.setLocation(new Microsoft.Maps.Location(scope.lat, scope.lng));
        }
        function updateOptions() {
            if (!scope.options) {
                scope.options = {};
            }
            if (scope.title) {
                scope.options.title = scope.title;
            }
            if (scope.description) {
                scope.options.description = scope.description + element.html();
            } else {
                scope.options.description = element.html();
            }
            if (scope.hasOwnProperty('visible')) {
                scope.options.visible = scope.visible;
            } else {
                scope.options.visible = true;
            }

            //TODO: Define a default offset for the default infobox to prevent overlapping default marker??? Maybe....

            infobox.setOptions(scope.options);
        }

        scope.$on('positionUpdated', function(event, location) {
           infobox.setLocation(location);
        });

        //This was not the child of a pushpin, so use the lat & lng
        if (!pushpinCtrl) {
            scope.$watch('lat', updateLocation);
            scope.$watch('lng', updateLocation);
        }

        scope.$watch('options', updateOptions);
        scope.$watch('title', updateOptions);
        scope.$watch('description', updateOptions);
        scope.$watch('visible', updateOptions);

        ctrls[0].map.entities.push(infobox);

        /*Need a way to set visible = false when close button clicked. This is not working*/
//        Microsoft.Maps.Events.addHandler(infobox, 'entitychanged', function(event) {
//            scope.visible = event.entity.getVisible();
//            scope.$apply();
//        });

        scope.$on('$destroy', function() {
            ctrls[0].map.entities.remove(infobox);
        });
    }

    return {
      link: link,
      template: '<div ng-transclude></div>',
      restrict: 'EA',
      transclude: true,
      scope: {
        options: '=?',
        lat: '=?',
        lng: '=?',
        title: '=?',
        description: '=?',
        visible: '=?'
      },
      require: ['^bingMap', '?^pushpin']
    };

}

angular.module('angularBingMaps.directives').directive('infoBox', infoBoxDirective);
