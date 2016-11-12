var contentful = require('contentful');

// Configure Contentful
exports.const = {
    "POST_CT": '2wKn6yEnZewu2SCCkus4as',
    "CAT_CT": '5KMiN6YPvi42icqAUQMCQe',
    "AUTHOR_CT": '1kUEViTN4EmGiEaaeC6ouY'
};

exports.api = contentful.createClient({
    space: 'dwexedm4848a',
    accessToken: '5b10c64edb3d4ee774bc6f92a705c8c0e21f30aacac92ce46460cf27ae73a274'
});
