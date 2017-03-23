## Description

[nested-pop](https://www.npmjs.com/package/nested-pop) is a promise based node module that makes populate grandchildren in
[WaterLine](https://github.com/balderdashy/waterline) a breeze. Right now it only works with [SailsJS](http://sailsjs.com/).

## Technologies Used

* [NodeJS](https://nodejs.org)

## Example 

```js
var nestedPop = require('nested-pop');

User.find()
  .populate('dog')
  .then(function(users) {
  return nestedPop(users, {
    dog: [
      'breed'
    ]
  }).then(function(users) {
    return users;
  });
 });
```

## What I Learned

I learned in depth how WaterLine works especially when it comes to populating data.
