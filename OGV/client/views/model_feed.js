/*                     M O D E L _ F E E D . J S
 * BRL-CAD
 *
 * Copyright (c) 1995-2013 United States Government as represented by
 * the U.S. Army Research Laboratory.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public License
 * version 2.1 as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this file; see the file named COPYING for more
 * information.
 */

/**
 * @file OGV/client/views/model_feed.js
 * @brief helpers and events for model feed
 *
 * Model Feed is a place where all the models by all the users are shown.
 * Model Feed is comprised of Model Posts, each Model Post is for one 
 * model and further has Model View that shows representative image of the
 * model in model feed. Apart from these 3 sub parts model feed also contain
 * various social elements which are taken care of in other files such as
 * OGV/clients/views/social.js 
 */

Template.modelFeed.helpers({
    /**
     * models helper finds all the models from the database and then sorts
     * them in reverse chronological order. 
     */
    models: function() 
    {
    url = Router.current().url;
    url = url.split('/');
    modelId = url.pop();
    var model = ModelFiles.find(modelId);
    if(model.count()) { 
	return model; 
    } else {
    	var currentUser = Meteor.user();
	var audience = ['public', 'followers'];
	model = ModelFiles.find( {audience: {$in: audience}, owner: {$in: currentUser.profile.following}}, {sort: {timeUploaded: -1}});
//	model = Posts.find( {postedBy: {$in: currentUser.profile.following}}, {sort: {postedAt: -1}});

	if (model.count()) {
	    return model;
	} else {
	    return false;
	} 
    }
    }
}); 

Template.modelPost.events({
    'click .shareButton': function(){
		sharedBy = Meteor.userId();
		sharedModel = $('.shareButton')[0].dataset.src;
		modelOwner = ModelFiles.findOne(sharedModel).owner;
		sharedObject = { owner: modelOwner, sharedBy: sharedBy, model: sharedModel };
		Meteor.call('share', sharedObject, function(error, result){
					if(error){
						sAlert.error(error.reason);
					} else{
						sAlert.success("You shared model");
					}
		});
	}
});

Template.modelPost.helpers({
    /**
     * returns image of the user from database, if there's no image a default
     * image is shown.
     */
    userImg: function()
    {
	modelOwner = Meteor.users.findOne(this.owner);
	picId = modelOwner.profile.pic;
	if (picId) {
	    pic = ProfilePictures.findOne(picId);
	    picUrl = pic.url();
	    return picUrl;
        } else {
	    return '/icons/User.png';
	}
    },
    
    owner: function()
    {
	return Meteor.users.findOne(this.owner);
    }
});
    

Template.modelView.helpers({
    /**
    * returns thumbnail of the model from the user database, if there's no image 
    * a default image is shown.
    */
    thumbImg:function()
    {
    	thumbImage = ThumbFiles.findOne({gFile:this._id});
        if (thumbImage) {
            return thumbImage;
        } else {
            // return test;
        }  
    }
});
