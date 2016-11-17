var cf = require('./cf');
var dateFormat = require('dateformat');
var md = require('marked');
var Q = require('q');

module.exports.getPosts = function (limit) {
    var deferred = Q.defer();
    cf.api.getEntries({
        'content_type': cf.const.POST_CT,
        'limit': limit,
        'order': '-sys.createdAt'
    }).then(function (response) {
        var posts = [];
        if (response.total > 0) {
            posts = this.formatPosts_(response.items);
        }
        deferred.resolve(posts);
    }.bind(this), function(errorMsg) {
        console.error(errorMsg);
        deferred.reject(errorMsg);
    }.bind(this));

    return deferred.promise;
};

module.exports.getPostBySlug = function (slug) {
    var deferred = Q.defer();
    cf.api.getEntries({
        'content_type': cf.const.POST_CT,
        'fields.slug': slug
    }).then(function (entries) {
        if (entries.total == 0) {
            deferred.reject('Sorry, this blog post hasn\'t been found');
        } else {
            deferred.resolve(this.formatPost_(entries.items[0]));
        }
    }.bind(this), function(errorMsg) {
        console.error(errorMsg);
        deferred.reject(errorMsg);
    }.bind(this));
    return deferred.promise;
};

module.exports.getCategories = function () {
    var deferred = Q.defer();
    cf.api.getEntries({
        'content_type': cf.const.CAT_CT,
        'include': 0
    }).then(function (response) {
        if (response.total == 0) {
            deferred.resolve([]);
        } else {
            deferred.resolve(response.items);
        }
    }.bind(this));
    return deferred.promise;
};

module.exports.getCategoryWithPosts = function (id) {
    var deferred = Q.defer();
    cf.api.getEntry(id).then(function (catResponse) {
        cf.api.getEntries({
            'content_type': cf.const.POST_CT,
            'fields.category.sys.id': id
        }).then(function(postsResponse) {
            deferred.resolve({
                category: catResponse,
                posts: this.formatPosts_(postsResponse.items)
            });
        }.bind(this), function(errorMsg) {
            console.error(errorMsg);
            deferred.reject(errorMsg);
        });
        return deferred.promise;
    }.bind(this), function(errorMsg) {
        console.error(errorMsg);
        deferred.reject(errorMsg);
    }.bind(this));
    return deferred.promise;
};

module.exports.formatPosts_ = function (posts) {
    var result = [];
    console.log(require('util').inspect(posts, { depth: null }));
    for (var i = 0; i < posts.length; i++) {
        var post = posts[i];
        result.push({
            title: post.fields.title,
            slug: post.fields.slug,
            featuredImage: post.fields.featuredImage ? post.fields.featuredImage.fields : null,
            plot: post.fields.body.substr(0, 250) + '...',
            date: dateFormat(post.fields.date, 'fullDate'),
            categories: post.fields.category,
            author: {
                name: post.fields.author[0].fields.name,
                website: post.fields.author[0].fields.website
            },
            read: Math.ceil(post.fields.body.split(" ").length / 250)
        });
    }
    return result;
};

module.exports.formatPost_ = function (post) {
    return {
        title: post.fields.title,
        featuredImage: post.fields.featuredImage ? post.fields.featuredImage.fields : null,
        body: md(post.fields.body),
        slug: post.fields.slug,
        date: dateFormat(post.fields.date, 'fullDate'),
        categories: post.fields.category,
        author: {
            name: post.fields.author[0].fields.name,
            website: post.fields.author[0].fields.website
        },
        read: Math.ceil(post.fields.body.split(" ").length / 250)
    };
};
