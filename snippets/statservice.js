'use strict';
angular.module('myApp').factory('stats', ['$rootScope','$filter','$location',
                                         function ($rootScope,$filter,$location){

	var visitReference = "ref_" + (Math.random()*1e32).toString(36);
	var visitStartTime = new Date();
	var storyStartTime = null;
	var stories = [];
	var magazineId = null;
	var storiesQueue = [];
	var descriptions = [];
	var hasBeenInitialized = false;

	var dateFormat = "yyyy-MM-dd HH:mm:ss.sss";

	var getPublicationDetails = function(){
		if(G.cordovaReady){
			DKPlugin.getPublicationDetails(
				'',
				that.success,
				that.failure
			);
		}
	};

	/*
	 * recordStats requires success and failure callbacks,
	 * but is not guaranteed to call these
	 * However, normally DKPlugin.recordStats will always work
	 * if G.cordovaReady is true of course.
	 */
	var recordStats = function(obj){
		if(G.cordovaReady){
			DKPlugin.recordStats(
				'',
				obj.stat,
				that.success,
				that.failure
			);
		}else{
			console.log("recordStats json: ");
			console.log(obj);
		}
	};


	var register = function(s){

		if(magazineId!=null){
			var visit = {
				magazineId : magazineId,
				subscriberId : '',
				stories : [s],
				reference : visitReference,
				duration : s.duration,
				isComplete : false,
				creationDate : $filter('date')(visitStartTime, dateFormat)
			};

			recordStats({stat:angular.toJson(visit)});

		}else{
			storiesQueue.push(s);
			getPublicationDetails();
		}
	};

	var recordQueuedStats = function(){
		console.log("recordQueuedStats called");
		for(var i=0;i<storiesQueue.length;i++){
			register(storiesQueue[i]);
		}
		storiesQueue = [];
	};

	/*
	 * StoryId is only provided for backward compatible reasons
	 * in this case but it's still required
	 */
	var getStoryIdByDescription = function(description){
		var i = descriptions.indexOf(description);
		if(i > -1){
			return i;
		}else{
			descriptions.push(description);
			return descriptions.length -1;
		}
	};

	var that = {};

	that.recordStat = function(description){
		console.log("recordStat : " + description);
		var pageDuration = 0;
		var prevStartTime = storyStartTime;
		storyStartTime = new Date();

		if(stories.length > 0){
			pageDuration = Math.floor((storyStartTime - prevStartTime)/1000);
			var s =  stories.pop();
			s.duration = pageDuration;
			s.isComplete = true;
			if(pageDuration >= 1){
				/*
				 * Only page views longer than 1 second should be registered
				 */
				register(s);
			}
		}

		var story = {
			description : description,
			storyId : getStoryIdByDescription(description),
			creationDate : $filter('date')(storyStartTime, dateFormat),
			orientation : "l",
			mode : "full_version",
			duration : 0,
		    isComplete : false,
		    reference : visitReference
		};

		stories.push(story);
	};

	/*
	 * that.success is a function that should only be used
	 * as a callback function for PhoneGap
	 */
	that.success = function(r){
		console.log("stats callback success");
		var result = angular.fromJson(r);
		if(result.hasOwnProperty('distributionIsAllowed')){
			/*
			 * Now we know it's the callback for getPublicationDetails
			 * and we can look for the editionKey.
			 * Unfortunately there's no straightforward way to retrieve
			 * that key for now, so we need to pluck it from the downloadUrl (durl)
			 *
			 */
			var editionKey = result.durl.split("/").pop().split(".").shift();
			console.log("editionKey is : " + editionKey);
			magazineId = editionKey;
			recordQueuedStats();
		}
	};

	/*
	 * that.failure is a function that should only be used
	 * as a callback function for PhoneGap
	 */
	that.failure = function(r){
		console.log("stats callback failure");
		console.log(r);
	};

	$rootScope.$on("$locationChangeSuccess", function(){
	    that.recordStat($location.path());
	});


	return that;

}]);
