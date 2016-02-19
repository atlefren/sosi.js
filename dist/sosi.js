(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],2:[function(require,module,exports){
'use strict';
var SOSI = require('./sosi');
window.SOSI = SOSI;

},{"./sosi":12}],3:[function(require,module,exports){
'use strict';
var _ = require('underscore');

/**
 * This is adopted from backbone.js which
 * is available for use under the MIT software license.
 * see http://github.com/jashkenas/backbone/blob/master/LICENSE
 */

var Base = function () {
    this.initialize.apply(this, arguments);
};

_.extend(Base.prototype, {
    initialize: function () {}
});

Base.extend = function (protoProps, staticProps) {
    var parent = this;
    var child;

    if (protoProps && _.has(protoProps, 'constructor')) {
        child = protoProps.constructor;
    } else {
        child = function () { return parent.apply(this, arguments); };
    }
        _.extend(child, parent, staticProps);
    var Surrogate = function () { this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();
    if (protoProps) {
        _.extend(child.prototype, protoProps);
    }
    child.__super__ = parent.prototype;

    return child;
};

module.exports = Base;

},{"underscore":1}],4:[function(require,module,exports){
'use strict';
var _ = require('underscore');
var Base = require('../class/Base');
var Point = require('../geometry/Point');
var LineString = require('../geometry/LineString');
var Polygon = require('../geometry/Polygon');
var writePoint = require('./writePoint');


var Sosi2GeoJSON = Base.extend({

    initialize: function (sosidata) {
        this.sosidata = sosidata;
    },

    dumps: function () {
        return {
            'type': 'FeatureCollection',
            'features': this.getFeatures(),
            'crs': this.writeCrs()
        };
    },

    getFeatures: function () {
        return _.map(
            this.sosidata.features.all(),
            this.createGeoJsonFeature,
            this
        );
    },

    createGeoJsonFeature: function (sosifeature) {
        return {
            'type': 'Feature',
            'id': sosifeature.id,
            'properties': sosifeature.attributes,
            'geometry': this.writeGeometry(sosifeature.geometry)
        };
    },

    writeGeometry: function (geom) {
        if (geom instanceof Point) {
            return {
                'type': 'Point',
                'coordinates': writePoint(geom)
            };
        }

        if (geom instanceof LineString) {
            return {
                'type': 'LineString',
                'coordinates': _.map(geom.kurve, writePoint)
            };
        }

        if (geom instanceof Polygon) {
            var shell = _.map(geom.flate, writePoint);
            var holes = _.map(geom.holes, function (hole) {
                return _.map(hole, writePoint);
            });
            return {
                'type': 'Polygon',
                'coordinates': [shell].concat(holes)
            };
        }
        throw new Error('cannot write geometry!');
    },

    writeCrs: function () {
        return {
            'type': 'name',
            'properties': {
                'name': this.sosidata.hode.srid
            }
        };
    }
});

module.exports = Sosi2GeoJSON;

},{"../class/Base":3,"../geometry/LineString":7,"../geometry/Point":9,"../geometry/Polygon":10,"./writePoint":6,"underscore":1}],5:[function(require,module,exports){
'use strict';
var _ = require('underscore');
var Base = require('../class/Base');
var Point = require('../geometry/Point');
var LineString = require('../geometry/LineString');
var Polygon = require('../geometry/Polygon');
var writePoint = require('./writePoint');


function mapArcs(refs, lines) {
    return _.map(refs, function (ref) {
        var index = lines[Math.abs(ref)].index;
        if (ref > 0) {
            return index;
        } else {
            return -(Math.abs(index) + 1);
        }
    });
}


var Sosi2TopoJSON = Base.extend({

    initialize: function (sosidata) {
        this.sosidata = sosidata;
    },

    dumps: function (name) {
        var points = this.getPoints();
        var lines = this.getLines();
        var polygons = this.getPolygons(lines);
        var geometries = points.concat(_.map(lines, function (line) {
            return line.geometry;
        })).concat(polygons);

        var data = {
            'type': 'Topology',
            'objects': {}
        };
        data.objects[name] = {
            'type': 'GeometryCollection',
            'geometries': geometries
        };

        var arcs = _.map(_.sortBy(lines, function (line) {return line.index; }), function (line) {
            return line.arc;
        });

        if (arcs.length) {
            data.arcs = arcs;
        }
        return data;
    },

    getByType: function (type) {
        return _.filter(this.sosidata.features.all(), function (feature) {
            return (feature.geometry instanceof type);
        });
    },

    getPoints: function () {
        var points = this.getByType(Point);
        return _.map(points, function (point) {
            var properties = _.clone(point.attributes);
            properties.id = point.id;
            return {
                'type': 'Point',
                'properties': properties,
                'coordinates': writePoint(point.geometry)
            };
        });
    },

    getLines: function () {
        var lines = this.getByType(LineString);
        return _.reduce(lines, function (res, line, index) {
            var properties = _.clone(line.attributes);
            properties.id = line.id;
            res[line.id] = {
                'geometry': {
                    'type': 'LineString',
                    'properties': properties,
                    'arcs': [index]
                },
                'arc': _.map(line.geometry.kurve, writePoint),
                'index': index
            };
            return res;
        }, {});
    },

    getPolygons: function (lines) {
        var polygons = this.getByType(Polygon);
        return _.map(polygons, function (polygon) {
            var properties = _.clone(polygon.attributes);
            properties.id = polygon.id;

            var arcs = [mapArcs(polygon.geometry.shellRefs, lines)];

            arcs = arcs.concat(_.map(polygon.geometry.holeRefs, function (hole) {
                if (hole.length === 1) {
                    var feature = this.sosidata.features.getById(Math.abs(hole[0]));
                    if (feature.geometry instanceof Polygon) {
                        return mapArcs(feature.geometry.shellRefs, lines);
                    }
                }
                return mapArcs(hole, lines);
            }, this));

            return {
                'type': 'Polygon',
                'properties': properties,
                'arcs': arcs
            };
        }, this);
    }
});

module.exports = Sosi2TopoJSON;

},{"../class/Base":3,"../geometry/LineString":7,"../geometry/Point":9,"../geometry/Polygon":10,"./writePoint":6,"underscore":1}],6:[function(require,module,exports){
'use strict';

function writePoint(point) {
    return [point.x, point.y];
}
module.exports = writePoint;

},{}],7:[function(require,module,exports){
'use strict';
var _ = require('underscore');
var Base = require('../class/Base');
var Point = require('./Point');

var LineString = Base.extend({
    initialize: function (lines, origo, unit) {
        this.kurve = _.compact(_.map(lines, function (line) {
            if (line.indexOf('NØ') === -1) {
                return new Point(line, origo, unit);
            }
        }));

        this.knutepunkter = _.filter(this.kurve, function (punkt) {
            return punkt.has_tiepoint;
        });
    }
});

module.exports = LineString;

},{"../class/Base":3,"./Point":9,"underscore":1}],8:[function(require,module,exports){
'use strict';
var _ = require('underscore');
var Point = require('./Point');
var LineString = require('./LineString');

function cleanLines(lines) {
    return _.filter(lines, function (line) {
        return (line.indexOf('NØ') === -1);
    });
}

var LineStringFromArc = LineString.extend({ // BUEP - an arc defined by three points on a circle
    initialize: function (lines, origo, unit) {
        var p = _.map(cleanLines(lines), function (coord) {
            return new Point(coord, origo, unit);
        });
        if (p.length !== 3) {
            throw new Error('BUEP er ikke definert med 3 punkter');
        }
        // in order to copy & paste my own formulas, we use the same variable names
        var e1 = p[0].x, e2 = p[1].x, e3 = p[2].x;
        var n1 = p[0].y, n2 = p[1].y, n3 = p[2].y;

        // helper constants
        var p12  = (e1 * e1 - e2 * e2 + n1 * n1 - n2 * n2) / 2.0;
        var p13  = (e1 * e1 - e3 * e3 + n1 * n1 - n3 * n3) / 2.0;

        var dE12 = e1 - e2,
            dE13 = e1 - e3,
            dN12 = n1 - n2,
            dN13 = n1 - n3;

        // center of the circle
        var cE = (dN13 * p12 - dN12 * p13) / (dE12 * dN13 - dN12 * dE13);
        var cN = (dE13 * p12 - dE12 * p13) / (dN12 * dE13 - dE12 * dN13);

        // radius of the circle
        var r = Math.sqrt(Math.pow(e1 - cE, 2) + Math.pow(n1 - cN, 2));

        /* angles of points A and B (1 and 3) */
        var th1 = Math.atan2(n1 - cN, e1 - cE);
        var th3 = Math.atan2(n3 - cN, e3 - cE);

        /* interpolation step in radians */
        var dth = th3 - th1;
        if (dth < 0) {
            dth  += 2 * Math.PI;
        }
        if (dth > Math.PI) {
            dth = -2 * Math.PI + dth;
        }
        var npt = Math.floor(32 * dth / 2 * Math.PI);
        if (npt < 0) {
            npt = -npt;
        }
        if (npt < 3) {
            npt = 3;
        }

        dth = dth / (npt - 1);

        this.kurve = _.map(_.range(npt), function (i) {
            var x  = cE + r * Math.cos(th1 + dth * i);
            var y = cN + r * Math.sin(th1 + dth * i);
            if (isNaN(x)) {
                throw new Error('BUEP: Interpolated ' + x + ' for point ' + i + ' of ' + npt + ' in curve.');
            }
            return new Point(x, y);
        });

        this.knutepunkter = _.filter(p, function (point) {
            return point.has_tiepoint;
        });
    }
});


module.exports = LineStringFromArc;

},{"./LineString":7,"./Point":9,"underscore":1}],9:[function(require,module,exports){
'use strict';
var _ = require('underscore');
var Base = require('../class/Base');
var roundToDecimals = require('../util/round');


var Point = Base.extend({

    knutepunkt: false,

    initialize: function (line, origo, unit) {
        if (_.isNumber(line)) { /* initialized directly with x and y */
            this.x = line;
            this.y = origo;
            return;
        }

        if (_.isArray(line)) {
            line = line[1];
        }

        var coords = line.split(/\s+/);

        var numDecimals = 0;
        if (unit < 1) {
            numDecimals = -Math.floor(Math.log(unit) / Math.LN10);
        }

        this.y = roundToDecimals((parseInt(coords[0], 10) * unit) + origo.y, numDecimals);
        this.x = roundToDecimals((parseInt(coords[1], 10) * unit) + origo.x, numDecimals);

        if (coords[2] && !isNaN(coords[2])) {
            this.z = roundToDecimals(parseInt(coords[2], 10) * unit, numDecimals);
        }

        if (line.indexOf('.KP') !== -1) {
            this.setTiepoint(
                line.substring(line.indexOf('.KP'), line.length).split(' ')[1]
            );
        }
    },

    setTiepoint: function (kode) {
        this.has_tiepoint = true;
        this.knutepunktkode = parseInt(kode, 10);
    }
});

module.exports = Point;

},{"../class/Base":3,"../util/round":21,"underscore":1}],10:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var Base = require('../class/Base');

function createPolygon(refs, features) {
    var flate =  _.flatten(_.map(refs, function (ref) {
        var id = Math.abs(ref);
        var kurve = features.getById(id);
        if (!kurve) {
            throw new Error('Fant ikke KURVE ' + id + ' for FLATE');
        }
        var geom = kurve.geometry.kurve;
        if (ref < 0) {
            geom = _.clone(geom).reverse();
        }
        return _.initial(geom);
    }));
    flate.push(flate[0]);
    return flate;
}

function parseRefs(refs) {
    return _.map(refs.trim().split(' '), function (ref) {
        return parseInt(ref.replace(':', ''), 10);
    });
}

var Polygon = Base.extend({
        initialize: function (refs, features) {
            var shell = refs;
            var holes = [];
            var index = refs.indexOf('(');
            if (index !== -1) {
                shell = refs.substr(0, index);
                holes = refs.substr(index, refs.length);
            }

            shell = parseRefs(shell);
            holes = _.map(
                _.reduce(holes, function (result, character) {
                    if (character === '(') {
                        result.push('');
                    } else if (character !== ')' && character !== '') {
                        result[result.length - 1] += character;
                    }
                    return result;
                }, []),
                parseRefs
            );

            this.flate = createPolygon(shell, features);

            this.holes = _.map(holes, function (hole) {
                if (hole.length === 1) {
                    var feature = features.getById(Math.abs(hole[0]));
                    if (feature.geometryType === 'FLATE') {
                        return feature.geometry.flate;
                    }
                }
                return createPolygon(hole, features);
            });
            this.shellRefs = shell;
            this.holeRefs = holes;
        }
    });

module.exports = Polygon;

},{"../class/Base":3,"underscore":1}],11:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var parseTree = require('./util/parseTree');
var Base = require('./class/Base');
var Head = require('./types/Head');
var Features = require('./types/Features');

var Sosi2GeoJSON = require('./dumpers/Sosi2GeoJSON');
var Sosi2TopoJSON = require('./dumpers/Sosi2TopoJSON');

var Def = Base.extend({});

var Objdef = Base.extend({});

var dumpTypes = {
    'geojson': Sosi2GeoJSON,
    'topojson': Sosi2TopoJSON
};

var SosiData = Base.extend({
    initialize: function (data) {
        this.hode = new Head(data['HODE'] || data['HODE 0']);
        this.def = new Def(data['DEF']); //Not sure if I will care about this
        this.objdef = new Objdef(data['OBJDEF']); //Not sure if I will care about this
        this.features = new Features(
            _.omit(data, ['HODE', 'HODE 0', 'DEF', 'OBJDEF', 'SLUTT']),
            this.hode
        );
    },

    dumps: function (format) {
        if (dumpTypes[format]) {
            return new dumpTypes[format](this).dumps(_.rest(arguments));
        }
        throw new Error('Outputformat ' + format + ' is not supported!');
    }
});


function splitOnNewline(data) {
    return _.map(data.split('\n'), function (line) {

        //ignore comments starting with ! also in the middle of the line
        if (line.indexOf('!') !== 0) {
            line = line.split('!')[0];
        }

        // trim whitespace padding comments and elsewhere
        return line.replace(/^\s+|\s+$/g, ''); 
    });
}

var Parser = Base.extend({

    parse: function (data) {
        return new SosiData(parseTree(splitOnNewline(data), 1));
    },

    getFormats: function () {
        return _.keys(dumpTypes);
    }
});

module.exports = Parser;

},{"./class/Base":3,"./dumpers/Sosi2GeoJSON":4,"./dumpers/Sosi2TopoJSON":5,"./types/Features":14,"./types/Head":15,"./util/parseTree":20,"underscore":1}],12:[function(require,module,exports){
'use strict';

var parser = require('./parser');

var SOSI = {
    Parser: parser
};

module.exports = SOSI;

},{"./parser":11}],13:[function(require,module,exports){
'use strict';
var _ = require('underscore');
var Base = require('../class/Base');

var Point = require('../geometry/Point');
var LineString = require('../geometry/LineString');
var LineStringFromArc = require('../geometry/LineStringFromArc');
var Polygon = require('../geometry/Polygon');

var parseFromLevel2 = require('../util/parseFromLevel2');
var specialAttributes = require('../util/specialAttributes');

function createGeometry(geometryType, lines, origo, unit) {

    var geometryTypes = {
        'PUNKT': Point,
        // a point feature with exsta styling hints - the geometry actually consists of up to three points
        'TEKST': Point,
        'KURVE': LineString,
        'BUEP': LineStringFromArc,
        'LINJE': LineString, // old 4.0 name for unsmoothed KURVE
        'FLATE': Polygon
    };

    if (!geometryTypes[geometryType]) {
        throw new Error('GeometryType ' + geometryType + ' is not handled (yet..?)');
    }
    return new geometryTypes[geometryType](lines, origo, unit);
}



var Feature = Base.extend({

    initialize: function (data, origo, unit, features) {
        if (data.id === undefined || data.id === null) {
            throw new Error('Feature must have ID!');
        }
        this.id = data.id;
        this.parseData(data, origo, unit, features);
        this.geometryType = data.geometryType;
    },

    parseData: function (data, origo, unit) {

        var split = _.reduce(data.lines, function (dict, line) {
            if (line.indexOf('..NØ') !== -1) {
                dict.foundGeom = true;
            }
            if (dict.foundGeom) {
                dict.geom.push(line);
            } else {
                if (line.indexOf('..REF') !== -1) {
                    dict.foundRef = true;
                    line = line.replace('..REF', '');
                }
                if (dict.foundRef) {
                    if (line[0] === '.') {
                        dict.foundRef = false;
                    } else {
                        dict.refs.push(line);
                    }
                } else {
                    dict.attributes.push(line);
                }
            }
            return dict;
        }, {
            'attributes': [],
            'geom': [],
            'refs': [],
            'foundGeom': false,
            'foundRef': false
        });

        this.attributes = parseFromLevel2(split.attributes);
        this.attributes = _.reduce(this.attributes, function (attrs, value, key) {
            if (!!specialAttributes && specialAttributes[key]) {
                attrs[key] = specialAttributes[key].createFunction(value);
            } else {
                attrs[key] = value;
            }
            return attrs;
        }, {});

        if (split.refs.length > 0) {
            this.attributes.REF = split.refs.join(' ');
        }
        if (this.attributes.ENHET) {
            unit = parseFloat(this.attributes.ENHET);
        }

        this.raw_data = {
            geometryType: data.geometryType,
            geometry: split.geom,
            origo: origo,
            unit: unit
        };
    },

    buildGeometry: function (features) {
        if (this.raw_data.geometryType === 'FLATE') {
            this.geometry = new Polygon(this.attributes.REF, features);
            this.geometry.center = new Point(
                this.raw_data.geometry,
                this.raw_data.origo,
                this.raw_data.unit
            );
            this.attributes = _.omit(this.attributes, 'REF');
        } else {
            this.geometry = createGeometry(
                this.raw_data.geometryType,
                this.raw_data.geometry,
                this.raw_data.origo,
                this.raw_data.unit
            );
        }
        this.raw_data = null;
    }
});

module.exports = Feature;

},{"../class/Base":3,"../geometry/LineString":7,"../geometry/LineStringFromArc":8,"../geometry/Point":9,"../geometry/Polygon":10,"../util/parseFromLevel2":19,"../util/specialAttributes":23,"underscore":1}],14:[function(require,module,exports){
'use strict';
var _ = require('underscore');
var Base = require('../class/Base');
var Feature = require('../types/Feature');


var Features = Base.extend({

    initialize: function (elements, head) {

        this.head = head;
        this.index = [];
        this.features = _.object(_.map(elements, function (value, key) {
            key = key.replace(':', '').split(/\s+/);
            var data = {
                id: parseInt(key[1], 10),
                geometryType: key[0],
                lines: _.rest(value)
            };
            this.index.push(data.id);
            return [data.id, new Feature(data, head.origo, head.enhet)];
        }, this));
    },

    ensureGeom: function (feature) {
        if (feature && !feature.geometry) {
            feature.buildGeometry(this);
        }
        return feature;
    },

    length: function () {
        return _.size(this.features);
    },

    at: function (i) {
        return this.getById(this.index[i]);
    },

    getById: function (id) {
        return this.ensureGeom(this.features[id]);
    },

    all: function (ordered) {
        if (ordered) {
            /* order comes at a 25% performance loss */
            return _.map(this.index, this.getById, this);
        } else {
            return _.map(this.features, this.ensureGeom, this);
        }
    }
});

module.exports = Features;

},{"../class/Base":3,"../types/Feature":13,"underscore":1}],15:[function(require,module,exports){
'use strict';
var _ = require('underscore');
var Base = require('../class/Base');
var mappings = require('../util/mappings');
var getLongname = require('../util/getLongname');
var parseFromLevel2 = require('../util/parseFromLevel2');
var datatypes = require('../util/datatypes');
var specialAttributes = require('../util/specialAttributes');

function getString(data, key) {
    var str = data[key] || '';
    return str.replace(/'/g, '');
}

function getNumber(data, key) {
    return parseFloat(data[key]);
}

function getSrid(koordsys) {
    koordsys = parseInt(koordsys, 10);
    if (mappings.koordsysMap[koordsys]) {
        return mappings.koordsysMap[koordsys].srid;
    }
    throw new Error('KOORDSYS = ' + koordsys + ' not found!');
}

function getSridFromGeosys(geosys) {
    if (_.isArray(geosys)) {
        throw new Error('GEOSYS cannot be parsed in uncompacted form yet.');
    } else {
        geosys = geosys.split(/\s+/);
    }
    if (mappings.geosysMap[geosys[0]]) {
        return mappings.geosysMap[geosys[0]].srid;
    }
    throw new Error('GEOSYS = ' + geosys + ' not found!');
}

function parseBbox(data) {
    var ll = data['MIN-NØ'].split(/\s+/);
    var ur = data['MAX-NØ'].split(/\s+/);
    return [
        parseFloat(ll[1]),
        parseFloat(ll[0]),
        parseFloat(ur[1]),
        parseFloat(ur[0])
    ];
}

function parseOrigo(data) {
    data = _.filter(data.split(/\s+/), function (element) {
        return element !== '';
    });
    return {
        'x': parseFloat(data[1]),
        'y': parseFloat(data[0])
    };
}

function parseUnit(data) {
    if (data.TRANSPAR.enhet) {
        return parseFloat(data.TRANSPAR.enhet);
    }
    return parseFloat(data.TRANSPAR.ENHET);
}

var Head = Base.extend({
    initialize: function (data) {
        this.setData(data);
    },

    parse: function (data) {
        return parseFromLevel2(data);
    },

    setData: function (data) {
        data = this.parse(data);
        this.eier = getString(data, getLongname('EIER'));
        this.produsent = getString(data, getLongname('PRODUSENT'));
        this.objektkatalog = getString(data, 'OBJEKTKATALOG');
        this.verifiseringsdato = data[getLongname('VERIFISERINGSDATO')];
        this.version = getNumber(data, getLongname('SOSI-VERSJON'));
        this.level = getNumber(data, getLongname('SOSI-NIVÅ'));
        if (!!datatypes) {
            this.kvalitet = specialAttributes[getLongname('KVALITET')].createFunction(data[getLongname('KVALITET')]);
        } else {
            this.kvalitet = getString(data, getLongname('KVALITET'));
        }
        this.bbox = parseBbox(data['OMRÅDE']);
        this.origo = parseOrigo(data['TRANSPAR']['ORIGO-NØ']);
        this.enhet = parseUnit(data);
        this.vertdatum = getString(data['TRANSPAR'], 'VERT-DATUM');
        if (data['TRANSPAR']['KOORDSYS']) {
            this.srid = getSrid(data['TRANSPAR']['KOORDSYS']);
        } else {
            this.srid = getSridFromGeosys(data['TRANSPAR']['GEOSYS']);
        }
    }
});

module.exports = Head;

},{"../class/Base":3,"../util/datatypes":16,"../util/getLongname":17,"../util/mappings":18,"../util/parseFromLevel2":19,"../util/specialAttributes":23,"underscore":1}],16:[function(require,module,exports){
'use strict';

/* automatic conversion from sosi.h - TODO convert to single json object */
var sositypes = {
    'ADM_GRENSE': ['administrativGrense', 'String'],
    'ADRESSE': ['adresse', 'String'],
    'ADRESSEREFKODE': ['adresseReferansekode', 'String'],
    'AJOURFØRTAV': ['ajourførtAv', 'String'],
    'AJOURFØRTDATO': ['ajourførtDato', 'Date'],
    'DATO': ['Dato', 'Date'],
    'AKGEOLTEMA': ['annetKvTema', 'Integer'],
    'AKVA_ART': ['akvaArt', 'Integer'],
    'AKVA_ENHET': ['akvaEnhet', 'Integer'],
    'AKVA_KONSTR': ['akvaKonstruksjon', 'Integer'],
    'AKVA_NR': ['akvaKonsesjonsnummer', 'Integer'],
    'AKVA_STATUS': ['akvaKonsesjonsstatus', 'String'],
    'AKVA_TYPE': ['akvaKonsesjonstype', 'String'],
    'AKVAKONSESJONSFORMÅL': ['akvaKonsesjonsformål', 'String'],
    'AKVATEMP': ['akvaTemperatur', 'Integer'],
    'AKVSYMBOL': ['andreKvSymbol', 'Integer'],
    'ALDERBESKRIVELSE': ['alderBeskrivelse', 'String'],
    'ALGE_KONS': ['algeKonsentrasjon', 'Integer'],
    'ALGE_TYP': ['algeType', 'String'],
    'ALM-TYP': ['allmenningtype', 'String'],
    'ALT_AREALBYGNING': ['alternativtArealBygning', 'Real'],
    'ALTERN_FNR': ['altForekomstNr', 'String'],
    'ALTERNATIVTNAVN': ['alternativtNavn', 'String'],
    'ANBELINTYP': ['annenBergartLinjetype', 'Integer'],
    'ANDREKILDERBELASTNING': ['andrekilderBelastning', 'Integer'],
    'ANKRINGSBRUK': ['ankringsbruk', 'Integer'],
    'ANKRTYP': ['ankringstype', 'Integer'],
    'ANLEGGNØDSTRØM': ['anleggNødstrøm', 'String'],
    'ANLEGGSNUMMER': ['anleggsnummer', 'String'],
    'ANNEN_VANNB_ELEK': ['annenVannbehandlingAvhElektrisitet', 'String'],
    'ANNENLUFTHAVN': ['annenLufthavn', 'Integer'],
    'ANNENMATRENHET': ['annenMatrEnhet', 'String'],
    'ANT_ANALYS': ['antallAnalyser', 'Integer'],
    'ANT_ANS': ['antallAnsatte', 'Integer'],
    'ANT_ÅRSV': ['antallÅrsverk', 'Integer'],
    'ANTALL_BAD': ['antallBad', 'Integer'],
    'ANTALL_BOENHETER': ['antallBoenheter', 'Integer'],
    'ANTALL_ETASJER': ['antall etasjer', 'Integer'],
    'ANTALL_ROM': ['antallRom', 'Integer'],
    'ANTALL_RØKLØP': ['antallRøkløp', 'Real'],
    'ANTALL_WC': ['antallWC', 'Integer'],
    'ANTALLFASTBOENDE': ['antallFastboende', 'Integer'],
    'ANTALLFRITIDSBOLIGER': ['antallFritidsboliger', 'Integer'],
    'ANTALLIDENTISKELYS': ['antallIdentiskeLys', 'Integer'],
    'ANTALLSKISPOR': ['antallSkispor', 'Integer'],
    'ANTALLSKORSTEINER': ['antallSkorsteiner', 'Integer'],
    'ANTDRIFT': ['landbruksregAntBedrifter', 'Integer'],
    'ARAVGRTYPE': ['arealressursAvgrensingType', 'Integer'],
    'ARDYRKING': ['arealressursDyrkbarjord', 'Integer'],
    'AREAL': ['areal', 'Real'],
    'AREALBRUK_RESTR': ['arealbrukRestriksjon', 'Integer'],
    'AREALENHET': ['arealenhet', 'String'],
    'AREALINNSJØ': ['arealInnsjø', 'Real'],
    'AREALKILDE': ['arealkilde', 'Integer'],
    'AREALMERKNAD': ['arealmerknad', 'String'],
    'AREALNEDBØRFELT': ['arealNedbørfelt', 'String'],
    'AREALREGINE': ['arealRegine', 'Real'],
    'AREALST': ['arealbruksstatus', 'Integer'],
    'AREALVERDI_IND': ['arealverdiindikator', 'String'],
    'ARENKEL': ['arealressursGruppertEnkel', 'Integer'],
    'ARGRUNNF': ['arealressursGrunnforhold', 'Integer'],
    'ARKARTSTD': ['arealressursKartstandard', 'String'],
    'ARNFJBRUK': ['arealressursNaturgrunnlagForJordbruk', 'Integer'],
    'ARSKOGBON': ['arealressursSkogbonitet', 'Integer'],
    'ART_ENGELSK': ['engelskArtsnavn', 'String'],
    'ART_LATIN': ['vitenskapeligArtsnavn', 'String'],
    'ART_NORSK': ['norskArtsnavn', 'String'],
    'ART_TAKSONOMI': ['taksonomiskKode', 'Integer'],
    'ARTRESLAG': ['arealressursTreslag', 'Integer'],
    'ARTYPE': ['arealressursArealtype', 'Integer'],
    'ARUTETYPE': ['annenRutetype', 'String'],
    'ARVANLIG': ['arealressursGruppertVanlig', 'Integer'],
    'ARVEGET': ['arealressursVegetasjonsdekke', 'Integer'],
    'ASKOG': ['potensiellSkogbonitet', 'Integer'],
    'ATIL': ['arealtilstand', 'Integer'],
    'AVFALLSDEP': ['avfallDeponiEgnethet', 'Integer'],
    'AVFALLTYPE': ['avfallType', 'Integer'],
    'AVGIFTSBELAGT': ['avgiftsbelagt', 'String'],
    'AVGJDATO': ['avgjørelsesdato', 'Date'],
    'AVGRENSNINGSTYPE': ['avgrensningstype', 'Integer'],
    'AVKJ': ['avkjørselsbestemmelse', 'Integer'],
    'AVKLARTEIERE': ['avklartEiere', 'String'],
    'AVLØP': ['avløp', 'Integer'],
    'AVLØP_TILKNYTNING': ['tilknyttetKommunaltAvløp', 'String'],
    'AVLØPINNSJØ': ['avløpInnsjø', 'Real'],
    'AVLØPRENSEPRINSIPP': ['avløpRenseprinsipp', 'String'],
    'AVLØPSANLEGGEIERFORM': ['avløpsanleggEierform', 'Integer'],
    'AVLØPSANLEGGTYPE': ['avløpsanleggtype', 'Integer'],
    'AVSETNING': ['avsetningstype', 'Integer'],
    'AVSETNRATE': ['avsetnRate', 'String'],
    'BAKKEOPPLØSNING': ['bakkeoppløsning', 'Real'],
    'BARMARKSLØYPETYPE': ['barmarksløypeType', 'String'],
    'BEALDERBST': ['bergartAlderBestemmelse', 'String'],
    'BEBYGD_AREAL': ['bebygdAreal', 'Real'],
    'BEFARGEKO': ['cmykFargekode', 'String'],
    'BEHSTAT': ['behandlingsstatus', 'Integer'],
    'BEITEBRUKERID': ['reinbeitebrukerID', 'String'],
    'BEITETID': ['beitetid', 'String'],
    'BEITETIDVEDTAK': ['beitetidVedtak', 'String'],
    'BEKJSAMSET': ['bergartKjemiskSammensetning', 'String'],
    'BEKORNSTR': ['bergartKornstørrelse', 'String'],
    'BELIGG': ['omgivelsetypeTraséseksjon', 'Integer'],
    'BELIGGENHET': ['beliggenhet', 'String'],
    'BELYSNING': ['belysning', 'String'],
    'BEREGNET': ['beregningsDato', 'Date'],
    'BEREGNETÅR': ['beregnetÅr', 'String'],
    'BERGFARGE': ['bergartFarge', 'String'],
    'BERGGRENSETYPE': ['berggrunnGrensetype', 'Integer'],
    'BESK_ELEMENT': ['beskrivelseElement', 'String'],
    'BESKRIV': ['tiltaksbeskrivelse', 'String'],
    'BESKRIVELSE': ['beskrivelse', 'String'],
    'BESTEMMELSEOMRNAVN': ['bestemmelseOmrådeNavn', 'String'],
    'BESTRUKTUR': ['bergartStruktur', 'String'],
    'BESYMBOLTY': ['bergartSymbol', 'Integer'],
    'BETEKSTUR': ['bergartTekstur', 'String'],
    'BETJENINGSGRAD': ['betjeningsgrad', 'String'],
    'BILDE-BIT-PIXEL': ['bitsPerPixel', 'Integer'],
    'BILDE-FIL': ['bildeFil', 'String'],
    'PLANPÅSKRIFTTYPE': ['planpåskriftype', 'Integer'],
    'BILDEKATEGORI': ['bildekategori', 'Integer'],
    'BILDEMÅLESTOKK': ['bildemålestokk', 'Integer'],
    'BILDENUMMER': ['bildenummer', 'Integer'],
    'BILDE-SYS': ['bildeSystem', 'Integer'],
    'BILDE-TYPE': ['bildeType', 'String'],
    'BILDE-UNDERTYPE': ['bildeUndertype', 'String'],
    'BISPENUMMER': ['bispenummer', 'Integer'],
    'BKLASSIFIK': ['berggrunnKlassifikasjon', 'Integer'],
    'BLOKK': ['steinOgBlokk', 'String'],
    'BLOKKAREAL': ['blokkareal', 'Real'],
    'BMANDEL': ['bmAndel', 'Integer'],
    'BMANTALL': ['bmAntall', 'Integer'],
    'BMARSTID': ['bmÅrstid', 'Integer'],
    'BMART': ['bmArt', 'String'],
    'BMENHET': ['bmEnhet', 'Integer'],
    'BMFUNK': ['bmOmrådefunksjon', 'Integer'],
    'BMFUNKVAL': ['bmFunksjonskvalitet', 'Integer'],
    'BMKILDTYP': ['bmKildetype', 'Integer'],
    'BMKILDVURD': ['bmKildevurdering', 'Integer'],
    'BMNATYP': ['bmNaturtype', 'String'],
    'BMNATYPMARIN': ['bmNaturtypeMarin', 'String'],
    'BMNATYPMARINUTF': ['bmNaturtypeMarinUtforming', 'String'],
    'BMNATYPUTF': ['bmNaturtypeUtforming', 'String'],
    'BMREGDATO': ['bmRegistreringsdato', 'Date'],
    'BMTRUETKAT': ['bmTruethetskategori', 'String'],
    'BMVERDI': ['bmVerdi', 'String'],
    'BMVILTVEKT': ['bmViltvekt', 'Integer'],
    'BNR': ['bruksnummer', 'Integer'],
    'BOKST': ['bokstav', 'String'],
    'BOLTTYPE': ['boltType', 'Integer'],
    'BOREDAGER': ['antallBoredager', 'Integer'],
    'BOREDATO': ['boredato', 'Date'],
    'BOREDYP': ['boredyp', 'Real'],
    'BOREFIRMA': ['borefirma', 'String'],
    'BOREINNRETN': ['boreinnretningsnavn', 'String'],
    'BORESLUTT': ['boreslutt', 'Date'],
    'BORESTART': ['borestart', 'Date'],
    'BORETYPE': ['boringType', 'Integer'],
    'BORHELNING': ['gfborehHelning', 'Integer'],
    'BORHULLNR': ['borhullNummer', 'String'],
    'BORLENGDE': ['gfborehLengde', 'Real'],
    'BORRETNING': ['gfborehRetning', 'Integer'],
    'BOT_OK_INT': ['botaniskØkologiskInteresse', 'String'],
    'BRANSJE': ['bransje', 'String'],
    'BREDDE': ['trasébredde', 'Integer'],
    'BRENNVIDDE': ['brennvidde', 'Real'],
    'BRENSELTANKNEDGR': ['brenseltankNedgravd', 'Integer'],
    'BRETYPE': ['bretype', 'Integer'],
    'BRUDDLENGDE': ['bruddlengde', 'Real'],
    'BRUEIER': ['brueier', 'String'],
    'BRUK_GRAD': ['kulturlandskapBrukGrad', 'String'],
    'BRUKONSTRTYPE': ['brukonstruksjonstype', 'String'],
    'BRUKSAREAL': ['bruksareal', 'Real'],
    'BRUKSAREALANNET': ['bruksarealTilAnnet', 'Real'],
    'BRUKSAREALBOLIG': ['bruksarealTilBolig', 'Real'],
    'BRUKSAREALTOTALT': ['bruksarealTotalt', 'Real'],
    'BRUKSENHETSTYPE': ['bruksenhetstype', 'String'],
    'BRUKSFREKVENS': ['friluftsområdeBruksfrekvens', 'Integer'],
    'BRUKSNAVN': ['bruksnavn', 'String'],
    'BRUMATERIAL': ['brumaterial', 'String'],
    'BRUOVERBRU': ['bruOverBru', 'String'],
    'BRUTRAFIKKTYPE': ['brutrafikktype', 'String'],
    'BRUÅPNING': ['bruåpningsmåte', 'String'],
    'BRØNN_REGNR': ['brønnRegNr', 'Integer'],
    'BRØNN_RESULTAT': ['brønnresultat', 'String'],
    'BRØNNKLASSE': ['petroleumsbrønnklasse', 'String'],
    'BRØNNTYPE': ['petroleumsbrønntype', 'String'],
    'BRØYTEAREALTILGANG': ['brøytearealtilgang', 'Integer'],
    'BRØYTEAREALTYPE': ['brøytearealtype', 'Integer'],
    'BRØYTEBREDDE': ['brøytebredde', 'Integer'],
    'BRØYTEPRIORITET': ['brøyteprioritet', 'String'],
    'BRØYTERESTRIKSJON': ['brøyterestriksjon', 'String'],
    'BRØYTESIDE': ['brøyteside', 'String'],
    'BRØYTETYPE': ['brøytetype', 'String'],
    'BUNNTYP': ['bunntype', 'String'],
    'BUNNTYPE': ['bunntype', 'Integer'],
    'BYDELSNAVN': ['bydelsnavn', 'String'],
    'BYDELSNUMMER': ['bydelsnummer', 'Integer'],
    'BYGGHØYDEIMETER': ['bygghøydeIMeter', 'Integer'],
    'BYGGNR': ['bygningsnummer', 'Integer'],
    'BYGGSTAT': ['bygningsstatus', 'String'],
    'BYGGTYP_NBR': ['bygningstype', 'Integer'],
    'BYGGVERK': ['byggverkbestemmelse', 'Integer'],
    'BYGN_ENDR_KODE': ['bygningsendringskode', 'String'],
    'BYGN_ENDR_LØPENR': ['endringsløpenummer', 'Integer'],
    'BYGN_HIST_DATO': ['bygningshistorikkDato', 'Date'],
    'BYGN_REF_TYPE': ['bygningReferansetype', 'String'],
    'BYGN_SAKSNR': ['bygnSaksnr', 'String'],
    'BYGNINGSFUNKSJON': ['bygningsfunksjon', 'Integer'],
    'BÆREEVNEBENEVNELSE': ['bæreevnebenevnelse', 'String'],
    'BØYE_FORM': ['bøyeform', 'Integer'],
    'BÅNDLAGTFREMTIL': ['båndlagtFremTil', 'Date'],
    'CLEIER': ['CL_Eier', 'String'],
    'D': ['dybde', 'Integer'],
    'DA_ANNET': ['landbruksregArealAnnet', 'Integer'],
    'DA_JORD_D': ['landbruksregArealJordIDrift', 'Real'],
    'DA_JORD_E': ['landbruksregArealJordbruk', 'Integer'],
    'DA_SKOG': ['landbruksregArealSkog', 'Integer'],
    'DAMFORMÅL': ['damFormål', 'String'],
    'DAMFUNKSJON': ['damFunksjon', 'Integer'],
    'DAMLENGDE': ['damLengde', 'Real'],
    'DAMTYPE': ['damType', 'String'],
    'DATAFANGSTDATO': ['datafangstdato', 'Date'],
    'DATAUTTAKSDATO': ['datauttaksdato', 'Date'],
    'DATERMETOD': ['dateringMetode', 'Integer'],
    'DATUM': ['datum', 'String'],
    'DEFORMASJONFASE': ['deformasjonFase', 'Integer'],
    'DEKKENAVN': ['dekkeEnhetNavn', 'String'],
    'DEKKETYPE': ['dekketype', 'String'],
    'DEKNINGSNUMMER': ['dekningsnummer', 'String'],
    'DEL_BRED': ['posisjonBredde', 'Integer'],
    'DEL_DYBD': ['posisjonDybde', 'Integer'],
    'DELOMRÅDENAVN': ['delområdenavn', 'String'],
    'DELOMRÅDENUMMER': ['delområdenummer', 'String'],
    'DELSTREKNINGSNUMMER': ['delstrekningsnummer', 'String'],
    'DEPONISTATUS': ['deponistatus', 'Integer'],
    'DEPONITYPE': ['deponitype', 'Integer'],
    'DESINFANLAVHELEK': ['desinfAnleggAvhElektrisitet', 'String'],
    'DIGITALISERINGSMÅLESTOKK': ['digitaliseringsmålestokk', 'Integer'],
    'DIM-BREDDE': ['tekstTegnBredde', 'Real'],
    'DIM-HØYDE': ['tekstTegnHøyde', 'Real'],
    'DISTKODE': ['reinbeitedistriktID', 'String'],
    'DK_MANDEL': ['dyrkningspotensialMandel', 'Integer'],
    'DK_MANDEL_A': ['nedklassifiseringMandel', 'Integer'],
    'DK_NEDBOR': ['nedbørsbasert', 'Integer'],
    'DK_NEDBOR_A': ['nedklassifiseringNedbør', 'Integer'],
    'DK_VANN': ['vanningsbasert', 'Integer'],
    'DK_VANN_A': ['nedklassifiseringVanning', 'Integer'],
    'DOKUMENTASJONSTYPE': ['dokumentasjonType', 'Integer'],
    'D-REF-INT': ['vertikalReferanseInternasjonalDybde', 'Integer'],
    'DRIFTFHOLD': ['driftForhold', 'Integer'],
    'DRIFTMETOD': ['driftMetode', 'Integer'],
    'DRSENTER': ['jordregisterDriftssenter', 'Integer'],
    'DYBDE': ['dybde', 'Real'],
    'DYBDE_MAX': ['maximumsdybde', 'Real'],
    'DYBDE_MIN': ['minimumsdybde', 'Real'],
    'DYBDEFJELL': ['dybdeTilFjell', 'Real'],
    'DYBDEKVIKKLEIRE': ['dybdeTilKvikkleire', 'Real'],
    'DYBDEMÅLEMETODE': ['dybemålemetode', 'Integer'],
    'DYBDE-REF': ['dybdeReferanse', 'String'],
    'DYBDETYPE': ['dybdetype', 'Integer'],
    'DYPMIDDEL': ['dypMiddel', 'Integer'],
    'DYPSTØRSTMÅLT': ['dypStørstMålt', 'Integer'],
    'SERIENUMMER': ['serienummer', 'String'],
    'DYRKING': ['jordregisterDyrkingsjord', 'String'],
    'EIER': ['geodataeier', 'String'],
    'EIERFORHOLD': ['eierforhold', 'String'],
    'EIERFORM': ['eierformType', 'Integer'],
    'EKOORD-H': ['jordregisterKoordinatHøyde', 'Integer'],
    'EKOORD-N': ['jordregisterKoordinatNord', 'Integer'],
    'EKOORD-Ø': ['jordregisterKoordinatØst', 'Integer'],
    'ENDRET_TID': ['tidspunktEndring', 'Date'],
    'ENDRET_TYPE': ['typeEndring', 'String'],
    'ENDRINGSGRAD': ['endringsgrad', 'String'],
    'ENERGIKILDE': ['energikilde', 'String'],
    'ENHET': ['enhet', 'Real'],
    'ENHET-D': ['enhetDybde', 'Real'],
    'ENHET-H': ['enhetHøyde', 'Real'],
    'EROSJONGS': ['erosjonsrisikoGrasdekke', 'Integer'],
    'EROSJONHP': ['erosjonsrisikoHøstpløying', 'Integer'],
    'ETABLERINGSDATO': ['etableringsdato', 'Date'],
    'ETABLERT': ['fastmerkeEtableringsdato', 'Date'],
    'ETASJENUMMER': ['etasjenummer', 'Integer'],
    'ETASJEPLAN': ['etasjeplan', 'String'],
    'ETASJETALL': ['etasjetall', 'String'],
    'ETAT': ['etat', 'String'],
    'F_TYPE': ['fiskeType', 'Integer'],
    'FAGOMRÅD': ['ledningsfagområde', 'Integer'],
    'FALLHØYDE': ['fallHøyde', 'Real'],
    'FAO_KODE': ['faoKode', 'String'],
    'FARTØY_ID': ['fartøyIdentifikasjon', 'String'],
    'FASADE': ['fasade', 'Integer'],
    'FBNAVN': ['fiskebedriftsnavn', 'String'],
    'FBNR': ['fiskebruksnummer', 'Integer'],
    'FBNR_FYLK': ['fiskebruksnummerFylke', 'String'],
    'FELTNAVN': ['feltbetegnelse', 'String'],
    'FELTREGISTRERTAV': ['feltegistrertAv', 'String'],
    'FIGF_ID': ['figurFørSkifteIdent', 'Integer'],
    'FILM': ['film', 'String'],
    'FIRMA': ['firmanavn', 'String'],
    'FISK_KODE': ['artskode', 'Integer'],
    'FISKE_BEDR_ANDEL': ['fiskebedriftsandel', 'Integer'],
    'FISKE_BEDR_EIER': ['fiskebedriftseier', 'String'],
    'FISKE_BEDR_OMR': ['fiskebedriftsområde', 'Integer'],
    'FISKE_BEDR_PROD': ['fiskebedriftsprodukt', 'Integer'],
    'FISKE_BEDR_SERVICE': ['fiskebedriftservice', 'Integer'],
    'FISKE_KAP_ENH': ['fiskekapasitetEnhet', 'Integer'],
    'FISKE_KAPASITET': ['fiskekapasitet', 'Integer'],
    'FISKE_TYPE': ['fisketype', 'Integer'],
    'FISKERI_BRUK_TYPE': ['fiskeribrukstype', 'Integer'],
    'FISKERI_RESS_TYPE': ['fiskeriressursOmrådetype', 'Integer'],
    'FISKERIREDSKAP_GEN_AKTIV': ['fiskeriredskapGenAktiv', 'Integer'],
    'FISKERIREDSKAP_GEN_PASSIV': ['fiskeriredskapGenPassiv', 'Integer'],
    'FISKERIREDSKAP_SPES_AKTIV': ['fiskeriredskapSpesAktiv', 'Integer'],
    'FISKERIREDSKAP_SPES_PASSIV': ['fiskeriredskapSpesPassiv', 'Integer'],
    'FJELL': ['fjellblotninger', 'Integer'],
    'FJORDID': ['fjordidentifikasjon', 'String'],
    'FLODBOLGEHOYDE': ['flodbolgehoyde', 'Integer'],
    'FLOMLAVPUNKT': ['flomLavPunkt', 'Real'],
    'FLYFIRMA': ['flyfirma', 'String'],
    'FLYHØYDE': ['flyhøyde', 'Integer'],
    'FLYRESTR': ['flyRestriksjon', 'Integer'],
    'FMADKOMST': ['fastmerkeAdkomst', 'String'],
    'FMDIM': ['fastmerkeDiameter', 'Integer'],
    'FMHREF': ['fastmerkeHøyderef', 'String'],
    'FMIDDATO': ['fastmerkeIdDato', 'Date'],
    'FMIDGML': ['fastmerkeIdGammel', 'String'],
    'FMINST': ['fastmerkeInstitusjon', 'String'],
    'FMKOMM': ['fastmerkeKommune', 'Integer'],
    'FMMERK': ['fastmerkeMerknader', 'String'],
    'FMNAVN': ['fastmerkeNavn', 'String'],
    'FMNUMMER': ['fastmerkeNummer', 'String'],
    'FMREFBER': ['fastmerkeRefGrunnrisBeregning', 'String'],
    'FMREFHBER': ['fastmerkeRefHøydeBeregning', 'String'],
    'FMRESTR': ['fastmerkeRestriksjon', 'String'],
    'FMSREF': ['fastmerkeSentrumRef', 'String'],
    'FNR': ['festenummer', 'Integer'],
    'FONTENE_TYPE': ['fontenetype', 'Integer'],
    'FOREKNAVN': ['navnRastoffobj', 'String'],
    'FOREKOM_ID': ['identRastoffobj', 'Integer'],
    'FORHOLDANDREHUS': ['forholdAndreHus', 'String'],
    'FORHÅNDSTALL': ['forhåndstall', 'Integer'],
    'FORLENGET_DATO': ['forlengetDato', 'Date'],
    'FORMASJON': ['formasjonTotalDyp', 'String'],
    'FORMELFLATE': ['kvFormFlatetype', 'Integer'],
    'FORMELLIN': ['kvFormLinjetype', 'Integer'],
    'FORMELPKT': ['kvFormPunkttype', 'Integer'],
    'FORMÅLSEKSJON': ['formålSeksjonKode', 'String'],
    'FORUR_AREAL': ['forurensetAreal', 'Integer'],
    'FORUR_GRUNNTYPE': ['forurensetGrunnType', 'Integer'],
    'FORUR_HOVEDGRUPPE': ['forurensningHovedgruppe', 'Integer'],
    'FORV_MYND': ['forvaltningMyndighet', 'String'],
    'FORV_PLAN': ['forvaltningPlan', 'Integer'],
    'FOSSILTYPE': ['fossilNavn', 'String'],
    'FOTODATO': ['fotodato', 'Date'],
    'FOTOGRAF': ['fotograf', 'String'],
    'FOTRUTETYPE': ['fotrutetype', 'Integer'],
    'FRASPORNODEKILOMETER': ['fraSpornodeKilometer', 'Real'],
    'FRASPORNODETEKST': ['fraSpornodeTekst', 'String'],
    'FRASPORNODETYPE': ['fraSpornodeType', 'String'],
    'F-REF-INT': ['friseilingReferanseInternasjonal', 'Integer'],
    'FREG': ['jordregisterFreg', 'Integer'],
    'FRIDRIFTSTILSYN': ['friluftslivsområdeDriftstilsyn', 'Integer'],
    'FRIEGNETHET': ['friluftslivsområdeEgnethet', 'Integer'],
    'FRIPLANST': ['friluftslivsområdePlanStatus', 'Integer'],
    'FRISEILHØYDE': ['friseilingshøyde', 'Real'],
    'FRISEIL-REF': ['frilseilingReferanse', 'String'],
    'FRISIKRING': ['friluftslivSikring', 'Integer'],
    'FRISPERR': ['frisperring', 'Integer'],
    'FRISTMATRIKKELFØRINGSKRAV': ['fristMatrikkelføringskrav', 'Date'],
    'FRISTOPPMÅLING': ['fristOppmåling', 'Date'],
    'FRITILRETTELEGGING': ['friluftslivsområdeTilrettelegging', 'Integer'],
    'FRITYPE': ['friluftslivsområdeType', 'String'],
    'FRIVERDI': ['friluftslivsområdeVerdi', 'String'],
    'F-STRENG': ['formatertStreng', 'String'],
    'FUNDAMENTERING': ['fundamentering', 'Integer'],
    'FYDELTEMA': ['fylkesdeltema', 'Integer'],
    'FYLKESNR': ['fylkesnummer', 'Integer'],
    'FYRLISTEKARAKTER': ['fyrlisteKarakter', 'String'],
    'FYRLISTENUMMER': ['fyrlistenummer', 'String'],
    'FYSENHET': ['fysiskEnhet', 'Integer'],
    'FYSISKMILJØ': ['fysiskMiljø', 'Integer'],
    'FYSPARAM': ['fysiskParameter', 'Integer'],
    'FYSSTR': ['fysiskStorrelse', 'Real'],
    'FØLGER_TERRENGDET': ['følgerTerrengdetalj', 'String'],
    'FØRSTEDATAFANGSTDATO': ['førsteDatafangstdato', 'Date'],
    'FØRSTEDIGITALISERINGSDATO': ['førsteDigitaliseringsdato', 'Date'],
    'GARDIDNR': ['landbruksregProdusentId', 'Integer'],
    'GATENAVN': ['gatenavn', 'String'],
    'GATENR': ['gatenummer', 'Integer'],
    'GENRESTR': ['generellrestriksjon', 'Integer'],
    'GEOALDER': ['geolAlder', 'Integer'],
    'GEOALDER_FRA': ['geolMaksAlder', 'Integer'],
    'GEOALDER_TIL': ['geolMinAlder', 'Integer'],
    'GEOBESK': ['geolBeskrivelse', 'String'],
    'GEO-DATUM': ['geoDatumInternasjonal', 'Integer'],
    'GEOFELTNR': ['geologFeltnummer', 'String'],
    'GEOFORMASJ': ['geolFormasjonNavn', 'String'],
    'GEOGRUPPE': ['geolGruppeNavn', 'String'],
    'GEOHOVERDI': ['geolHorisontalverdi', 'Integer'],
    'GEOKARTNR': ['geolKartnummer', 'Integer'],
    'GEOKOORD': ['geoKoordinatverdiEnhet', 'Integer'],
    'GEOLOKNR': ['geolLokalitetnummer', 'Real'],
    'GEO-PROJ': ['geoProjeksjon', 'Integer'],
    'GEOPÅVISNINGTYPE': ['geolPavisningtype', 'Integer'],
    'GEOSITENO': ['geositeNummer', 'Integer'],
    'GEO-SONE': ['geoSoneProjeksjon', 'Integer'],
    'GEOVERDIVURD': ['geolVerdivurdering', 'Integer'],
    'GEOVEVERDI': ['geolVertikalverdi', 'Integer'],
    'GFANOMALI': ['geofAnomali', 'Integer'],
    'GFDYPSTR': ['geofDyp', 'Real'],
    'GFDYPTYPE': ['geofDyptype', 'Integer'],
    'GFFALLBREGMET': ['geofFallBeregnMetode', 'Integer'],
    'GFFALLSTR': ['geofFallstorrelse', 'Integer'],
    'GFFLATE': ['geofFlate', 'Integer'],
    'GFL_INFO': ['geofLinjeInfo', 'Integer'],
    'GFLINJE': ['geofTolkLinjetype', 'Integer'],
    'GFMETODE': ['geofMetode', 'Integer'],
    'GFP_INFO': ['geofPunktInfo', 'Integer'],
    'GFSTROK': ['geofStrokretning', 'Integer'],
    'GFTOLK': ['geofTolkMetode', 'Integer'],
    'GFUTLLEN': ['geofLengdeUtlegg', 'Integer'],
    'GFUTLRETN': ['geofRetningUtlegg', 'Integer'],
    'GFUTLTYPE': ['geofTypeUtlegg', 'Integer'],
    'GJENNOMFØRINGSFRIST': ['gjennomføringsfrist', 'Date'],
    'GJENTAKSINTERVAL': ['gjentaksInterval', 'Integer'],
    'GJERDETYPE': ['sikringGjerdetype', 'Integer'],
    'GKEKSTRAKT': ['geokEkstrakt', 'Integer'],
    'GKENHET': ['geokEnhet', 'Integer'],
    'GKFRADYP': ['geokFraDyp', 'Integer'],
    'GKFRAKSJON': ['geokFraksjon', 'Integer'],
    'GKHORISONT': ['geokHorisont', 'Integer'],
    'GKHOVMEDIUM': ['geokHovedmedium', 'Integer'],
    'GKMEDIUM': ['geokMedium', 'Integer'],
    'GKRETSNAVN': ['grunnkretsnavn', 'String'],
    'GKTILDYP': ['geokTilDyp', 'Integer'],
    'GKVARIABEL': ['geokVariabel', 'String'],
    'GNR': ['gårdsnummer', 'Integer'],
    'GR_TYPE': ['grensetypeSjø', 'Integer'],
    'GRAVERT': ['gravertTekst', 'String'],
    'GRDANNELSE': ['grotteDannelse', 'Integer'],
    'GRDIMSJOND': ['grotteDimDiameter', 'Integer'],
    'GRDIMSJONH': ['grotteDimHoyre', 'Integer'],
    'GRDIMSJONO': ['grotteDimOver', 'Integer'],
    'GRDIMSJONU': ['grotteDimUnder', 'Integer'],
    'GRDIMSJONV': ['grotteDimVenstre', 'Integer'],
    'GRENSEMERKENEDSATTI': ['grensemerkeNedsasttI', 'String'],
    'GRENSEPUNKTNUMMER': ['grensepunktnummer', 'String'],
    'GRENSEPUNKTTYPE': ['grensepunkttype', 'Integer'],
    'GRENSEVEDTAK': ['grenseVedtak', 'String'],
    'GRFORMELM': ['grotteFormElement', 'Integer'],
    'GRGANGFORM': ['grotteGaForm', 'Integer'],
    'GRGANGTYPE': ['grotteGaType', 'String'],
    'GRHOYDE': ['grotteHoyde', 'Integer'],
    'GRLINTYPE': ['grotteLinjetype', 'Integer'],
    'GROTLEGEME': ['grotteLegeme', 'String'],
    'GROTNOYAKT': ['grotteNoyaktighet', 'String'],
    'GROTTELAST': ['grotteLast', 'Integer'],
    'GROTTENAVN': ['grotteNavn', 'String'],
    'GROTTEPLAN': ['grottePlan', 'String'],
    'GROTTLENKE': ['grotteLenke', 'Integer'],
    'GRPKTTYPE': ['grottePktType', 'Integer'],
    'GRPUNKTNR': ['grottePktNummer', 'String'],
    'GRUNNBORINGREF': ['grunnBoringReferanse', 'String'],
    'GRUNNFHOLD': ['losmGrunnforhold', 'Integer'],
    'GRUNNGASS': ['grunnGass', 'Integer'],
    'GRUNNKRETS': ['grunnkretsnummer', 'Integer'],
    'GRUNNLINJENAVN': ['grunnlinjepunktnavn', 'String'],
    'GRUNNLINJENUMMER': ['grunnlinjepunktnummer', 'String'],
    'GRUNNRISSREFERANSESPOR': ['grunnrissreferanseSpor', 'String'],
    'GRUNNVANN': ['grunnvannPotensiale', 'Integer'],
    'GRUNNVERDI': ['grunnVerdi', 'Real'],
    'GRVARSEL': ['grotteVarsel', 'Integer'],
    'GVAKT_PROS': ['geoVernAktivProsess', 'String'],
    'GVAREAL': ['geoVernAreal', 'String'],
    'GVDLIKEHOLD': ['geoVernVedlikehold', 'String'],
    'GVERNE_ID': ['geoVernObjektId', 'Integer'],
    'GVERNETYPE': ['geoVernTematype', 'Integer'],
    'GVERNHTYPE': ['geoVernHovedtype', 'String'],
    'GVERNKRT_A': ['geoVernAKriterie', 'String'],
    'GVERNKRT_B': ['geoVernBKriterie', 'String'],
    'GVERNKRT_C': ['geoVernCKriterie', 'String'],
    'GVERNVERDI': ['geoVernVerdi', 'Integer'],
    'GVGRENSETY': ['geoVernGrensetype', 'Integer'],
    'GVHINNHLD': ['geoVernHovInnhold', 'String'],
    'GVINNGREP': ['geoVernInngrep', 'String'],
    'GVLITTRTUR': ['geoVernLitteratur', 'String'],
    'GVOFFNTLGJ': ['geoVernOffentliggjoring', 'String'],
    'GVOMR_NAVN': ['geoVernOmrNavn', 'String'],
    'GVPROALDER': ['geoVernProsessalder', 'Integer'],
    'GVSAKSTATUS': ['geoVernSakStatus', 'Integer'],
    'GVSTATUS': ['geoVernType', 'Integer'],
    'GVSYSTEM': ['geoVernSystem', 'String'],
    'GVTINNHLD': ['geoVernTilleggInnhold', 'String'],
    'GVVKT_PROS': ['geoVernViktigProsess', 'String'],
    'GYLDIGFRA': ['gyldigFra', 'Date'],
    'GYLDIGTIL': ['gyldigTil', 'Date'],
    'H': ['høyde', 'Integer'],
    'H_EUREF89': ['høydeOverEuref89', 'Real'],
    'H_KAT_LANDSK': ['hovedkategoriLandskap', 'String'],
    'HAR_HEIS': ['harHeis', 'String'],
    'HASTIGHETSENHET': ['hastighetsenhet', 'String'],
    'HAVNE_D_ADM': ['havnedistriktadministrasjon', 'Integer'],
    'HAVNE_ID': ['havneidentifikasjon', 'Integer'],
    'HAVNEAVSNITTNUMMER': ['havneavsnittnummer', 'Integer'],
    'HAVNEAVSNITTSTATUS': ['havneavsnittstatus', 'String'],
    'HAVNEAVSNITTTYPE': ['havneavsnitttype', 'String'],
    'HAVNETERMINALISPSNUMMER': ['havneterminalISPSnummer', 'Integer'],
    'HAVNETERMINALNUMMER': ['havneterminalnummer', 'Integer'],
    'HAVNETERMINALSTATUS': ['havneterminalstatus', 'String'],
    'HAVNETERMINALTYPE': ['havneterminaltype', 'String'],
    'HBERGKODE': ['hovedBergKode', 'Integer'],
    'HELLING': ['helling', 'Integer'],
    'HENDELSE': ['trasénodeHendelsestype', 'Integer'],
    'HENSYNSONENAVN': ['hensynSonenavn', 'String'],
    'HFLOM': ['vannstandRegHøyestRegistrerte', 'Real'],
    'HINDERFLATE_TYPE': ['hinderFlateType', 'Integer'],
    'HINDERFLATEPENETRERINGSTYPE': ['hinderflatepenetreringstype', 'Integer'],
    'HJELPELINJETYPE': ['hjelpelinjetype', 'String'],
    'HJEMMELSGRUNNLAG': ['hjemmelsgrunnlag', 'String'],
    'HJULTRYKK': ['hjultrykk', 'String'],
    'H-MÅLEMETODE': ['målemetodeHøyde', 'Integer'],
    'H-NØYAKTIGHET': ['nøyaktighetHøyde', 'Integer'],
    'HOB': ['høydeOverBakken', 'Real'],
    'HOLDNINGSKLASSE': ['holdningsklasse', 'Integer'],
    'HOR_BÆREKONSTR': ['horisontalBærekonstr', 'Integer'],
    'HOVEDPARSELL': ['hovedParsell', 'Integer'],
    'HOVEDTEIG': ['hovedteig', 'String'],
    'HREF': ['høydereferanse', 'String'],
    'H-REF-INT': ['høydeReferanseInternasjonal', 'Integer'],
    'HRV': ['vannstandHøyesteRegulert', 'Real'],
    'HUSHOLDBELASTNING': ['husholdBelastning', 'Integer'],
    'HUSLØPENR': ['husLøpenr', 'Integer'],
    'HUSNR': ['husNr', 'Integer'],
    'HVANN': ['vannstandHøyestRegistrert', 'Real'],
    'HYTTE_ID': ['hytteId', 'Integer'],
    'HYTTEEIER': ['hytteeier', 'Integer'],
    'HØYDE': ['høyde', 'Real'],
    'HØYDE_TIL_NAV': ['høydeTilNavet', 'Integer'],
    'HØYDE-REF': ['høyde-Referanse', 'String'],
    'HØYDEREFERANSESPOR': ['høydereferanseSpor', 'String'],
    'HØYDE-TYPE': ['høydeType', 'String'],
    'ID': ['identifikasjon', 'String'],
    'IKRAFT': ['ikrafttredelsesdato', 'Date'],
    'IMOTOPPMERKETYPE': ['imoToppmerketype', 'Integer'],
    'IMP': ['impedimentprosentSkog', 'Integer'],
    'INDEKSMIN': ['indeksMineral', 'String'],
    'INDIKATOR': ['indikatorFastmerkenummer', 'String'],
    'INDUSTRIBELASTNING': ['industriBelastning', 'Integer'],
    'INFILT': ['infiltrasjonEvne', 'Integer'],
    'INFORMASJON': ['informasjon', 'String'],
    'FAGOMRÅDEGRUPPE': ['fagområdegruppe', 'String'],
    'FAGOMRÅDE_FULLT_NAVN': ['fagområdets fulle navn', 'String'],
    'INON_AVS': ['inngrepsfriSoneAvstand', 'Real'],
    'INONSONE': ['inngrepsfrieNaturområderINorgeSone', 'String'],
    'INRT_FUNKSJON': ['innretningsfunksjon', 'String'],
    'INRT_HOVEDTYPE': ['innretningshovedtype', 'String'],
    'INRT_MATR': ['innretningsmaterialtype', 'String'],
    'INRT_NAVN': ['innretningsnavn', 'String'],
    'INRT_TYPE': ['innretningstype', 'String'],
    'INST_EFFEKT': ['installertEffekt', 'Integer'],
    'INSTALLASJONSBØYEKATEGORI': ['installasjonsbøyekategori', 'Integer'],
    'INSTALLERT_ÅR': ['installertÅr', 'Date'],
    'INT_STAT': ['internasjonalStatus', 'Integer'],
    'J_LREG': ['jordregisterLreg', 'String'],
    'JERNBANEEIER': ['jernbaneeier', 'String'],
    'JERNBANETYPE': ['jernbanetype', 'String'],
    'JORD': ['jordklassifikasjon', 'Integer'],
    'JORDARB': ['anbefaltJordarbeiding', 'Integer'],
    'JORDART': ['losmassetype', 'Integer'],
    'JREGAREAL': ['jordregisterAreal', 'Real'],
    'JREGEKODE': ['jordregisterStatusEiendom', 'Integer'],
    'JRFIGNR': ['jordregisterFigurnummer', 'Integer'],
    'JSR_AREAL': ['jordskifteArealtilstand', 'Integer'],
    'JSVSAK': ['jordskifterettenSaksnummer', 'String'],
    'JXAREAL': ['annetareal', 'Integer'],
    'KABELTYPE': ['kabeltype', 'Integer'],
    'KAI_DYBDE': ['kaiDybde', 'Real'],
    'KAI_TYPE': ['kaiTypeInformasjon', 'Integer'],
    'KALIBRERINGSRAPPORT': ['kalibreringsrapport', 'String'],
    'KAMERATYPE': ['kameratype', 'String'],
    'KAPASITETLANGEKJØRETØY': ['kapasitetLangekjøretøy', 'Integer'],
    'KAPASITETPERSONBILER': ['kapasitetPersonbiler', 'Integer'],
    'KAPASITETPERSONEKVIVALENTER': ['kapasitetPersonekvivalenter', 'Integer'],
    'KARDINALMERKETYPE': ['kardinalmerketype', 'Integer'],
    'KARTID': ['kartbladindeks', 'String'],
    'KARTLEGGINGSETAPPE': ['kartleggingsetappe', 'String'],
    'KARTREG': ['kartregistrering', 'Integer'],
    'KARTSIGNATUR': ['kartsignatur', 'String'],
    'KARTTYPE': ['karttype', 'String'],
    'KBISPENR': ['bispedømmenummer', 'Integer'],
    'KILDEPRIVATVANNF': ['kildePrivatVannforsyning', 'Integer'],
    'KJELLER': ['kjeller', 'Integer'],
    'KJERNEOMRÅDESTATUS': ['kjerneområdestatus', 'String'],
    'KJØKKENTILGANG': ['kjøkkentilgang', 'Integer'],
    'KLASSIFISERING': ['kulturlandskapKlassifisering', 'String'],
    'KLOR_FØR_FORBRUK': ['klorKontakttidFørForbruk', 'Integer'],
    'KLORO_MAKS': ['klorofyllMaksimum', 'Integer'],
    'KLOTPAR': ['klotoideParameter', 'Real'],
    'KLOTRAD1': ['klotoideRadius 1', 'Real'],
    'KLOTRAD2': ['klotoideRadius 2', 'Real'],
    'RUTEVANSKELIGHETSGRAD': ['rutevanskelighetsgrad', 'String'],
    'RWY_BÆREEVNE_BEN': ['bæreevnebenevnelse', 'String'],
    'RWY_TYPE': ['rullebaneType', 'String'],
    'RWYMERK': ['rullebaneoppmerking', 'Integer'],
    'RYDDEBREDDE': ['ryddebredde', 'Integer'],
    'RØR_ENDE_PKT': ['ledningsendepunkt', 'String'],
    'RØR_START_PKT': ['ledningsstartpunkt', 'String'],
    'RØRLEDNINGSTYPE': ['rørledningstype', 'Integer'],
    'SAK_AVSLUTT': ['sakAvsluttet', 'String'],
    'SAKSNR': ['saksnummer', 'Integer'],
    'SAKSOMF': ['saksomfang', 'Integer'],
    'SAKSTYPE': ['sakstype', 'Integer'],
    'SALINITET': ['salinitet', 'Integer'],
    'SAT_KOM_ID': ['satellittkommunikasjonsId', 'String'],
    'SCANNEROPPLØSNING': ['scanneroppløsning', 'Real'],
    'SEDDYBDEME': ['sedDybdeMeter', 'Real'],
    'SEDDYBDEMS': ['sedDybdeMillisekund', 'Real'],
    'SEDKORNSTR': ['sedKornstorrelse', 'Integer'],
    'SEDMEKTME': ['sedMektighetMeter', 'Real'],
    'SEDMEKTMS': ['sedMektighetMillisekund', 'Real'],
    'SEFRAK_FUNK_KODE': ['sefrakFunksjonsKode', 'Integer'],
    'SEFRAK_FUNK_STAT': ['sefrakFunksjonsstatus', 'String'],
    'KM_ANTALL': ['kulturminneAntall', 'Integer'],
    'KM_BETEGN': ['kulturminneBetegnelse', 'String'],
    'KM_DAT': ['kulturminneDatering', 'String'],
    'KM_DATKVAL': ['kulturminneDateringKvalitet', 'String'],
    'KM_FUNK_NÅ': ['kulturminneNåværendeFunksjon', 'String'],
    'KM_FUNK_OP': ['kulturminneOpprinneligFunksjon', 'String'],
    'KM_HOVEDGRUPPE': ['kulturminneHovedgruppe', 'String'],
    'KM_KATEGORI': ['kulturminneKategori', 'String'],
    'KM_MAT': ['kulturminneHovedMateriale', 'String'],
    'KM_SYNLIG': ['kulturminneSynlig', 'String'],
    'KM_VERNEVERDI': ['kulturminneVerneverdi', 'String'],
    'KODDRIFT': ['landbruksregBedriftskode', 'Integer'],
    'KOM_KALLSIGNAL': ['komKallSignal', 'String'],
    'KOM_KANAL': ['komKanal', 'String'],
    'KOMM': ['kommunenummer', 'Integer'],
    'KOMM_ALT_AREAL': ['kommAlternativtAreal', 'Real'],
    'KOMM_ALT_AREAL2': ['kommAlternativtAreal2', 'Real'],
    'KOMMENTAR': ['kommentar', 'String'],
    'KOMMENTAR_TYPE': ['kommentarType', 'String'],
    'KOMMSEK': ['kommuneSekundær', 'Integer'],
    'KOMPONENT': ['komponent', 'String'],
    'KONSTA1': ['konstantA1', 'Real'],
    'KONSTA2': ['konstantA2', 'Real'],
    'KONSTB1': ['konstantB1', 'Real'],
    'KONSTB2': ['konstantB2', 'Real'],
    'KONSTC1': ['konstantC1', 'Real'],
    'KONSTC2': ['konstantC2', 'Real'],
    'KONTAKTPERSON': ['kontaktperson', 'String'],
    'KOORDKVALKODE': ['koordinatkvalitetKode', 'String'],
    'KOPIDATO': ['kopidato', 'Date'],
    'KOPL_BRU': ['koplingBruksområde', 'String'],
    'KOPL_KAT': ['koplingskategori', 'Integer'],
    'KOPL_NAV': ['koplingsnavn', 'String'],
    'KOPL_TYP': ['koplingstype', 'String'],
    'KORTNAVN': ['kortnavn', 'String'],
    'KOSTHOLDART': ['kostholdArt', 'String'],
    'KOSTHOLDSRÅDTYPE': ['kostholdsrådType', 'Integer'],
    'KP': ['knutePunkt', 'Integer'],
    'KPANGITTHENSYN': ['angittHensyn', 'Integer'],
    'KPAREALFORMÅL': ['arealformål', 'Integer'],
    'KPBÅNDLEGGING': ['båndlegging', 'Integer'],
    'KPDETALJERING': ['detaljering', 'Integer'],
    'KPFARE': ['fare', 'Integer'],
    'KPGJENNOMFØRING': ['gjennomføring', 'Integer'],
    'KPINFRASTRUKTUR': ['infrastruktur', 'Integer'],
    'KPINFRASTRUKTURLINJE': ['infrastrukturLinje', 'Integer'],
    'KPJURLINJE': ['juridisklinje', 'Integer'],
    'KPRESTENAVN': ['prestegjeldnavn', 'String'],
    'KPRESTENR': ['prestegjeldnummer', 'Integer'],
    'KPROSTINAVN': ['prostinavn', 'String'],
    'KPROSTINR': ['prostinummer', 'Integer'],
    'KPSIKRING': ['sikring', 'Integer'],
    'KPSTØY': ['støy', 'Integer'],
    'KRAFTVERKTYP': ['kraftverktype', 'String'],
    'KRETSNAVN': ['kretsnavn', 'String'],
    'KRETSNUMMER': ['kretsnummer', 'String'],
    'KRETSTYPEKODE': ['kretstypekode', 'String'],
    'KRETSTYPENAVN': ['kretstypenavn', 'String'],
    'KULT_HIST_INT': ['kulturhistoriskInteresse', 'String'],
    'KVIKKLEIRESVURD': ['stabilitetVurderingKvikkleire', 'Integer'],
    'KYSTKONSTRUKSJONSTYPE': ['kystkonstruksjonstype', 'Integer'],
    'KYSTREF': ['kystreferanse', 'String'],
    'KYSTTYP': ['kysttype', 'Integer'],
    'KYSTVERKSDISTRIKT': ['kystverksdistrikt', 'Integer'],
    'LAGRET_DATO': ['lagretDato', 'Date'],
    'LAND1': ['førsteLand', 'String'],
    'LAND2': ['annetLand', 'String'],
    'LANDEMERKEKATEGORI': ['landeberkekategori', 'Integer'],
    'LANDKODE': ['landkode', 'String'],
    'LATERALMERKETYPE': ['lateralmerketype', 'Integer'],
    'LDEL': ['landsdelområde', 'Integer'],
    'LEDN_BRU': ['ledningbruksområde', 'String'],
    'LEDN_NAV': ['ledningsnavn', 'String'],
    'LEDN_TYP': ['ledningstype', 'Integer'],
    'LEDNINGSEIER': ['ledningseier', 'String'],
    'LEKEREKRTYPE': ['lekeRekreasjonstype', 'String'],
    'LENGDE': ['lengde', 'Real'],
    'LENGDEENHET': ['lengdeenhet', 'String'],
    'LENGDEOVERLAPP': ['lengdeoverlapp', 'Integer'],
    'LENGDESEKTORLINJE1': ['lengdeSektorlinje1', 'Real'],
    'LENGDESEKTORLINJE2': ['lengdeSektorlinje2', 'Real'],
    'LETE_AREAL': ['leteareal', 'Real'],
    'LH_BEREDSKAP': ['lufthavnBeredskapskode', 'Integer'],
    'LHAREAL': ['lufthavnArealer', 'Integer'],
    'LHDISTTYPE': ['lufthavndistansetype', 'Integer'],
    'LHELEV': ['lufthavnelevasjon', 'Real'],
    'LHFDET': ['lufthavnForsvarsObjektDetalj', 'Integer'],
    'LHFM_TYPE': ['lufthavnFastmerketype', 'Integer'],
    'LHINST_TYPE': ['lufthavnInstrumenteringType', 'Integer'],
    'LHLYS_OPPHØYD_NEDFELT': ['lufthavnLysOpphøydNedfelt', 'String'],
    'LHLYSFARGE': ['lufthavnlysFarge', 'Integer'],
    'LHLYSRETN': ['lufhavnLysretning', 'Integer'],
    'LHLYSTYPE': ['lufthavnlystype', 'Integer'],
    'LHSKILTKATEGORI': ['lufthavnskiltkatagori', 'Integer'],
    'LHSKILTLYS': ['lufthavnskiltlys', 'String'],
    'LHSKILTTYPE': ['lufthavnskilttype', 'Integer'],
    'LINEAMENTTYPE': ['lineamentType', 'Integer'],
    'LINK': ['link', 'String'],
    'LJORDKL': ['lokalJordressurs', 'Integer'],
    'LJORDKL_A': ['nedklassifiseringLokalJordressurs', 'Integer'],
    'LOK_NAVN': ['lokalitetsnavn', 'String'],
    'LOK_NR': ['lokalitetsnummer', 'Integer'],
    'LOSLIGHET': ['loslighetGrad', 'Integer'],
    'LOSMKORNSTR': ['losmKornstorrelse', 'Integer'],
    'LOSMOVERFLATETYPE': ['losmOverflateType', 'Integer'],
    'LOVDISP': ['dispensasjonType', 'Integer'],
    'LOVREFBESKRIVELSE': ['lovreferanseBeskrivelse', 'String'],
    'LOVREFERANSE': ['lovreferanseType', 'Integer'],
    'LR_AKTIV': ['landbruksregAktiv', 'Integer'],
    'LR_TYPE': ['landbruksregType', 'Integer'],
    'LRV': ['vannstandLavestRegulert', 'Real'],
    'LUFTHAVNHINDERTREGRUPPE': ['lufthavnhinderTregruppe', 'String'],
    'LVANN': ['vannstandLavestRegistrert', 'Real'],
    'LYSHØYDE': ['lyshøyde', 'Real'],
    'LØPENR': ['bruksenhetLøpenr', 'Integer'],
    'MAGASINNR': ['magasinNr', 'Integer'],
    'MAKSHØYDE': ['makshøyde', 'Real'],
    'MAKSIMALREKKEVIDDE': ['maksimalRekkevidde', 'Real'],
    'MAKSSNØHØYDE': ['maksSnøhøyde', 'Integer'],
    'MANGELMATRIKKELFØRINGSKRAV': ['mangelMatrikkelføringskrav', 'String'],
    'MARKID': ['jordregisterMarkslagKobling', 'Integer'],
    'MARKSLAGAVGRTYPE': ['markslagAvgrensingType', 'Integer'],
    'MASSEENHET': ['masseenhet', 'String'],
    'MATERIALE': ['materialeBolt', 'Integer'],
    'MATERIALE_YTTERV': ['materialeYttervegg', 'Integer'],
    'MATR_KODE': ['materiellkode', 'String'],
    'MATRIKKELKOMMUNE': ['matrikkelkommune', 'Integer'],
    'MATRTYPE': ['materialType', 'Integer'],
    'MATRUNTYPE': ['materialUndertype', 'String'],
    'MAX_ELEMENT_PKT': ['maksAntallPunktGeometritype1', 'Integer'],
    'MAX_OBJEKT_PKT': ['maksAntallPunktGeometritype2', 'Integer'],
    'MAX_REF_OBJEKT': ['maksAntallGeometriReferanse', 'Integer'],
    'MAX-AVVIK': ['maksimaltAvvik', 'Integer'],
    'MAX-N': ['maksimumNord', 'Integer'],
    'MAX-Ø': ['maksimumØst', 'Integer'],
    'MEDIUM': ['medium', 'String'],
    'MEKT50': ['mektighetFemtiProsent', 'Real'],
    'MERKEFORM': ['merkeform', 'Integer'],
    'MERKELISTENUMMER': ['merkelistenummer', 'Integer'],
    'MERKEMØNSTER': ['merkemønster', 'Integer'],
    'METADATALINK': ['metadatalink', 'String'],
    'METALINTYP': ['metamorfLinjetype', 'String'],
    'METAMOGRAD': ['metamorfGrad', 'Integer'],
    'METER-FRA': ['veglenkeMeterFra', 'Integer'],
    'METER-TIL': ['veglenkeMeterTil', 'Integer'],
    'MGENHETBESKRIV': ['mgEnhetBeskrivelse', 'String'],
    'MGENHETOPPLOSN': ['mgEnhetOpplosning', 'Integer'],
    'MGINSTRUMENT': ['mgInstrument', 'String'],
    'MGLINJENR': ['mgLinjenummer', 'String'],
    'MGPOSNR': ['mgPosisjonnummer', 'Integer'],
    'MGTOKTNR': ['mgToktnummer', 'String'],
    'MILITÆRØVELSETYPE': ['militærøvelsetype', 'Integer'],
    'MILJOTIL': ['miljøtiltak', 'Integer'],
    'MINHØYDE': ['minhøyde', 'Real'],
    'MIN-N': ['minimumNord', 'Integer'],
    'MIN-Ø': ['minimumØst', 'Integer'],
    'MYNDIGHET': ['vedtaksmyndighet', 'String'],
    'MYR': ['myrklassifikasjon', 'Integer'],
    'MÅLEMETODE': ['målemetode', 'Integer'],
    'MÅLESTOKK': ['målestokk', 'Integer'],
    'MÅLTALL': ['måltall', 'Real'],
    'NASJONALTOPPMERKETYPE': ['nasjonalToppmerketype', 'Integer'],
    'NASJVIKTIG': ['rastoffViktighetOmfang', 'String'],
    'NAVIGASJONSINSTALLASJONSEIER': ['navigasjonsinstallasjonseier', 'String'],
    'NAVLYS_KARAKTER': ['navigasjonslyskarakter', 'Integer'],
    'NAVLYSTYPE': ['navlysType', 'Integer'],
    'NAVN': ['navn', 'String'],
    'NAVNTYPE': ['navnetype', 'Integer'],
    'NEDSENKETKANTSTEIN': ['nedsenketKantstein', 'String'],
    'NEDSTENGT_DATO': ['nedstengtDato', 'Date'],
    'NETT_NIV': ['ledningsnettNivå', 'String'],
    'NEVNER': ['nevner', 'Real'],
    'NOMINELLREKKEVIDDE': ['nominellRekkevidde', 'Real'],
    'NORD': ['nord', 'Integer'],
    'NYMATRIKULERT': ['nymatrikulert', 'String'],
    'NÆRINGSGRUPPE': ['næringsgruppe', 'String'],
    'NØYAKTIGHET': ['nøyaktighet', 'Integer'],
    'NØYAKTIGHETSKLASSE': ['nøyaktighetsklasse', 'Integer'],
    'NÅVÆRENDE_AREAL': ['nåværendeAreal', 'Real'],
    'OBJTYPE': ['objekttypenavn', 'String'],
    'OBSERVERTFLOM': ['observertFlom', 'Real'],
    'OBSLINID': ['obsLinId', 'String'],
    'OMKRETSINNSJØ': ['omkretsInnsjø', 'Integer'],
    'OMRKODE': ['reinbeiteområdeID', 'String'],
    'OMRNAVN': ['områdenavn', 'String'],
    'OMRTYPE': ['dumpefelttype', 'Integer'],
    'OMRÅDEID': ['områdeid', 'Integer'],
    'OMTVISTET': ['omtvistet', 'String'],
    'OPAREALAVGRTYPE': ['operativArealavgrensningtype', 'Integer'],
    'OPERATØR': ['petroleumsoperatør', 'String'],
    'OPLAREAL': ['arealbruk', 'Integer'],
    'OPLAREALUTDYP': ['arealbruksutdyping', 'String'],
    'OPLRESTR': ['arealbruksrestriksjoner', 'Integer'],
    'OPLRETNL': ['arealbruksretningslinjer', 'Integer'],
    'OPPARBEIDING': ['opparbeiding', 'Integer'],
    'OPPDATERINGSDATO': ['oppdateringsdato', 'Date'],
    'OPPDRAGSGIVER': ['oppdragsgiver', 'String'],
    'OPPGITTAREAL': ['oppgittAreal', 'Real'],
    'OPPHAV': ['opphav', 'String'],
    'OPPMÅLINGIKKEFULLFØRT': ['oppmålingIkkeFullført', 'String'],
    'OPPMÅLTKOTE': ['oppmåltKote', 'Real'],
    'OPPMÅLTÅR': ['oppmåltÅr', 'Integer'],
    'OPPRETTET_AAR': ['opprettetÅr', 'Date'],
    'OPPRINNELIGBILDEFORMAT': ['bildeType', 'String'],
    'OPPRINNELIGBILDESYS': ['BildeSystem', 'Integer'],
    'OPPRINNELIGSOSIALTMILJØ': ['opprinneligSosialtMiljø', 'Integer'],
    'OPPRINNELSE': ['opprinnelse', 'String'],
    'OPPSTARTSÅR': ['oppstartsår', 'Date'],
    'OPPTAKSMETODE': ['opptaksmetode', 'Integer'],
    'OPPVARMING': ['oppvarming', 'String'],
    'ORGANISK': ['organiskAndel', 'Integer'],
    'ORGNR': ['organsisasjonsnummer', 'Integer'],
    'ORIENTERINGSDATA': ['orienteringsdata', 'String'],
    'ORIENTERINGSMETODE': ['orienteringsmetode', 'Integer'],
    'ORIGINALDATAVERT': ['originalDatavert', 'String'],
    'ORIGO-N': ['origoNord', 'Integer'],
    'ORIGO-Ø': ['origoØst', 'Integer'],
    'OVERGRUPPE': ['overgruppeNavn', 'String'],
    'PBTILTAK': ['tiltakstype', 'Integer'],
    'PETLITOKODE': ['petrofLitologi', 'String'],
    'PETMETAKODE': ['petrofMetamorfose', 'String'],
    'PETROLEUM_KOORD_STATUS': ['petroleumKoordinatstatus', 'String'],
    'PETROLEUMLEDNINGFUNKSJON': ['petroleumsledningsfunksjon', 'String'],
    'PETROLEUMLEDNINGTYPE': ['petroleumsledningstype', 'String'],
    'PETROLEUMSANDEL': ['petroleumsandel', 'Real'],
    'PETROLEUMSDATAKILDE': ['petroleumsdatakilde', 'String'],
    'PETROLEUMSFELTNAVN': ['petroleumsfeltnavn', 'String'],
    'PETROLEUMSFELTTYPE': ['petroleumsfelttype', 'String'],
    'PETROLEUMSPARTNERE': ['petroleumspartnere', 'String'],
    'PETSTRATKODE': ['petrofStratigrafi', 'String'],
    'PILARKATEGORI': ['pilarkategori', 'Integer'],
    'PIXEL-STØRR': ['pixelstørrelse', 'Real'],
    'PLANBEST': ['planbestemmelse', 'Integer'],
    'PLANERING': ['planeringsgrad', 'Integer'],
    'PLANID': ['planidentifikasjon', 'String'],
    'PLANNAVN': ['plannavn', 'String'],
    'FORSLAGSSTILLERTYPE': ['forslagsstillerType', 'Integer'],
    'PLANSTAT': ['planstatus', 'Integer'],
    'PLANTYPE': ['plantype', 'Integer'],
    'PLASS': ['plasseringskode', 'Integer'],
    'PLFMERK': ['oppstillingplattformmerking', 'Integer'],
    'PLOGSJIKTTEKSTUR': ['plogsjiktTekstur', 'Integer'],
    'POBS': ['observasjonstype', 'Integer'],
    'POLITIDISTRIKTID': ['politidistriktId', 'Integer'],
    'POS_KVAL': ['posisjonKvalitet', 'Integer'],
    'POS_TYPE': ['posisjonType', 'Integer'],
    'BITS_PR_PIXEL': ['bitsPrPixel', 'Integer'],
    'POSTNAVN': ['poststedsnavn', 'String'],
    'POSTNR': ['postnummer', 'Integer'],
    'PREPARERING': ['løypepreparering', 'String'],
    'PRIMÆRSTREKNINGSNUMMER': ['primærstrekningsnummer', 'Integer'],
    'PRIOMR': ['prioritetområde', 'String'],
    'PRIORITET': ['kulturlandskapPrioritet', 'String'],
    'PRIVAT_KLOAKKR': ['privatKloakkRensing', 'Integer'],
    'PRODUKT': ['produkt', 'String'],
    'PRODUKT_FULLT_NAVN': ['produktFullstendigNavn', 'String'],
    'PRODUKTGRUPPE': ['produktgruppe', 'String'],
    'PRODUSENT': ['geodataprodusent', 'String'],
    'PROJEK': ['projeksjon', 'String'],
    'PROSELV': ['prosentElv', 'Real'],
    'PROSESS_HISTORIE': ['prosesshistorie', 'String'],
    'PROSHAV': ['prosentHav', 'Real'],
    'PROSINNSJØ': ['prosentInnsjø', 'Real'],
    'PROSJEKTNAVN': ['prosjektnavn', 'String'],
    'PROSJEKTSTART': ['prosjektstartår', 'Integer'],
    'PROSLAND': ['prosentLand', 'Real'],
    'PROSTINUMMER': ['prostinummer', 'Integer'],
    'PROVEMATR': ['proveMaterial', 'String'],
    'PTYPE': ['punktType', 'String'],
    'PUKKVERKTYPE': ['pukkverktype', 'Integer'],
    'PUMPER_NØDSTR': ['pumperNødstrøm', 'String'],
    'PUMPES_VANNET': ['pumperVannet', 'String'],
    'PUNKTBESKR': ['punktBeskrivelse', 'String'],
    'PUNKTFESTE': ['punktfeste', 'String'],
    'PÅVIRKNINGSGRAD': ['påvirkningsgrad', 'Integer'],
    'R_FNR': ['forekomstNummer', 'Integer'],
    'R_LNR': ['lokalNummer', 'Integer'],
    'R_ONR': ['omrNummer', 'Integer'],
    'R_PNR': ['proveNummer', 'Integer'],
    'R_RESERVER': ['rastoffReserver', 'Integer'],
    'RACONFREKVENSBÅND': ['raconFrekvensbånd', 'String'],
    'RACONKARAKTER': ['raconkarakter', 'String'],
    'RACONMORSETEGN': ['raconmorsetegn', 'String'],
    'RACONRESPONSINTERVALL': ['raconresponsintervall', 'String'],
    'RACONTYPE': ['racontype', 'Integer'],
    'RADAR_FYR_TYPE': ['radarfyrtype', 'Integer'],
    'RADARREFLEKTOR': ['radarReflektor', 'String'],
    'RADARSTASJONSTYPE': ['radarstasjonstype', 'Integer'],
    'RADIO_FYR_TYPE': ['radiofyrtype', 'Integer'],
    'RADIOAKTIV': ['radioaktivitetNiva', 'Integer'],
    'RADIOFYRMODULASJON': ['radiofyrmodulasjon', 'String'],
    'RADIUS': ['radius', 'Real'],
    'RADRISKOMR': ['naturlRadioaktivStraling', 'Integer'],
    'RAPPORTERINGSÅR': ['rapporteringsår', 'Date'],
    'REFERANSE': ['referanse', 'String'],
    'REFERANSENUMMER': ['referansenummer', 'String'],
    'REGFORM': ['reguleringsformål', 'Integer'],
    'REGFORMUTDYP': ['reguleringsformålsutdyping', 'String'],
    'REGISTRERINGKRETSNR': ['registreringKretsnr', 'Integer'],
    'REGISTRERT_DATO': ['registrertDato', 'Date'],
    'REGMETOD': ['registreringsmetode', 'Integer'],
    'REGULERTHØYDE': ['regulertHøyde', 'Real'],
    'REINDRIFTANLTYP': ['reindriftsanleggstype', 'Integer'],
    'REINDRIFTKONNAVN': ['reindriftKonvensjonsområdenavn', 'String'],
    'REKKEVIDDEGRØNN': ['rekkeviddeGrønn', 'Real'],
    'REKKEVIDDEGUL': ['rekkeviddeGul', 'Real'],
    'REKKEVIDDEHVIT': ['rekkeviddeHvit', 'Real'],
    'REKKEVIDDERØD': ['rekkeviddeRød', 'Real'],
    'RENHET': ['retningsenhet', 'Integer'],
    'RENOVASJON': ['renovasjon', 'Integer'],
    'RESIPIENTTYPE': ['resipienttype', 'String'],
    'RESTR_OMR': ['restriksjonsområde', 'String'],
    'RESTRIKSJONSTYPE': ['restriksjonstype', 'Integer'],
    'RET_SYS': ['retningsreferanse', 'Integer'],
    'RETN': ['retningsverdi', 'Real'],
    'RETNINGSEKTORLINJE1': ['retningSektorlinje1', 'Real'],
    'RETNINGSEKTORLINJE2': ['retningSektorlinje2', 'Real'],
    'RISIKOVURDERING': ['risikovurdering', 'String'],
    'RKB': ['rkb', 'Real'],
    'RKB_TD': ['rkbTotaltDyp', 'Real'],
    'ROTASJON': ['rotasjon', 'Integer'],
    'RPANGITTHENSYN': ['angitthensyn', 'Integer'],
    'RPAREALFORMÅL': ['arealformål', 'Integer'],
    'RPBÅNDLEGGING': ['båndlegging', 'Integer'],
    'RPDETALJERING': ['detaljering', 'Integer'],
    'RPFARE': ['fare', 'Integer'],
    'RPGJENNOMFØRING': ['gjennomføring', 'Integer'],
    'RPINFRASTRUKTUR': ['infrastruktur', 'Integer'],
    'RPJURLINJE': ['juridisklinje', 'Integer'],
    'RPJURPUNKT': ['juridiskpunkt', 'Integer'],
    'RPPÅSKRIFTTYPE': ['påskriftType', 'Integer'],
    'RPSIKRING': ['sikring', 'Integer'],
    'RPSTØY': ['støy', 'Integer'],
    'RSL_JREG': ['referansesystemForLandskapJordbruksregioner', 'String'],
    'RSL_REG': ['referansesystemForLandskapRegioner', 'String'],
    'RSL_UREG': ['referansesystemForLandskapUReg', 'String'],
    'RTALLHØY': ['reintallHøyeste', 'Integer'],
    'RTALLVEDTAK': ['reintallVedtak', 'String'],
    'RULLEBANEDISTANSETYPE': ['rullebanedistansetype', 'Integer'],
    'RULLEBANERETNING': ['rullebaneretning', 'Integer'],
    'RUTEBREDDE': ['rutebredde', 'Integer'],
    'RUTEFØLGER': ['ruteFølger', 'String'],
    'RUTEMERKING': ['ruteMerking', 'String'],
    'RUTENETTYPE': ['rutenettype', 'String'],
    'RUTENR': ['rutenummer', 'String'],
    'SEFRAK_TILTAK': ['sefrakTiltak', 'Integer'],
    'SEFRAKBREDDE': ['sefrakbredde', 'Integer'],
    'SEFRAKKOMMUNE': ['sefrakKommune', 'Integer'],
    'SEFRAKLENGDE': ['sefraklengde', 'Integer'],
    'SEIL_BREDDE': ['seilingsbredde', 'Real'],
    'SEIL_DYBDE': ['seilingsdybde', 'Real'],
    'SEKSJONERT': ['seksjonert', 'String'],
    'SEKTORTEKST': ['sektortekst', 'String'],
    'SEKUNDÆRSTREKNINGSNUMMER': ['sekundærstrekningsnummer', 'Integer'],
    'SENTRUMSSONENAVN': ['sentrumssonenavn', 'String'],
    'SENTRUMSSONENUMMER': ['sentrumssonenummer', 'Integer'],
    'SEPTIKTANK': ['septiktank', 'String'],
    'SERIEKODE1': ['serie1', 'String'],
    'SERIEKODE2': ['serie2', 'String'],
    'SERIEKODE3': ['serie3', 'String'],
    'SERVMERK': ['servituttMerknad', 'String'],
    'SERVTYPE': ['servituttType', 'String'],
    'SESOMR': ['reindriftSesongområde', 'Integer'],
    'SFOTRUTETYPE': ['spesialFotrutetype', 'String'],
    'SIDEOVERLAPP': ['sideoverlapp', 'Integer'],
    'SIGNALGRUPPE': ['signalgruppe', 'String'],
    'SIGNALNR': ['signalnummer', 'String'],
    'SIGNALPERIODE': ['signalperiode', 'String'],
    'SIGNALSEKVENS': ['signalsekvens', 'String'],
    'SIGNH': ['signalHøyde', 'Real'],
    'SIGNHREF': ['signalHøydeRef', 'String'],
    'SIGNTYPE': ['signalType', 'String'],
    'SIKKERÅR': ['ledningsalderReferanse', 'Integer'],
    'SIKTEDYP': ['sikteDyp', 'Integer'],
    'SIST_VURDERT_AAR': ['sistVurdertÅr', 'Date'],
    'SISTBEFART': ['sisteBefaringsdato', 'Integer'],
    'SJØ_RESTRIKSJON': ['sjørestriksjon', 'Integer'],
    'SJØ_SIGFRQ': ['sjøsignalfrekvens', 'Integer'],
    'SJØ_STATUS': ['sjøstatus', 'Integer'],
    'SJØ_TRAFIKK': ['sjøtrafikk', 'Integer'],
    'SJØMERKEFARGE': ['sjømerkefarge', 'Integer'],
    'SJØMERKESYSTEM': ['sjømerkesystem', 'Integer'],
    'SKAL_AVGR_BYGN': ['skalAvgrenseBygning', 'String'],
    'SKALAENHET': ['skalaenhet', 'String'],
    'SKILTGRUPPE': ['skiltgruppe', 'String'],
    'SKILØYPETYPE': ['skiløypetype', 'Integer'],
    'SKJERMINGFUNK': ['skjermingsfunksjon', 'String'],
    'SKOG': ['jordregisterSkogtype', 'Integer'],
    'SKOGREIS': ['jordregisterSkogreisningsmark', 'Integer'],
    'SKOLEKRETSTYPE': ['skolekretsnavn', 'String'],
    'SKREDALDERBEST': ['skredAlderBestemmelse', 'String'],
    'SKREDBESKRIVELSE': ['skredBeskrivelse', 'String'],
    'SKREDBREDDE': ['skredBredde', 'Integer'],
    'SKREDEVAKUERING': ['skredEvakuering', 'Integer'],
    'SKREDFALLHØYDE': ['skredFallhoyde', 'Integer'],
    'SKREDFAREGR_KL': ['skredFaregradKlasse', 'String'],
    'SKREDFAREGRADSCORE': ['skredFaregradScore', 'Integer'],
    'SKREDFAREVURD': ['snoSteinSkredfareVurdering', 'Integer'],
    'SKREDKONSSCORE': ['skredSkadKonsekvensScore', 'Integer'],
    'SKREDKVALKARTLEGGING': ['skredKvalKartlegging', 'Integer'],
    'SKREDLENGDE': ['skredLengde', 'Integer'],
    'SKREDMALEMETODE': ['skredMalemetode', 'Integer'],
    'SKREDOBSGUID': ['skredObservasjonGUID', 'Integer'],
    'SKREDOMKOMNE': ['skredAntallOmkomne', 'Integer'],
    'SKREDOMRID': ['skredOmrID', 'Integer'],
    'SKREDOMRNAVN': ['skredOmrNavn', 'String'],
    'SKREDREDNING': ['skredRedning', 'Integer'],
    'SKREDRISIKO_KL': ['skredRisikoKvikkleireKlasse', 'Integer'],
    'SKREDSKADEANNEN': ['skredSkadeAnnen', 'Integer'],
    'SKREDSKADEOBJEKTER': ['skredSkadeObjekter', 'Integer'],
    'SKREDSKADESAMFERDSEL': ['skredSkadeSamferdsel', 'Integer'],
    'SKREDSKADETYPE': ['skredSkadType', 'Integer'],
    'SKREDSKADKONS_KL': ['skredSkadeKonsekvensKlasse', 'Integer'],
    'SKREDSTATSANN': ['skredStatistikkSannsynlighet', 'String'],
    'SKREDTIDHENDELSE': ['skredTidspunktHendelse', 'String'],
    'SKREDTIDUSIKKERH': ['skredTidUsikkerhet', 'String'],
    'SKREDTYPE': ['skredtype', 'Integer'],
    'SKREDUTLOMRHELNING': ['skredUtlosningOmrHelning', 'Integer'],
    'SKREDUTLOPOMRTYPE': ['skredUtlopOmrType', 'Integer'],
    'SKREDUTLOSNINGOMRTYPE': ['skredUtlosningOmrType', 'Integer'],
    'SKREDVOLUM': ['skredVolum', 'String'],
    'SKRETSNAVN': ['skolekretsnavn', 'String'],
    'SKRETSNR': ['skolekretsnummer', 'Integer'],
    'SKRIFTKODE': ['presentasjonskode', 'Integer'],
    'SKYLD': ['skyld', 'Real'],
    'SKYVGRINDL': ['skyvegrenseInndeling', 'Integer'],
    'SLUSETYP': ['sluseType', 'Integer'],
    'SMÅBÅTHAVNFASILITET': ['småbåthavnfasilitet', 'Integer'],
    'SNAVN': ['stedsnavn', 'String'],
    'SNDATO': ['statusdato', 'Date'],
    'SNITT_HØ': ['snitthøyde', 'Integer'],
    'SNKILDE': ['stedsnavnkilde', 'String'],
    'SNLØPENR': ['arkivløpenummer', 'Integer'],
    'SNMERK': ['stedsnavnmerknad', 'String'],
    'SNMYND': ['stedsnavnVedtaksmyndighet', 'String'],
    'SNR': ['seksjonsnummer', 'Integer'],
    'SNREGDATO': ['stedsnavnRegistreringsdato', 'Date'],
    'SNSAKSNR': ['arkivsaksnummer', 'Integer'],
    'SNSKRSTAT': ['stedsnavnSkrivemåtestatus', 'String'],
    'SNSPRÅK': ['språk', 'String'],
    'SNTYSTAT': ['stedsnavnTypestatus', 'String'],
    'SNØSCOOTERLØYPETYPE': ['snøscooterløypeType', 'String'],
    'SOGNNUMMER': ['sognnummer', 'Integer'],
    'SONENAUT': ['soneNautisk', 'Integer'],
    'SONETYPE': ['sonetype', 'String'],
    'SOSIELEMENT': ['sosiElementnavn', 'String'],
    'SOSI-NIVÅ': ['sosiKompleksitetNivå', 'Integer'],
    'SOSI-VERSJON': ['sosiVersjon', 'String'],
    'SP_ABONTRE': ['skogbrplanKlassAktueltTreslag', 'Integer'],
    'SP_AGJBON': ['skogbrplanKlassAktSnittBon', 'Integer'],
    'SP_ALDER': ['skogbrplanBeskrivBestandAlder', 'Integer'],
    'SP_ANDEREG': ['skogbrplanTreslagAntTreDaaEReg', 'Integer'],
    'SP_ANDFREG': ['skogbrplanTreslagAntTreDaaFReg', 'Integer'],
    'SP_AVOLPRDA': ['skogbrplanGrunnlagVolumDaaFelt', 'Real'],
    'SP_AVOLTOT': ['skogbrplanGrunnlagVolumBestFelt', 'Integer'],
    'SP_BAREAL': ['skogbrplanBeskrivBestandDaa', 'Real'],
    'SP_BERTYPE': ['skogbrplanGrunnlagBerType', 'Integer'],
    'SP_BESTDELNR': ['skogbrplanBestandDelNr', 'Integer'],
    'SP_BESTNR': ['skogbrplanBestandNr', 'Integer'],
    'SP_BEVNE': ['skogbrplanTerrengBæreevneBestand', 'Integer'],
    'SP_BMIDDIAM': ['skogbrplanBeskrivBestSnittDiam', 'Integer'],
    'SP_BMIDGRFL': ['skogbrplanBeskrivBestandSnittM2', 'Integer'],
    'SP_BMIDHO': ['skogbrplanBeskrivBestandSnittH', 'Real'],
    'SP_BRATT': ['skogbrplanTerrengBestandBratthet', 'Integer'],
    'SP_BTILVPRDA': ['skogbrplanTilvekstBeregnDaa', 'Real'],
    'SP_BTILVPROS': ['skogbrplanTilvekstBeregnProsent', 'Real'],
    'SP_BVOLPRDA': ['skogbrplanTilvekstBeregnM3', 'Real'],
    'SP_DENDR': ['skogbrplanAdmDatoEndring', 'Date'],
    'SP_DREG': ['skogbrplanAdmDatoEtablering', 'Date'],
    'SP_ELEMTYPE': ['skogbrplanFlerKoderElementtype', 'Integer'],
    'SP_FARAND': ['skogbrplanFlerKoderArealProsent', 'Integer'],
    'SP_FAREAL': ['skogbrplanFlerKoderArealDaa', 'Integer'],
    'SP_FRAND': ['skogbrplanFlerKoderSpesBehPros', 'Integer'],
    'SP_FRAREAL': ['skogbrplanFlerKoderSpesBehDaa', 'Integer'],
    'SP_GREND': ['skogbrplanTeigGrend', 'Integer'],
    'SP_GRFL': ['skogbrplanTetthetGrunnflatesum', 'Integer'],
    'SP_HBAR': ['skogbrplanBeskrivBarHøydehkl2', 'Integer'],
    'SP_HKL': ['skogbrplanBeskrivHogstklasse', 'Integer'],
    'SP_HLAUV': ['skogbrplanBeskrivLauvHøydehkl2', 'Integer'],
    'SP_HOVEDGR': ['skogbrplanGrunnlagHovedgruppe', 'Integer'],
    'SP_HOYDE': ['skogbrplanTetthetMHøyde', 'Integer'],
    'SP_IMPANDEL': ['skogbrplanKlassImpProsent', 'Integer'],
    'SP_IMPTYPE': ['skogbrplanKlassImpType', 'Integer'],
    'SP_LILEN': ['skogbrplanTerrengLiLengde', 'Integer'],
    'SP_MINTRSP': ['skogbrplanTerrengMinTranspUtst', 'Integer'],
    'SP_PBONTRE': ['skogbrplanKlassPotTreslag', 'Integer'],
    'SP_PGJBON': ['skogbrplanKlassPotSnittBon', 'Integer'],
    'SP_PRIO': ['skogbrplanTiltakProritet', 'Integer'],
    'SP_REG': ['skogbrplanGrunnlagRegion', 'Integer'],
    'SP_SJIKT': ['skogbrplanBeskrivSjiktning', 'Integer'],
    'SP_SKOGTYP': ['skogbrplanBeskrivSkogtype', 'Integer'],
    'SP_SUNNH': ['skogbrplanBeskrivSunnhet', 'Integer'],
    'SP_SVPROS': ['skogbrplanGrunnlagSvinnProsent', 'Integer'],
    'SP_TAKSTTYPE': ['skogbrplanGrunnlagTaksttype', 'Integer'],
    'SP_TARAND': ['skogbrplanTiltakProsent', 'Integer'],
    'SP_TAREAL': ['skogbrplanTiltakAreal', 'Real'],
    'SP_TEIGNR': ['skogbrplanTeigNr', 'Integer'],
    'SP_TERJEVN': ['skogbrplanTerrengJevnhet', 'Integer'],
    'SP_TILT': ['skogbrplanTiltakBestand', 'Integer'],
    'SP_TILVKOR': ['skogbrplanGrunnlagTilvekstkorr', 'Integer'],
    'SP_TNAVN': ['skogbrplanTeigNavn', 'String'],
    'SP_TOTVOL': ['skogbrplanTilvekstVolumBestand', 'Integer'],
    'SP_TREEREG': ['skogbrplanBeskrivTreERegulering', 'Integer'],
    'SP_TREFREG': ['skogbrplanBeskrivTreFRegulering', 'Integer'],
    'SP_TRESLAG': ['skogbrplanTreslag', 'Integer'],
    'SP_TRESLHO': ['skogbrplanTreslagHøyde', 'Integer'],
    'SP_VOLAND': ['skogbrplanTreslagProsent', 'Integer'],
    'SP_VOLKORR': ['skogbrplanTreslagKorrVolumUBark', 'Integer'],
    'SP_VOLSALG': ['skogbrplanTreslagSalgsvolumUBark', 'Integer'],
    'SP_VOLUKORR': ['skogbrplanTreslagUkorrVolumUBark', 'Integer'],
    'SP_AAR': ['skogbrplanTiltakÅr', 'Integer'],
    'SPERRING': ['sperring', 'String'],
    'SPES_SKILØYPETYPE': ['spesialSkiløypetype', 'String'],
    'SPESIALMERKETYPE': ['spesialmerketype', 'Integer'],
    'SPESIALSYKKELRUTETYPE': ['spesialsykkelrutetype', 'String'],
    'SPOR_HASTIGHET': ['sporhastighet', 'Integer'],
    'SPORANTALL': ['sporantall', 'String'],
    'SPORAVGRENINGSNR': ['sporavgreningsnummer', 'String'],
    'SPORAVGRENINGSPUNKTNR': ['sporavgreningspunktnummer', 'String'],
    'SPORAVGRENINGSPUNKTTYPE': ['sporavgreningspunkttype', 'String'],
    'SPORAVGRENINGSTYPE': ['sporavgreningstype', 'String'],
    'SPORKM': ['sporKilometer', 'Real'],
    'SPORNUMMER': ['spornummer', 'String'],
    'SPORPUNKTNUMMER': ['sporpunktnummer', 'String'],
    'SPORPUNKTTYPE': ['sporpunkttype', 'String'],
    'SPORTYPE': ['sportype', 'String'],
    'SSR-ID': ['ssrId', 'Integer'],
    'SSR-OBJID': ['objId', 'Integer'],
    'STANDARDENHET': ['standardenhet', 'String'],
    'STASJONSFORMÅL': ['stasjonsformål', 'String'],
    'STASJONSNR': ['stasjonsnummer', 'Integer'],
    'STASJONSPARAMETER': ['stasjonsparameter', 'Integer'],
    'STASJONSTYPE': ['stasjonstype', 'String'],
    'STASJONTYP': ['stasjonstype', 'String'],
    'STAT': ['typeStatus', 'Integer'],
    'STATUS': ['status', 'String'],
    'STED': ['sted', 'String'],
    'STED_VERIF': ['stedfestingVerifisert', 'String'],
    'STENGESDATO': ['stengesDato', 'Date'],
    'STORBUE': ['storbue', 'Integer'],
    'STREKNINGSNUMMER': ['strekningsnummer', 'Integer'],
    'STRENG': ['generellTekststreng', 'String'],
    'STRIPENUMMER': ['stripenummer', 'String'],
    'STRUKTUROVERBIKKET': ['strukturOverbikket', 'String'],
    'STRUKTURPUNKTTYPE': ['strukturPunkttype', 'Integer'],
    'STRØMHAST': ['strømhastighet', 'Real'],
    'STRØMRETN': ['strømretning', 'Integer'],
    'STØYENHET': ['støyenhet', 'String'],
    'STØYINTERVALL': ['støyintervall', 'Integer'],
    'STØYKILDE': ['støykilde', 'String'],
    'STØYKILDEIDENTIFIKASJON': ['Støykildeidentifikasjon', 'String'],
    'STØYKILDENAVN': ['støykildenavn', 'String'],
    'STØYMETODE': ['støymetode', 'String'],
    'STØYNIVÅ': ['støynivå', 'Integer'],
    'STØYSONEKATEGORI': ['støysonekategori', 'String'],
    'SUM_ALT_AREAL': ['sumAlternativtAreal', 'Real'],
    'SUM_ALT_AREAL2': ['sumAlternativtAreal2', 'Real'],
    'SUM_ANTALLBOENH': ['sumAntallBoenheter', 'Integer'],
    'SUM_BRUKSARTOT': ['sumBruksarealTotalt', 'Real'],
    'SUM_BRUKSTILANN': ['sumBruksarealTilAnnet', 'Real'],
    'SUM_BRUKSTILBOL': ['sumBruksarealTilBolig', 'Real'],
    'SYKKELRUTETYPE': ['sykkelrutetype', 'Integer'],
    'SYNBARHET': ['synbarhet', 'Integer'],
    'SYSKODE': ['referansesystemKode', 'Integer'],
    'TAKFORM': ['takform', 'Integer'],
    'TAKSKJEGG': ['takskjegg', 'Integer'],
    'TAKTEKKING': ['taktekking', 'Integer'],
    'TDIM-BREDDE': ['tekstTegnbredde', 'Real'],
    'TDIM-HØYDE': ['tekstTegnhøyde', 'Real'],
    'TEGNFORKL': ['tegnforklaring', 'String'],
    'TEGNSETT': ['tegnsett', 'String'],
    'TEIGE_ID': ['teigEtterSkifteIdent', 'Integer'],
    'TEIGF_ID': ['teigFørSkitfeIdent', 'Integer'],
    'TEIGFLEREMATRSAMMEEIER': ['teigFlereMatrSammeEier', 'String'],
    'TEIGMEDFLEREMATRENHETER': ['teigMedFlereMatrikkelenheter', 'String'],
    'TEIGNR': ['jordregisterEiendomTeigNummer', 'Integer'],
    'TEKSTURKODE1': ['teksturkode', 'String'],
    'TEKSTURKODE2': ['teksturkode2', 'String'],
    'TEKSTURKODE3': ['teksturkode3', 'String'],
    'TELEFAXNR': ['telefaxnummer', 'Integer'],
    'TELEFONNR': ['telefonnummer', 'Integer'],
    'TELLER': ['teller', 'Real'],
    'TEMAJUST': ['geolTemajustering', 'Integer'],
    'TEMAKVAL': ['temaKvalitet', 'String'],
    'TERSKELFUNKSJON': ['terskelFunksjon', 'String'],
    'TERSKELTYP': ['terskelType', 'String'],
    'TETTSTEDNAVN': ['tettstednavn', 'String'],
    'TIDOPPHOLDVANN': ['tidOppholdVann', 'Integer'],
    'TIDREF': ['tidreferanse', 'String'],
    'TIDSANGIVELSE': ['tidsangivelse', 'Integer'],
    'TIDSENHET': ['tidsenhet', 'String'],
    'TIDSLUTT': ['periodeSlutt', 'Date'],
    'TIDSPUNKT': ['tidspunkt', 'Date'],
    'TIDSTART': ['periodeStart', 'Date'],
    'TILDELT_AREAL': ['tildeltAreal', 'Real'],
    'TILDELT_DATO': ['tilldeltDato', 'Date'],
    'TILGJENGELIGHETSVURDERING': ['tilgjengelighetsvurdering', 'String'],
    'TILLEGG': ['flatetillegg', 'Integer'],
    'TILLEGGSAREAL': ['tilleggsareal', 'Integer'],
    'TILSPORNODEKILOMETER': ['tilSpornodeKilometer', 'Real'],
    'TILSPORNODETEKST': ['tilSpornodeTekst', 'String'],
    'TILSPORNODETYPE': ['tilSpornodeType', 'String'],
    'TILSYS': ['tilKoordinatsystem', 'Integer'],
    'TILTAKNR': ['tiltaksnummer', 'Integer'],
    'TINGLYST': ['tinglyst', 'String'],
    'TIPPVOLUM': ['deponitippVolum', 'Integer'],
    'TOKTID': ['toktId', 'String'],
    'TOT_PROD': ['totalProduksjon', 'Integer'],
    'TOTALAREALKM2': ['totalarealKm2', 'Real'],
    'TOTALBELASTNING': ['totalBelastning', 'Integer'],
    'TRAFIKKBELASTNING': ['trafikkbelastning', 'Integer'],
    'TRAFIKKFARE': ['trafikkfare', 'String'],
    'TRE_D_NIVÅ': ['treDNivå', 'Integer'],
    'TRE_TYP': ['treType', 'Integer'],
    'TRNORD': ['tekstReferansePunktNord', 'Integer'],
    'TRØST': ['tekstReferansePunktØst', 'Integer'],
    'TSKOG': ['tilleggsopplysningerSkog', 'Integer'],
    'TSKYV': ['tekstForskyvning', 'Real'],
    'TSTED': ['tettstednummer', 'Integer'],
    'TVIST': ['tvist', 'String'],
    'TWYMERK': ['taksebaneoppmerking', 'Integer'],
    'TYPE_BR': ['trasebreddetype', 'Integer'],
    'TYPE_VANNFOR_ANL': ['typeVannforsyningsanlegg', 'Integer'],
    'TYPEDUMPEOMRÅDE': ['typeDumpeområde', 'Integer'],
    'TYPEINNSJØ': ['typeInnsjø', 'Integer'],
    'TYPESAMFLINJE': ['samferdselslinjeType', 'Integer'],
    'TYPESAMFPUNKT': ['samferdselspunkt', 'Integer'],
    'UB_ANL_TYP': ['utmarkbeiteAnleggstype', 'Integer'],
    'UB_DYRESL': ['utmarkbeiteDyreslag', 'String'],
    'UFULLSTENDIGAREAL': ['ufullstendigAreal', 'String'],
    'UNDERBYGNINGKONSTR': ['underbygningKonstr', 'Integer'],
    'UNDERGRUNN': ['undergrunn', 'String'],
    'UNDERLAG': ['fastmerkeUnderlag', 'Integer'],
    'UNDERLAGSTYPE': ['underlagstype', 'Integer'],
    'UNDERSAMMENFØYNINGSKALBESTÅ': ['underSammenføyningSkalBestå', 'String'],
    'UNDERSAMMENFØYNINGSKALUTGÅ': ['underSammenføyningSkalUtgå', 'String'],
    'UNDERSOKELSENR': ['undersokelseNummer', 'Integer'],
    'UNDERTYPE': ['undertypeVersjon', 'String'],
    'UNR': ['underNr', 'Integer'],
    'UREGJORDSAMEIE': ['uregistrertJordsameie', 'String'],
    'UTEAREAL': ['uteoppholdsareal', 'Integer'],
    'UTGÅR_DATO': ['utgårDato', 'Date'],
    'UTGÅTT': ['utgått', 'String'],
    'UTNTALL': ['utnyttingstall', 'Real'],
    'UTNTYP': ['utnyttingstype', 'Integer'],
    'UTNYTTBAR_KAP': ['utnyttbarMagasinkapasitet', 'Real'],
    'UTSLIPPTYPE': ['utslipptype', 'String'],
    'UTV_TILL_NR': ['tillatelsesnummer', 'String'],
    'UTV_TILL_TYPE': ['utvinningstillatelsestype', 'String'],
    'UTVALGSAK': ['utvalgssaksnummer', 'Integer'],
    'UTVALGSMET': ['utvalgMetode', 'String'],
    'UUFASILITET': ['universellutformingFasilitet', 'String'],
    'VALUTAENHET': ['valutaenhet', 'String'],
    'VANNBR': ['vannbredde', 'Integer'],
    'VANNFORSYNING': ['vannforsyning', 'Integer'],
    'VANNFØRINGMIDLERE': ['vannføringMidlere', 'Integer'],
    'VANNFØRINGMINSTE': ['vannføringMinste', 'Integer'],
    'VANNFØRINGSTØRST': ['vannføringStørst', 'Integer'],
    'VANNLAGR': ['vannlagringsevne', 'Integer'],
    'VASSDRAGNAVN': ['vassdragsnavn', 'String'],
    'VASSDRAGSNR': ['vassdragsnummer', 'String'],
    'VATNLNR': ['vatnLøpenummer', 'Integer'],
    'V-DELTA-MAX': ['vertikaltDeltaMaksimum', 'Integer'],
    'V-DELTA-MIN': ['vertikaltDeltaMinimum', 'Integer'],
    'VEDLIKEH': ['vedlikeholdsansvarlig', 'String'],
    'VEDTAK': ['vedtakstype', 'Integer'],
    'VEDTAKSDATO': ['vedtaksdato', 'Date'],
    'VEGKATEGORI': ['vegkategori', 'String'],
    'VEGNUMMER': ['vegnummer', 'Integer'],
    'VEGOVERVEG': ['vegOverVeg', 'String'],
    'VEGREKKVERKTYPE': ['vegrekkverkType', 'String'],
    'VEGSPERRINGTYPE': ['vegsperringtype', 'String'],
    'VEGSTATUS': ['vegstatus', 'String'],
    'VERDI': ['verdi', 'Integer'],
    'VERDI1': ['verdi', 'String'],
    'VERDI2': ['tilVerdi', 'String'],
    'VERDIANNA': ['verdiAnnenUtnyttelseGrunn', 'Real'],
    'VERDIBEITE': ['verdiBeiterett', 'Real'],
    'VERDIGRUNN': ['verdiGrunn', 'Real'],
    'VERDIJAKT': ['verdiJaktrett', 'Real'],
    'VERDISKOG': ['verdiSkogProduksjon', 'Real'],
    'VERIFISERINGSDATO': ['verifiseringsdato', 'Date'],
    'VERN_FORMAL': ['verneFormål', 'String'],
    'VERN_LOV': ['vernelov', 'String'],
    'VERN_MOT': ['vernskogType', 'Integer'],
    'VERN_PARA': ['verneparagraf', 'String'],
    'VERNEDATO': ['vernedato', 'Date'],
    'VERNEFORM': ['verneform', 'String'],
    'VERNEPLAN': ['verneplan', 'Integer'],
    'VERNTEMA': ['verneTema', 'Integer'],
    'VERNTYPE': ['vernetype', 'String'],
    'VERSJON': ['versjon', 'String'],
    'VERT_BÆREKONSTR': ['vertikalBærekonstruksjon', 'Integer'],
    'VERTNIV': ['vertikalnivå', 'Integer'],
    'VFLATE': ['delteigKlassifisering', 'Integer'],
    'VFRADATO': ['veglenkeFraDato', 'Date'],
    'VIKTIG': ['viktighet', 'Integer'],
    'VINDRETN': ['vindretning', 'Integer'],
    'VINKELENHET': ['vinkelenhet', 'String'],
    'VIRKSOMHET': ['typeRastoffVirksomhet', 'Integer'],
    'VISUELLTYDELIGHET': ['visuellTydelighet', 'Integer'],
    'VKJORFLT': ['feltoversikt', 'String'],
    'VKRETSNAVN': ['valgkretsnavn', 'String'],
    'VKRETSNR': ['valgkretsnummer', 'Integer'],
    'VLENKEID': ['veglenkeIdentifikasjon', 'Integer'],
    'VOLUM_M3': ['rastoffVolum', 'Integer'],
    'VOLUMENHET': ['volumenhet', 'String'],
    'VOLUMINNSJØ': ['volumInnsjø', 'Integer'],
    'VRAKTYP': ['vraktype', 'Integer'],
    'VTILDATO': ['veglenkeTilDato', 'Date'],
    'VURDERING': ['vurdering', 'String'],
    'VURDERTDATO': ['vurdertDato', 'Date'],
    'VÆSKETYPE': ['petroleumsvæsketype', 'Integer'],
    'WRBKODE': ['WRBgruppe', 'String'],
    'YTTERVEGG': ['yttervegg', 'Integer'],
    'ØST': ['øst', 'Integer'],
    'ÅPNESDATO': ['åpnesDato', 'Date'],
    'ÅR': ['årstall', 'Integer'],
    'ÅRSTIDBRUK': ['årstidbruk', 'String'],
    'VEDTAKENDELIGPLANDATO': ['vedtakEndeligPlanDato', 'Date'],
    'KUNNGJØRINGSDATO': ['kunngjøringsdato', 'Date'],
    'KPBESTEMMELSEHJEMMEL': ['kpBestemmelseHjemmel', 'Integer'],
    'RPBESTEMMELSEHJEMMEL': ['rpBestemmelseHjemmel', 'Integer'],
    'CCDBRIKKELENGDE': ['ccdBrikkelengde', 'Integer'],
    'CCDBRIKKESIDE': ['ccdBrikkeside', 'Integer'],
    'BILDEOPPLØSNING': ['bildeoppløsning', 'Real'],
    'BILDEFILFORMAT': ['bildefilformat', 'Integer'],
    'STATLIGNR': ['statlignummer', 'Integer'],
    'AEROTRIANGULERING': ['aerotriangulering', 'Integer'],
    'PROSJEKTRAPPORTLINK': ['prosjektrapportlink', 'String'],
    'BILDEFILIR': ['bildefilIr', 'String'],
    'BILDEFILPAN': ['bildefilPan', 'String'],
    'BILDEFILRGB': ['bildefilRGB', 'String'],
    'BILDEFILMULTI': ['bildefilMulti', 'String'],
    'ORTOFOTOTYPE': ['ortofototype', 'Integer'],
    'KAMERALØPENUMMER': ['løpenummer', 'Integer'],
    'PRODUKSJONSRAPPORTLINK': ['produksjonsrapportlink', 'String'],
    'PRODUKTSPESIFIKASJONSLINK': ['produktspesifikasjonslink', 'String'],
    'SAKSÅR': ['saksår', 'Integer'],
    'SEKVENSNUMMER': ['sekvensnummer', 'Integer'],
    'UTNTALL_MIN': ['utnyttingstall_minimum', 'Real'],
    'GYLDIGTILDATO': ['gyldigTilDato', 'Date'],
    'PIXELSTØRRELSE': ['pixelstørrelse', 'Real'],
    'HENDELSESDATO': ['Hendelsesdato', 'Date'],
    'NPPLANBESTEMMELSETYPE': ['planbestemmelsetype', 'Integer'],
    'NPPLANTEMA': ['planTema', 'Integer'],
    'FAGOMRÅDE_LINK': ['link til fagområde', 'String'],
    'PRODUKT_LINK': ['produktLink', 'String'],

    'ADRESSEBRUKSENHET': ['adresseBruksenhet', Array(3)],
    'ADRESSEKOMMENTAR': ['adresseKommentar', Array(5)],
    'ADRESSEREFERANSE': ['adresseReferanse', Array(2)],
    'ADRESSETILLEGG': ['adresseTillegg', Array(3)],
    'AID': ['gateadresseId', Array(3)],
    'AJOURFØRING': ['ajourføring', Array(2)],
    'AKVA_KONS_INFO': ['akvaKonsesjonsinformasjon', Array(7)],
    'AKVA_PRØVE_INFO': ['akvaPrøvetakinformasjon', Array(9)],
    'ANDEL': ['andel', Array(2)],
    'AREALFORDELING': ['arealfordeling', Array(5)],
    'BELASTNINGBOF5': ['belastningBOF5', Array(4)],
    'BELASTNINGFOSFOR': ['belastningFosfor', Array(4)],
    'BEREGNETAREAL': ['beregnetAreal', Array(2)],
    'BILDEINFORMASJON': ['bildeinformasjon', Array(3)],
    'BMARTOBS': ['bmArtsobservasjon', Array(4)],
    'BMARTREG': ['bmArtsregistrering', Array(8)],
    'BMKILDE': ['bmKilde', Array(2)],
    'BMNATYPTILLEGG': ['bmNaturtypeTillegg', Array(2)],
    'BRUKSENHET': ['bruksenhet', Array(10)],
    'BYDELID': ['bydelId', Array(2)],
    'BYGG_KOMMENTARER': ['bygningKommentar', Array(5)],
    'BYGN_STAT_HIST': ['bygningsstatusHistorikk', Array(3)],
    'BYGNING_TILLEGG': ['bygningTillegg', Array(15)],
    'BYGNINGSREF': ['bygningsreferanse', Array(2)],
    'DELOMRåDEID': ['delområdeId', Array(2)],
    'DPOT_GRAS': ['dyrkingpotensjalGras', Array(4)],
    'DPOT_KORN': ['dyrkingpotensjalKorn', Array(4)],
    'DPOT_POTET': ['dyrkingpotensjalPotet', Array(4)],
    'EKOORD': ['jordregisterEiendomsteigkoordinat', Array(3)],
    'ENDRINGSFLAGG': ['endringsflagg', Array(2)],
    'ENDRINGSVURDERING': ['endringsvurdering', Array(2)],
    'ETASJE': ['etasje', Array(8)],
    'ETASJEDATA': ['etasjedata', Array(6)],
    'FELTREGISTRERT': ['feltregistrert', Array(3)],
    'FIRMA_EIER': ['firmaeier', Array(7)],
    'FISKE_BEDR_ID': ['fiskebedriftsidentifikasjon', Array(6)],
    'FISKE_BEDR_INFO': ['fiskebedriftsinformasjon', Array(2)],
    'FISKE_BEDR_MARKED': ['fiskebedriftsmarked', Array(2)],
    'FISKE_BEDR_TJENESTE': ['fiskebedriftstjeneste', Array(3)],
    'FISKERI_REDSKAP': ['fiskeriredskap', Array(4)],
    'FISKERI_RESS_ART': ['fiskeriressursomrÃadeArt', Array(6)],
    'FISKERI_RESSURS': ['fiskeriressurs', Array(2)],
    'FMDATO': ['fastmerkeDato', Array(2)],
    'FMIDNY': ['fastmerkeIdNy', Array(4)],
    'FMSIGN': ['fastmerkeSignal', Array(2)],
    'FMSTATUS': ['fastmerkeStatus', Array(2)],
    'FMTYPE': ['fastmerkeType', Array(5)],
    'FORUR_GRUNN_EIENDOM': ['forurensetGrunnEiendom', Array(2)],
    'GRENSE_MELLOM': ['grenseMellomNasjonerSjÃ', Array(2)],
    'GRUNNKRETSID': ['grunnkretsId', Array(2)],
    'HAVNE_D_INFO': ['havnedistriktInformasjon', Array(2)],
    'HOVEDMåLRUBRIKK': ['hovedmålRubrikk', Array(2)],
    'HOVEDNR': ['landbruksregHovedNR', Array(1)],
    'HYTTEINFORMASJON': ['hytteinformasjon', Array(3)],
    'JORDTYPE': ['jordtype', Array(6)],
    'JREGMARK': ['jordregisterMarkslag', Array(10)],
    'JREGTEIG': ['jordregisterEiendomsteig', Array(4)],
    'KAI_INFO': ['kaiInformasjon', Array(3)],
    'KAMERAINFORMASJON': ['kamerainformasjon', Array(9)],
    'KM_DAT_INFO': ['kulturminneDateringInfo', Array(2)],
    'KM_DATERING': ['kulturminneDateringGruppe', Array(2)],
    'KOMMUNALKRETS': ['kommunalKrets', Array(4)],
    'KOPIDATA': ['kopidata', Array(3)],
    'KOPLING': ['koplingsegenskaper', Array(8)],
    'KURSLINJE_INFO': ['kurslinjeinformasjon', Array(4)],
    'KVALITET': ['kvalitet', Array(6)],
    'LEDNING': ['ledningsegenskaper', Array(8)],
    'LEGGEåR': ['leggeÅr', Array(2)],
    'LGID': ['landbruksregGrunneiendomNr', Array(8)],
    'MATRIKKELADRESSEID': ['matrikkeladresseId', Array(2)],
    'MATRIKKELNUMMER': ['matrikkelnummer', Array(5)],
    'OVERLAPP': ['overlapp', Array(2)],
    'POST': ['postadministrativeOmråder', Array(2)],
    'REGISTRERINGSVERSJON': ['registreringsversjon', Array(2)],
    'RESIPIENT': ['resipient', Array(5)],
    'RETNING': ['retningsvektor', Array(3)],
    'RØR_DIMENSJON': ['ledningsdimensjon', Array(2)],
    'SAK': ['saksinformasjon', Array(4)],
    'SEFRAK_ID': ['sefrakId', Array(3)],
    'SEFRAKFUNKSJON': ['sefrakFunksjon', Array(2)],
    'SENTRUMSSONEID': ['sentrumssoneId', Array(2)],
    'SERV': ['servituttgruppe', Array(3)],
    'SKRETSID': ['skolekretsID', Array(2)],
    'SP_ADM': ['skogbrplanAdmDataGruppe', Array(2)],
    'SP_AKLASS': ['skogbrplanKlassGruppe', Array(6)],
    'SP_BESTAND': ['skogbrplanBestandGruppe', Array(2)],
    'SP_BSKRIV': ['skogbrplanBeskrivBestandGruppe', Array(13)],
    'SP_FLBRELEM': ['skogbrplanFlerKoderGruppe', Array(5)],
    'SP_GRLVOL': ['skogbrplanGrunnlagVolBer', Array(8)],
    'SP_TEIG': ['skogbrplanTeigGruppe', Array(4)],
    'SP_TERKLASS': ['skogbrplanTerrengGruppe', Array(5)],
    'SP_TETTHOYD': ['skogbrplanTetthetGruppe', Array(2)],
    'SP_TILTAK': ['skogbrplanTiltakGruppe', Array(5)],
    'SP_TILVVOL': ['skogbrplanTilvekstGruppe', Array(4)],
    'SP_TRESL': ['skogbrplanTreslagGruppe', Array(8)],
    'TETTSTEDID': ['tettstedId', Array(2)],
    'UNIVERSELLUTFORMING': ['universellUtforming', Array(3)],
    'UTNYTT': ['utnytting', Array(2)],
    'UTSLIPP': ['utslipp', new Array(3)],
    'UTV_TILL_PART': ['utvinningstillatelsespartner', Array(2)],
    'VERN': ['vern', Array(4)],
    'VKRETS': ['valgkretsId', Array(2)],
    'VNR': ['vegident', Array(3)],
    'VPA': ['vegparsell', Array(3)]
};

sositypes['ADRESSEBRUKSENHET'][1][1] = ['etasjenummer', 'Integer'];
sositypes['ADRESSEBRUKSENHET'][1][2] = ['etasjeplan', 'String'];
sositypes['ADRESSEBRUKSENHET'][1][0] = ['bruksenhetLøpenr', 'Integer'];
sositypes['ADRESSEKOMMENTAR'][1][0] = ['etat', 'String'];
sositypes['ADRESSEKOMMENTAR'][1][2] = ['kommentar', 'String'];
sositypes['ADRESSEKOMMENTAR'][1][1] = ['kommentarType', 'String'];
sositypes['ADRESSEKOMMENTAR'][1][4] = ['lagretDato', 'Date'];
sositypes['ADRESSEKOMMENTAR'][1][3] = ['saksnummer', 'Integer'];
sositypes['ADRESSEREFERANSE'][1][1] = ['adresseReferansekode', 'String'];
sositypes['ADRESSEREFERANSE'][1][0] = ['referanse', 'String'];
sositypes['ADRESSETILLEGG'][1][1] = ['adresseKommentar', 'String'];
sositypes['ADRESSETILLEGG'][1][2] = ['adresseReferanse', 'String'];
sositypes['ADRESSETILLEGG'][1][0] = ['kartbladindeks', 'String'];
sositypes['AID'][1][2] = ['bokstav', 'String'];
sositypes['AID'][1][0] = ['gatenummer', 'Integer'];
sositypes['AID'][1][1] = ['husnummer', 'Integer'];
sositypes['AJOURFØRING'][1][1] = ['ajourførtAv', 'String'];
sositypes['AJOURFØRING'][1][0] = ['ajourførtDato', 'Date'];
sositypes['AKVA_KONS_INFO'][1][1] = ['akvaKonsesjonsnummer', 'Integer'];
sositypes['AKVA_KONS_INFO'][1][4] = ['konsesjonsstatus', 'String'];
sositypes['AKVA_KONS_INFO'][1][6] = ['konsesjonstype', 'String'];
sositypes['AKVA_KONS_INFO'][1][5] = ['konsesjonsformål', 'String'];
sositypes['AKVA_KONS_INFO'][1][0] = ['fiskebruksnummerFylke', 'String'];
sositypes['AKVA_KONS_INFO'][1][2] = ['lokalitetsnavn', 'String'];
sositypes['AKVA_KONS_INFO'][1][3] = ['lokalitetsnummer', 'Integer'];
sositypes['AKVA_PRØVE_INFO'][1][7] = ['akvaTemperatur', 'Integer'];
sositypes['AKVA_PRØVE_INFO'][1][1] = ['algekonsentrasjon', 'Integer'];
sositypes['AKVA_PRØVE_INFO'][1][0] = ['algetype', 'String'];
sositypes['AKVA_PRØVE_INFO'][1][5] = ['klorofyllMaksimum', 'Integer'];
sositypes['AKVA_PRØVE_INFO'][1][8] = ['salinitet', 'Integer'];
sositypes['AKVA_PRØVE_INFO'][1][6] = ['sikteDyp', 'Integer'];
sositypes['AKVA_PRØVE_INFO'][1][2] = ['strømretning', 'Integer'];
sositypes['AKVA_PRØVE_INFO'][1][4] = ['vindretning', 'Integer'];
sositypes['ANDEL'][1][1] = ['nevner', 'Real'];
sositypes['ANDEL'][1][0] = ['teller', 'Real'];
sositypes['AREALFORDELING'][1][4] = ['prosentElv', 'Real'];
sositypes['AREALFORDELING'][1][2] = ['prosentHav', 'Real'];
sositypes['AREALFORDELING'][1][3] = ['prosentInnsjø', 'Real'];
sositypes['AREALFORDELING'][1][1] = ['prosentLand', 'Real'];
sositypes['AREALFORDELING'][1][0] = ['totalarealKm2', 'Real'];
sositypes['BELASTNINGBOF5'][1][2] = ['andrekilderBelastning', 'Integer'];
sositypes['BELASTNINGBOF5'][1][0] = ['husholdBelastning', 'Integer'];
sositypes['BELASTNINGBOF5'][1][1] = ['industriBelastning', 'Integer'];
sositypes['BELASTNINGBOF5'][1][3] = ['totalbelastning', 'Integer'];
sositypes['BELASTNINGFOSFOR'][1][2] = ['andrekilderBelastning', 'Integer'];
sositypes['BELASTNINGFOSFOR'][1][0] = ['husholdBelastning', 'Integer'];
sositypes['BELASTNINGFOSFOR'][1][1] = ['industriBelastning', 'Integer'];
sositypes['BELASTNINGFOSFOR'][1][3] = ['totalbelastning', 'Integer'];
sositypes['BEREGNETAREAL'][1][0] = ['areal', 'Real'];
sositypes['BEREGNETAREAL'][1][1] = ['arealmerknad', 'String'];
sositypes['BILDEINFORMASJON'][1][1] = ['brennvidde', 'Real'];
sositypes['BILDEINFORMASJON'][1][2] = ['fotograf', 'String'];
sositypes['BILDEINFORMASJON'][1][0] = ['kameratype', 'String'];
sositypes['BMARTOBS'][1][1] = ['bmAntall', 'Integer'];
sositypes['BMARTOBS'][1][0] = ['bmArt', 'String'];
sositypes['BMARTOBS'][1][2] = ['bmEnhet', 'Integer'];
sositypes['BMARTOBS'][1][3] = ['bmRegistreringsdato', 'Date'];
sositypes['BMARTREG'][1][6] = ['bmÅrstid', 'Integer'];
sositypes['BMARTREG'][1][0] = ['bmArt', 'String'];
sositypes['BMARTREG'][1][2] = ['bmOmrådefunksjon', 'Integer'];
sositypes['BMARTREG'][1][5] = ['bmFunksjonskvalitet', 'Integer'];
sositypes['BMARTREG'][1][7] = ['bmKilde', 'String'];
sositypes['BMARTREG'][1][1] = ['bmRegistreringsdato', 'Date'];
sositypes['BMARTREG'][1][3] = ['bmTruethetskategori', 'String'];
sositypes['BMARTREG'][1][4] = ['bmViltvekt', 'Integer'];
sositypes['BMKILDE'][1][1] = ['bmKildetype', 'Integer'];
sositypes['BMKILDE'][1][0] = ['bmKildevurdering', 'Integer'];
sositypes['BMNATYPTILLEGG'][1][1] = ['bmAndel', 'Integer'];
sositypes['BMNATYPTILLEGG'][1][0] = ['bmNaturtype', 'String'];
sositypes['BRUKSENHET'][1][7] = ['antallBad', 'Integer'];
sositypes['BRUKSENHET'][1][6] = ['antallRom', 'Integer'];
sositypes['BRUKSENHET'][1][8] = ['antallWC', 'Integer'];
sositypes['BRUKSENHET'][1][5] = ['bruksareal', 'Real'];
sositypes['BRUKSENHET'][1][4] = ['bruksenhetstype', 'String'];
sositypes['BRUKSENHET'][1][2] = ['etasjenummer', 'Integer'];
sositypes['BRUKSENHET'][1][1] = ['etasjeplan', 'String'];
sositypes['BRUKSENHET'][1][9] = ['kjøkkenTilgang', 'Integer'];
sositypes['BRUKSENHET'][1][3] = ['bruksenhetLøpenr', 'Integer'];
sositypes['BRUKSENHET'][1][0] = ['matrikkelnummer', 'String'];
sositypes['BYDELID'][1][0] = ['bydelsnavn', 'String'];
sositypes['BYDELID'][1][1] = ['bydelsnummer', 'Integer'];
sositypes['BYGG_KOMMENTARER'][1][3] = ['bygnSaksnr', 'String'];
sositypes['BYGG_KOMMENTARER'][1][0] = ['etat', 'String'];
sositypes['BYGG_KOMMENTARER'][1][2] = ['kommentar', 'String'];
sositypes['BYGG_KOMMENTARER'][1][1] = ['kommentarType', 'String'];
sositypes['BYGG_KOMMENTARER'][1][4] = ['lagretDato', 'Date'];
sositypes['BYGN_STAT_HIST'][1][0] = ['bygningsstatus', 'String'];
sositypes['BYGN_STAT_HIST'][1][1] = ['bygningshistorikkDato', 'Date'];
sositypes['BYGN_STAT_HIST'][1][2] = ['registrertDato', 'Date'];
sositypes['BYGNING_TILLEGG'][1][0] = ['alternativtArealBygning', 'Real'];
sositypes['BYGNING_TILLEGG'][1][1] = ['antallEtasjer', 'Integer'];
sositypes['BYGNING_TILLEGG'][1][2] = ['antallRøkløp', 'Real'];
sositypes['BYGNING_TILLEGG'][1][3] = ['brenseltankNedgravd', 'Integer'];
sositypes['BYGNING_TILLEGG'][1][14] = ['bygningKommentar', 'String'];
sositypes['BYGNING_TILLEGG'][1][13] = ['bygningsreferanse', 'String'];
sositypes['BYGNING_TILLEGG'][1][9] = ['fundamentering', 'Integer'];
sositypes['BYGNING_TILLEGG'][1][12] = ['horisontalBærekonstr', 'Integer'];
sositypes['BYGNING_TILLEGG'][1][5] = ['kartbladindeks', 'String'];
sositypes['BYGNING_TILLEGG'][1][6] = ['kildePrivatVannforsyning', 'Integer'];
sositypes['BYGNING_TILLEGG'][1][10] = ['materialeIYttervegg', 'Integer'];
sositypes['BYGNING_TILLEGG'][1][7] = ['privatKloakkRensing', 'Integer'];
sositypes['BYGNING_TILLEGG'][1][8] = ['renovasjon', 'Integer'];
sositypes['BYGNING_TILLEGG'][1][4] = ['septiktank', 'String'];
sositypes['BYGNING_TILLEGG'][1][11] = ['vertikalBærekonstr', 'Integer'];
sositypes['BYGNINGSREF'][1][1] = ['bygningReferansetype', 'String'];
sositypes['BYGNINGSREF'][1][0] = ['referanse', 'String'];
sositypes['DELOMRåDEID'][1][0] = ['delområdenavn', 'String'];
sositypes['DELOMRåDEID'][1][1] = ['delområdenummer', 'String'];
sositypes['DPOT_GRAS'][1][2] = ['nedbørsbasert', 'Integer'];
sositypes['DPOT_GRAS'][1][3] = ['nedklassifiseringNedbør', 'Integer'];
sositypes['DPOT_GRAS'][1][0] = ['vanningsbasert', 'Integer'];
sositypes['DPOT_GRAS'][1][1] = ['nedklassifiseringVanning', 'Integer'];
sositypes['DPOT_KORN'][1][2] = ['nedbørsbasert', 'Integer'];
sositypes['DPOT_KORN'][1][3] = ['nedklassifiseringNedbør', 'Integer'];
sositypes['DPOT_KORN'][1][0] = ['vanningsbasert', 'Integer'];
sositypes['DPOT_KORN'][1][1] = ['nedklassifiseringVanning', 'Integer'];
sositypes['DPOT_POTET'][1][2] = ['nedbørsbasert', 'Integer'];
sositypes['DPOT_POTET'][1][3] = ['nedklassifiseringNedbør', 'Integer'];
sositypes['DPOT_POTET'][1][0] = ['vanningsbasert', 'Integer'];
sositypes['DPOT_POTET'][1][1] = ['nedklassifiseringVanning', 'Integer'];
sositypes['EKOORD'][1][2] = ['jordregisterKoordinatHøyde', 'Integer'];
sositypes['EKOORD'][1][0] = ['jordregisterKoordinatNord', 'Integer'];
sositypes['EKOORD'][1][1] = ['jordregisterKoordinatØst', 'Integer'];
sositypes['ENDRINGSFLAGG'][1][1] = ['tidspunktEndring', 'Date'];
sositypes['ENDRINGSFLAGG'][1][0] = ['typeEndring', 'String'];
sositypes['ENDRINGSVURDERING'][1][0] = ['endringsgrad', 'String'];
sositypes['ENDRINGSVURDERING'][1][1] = ['vurdertDato', 'Date'];
sositypes['ETASJE'][1][2] = ['antallBoenheter', 'Integer'];
sositypes['ETASJE'][1][4] = ['bruksarealTilAnnet', 'Real'];
sositypes['ETASJE'][1][3] = ['bruksarealTilBolig', 'Real'];
sositypes['ETASJE'][1][5] = ['bruksarealTotalt', 'Real'];
sositypes['ETASJE'][1][1] = ['etasjenummer', 'Integer'];
sositypes['ETASJE'][1][0] = ['etasjeplan', 'String'];
sositypes['ETASJE'][1][6] = ['kommAlternativtAreal', 'Real'];
sositypes['ETASJE'][1][7] = ['kommAlternativtAreal2', 'Real'];
sositypes['ETASJEDATA'][1][4] = ['sumAlternativtAreal', 'Real'];
sositypes['ETASJEDATA'][1][5] = ['sumAlternativtAreal2', 'Real'];
sositypes['ETASJEDATA'][1][0] = ['sumAntallBoenheter', 'Integer'];
sositypes['ETASJEDATA'][1][3] = ['sumBruksarealTotalt', 'Real'];
sositypes['ETASJEDATA'][1][2] = ['sumBruksarealTilAnnet', 'Real'];
sositypes['ETASJEDATA'][1][1] = ['sumBruksarealTilBolig', 'Real'];
sositypes['FELTREGISTRERT'][1][2] = ['ajourføring', 'String'];
sositypes['FELTREGISTRERT'][1][1] = ['datafangstdato', 'Date'];
sositypes['FELTREGISTRERT'][1][0] = ['feltregistrertAv', 'String'];
sositypes['FIRMA_EIER'][1][2] = ['adresse', 'String'];
sositypes['FIRMA_EIER'][1][0] = ['firmanavn', 'String'];
sositypes['FIRMA_EIER'][1][1] = ['bedriftseier', 'String'];
sositypes['FIRMA_EIER'][1][6] = ['kontaktperson', 'String'];
sositypes['FIRMA_EIER'][1][3] = ['postnummer', 'Integer'];
sositypes['FIRMA_EIER'][1][5] = ['telefaxnummer', 'Integer'];
sositypes['FIRMA_EIER'][1][4] = ['telefonnummer', 'Integer'];
sositypes['FISKE_BEDR_ID'][1][4] = ['antallAnsatte', 'Integer'];
sositypes['FISKE_BEDR_ID'][1][5] = ['antallÅrsverk', 'Integer'];
sositypes['FISKE_BEDR_ID'][1][0] = ['fiskebedriftsnavn', 'String'];
sositypes['FISKE_BEDR_ID'][1][2] = ['fiskebruksnummer', 'Integer'];
sositypes['FISKE_BEDR_ID'][1][1] = ['fiskebruksnummerFylke', 'String'];
sositypes['FISKE_BEDR_ID'][1][3] = ['firmaeier', 'String'];
sositypes['FISKE_BEDR_INFO'][1][1] = ['artskode', 'Integer'];
sositypes['FISKE_BEDR_INFO'][1][0] = ['fisketype', 'Integer'];
sositypes['FISKE_BEDR_MARKED'][1][0] = ['fiskebedriftsandel', 'Integer'];
sositypes['FISKE_BEDR_MARKED'][1][1] = ['fiskebedriftsområde', 'Integer'];
sositypes['FISKE_BEDR_TJENESTE'][1][2] = ['fiskebedriftservice', 'Integer'];
sositypes['FISKE_BEDR_TJENESTE'][1][1] = ['fiskekapasitetEnhet', 'Integer'];
sositypes['FISKE_BEDR_TJENESTE'][1][0] = ['fiskekapasitet', 'Integer'];
sositypes['FISKERI_REDSKAP'][1][0] = ['fiskeriredskapGenAktiv', 'Integer'];
sositypes['FISKERI_REDSKAP'][1][1] = ['fiskeriredskapGenPassiv', 'Integer'];
sositypes['FISKERI_REDSKAP'][1][2] = ['fiskeriredskapSpesAktiv', 'Integer'];
sositypes['FISKERI_REDSKAP'][1][3] = ['fiskeriredskapSpesPassiv', 'Integer'];
sositypes['FISKERI_RESS_ART'][1][3] = ['engelskArtsnavn', 'String'];
sositypes['FISKERI_RESS_ART'][1][2] = ['vitenskapeligArtsnavn', 'String'];
sositypes['FISKERI_RESS_ART'][1][1] = ['norskArtsnavn', 'String'];
sositypes['FISKERI_RESS_ART'][1][0] = ['taksonomiskKode', 'Integer'];
sositypes['FISKERI_RESS_ART'][1][4] = ['faoKode', 'String'];
sositypes['FISKERI_RESS_ART'][1][5] = ['artskode', 'Integer'];
sositypes['FISKERI_RESSURS'][1][0] = ['fiskeriressursområdeArt', 'String'];
sositypes['FISKERI_RESSURS'][1][1] = ['periode', 'String'];
sositypes['FMDATO'][1][1] = ['beregningsDato', 'Date'];
sositypes['FMDATO'][1][0] = ['fastmerkeEtableringsdato', 'Date'];
sositypes['FMIDNY'][1][1] = ['fastmerkeInstitusjon', 'String'];
sositypes['FMIDNY'][1][0] = ['fastmerkeKommune', 'Integer'];
sositypes['FMIDNY'][1][2] = ['fastmerkeNummer', 'String'];
sositypes['FMIDNY'][1][3] = ['indikatorFastmerkenummer', 'String'];
sositypes['FMSIGN'][1][1] = ['signalHøyde', 'Real'];
sositypes['FMSIGN'][1][0] = ['signalType', 'String'];
sositypes['FMSTATUS'][1][1] = ['typeStatus', 'Integer'];
sositypes['FMSTATUS'][1][0] = ['verifiseringsdato', 'Date'];
sositypes['FMTYPE'][1][0] = ['boltType', 'Integer'];
sositypes['FMTYPE'][1][3] = ['fastmerkeDiameter', 'Integer'];
sositypes['FMTYPE'][1][4] = ['gravertTekst', 'String'];
sositypes['FMTYPE'][1][1] = ['materialeBolt', 'Integer'];
sositypes['FMTYPE'][1][2] = ['fastmerkeUnderlag', 'Integer'];
sositypes['FORUR_GRUNN_EIENDOM'][1][1] = ['arealbrukRestriksjon', 'Integer'];
sositypes['FORUR_GRUNN_EIENDOM'][1][0] = ['matrikkelnummer', 'String'];
sositypes['GRENSE_MELLOM'][1][0] = ['førsteLand', 'String'];
sositypes['GRENSE_MELLOM'][1][1] = ['annetLand', 'String'];
sositypes['GRUNNKRETSID'][1][1] = ['grunnkretsnavn', 'String'];
sositypes['GRUNNKRETSID'][1][0] = ['grunnkretsnummer', 'Integer'];
sositypes['HAVNE_D_INFO'][1][1] = ['havnedistriktAdministrasjon', 'Integer'];
sositypes['HAVNE_D_INFO'][1][0] = ['kommune', 'Integer'];
sositypes['HOVEDMåLRUBRIKK'][1][1] = ['bredde', 'Integer'];
sositypes['HOVEDMåLRUBRIKK'][1][0] = ['lengde', 'Integer'];
sositypes['HOVEDNR'][1][1] = [' kommunenummer', 'Integer'];
sositypes['HOVEDNR'][1][0] = ['matrikkelnummer', 'String'];
sositypes['HYTTEINFORMASJON'][1][1] = ['betjeningsgrad', 'String'];
sositypes['HYTTEINFORMASJON'][1][0] = ['hytteId', 'Integer'];
sositypes['HYTTEINFORMASJON'][1][2] = ['hytteeier', 'Integer'];
sositypes['JORDTYPE'][1][0] = ['serie1', 'String'];
sositypes['JORDTYPE'][1][2] = ['serie2', 'String'];
sositypes['JORDTYPE'][1][4] = ['serie3', 'String'];
sositypes['JORDTYPE'][1][1] = ['tekstur1', 'String'];
sositypes['JORDTYPE'][1][3] = ['tekstur2', 'String'];
sositypes['JORDTYPE'][1][5] = ['tekstur3', 'String'];
sositypes['JREGMARK'][1][1] = ['potensiellSkogbonitetOmkodet', 'Integer'];
sositypes['JREGMARK'][1][0] = ['arealtilstand', 'Integer'];
sositypes['JREGMARK'][1][7] = ['jordregisterDyrkingsjord', 'String'];
sositypes['JREGMARK'][1][6] = ['jordregisterFreg', 'Integer'];
sositypes['JREGMARK'][1][5] = ['jordregisterLreg', 'String'];
sositypes['JREGMARK'][1][3] = ['jordklassifikasjon', 'Integer'];
sositypes['JREGMARK'][1][4] = ['myrklassifikasjon', 'Integer'];
sositypes['JREGMARK'][1][8] = ['jordregisterSkogtype', 'Integer'];
sositypes['JREGMARK'][1][9] = ['jordregisterSkogreisningsmark', 'Integer'];
sositypes['JREGMARK'][1][2] = ['tilleggsopplysningerSkog', 'Integer'];
sositypes['JREGTEIG'][1][2] = ['jordregisterDriftssenter', 'Integer'];
sositypes['JREGTEIG'][1][3] = ['jordregisterStatusEiendom', 'Integer'];
sositypes['JREGTEIG'][1][0] = ['matrikkelnummer', 'String'];
sositypes['JREGTEIG'][1][1] = ['jordregisterEiendomTeigNummer', 'Integer'];
sositypes['KAI_INFO'][1][1] = ['kaiDybde', 'Real'];
sositypes['KAI_INFO'][1][0] = ['kaiType', 'Integer'];
sositypes['KAI_INFO'][1][2] = ['kommunenummer', 'Integer'];
sositypes['KAMERAINFORMASJON'][1][4] = ['bildekategori', 'Integer'];
sositypes['KAMERAINFORMASJON'][1][3] = ['brennvidde', 'Real'];
sositypes['KAMERAINFORMASJON'][1][7] = ['film', 'String'];
sositypes['KAMERAINFORMASJON'][1][8] = ['kalibreringsrapport', 'String'];
sositypes['KAMERAINFORMASJON'][1][1] = ['kameratype', 'String'];
sositypes['KAMERAINFORMASJON'][1][0] = ['opptaksmetode', 'Integer'];
sositypes['KM_DAT_INFO'][1][0] = ['sefrakTiltak', 'Integer'];
sositypes['KM_DAT_INFO'][1][1] = ['tidsangivelse', 'Integer'];
sositypes['KM_DATERING'][1][0] = ['kulturminneDatering', 'String'];
sositypes['KM_DATERING'][1][1] = ['kulturminneDateringKvalitet', 'String'];
sositypes['KOMMUNALKRETS'][1][3] = ['kretsnavn', 'String'];
sositypes['KOMMUNALKRETS'][1][2] = ['kretsnummer', 'String'];
sositypes['KOMMUNALKRETS'][1][0] = ['kretstypekode', 'String'];
sositypes['KOMMUNALKRETS'][1][1] = ['kretstypenavn', 'String'];
sositypes['KOPIDATA'][1][2] = ['kopidato', 'Date'];
sositypes['KOPIDATA'][1][0] = ['områdeId', 'Integer'];
sositypes['KOPIDATA'][1][1] = ['originalDatavert', 'String'];
sositypes['KOPLING'][1][1] = ['fagområde', 'Integer'];
sositypes['KOPLING'][1][4] = ['bruksområde', 'String'];
sositypes['KOPLING'][1][2] = ['koplingskategori', 'Integer'];
sositypes['KOPLING'][1][0] = ['koplingsnavn', 'String'];
sositypes['KOPLING'][1][3] = ['koplingstype', 'String'];
sositypes['KOPLING'][1][7] = ['bildelink', 'String'];
sositypes['KOPLING'][1][5] = ['materiellkode', 'String'];
sositypes['KOPLING'][1][6] = ['verdi', 'Integer'];
sositypes['KURSLINJE_INFO'][1][0] = ['fartøyIdentifikasjon', 'String'];
sositypes['KURSLINJE_INFO'][1][1] = ['satellittkommunikasjonsId', 'String'];
sositypes['KURSLINJE_INFO'][1][3] = ['sporhastighet', 'Integer'];
sositypes['KURSLINJE_INFO'][1][2] = ['tidspunkt', 'Date'];
sositypes['KVALITET'][1][3] = ['målemetodeHøyde', 'Integer'];
sositypes['KVALITET'][1][4] = ['nøyaktighetHøyde', 'Integer'];
sositypes['KVALITET'][1][5] = ['maksimaltAvvik', 'Integer'];
sositypes['KVALITET'][1][0] = ['målemetode', 'Integer'];
sositypes['KVALITET'][1][1] = ['nøyaktighet', 'Integer'];
sositypes['KVALITET'][1][2] = ['synbarhet', 'Integer'];
sositypes['LEDNING'][1][1] = ['fagområde', 'Integer'];
sositypes['LEDNING'][1][3] = ['bruksområde', 'String'];
sositypes['LEDNING'][1][0] = ['ledningsnavn', 'String'];
sositypes['LEDNING'][1][2] = ['ledningstype', 'Integer'];
sositypes['LEDNING'][1][7] = ['leggeår', 'String'];
sositypes['LEDNING'][1][6] = ['lengde', 'Real'];
sositypes['LEDNING'][1][5] = ['materiellkode', 'String'];
sositypes['LEDNING'][1][4] = ['nettnivå', 'String'];
sositypes['LEGGEåR'][1][0] = ['alderReferanse', 'Integer'];
sositypes['LEGGEåR'][1][1] = ['årstall', 'Integer'];
sositypes['LGID'][1][7] = ['landbruksregAktiv', 'Integer'];
sositypes['LGID'][1][6] = ['landbruksregType', 'Integer'];
sositypes['LGID'][1][0] = ['matrikkelnummer', 'String'];
sositypes['MATRIKKELADRESSEID'][1][0] = ['matrikkelnummer', 'String'];
sositypes['MATRIKKELADRESSEID'][1][1] = ['undernr', 'Integer'];
sositypes['MATRIKKELNUMMER'][1][2] = ['bruksnummer', 'Integer'];
sositypes['MATRIKKELNUMMER'][1][3] = ['festenummer', 'Integer'];
sositypes['MATRIKKELNUMMER'][1][1] = ['gårdsnummer', 'Integer'];
sositypes['MATRIKKELNUMMER'][1][0] = ['matrikkelkommune', 'Integer'];
sositypes['MATRIKKELNUMMER'][1][4] = ['seksjonsnummer', 'Integer'];
sositypes['OVERLAPP'][1][0] = ['lengdeoverlapp', 'Integer'];
sositypes['OVERLAPP'][1][1] = ['sideoverlapp', 'Integer'];
sositypes['POST'][1][1] = ['poststedsnavn', 'String'];
sositypes['POST'][1][0] = ['postnummer', 'Integer'];
sositypes['REGISTRERINGSVERSJON'][1][0] = ['produkt', 'String'];
sositypes['REGISTRERINGSVERSJON'][1][1] = ['versjon', 'String'];
sositypes['RESIPIENT'][1][2] = ['fjordId', 'String'];
sositypes['RESIPIENT'][1][0] = ['resipientnavn', 'String'];
sositypes['RESIPIENT'][1][4] = ['resipienttype', 'String'];
sositypes['RESIPIENT'][1][1] = ['vassdragsnummer', 'String'];
sositypes['RESIPIENT'][1][3] = ['vatnLøpenummer', 'Integer'];
sositypes['RETNING'][1][1] = ['retningsenhet', 'Integer'];
sositypes['RETNING'][1][2] = ['retningsreferanse', 'Integer'];
sositypes['RETNING'][1][0] = ['retningsverdi', 'Real'];
sositypes['RØR_DIMENSJON'][1][1] = ['lengdeenhet', 'String'];
sositypes['RØR_DIMENSJON'][1][0] = ['måltall', 'Real'];
sositypes['SAK'][1][3] = ['vedtaksmyndighet', 'String'];
sositypes['SAK'][1][0] = ['saksnummer', 'Integer'];
sositypes['SAK'][1][2] = ['utvalgssaksnummer', 'Integer'];
sositypes['SAK'][1][1] = ['vedtaksdato', 'Date'];
sositypes['SEFRAK_ID'][1][2] = ['husLøpenr', 'Integer'];
sositypes['SEFRAK_ID'][1][1] = ['registreringKretsnr', 'Integer'];
sositypes['SEFRAK_ID'][1][0] = ['SEFRAKkommune', 'Integer'];
sositypes['SEFRAKFUNKSJON'][1][0] = ['sefrakFunksjonskode', 'Integer'];
sositypes['SEFRAKFUNKSJON'][1][1] = ['sefrakFunksjonsstatus', 'String'];
sositypes['SENTRUMSSONEID'][1][1] = ['sentrumssonenavn', 'String'];
sositypes['SENTRUMSSONEID'][1][0] = ['sentrumssonenummer', 'Integer'];
sositypes['SERV'][1][2] = ['informasjon', 'String'];
sositypes['SERV'][1][0] = ['matrikkelnummer', 'String'];
sositypes['SERV'][1][1] = ['servituttType', 'String'];
sositypes['SKRETSID'][1][1] = ['skolekretsnavn', 'String'];
sositypes['SKRETSID'][1][0] = ['skolekretsnummer', 'Integer'];
sositypes['SP_ADM'][1][0] = ['skogbrplanAdmDatoEndring', 'Date'];
sositypes['SP_ADM'][1][1] = ['skogbrplanAdmDatoEtablering', 'Date'];
sositypes['SP_AKLASS'][1][0] = ['skogbrplanKlassAktueltTreslag', 'Integer'];
sositypes['SP_AKLASS'][1][1] = ['skogbrplanKlassAktSnittBon', 'Integer'];
sositypes['SP_AKLASS'][1][3] = ['skogbrplanKlassImpProsent', 'Integer'];
sositypes['SP_AKLASS'][1][2] = ['skogbrplanKlassImpType', 'Integer'];
sositypes['SP_AKLASS'][1][4] = ['skogbrplanKlassPotTreslag', 'Integer'];
sositypes['SP_AKLASS'][1][5] = ['skogbrplanKlassPotSnittBon', 'Integer'];
sositypes['SP_BESTAND'][1][1] = ['skogbrplanBestandDelNr', 'Integer'];
sositypes['SP_BESTAND'][1][0] = ['skogbrplanBestandNr', 'Integer'];
sositypes['SP_BSKRIV'][1][2] = ['skogbrplanBeskrivBestandAlder', 'Integer'];
sositypes['SP_BSKRIV'][1][3] = ['skogbrplanBeskrivBestandDaa', 'Real'];
sositypes['SP_BSKRIV'][1][6] = ['skogbrplanBeskrivBestSnittDiam', 'Integer'];
sositypes['SP_BSKRIV'][1][4] = ['skogbrplanBeskrivBestandSnittM2', 'Integer'];
sositypes['SP_BSKRIV'][1][5] = ['skogbrplanBeskrivBestandSnittH', 'Real'];
sositypes['SP_BSKRIV'][1][7] = ['skogbrplanBeskrivBarHøydehkl2', 'Integer'];
sositypes['SP_BSKRIV'][1][0] = ['skogbrplanBeskrivHogstklasse', 'Integer'];
sositypes['SP_BSKRIV'][1][8] = ['skogbrplanBeskrivLauvHøydehkl2', 'Integer'];
sositypes['SP_BSKRIV'][1][9] = ['skogbrplanBeskrivSjiktning', 'Integer'];
sositypes['SP_BSKRIV'][1][1] = ['skogbrplanBeskrivSkogtype', 'Integer'];
sositypes['SP_BSKRIV'][1][10] = ['skogbrplanBeskrivSunnhet', 'Integer'];
sositypes['SP_BSKRIV'][1][11] = ['skogbrplanBeskrivTreERegulering', 'Integer'];
sositypes['SP_BSKRIV'][1][12] = ['skogbrplanBeskrivTreFRegulering', 'Integer'];
sositypes['SP_FLBRELEM'][1][0] = ['skogbrplanFlerKoderElementtype', 'Integer'];
sositypes['SP_FLBRELEM'][1][1] = ['skogbrplanFlerKoderArealProsent', 'Integer'];
sositypes['SP_FLBRELEM'][1][2] = ['skogbrplanFlerKoderArealDaa', 'Integer'];
sositypes['SP_FLBRELEM'][1][3] = ['skogbrplanFlerKoderSpesBehPros', 'Integer'];
sositypes['SP_FLBRELEM'][1][4] = ['skogbrplanFlerKoderSpesBehDaa', 'Integer'];
sositypes['SP_GRLVOL'][1][3] = ['skogbrplanGrunnlagVolumDaaFelt', 'Real'];
sositypes['SP_GRLVOL'][1][4] = ['skogbrplanGrunnlagVolumBestFelt', 'Integer'];
sositypes['SP_GRLVOL'][1][0] = ['skogbrplanGrunnlagBerType', 'Integer'];
sositypes['SP_GRLVOL'][1][2] = ['skogbrplanGrunnlagHovedgruppe', 'Integer'];
sositypes['SP_GRLVOL'][1][6] = ['skogbrplanGrunnlagRegion', 'Integer'];
sositypes['SP_GRLVOL'][1][5] = ['skogbrplanGrunnlagSvinnProsent', 'Integer'];
sositypes['SP_GRLVOL'][1][1] = ['skogbrplanGrunnlagTaksttype', 'Integer'];
sositypes['SP_GRLVOL'][1][7] = ['skogbrplanGrunnlagTilvekstkorr', 'Integer'];
sositypes['SP_TEIG'][1][3] = ['matrikkelnummer', 'String'];
sositypes['SP_TEIG'][1][2] = ['skogbrplanTeigGrend', 'Integer'];
sositypes['SP_TEIG'][1][0] = ['skogbrplanTeigNr', 'Integer'];
sositypes['SP_TEIG'][1][1] = ['skogbrplanTeigNavn', 'String'];
sositypes['SP_TERKLASS'][1][0] = ['skogbrplanTerrengBæreevneBestand', 'Integer'];
sositypes['SP_TERKLASS'][1][1] = ['skogbrplanTerrengBestandBratthet', 'Integer'];
sositypes['SP_TERKLASS'][1][2] = ['skogbrplanTerrengLiLengde', 'Integer'];
sositypes['SP_TERKLASS'][1][3] = ['skogbrplanTerrengMinTranspUtst', 'Integer'];
sositypes['SP_TERKLASS'][1][4] = ['skogbrplanTerrengJevnhet', 'Integer'];
sositypes['SP_TETTHOYD'][1][0] = ['skogbrplanTetthetGrunnflatesum', 'Integer'];
sositypes['SP_TETTHOYD'][1][1] = ['skogbrplanTetthetMHøyde', 'Integer'];
sositypes['SP_TILTAK'][1][3] = ['skogbrplanTiltakProritet', 'Integer'];
sositypes['SP_TILTAK'][1][1] = ['skogbrplanTiltakProsent', 'Integer'];
sositypes['SP_TILTAK'][1][4] = ['skogbrplanTiltakAreal', 'Real'];
sositypes['SP_TILTAK'][1][0] = ['skogbrplanTiltakBestand', 'Integer'];
sositypes['SP_TILTAK'][1][2] = ['skogbrplanTiltakÅr', 'Integer'];
sositypes['SP_TILVVOL'][1][0] = ['skogbrplanTilvekstBeregnDaa', 'Real'];
sositypes['SP_TILVVOL'][1][1] = ['skogbrplanTilvekstBeregnProsent', 'Real'];
sositypes['SP_TILVVOL'][1][2] = ['skogbrplanTilvekstBeregnM3', 'Real'];
sositypes['SP_TILVVOL'][1][3] = ['skogbrplanTilvekstVolumBestand', 'Integer'];
sositypes['SP_TRESL'][1][4] = ['skogbrplanTreslagAntTreDaaEReg', 'Integer'];
sositypes['SP_TRESL'][1][3] = ['skogbrplanTreslagAntTreDaaFReg', 'Integer'];
sositypes['SP_TRESL'][1][0] = ['skogbrplanTreslag', 'Integer'];
sositypes['SP_TRESL'][1][1] = ['skogbrplanTreslagHøyde', 'Integer'];
sositypes['SP_TRESL'][1][2] = ['skogbrplanTreslagProsent', 'Integer'];
sositypes['SP_TRESL'][1][5] = ['skogbrplanTreslagKorrVolumUBark', 'Integer'];
sositypes['SP_TRESL'][1][7] = ['skogbrplanTreslagSalgsvolumUBark', 'Integer'];
sositypes['SP_TRESL'][1][6] = ['skogbrplanTreslagUkorrVolumUBark', 'Integer'];
sositypes['TETTSTEDID'][1][1] = ['tettstednavn', 'String'];
sositypes['TETTSTEDID'][1][0] = ['tettstednummer', 'Integer'];
sositypes['UNIVERSELLUTFORMING'][1][2] = ['informasjon', 'String'];
sositypes['UNIVERSELLUTFORMING'][1][0] = ['tilgjengelighetsvurdering', 'String'];
sositypes['UNIVERSELLUTFORMING'][1][1] = ['universellutformingFasilitet', 'String'];
sositypes['UTNYTT'][1][1] = ['utnyttingstall', 'Real'];
sositypes['UTNYTT'][1][0] = ['utnyttingstype', 'Integer'];
sositypes['UTSLIPP'][1][0] = ['komponent', 'String'];
sositypes['UTSLIPP'][1][1] = ['massestørrelse', 'String'];
sositypes['UTSLIPP'][1][2] = ['utslippType', 'String'];
sositypes['UTV_TILL_PART'][1][1] = ['petroleumsandel', 'Real'];
sositypes['UTV_TILL_PART'][1][0] = ['petroleumspartnere', 'String'];
sositypes['VERN'][1][0] = ['vernelov', 'String'];
sositypes['VERN'][1][1] = ['verneparagraf', 'String'];
sositypes['VERN'][1][3] = ['vernedato', 'Date'];
sositypes['VERN'][1][2] = ['vernetype', 'String'];
sositypes['VKRETS'][1][1] = ['valgkretsnavn', 'String'];
sositypes['VKRETS'][1][0] = ['valgkretsnummer', 'Integer'];
sositypes['VNR'][1][0] = ['vegkategori', 'String'];
sositypes['VNR'][1][2] = ['vegnummer', 'Integer'];
sositypes['VNR'][1][1] = ['vegstatus', 'String'];
sositypes['VPA'][1][0] = ['hovedParsell', 'Integer'];
sositypes['VPA'][1][1] = ['veglenkeMeterFra', 'Integer'];
sositypes['VPA'][1][2] = ['veglenkeMeterTil', 'Integer'];

module.exports = sositypes;

},{}],17:[function(require,module,exports){
'use strict';

var types = require('./datatypes');

function getLongname(key) { // not tested
    if (types && types[key]) {
        var type = types[key];
        return !!type && type[0] || key; //ambiguity ahoy!
    }
    return key;
}

module.exports = getLongname;

},{"./datatypes":16}],18:[function(require,module,exports){
'use strict';

var geosysMap = {
    2: {'srid': 'EPSG:4326', def: '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs '}
};

var koordsysMap = {
    1: {'srid': 'EPSG:27391', 'def': '+proj=tmerc +lat_0=58 +lon_0=-4.666666666666667 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs'},
    2: {'srid': 'EPSG:27392', 'def': '+proj=tmerc +lat_0=58 +lon_0=-2.333333333333333 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs'},
    3: {'srid': 'EPSG:27393', 'def': '+proj=tmerc +lat_0=58 +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs'},
    4: {'srid': 'EPSG:27394', 'def': '+proj=tmerc +lat_0=58 +lon_0=2.5 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs'},
    5: {'srid': 'EPSG:27395', 'def': '+proj=tmerc +lat_0=58 +lon_0=6.166666666666667 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs'},
    6: {'srid': 'EPSG:27396', 'def': '+proj=tmerc +lat_0=58 +lon_0=10.16666666666667 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs'},
    7: {'srid': 'EPSG:27397', 'def': '+proj=tmerc +lat_0=58 +lon_0=14.16666666666667 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs'},
    8: {'srid': 'EPSG:27398', 'def': '+proj=tmerc +lat_0=58 +lon_0=18.33333333333333 +k=1 +x_0=0 +y_0=0 +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +pm=oslo +units=m +no_defs'},
    9: {'srid': 'EPSG:4273', 'def': '+proj=longlat +a=6377492.018 +b=6356173.508712696 +towgs84=278.3,93,474.5,7.889,0.05,-6.61,6.21 +no_defs'},
    21: {'srid': 'EPSG:32631', 'def': '+proj=utm +zone=31 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'},
    22: {'srid': 'EPSG:32632', 'def': '+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'},
    23: {'srid': 'EPSG:32633', 'def': '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'},
    24: {'srid': 'EPSG:32634', 'def': '+proj=utm +zone=34 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'},
    25: {'srid': 'EPSG:32635', 'def': '+proj=utm +zone=35 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'},
    26: {'srid': 'EPSG:32636', 'def': '+proj=utm +zone=35 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'},
    31: {'srid': 'EPSG:23031', def: '+proj=utm +zone=31 +ellps=intl +units=m +no_defs'},
    32: {'srid': 'EPSG:23032', def: '+proj=utm +zone=32 +ellps=intl +units=m +no_defs'},
    33: {'srid': 'EPSG:23033', def: '+proj=utm +zone=33 +ellps=intl +units=m +no_defs'},
    34: {'srid': 'EPSG:23034', def: '+proj=utm +zone=34 +ellps=intl +units=m +no_defs'},
    35: {'srid': 'EPSG:23035', def: '+proj=utm +zone=35 +ellps=intl +units=m +no_defs'},
    36: {'srid': 'EPSG:23036', def: '+proj=utm +zone=36 +ellps=intl +units=m +no_defs'},
    50: {'srid': 'EPSG:4230', def: '+proj=longlat +ellps=intl +no_defs'},
    72: {'srid': 'EPSG:4322', def: '+proj=longlat +ellps=WGS72 +no_defs '},
    84: {'srid': 'EPSG:4326', def: '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs '},
    87: {'srid': 'EPSG:4231', 'def': '+proj=longlat +ellps=intl +no_defs '}

    //41 Lokalnett, uspes.
    //42 Lokalnett, uspes.
    //51 NGO-56A (Møre) NGO1948 Gauss-Krüger
    //52 NGO-56B (Møre) NGO1948 Gauss-Krüger
    //53 NGO-64A (Møre) NGO1948 Gauss-Krüger
    //54 NGO-64B (Møre) NGO1948 Gauss-Krüger
    //99 Egendefinert *
    //101 Lokalnett, Oslo
    //102 Lokalnett, Bærum
    //103 Lokalnett, Asker
    //104 Lokalnett, Lillehammer
    //105 Lokalnett,Drammen
    //106 Lokalnett, Bergen / Askøy
};

module.exports = {
    geosysMap: geosysMap,
    koordsysMap: koordsysMap
};

},{}],19:[function(require,module,exports){
'use strict';
var _ = require('underscore');
var parseTree = require('./parseTree');
var getLongname = require('./getLongname');
var datatypes = require('./datatypes');
var setDataType = require('./setDataType');


function parseSubdict(lines) {
    return _.reduce(parseTree(lines, 3), function (subdict, value, key) {
        subdict[getLongname(key)] = setDataType(key, value[0]);
        return subdict;
    }, {});
}


var parseFromLevel2 = function (data) {
    return _.reduce(parseTree(data, 2), function (dict, lines, key) {
        if (lines.length) {
            if (lines[0][0] === '.') {
                dict[getLongname(key)] = parseSubdict(lines);
            } else if (lines.length > 1) {
                dict[getLongname(key)] = _.map(lines, function (value) {
                    return setDataType(key, value);
                });
            } else {
                dict[getLongname(key)] = setDataType(key, lines[0]);
            }
        }
        return dict;
    }, {});
};
module.exports = parseFromLevel2;

},{"./datatypes":16,"./getLongname":17,"./parseTree":20,"./setDataType":22,"underscore":1}],20:[function(require,module,exports){
'use strict';

var _ = require('underscore');

function isEmpty(line) {
    return line === '';
}

function isParent(line, parentLevel) {
    return (countStartingDots(line) === parentLevel);
}

function cleanupLine(line) {
    if (line.indexOf('!') !== -1) {
        line = line.substring(0, line.indexOf('!'));
    }
    return line.replace(/\s+$/, '');
}

function getKeyFromLine(line) {
    if (line.indexOf(':') !== -1) {
        return _.first(line.split(':')).trim();
    }
    return _.first(line.split(' ')).trim();
}

function getNumDots(num) {
    return new Array(num + 1).join('.');
}

function getKey(line, parentLevel) {
    return cleanupLine(
        getKeyFromLine(
            line.replace(getNumDots(parentLevel), '')
        )
    );
}

function countStartingDots(str) {
    var differs = _.find(str, function (character) {return (character !== '.'); });
    if (differs) {
        str = str.substr(0, _.indexOf(str, differs));
    }
    if (_.every(str, function (character) { return (character === '.'); })) {
        return str.length;
    }
    return 0;
}

function getValues(line) {
    return _.rest(line.split(' ')).join(' ').trim();
}

function pushOrCreate(dict, val) {
    if (!_.isArray(dict.objects[dict.key])) {
        dict.objects[dict.key] = [];
    }
    dict.objects[dict.key].push(val);
}

function parseTree(data, parentLevel) {
    return _.reduce(_.reject(data, isEmpty), function (res, line) {
        line = cleanupLine(line);
        if (isParent(line, parentLevel)) {
            res.key = getKey(line, parentLevel);
            line = getValues(line);
        }
        if (!isEmpty(line)) {
            pushOrCreate(res, line);
        }
        return res;
    }, {objects: {}}).objects;
}

module.exports = parseTree;

},{"underscore":1}],21:[function(require,module,exports){
'use strict';

function round(number, numDecimals) {
    var pow = Math.pow(10, numDecimals);
    return Math.round(number * pow) / pow;
}

module.exports = round;

},{}],22:[function(require,module,exports){
'use strict';
var _ = require('underscore');
var datatypes = require('./datatypes');

function setDataType(key, value) {

    if (!datatypes) {
        return value;
    }

    var type = _.isArray(key) ? key : datatypes[key];
    if (type) {
        if (!_.isObject(type[0])) {
            if (type[1] === 'Integer') {
                return parseInt(value, 10);
            } else if (type[1] === 'Real') {
                return parseFloat(value);
            } else if (type[1] === 'Date') {
                if (value.length === 8) {
                    return new Date(
                        parseInt(value.substring(0, 4), 10),
                        parseInt(value.substring(4, 6), 10) - 1,
                        parseInt(value.substring(6, 8), 10)
                    );
                } else if (value.length === 14) {
                    return new Date(
                        parseInt(value.substring(0, 4), 10),
                        parseInt(value.substring(4, 6), 10) - 1,
                        parseInt(value.substring(6, 8), 10),
                        parseInt(value.substring(8, 10), 10),
                        parseInt(value.substring(10, 12), 10),
                        parseInt(value.substring(12, 14), 10)
                    );
                }
            } else if (_.isString(type[1])) {
                if (value[0] === '"' || value[0] === '\'') {
                    return value.substring(1, value.length - 1);
                }
                return value;
            }
        }
    }
    return value;
}

module.exports = setDataType;

},{"./datatypes":16,"underscore":1}],23:[function(require,module,exports){
'use strict';
var _ = require('underscore');
var setDataType = require('./setDataType');
var datatypes = require('./datatypes');

function parseSpecial(key, subfields) {
    return function (data) {
        if (!data) {
            return null;
        }
        if (_.isObject(data)) {
            return data; // extended subfields
        }
        if (_.isString(data)) {
            return _.reduce(data.match(/"[^"]*"|'[^']*'|\S+/g), function (res, chunk, i) {
                res[subfields[i][0]] = setDataType(subfields[i], chunk);
                return res;
            }, {});
        }
    };
}

var specialAttributes = (function () {
    if (!!datatypes) {
        return _.reduce(datatypes, function (attrs, type, key) {
            if (_.isObject(type[1])) { // true for complex datatypes
                attrs[type[0]] = {name: type[0], createFunction: parseSpecial(key, type[1])};
            }
            return attrs;
        }, {});
    }
}());

module.exports = specialAttributes;

},{"./datatypes":16,"./setDataType":22,"underscore":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvdW5kZXJzY29yZS91bmRlcnNjb3JlLmpzIiwic3JjL2Jyb3dzZXIuanMiLCJzcmMvY2xhc3MvQmFzZS5qcyIsInNyYy9kdW1wZXJzL1Nvc2kyR2VvSlNPTi5qcyIsInNyYy9kdW1wZXJzL1Nvc2kyVG9wb0pTT04uanMiLCJzcmMvZHVtcGVycy93cml0ZVBvaW50LmpzIiwic3JjL2dlb21ldHJ5L0xpbmVTdHJpbmcuanMiLCJzcmMvZ2VvbWV0cnkvTGluZVN0cmluZ0Zyb21BcmMuanMiLCJzcmMvZ2VvbWV0cnkvUG9pbnQuanMiLCJzcmMvZ2VvbWV0cnkvUG9seWdvbi5qcyIsInNyYy9wYXJzZXIuanMiLCJzcmMvc29zaS5qcyIsInNyYy90eXBlcy9GZWF0dXJlLmpzIiwic3JjL3R5cGVzL0ZlYXR1cmVzLmpzIiwic3JjL3R5cGVzL0hlYWQuanMiLCJzcmMvdXRpbC9kYXRhdHlwZXMuanMiLCJzcmMvdXRpbC9nZXRMb25nbmFtZS5qcyIsInNyYy91dGlsL21hcHBpbmdzLmpzIiwic3JjL3V0aWwvcGFyc2VGcm9tTGV2ZWwyLmpzIiwic3JjL3V0aWwvcGFyc2VUcmVlLmpzIiwic3JjL3V0aWwvcm91bmQuanMiLCJzcmMvdXRpbC9zZXREYXRhVHlwZS5qcyIsInNyYy91dGlsL3NwZWNpYWxBdHRyaWJ1dGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNWdEQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyAgICAgVW5kZXJzY29yZS5qcyAxLjguM1xuLy8gICAgIGh0dHA6Ly91bmRlcnNjb3JlanMub3JnXG4vLyAgICAgKGMpIDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuLy8gICAgIFVuZGVyc2NvcmUgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cbihmdW5jdGlvbigpIHtcblxuICAvLyBCYXNlbGluZSBzZXR1cFxuICAvLyAtLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEVzdGFibGlzaCB0aGUgcm9vdCBvYmplY3QsIGB3aW5kb3dgIGluIHRoZSBicm93c2VyLCBvciBgZXhwb3J0c2Agb24gdGhlIHNlcnZlci5cbiAgdmFyIHJvb3QgPSB0aGlzO1xuXG4gIC8vIFNhdmUgdGhlIHByZXZpb3VzIHZhbHVlIG9mIHRoZSBgX2AgdmFyaWFibGUuXG4gIHZhciBwcmV2aW91c1VuZGVyc2NvcmUgPSByb290Ll87XG5cbiAgLy8gU2F2ZSBieXRlcyBpbiB0aGUgbWluaWZpZWQgKGJ1dCBub3QgZ3ppcHBlZCkgdmVyc2lvbjpcbiAgdmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsIE9ialByb3RvID0gT2JqZWN0LnByb3RvdHlwZSwgRnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4gIC8vIENyZWF0ZSBxdWljayByZWZlcmVuY2UgdmFyaWFibGVzIGZvciBzcGVlZCBhY2Nlc3MgdG8gY29yZSBwcm90b3R5cGVzLlxuICB2YXJcbiAgICBwdXNoICAgICAgICAgICAgID0gQXJyYXlQcm90by5wdXNoLFxuICAgIHNsaWNlICAgICAgICAgICAgPSBBcnJheVByb3RvLnNsaWNlLFxuICAgIHRvU3RyaW5nICAgICAgICAgPSBPYmpQcm90by50b1N0cmluZyxcbiAgICBoYXNPd25Qcm9wZXJ0eSAgID0gT2JqUHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbiAgLy8gQWxsICoqRUNNQVNjcmlwdCA1KiogbmF0aXZlIGZ1bmN0aW9uIGltcGxlbWVudGF0aW9ucyB0aGF0IHdlIGhvcGUgdG8gdXNlXG4gIC8vIGFyZSBkZWNsYXJlZCBoZXJlLlxuICB2YXJcbiAgICBuYXRpdmVJc0FycmF5ICAgICAgPSBBcnJheS5pc0FycmF5LFxuICAgIG5hdGl2ZUtleXMgICAgICAgICA9IE9iamVjdC5rZXlzLFxuICAgIG5hdGl2ZUJpbmQgICAgICAgICA9IEZ1bmNQcm90by5iaW5kLFxuICAgIG5hdGl2ZUNyZWF0ZSAgICAgICA9IE9iamVjdC5jcmVhdGU7XG5cbiAgLy8gTmFrZWQgZnVuY3Rpb24gcmVmZXJlbmNlIGZvciBzdXJyb2dhdGUtcHJvdG90eXBlLXN3YXBwaW5nLlxuICB2YXIgQ3RvciA9IGZ1bmN0aW9uKCl7fTtcblxuICAvLyBDcmVhdGUgYSBzYWZlIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yIHVzZSBiZWxvdy5cbiAgdmFyIF8gPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgXykgcmV0dXJuIG9iajtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgXykpIHJldHVybiBuZXcgXyhvYmopO1xuICAgIHRoaXMuX3dyYXBwZWQgPSBvYmo7XG4gIH07XG5cbiAgLy8gRXhwb3J0IHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgKipOb2RlLmpzKiosIHdpdGhcbiAgLy8gYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgZm9yIHRoZSBvbGQgYHJlcXVpcmUoKWAgQVBJLiBJZiB3ZSdyZSBpblxuICAvLyB0aGUgYnJvd3NlciwgYWRkIGBfYCBhcyBhIGdsb2JhbCBvYmplY3QuXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IF87XG4gICAgfVxuICAgIGV4cG9ydHMuXyA9IF87XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5fID0gXztcbiAgfVxuXG4gIC8vIEN1cnJlbnQgdmVyc2lvbi5cbiAgXy5WRVJTSU9OID0gJzEuOC4zJztcblxuICAvLyBJbnRlcm5hbCBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gZWZmaWNpZW50IChmb3IgY3VycmVudCBlbmdpbmVzKSB2ZXJzaW9uXG4gIC8vIG9mIHRoZSBwYXNzZWQtaW4gY2FsbGJhY2ssIHRvIGJlIHJlcGVhdGVkbHkgYXBwbGllZCBpbiBvdGhlciBVbmRlcnNjb3JlXG4gIC8vIGZ1bmN0aW9ucy5cbiAgdmFyIG9wdGltaXplQ2IgPSBmdW5jdGlvbihmdW5jLCBjb250ZXh0LCBhcmdDb3VudCkge1xuICAgIGlmIChjb250ZXh0ID09PSB2b2lkIDApIHJldHVybiBmdW5jO1xuICAgIHN3aXRjaCAoYXJnQ291bnQgPT0gbnVsbCA/IDMgOiBhcmdDb3VudCkge1xuICAgICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSk7XG4gICAgICB9O1xuICAgICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24odmFsdWUsIG90aGVyKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgdmFsdWUsIG90aGVyKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgfTtcbiAgICAgIGNhc2UgNDogcmV0dXJuIGZ1bmN0aW9uKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCBhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBBIG1vc3RseS1pbnRlcm5hbCBmdW5jdGlvbiB0byBnZW5lcmF0ZSBjYWxsYmFja3MgdGhhdCBjYW4gYmUgYXBwbGllZFxuICAvLyB0byBlYWNoIGVsZW1lbnQgaW4gYSBjb2xsZWN0aW9uLCByZXR1cm5pbmcgdGhlIGRlc2lyZWQgcmVzdWx0IOKAlCBlaXRoZXJcbiAgLy8gaWRlbnRpdHksIGFuIGFyYml0cmFyeSBjYWxsYmFjaywgYSBwcm9wZXJ0eSBtYXRjaGVyLCBvciBhIHByb3BlcnR5IGFjY2Vzc29yLlxuICB2YXIgY2IgPSBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgYXJnQ291bnQpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIF8uaWRlbnRpdHk7XG4gICAgaWYgKF8uaXNGdW5jdGlvbih2YWx1ZSkpIHJldHVybiBvcHRpbWl6ZUNiKHZhbHVlLCBjb250ZXh0LCBhcmdDb3VudCk7XG4gICAgaWYgKF8uaXNPYmplY3QodmFsdWUpKSByZXR1cm4gXy5tYXRjaGVyKHZhbHVlKTtcbiAgICByZXR1cm4gXy5wcm9wZXJ0eSh2YWx1ZSk7XG4gIH07XG4gIF8uaXRlcmF0ZWUgPSBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBjYih2YWx1ZSwgY29udGV4dCwgSW5maW5pdHkpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhc3NpZ25lciBmdW5jdGlvbnMuXG4gIHZhciBjcmVhdGVBc3NpZ25lciA9IGZ1bmN0aW9uKGtleXNGdW5jLCB1bmRlZmluZWRPbmx5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICBpZiAobGVuZ3RoIDwgMiB8fCBvYmogPT0gbnVsbCkgcmV0dXJuIG9iajtcbiAgICAgIGZvciAodmFyIGluZGV4ID0gMTsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpbmRleF0sXG4gICAgICAgICAgICBrZXlzID0ga2V5c0Z1bmMoc291cmNlKSxcbiAgICAgICAgICAgIGwgPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICBpZiAoIXVuZGVmaW5lZE9ubHkgfHwgb2JqW2tleV0gPT09IHZvaWQgMCkgb2JqW2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhIG5ldyBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIGFub3RoZXIuXG4gIHZhciBiYXNlQ3JlYXRlID0gZnVuY3Rpb24ocHJvdG90eXBlKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KHByb3RvdHlwZSkpIHJldHVybiB7fTtcbiAgICBpZiAobmF0aXZlQ3JlYXRlKSByZXR1cm4gbmF0aXZlQ3JlYXRlKHByb3RvdHlwZSk7XG4gICAgQ3Rvci5wcm90b3R5cGUgPSBwcm90b3R5cGU7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBDdG9yO1xuICAgIEN0b3IucHJvdG90eXBlID0gbnVsbDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIHZhciBwcm9wZXJ0eSA9IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT0gbnVsbCA/IHZvaWQgMCA6IG9ialtrZXldO1xuICAgIH07XG4gIH07XG5cbiAgLy8gSGVscGVyIGZvciBjb2xsZWN0aW9uIG1ldGhvZHMgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYSBjb2xsZWN0aW9uXG4gIC8vIHNob3VsZCBiZSBpdGVyYXRlZCBhcyBhbiBhcnJheSBvciBhcyBhbiBvYmplY3RcbiAgLy8gUmVsYXRlZDogaHR0cDovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGhcbiAgLy8gQXZvaWRzIGEgdmVyeSBuYXN0eSBpT1MgOCBKSVQgYnVnIG9uIEFSTS02NC4gIzIwOTRcbiAgdmFyIE1BWF9BUlJBWV9JTkRFWCA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG4gIHZhciBnZXRMZW5ndGggPSBwcm9wZXJ0eSgnbGVuZ3RoJyk7XG4gIHZhciBpc0FycmF5TGlrZSA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICB2YXIgbGVuZ3RoID0gZ2V0TGVuZ3RoKGNvbGxlY3Rpb24pO1xuICAgIHJldHVybiB0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInICYmIGxlbmd0aCA+PSAwICYmIGxlbmd0aCA8PSBNQVhfQVJSQVlfSU5ERVg7XG4gIH07XG5cbiAgLy8gQ29sbGVjdGlvbiBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBUaGUgY29ybmVyc3RvbmUsIGFuIGBlYWNoYCBpbXBsZW1lbnRhdGlvbiwgYWthIGBmb3JFYWNoYC5cbiAgLy8gSGFuZGxlcyByYXcgb2JqZWN0cyBpbiBhZGRpdGlvbiB0byBhcnJheS1saWtlcy4gVHJlYXRzIGFsbFxuICAvLyBzcGFyc2UgYXJyYXktbGlrZXMgYXMgaWYgdGhleSB3ZXJlIGRlbnNlLlxuICBfLmVhY2ggPSBfLmZvckVhY2ggPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIgaSwgbGVuZ3RoO1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopKSB7XG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlcmF0ZWUob2JqW2ldLCBpLCBvYmopO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVyYXRlZShvYmpba2V5c1tpXV0sIGtleXNbaV0sIG9iaik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRlZSB0byBlYWNoIGVsZW1lbnQuXG4gIF8ubWFwID0gXy5jb2xsZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoLFxuICAgICAgICByZXN1bHRzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgcmVzdWx0c1tpbmRleF0gPSBpdGVyYXRlZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaik7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIHJlZHVjaW5nIGZ1bmN0aW9uIGl0ZXJhdGluZyBsZWZ0IG9yIHJpZ2h0LlxuICBmdW5jdGlvbiBjcmVhdGVSZWR1Y2UoZGlyKSB7XG4gICAgLy8gT3B0aW1pemVkIGl0ZXJhdG9yIGZ1bmN0aW9uIGFzIHVzaW5nIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAvLyBpbiB0aGUgbWFpbiBmdW5jdGlvbiB3aWxsIGRlb3B0aW1pemUgdGhlLCBzZWUgIzE5OTEuXG4gICAgZnVuY3Rpb24gaXRlcmF0b3Iob2JqLCBpdGVyYXRlZSwgbWVtbywga2V5cywgaW5kZXgsIGxlbmd0aCkge1xuICAgICAgZm9yICg7IGluZGV4ID49IDAgJiYgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IGRpcikge1xuICAgICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgICBtZW1vID0gaXRlcmF0ZWUobWVtbywgb2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIG1lbW8sIGNvbnRleHQpIHtcbiAgICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihpdGVyYXRlZSwgY29udGV4dCwgNCk7XG4gICAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoLFxuICAgICAgICAgIGluZGV4ID0gZGlyID4gMCA/IDAgOiBsZW5ndGggLSAxO1xuICAgICAgLy8gRGV0ZXJtaW5lIHRoZSBpbml0aWFsIHZhbHVlIGlmIG5vbmUgaXMgcHJvdmlkZWQuXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgbWVtbyA9IG9ialtrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleF07XG4gICAgICAgIGluZGV4ICs9IGRpcjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVyYXRvcihvYmosIGl0ZXJhdGVlLCBtZW1vLCBrZXlzLCBpbmRleCwgbGVuZ3RoKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gKipSZWR1Y2UqKiBidWlsZHMgdXAgYSBzaW5nbGUgcmVzdWx0IGZyb20gYSBsaXN0IG9mIHZhbHVlcywgYWthIGBpbmplY3RgLFxuICAvLyBvciBgZm9sZGxgLlxuICBfLnJlZHVjZSA9IF8uZm9sZGwgPSBfLmluamVjdCA9IGNyZWF0ZVJlZHVjZSgxKTtcblxuICAvLyBUaGUgcmlnaHQtYXNzb2NpYXRpdmUgdmVyc2lvbiBvZiByZWR1Y2UsIGFsc28ga25vd24gYXMgYGZvbGRyYC5cbiAgXy5yZWR1Y2VSaWdodCA9IF8uZm9sZHIgPSBjcmVhdGVSZWR1Y2UoLTEpO1xuXG4gIC8vIFJldHVybiB0aGUgZmlyc3QgdmFsdWUgd2hpY2ggcGFzc2VzIGEgdHJ1dGggdGVzdC4gQWxpYXNlZCBhcyBgZGV0ZWN0YC5cbiAgXy5maW5kID0gXy5kZXRlY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBrZXk7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikpIHtcbiAgICAgIGtleSA9IF8uZmluZEluZGV4KG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAga2V5ID0gXy5maW5kS2V5KG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB9XG4gICAgaWYgKGtleSAhPT0gdm9pZCAwICYmIGtleSAhPT0gLTEpIHJldHVybiBvYmpba2V5XTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyB0aGF0IHBhc3MgYSB0cnV0aCB0ZXN0LlxuICAvLyBBbGlhc2VkIGFzIGBzZWxlY3RgLlxuICBfLmZpbHRlciA9IF8uc2VsZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHMucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgZm9yIHdoaWNoIGEgdHJ1dGggdGVzdCBmYWlscy5cbiAgXy5yZWplY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBfLmZpbHRlcihvYmosIF8ubmVnYXRlKGNiKHByZWRpY2F0ZSkpLCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgd2hldGhlciBhbGwgb2YgdGhlIGVsZW1lbnRzIG1hdGNoIGEgdHJ1dGggdGVzdC5cbiAgLy8gQWxpYXNlZCBhcyBgYWxsYC5cbiAgXy5ldmVyeSA9IF8uYWxsID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICBpZiAoIXByZWRpY2F0ZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaikpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIGF0IGxlYXN0IG9uZSBlbGVtZW50IGluIHRoZSBvYmplY3QgbWF0Y2hlcyBhIHRydXRoIHRlc3QuXG4gIC8vIEFsaWFzZWQgYXMgYGFueWAuXG4gIF8uc29tZSA9IF8uYW55ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICBpZiAocHJlZGljYXRlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKSkgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIGFycmF5IG9yIG9iamVjdCBjb250YWlucyBhIGdpdmVuIGl0ZW0gKHVzaW5nIGA9PT1gKS5cbiAgLy8gQWxpYXNlZCBhcyBgaW5jbHVkZXNgIGFuZCBgaW5jbHVkZWAuXG4gIF8uY29udGFpbnMgPSBfLmluY2x1ZGVzID0gXy5pbmNsdWRlID0gZnVuY3Rpb24ob2JqLCBpdGVtLCBmcm9tSW5kZXgsIGd1YXJkKSB7XG4gICAgaWYgKCFpc0FycmF5TGlrZShvYmopKSBvYmogPSBfLnZhbHVlcyhvYmopO1xuICAgIGlmICh0eXBlb2YgZnJvbUluZGV4ICE9ICdudW1iZXInIHx8IGd1YXJkKSBmcm9tSW5kZXggPSAwO1xuICAgIHJldHVybiBfLmluZGV4T2Yob2JqLCBpdGVtLCBmcm9tSW5kZXgpID49IDA7XG4gIH07XG5cbiAgLy8gSW52b2tlIGEgbWV0aG9kICh3aXRoIGFyZ3VtZW50cykgb24gZXZlcnkgaXRlbSBpbiBhIGNvbGxlY3Rpb24uXG4gIF8uaW52b2tlID0gZnVuY3Rpb24ob2JqLCBtZXRob2QpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICB2YXIgaXNGdW5jID0gXy5pc0Z1bmN0aW9uKG1ldGhvZCk7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciBmdW5jID0gaXNGdW5jID8gbWV0aG9kIDogdmFsdWVbbWV0aG9kXTtcbiAgICAgIHJldHVybiBmdW5jID09IG51bGwgPyBmdW5jIDogZnVuYy5hcHBseSh2YWx1ZSwgYXJncyk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgbWFwYDogZmV0Y2hpbmcgYSBwcm9wZXJ0eS5cbiAgXy5wbHVjayA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgXy5wcm9wZXJ0eShrZXkpKTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaWx0ZXJgOiBzZWxlY3Rpbmcgb25seSBvYmplY3RzXG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8ud2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgXy5tYXRjaGVyKGF0dHJzKSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmluZGA6IGdldHRpbmcgdGhlIGZpcnN0IG9iamVjdFxuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLmZpbmRXaGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy5maW5kKG9iaiwgXy5tYXRjaGVyKGF0dHJzKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtYXhpbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1heCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0gLUluZmluaXR5LCBsYXN0Q29tcHV0ZWQgPSAtSW5maW5pdHksXG4gICAgICAgIHZhbHVlLCBjb21wdXRlZDtcbiAgICBpZiAoaXRlcmF0ZWUgPT0gbnVsbCAmJiBvYmogIT0gbnVsbCkge1xuICAgICAgb2JqID0gaXNBcnJheUxpa2Uob2JqKSA/IG9iaiA6IF8udmFsdWVzKG9iaik7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW2ldO1xuICAgICAgICBpZiAodmFsdWUgPiByZXN1bHQpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgICAgIGlmIChjb21wdXRlZCA+IGxhc3RDb21wdXRlZCB8fCBjb21wdXRlZCA9PT0gLUluZmluaXR5ICYmIHJlc3VsdCA9PT0gLUluZmluaXR5KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgbGFzdENvbXB1dGVkID0gY29tcHV0ZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWluaW11bSBlbGVtZW50IChvciBlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgXy5taW4gPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IEluZmluaXR5LCBsYXN0Q29tcHV0ZWQgPSBJbmZpbml0eSxcbiAgICAgICAgdmFsdWUsIGNvbXB1dGVkO1xuICAgIGlmIChpdGVyYXRlZSA9PSBudWxsICYmIG9iaiAhPSBudWxsKSB7XG4gICAgICBvYmogPSBpc0FycmF5TGlrZShvYmopID8gb2JqIDogXy52YWx1ZXMob2JqKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFsdWUgPSBvYmpbaV07XG4gICAgICAgIGlmICh2YWx1ZSA8IHJlc3VsdCkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICAgICAgaWYgKGNvbXB1dGVkIDwgbGFzdENvbXB1dGVkIHx8IGNvbXB1dGVkID09PSBJbmZpbml0eSAmJiByZXN1bHQgPT09IEluZmluaXR5KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgbGFzdENvbXB1dGVkID0gY29tcHV0ZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFNodWZmbGUgYSBjb2xsZWN0aW9uLCB1c2luZyB0aGUgbW9kZXJuIHZlcnNpb24gb2YgdGhlXG4gIC8vIFtGaXNoZXItWWF0ZXMgc2h1ZmZsZV0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9GaXNoZXLigJNZYXRlc19zaHVmZmxlKS5cbiAgXy5zaHVmZmxlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHNldCA9IGlzQXJyYXlMaWtlKG9iaikgPyBvYmogOiBfLnZhbHVlcyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBzZXQubGVuZ3RoO1xuICAgIHZhciBzaHVmZmxlZCA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwLCByYW5kOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgcmFuZCA9IF8ucmFuZG9tKDAsIGluZGV4KTtcbiAgICAgIGlmIChyYW5kICE9PSBpbmRleCkgc2h1ZmZsZWRbaW5kZXhdID0gc2h1ZmZsZWRbcmFuZF07XG4gICAgICBzaHVmZmxlZFtyYW5kXSA9IHNldFtpbmRleF07XG4gICAgfVxuICAgIHJldHVybiBzaHVmZmxlZDtcbiAgfTtcblxuICAvLyBTYW1wbGUgKipuKiogcmFuZG9tIHZhbHVlcyBmcm9tIGEgY29sbGVjdGlvbi5cbiAgLy8gSWYgKipuKiogaXMgbm90IHNwZWNpZmllZCwgcmV0dXJucyBhIHNpbmdsZSByYW5kb20gZWxlbWVudC5cbiAgLy8gVGhlIGludGVybmFsIGBndWFyZGAgYXJndW1lbnQgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgbWFwYC5cbiAgXy5zYW1wbGUgPSBmdW5jdGlvbihvYmosIG4sIGd1YXJkKSB7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkge1xuICAgICAgaWYgKCFpc0FycmF5TGlrZShvYmopKSBvYmogPSBfLnZhbHVlcyhvYmopO1xuICAgICAgcmV0dXJuIG9ialtfLnJhbmRvbShvYmoubGVuZ3RoIC0gMSldO1xuICAgIH1cbiAgICByZXR1cm4gXy5zaHVmZmxlKG9iaikuc2xpY2UoMCwgTWF0aC5tYXgoMCwgbikpO1xuICB9O1xuXG4gIC8vIFNvcnQgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiBwcm9kdWNlZCBieSBhbiBpdGVyYXRlZS5cbiAgXy5zb3J0QnkgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgcmV0dXJuIF8ucGx1Y2soXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICBjcml0ZXJpYTogaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBsaXN0KVxuICAgICAgfTtcbiAgICB9KS5zb3J0KGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gICAgICB2YXIgYSA9IGxlZnQuY3JpdGVyaWE7XG4gICAgICB2YXIgYiA9IHJpZ2h0LmNyaXRlcmlhO1xuICAgICAgaWYgKGEgIT09IGIpIHtcbiAgICAgICAgaWYgKGEgPiBiIHx8IGEgPT09IHZvaWQgMCkgcmV0dXJuIDE7XG4gICAgICAgIGlmIChhIDwgYiB8fCBiID09PSB2b2lkIDApIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsZWZ0LmluZGV4IC0gcmlnaHQuaW5kZXg7XG4gICAgfSksICd2YWx1ZScpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIHVzZWQgZm9yIGFnZ3JlZ2F0ZSBcImdyb3VwIGJ5XCIgb3BlcmF0aW9ucy5cbiAgdmFyIGdyb3VwID0gZnVuY3Rpb24oYmVoYXZpb3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgdmFyIGtleSA9IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgb2JqKTtcbiAgICAgICAgYmVoYXZpb3IocmVzdWx0LCB2YWx1ZSwga2V5KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEdyb3VwcyB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uLiBQYXNzIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGVcbiAgLy8gdG8gZ3JvdXAgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBjcml0ZXJpb24uXG4gIF8uZ3JvdXBCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgIGlmIChfLmhhcyhyZXN1bHQsIGtleSkpIHJlc3VsdFtrZXldLnB1c2godmFsdWUpOyBlbHNlIHJlc3VsdFtrZXldID0gW3ZhbHVlXTtcbiAgfSk7XG5cbiAgLy8gSW5kZXhlcyB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uLCBzaW1pbGFyIHRvIGBncm91cEJ5YCwgYnV0IGZvclxuICAvLyB3aGVuIHlvdSBrbm93IHRoYXQgeW91ciBpbmRleCB2YWx1ZXMgd2lsbCBiZSB1bmlxdWUuXG4gIF8uaW5kZXhCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gIH0pO1xuXG4gIC8vIENvdW50cyBpbnN0YW5jZXMgb2YgYW4gb2JqZWN0IHRoYXQgZ3JvdXAgYnkgYSBjZXJ0YWluIGNyaXRlcmlvbi4gUGFzc1xuICAvLyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlIHRvIGNvdW50IGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGVcbiAgLy8gY3JpdGVyaW9uLlxuICBfLmNvdW50QnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICBpZiAoXy5oYXMocmVzdWx0LCBrZXkpKSByZXN1bHRba2V5XSsrOyBlbHNlIHJlc3VsdFtrZXldID0gMTtcbiAgfSk7XG5cbiAgLy8gU2FmZWx5IGNyZWF0ZSBhIHJlYWwsIGxpdmUgYXJyYXkgZnJvbSBhbnl0aGluZyBpdGVyYWJsZS5cbiAgXy50b0FycmF5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFvYmopIHJldHVybiBbXTtcbiAgICBpZiAoXy5pc0FycmF5KG9iaikpIHJldHVybiBzbGljZS5jYWxsKG9iaik7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikpIHJldHVybiBfLm1hcChvYmosIF8uaWRlbnRpdHkpO1xuICAgIHJldHVybiBfLnZhbHVlcyhvYmopO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIGFuIG9iamVjdC5cbiAgXy5zaXplID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gMDtcbiAgICByZXR1cm4gaXNBcnJheUxpa2Uob2JqKSA/IG9iai5sZW5ndGggOiBfLmtleXMob2JqKS5sZW5ndGg7XG4gIH07XG5cbiAgLy8gU3BsaXQgYSBjb2xsZWN0aW9uIGludG8gdHdvIGFycmF5czogb25lIHdob3NlIGVsZW1lbnRzIGFsbCBzYXRpc2Z5IHRoZSBnaXZlblxuICAvLyBwcmVkaWNhdGUsIGFuZCBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIGRvIG5vdCBzYXRpc2Z5IHRoZSBwcmVkaWNhdGUuXG4gIF8ucGFydGl0aW9uID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBwYXNzID0gW10sIGZhaWwgPSBbXTtcbiAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBvYmopIHtcbiAgICAgIChwcmVkaWNhdGUodmFsdWUsIGtleSwgb2JqKSA/IHBhc3MgOiBmYWlsKS5wdXNoKHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gW3Bhc3MsIGZhaWxdO1xuICB9O1xuXG4gIC8vIEFycmF5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS1cblxuICAvLyBHZXQgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGZpcnN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgaGVhZGAgYW5kIGB0YWtlYC4gVGhlICoqZ3VhcmQqKiBjaGVja1xuICAvLyBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8uZmlyc3QgPSBfLmhlYWQgPSBfLnRha2UgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSByZXR1cm4gYXJyYXlbMF07XG4gICAgcmV0dXJuIF8uaW5pdGlhbChhcnJheSwgYXJyYXkubGVuZ3RoIC0gbik7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgbGFzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEVzcGVjaWFsbHkgdXNlZnVsIG9uXG4gIC8vIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIGFsbCB0aGUgdmFsdWVzIGluXG4gIC8vIHRoZSBhcnJheSwgZXhjbHVkaW5nIHRoZSBsYXN0IE4uXG4gIF8uaW5pdGlhbCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCAwLCBNYXRoLm1heCgwLCBhcnJheS5sZW5ndGggLSAobiA9PSBudWxsIHx8IGd1YXJkID8gMSA6IG4pKSk7XG4gIH07XG5cbiAgLy8gR2V0IHRoZSBsYXN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGxhc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LlxuICBfLmxhc3QgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSByZXR1cm4gYXJyYXlbYXJyYXkubGVuZ3RoIC0gMV07XG4gICAgcmV0dXJuIF8ucmVzdChhcnJheSwgTWF0aC5tYXgoMCwgYXJyYXkubGVuZ3RoIC0gbikpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGZpcnN0IGVudHJ5IG9mIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgdGFpbGAgYW5kIGBkcm9wYC5cbiAgLy8gRXNwZWNpYWxseSB1c2VmdWwgb24gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgYW4gKipuKiogd2lsbCByZXR1cm5cbiAgLy8gdGhlIHJlc3QgTiB2YWx1ZXMgaW4gdGhlIGFycmF5LlxuICBfLnJlc3QgPSBfLnRhaWwgPSBfLmRyb3AgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgbiA9PSBudWxsIHx8IGd1YXJkID8gMSA6IG4pO1xuICB9O1xuXG4gIC8vIFRyaW0gb3V0IGFsbCBmYWxzeSB2YWx1ZXMgZnJvbSBhbiBhcnJheS5cbiAgXy5jb21wYWN0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIF8uaWRlbnRpdHkpO1xuICB9O1xuXG4gIC8vIEludGVybmFsIGltcGxlbWVudGF0aW9uIG9mIGEgcmVjdXJzaXZlIGBmbGF0dGVuYCBmdW5jdGlvbi5cbiAgdmFyIGZsYXR0ZW4gPSBmdW5jdGlvbihpbnB1dCwgc2hhbGxvdywgc3RyaWN0LCBzdGFydEluZGV4KSB7XG4gICAgdmFyIG91dHB1dCA9IFtdLCBpZHggPSAwO1xuICAgIGZvciAodmFyIGkgPSBzdGFydEluZGV4IHx8IDAsIGxlbmd0aCA9IGdldExlbmd0aChpbnB1dCk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlID0gaW5wdXRbaV07XG4gICAgICBpZiAoaXNBcnJheUxpa2UodmFsdWUpICYmIChfLmlzQXJyYXkodmFsdWUpIHx8IF8uaXNBcmd1bWVudHModmFsdWUpKSkge1xuICAgICAgICAvL2ZsYXR0ZW4gY3VycmVudCBsZXZlbCBvZiBhcnJheSBvciBhcmd1bWVudHMgb2JqZWN0XG4gICAgICAgIGlmICghc2hhbGxvdykgdmFsdWUgPSBmbGF0dGVuKHZhbHVlLCBzaGFsbG93LCBzdHJpY3QpO1xuICAgICAgICB2YXIgaiA9IDAsIGxlbiA9IHZhbHVlLmxlbmd0aDtcbiAgICAgICAgb3V0cHV0Lmxlbmd0aCArPSBsZW47XG4gICAgICAgIHdoaWxlIChqIDwgbGVuKSB7XG4gICAgICAgICAgb3V0cHV0W2lkeCsrXSA9IHZhbHVlW2orK107XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIXN0cmljdCkge1xuICAgICAgICBvdXRwdXRbaWR4KytdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgLy8gRmxhdHRlbiBvdXQgYW4gYXJyYXksIGVpdGhlciByZWN1cnNpdmVseSAoYnkgZGVmYXVsdCksIG9yIGp1c3Qgb25lIGxldmVsLlxuICBfLmZsYXR0ZW4gPSBmdW5jdGlvbihhcnJheSwgc2hhbGxvdykge1xuICAgIHJldHVybiBmbGF0dGVuKGFycmF5LCBzaGFsbG93LCBmYWxzZSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgdmVyc2lvbiBvZiB0aGUgYXJyYXkgdGhhdCBkb2VzIG5vdCBjb250YWluIHRoZSBzcGVjaWZpZWQgdmFsdWUocykuXG4gIF8ud2l0aG91dCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZGlmZmVyZW5jZShhcnJheSwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGEgZHVwbGljYXRlLWZyZWUgdmVyc2lvbiBvZiB0aGUgYXJyYXkuIElmIHRoZSBhcnJheSBoYXMgYWxyZWFkeVxuICAvLyBiZWVuIHNvcnRlZCwgeW91IGhhdmUgdGhlIG9wdGlvbiBvZiB1c2luZyBhIGZhc3RlciBhbGdvcml0aG0uXG4gIC8vIEFsaWFzZWQgYXMgYHVuaXF1ZWAuXG4gIF8udW5pcSA9IF8udW5pcXVlID0gZnVuY3Rpb24oYXJyYXksIGlzU29ydGVkLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGlmICghXy5pc0Jvb2xlYW4oaXNTb3J0ZWQpKSB7XG4gICAgICBjb250ZXh0ID0gaXRlcmF0ZWU7XG4gICAgICBpdGVyYXRlZSA9IGlzU29ydGVkO1xuICAgICAgaXNTb3J0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGl0ZXJhdGVlICE9IG51bGwpIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgc2VlbiA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2ldLFxuICAgICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUgPyBpdGVyYXRlZSh2YWx1ZSwgaSwgYXJyYXkpIDogdmFsdWU7XG4gICAgICBpZiAoaXNTb3J0ZWQpIHtcbiAgICAgICAgaWYgKCFpIHx8IHNlZW4gIT09IGNvbXB1dGVkKSByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIHNlZW4gPSBjb21wdXRlZDtcbiAgICAgIH0gZWxzZSBpZiAoaXRlcmF0ZWUpIHtcbiAgICAgICAgaWYgKCFfLmNvbnRhaW5zKHNlZW4sIGNvbXB1dGVkKSkge1xuICAgICAgICAgIHNlZW4ucHVzaChjb21wdXRlZCk7XG4gICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFfLmNvbnRhaW5zKHJlc3VsdCwgdmFsdWUpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgdGhlIHVuaW9uOiBlYWNoIGRpc3RpbmN0IGVsZW1lbnQgZnJvbSBhbGwgb2ZcbiAgLy8gdGhlIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8udW5pb24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXy51bmlxKGZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlLCB0cnVlKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIGV2ZXJ5IGl0ZW0gc2hhcmVkIGJldHdlZW4gYWxsIHRoZVxuICAvLyBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBhcmdzTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaXRlbSA9IGFycmF5W2ldO1xuICAgICAgaWYgKF8uY29udGFpbnMocmVzdWx0LCBpdGVtKSkgY29udGludWU7XG4gICAgICBmb3IgKHZhciBqID0gMTsgaiA8IGFyZ3NMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAoIV8uY29udGFpbnMoYXJndW1lbnRzW2pdLCBpdGVtKSkgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoaiA9PT0gYXJnc0xlbmd0aCkgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gVGFrZSB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIG9uZSBhcnJheSBhbmQgYSBudW1iZXIgb2Ygb3RoZXIgYXJyYXlzLlxuICAvLyBPbmx5IHRoZSBlbGVtZW50cyBwcmVzZW50IGluIGp1c3QgdGhlIGZpcnN0IGFycmF5IHdpbGwgcmVtYWluLlxuICBfLmRpZmZlcmVuY2UgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN0ID0gZmxhdHRlbihhcmd1bWVudHMsIHRydWUsIHRydWUsIDEpO1xuICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgZnVuY3Rpb24odmFsdWUpe1xuICAgICAgcmV0dXJuICFfLmNvbnRhaW5zKHJlc3QsIHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBaaXAgdG9nZXRoZXIgbXVsdGlwbGUgbGlzdHMgaW50byBhIHNpbmdsZSBhcnJheSAtLSBlbGVtZW50cyB0aGF0IHNoYXJlXG4gIC8vIGFuIGluZGV4IGdvIHRvZ2V0aGVyLlxuICBfLnppcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfLnVuemlwKGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgLy8gQ29tcGxlbWVudCBvZiBfLnppcC4gVW56aXAgYWNjZXB0cyBhbiBhcnJheSBvZiBhcnJheXMgYW5kIGdyb3Vwc1xuICAvLyBlYWNoIGFycmF5J3MgZWxlbWVudHMgb24gc2hhcmVkIGluZGljZXNcbiAgXy51bnppcCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIGxlbmd0aCA9IGFycmF5ICYmIF8ubWF4KGFycmF5LCBnZXRMZW5ndGgpLmxlbmd0aCB8fCAwO1xuICAgIHZhciByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgcmVzdWx0W2luZGV4XSA9IF8ucGx1Y2soYXJyYXksIGluZGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBDb252ZXJ0cyBsaXN0cyBpbnRvIG9iamVjdHMuIFBhc3MgZWl0aGVyIGEgc2luZ2xlIGFycmF5IG9mIGBba2V5LCB2YWx1ZV1gXG4gIC8vIHBhaXJzLCBvciB0d28gcGFyYWxsZWwgYXJyYXlzIG9mIHRoZSBzYW1lIGxlbmd0aCAtLSBvbmUgb2Yga2V5cywgYW5kIG9uZSBvZlxuICAvLyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gIF8ub2JqZWN0ID0gZnVuY3Rpb24obGlzdCwgdmFsdWVzKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgobGlzdCk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICByZXN1bHRbbGlzdFtpXV0gPSB2YWx1ZXNbaV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRbbGlzdFtpXVswXV0gPSBsaXN0W2ldWzFdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIEdlbmVyYXRvciBmdW5jdGlvbiB0byBjcmVhdGUgdGhlIGZpbmRJbmRleCBhbmQgZmluZExhc3RJbmRleCBmdW5jdGlvbnNcbiAgZnVuY3Rpb24gY3JlYXRlUHJlZGljYXRlSW5kZXhGaW5kZXIoZGlyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGFycmF5LCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgICB2YXIgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTtcbiAgICAgIHZhciBpbmRleCA9IGRpciA+IDAgPyAwIDogbGVuZ3RoIC0gMTtcbiAgICAgIGZvciAoOyBpbmRleCA+PSAwICYmIGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSBkaXIpIHtcbiAgICAgICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHJldHVybiBpbmRleDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9O1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3QgaW5kZXggb24gYW4gYXJyYXktbGlrZSB0aGF0IHBhc3NlcyBhIHByZWRpY2F0ZSB0ZXN0XG4gIF8uZmluZEluZGV4ID0gY3JlYXRlUHJlZGljYXRlSW5kZXhGaW5kZXIoMSk7XG4gIF8uZmluZExhc3RJbmRleCA9IGNyZWF0ZVByZWRpY2F0ZUluZGV4RmluZGVyKC0xKTtcblxuICAvLyBVc2UgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIHRvIGZpZ3VyZSBvdXQgdGhlIHNtYWxsZXN0IGluZGV4IGF0IHdoaWNoXG4gIC8vIGFuIG9iamVjdCBzaG91bGQgYmUgaW5zZXJ0ZWQgc28gYXMgdG8gbWFpbnRhaW4gb3JkZXIuIFVzZXMgYmluYXJ5IHNlYXJjaC5cbiAgXy5zb3J0ZWRJbmRleCA9IGZ1bmN0aW9uKGFycmF5LCBvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCwgMSk7XG4gICAgdmFyIHZhbHVlID0gaXRlcmF0ZWUob2JqKTtcbiAgICB2YXIgbG93ID0gMCwgaGlnaCA9IGdldExlbmd0aChhcnJheSk7XG4gICAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcbiAgICAgIHZhciBtaWQgPSBNYXRoLmZsb29yKChsb3cgKyBoaWdoKSAvIDIpO1xuICAgICAgaWYgKGl0ZXJhdGVlKGFycmF5W21pZF0pIDwgdmFsdWUpIGxvdyA9IG1pZCArIDE7IGVsc2UgaGlnaCA9IG1pZDtcbiAgICB9XG4gICAgcmV0dXJuIGxvdztcbiAgfTtcblxuICAvLyBHZW5lcmF0b3IgZnVuY3Rpb24gdG8gY3JlYXRlIHRoZSBpbmRleE9mIGFuZCBsYXN0SW5kZXhPZiBmdW5jdGlvbnNcbiAgZnVuY3Rpb24gY3JlYXRlSW5kZXhGaW5kZXIoZGlyLCBwcmVkaWNhdGVGaW5kLCBzb3J0ZWRJbmRleCkge1xuICAgIHJldHVybiBmdW5jdGlvbihhcnJheSwgaXRlbSwgaWR4KSB7XG4gICAgICB2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7XG4gICAgICBpZiAodHlwZW9mIGlkeCA9PSAnbnVtYmVyJykge1xuICAgICAgICBpZiAoZGlyID4gMCkge1xuICAgICAgICAgICAgaSA9IGlkeCA+PSAwID8gaWR4IDogTWF0aC5tYXgoaWR4ICsgbGVuZ3RoLCBpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxlbmd0aCA9IGlkeCA+PSAwID8gTWF0aC5taW4oaWR4ICsgMSwgbGVuZ3RoKSA6IGlkeCArIGxlbmd0aCArIDE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoc29ydGVkSW5kZXggJiYgaWR4ICYmIGxlbmd0aCkge1xuICAgICAgICBpZHggPSBzb3J0ZWRJbmRleChhcnJheSwgaXRlbSk7XG4gICAgICAgIHJldHVybiBhcnJheVtpZHhdID09PSBpdGVtID8gaWR4IDogLTE7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbSAhPT0gaXRlbSkge1xuICAgICAgICBpZHggPSBwcmVkaWNhdGVGaW5kKHNsaWNlLmNhbGwoYXJyYXksIGksIGxlbmd0aCksIF8uaXNOYU4pO1xuICAgICAgICByZXR1cm4gaWR4ID49IDAgPyBpZHggKyBpIDogLTE7XG4gICAgICB9XG4gICAgICBmb3IgKGlkeCA9IGRpciA+IDAgPyBpIDogbGVuZ3RoIC0gMTsgaWR4ID49IDAgJiYgaWR4IDwgbGVuZ3RoOyBpZHggKz0gZGlyKSB7XG4gICAgICAgIGlmIChhcnJheVtpZHhdID09PSBpdGVtKSByZXR1cm4gaWR4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG4gIH1cblxuICAvLyBSZXR1cm4gdGhlIHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGFuIGl0ZW0gaW4gYW4gYXJyYXksXG4gIC8vIG9yIC0xIGlmIHRoZSBpdGVtIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgYXJyYXkuXG4gIC8vIElmIHRoZSBhcnJheSBpcyBsYXJnZSBhbmQgYWxyZWFkeSBpbiBzb3J0IG9yZGVyLCBwYXNzIGB0cnVlYFxuICAvLyBmb3IgKippc1NvcnRlZCoqIHRvIHVzZSBiaW5hcnkgc2VhcmNoLlxuICBfLmluZGV4T2YgPSBjcmVhdGVJbmRleEZpbmRlcigxLCBfLmZpbmRJbmRleCwgXy5zb3J0ZWRJbmRleCk7XG4gIF8ubGFzdEluZGV4T2YgPSBjcmVhdGVJbmRleEZpbmRlcigtMSwgXy5maW5kTGFzdEluZGV4KTtcblxuICAvLyBHZW5lcmF0ZSBhbiBpbnRlZ2VyIEFycmF5IGNvbnRhaW5pbmcgYW4gYXJpdGhtZXRpYyBwcm9ncmVzc2lvbi4gQSBwb3J0IG9mXG4gIC8vIHRoZSBuYXRpdmUgUHl0aG9uIGByYW5nZSgpYCBmdW5jdGlvbi4gU2VlXG4gIC8vIFt0aGUgUHl0aG9uIGRvY3VtZW50YXRpb25dKGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS9mdW5jdGlvbnMuaHRtbCNyYW5nZSkuXG4gIF8ucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICAgIGlmIChzdG9wID09IG51bGwpIHtcbiAgICAgIHN0b3AgPSBzdGFydCB8fCAwO1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cbiAgICBzdGVwID0gc3RlcCB8fCAxO1xuXG4gICAgdmFyIGxlbmd0aCA9IE1hdGgubWF4KE1hdGguY2VpbCgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXApLCAwKTtcbiAgICB2YXIgcmFuZ2UgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbGVuZ3RoOyBpZHgrKywgc3RhcnQgKz0gc3RlcCkge1xuICAgICAgcmFuZ2VbaWR4XSA9IHN0YXJ0O1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiAoYWhlbSkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIERldGVybWluZXMgd2hldGhlciB0byBleGVjdXRlIGEgZnVuY3Rpb24gYXMgYSBjb25zdHJ1Y3RvclxuICAvLyBvciBhIG5vcm1hbCBmdW5jdGlvbiB3aXRoIHRoZSBwcm92aWRlZCBhcmd1bWVudHNcbiAgdmFyIGV4ZWN1dGVCb3VuZCA9IGZ1bmN0aW9uKHNvdXJjZUZ1bmMsIGJvdW5kRnVuYywgY29udGV4dCwgY2FsbGluZ0NvbnRleHQsIGFyZ3MpIHtcbiAgICBpZiAoIShjYWxsaW5nQ29udGV4dCBpbnN0YW5jZW9mIGJvdW5kRnVuYykpIHJldHVybiBzb3VyY2VGdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIHZhciBzZWxmID0gYmFzZUNyZWF0ZShzb3VyY2VGdW5jLnByb3RvdHlwZSk7XG4gICAgdmFyIHJlc3VsdCA9IHNvdXJjZUZ1bmMuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgaWYgKF8uaXNPYmplY3QocmVzdWx0KSkgcmV0dXJuIHJlc3VsdDtcbiAgICByZXR1cm4gc2VsZjtcbiAgfTtcblxuICAvLyBDcmVhdGUgYSBmdW5jdGlvbiBib3VuZCB0byBhIGdpdmVuIG9iamVjdCAoYXNzaWduaW5nIGB0aGlzYCwgYW5kIGFyZ3VtZW50cyxcbiAgLy8gb3B0aW9uYWxseSkuIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBGdW5jdGlvbi5iaW5kYCBpZlxuICAvLyBhdmFpbGFibGUuXG4gIF8uYmluZCA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQpIHtcbiAgICBpZiAobmF0aXZlQmluZCAmJiBmdW5jLmJpbmQgPT09IG5hdGl2ZUJpbmQpIHJldHVybiBuYXRpdmVCaW5kLmFwcGx5KGZ1bmMsIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgaWYgKCFfLmlzRnVuY3Rpb24oZnVuYykpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JpbmQgbXVzdCBiZSBjYWxsZWQgb24gYSBmdW5jdGlvbicpO1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBib3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4ZWN1dGVCb3VuZChmdW5jLCBib3VuZCwgY29udGV4dCwgdGhpcywgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgfTtcbiAgICByZXR1cm4gYm91bmQ7XG4gIH07XG5cbiAgLy8gUGFydGlhbGx5IGFwcGx5IGEgZnVuY3Rpb24gYnkgY3JlYXRpbmcgYSB2ZXJzaW9uIHRoYXQgaGFzIGhhZCBzb21lIG9mIGl0c1xuICAvLyBhcmd1bWVudHMgcHJlLWZpbGxlZCwgd2l0aG91dCBjaGFuZ2luZyBpdHMgZHluYW1pYyBgdGhpc2AgY29udGV4dC4gXyBhY3RzXG4gIC8vIGFzIGEgcGxhY2Vob2xkZXIsIGFsbG93aW5nIGFueSBjb21iaW5hdGlvbiBvZiBhcmd1bWVudHMgdG8gYmUgcHJlLWZpbGxlZC5cbiAgXy5wYXJ0aWFsID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHZhciBib3VuZEFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgdmFyIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcG9zaXRpb24gPSAwLCBsZW5ndGggPSBib3VuZEFyZ3MubGVuZ3RoO1xuICAgICAgdmFyIGFyZ3MgPSBBcnJheShsZW5ndGgpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBhcmdzW2ldID0gYm91bmRBcmdzW2ldID09PSBfID8gYXJndW1lbnRzW3Bvc2l0aW9uKytdIDogYm91bmRBcmdzW2ldO1xuICAgICAgfVxuICAgICAgd2hpbGUgKHBvc2l0aW9uIDwgYXJndW1lbnRzLmxlbmd0aCkgYXJncy5wdXNoKGFyZ3VtZW50c1twb3NpdGlvbisrXSk7XG4gICAgICByZXR1cm4gZXhlY3V0ZUJvdW5kKGZ1bmMsIGJvdW5kLCB0aGlzLCB0aGlzLCBhcmdzKTtcbiAgICB9O1xuICAgIHJldHVybiBib3VuZDtcbiAgfTtcblxuICAvLyBCaW5kIGEgbnVtYmVyIG9mIGFuIG9iamVjdCdzIG1ldGhvZHMgdG8gdGhhdCBvYmplY3QuIFJlbWFpbmluZyBhcmd1bWVudHNcbiAgLy8gYXJlIHRoZSBtZXRob2QgbmFtZXMgdG8gYmUgYm91bmQuIFVzZWZ1bCBmb3IgZW5zdXJpbmcgdGhhdCBhbGwgY2FsbGJhY2tzXG4gIC8vIGRlZmluZWQgb24gYW4gb2JqZWN0IGJlbG9uZyB0byBpdC5cbiAgXy5iaW5kQWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGksIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsIGtleTtcbiAgICBpZiAobGVuZ3RoIDw9IDEpIHRocm93IG5ldyBFcnJvcignYmluZEFsbCBtdXN0IGJlIHBhc3NlZCBmdW5jdGlvbiBuYW1lcycpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAga2V5ID0gYXJndW1lbnRzW2ldO1xuICAgICAgb2JqW2tleV0gPSBfLmJpbmQob2JqW2tleV0sIG9iaik7XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gTWVtb2l6ZSBhbiBleHBlbnNpdmUgZnVuY3Rpb24gYnkgc3RvcmluZyBpdHMgcmVzdWx0cy5cbiAgXy5tZW1vaXplID0gZnVuY3Rpb24oZnVuYywgaGFzaGVyKSB7XG4gICAgdmFyIG1lbW9pemUgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciBjYWNoZSA9IG1lbW9pemUuY2FjaGU7XG4gICAgICB2YXIgYWRkcmVzcyA9ICcnICsgKGhhc2hlciA/IGhhc2hlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDoga2V5KTtcbiAgICAgIGlmICghXy5oYXMoY2FjaGUsIGFkZHJlc3MpKSBjYWNoZVthZGRyZXNzXSA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBjYWNoZVthZGRyZXNzXTtcbiAgICB9O1xuICAgIG1lbW9pemUuY2FjaGUgPSB7fTtcbiAgICByZXR1cm4gbWVtb2l6ZTtcbiAgfTtcblxuICAvLyBEZWxheXMgYSBmdW5jdGlvbiBmb3IgdGhlIGdpdmVuIG51bWJlciBvZiBtaWxsaXNlY29uZHMsIGFuZCB0aGVuIGNhbGxzXG4gIC8vIGl0IHdpdGggdGhlIGFyZ3VtZW50cyBzdXBwbGllZC5cbiAgXy5kZWxheSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfSwgd2FpdCk7XG4gIH07XG5cbiAgLy8gRGVmZXJzIGEgZnVuY3Rpb24sIHNjaGVkdWxpbmcgaXQgdG8gcnVuIGFmdGVyIHRoZSBjdXJyZW50IGNhbGwgc3RhY2sgaGFzXG4gIC8vIGNsZWFyZWQuXG4gIF8uZGVmZXIgPSBfLnBhcnRpYWwoXy5kZWxheSwgXywgMSk7XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCB3aGVuIGludm9rZWQsIHdpbGwgb25seSBiZSB0cmlnZ2VyZWQgYXQgbW9zdCBvbmNlXG4gIC8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLiBOb3JtYWxseSwgdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsIHJ1blxuICAvLyBhcyBtdWNoIGFzIGl0IGNhbiwgd2l0aG91dCBldmVyIGdvaW5nIG1vcmUgdGhhbiBvbmNlIHBlciBgd2FpdGAgZHVyYXRpb247XG4gIC8vIGJ1dCBpZiB5b3UnZCBsaWtlIHRvIGRpc2FibGUgdGhlIGV4ZWN1dGlvbiBvbiB0aGUgbGVhZGluZyBlZGdlLCBwYXNzXG4gIC8vIGB7bGVhZGluZzogZmFsc2V9YC4gVG8gZGlzYWJsZSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2UsIGRpdHRvLlxuICBfLnRocm90dGxlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICAgIHZhciBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XG4gICAgdmFyIHRpbWVvdXQgPSBudWxsO1xuICAgIHZhciBwcmV2aW91cyA9IDA7XG4gICAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge307XG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogXy5ub3coKTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG5vdyA9IF8ubm93KCk7XG4gICAgICBpZiAoIXByZXZpb3VzICYmIG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UpIHByZXZpb3VzID0gbm93O1xuICAgICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgaWYgKHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IHdhaXQpIHtcbiAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmICghdGltZW91dCAmJiBvcHRpb25zLnRyYWlsaW5nICE9PSBmYWxzZSkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4gIC8vIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3JcbiAgLy8gTiBtaWxsaXNlY29uZHMuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdHJpZ2dlciB0aGUgZnVuY3Rpb24gb24gdGhlXG4gIC8vIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG4gIF8uZGVib3VuY2UgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgICB2YXIgdGltZW91dCwgYXJncywgY29udGV4dCwgdGltZXN0YW1wLCByZXN1bHQ7XG5cbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsYXN0ID0gXy5ub3coKSAtIHRpbWVzdGFtcDtcblxuICAgICAgaWYgKGxhc3QgPCB3YWl0ICYmIGxhc3QgPj0gMCkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICB0aW1lc3RhbXAgPSBfLm5vdygpO1xuICAgICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICBpZiAoIXRpbWVvdXQpIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgIGlmIChjYWxsTm93KSB7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGZ1bmN0aW9uIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byB0aGUgc2Vjb25kLFxuICAvLyBhbGxvd2luZyB5b3UgdG8gYWRqdXN0IGFyZ3VtZW50cywgcnVuIGNvZGUgYmVmb3JlIGFuZCBhZnRlciwgYW5kXG4gIC8vIGNvbmRpdGlvbmFsbHkgZXhlY3V0ZSB0aGUgb3JpZ2luYWwgZnVuY3Rpb24uXG4gIF8ud3JhcCA9IGZ1bmN0aW9uKGZ1bmMsIHdyYXBwZXIpIHtcbiAgICByZXR1cm4gXy5wYXJ0aWFsKHdyYXBwZXIsIGZ1bmMpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBuZWdhdGVkIHZlcnNpb24gb2YgdGhlIHBhc3NlZC1pbiBwcmVkaWNhdGUuXG4gIF8ubmVnYXRlID0gZnVuY3Rpb24ocHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICFwcmVkaWNhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiBhIGxpc3Qgb2YgZnVuY3Rpb25zLCBlYWNoXG4gIC8vIGNvbnN1bWluZyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmdW5jdGlvbiB0aGF0IGZvbGxvd3MuXG4gIF8uY29tcG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIHZhciBzdGFydCA9IGFyZ3MubGVuZ3RoIC0gMTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaSA9IHN0YXJ0O1xuICAgICAgdmFyIHJlc3VsdCA9IGFyZ3Nbc3RhcnRdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB3aGlsZSAoaS0tKSByZXN1bHQgPSBhcmdzW2ldLmNhbGwodGhpcywgcmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgb24gYW5kIGFmdGVyIHRoZSBOdGggY2FsbC5cbiAgXy5hZnRlciA9IGZ1bmN0aW9uKHRpbWVzLCBmdW5jKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPCAxKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgdXAgdG8gKGJ1dCBub3QgaW5jbHVkaW5nKSB0aGUgTnRoIGNhbGwuXG4gIF8uYmVmb3JlID0gZnVuY3Rpb24odGltZXMsIGZ1bmMpIHtcbiAgICB2YXIgbWVtbztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aW1lcyA+IDApIHtcbiAgICAgICAgbWVtbyA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aW1lcyA8PSAxKSBmdW5jID0gbnVsbDtcbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBhdCBtb3N0IG9uZSB0aW1lLCBubyBtYXR0ZXIgaG93XG4gIC8vIG9mdGVuIHlvdSBjYWxsIGl0LiBVc2VmdWwgZm9yIGxhenkgaW5pdGlhbGl6YXRpb24uXG4gIF8ub25jZSA9IF8ucGFydGlhbChfLmJlZm9yZSwgMik7XG5cbiAgLy8gT2JqZWN0IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gS2V5cyBpbiBJRSA8IDkgdGhhdCB3b24ndCBiZSBpdGVyYXRlZCBieSBgZm9yIGtleSBpbiAuLi5gIGFuZCB0aHVzIG1pc3NlZC5cbiAgdmFyIGhhc0VudW1CdWcgPSAhe3RvU3RyaW5nOiBudWxsfS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgndG9TdHJpbmcnKTtcbiAgdmFyIG5vbkVudW1lcmFibGVQcm9wcyA9IFsndmFsdWVPZicsICdpc1Byb3RvdHlwZU9mJywgJ3RvU3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAncHJvcGVydHlJc0VudW1lcmFibGUnLCAnaGFzT3duUHJvcGVydHknLCAndG9Mb2NhbGVTdHJpbmcnXTtcblxuICBmdW5jdGlvbiBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwga2V5cykge1xuICAgIHZhciBub25FbnVtSWR4ID0gbm9uRW51bWVyYWJsZVByb3BzLmxlbmd0aDtcbiAgICB2YXIgY29uc3RydWN0b3IgPSBvYmouY29uc3RydWN0b3I7XG4gICAgdmFyIHByb3RvID0gKF8uaXNGdW5jdGlvbihjb25zdHJ1Y3RvcikgJiYgY29uc3RydWN0b3IucHJvdG90eXBlKSB8fCBPYmpQcm90bztcblxuICAgIC8vIENvbnN0cnVjdG9yIGlzIGEgc3BlY2lhbCBjYXNlLlxuICAgIHZhciBwcm9wID0gJ2NvbnN0cnVjdG9yJztcbiAgICBpZiAoXy5oYXMob2JqLCBwcm9wKSAmJiAhXy5jb250YWlucyhrZXlzLCBwcm9wKSkga2V5cy5wdXNoKHByb3ApO1xuXG4gICAgd2hpbGUgKG5vbkVudW1JZHgtLSkge1xuICAgICAgcHJvcCA9IG5vbkVudW1lcmFibGVQcm9wc1tub25FbnVtSWR4XTtcbiAgICAgIGlmIChwcm9wIGluIG9iaiAmJiBvYmpbcHJvcF0gIT09IHByb3RvW3Byb3BdICYmICFfLmNvbnRhaW5zKGtleXMsIHByb3ApKSB7XG4gICAgICAgIGtleXMucHVzaChwcm9wKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBSZXRyaWV2ZSB0aGUgbmFtZXMgb2YgYW4gb2JqZWN0J3Mgb3duIHByb3BlcnRpZXMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBPYmplY3Qua2V5c2BcbiAgXy5rZXlzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBbXTtcbiAgICBpZiAobmF0aXZlS2V5cykgcmV0dXJuIG5hdGl2ZUtleXMob2JqKTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIGtleXMucHVzaChrZXkpO1xuICAgIC8vIEFoZW0sIElFIDwgOS5cbiAgICBpZiAoaGFzRW51bUJ1ZykgY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpO1xuICAgIHJldHVybiBrZXlzO1xuICB9O1xuXG4gIC8vIFJldHJpZXZlIGFsbCB0aGUgcHJvcGVydHkgbmFtZXMgb2YgYW4gb2JqZWN0LlxuICBfLmFsbEtleXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIFtdO1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikga2V5cy5wdXNoKGtleSk7XG4gICAgLy8gQWhlbSwgSUUgPCA5LlxuICAgIGlmIChoYXNFbnVtQnVnKSBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwga2V5cyk7XG4gICAgcmV0dXJuIGtleXM7XG4gIH07XG5cbiAgLy8gUmV0cmlldmUgdGhlIHZhbHVlcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICBfLnZhbHVlcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciB2YWx1ZXMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhbHVlc1tpXSA9IG9ialtrZXlzW2ldXTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfTtcblxuICAvLyBSZXR1cm5zIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRlZSB0byBlYWNoIGVsZW1lbnQgb2YgdGhlIG9iamVjdFxuICAvLyBJbiBjb250cmFzdCB0byBfLm1hcCBpdCByZXR1cm5zIGFuIG9iamVjdFxuICBfLm1hcE9iamVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICBfLmtleXMob2JqKSxcbiAgICAgICAgICBsZW5ndGggPSBrZXlzLmxlbmd0aCxcbiAgICAgICAgICByZXN1bHRzID0ge30sXG4gICAgICAgICAgY3VycmVudEtleTtcbiAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgY3VycmVudEtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgICByZXN1bHRzW2N1cnJlbnRLZXldID0gaXRlcmF0ZWUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gQ29udmVydCBhbiBvYmplY3QgaW50byBhIGxpc3Qgb2YgYFtrZXksIHZhbHVlXWAgcGFpcnMuXG4gIF8ucGFpcnMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgcGFpcnMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhaXJzW2ldID0gW2tleXNbaV0sIG9ialtrZXlzW2ldXV07XG4gICAgfVxuICAgIHJldHVybiBwYWlycztcbiAgfTtcblxuICAvLyBJbnZlcnQgdGhlIGtleXMgYW5kIHZhbHVlcyBvZiBhbiBvYmplY3QuIFRoZSB2YWx1ZXMgbXVzdCBiZSBzZXJpYWxpemFibGUuXG4gIF8uaW52ZXJ0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdFtvYmpba2V5c1tpXV1dID0ga2V5c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBzb3J0ZWQgbGlzdCBvZiB0aGUgZnVuY3Rpb24gbmFtZXMgYXZhaWxhYmxlIG9uIHRoZSBvYmplY3QuXG4gIC8vIEFsaWFzZWQgYXMgYG1ldGhvZHNgXG4gIF8uZnVuY3Rpb25zID0gXy5tZXRob2RzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIG5hbWVzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihvYmpba2V5XSkpIG5hbWVzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWVzLnNvcnQoKTtcbiAgfTtcblxuICAvLyBFeHRlbmQgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHByb3BlcnRpZXMgaW4gcGFzc2VkLWluIG9iamVjdChzKS5cbiAgXy5leHRlbmQgPSBjcmVhdGVBc3NpZ25lcihfLmFsbEtleXMpO1xuXG4gIC8vIEFzc2lnbnMgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIG93biBwcm9wZXJ0aWVzIGluIHRoZSBwYXNzZWQtaW4gb2JqZWN0KHMpXG4gIC8vIChodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduKVxuICBfLmV4dGVuZE93biA9IF8uYXNzaWduID0gY3JlYXRlQXNzaWduZXIoXy5rZXlzKTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBrZXkgb24gYW4gb2JqZWN0IHRoYXQgcGFzc2VzIGEgcHJlZGljYXRlIHRlc3RcbiAgXy5maW5kS2V5ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaiksIGtleTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgIGlmIChwcmVkaWNhdGUob2JqW2tleV0sIGtleSwgb2JqKSkgcmV0dXJuIGtleTtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IG9ubHkgY29udGFpbmluZyB0aGUgd2hpdGVsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5waWNrID0gZnVuY3Rpb24ob2JqZWN0LCBvaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0ge30sIG9iaiA9IG9iamVjdCwgaXRlcmF0ZWUsIGtleXM7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xuICAgIGlmIChfLmlzRnVuY3Rpb24ob2l0ZXJhdGVlKSkge1xuICAgICAga2V5cyA9IF8uYWxsS2V5cyhvYmopO1xuICAgICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKG9pdGVyYXRlZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleXMgPSBmbGF0dGVuKGFyZ3VtZW50cywgZmFsc2UsIGZhbHNlLCAxKTtcbiAgICAgIGl0ZXJhdGVlID0gZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqKSB7IHJldHVybiBrZXkgaW4gb2JqOyB9O1xuICAgICAgb2JqID0gT2JqZWN0KG9iaik7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgIHZhciB2YWx1ZSA9IG9ialtrZXldO1xuICAgICAgaWYgKGl0ZXJhdGVlKHZhbHVlLCBrZXksIG9iaikpIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCB3aXRob3V0IHRoZSBibGFja2xpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLm9taXQgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihpdGVyYXRlZSkpIHtcbiAgICAgIGl0ZXJhdGVlID0gXy5uZWdhdGUoaXRlcmF0ZWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIga2V5cyA9IF8ubWFwKGZsYXR0ZW4oYXJndW1lbnRzLCBmYWxzZSwgZmFsc2UsIDEpLCBTdHJpbmcpO1xuICAgICAgaXRlcmF0ZWUgPSBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIHJldHVybiAhXy5jb250YWlucyhrZXlzLCBrZXkpO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIF8ucGljayhvYmosIGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBGaWxsIGluIGEgZ2l2ZW4gb2JqZWN0IHdpdGggZGVmYXVsdCBwcm9wZXJ0aWVzLlxuICBfLmRlZmF1bHRzID0gY3JlYXRlQXNzaWduZXIoXy5hbGxLZXlzLCB0cnVlKTtcblxuICAvLyBDcmVhdGVzIGFuIG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gdGhlIGdpdmVuIHByb3RvdHlwZSBvYmplY3QuXG4gIC8vIElmIGFkZGl0aW9uYWwgcHJvcGVydGllcyBhcmUgcHJvdmlkZWQgdGhlbiB0aGV5IHdpbGwgYmUgYWRkZWQgdG8gdGhlXG4gIC8vIGNyZWF0ZWQgb2JqZWN0LlxuICBfLmNyZWF0ZSA9IGZ1bmN0aW9uKHByb3RvdHlwZSwgcHJvcHMpIHtcbiAgICB2YXIgcmVzdWx0ID0gYmFzZUNyZWF0ZShwcm90b3R5cGUpO1xuICAgIGlmIChwcm9wcykgXy5leHRlbmRPd24ocmVzdWx0LCBwcm9wcyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBDcmVhdGUgYSAoc2hhbGxvdy1jbG9uZWQpIGR1cGxpY2F0ZSBvZiBhbiBvYmplY3QuXG4gIF8uY2xvbmUgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgICByZXR1cm4gXy5pc0FycmF5KG9iaikgPyBvYmouc2xpY2UoKSA6IF8uZXh0ZW5kKHt9LCBvYmopO1xuICB9O1xuXG4gIC8vIEludm9rZXMgaW50ZXJjZXB0b3Igd2l0aCB0aGUgb2JqLCBhbmQgdGhlbiByZXR1cm5zIG9iai5cbiAgLy8gVGhlIHByaW1hcnkgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyB0byBcInRhcCBpbnRvXCIgYSBtZXRob2QgY2hhaW4sIGluXG4gIC8vIG9yZGVyIHRvIHBlcmZvcm0gb3BlcmF0aW9ucyBvbiBpbnRlcm1lZGlhdGUgcmVzdWx0cyB3aXRoaW4gdGhlIGNoYWluLlxuICBfLnRhcCA9IGZ1bmN0aW9uKG9iaiwgaW50ZXJjZXB0b3IpIHtcbiAgICBpbnRlcmNlcHRvcihvYmopO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gUmV0dXJucyB3aGV0aGVyIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBzZXQgb2YgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8uaXNNYXRjaCA9IGZ1bmN0aW9uKG9iamVjdCwgYXR0cnMpIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhhdHRycyksIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkgcmV0dXJuICFsZW5ndGg7XG4gICAgdmFyIG9iaiA9IE9iamVjdChvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgaWYgKGF0dHJzW2tleV0gIT09IG9ialtrZXldIHx8ICEoa2V5IGluIG9iaikpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cblxuICAvLyBJbnRlcm5hbCByZWN1cnNpdmUgY29tcGFyaXNvbiBmdW5jdGlvbiBmb3IgYGlzRXF1YWxgLlxuICB2YXIgZXEgPSBmdW5jdGlvbihhLCBiLCBhU3RhY2ssIGJTdGFjaykge1xuICAgIC8vIElkZW50aWNhbCBvYmplY3RzIGFyZSBlcXVhbC4gYDAgPT09IC0wYCwgYnV0IHRoZXkgYXJlbid0IGlkZW50aWNhbC5cbiAgICAvLyBTZWUgdGhlIFtIYXJtb255IGBlZ2FsYCBwcm9wb3NhbF0oaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTplZ2FsKS5cbiAgICBpZiAoYSA9PT0gYikgcmV0dXJuIGEgIT09IDAgfHwgMSAvIGEgPT09IDEgLyBiO1xuICAgIC8vIEEgc3RyaWN0IGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYG51bGwgPT0gdW5kZWZpbmVkYC5cbiAgICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkgcmV0dXJuIGEgPT09IGI7XG4gICAgLy8gVW53cmFwIGFueSB3cmFwcGVkIG9iamVjdHMuXG4gICAgaWYgKGEgaW5zdGFuY2VvZiBfKSBhID0gYS5fd3JhcHBlZDtcbiAgICBpZiAoYiBpbnN0YW5jZW9mIF8pIGIgPSBiLl93cmFwcGVkO1xuICAgIC8vIENvbXBhcmUgYFtbQ2xhc3NdXWAgbmFtZXMuXG4gICAgdmFyIGNsYXNzTmFtZSA9IHRvU3RyaW5nLmNhbGwoYSk7XG4gICAgaWYgKGNsYXNzTmFtZSAhPT0gdG9TdHJpbmcuY2FsbChiKSkgcmV0dXJuIGZhbHNlO1xuICAgIHN3aXRjaCAoY2xhc3NOYW1lKSB7XG4gICAgICAvLyBTdHJpbmdzLCBudW1iZXJzLCByZWd1bGFyIGV4cHJlc3Npb25zLCBkYXRlcywgYW5kIGJvb2xlYW5zIGFyZSBjb21wYXJlZCBieSB2YWx1ZS5cbiAgICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6XG4gICAgICAvLyBSZWdFeHBzIGFyZSBjb2VyY2VkIHRvIHN0cmluZ3MgZm9yIGNvbXBhcmlzb24gKE5vdGU6ICcnICsgL2EvaSA9PT0gJy9hL2knKVxuICAgICAgY2FzZSAnW29iamVjdCBTdHJpbmddJzpcbiAgICAgICAgLy8gUHJpbWl0aXZlcyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBvYmplY3Qgd3JhcHBlcnMgYXJlIGVxdWl2YWxlbnQ7IHRodXMsIGBcIjVcImAgaXNcbiAgICAgICAgLy8gZXF1aXZhbGVudCB0byBgbmV3IFN0cmluZyhcIjVcIilgLlxuICAgICAgICByZXR1cm4gJycgKyBhID09PSAnJyArIGI7XG4gICAgICBjYXNlICdbb2JqZWN0IE51bWJlcl0nOlxuICAgICAgICAvLyBgTmFOYHMgYXJlIGVxdWl2YWxlbnQsIGJ1dCBub24tcmVmbGV4aXZlLlxuICAgICAgICAvLyBPYmplY3QoTmFOKSBpcyBlcXVpdmFsZW50IHRvIE5hTlxuICAgICAgICBpZiAoK2EgIT09ICthKSByZXR1cm4gK2IgIT09ICtiO1xuICAgICAgICAvLyBBbiBgZWdhbGAgY29tcGFyaXNvbiBpcyBwZXJmb3JtZWQgZm9yIG90aGVyIG51bWVyaWMgdmFsdWVzLlxuICAgICAgICByZXR1cm4gK2EgPT09IDAgPyAxIC8gK2EgPT09IDEgLyBiIDogK2EgPT09ICtiO1xuICAgICAgY2FzZSAnW29iamVjdCBEYXRlXSc6XG4gICAgICBjYXNlICdbb2JqZWN0IEJvb2xlYW5dJzpcbiAgICAgICAgLy8gQ29lcmNlIGRhdGVzIGFuZCBib29sZWFucyB0byBudW1lcmljIHByaW1pdGl2ZSB2YWx1ZXMuIERhdGVzIGFyZSBjb21wYXJlZCBieSB0aGVpclxuICAgICAgICAvLyBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnMuIE5vdGUgdGhhdCBpbnZhbGlkIGRhdGVzIHdpdGggbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zXG4gICAgICAgIC8vIG9mIGBOYU5gIGFyZSBub3QgZXF1aXZhbGVudC5cbiAgICAgICAgcmV0dXJuICthID09PSArYjtcbiAgICB9XG5cbiAgICB2YXIgYXJlQXJyYXlzID0gY2xhc3NOYW1lID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIGlmICghYXJlQXJyYXlzKSB7XG4gICAgICBpZiAodHlwZW9mIGEgIT0gJ29iamVjdCcgfHwgdHlwZW9mIGIgIT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcblxuICAgICAgLy8gT2JqZWN0cyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVpdmFsZW50LCBidXQgYE9iamVjdGBzIG9yIGBBcnJheWBzXG4gICAgICAvLyBmcm9tIGRpZmZlcmVudCBmcmFtZXMgYXJlLlxuICAgICAgdmFyIGFDdG9yID0gYS5jb25zdHJ1Y3RvciwgYkN0b3IgPSBiLmNvbnN0cnVjdG9yO1xuICAgICAgaWYgKGFDdG9yICE9PSBiQ3RvciAmJiAhKF8uaXNGdW5jdGlvbihhQ3RvcikgJiYgYUN0b3IgaW5zdGFuY2VvZiBhQ3RvciAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uaXNGdW5jdGlvbihiQ3RvcikgJiYgYkN0b3IgaW5zdGFuY2VvZiBiQ3RvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgKCdjb25zdHJ1Y3RvcicgaW4gYSAmJiAnY29uc3RydWN0b3InIGluIGIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQXNzdW1lIGVxdWFsaXR5IGZvciBjeWNsaWMgc3RydWN0dXJlcy4gVGhlIGFsZ29yaXRobSBmb3IgZGV0ZWN0aW5nIGN5Y2xpY1xuICAgIC8vIHN0cnVjdHVyZXMgaXMgYWRhcHRlZCBmcm9tIEVTIDUuMSBzZWN0aW9uIDE1LjEyLjMsIGFic3RyYWN0IG9wZXJhdGlvbiBgSk9gLlxuXG4gICAgLy8gSW5pdGlhbGl6aW5nIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIC8vIEl0J3MgZG9uZSBoZXJlIHNpbmNlIHdlIG9ubHkgbmVlZCB0aGVtIGZvciBvYmplY3RzIGFuZCBhcnJheXMgY29tcGFyaXNvbi5cbiAgICBhU3RhY2sgPSBhU3RhY2sgfHwgW107XG4gICAgYlN0YWNrID0gYlN0YWNrIHx8IFtdO1xuICAgIHZhciBsZW5ndGggPSBhU3RhY2subGVuZ3RoO1xuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgLy8gTGluZWFyIHNlYXJjaC4gUGVyZm9ybWFuY2UgaXMgaW52ZXJzZWx5IHByb3BvcnRpb25hbCB0byB0aGUgbnVtYmVyIG9mXG4gICAgICAvLyB1bmlxdWUgbmVzdGVkIHN0cnVjdHVyZXMuXG4gICAgICBpZiAoYVN0YWNrW2xlbmd0aF0gPT09IGEpIHJldHVybiBiU3RhY2tbbGVuZ3RoXSA9PT0gYjtcbiAgICB9XG5cbiAgICAvLyBBZGQgdGhlIGZpcnN0IG9iamVjdCB0byB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgYVN0YWNrLnB1c2goYSk7XG4gICAgYlN0YWNrLnB1c2goYik7XG5cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgYW5kIGFycmF5cy5cbiAgICBpZiAoYXJlQXJyYXlzKSB7XG4gICAgICAvLyBDb21wYXJlIGFycmF5IGxlbmd0aHMgdG8gZGV0ZXJtaW5lIGlmIGEgZGVlcCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeS5cbiAgICAgIGxlbmd0aCA9IGEubGVuZ3RoO1xuICAgICAgaWYgKGxlbmd0aCAhPT0gYi5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAgIC8vIERlZXAgY29tcGFyZSB0aGUgY29udGVudHMsIGlnbm9yaW5nIG5vbi1udW1lcmljIHByb3BlcnRpZXMuXG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgaWYgKCFlcShhW2xlbmd0aF0sIGJbbGVuZ3RoXSwgYVN0YWNrLCBiU3RhY2spKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERlZXAgY29tcGFyZSBvYmplY3RzLlxuICAgICAgdmFyIGtleXMgPSBfLmtleXMoYSksIGtleTtcbiAgICAgIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgICAgLy8gRW5zdXJlIHRoYXQgYm90aCBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUgbnVtYmVyIG9mIHByb3BlcnRpZXMgYmVmb3JlIGNvbXBhcmluZyBkZWVwIGVxdWFsaXR5LlxuICAgICAgaWYgKF8ua2V5cyhiKS5sZW5ndGggIT09IGxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIC8vIERlZXAgY29tcGFyZSBlYWNoIG1lbWJlclxuICAgICAgICBrZXkgPSBrZXlzW2xlbmd0aF07XG4gICAgICAgIGlmICghKF8uaGFzKGIsIGtleSkgJiYgZXEoYVtrZXldLCBiW2tleV0sIGFTdGFjaywgYlN0YWNrKSkpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gUmVtb3ZlIHRoZSBmaXJzdCBvYmplY3QgZnJvbSB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgYVN0YWNrLnBvcCgpO1xuICAgIGJTdGFjay5wb3AoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyBQZXJmb3JtIGEgZGVlcCBjb21wYXJpc29uIHRvIGNoZWNrIGlmIHR3byBvYmplY3RzIGFyZSBlcXVhbC5cbiAgXy5pc0VxdWFsID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBlcShhLCBiKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIGFycmF5LCBzdHJpbmcsIG9yIG9iamVjdCBlbXB0eT9cbiAgLy8gQW4gXCJlbXB0eVwiIG9iamVjdCBoYXMgbm8gZW51bWVyYWJsZSBvd24tcHJvcGVydGllcy5cbiAgXy5pc0VtcHR5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSAmJiAoXy5pc0FycmF5KG9iaikgfHwgXy5pc1N0cmluZyhvYmopIHx8IF8uaXNBcmd1bWVudHMob2JqKSkpIHJldHVybiBvYmoubGVuZ3RoID09PSAwO1xuICAgIHJldHVybiBfLmtleXMob2JqKS5sZW5ndGggPT09IDA7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIERPTSBlbGVtZW50P1xuICBfLmlzRWxlbWVudCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiAhIShvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGFuIGFycmF5P1xuICAvLyBEZWxlZ2F0ZXMgdG8gRUNNQTUncyBuYXRpdmUgQXJyYXkuaXNBcnJheVxuICBfLmlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSBhbiBvYmplY3Q/XG4gIF8uaXNPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBvYmo7XG4gICAgcmV0dXJuIHR5cGUgPT09ICdmdW5jdGlvbicgfHwgdHlwZSA9PT0gJ29iamVjdCcgJiYgISFvYmo7XG4gIH07XG5cbiAgLy8gQWRkIHNvbWUgaXNUeXBlIG1ldGhvZHM6IGlzQXJndW1lbnRzLCBpc0Z1bmN0aW9uLCBpc1N0cmluZywgaXNOdW1iZXIsIGlzRGF0ZSwgaXNSZWdFeHAsIGlzRXJyb3IuXG4gIF8uZWFjaChbJ0FyZ3VtZW50cycsICdGdW5jdGlvbicsICdTdHJpbmcnLCAnTnVtYmVyJywgJ0RhdGUnLCAnUmVnRXhwJywgJ0Vycm9yJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBfWydpcycgKyBuYW1lXSA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgJyArIG5hbWUgKyAnXSc7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gRGVmaW5lIGEgZmFsbGJhY2sgdmVyc2lvbiBvZiB0aGUgbWV0aG9kIGluIGJyb3dzZXJzIChhaGVtLCBJRSA8IDkpLCB3aGVyZVxuICAvLyB0aGVyZSBpc24ndCBhbnkgaW5zcGVjdGFibGUgXCJBcmd1bWVudHNcIiB0eXBlLlxuICBpZiAoIV8uaXNBcmd1bWVudHMoYXJndW1lbnRzKSkge1xuICAgIF8uaXNBcmd1bWVudHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBfLmhhcyhvYmosICdjYWxsZWUnKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gT3B0aW1pemUgYGlzRnVuY3Rpb25gIGlmIGFwcHJvcHJpYXRlLiBXb3JrIGFyb3VuZCBzb21lIHR5cGVvZiBidWdzIGluIG9sZCB2OCxcbiAgLy8gSUUgMTEgKCMxNjIxKSwgYW5kIGluIFNhZmFyaSA4ICgjMTkyOSkuXG4gIGlmICh0eXBlb2YgLy4vICE9ICdmdW5jdGlvbicgJiYgdHlwZW9mIEludDhBcnJheSAhPSAnb2JqZWN0Jykge1xuICAgIF8uaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT0gJ2Z1bmN0aW9uJyB8fCBmYWxzZTtcbiAgICB9O1xuICB9XG5cbiAgLy8gSXMgYSBnaXZlbiBvYmplY3QgYSBmaW5pdGUgbnVtYmVyP1xuICBfLmlzRmluaXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIGlzRmluaXRlKG9iaikgJiYgIWlzTmFOKHBhcnNlRmxvYXQob2JqKSk7XG4gIH07XG5cbiAgLy8gSXMgdGhlIGdpdmVuIHZhbHVlIGBOYU5gPyAoTmFOIGlzIHRoZSBvbmx5IG51bWJlciB3aGljaCBkb2VzIG5vdCBlcXVhbCBpdHNlbGYpLlxuICBfLmlzTmFOID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8uaXNOdW1iZXIob2JqKSAmJiBvYmogIT09ICtvYmo7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIGJvb2xlYW4/XG4gIF8uaXNCb29sZWFuID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdHJ1ZSB8fCBvYmogPT09IGZhbHNlIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgZXF1YWwgdG8gbnVsbD9cbiAgXy5pc051bGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBudWxsO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgdW5kZWZpbmVkP1xuICBfLmlzVW5kZWZpbmVkID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdm9pZCAwO1xuICB9O1xuXG4gIC8vIFNob3J0Y3V0IGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gcHJvcGVydHkgZGlyZWN0bHlcbiAgLy8gb24gaXRzZWxmIChpbiBvdGhlciB3b3Jkcywgbm90IG9uIGEgcHJvdG90eXBlKS5cbiAgXy5oYXMgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBvYmogIT0gbnVsbCAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbiAgfTtcblxuICAvLyBVdGlsaXR5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJ1biBVbmRlcnNjb3JlLmpzIGluICpub0NvbmZsaWN0KiBtb2RlLCByZXR1cm5pbmcgdGhlIGBfYCB2YXJpYWJsZSB0byBpdHNcbiAgLy8gcHJldmlvdXMgb3duZXIuIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICByb290Ll8gPSBwcmV2aW91c1VuZGVyc2NvcmU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gS2VlcCB0aGUgaWRlbnRpdHkgZnVuY3Rpb24gYXJvdW5kIGZvciBkZWZhdWx0IGl0ZXJhdGVlcy5cbiAgXy5pZGVudGl0eSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIC8vIFByZWRpY2F0ZS1nZW5lcmF0aW5nIGZ1bmN0aW9ucy4gT2Z0ZW4gdXNlZnVsIG91dHNpZGUgb2YgVW5kZXJzY29yZS5cbiAgXy5jb25zdGFudCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG4gIH07XG5cbiAgXy5ub29wID0gZnVuY3Rpb24oKXt9O1xuXG4gIF8ucHJvcGVydHkgPSBwcm9wZXJ0eTtcblxuICAvLyBHZW5lcmF0ZXMgYSBmdW5jdGlvbiBmb3IgYSBnaXZlbiBvYmplY3QgdGhhdCByZXR1cm5zIGEgZ2l2ZW4gcHJvcGVydHkuXG4gIF8ucHJvcGVydHlPZiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT0gbnVsbCA/IGZ1bmN0aW9uKCl7fSA6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIHByZWRpY2F0ZSBmb3IgY2hlY2tpbmcgd2hldGhlciBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gc2V0IG9mXG4gIC8vIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLm1hdGNoZXIgPSBfLm1hdGNoZXMgPSBmdW5jdGlvbihhdHRycykge1xuICAgIGF0dHJzID0gXy5leHRlbmRPd24oe30sIGF0dHJzKTtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gXy5pc01hdGNoKG9iaiwgYXR0cnMpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUnVuIGEgZnVuY3Rpb24gKipuKiogdGltZXMuXG4gIF8udGltZXMgPSBmdW5jdGlvbihuLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciBhY2N1bSA9IEFycmF5KE1hdGgubWF4KDAsIG4pKTtcbiAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQsIDEpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSBhY2N1bVtpXSA9IGl0ZXJhdGVlKGkpO1xuICAgIHJldHVybiBhY2N1bTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIG1pbiBhbmQgbWF4IChpbmNsdXNpdmUpLlxuICBfLnJhbmRvbSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgaWYgKG1heCA9PSBudWxsKSB7XG4gICAgICBtYXggPSBtaW47XG4gICAgICBtaW4gPSAwO1xuICAgIH1cbiAgICByZXR1cm4gbWluICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKTtcbiAgfTtcblxuICAvLyBBIChwb3NzaWJseSBmYXN0ZXIpIHdheSB0byBnZXQgdGhlIGN1cnJlbnQgdGltZXN0YW1wIGFzIGFuIGludGVnZXIuXG4gIF8ubm93ID0gRGF0ZS5ub3cgfHwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9O1xuXG4gICAvLyBMaXN0IG9mIEhUTUwgZW50aXRpZXMgZm9yIGVzY2FwaW5nLlxuICB2YXIgZXNjYXBlTWFwID0ge1xuICAgICcmJzogJyZhbXA7JyxcbiAgICAnPCc6ICcmbHQ7JyxcbiAgICAnPic6ICcmZ3Q7JyxcbiAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICBcIidcIjogJyYjeDI3OycsXG4gICAgJ2AnOiAnJiN4NjA7J1xuICB9O1xuICB2YXIgdW5lc2NhcGVNYXAgPSBfLmludmVydChlc2NhcGVNYXApO1xuXG4gIC8vIEZ1bmN0aW9ucyBmb3IgZXNjYXBpbmcgYW5kIHVuZXNjYXBpbmcgc3RyaW5ncyB0by9mcm9tIEhUTUwgaW50ZXJwb2xhdGlvbi5cbiAgdmFyIGNyZWF0ZUVzY2FwZXIgPSBmdW5jdGlvbihtYXApIHtcbiAgICB2YXIgZXNjYXBlciA9IGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICByZXR1cm4gbWFwW21hdGNoXTtcbiAgICB9O1xuICAgIC8vIFJlZ2V4ZXMgZm9yIGlkZW50aWZ5aW5nIGEga2V5IHRoYXQgbmVlZHMgdG8gYmUgZXNjYXBlZFxuICAgIHZhciBzb3VyY2UgPSAnKD86JyArIF8ua2V5cyhtYXApLmpvaW4oJ3wnKSArICcpJztcbiAgICB2YXIgdGVzdFJlZ2V4cCA9IFJlZ0V4cChzb3VyY2UpO1xuICAgIHZhciByZXBsYWNlUmVnZXhwID0gUmVnRXhwKHNvdXJjZSwgJ2cnKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICBzdHJpbmcgPSBzdHJpbmcgPT0gbnVsbCA/ICcnIDogJycgKyBzdHJpbmc7XG4gICAgICByZXR1cm4gdGVzdFJlZ2V4cC50ZXN0KHN0cmluZykgPyBzdHJpbmcucmVwbGFjZShyZXBsYWNlUmVnZXhwLCBlc2NhcGVyKSA6IHN0cmluZztcbiAgICB9O1xuICB9O1xuICBfLmVzY2FwZSA9IGNyZWF0ZUVzY2FwZXIoZXNjYXBlTWFwKTtcbiAgXy51bmVzY2FwZSA9IGNyZWF0ZUVzY2FwZXIodW5lc2NhcGVNYXApO1xuXG4gIC8vIElmIHRoZSB2YWx1ZSBvZiB0aGUgbmFtZWQgYHByb3BlcnR5YCBpcyBhIGZ1bmN0aW9uIHRoZW4gaW52b2tlIGl0IHdpdGggdGhlXG4gIC8vIGBvYmplY3RgIGFzIGNvbnRleHQ7IG90aGVyd2lzZSwgcmV0dXJuIGl0LlxuICBfLnJlc3VsdCA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHksIGZhbGxiYWNrKSB7XG4gICAgdmFyIHZhbHVlID0gb2JqZWN0ID09IG51bGwgPyB2b2lkIDAgOiBvYmplY3RbcHJvcGVydHldO1xuICAgIGlmICh2YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgICB2YWx1ZSA9IGZhbGxiYWNrO1xuICAgIH1cbiAgICByZXR1cm4gXy5pc0Z1bmN0aW9uKHZhbHVlKSA/IHZhbHVlLmNhbGwob2JqZWN0KSA6IHZhbHVlO1xuICB9O1xuXG4gIC8vIEdlbmVyYXRlIGEgdW5pcXVlIGludGVnZXIgaWQgKHVuaXF1ZSB3aXRoaW4gdGhlIGVudGlyZSBjbGllbnQgc2Vzc2lvbikuXG4gIC8vIFVzZWZ1bCBmb3IgdGVtcG9yYXJ5IERPTSBpZHMuXG4gIHZhciBpZENvdW50ZXIgPSAwO1xuICBfLnVuaXF1ZUlkID0gZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgdmFyIGlkID0gKytpZENvdW50ZXIgKyAnJztcbiAgICByZXR1cm4gcHJlZml4ID8gcHJlZml4ICsgaWQgOiBpZDtcbiAgfTtcblxuICAvLyBCeSBkZWZhdWx0LCBVbmRlcnNjb3JlIHVzZXMgRVJCLXN0eWxlIHRlbXBsYXRlIGRlbGltaXRlcnMsIGNoYW5nZSB0aGVcbiAgLy8gZm9sbG93aW5nIHRlbXBsYXRlIHNldHRpbmdzIHRvIHVzZSBhbHRlcm5hdGl2ZSBkZWxpbWl0ZXJzLlxuICBfLnRlbXBsYXRlU2V0dGluZ3MgPSB7XG4gICAgZXZhbHVhdGUgICAgOiAvPCUoW1xcc1xcU10rPyklPi9nLFxuICAgIGludGVycG9sYXRlIDogLzwlPShbXFxzXFxTXSs/KSU+L2csXG4gICAgZXNjYXBlICAgICAgOiAvPCUtKFtcXHNcXFNdKz8pJT4vZ1xuICB9O1xuXG4gIC8vIFdoZW4gY3VzdG9taXppbmcgYHRlbXBsYXRlU2V0dGluZ3NgLCBpZiB5b3UgZG9uJ3Qgd2FudCB0byBkZWZpbmUgYW5cbiAgLy8gaW50ZXJwb2xhdGlvbiwgZXZhbHVhdGlvbiBvciBlc2NhcGluZyByZWdleCwgd2UgbmVlZCBvbmUgdGhhdCBpc1xuICAvLyBndWFyYW50ZWVkIG5vdCB0byBtYXRjaC5cbiAgdmFyIG5vTWF0Y2ggPSAvKC4pXi87XG5cbiAgLy8gQ2VydGFpbiBjaGFyYWN0ZXJzIG5lZWQgdG8gYmUgZXNjYXBlZCBzbyB0aGF0IHRoZXkgY2FuIGJlIHB1dCBpbnRvIGFcbiAgLy8gc3RyaW5nIGxpdGVyYWwuXG4gIHZhciBlc2NhcGVzID0ge1xuICAgIFwiJ1wiOiAgICAgIFwiJ1wiLFxuICAgICdcXFxcJzogICAgICdcXFxcJyxcbiAgICAnXFxyJzogICAgICdyJyxcbiAgICAnXFxuJzogICAgICduJyxcbiAgICAnXFx1MjAyOCc6ICd1MjAyOCcsXG4gICAgJ1xcdTIwMjknOiAndTIwMjknXG4gIH07XG5cbiAgdmFyIGVzY2FwZXIgPSAvXFxcXHwnfFxccnxcXG58XFx1MjAyOHxcXHUyMDI5L2c7XG5cbiAgdmFyIGVzY2FwZUNoYXIgPSBmdW5jdGlvbihtYXRjaCkge1xuICAgIHJldHVybiAnXFxcXCcgKyBlc2NhcGVzW21hdGNoXTtcbiAgfTtcblxuICAvLyBKYXZhU2NyaXB0IG1pY3JvLXRlbXBsYXRpbmcsIHNpbWlsYXIgdG8gSm9obiBSZXNpZydzIGltcGxlbWVudGF0aW9uLlxuICAvLyBVbmRlcnNjb3JlIHRlbXBsYXRpbmcgaGFuZGxlcyBhcmJpdHJhcnkgZGVsaW1pdGVycywgcHJlc2VydmVzIHdoaXRlc3BhY2UsXG4gIC8vIGFuZCBjb3JyZWN0bHkgZXNjYXBlcyBxdW90ZXMgd2l0aGluIGludGVycG9sYXRlZCBjb2RlLlxuICAvLyBOQjogYG9sZFNldHRpbmdzYCBvbmx5IGV4aXN0cyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXG4gIF8udGVtcGxhdGUgPSBmdW5jdGlvbih0ZXh0LCBzZXR0aW5ncywgb2xkU2V0dGluZ3MpIHtcbiAgICBpZiAoIXNldHRpbmdzICYmIG9sZFNldHRpbmdzKSBzZXR0aW5ncyA9IG9sZFNldHRpbmdzO1xuICAgIHNldHRpbmdzID0gXy5kZWZhdWx0cyh7fSwgc2V0dGluZ3MsIF8udGVtcGxhdGVTZXR0aW5ncyk7XG5cbiAgICAvLyBDb21iaW5lIGRlbGltaXRlcnMgaW50byBvbmUgcmVndWxhciBleHByZXNzaW9uIHZpYSBhbHRlcm5hdGlvbi5cbiAgICB2YXIgbWF0Y2hlciA9IFJlZ0V4cChbXG4gICAgICAoc2V0dGluZ3MuZXNjYXBlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5pbnRlcnBvbGF0ZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuZXZhbHVhdGUgfHwgbm9NYXRjaCkuc291cmNlXG4gICAgXS5qb2luKCd8JykgKyAnfCQnLCAnZycpO1xuXG4gICAgLy8gQ29tcGlsZSB0aGUgdGVtcGxhdGUgc291cmNlLCBlc2NhcGluZyBzdHJpbmcgbGl0ZXJhbHMgYXBwcm9wcmlhdGVseS5cbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBzb3VyY2UgPSBcIl9fcCs9J1wiO1xuICAgIHRleHQucmVwbGFjZShtYXRjaGVyLCBmdW5jdGlvbihtYXRjaCwgZXNjYXBlLCBpbnRlcnBvbGF0ZSwgZXZhbHVhdGUsIG9mZnNldCkge1xuICAgICAgc291cmNlICs9IHRleHQuc2xpY2UoaW5kZXgsIG9mZnNldCkucmVwbGFjZShlc2NhcGVyLCBlc2NhcGVDaGFyKTtcbiAgICAgIGluZGV4ID0gb2Zmc2V0ICsgbWF0Y2gubGVuZ3RoO1xuXG4gICAgICBpZiAoZXNjYXBlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgZXNjYXBlICsgXCIpKT09bnVsbD8nJzpfLmVzY2FwZShfX3QpKStcXG4nXCI7XG4gICAgICB9IGVsc2UgaWYgKGludGVycG9sYXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgaW50ZXJwb2xhdGUgKyBcIikpPT1udWxsPycnOl9fdCkrXFxuJ1wiO1xuICAgICAgfSBlbHNlIGlmIChldmFsdWF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInO1xcblwiICsgZXZhbHVhdGUgKyBcIlxcbl9fcCs9J1wiO1xuICAgICAgfVxuXG4gICAgICAvLyBBZG9iZSBWTXMgbmVlZCB0aGUgbWF0Y2ggcmV0dXJuZWQgdG8gcHJvZHVjZSB0aGUgY29ycmVjdCBvZmZlc3QuXG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfSk7XG4gICAgc291cmNlICs9IFwiJztcXG5cIjtcblxuICAgIC8vIElmIGEgdmFyaWFibGUgaXMgbm90IHNwZWNpZmllZCwgcGxhY2UgZGF0YSB2YWx1ZXMgaW4gbG9jYWwgc2NvcGUuXG4gICAgaWYgKCFzZXR0aW5ncy52YXJpYWJsZSkgc291cmNlID0gJ3dpdGgob2JqfHx7fSl7XFxuJyArIHNvdXJjZSArICd9XFxuJztcblxuICAgIHNvdXJjZSA9IFwidmFyIF9fdCxfX3A9JycsX19qPUFycmF5LnByb3RvdHlwZS5qb2luLFwiICtcbiAgICAgIFwicHJpbnQ9ZnVuY3Rpb24oKXtfX3ArPV9fai5jYWxsKGFyZ3VtZW50cywnJyk7fTtcXG5cIiArXG4gICAgICBzb3VyY2UgKyAncmV0dXJuIF9fcDtcXG4nO1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhciByZW5kZXIgPSBuZXcgRnVuY3Rpb24oc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaicsICdfJywgc291cmNlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgdmFyIHRlbXBsYXRlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuIHJlbmRlci5jYWxsKHRoaXMsIGRhdGEsIF8pO1xuICAgIH07XG5cbiAgICAvLyBQcm92aWRlIHRoZSBjb21waWxlZCBzb3VyY2UgYXMgYSBjb252ZW5pZW5jZSBmb3IgcHJlY29tcGlsYXRpb24uXG4gICAgdmFyIGFyZ3VtZW50ID0gc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaic7XG4gICAgdGVtcGxhdGUuc291cmNlID0gJ2Z1bmN0aW9uKCcgKyBhcmd1bWVudCArICcpe1xcbicgKyBzb3VyY2UgKyAnfSc7XG5cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH07XG5cbiAgLy8gQWRkIGEgXCJjaGFpblwiIGZ1bmN0aW9uLiBTdGFydCBjaGFpbmluZyBhIHdyYXBwZWQgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8uY2hhaW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBfKG9iaik7XG4gICAgaW5zdGFuY2UuX2NoYWluID0gdHJ1ZTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH07XG5cbiAgLy8gT09QXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuICAvLyBJZiBVbmRlcnNjb3JlIGlzIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLCBpdCByZXR1cm5zIGEgd3JhcHBlZCBvYmplY3QgdGhhdFxuICAvLyBjYW4gYmUgdXNlZCBPTy1zdHlsZS4gVGhpcyB3cmFwcGVyIGhvbGRzIGFsdGVyZWQgdmVyc2lvbnMgb2YgYWxsIHRoZVxuICAvLyB1bmRlcnNjb3JlIGZ1bmN0aW9ucy4gV3JhcHBlZCBvYmplY3RzIG1heSBiZSBjaGFpbmVkLlxuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjb250aW51ZSBjaGFpbmluZyBpbnRlcm1lZGlhdGUgcmVzdWx0cy5cbiAgdmFyIHJlc3VsdCA9IGZ1bmN0aW9uKGluc3RhbmNlLCBvYmopIHtcbiAgICByZXR1cm4gaW5zdGFuY2UuX2NoYWluID8gXyhvYmopLmNoYWluKCkgOiBvYmo7XG4gIH07XG5cbiAgLy8gQWRkIHlvdXIgb3duIGN1c3RvbSBmdW5jdGlvbnMgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm1peGluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgXy5lYWNoKF8uZnVuY3Rpb25zKG9iaiksIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBmdW5jID0gX1tuYW1lXSA9IG9ialtuYW1lXTtcbiAgICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gW3RoaXMuX3dyYXBwZWRdO1xuICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiByZXN1bHQodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIEFkZCBhbGwgb2YgdGhlIFVuZGVyc2NvcmUgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyIG9iamVjdC5cbiAgXy5taXhpbihfKTtcblxuICAvLyBBZGQgYWxsIG11dGF0b3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBfLmVhY2goWydwb3AnLCAncHVzaCcsICdyZXZlcnNlJywgJ3NoaWZ0JywgJ3NvcnQnLCAnc3BsaWNlJywgJ3Vuc2hpZnQnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb2JqID0gdGhpcy5fd3JhcHBlZDtcbiAgICAgIG1ldGhvZC5hcHBseShvYmosIGFyZ3VtZW50cyk7XG4gICAgICBpZiAoKG5hbWUgPT09ICdzaGlmdCcgfHwgbmFtZSA9PT0gJ3NwbGljZScpICYmIG9iai5sZW5ndGggPT09IDApIGRlbGV0ZSBvYmpbMF07XG4gICAgICByZXR1cm4gcmVzdWx0KHRoaXMsIG9iaik7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gQWRkIGFsbCBhY2Nlc3NvciBBcnJheSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIuXG4gIF8uZWFjaChbJ2NvbmNhdCcsICdqb2luJywgJ3NsaWNlJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJlc3VsdCh0aGlzLCBtZXRob2QuYXBwbHkodGhpcy5fd3JhcHBlZCwgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gRXh0cmFjdHMgdGhlIHJlc3VsdCBmcm9tIGEgd3JhcHBlZCBhbmQgY2hhaW5lZCBvYmplY3QuXG4gIF8ucHJvdG90eXBlLnZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dyYXBwZWQ7XG4gIH07XG5cbiAgLy8gUHJvdmlkZSB1bndyYXBwaW5nIHByb3h5IGZvciBzb21lIG1ldGhvZHMgdXNlZCBpbiBlbmdpbmUgb3BlcmF0aW9uc1xuICAvLyBzdWNoIGFzIGFyaXRobWV0aWMgYW5kIEpTT04gc3RyaW5naWZpY2F0aW9uLlxuICBfLnByb3RvdHlwZS52YWx1ZU9mID0gXy5wcm90b3R5cGUudG9KU09OID0gXy5wcm90b3R5cGUudmFsdWU7XG5cbiAgXy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJycgKyB0aGlzLl93cmFwcGVkO1xuICB9O1xuXG4gIC8vIEFNRCByZWdpc3RyYXRpb24gaGFwcGVucyBhdCB0aGUgZW5kIGZvciBjb21wYXRpYmlsaXR5IHdpdGggQU1EIGxvYWRlcnNcbiAgLy8gdGhhdCBtYXkgbm90IGVuZm9yY2UgbmV4dC10dXJuIHNlbWFudGljcyBvbiBtb2R1bGVzLiBFdmVuIHRob3VnaCBnZW5lcmFsXG4gIC8vIHByYWN0aWNlIGZvciBBTUQgcmVnaXN0cmF0aW9uIGlzIHRvIGJlIGFub255bW91cywgdW5kZXJzY29yZSByZWdpc3RlcnNcbiAgLy8gYXMgYSBuYW1lZCBtb2R1bGUgYmVjYXVzZSwgbGlrZSBqUXVlcnksIGl0IGlzIGEgYmFzZSBsaWJyYXJ5IHRoYXQgaXNcbiAgLy8gcG9wdWxhciBlbm91Z2ggdG8gYmUgYnVuZGxlZCBpbiBhIHRoaXJkIHBhcnR5IGxpYiwgYnV0IG5vdCBiZSBwYXJ0IG9mXG4gIC8vIGFuIEFNRCBsb2FkIHJlcXVlc3QuIFRob3NlIGNhc2VzIGNvdWxkIGdlbmVyYXRlIGFuIGVycm9yIHdoZW4gYW5cbiAgLy8gYW5vbnltb3VzIGRlZmluZSgpIGlzIGNhbGxlZCBvdXRzaWRlIG9mIGEgbG9hZGVyIHJlcXVlc3QuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoJ3VuZGVyc2NvcmUnLCBbXSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXztcbiAgICB9KTtcbiAgfVxufS5jYWxsKHRoaXMpKTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBTT1NJID0gcmVxdWlyZSgnLi9zb3NpJyk7XG53aW5kb3cuU09TSSA9IFNPU0k7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcblxuLyoqXG4gKiBUaGlzIGlzIGFkb3B0ZWQgZnJvbSBiYWNrYm9uZS5qcyB3aGljaFxuICogaXMgYXZhaWxhYmxlIGZvciB1c2UgdW5kZXIgdGhlIE1JVCBzb2Z0d2FyZSBsaWNlbnNlLlxuICogc2VlIGh0dHA6Ly9naXRodWIuY29tL2phc2hrZW5hcy9iYWNrYm9uZS9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxudmFyIEJhc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuXG5fLmV4dGVuZChCYXNlLnByb3RvdHlwZSwge1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHt9XG59KTtcblxuQmFzZS5leHRlbmQgPSBmdW5jdGlvbiAocHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICB2YXIgcGFyZW50ID0gdGhpcztcbiAgICB2YXIgY2hpbGQ7XG5cbiAgICBpZiAocHJvdG9Qcm9wcyAmJiBfLmhhcyhwcm90b1Byb3BzLCAnY29uc3RydWN0b3InKSkge1xuICAgICAgICBjaGlsZCA9IHByb3RvUHJvcHMuY29uc3RydWN0b3I7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY2hpbGQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBwYXJlbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgICB9XG4gICAgICAgIF8uZXh0ZW5kKGNoaWxkLCBwYXJlbnQsIHN0YXRpY1Byb3BzKTtcbiAgICB2YXIgU3Vycm9nYXRlID0gZnVuY3Rpb24gKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH07XG4gICAgU3Vycm9nYXRlLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7XG4gICAgY2hpbGQucHJvdG90eXBlID0gbmV3IFN1cnJvZ2F0ZSgpO1xuICAgIGlmIChwcm90b1Byb3BzKSB7XG4gICAgICAgIF8uZXh0ZW5kKGNoaWxkLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgfVxuICAgIGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7XG5cbiAgICByZXR1cm4gY2hpbGQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2U7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciBCYXNlID0gcmVxdWlyZSgnLi4vY2xhc3MvQmFzZScpO1xudmFyIFBvaW50ID0gcmVxdWlyZSgnLi4vZ2VvbWV0cnkvUG9pbnQnKTtcbnZhciBMaW5lU3RyaW5nID0gcmVxdWlyZSgnLi4vZ2VvbWV0cnkvTGluZVN0cmluZycpO1xudmFyIFBvbHlnb24gPSByZXF1aXJlKCcuLi9nZW9tZXRyeS9Qb2x5Z29uJyk7XG52YXIgd3JpdGVQb2ludCA9IHJlcXVpcmUoJy4vd3JpdGVQb2ludCcpO1xuXG5cbnZhciBTb3NpMkdlb0pTT04gPSBCYXNlLmV4dGVuZCh7XG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoc29zaWRhdGEpIHtcbiAgICAgICAgdGhpcy5zb3NpZGF0YSA9IHNvc2lkYXRhO1xuICAgIH0sXG5cbiAgICBkdW1wczogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3R5cGUnOiAnRmVhdHVyZUNvbGxlY3Rpb24nLFxuICAgICAgICAgICAgJ2ZlYXR1cmVzJzogdGhpcy5nZXRGZWF0dXJlcygpLFxuICAgICAgICAgICAgJ2Nycyc6IHRoaXMud3JpdGVDcnMoKVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBnZXRGZWF0dXJlczogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gXy5tYXAoXG4gICAgICAgICAgICB0aGlzLnNvc2lkYXRhLmZlYXR1cmVzLmFsbCgpLFxuICAgICAgICAgICAgdGhpcy5jcmVhdGVHZW9Kc29uRmVhdHVyZSxcbiAgICAgICAgICAgIHRoaXNcbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgY3JlYXRlR2VvSnNvbkZlYXR1cmU6IGZ1bmN0aW9uIChzb3NpZmVhdHVyZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ3R5cGUnOiAnRmVhdHVyZScsXG4gICAgICAgICAgICAnaWQnOiBzb3NpZmVhdHVyZS5pZCxcbiAgICAgICAgICAgICdwcm9wZXJ0aWVzJzogc29zaWZlYXR1cmUuYXR0cmlidXRlcyxcbiAgICAgICAgICAgICdnZW9tZXRyeSc6IHRoaXMud3JpdGVHZW9tZXRyeShzb3NpZmVhdHVyZS5nZW9tZXRyeSlcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgd3JpdGVHZW9tZXRyeTogZnVuY3Rpb24gKGdlb20pIHtcbiAgICAgICAgaWYgKGdlb20gaW5zdGFuY2VvZiBQb2ludCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdQb2ludCcsXG4gICAgICAgICAgICAgICAgJ2Nvb3JkaW5hdGVzJzogd3JpdGVQb2ludChnZW9tKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChnZW9tIGluc3RhbmNlb2YgTGluZVN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdMaW5lU3RyaW5nJyxcbiAgICAgICAgICAgICAgICAnY29vcmRpbmF0ZXMnOiBfLm1hcChnZW9tLmt1cnZlLCB3cml0ZVBvaW50KVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChnZW9tIGluc3RhbmNlb2YgUG9seWdvbikge1xuICAgICAgICAgICAgdmFyIHNoZWxsID0gXy5tYXAoZ2VvbS5mbGF0ZSwgd3JpdGVQb2ludCk7XG4gICAgICAgICAgICB2YXIgaG9sZXMgPSBfLm1hcChnZW9tLmhvbGVzLCBmdW5jdGlvbiAoaG9sZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfLm1hcChob2xlLCB3cml0ZVBvaW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAndHlwZSc6ICdQb2x5Z29uJyxcbiAgICAgICAgICAgICAgICAnY29vcmRpbmF0ZXMnOiBbc2hlbGxdLmNvbmNhdChob2xlcylcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3Qgd3JpdGUgZ2VvbWV0cnkhJyk7XG4gICAgfSxcblxuICAgIHdyaXRlQ3JzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAndHlwZSc6ICduYW1lJyxcbiAgICAgICAgICAgICdwcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgICAgICduYW1lJzogdGhpcy5zb3NpZGF0YS5ob2RlLnNyaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTb3NpMkdlb0pTT047XG4iLCIndXNlIHN0cmljdCc7XG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciBCYXNlID0gcmVxdWlyZSgnLi4vY2xhc3MvQmFzZScpO1xudmFyIFBvaW50ID0gcmVxdWlyZSgnLi4vZ2VvbWV0cnkvUG9pbnQnKTtcbnZhciBMaW5lU3RyaW5nID0gcmVxdWlyZSgnLi4vZ2VvbWV0cnkvTGluZVN0cmluZycpO1xudmFyIFBvbHlnb24gPSByZXF1aXJlKCcuLi9nZW9tZXRyeS9Qb2x5Z29uJyk7XG52YXIgd3JpdGVQb2ludCA9IHJlcXVpcmUoJy4vd3JpdGVQb2ludCcpO1xuXG5cbmZ1bmN0aW9uIG1hcEFyY3MocmVmcywgbGluZXMpIHtcbiAgICByZXR1cm4gXy5tYXAocmVmcywgZnVuY3Rpb24gKHJlZikge1xuICAgICAgICB2YXIgaW5kZXggPSBsaW5lc1tNYXRoLmFicyhyZWYpXS5pbmRleDtcbiAgICAgICAgaWYgKHJlZiA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAtKE1hdGguYWJzKGluZGV4KSArIDEpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cblxudmFyIFNvc2kyVG9wb0pTT04gPSBCYXNlLmV4dGVuZCh7XG5cbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoc29zaWRhdGEpIHtcbiAgICAgICAgdGhpcy5zb3NpZGF0YSA9IHNvc2lkYXRhO1xuICAgIH0sXG5cbiAgICBkdW1wczogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgdmFyIHBvaW50cyA9IHRoaXMuZ2V0UG9pbnRzKCk7XG4gICAgICAgIHZhciBsaW5lcyA9IHRoaXMuZ2V0TGluZXMoKTtcbiAgICAgICAgdmFyIHBvbHlnb25zID0gdGhpcy5nZXRQb2x5Z29ucyhsaW5lcyk7XG4gICAgICAgIHZhciBnZW9tZXRyaWVzID0gcG9pbnRzLmNvbmNhdChfLm1hcChsaW5lcywgZnVuY3Rpb24gKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBsaW5lLmdlb21ldHJ5O1xuICAgICAgICB9KSkuY29uY2F0KHBvbHlnb25zKTtcblxuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgICd0eXBlJzogJ1RvcG9sb2d5JyxcbiAgICAgICAgICAgICdvYmplY3RzJzoge31cbiAgICAgICAgfTtcbiAgICAgICAgZGF0YS5vYmplY3RzW25hbWVdID0ge1xuICAgICAgICAgICAgJ3R5cGUnOiAnR2VvbWV0cnlDb2xsZWN0aW9uJyxcbiAgICAgICAgICAgICdnZW9tZXRyaWVzJzogZ2VvbWV0cmllc1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBhcmNzID0gXy5tYXAoXy5zb3J0QnkobGluZXMsIGZ1bmN0aW9uIChsaW5lKSB7cmV0dXJuIGxpbmUuaW5kZXg7IH0pLCBmdW5jdGlvbiAobGluZSkge1xuICAgICAgICAgICAgcmV0dXJuIGxpbmUuYXJjO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoYXJjcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGRhdGEuYXJjcyA9IGFyY3M7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfSxcblxuICAgIGdldEJ5VHlwZTogZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIF8uZmlsdGVyKHRoaXMuc29zaWRhdGEuZmVhdHVyZXMuYWxsKCksIGZ1bmN0aW9uIChmZWF0dXJlKSB7XG4gICAgICAgICAgICByZXR1cm4gKGZlYXR1cmUuZ2VvbWV0cnkgaW5zdGFuY2VvZiB0eXBlKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGdldFBvaW50czogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcG9pbnRzID0gdGhpcy5nZXRCeVR5cGUoUG9pbnQpO1xuICAgICAgICByZXR1cm4gXy5tYXAocG9pbnRzLCBmdW5jdGlvbiAocG9pbnQpIHtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gXy5jbG9uZShwb2ludC5hdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMuaWQgPSBwb2ludC5pZDtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnUG9pbnQnLFxuICAgICAgICAgICAgICAgICdwcm9wZXJ0aWVzJzogcHJvcGVydGllcyxcbiAgICAgICAgICAgICAgICAnY29vcmRpbmF0ZXMnOiB3cml0ZVBvaW50KHBvaW50Lmdlb21ldHJ5KVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGdldExpbmVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsaW5lcyA9IHRoaXMuZ2V0QnlUeXBlKExpbmVTdHJpbmcpO1xuICAgICAgICByZXR1cm4gXy5yZWR1Y2UobGluZXMsIGZ1bmN0aW9uIChyZXMsIGxpbmUsIGluZGV4KSB7XG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IF8uY2xvbmUobGluZS5hdHRyaWJ1dGVzKTtcbiAgICAgICAgICAgIHByb3BlcnRpZXMuaWQgPSBsaW5lLmlkO1xuICAgICAgICAgICAgcmVzW2xpbmUuaWRdID0ge1xuICAgICAgICAgICAgICAgICdnZW9tZXRyeSc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3R5cGUnOiAnTGluZVN0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICdwcm9wZXJ0aWVzJzogcHJvcGVydGllcyxcbiAgICAgICAgICAgICAgICAgICAgJ2FyY3MnOiBbaW5kZXhdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnYXJjJzogXy5tYXAobGluZS5nZW9tZXRyeS5rdXJ2ZSwgd3JpdGVQb2ludCksXG4gICAgICAgICAgICAgICAgJ2luZGV4JzogaW5kZXhcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9LCB7fSk7XG4gICAgfSxcblxuICAgIGdldFBvbHlnb25zOiBmdW5jdGlvbiAobGluZXMpIHtcbiAgICAgICAgdmFyIHBvbHlnb25zID0gdGhpcy5nZXRCeVR5cGUoUG9seWdvbik7XG4gICAgICAgIHJldHVybiBfLm1hcChwb2x5Z29ucywgZnVuY3Rpb24gKHBvbHlnb24pIHtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gXy5jbG9uZShwb2x5Z29uLmF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgcHJvcGVydGllcy5pZCA9IHBvbHlnb24uaWQ7XG5cbiAgICAgICAgICAgIHZhciBhcmNzID0gW21hcEFyY3MocG9seWdvbi5nZW9tZXRyeS5zaGVsbFJlZnMsIGxpbmVzKV07XG5cbiAgICAgICAgICAgIGFyY3MgPSBhcmNzLmNvbmNhdChfLm1hcChwb2x5Z29uLmdlb21ldHJ5LmhvbGVSZWZzLCBmdW5jdGlvbiAoaG9sZSkge1xuICAgICAgICAgICAgICAgIGlmIChob2xlLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmVhdHVyZSA9IHRoaXMuc29zaWRhdGEuZmVhdHVyZXMuZ2V0QnlJZChNYXRoLmFicyhob2xlWzBdKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmZWF0dXJlLmdlb21ldHJ5IGluc3RhbmNlb2YgUG9seWdvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1hcEFyY3MoZmVhdHVyZS5nZW9tZXRyeS5zaGVsbFJlZnMsIGxpbmVzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbWFwQXJjcyhob2xlLCBsaW5lcyk7XG4gICAgICAgICAgICB9LCB0aGlzKSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ3R5cGUnOiAnUG9seWdvbicsXG4gICAgICAgICAgICAgICAgJ3Byb3BlcnRpZXMnOiBwcm9wZXJ0aWVzLFxuICAgICAgICAgICAgICAgICdhcmNzJzogYXJjc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU29zaTJUb3BvSlNPTjtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gd3JpdGVQb2ludChwb2ludCkge1xuICAgIHJldHVybiBbcG9pbnQueCwgcG9pbnQueV07XG59XG5tb2R1bGUuZXhwb3J0cyA9IHdyaXRlUG9pbnQ7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciBCYXNlID0gcmVxdWlyZSgnLi4vY2xhc3MvQmFzZScpO1xudmFyIFBvaW50ID0gcmVxdWlyZSgnLi9Qb2ludCcpO1xuXG52YXIgTGluZVN0cmluZyA9IEJhc2UuZXh0ZW5kKHtcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAobGluZXMsIG9yaWdvLCB1bml0KSB7XG4gICAgICAgIHRoaXMua3VydmUgPSBfLmNvbXBhY3QoXy5tYXAobGluZXMsIGZ1bmN0aW9uIChsaW5lKSB7XG4gICAgICAgICAgICBpZiAobGluZS5pbmRleE9mKCdOw5gnKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFBvaW50KGxpbmUsIG9yaWdvLCB1bml0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHRoaXMua251dGVwdW5rdGVyID0gXy5maWx0ZXIodGhpcy5rdXJ2ZSwgZnVuY3Rpb24gKHB1bmt0KSB7XG4gICAgICAgICAgICByZXR1cm4gcHVua3QuaGFzX3RpZXBvaW50O1xuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaW5lU3RyaW5nO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG52YXIgUG9pbnQgPSByZXF1aXJlKCcuL1BvaW50Jyk7XG52YXIgTGluZVN0cmluZyA9IHJlcXVpcmUoJy4vTGluZVN0cmluZycpO1xuXG5mdW5jdGlvbiBjbGVhbkxpbmVzKGxpbmVzKSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGxpbmVzLCBmdW5jdGlvbiAobGluZSkge1xuICAgICAgICByZXR1cm4gKGxpbmUuaW5kZXhPZignTsOYJykgPT09IC0xKTtcbiAgICB9KTtcbn1cblxudmFyIExpbmVTdHJpbmdGcm9tQXJjID0gTGluZVN0cmluZy5leHRlbmQoeyAvLyBCVUVQIC0gYW4gYXJjIGRlZmluZWQgYnkgdGhyZWUgcG9pbnRzIG9uIGEgY2lyY2xlXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGxpbmVzLCBvcmlnbywgdW5pdCkge1xuICAgICAgICB2YXIgcCA9IF8ubWFwKGNsZWFuTGluZXMobGluZXMpLCBmdW5jdGlvbiAoY29vcmQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUG9pbnQoY29vcmQsIG9yaWdvLCB1bml0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChwLmxlbmd0aCAhPT0gMykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCVUVQIGVyIGlra2UgZGVmaW5lcnQgbWVkIDMgcHVua3RlcicpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGluIG9yZGVyIHRvIGNvcHkgJiBwYXN0ZSBteSBvd24gZm9ybXVsYXMsIHdlIHVzZSB0aGUgc2FtZSB2YXJpYWJsZSBuYW1lc1xuICAgICAgICB2YXIgZTEgPSBwWzBdLngsIGUyID0gcFsxXS54LCBlMyA9IHBbMl0ueDtcbiAgICAgICAgdmFyIG4xID0gcFswXS55LCBuMiA9IHBbMV0ueSwgbjMgPSBwWzJdLnk7XG5cbiAgICAgICAgLy8gaGVscGVyIGNvbnN0YW50c1xuICAgICAgICB2YXIgcDEyICA9IChlMSAqIGUxIC0gZTIgKiBlMiArIG4xICogbjEgLSBuMiAqIG4yKSAvIDIuMDtcbiAgICAgICAgdmFyIHAxMyAgPSAoZTEgKiBlMSAtIGUzICogZTMgKyBuMSAqIG4xIC0gbjMgKiBuMykgLyAyLjA7XG5cbiAgICAgICAgdmFyIGRFMTIgPSBlMSAtIGUyLFxuICAgICAgICAgICAgZEUxMyA9IGUxIC0gZTMsXG4gICAgICAgICAgICBkTjEyID0gbjEgLSBuMixcbiAgICAgICAgICAgIGROMTMgPSBuMSAtIG4zO1xuXG4gICAgICAgIC8vIGNlbnRlciBvZiB0aGUgY2lyY2xlXG4gICAgICAgIHZhciBjRSA9IChkTjEzICogcDEyIC0gZE4xMiAqIHAxMykgLyAoZEUxMiAqIGROMTMgLSBkTjEyICogZEUxMyk7XG4gICAgICAgIHZhciBjTiA9IChkRTEzICogcDEyIC0gZEUxMiAqIHAxMykgLyAoZE4xMiAqIGRFMTMgLSBkRTEyICogZE4xMyk7XG5cbiAgICAgICAgLy8gcmFkaXVzIG9mIHRoZSBjaXJjbGVcbiAgICAgICAgdmFyIHIgPSBNYXRoLnNxcnQoTWF0aC5wb3coZTEgLSBjRSwgMikgKyBNYXRoLnBvdyhuMSAtIGNOLCAyKSk7XG5cbiAgICAgICAgLyogYW5nbGVzIG9mIHBvaW50cyBBIGFuZCBCICgxIGFuZCAzKSAqL1xuICAgICAgICB2YXIgdGgxID0gTWF0aC5hdGFuMihuMSAtIGNOLCBlMSAtIGNFKTtcbiAgICAgICAgdmFyIHRoMyA9IE1hdGguYXRhbjIobjMgLSBjTiwgZTMgLSBjRSk7XG5cbiAgICAgICAgLyogaW50ZXJwb2xhdGlvbiBzdGVwIGluIHJhZGlhbnMgKi9cbiAgICAgICAgdmFyIGR0aCA9IHRoMyAtIHRoMTtcbiAgICAgICAgaWYgKGR0aCA8IDApIHtcbiAgICAgICAgICAgIGR0aCAgKz0gMiAqIE1hdGguUEk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGR0aCA+IE1hdGguUEkpIHtcbiAgICAgICAgICAgIGR0aCA9IC0yICogTWF0aC5QSSArIGR0aDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbnB0ID0gTWF0aC5mbG9vcigzMiAqIGR0aCAvIDIgKiBNYXRoLlBJKTtcbiAgICAgICAgaWYgKG5wdCA8IDApIHtcbiAgICAgICAgICAgIG5wdCA9IC1ucHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5wdCA8IDMpIHtcbiAgICAgICAgICAgIG5wdCA9IDM7XG4gICAgICAgIH1cblxuICAgICAgICBkdGggPSBkdGggLyAobnB0IC0gMSk7XG5cbiAgICAgICAgdGhpcy5rdXJ2ZSA9IF8ubWFwKF8ucmFuZ2UobnB0KSwgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHZhciB4ICA9IGNFICsgciAqIE1hdGguY29zKHRoMSArIGR0aCAqIGkpO1xuICAgICAgICAgICAgdmFyIHkgPSBjTiArIHIgKiBNYXRoLnNpbih0aDEgKyBkdGggKiBpKTtcbiAgICAgICAgICAgIGlmIChpc05hTih4KSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQlVFUDogSW50ZXJwb2xhdGVkICcgKyB4ICsgJyBmb3IgcG9pbnQgJyArIGkgKyAnIG9mICcgKyBucHQgKyAnIGluIGN1cnZlLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQb2ludCh4LCB5KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5rbnV0ZXB1bmt0ZXIgPSBfLmZpbHRlcihwLCBmdW5jdGlvbiAocG9pbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBwb2ludC5oYXNfdGllcG9pbnQ7XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTGluZVN0cmluZ0Zyb21BcmM7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciBCYXNlID0gcmVxdWlyZSgnLi4vY2xhc3MvQmFzZScpO1xudmFyIHJvdW5kVG9EZWNpbWFscyA9IHJlcXVpcmUoJy4uL3V0aWwvcm91bmQnKTtcblxuXG52YXIgUG9pbnQgPSBCYXNlLmV4dGVuZCh7XG5cbiAgICBrbnV0ZXB1bmt0OiBmYWxzZSxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChsaW5lLCBvcmlnbywgdW5pdCkge1xuICAgICAgICBpZiAoXy5pc051bWJlcihsaW5lKSkgeyAvKiBpbml0aWFsaXplZCBkaXJlY3RseSB3aXRoIHggYW5kIHkgKi9cbiAgICAgICAgICAgIHRoaXMueCA9IGxpbmU7XG4gICAgICAgICAgICB0aGlzLnkgPSBvcmlnbztcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLmlzQXJyYXkobGluZSkpIHtcbiAgICAgICAgICAgIGxpbmUgPSBsaW5lWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvb3JkcyA9IGxpbmUuc3BsaXQoL1xccysvKTtcblxuICAgICAgICB2YXIgbnVtRGVjaW1hbHMgPSAwO1xuICAgICAgICBpZiAodW5pdCA8IDEpIHtcbiAgICAgICAgICAgIG51bURlY2ltYWxzID0gLU1hdGguZmxvb3IoTWF0aC5sb2codW5pdCkgLyBNYXRoLkxOMTApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy55ID0gcm91bmRUb0RlY2ltYWxzKChwYXJzZUludChjb29yZHNbMF0sIDEwKSAqIHVuaXQpICsgb3JpZ28ueSwgbnVtRGVjaW1hbHMpO1xuICAgICAgICB0aGlzLnggPSByb3VuZFRvRGVjaW1hbHMoKHBhcnNlSW50KGNvb3Jkc1sxXSwgMTApICogdW5pdCkgKyBvcmlnby54LCBudW1EZWNpbWFscyk7XG5cbiAgICAgICAgaWYgKGNvb3Jkc1syXSAmJiAhaXNOYU4oY29vcmRzWzJdKSkge1xuICAgICAgICAgICAgdGhpcy56ID0gcm91bmRUb0RlY2ltYWxzKHBhcnNlSW50KGNvb3Jkc1syXSwgMTApICogdW5pdCwgbnVtRGVjaW1hbHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpbmUuaW5kZXhPZignLktQJykgIT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLnNldFRpZXBvaW50KFxuICAgICAgICAgICAgICAgIGxpbmUuc3Vic3RyaW5nKGxpbmUuaW5kZXhPZignLktQJyksIGxpbmUubGVuZ3RoKS5zcGxpdCgnICcpWzFdXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHNldFRpZXBvaW50OiBmdW5jdGlvbiAoa29kZSkge1xuICAgICAgICB0aGlzLmhhc190aWVwb2ludCA9IHRydWU7XG4gICAgICAgIHRoaXMua251dGVwdW5rdGtvZGUgPSBwYXJzZUludChrb2RlLCAxMCk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUG9pbnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyIEJhc2UgPSByZXF1aXJlKCcuLi9jbGFzcy9CYXNlJyk7XG5cbmZ1bmN0aW9uIGNyZWF0ZVBvbHlnb24ocmVmcywgZmVhdHVyZXMpIHtcbiAgICB2YXIgZmxhdGUgPSAgXy5mbGF0dGVuKF8ubWFwKHJlZnMsIGZ1bmN0aW9uIChyZWYpIHtcbiAgICAgICAgdmFyIGlkID0gTWF0aC5hYnMocmVmKTtcbiAgICAgICAgdmFyIGt1cnZlID0gZmVhdHVyZXMuZ2V0QnlJZChpZCk7XG4gICAgICAgIGlmICgha3VydmUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmFudCBpa2tlIEtVUlZFICcgKyBpZCArICcgZm9yIEZMQVRFJyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGdlb20gPSBrdXJ2ZS5nZW9tZXRyeS5rdXJ2ZTtcbiAgICAgICAgaWYgKHJlZiA8IDApIHtcbiAgICAgICAgICAgIGdlb20gPSBfLmNsb25lKGdlb20pLnJldmVyc2UoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXy5pbml0aWFsKGdlb20pO1xuICAgIH0pKTtcbiAgICBmbGF0ZS5wdXNoKGZsYXRlWzBdKTtcbiAgICByZXR1cm4gZmxhdGU7XG59XG5cbmZ1bmN0aW9uIHBhcnNlUmVmcyhyZWZzKSB7XG4gICAgcmV0dXJuIF8ubWFwKHJlZnMudHJpbSgpLnNwbGl0KCcgJyksIGZ1bmN0aW9uIChyZWYpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHJlZi5yZXBsYWNlKCc6JywgJycpLCAxMCk7XG4gICAgfSk7XG59XG5cbnZhciBQb2x5Z29uID0gQmFzZS5leHRlbmQoe1xuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAocmVmcywgZmVhdHVyZXMpIHtcbiAgICAgICAgICAgIHZhciBzaGVsbCA9IHJlZnM7XG4gICAgICAgICAgICB2YXIgaG9sZXMgPSBbXTtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHJlZnMuaW5kZXhPZignKCcpO1xuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHNoZWxsID0gcmVmcy5zdWJzdHIoMCwgaW5kZXgpO1xuICAgICAgICAgICAgICAgIGhvbGVzID0gcmVmcy5zdWJzdHIoaW5kZXgsIHJlZnMubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2hlbGwgPSBwYXJzZVJlZnMoc2hlbGwpO1xuICAgICAgICAgICAgaG9sZXMgPSBfLm1hcChcbiAgICAgICAgICAgICAgICBfLnJlZHVjZShob2xlcywgZnVuY3Rpb24gKHJlc3VsdCwgY2hhcmFjdGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFyYWN0ZXIgPT09ICcoJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goJycpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoYXJhY3RlciAhPT0gJyknICYmIGNoYXJhY3RlciAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV0gKz0gY2hhcmFjdGVyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfSwgW10pLFxuICAgICAgICAgICAgICAgIHBhcnNlUmVmc1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdGhpcy5mbGF0ZSA9IGNyZWF0ZVBvbHlnb24oc2hlbGwsIGZlYXR1cmVzKTtcblxuICAgICAgICAgICAgdGhpcy5ob2xlcyA9IF8ubWFwKGhvbGVzLCBmdW5jdGlvbiAoaG9sZSkge1xuICAgICAgICAgICAgICAgIGlmIChob2xlLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmVhdHVyZSA9IGZlYXR1cmVzLmdldEJ5SWQoTWF0aC5hYnMoaG9sZVswXSkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmVhdHVyZS5nZW9tZXRyeVR5cGUgPT09ICdGTEFURScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmZWF0dXJlLmdlb21ldHJ5LmZsYXRlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVQb2x5Z29uKGhvbGUsIGZlYXR1cmVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5zaGVsbFJlZnMgPSBzaGVsbDtcbiAgICAgICAgICAgIHRoaXMuaG9sZVJlZnMgPSBob2xlcztcbiAgICAgICAgfVxuICAgIH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBvbHlnb247XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyIHBhcnNlVHJlZSA9IHJlcXVpcmUoJy4vdXRpbC9wYXJzZVRyZWUnKTtcbnZhciBCYXNlID0gcmVxdWlyZSgnLi9jbGFzcy9CYXNlJyk7XG52YXIgSGVhZCA9IHJlcXVpcmUoJy4vdHlwZXMvSGVhZCcpO1xudmFyIEZlYXR1cmVzID0gcmVxdWlyZSgnLi90eXBlcy9GZWF0dXJlcycpO1xuXG52YXIgU29zaTJHZW9KU09OID0gcmVxdWlyZSgnLi9kdW1wZXJzL1Nvc2kyR2VvSlNPTicpO1xudmFyIFNvc2kyVG9wb0pTT04gPSByZXF1aXJlKCcuL2R1bXBlcnMvU29zaTJUb3BvSlNPTicpO1xuXG52YXIgRGVmID0gQmFzZS5leHRlbmQoe30pO1xuXG52YXIgT2JqZGVmID0gQmFzZS5leHRlbmQoe30pO1xuXG52YXIgZHVtcFR5cGVzID0ge1xuICAgICdnZW9qc29uJzogU29zaTJHZW9KU09OLFxuICAgICd0b3BvanNvbic6IFNvc2kyVG9wb0pTT05cbn07XG5cbnZhciBTb3NpRGF0YSA9IEJhc2UuZXh0ZW5kKHtcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICB0aGlzLmhvZGUgPSBuZXcgSGVhZChkYXRhWydIT0RFJ10gfHwgZGF0YVsnSE9ERSAwJ10pO1xuICAgICAgICB0aGlzLmRlZiA9IG5ldyBEZWYoZGF0YVsnREVGJ10pOyAvL05vdCBzdXJlIGlmIEkgd2lsbCBjYXJlIGFib3V0IHRoaXNcbiAgICAgICAgdGhpcy5vYmpkZWYgPSBuZXcgT2JqZGVmKGRhdGFbJ09CSkRFRiddKTsgLy9Ob3Qgc3VyZSBpZiBJIHdpbGwgY2FyZSBhYm91dCB0aGlzXG4gICAgICAgIHRoaXMuZmVhdHVyZXMgPSBuZXcgRmVhdHVyZXMoXG4gICAgICAgICAgICBfLm9taXQoZGF0YSwgWydIT0RFJywgJ0hPREUgMCcsICdERUYnLCAnT0JKREVGJywgJ1NMVVRUJ10pLFxuICAgICAgICAgICAgdGhpcy5ob2RlXG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIGR1bXBzOiBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIGlmIChkdW1wVHlwZXNbZm9ybWF0XSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBkdW1wVHlwZXNbZm9ybWF0XSh0aGlzKS5kdW1wcyhfLnJlc3QoYXJndW1lbnRzKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPdXRwdXRmb3JtYXQgJyArIGZvcm1hdCArICcgaXMgbm90IHN1cHBvcnRlZCEnKTtcbiAgICB9XG59KTtcblxuXG5mdW5jdGlvbiBzcGxpdE9uTmV3bGluZShkYXRhKSB7XG4gICAgcmV0dXJuIF8ubWFwKGRhdGEuc3BsaXQoJ1xcbicpLCBmdW5jdGlvbiAobGluZSkge1xuXG4gICAgICAgIC8vaWdub3JlIGNvbW1lbnRzIHN0YXJ0aW5nIHdpdGggISBhbHNvIGluIHRoZSBtaWRkbGUgb2YgdGhlIGxpbmVcbiAgICAgICAgaWYgKGxpbmUuaW5kZXhPZignIScpICE9PSAwKSB7XG4gICAgICAgICAgICBsaW5lID0gbGluZS5zcGxpdCgnIScpWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdHJpbSB3aGl0ZXNwYWNlIHBhZGRpbmcgY29tbWVudHMgYW5kIGVsc2V3aGVyZVxuICAgICAgICByZXR1cm4gbGluZS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7IFxuICAgIH0pO1xufVxuXG52YXIgUGFyc2VyID0gQmFzZS5leHRlbmQoe1xuXG4gICAgcGFyc2U6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHJldHVybiBuZXcgU29zaURhdGEocGFyc2VUcmVlKHNwbGl0T25OZXdsaW5lKGRhdGEpLCAxKSk7XG4gICAgfSxcblxuICAgIGdldEZvcm1hdHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF8ua2V5cyhkdW1wVHlwZXMpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhcnNlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHBhcnNlciA9IHJlcXVpcmUoJy4vcGFyc2VyJyk7XG5cbnZhciBTT1NJID0ge1xuICAgIFBhcnNlcjogcGFyc2VyXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNPU0k7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciBCYXNlID0gcmVxdWlyZSgnLi4vY2xhc3MvQmFzZScpO1xuXG52YXIgUG9pbnQgPSByZXF1aXJlKCcuLi9nZW9tZXRyeS9Qb2ludCcpO1xudmFyIExpbmVTdHJpbmcgPSByZXF1aXJlKCcuLi9nZW9tZXRyeS9MaW5lU3RyaW5nJyk7XG52YXIgTGluZVN0cmluZ0Zyb21BcmMgPSByZXF1aXJlKCcuLi9nZW9tZXRyeS9MaW5lU3RyaW5nRnJvbUFyYycpO1xudmFyIFBvbHlnb24gPSByZXF1aXJlKCcuLi9nZW9tZXRyeS9Qb2x5Z29uJyk7XG5cbnZhciBwYXJzZUZyb21MZXZlbDIgPSByZXF1aXJlKCcuLi91dGlsL3BhcnNlRnJvbUxldmVsMicpO1xudmFyIHNwZWNpYWxBdHRyaWJ1dGVzID0gcmVxdWlyZSgnLi4vdXRpbC9zcGVjaWFsQXR0cmlidXRlcycpO1xuXG5mdW5jdGlvbiBjcmVhdGVHZW9tZXRyeShnZW9tZXRyeVR5cGUsIGxpbmVzLCBvcmlnbywgdW5pdCkge1xuXG4gICAgdmFyIGdlb21ldHJ5VHlwZXMgPSB7XG4gICAgICAgICdQVU5LVCc6IFBvaW50LFxuICAgICAgICAvLyBhIHBvaW50IGZlYXR1cmUgd2l0aCBleHN0YSBzdHlsaW5nIGhpbnRzIC0gdGhlIGdlb21ldHJ5IGFjdHVhbGx5IGNvbnNpc3RzIG9mIHVwIHRvIHRocmVlIHBvaW50c1xuICAgICAgICAnVEVLU1QnOiBQb2ludCxcbiAgICAgICAgJ0tVUlZFJzogTGluZVN0cmluZyxcbiAgICAgICAgJ0JVRVAnOiBMaW5lU3RyaW5nRnJvbUFyYyxcbiAgICAgICAgJ0xJTkpFJzogTGluZVN0cmluZywgLy8gb2xkIDQuMCBuYW1lIGZvciB1bnNtb290aGVkIEtVUlZFXG4gICAgICAgICdGTEFURSc6IFBvbHlnb25cbiAgICB9O1xuXG4gICAgaWYgKCFnZW9tZXRyeVR5cGVzW2dlb21ldHJ5VHlwZV0pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdHZW9tZXRyeVR5cGUgJyArIGdlb21ldHJ5VHlwZSArICcgaXMgbm90IGhhbmRsZWQgKHlldC4uPyknKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBnZW9tZXRyeVR5cGVzW2dlb21ldHJ5VHlwZV0obGluZXMsIG9yaWdvLCB1bml0KTtcbn1cblxuXG5cbnZhciBGZWF0dXJlID0gQmFzZS5leHRlbmQoe1xuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGRhdGEsIG9yaWdvLCB1bml0LCBmZWF0dXJlcykge1xuICAgICAgICBpZiAoZGF0YS5pZCA9PT0gdW5kZWZpbmVkIHx8IGRhdGEuaWQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmVhdHVyZSBtdXN0IGhhdmUgSUQhJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pZCA9IGRhdGEuaWQ7XG4gICAgICAgIHRoaXMucGFyc2VEYXRhKGRhdGEsIG9yaWdvLCB1bml0LCBmZWF0dXJlcyk7XG4gICAgICAgIHRoaXMuZ2VvbWV0cnlUeXBlID0gZGF0YS5nZW9tZXRyeVR5cGU7XG4gICAgfSxcblxuICAgIHBhcnNlRGF0YTogZnVuY3Rpb24gKGRhdGEsIG9yaWdvLCB1bml0KSB7XG5cbiAgICAgICAgdmFyIHNwbGl0ID0gXy5yZWR1Y2UoZGF0YS5saW5lcywgZnVuY3Rpb24gKGRpY3QsIGxpbmUpIHtcbiAgICAgICAgICAgIGlmIChsaW5lLmluZGV4T2YoJy4uTsOYJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgZGljdC5mb3VuZEdlb20gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGRpY3QuZm91bmRHZW9tKSB7XG4gICAgICAgICAgICAgICAgZGljdC5nZW9tLnB1c2gobGluZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChsaW5lLmluZGV4T2YoJy4uUkVGJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpY3QuZm91bmRSZWYgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBsaW5lID0gbGluZS5yZXBsYWNlKCcuLlJFRicsICcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGRpY3QuZm91bmRSZWYpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmVbMF0gPT09ICcuJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGljdC5mb3VuZFJlZiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGljdC5yZWZzLnB1c2gobGluZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkaWN0LmF0dHJpYnV0ZXMucHVzaChsaW5lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGljdDtcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgJ2F0dHJpYnV0ZXMnOiBbXSxcbiAgICAgICAgICAgICdnZW9tJzogW10sXG4gICAgICAgICAgICAncmVmcyc6IFtdLFxuICAgICAgICAgICAgJ2ZvdW5kR2VvbSc6IGZhbHNlLFxuICAgICAgICAgICAgJ2ZvdW5kUmVmJzogZmFsc2VcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gcGFyc2VGcm9tTGV2ZWwyKHNwbGl0LmF0dHJpYnV0ZXMpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBfLnJlZHVjZSh0aGlzLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChhdHRycywgdmFsdWUsIGtleSkge1xuICAgICAgICAgICAgaWYgKCEhc3BlY2lhbEF0dHJpYnV0ZXMgJiYgc3BlY2lhbEF0dHJpYnV0ZXNba2V5XSkge1xuICAgICAgICAgICAgICAgIGF0dHJzW2tleV0gPSBzcGVjaWFsQXR0cmlidXRlc1trZXldLmNyZWF0ZUZ1bmN0aW9uKHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXR0cnNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGF0dHJzO1xuICAgICAgICB9LCB7fSk7XG5cbiAgICAgICAgaWYgKHNwbGl0LnJlZnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLlJFRiA9IHNwbGl0LnJlZnMuam9pbignICcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmF0dHJpYnV0ZXMuRU5IRVQpIHtcbiAgICAgICAgICAgIHVuaXQgPSBwYXJzZUZsb2F0KHRoaXMuYXR0cmlidXRlcy5FTkhFVCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJhd19kYXRhID0ge1xuICAgICAgICAgICAgZ2VvbWV0cnlUeXBlOiBkYXRhLmdlb21ldHJ5VHlwZSxcbiAgICAgICAgICAgIGdlb21ldHJ5OiBzcGxpdC5nZW9tLFxuICAgICAgICAgICAgb3JpZ286IG9yaWdvLFxuICAgICAgICAgICAgdW5pdDogdW5pdFxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICBidWlsZEdlb21ldHJ5OiBmdW5jdGlvbiAoZmVhdHVyZXMpIHtcbiAgICAgICAgaWYgKHRoaXMucmF3X2RhdGEuZ2VvbWV0cnlUeXBlID09PSAnRkxBVEUnKSB7XG4gICAgICAgICAgICB0aGlzLmdlb21ldHJ5ID0gbmV3IFBvbHlnb24odGhpcy5hdHRyaWJ1dGVzLlJFRiwgZmVhdHVyZXMpO1xuICAgICAgICAgICAgdGhpcy5nZW9tZXRyeS5jZW50ZXIgPSBuZXcgUG9pbnQoXG4gICAgICAgICAgICAgICAgdGhpcy5yYXdfZGF0YS5nZW9tZXRyeSxcbiAgICAgICAgICAgICAgICB0aGlzLnJhd19kYXRhLm9yaWdvLFxuICAgICAgICAgICAgICAgIHRoaXMucmF3X2RhdGEudW5pdFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IF8ub21pdCh0aGlzLmF0dHJpYnV0ZXMsICdSRUYnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2VvbWV0cnkgPSBjcmVhdGVHZW9tZXRyeShcbiAgICAgICAgICAgICAgICB0aGlzLnJhd19kYXRhLmdlb21ldHJ5VHlwZSxcbiAgICAgICAgICAgICAgICB0aGlzLnJhd19kYXRhLmdlb21ldHJ5LFxuICAgICAgICAgICAgICAgIHRoaXMucmF3X2RhdGEub3JpZ28sXG4gICAgICAgICAgICAgICAgdGhpcy5yYXdfZGF0YS51bml0XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmF3X2RhdGEgPSBudWxsO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZlYXR1cmU7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciBCYXNlID0gcmVxdWlyZSgnLi4vY2xhc3MvQmFzZScpO1xudmFyIEZlYXR1cmUgPSByZXF1aXJlKCcuLi90eXBlcy9GZWF0dXJlJyk7XG5cblxudmFyIEZlYXR1cmVzID0gQmFzZS5leHRlbmQoe1xuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGVsZW1lbnRzLCBoZWFkKSB7XG5cbiAgICAgICAgdGhpcy5oZWFkID0gaGVhZDtcbiAgICAgICAgdGhpcy5pbmRleCA9IFtdO1xuICAgICAgICB0aGlzLmZlYXR1cmVzID0gXy5vYmplY3QoXy5tYXAoZWxlbWVudHMsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICBrZXkgPSBrZXkucmVwbGFjZSgnOicsICcnKS5zcGxpdCgvXFxzKy8pO1xuICAgICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgaWQ6IHBhcnNlSW50KGtleVsxXSwgMTApLFxuICAgICAgICAgICAgICAgIGdlb21ldHJ5VHlwZToga2V5WzBdLFxuICAgICAgICAgICAgICAgIGxpbmVzOiBfLnJlc3QodmFsdWUpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5pbmRleC5wdXNoKGRhdGEuaWQpO1xuICAgICAgICAgICAgcmV0dXJuIFtkYXRhLmlkLCBuZXcgRmVhdHVyZShkYXRhLCBoZWFkLm9yaWdvLCBoZWFkLmVuaGV0KV07XG4gICAgICAgIH0sIHRoaXMpKTtcbiAgICB9LFxuXG4gICAgZW5zdXJlR2VvbTogZnVuY3Rpb24gKGZlYXR1cmUpIHtcbiAgICAgICAgaWYgKGZlYXR1cmUgJiYgIWZlYXR1cmUuZ2VvbWV0cnkpIHtcbiAgICAgICAgICAgIGZlYXR1cmUuYnVpbGRHZW9tZXRyeSh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmVhdHVyZTtcbiAgICB9LFxuXG4gICAgbGVuZ3RoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfLnNpemUodGhpcy5mZWF0dXJlcyk7XG4gICAgfSxcblxuICAgIGF0OiBmdW5jdGlvbiAoaSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRCeUlkKHRoaXMuaW5kZXhbaV0pO1xuICAgIH0sXG5cbiAgICBnZXRCeUlkOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5zdXJlR2VvbSh0aGlzLmZlYXR1cmVzW2lkXSk7XG4gICAgfSxcblxuICAgIGFsbDogZnVuY3Rpb24gKG9yZGVyZWQpIHtcbiAgICAgICAgaWYgKG9yZGVyZWQpIHtcbiAgICAgICAgICAgIC8qIG9yZGVyIGNvbWVzIGF0IGEgMjUlIHBlcmZvcm1hbmNlIGxvc3MgKi9cbiAgICAgICAgICAgIHJldHVybiBfLm1hcCh0aGlzLmluZGV4LCB0aGlzLmdldEJ5SWQsIHRoaXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF8ubWFwKHRoaXMuZmVhdHVyZXMsIHRoaXMuZW5zdXJlR2VvbSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBGZWF0dXJlcztcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyIEJhc2UgPSByZXF1aXJlKCcuLi9jbGFzcy9CYXNlJyk7XG52YXIgbWFwcGluZ3MgPSByZXF1aXJlKCcuLi91dGlsL21hcHBpbmdzJyk7XG52YXIgZ2V0TG9uZ25hbWUgPSByZXF1aXJlKCcuLi91dGlsL2dldExvbmduYW1lJyk7XG52YXIgcGFyc2VGcm9tTGV2ZWwyID0gcmVxdWlyZSgnLi4vdXRpbC9wYXJzZUZyb21MZXZlbDInKTtcbnZhciBkYXRhdHlwZXMgPSByZXF1aXJlKCcuLi91dGlsL2RhdGF0eXBlcycpO1xudmFyIHNwZWNpYWxBdHRyaWJ1dGVzID0gcmVxdWlyZSgnLi4vdXRpbC9zcGVjaWFsQXR0cmlidXRlcycpO1xuXG5mdW5jdGlvbiBnZXRTdHJpbmcoZGF0YSwga2V5KSB7XG4gICAgdmFyIHN0ciA9IGRhdGFba2V5XSB8fCAnJztcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoLycvZywgJycpO1xufVxuXG5mdW5jdGlvbiBnZXROdW1iZXIoZGF0YSwga2V5KSB7XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQoZGF0YVtrZXldKTtcbn1cblxuZnVuY3Rpb24gZ2V0U3JpZChrb29yZHN5cykge1xuICAgIGtvb3Jkc3lzID0gcGFyc2VJbnQoa29vcmRzeXMsIDEwKTtcbiAgICBpZiAobWFwcGluZ3Mua29vcmRzeXNNYXBba29vcmRzeXNdKSB7XG4gICAgICAgIHJldHVybiBtYXBwaW5ncy5rb29yZHN5c01hcFtrb29yZHN5c10uc3JpZDtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCdLT09SRFNZUyA9ICcgKyBrb29yZHN5cyArICcgbm90IGZvdW5kIScpO1xufVxuXG5mdW5jdGlvbiBnZXRTcmlkRnJvbUdlb3N5cyhnZW9zeXMpIHtcbiAgICBpZiAoXy5pc0FycmF5KGdlb3N5cykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdHRU9TWVMgY2Fubm90IGJlIHBhcnNlZCBpbiB1bmNvbXBhY3RlZCBmb3JtIHlldC4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBnZW9zeXMgPSBnZW9zeXMuc3BsaXQoL1xccysvKTtcbiAgICB9XG4gICAgaWYgKG1hcHBpbmdzLmdlb3N5c01hcFtnZW9zeXNbMF1dKSB7XG4gICAgICAgIHJldHVybiBtYXBwaW5ncy5nZW9zeXNNYXBbZ2Vvc3lzWzBdXS5zcmlkO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0dFT1NZUyA9ICcgKyBnZW9zeXMgKyAnIG5vdCBmb3VuZCEnKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VCYm94KGRhdGEpIHtcbiAgICB2YXIgbGwgPSBkYXRhWydNSU4tTsOYJ10uc3BsaXQoL1xccysvKTtcbiAgICB2YXIgdXIgPSBkYXRhWydNQVgtTsOYJ10uc3BsaXQoL1xccysvKTtcbiAgICByZXR1cm4gW1xuICAgICAgICBwYXJzZUZsb2F0KGxsWzFdKSxcbiAgICAgICAgcGFyc2VGbG9hdChsbFswXSksXG4gICAgICAgIHBhcnNlRmxvYXQodXJbMV0pLFxuICAgICAgICBwYXJzZUZsb2F0KHVyWzBdKVxuICAgIF07XG59XG5cbmZ1bmN0aW9uIHBhcnNlT3JpZ28oZGF0YSkge1xuICAgIGRhdGEgPSBfLmZpbHRlcihkYXRhLnNwbGl0KC9cXHMrLyksIGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50ICE9PSAnJztcbiAgICB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgICAneCc6IHBhcnNlRmxvYXQoZGF0YVsxXSksXG4gICAgICAgICd5JzogcGFyc2VGbG9hdChkYXRhWzBdKVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIHBhcnNlVW5pdChkYXRhKSB7XG4gICAgaWYgKGRhdGEuVFJBTlNQQVIuZW5oZXQpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoZGF0YS5UUkFOU1BBUi5lbmhldCk7XG4gICAgfVxuICAgIHJldHVybiBwYXJzZUZsb2F0KGRhdGEuVFJBTlNQQVIuRU5IRVQpO1xufVxuXG52YXIgSGVhZCA9IEJhc2UuZXh0ZW5kKHtcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICB0aGlzLnNldERhdGEoZGF0YSk7XG4gICAgfSxcblxuICAgIHBhcnNlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICByZXR1cm4gcGFyc2VGcm9tTGV2ZWwyKGRhdGEpO1xuICAgIH0sXG5cbiAgICBzZXREYXRhOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBkYXRhID0gdGhpcy5wYXJzZShkYXRhKTtcbiAgICAgICAgdGhpcy5laWVyID0gZ2V0U3RyaW5nKGRhdGEsIGdldExvbmduYW1lKCdFSUVSJykpO1xuICAgICAgICB0aGlzLnByb2R1c2VudCA9IGdldFN0cmluZyhkYXRhLCBnZXRMb25nbmFtZSgnUFJPRFVTRU5UJykpO1xuICAgICAgICB0aGlzLm9iamVrdGthdGFsb2cgPSBnZXRTdHJpbmcoZGF0YSwgJ09CSkVLVEtBVEFMT0cnKTtcbiAgICAgICAgdGhpcy52ZXJpZmlzZXJpbmdzZGF0byA9IGRhdGFbZ2V0TG9uZ25hbWUoJ1ZFUklGSVNFUklOR1NEQVRPJyldO1xuICAgICAgICB0aGlzLnZlcnNpb24gPSBnZXROdW1iZXIoZGF0YSwgZ2V0TG9uZ25hbWUoJ1NPU0ktVkVSU0pPTicpKTtcbiAgICAgICAgdGhpcy5sZXZlbCA9IGdldE51bWJlcihkYXRhLCBnZXRMb25nbmFtZSgnU09TSS1OSVbDhScpKTtcbiAgICAgICAgaWYgKCEhZGF0YXR5cGVzKSB7XG4gICAgICAgICAgICB0aGlzLmt2YWxpdGV0ID0gc3BlY2lhbEF0dHJpYnV0ZXNbZ2V0TG9uZ25hbWUoJ0tWQUxJVEVUJyldLmNyZWF0ZUZ1bmN0aW9uKGRhdGFbZ2V0TG9uZ25hbWUoJ0tWQUxJVEVUJyldKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMua3ZhbGl0ZXQgPSBnZXRTdHJpbmcoZGF0YSwgZ2V0TG9uZ25hbWUoJ0tWQUxJVEVUJykpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYmJveCA9IHBhcnNlQmJveChkYXRhWydPTVLDhURFJ10pO1xuICAgICAgICB0aGlzLm9yaWdvID0gcGFyc2VPcmlnbyhkYXRhWydUUkFOU1BBUiddWydPUklHTy1Ow5gnXSk7XG4gICAgICAgIHRoaXMuZW5oZXQgPSBwYXJzZVVuaXQoZGF0YSk7XG4gICAgICAgIHRoaXMudmVydGRhdHVtID0gZ2V0U3RyaW5nKGRhdGFbJ1RSQU5TUEFSJ10sICdWRVJULURBVFVNJyk7XG4gICAgICAgIGlmIChkYXRhWydUUkFOU1BBUiddWydLT09SRFNZUyddKSB7XG4gICAgICAgICAgICB0aGlzLnNyaWQgPSBnZXRTcmlkKGRhdGFbJ1RSQU5TUEFSJ11bJ0tPT1JEU1lTJ10pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zcmlkID0gZ2V0U3JpZEZyb21HZW9zeXMoZGF0YVsnVFJBTlNQQVInXVsnR0VPU1lTJ10pO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSGVhZDtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyogYXV0b21hdGljIGNvbnZlcnNpb24gZnJvbSBzb3NpLmggLSBUT0RPIGNvbnZlcnQgdG8gc2luZ2xlIGpzb24gb2JqZWN0ICovXG52YXIgc29zaXR5cGVzID0ge1xuICAgICdBRE1fR1JFTlNFJzogWydhZG1pbmlzdHJhdGl2R3JlbnNlJywgJ1N0cmluZyddLFxuICAgICdBRFJFU1NFJzogWydhZHJlc3NlJywgJ1N0cmluZyddLFxuICAgICdBRFJFU1NFUkVGS09ERSc6IFsnYWRyZXNzZVJlZmVyYW5zZWtvZGUnLCAnU3RyaW5nJ10sXG4gICAgJ0FKT1VSRsOYUlRBVic6IFsnYWpvdXJmw7hydEF2JywgJ1N0cmluZyddLFxuICAgICdBSk9VUkbDmFJUREFUTyc6IFsnYWpvdXJmw7hydERhdG8nLCAnRGF0ZSddLFxuICAgICdEQVRPJzogWydEYXRvJywgJ0RhdGUnXSxcbiAgICAnQUtHRU9MVEVNQSc6IFsnYW5uZXRLdlRlbWEnLCAnSW50ZWdlciddLFxuICAgICdBS1ZBX0FSVCc6IFsnYWt2YUFydCcsICdJbnRlZ2VyJ10sXG4gICAgJ0FLVkFfRU5IRVQnOiBbJ2FrdmFFbmhldCcsICdJbnRlZ2VyJ10sXG4gICAgJ0FLVkFfS09OU1RSJzogWydha3ZhS29uc3RydWtzam9uJywgJ0ludGVnZXInXSxcbiAgICAnQUtWQV9OUic6IFsnYWt2YUtvbnNlc2pvbnNudW1tZXInLCAnSW50ZWdlciddLFxuICAgICdBS1ZBX1NUQVRVUyc6IFsnYWt2YUtvbnNlc2pvbnNzdGF0dXMnLCAnU3RyaW5nJ10sXG4gICAgJ0FLVkFfVFlQRSc6IFsnYWt2YUtvbnNlc2pvbnN0eXBlJywgJ1N0cmluZyddLFxuICAgICdBS1ZBS09OU0VTSk9OU0ZPUk3DhUwnOiBbJ2FrdmFLb25zZXNqb25zZm9ybcOlbCcsICdTdHJpbmcnXSxcbiAgICAnQUtWQVRFTVAnOiBbJ2FrdmFUZW1wZXJhdHVyJywgJ0ludGVnZXInXSxcbiAgICAnQUtWU1lNQk9MJzogWydhbmRyZUt2U3ltYm9sJywgJ0ludGVnZXInXSxcbiAgICAnQUxERVJCRVNLUklWRUxTRSc6IFsnYWxkZXJCZXNrcml2ZWxzZScsICdTdHJpbmcnXSxcbiAgICAnQUxHRV9LT05TJzogWydhbGdlS29uc2VudHJhc2pvbicsICdJbnRlZ2VyJ10sXG4gICAgJ0FMR0VfVFlQJzogWydhbGdlVHlwZScsICdTdHJpbmcnXSxcbiAgICAnQUxNLVRZUCc6IFsnYWxsbWVubmluZ3R5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ0FMVF9BUkVBTEJZR05JTkcnOiBbJ2FsdGVybmF0aXZ0QXJlYWxCeWduaW5nJywgJ1JlYWwnXSxcbiAgICAnQUxURVJOX0ZOUic6IFsnYWx0Rm9yZWtvbXN0TnInLCAnU3RyaW5nJ10sXG4gICAgJ0FMVEVSTkFUSVZUTkFWTic6IFsnYWx0ZXJuYXRpdnROYXZuJywgJ1N0cmluZyddLFxuICAgICdBTkJFTElOVFlQJzogWydhbm5lbkJlcmdhcnRMaW5qZXR5cGUnLCAnSW50ZWdlciddLFxuICAgICdBTkRSRUtJTERFUkJFTEFTVE5JTkcnOiBbJ2FuZHJla2lsZGVyQmVsYXN0bmluZycsICdJbnRlZ2VyJ10sXG4gICAgJ0FOS1JJTkdTQlJVSyc6IFsnYW5rcmluZ3NicnVrJywgJ0ludGVnZXInXSxcbiAgICAnQU5LUlRZUCc6IFsnYW5rcmluZ3N0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnQU5MRUdHTsOYRFNUUsOYTSc6IFsnYW5sZWdnTsO4ZHN0csO4bScsICdTdHJpbmcnXSxcbiAgICAnQU5MRUdHU05VTU1FUic6IFsnYW5sZWdnc251bW1lcicsICdTdHJpbmcnXSxcbiAgICAnQU5ORU5fVkFOTkJfRUxFSyc6IFsnYW5uZW5WYW5uYmVoYW5kbGluZ0F2aEVsZWt0cmlzaXRldCcsICdTdHJpbmcnXSxcbiAgICAnQU5ORU5MVUZUSEFWTic6IFsnYW5uZW5MdWZ0aGF2bicsICdJbnRlZ2VyJ10sXG4gICAgJ0FOTkVOTUFUUkVOSEVUJzogWydhbm5lbk1hdHJFbmhldCcsICdTdHJpbmcnXSxcbiAgICAnQU5UX0FOQUxZUyc6IFsnYW50YWxsQW5hbHlzZXInLCAnSW50ZWdlciddLFxuICAgICdBTlRfQU5TJzogWydhbnRhbGxBbnNhdHRlJywgJ0ludGVnZXInXSxcbiAgICAnQU5UX8OFUlNWJzogWydhbnRhbGzDhXJzdmVyaycsICdJbnRlZ2VyJ10sXG4gICAgJ0FOVEFMTF9CQUQnOiBbJ2FudGFsbEJhZCcsICdJbnRlZ2VyJ10sXG4gICAgJ0FOVEFMTF9CT0VOSEVURVInOiBbJ2FudGFsbEJvZW5oZXRlcicsICdJbnRlZ2VyJ10sXG4gICAgJ0FOVEFMTF9FVEFTSkVSJzogWydhbnRhbGwgZXRhc2plcicsICdJbnRlZ2VyJ10sXG4gICAgJ0FOVEFMTF9ST00nOiBbJ2FudGFsbFJvbScsICdJbnRlZ2VyJ10sXG4gICAgJ0FOVEFMTF9Sw5hLTMOYUCc6IFsnYW50YWxsUsO4a2zDuHAnLCAnUmVhbCddLFxuICAgICdBTlRBTExfV0MnOiBbJ2FudGFsbFdDJywgJ0ludGVnZXInXSxcbiAgICAnQU5UQUxMRkFTVEJPRU5ERSc6IFsnYW50YWxsRmFzdGJvZW5kZScsICdJbnRlZ2VyJ10sXG4gICAgJ0FOVEFMTEZSSVRJRFNCT0xJR0VSJzogWydhbnRhbGxGcml0aWRzYm9saWdlcicsICdJbnRlZ2VyJ10sXG4gICAgJ0FOVEFMTElERU5USVNLRUxZUyc6IFsnYW50YWxsSWRlbnRpc2tlTHlzJywgJ0ludGVnZXInXSxcbiAgICAnQU5UQUxMU0tJU1BPUic6IFsnYW50YWxsU2tpc3BvcicsICdJbnRlZ2VyJ10sXG4gICAgJ0FOVEFMTFNLT1JTVEVJTkVSJzogWydhbnRhbGxTa29yc3RlaW5lcicsICdJbnRlZ2VyJ10sXG4gICAgJ0FOVERSSUZUJzogWydsYW5kYnJ1a3NyZWdBbnRCZWRyaWZ0ZXInLCAnSW50ZWdlciddLFxuICAgICdBUkFWR1JUWVBFJzogWydhcmVhbHJlc3N1cnNBdmdyZW5zaW5nVHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0FSRFlSS0lORyc6IFsnYXJlYWxyZXNzdXJzRHlya2JhcmpvcmQnLCAnSW50ZWdlciddLFxuICAgICdBUkVBTCc6IFsnYXJlYWwnLCAnUmVhbCddLFxuICAgICdBUkVBTEJSVUtfUkVTVFInOiBbJ2FyZWFsYnJ1a1Jlc3RyaWtzam9uJywgJ0ludGVnZXInXSxcbiAgICAnQVJFQUxFTkhFVCc6IFsnYXJlYWxlbmhldCcsICdTdHJpbmcnXSxcbiAgICAnQVJFQUxJTk5TSsOYJzogWydhcmVhbElubnNqw7gnLCAnUmVhbCddLFxuICAgICdBUkVBTEtJTERFJzogWydhcmVhbGtpbGRlJywgJ0ludGVnZXInXSxcbiAgICAnQVJFQUxNRVJLTkFEJzogWydhcmVhbG1lcmtuYWQnLCAnU3RyaW5nJ10sXG4gICAgJ0FSRUFMTkVEQsOYUkZFTFQnOiBbJ2FyZWFsTmVkYsO4cmZlbHQnLCAnU3RyaW5nJ10sXG4gICAgJ0FSRUFMUkVHSU5FJzogWydhcmVhbFJlZ2luZScsICdSZWFsJ10sXG4gICAgJ0FSRUFMU1QnOiBbJ2FyZWFsYnJ1a3NzdGF0dXMnLCAnSW50ZWdlciddLFxuICAgICdBUkVBTFZFUkRJX0lORCc6IFsnYXJlYWx2ZXJkaWluZGlrYXRvcicsICdTdHJpbmcnXSxcbiAgICAnQVJFTktFTCc6IFsnYXJlYWxyZXNzdXJzR3J1cHBlcnRFbmtlbCcsICdJbnRlZ2VyJ10sXG4gICAgJ0FSR1JVTk5GJzogWydhcmVhbHJlc3N1cnNHcnVubmZvcmhvbGQnLCAnSW50ZWdlciddLFxuICAgICdBUktBUlRTVEQnOiBbJ2FyZWFscmVzc3Vyc0thcnRzdGFuZGFyZCcsICdTdHJpbmcnXSxcbiAgICAnQVJORkpCUlVLJzogWydhcmVhbHJlc3N1cnNOYXR1cmdydW5ubGFnRm9ySm9yZGJydWsnLCAnSW50ZWdlciddLFxuICAgICdBUlNLT0dCT04nOiBbJ2FyZWFscmVzc3Vyc1Nrb2dib25pdGV0JywgJ0ludGVnZXInXSxcbiAgICAnQVJUX0VOR0VMU0snOiBbJ2VuZ2Vsc2tBcnRzbmF2bicsICdTdHJpbmcnXSxcbiAgICAnQVJUX0xBVElOJzogWyd2aXRlbnNrYXBlbGlnQXJ0c25hdm4nLCAnU3RyaW5nJ10sXG4gICAgJ0FSVF9OT1JTSyc6IFsnbm9yc2tBcnRzbmF2bicsICdTdHJpbmcnXSxcbiAgICAnQVJUX1RBS1NPTk9NSSc6IFsndGFrc29ub21pc2tLb2RlJywgJ0ludGVnZXInXSxcbiAgICAnQVJUUkVTTEFHJzogWydhcmVhbHJlc3N1cnNUcmVzbGFnJywgJ0ludGVnZXInXSxcbiAgICAnQVJUWVBFJzogWydhcmVhbHJlc3N1cnNBcmVhbHR5cGUnLCAnSW50ZWdlciddLFxuICAgICdBUlVURVRZUEUnOiBbJ2FubmVuUnV0ZXR5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ0FSVkFOTElHJzogWydhcmVhbHJlc3N1cnNHcnVwcGVydFZhbmxpZycsICdJbnRlZ2VyJ10sXG4gICAgJ0FSVkVHRVQnOiBbJ2FyZWFscmVzc3Vyc1ZlZ2V0YXNqb25zZGVra2UnLCAnSW50ZWdlciddLFxuICAgICdBU0tPRyc6IFsncG90ZW5zaWVsbFNrb2dib25pdGV0JywgJ0ludGVnZXInXSxcbiAgICAnQVRJTCc6IFsnYXJlYWx0aWxzdGFuZCcsICdJbnRlZ2VyJ10sXG4gICAgJ0FWRkFMTFNERVAnOiBbJ2F2ZmFsbERlcG9uaUVnbmV0aGV0JywgJ0ludGVnZXInXSxcbiAgICAnQVZGQUxMVFlQRSc6IFsnYXZmYWxsVHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0FWR0lGVFNCRUxBR1QnOiBbJ2F2Z2lmdHNiZWxhZ3QnLCAnU3RyaW5nJ10sXG4gICAgJ0FWR0pEQVRPJzogWydhdmdqw7hyZWxzZXNkYXRvJywgJ0RhdGUnXSxcbiAgICAnQVZHUkVOU05JTkdTVFlQRSc6IFsnYXZncmVuc25pbmdzdHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0FWS0onOiBbJ2F2a2rDuHJzZWxzYmVzdGVtbWVsc2UnLCAnSW50ZWdlciddLFxuICAgICdBVktMQVJURUlFUkUnOiBbJ2F2a2xhcnRFaWVyZScsICdTdHJpbmcnXSxcbiAgICAnQVZMw5hQJzogWydhdmzDuHAnLCAnSW50ZWdlciddLFxuICAgICdBVkzDmFBfVElMS05ZVE5JTkcnOiBbJ3RpbGtueXR0ZXRLb21tdW5hbHRBdmzDuHAnLCAnU3RyaW5nJ10sXG4gICAgJ0FWTMOYUElOTlNKw5gnOiBbJ2F2bMO4cElubnNqw7gnLCAnUmVhbCddLFxuICAgICdBVkzDmFBSRU5TRVBSSU5TSVBQJzogWydhdmzDuHBSZW5zZXByaW5zaXBwJywgJ1N0cmluZyddLFxuICAgICdBVkzDmFBTQU5MRUdHRUlFUkZPUk0nOiBbJ2F2bMO4cHNhbmxlZ2dFaWVyZm9ybScsICdJbnRlZ2VyJ10sXG4gICAgJ0FWTMOYUFNBTkxFR0dUWVBFJzogWydhdmzDuHBzYW5sZWdndHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0FWU0VUTklORyc6IFsnYXZzZXRuaW5nc3R5cGUnLCAnSW50ZWdlciddLFxuICAgICdBVlNFVE5SQVRFJzogWydhdnNldG5SYXRlJywgJ1N0cmluZyddLFxuICAgICdCQUtLRU9QUEzDmFNOSU5HJzogWydiYWtrZW9wcGzDuHNuaW5nJywgJ1JlYWwnXSxcbiAgICAnQkFSTUFSS1NMw5hZUEVUWVBFJzogWydiYXJtYXJrc2zDuHlwZVR5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ0JFQUxERVJCU1QnOiBbJ2JlcmdhcnRBbGRlckJlc3RlbW1lbHNlJywgJ1N0cmluZyddLFxuICAgICdCRUJZR0RfQVJFQUwnOiBbJ2JlYnlnZEFyZWFsJywgJ1JlYWwnXSxcbiAgICAnQkVGQVJHRUtPJzogWydjbXlrRmFyZ2Vrb2RlJywgJ1N0cmluZyddLFxuICAgICdCRUhTVEFUJzogWydiZWhhbmRsaW5nc3N0YXR1cycsICdJbnRlZ2VyJ10sXG4gICAgJ0JFSVRFQlJVS0VSSUQnOiBbJ3JlaW5iZWl0ZWJydWtlcklEJywgJ1N0cmluZyddLFxuICAgICdCRUlURVRJRCc6IFsnYmVpdGV0aWQnLCAnU3RyaW5nJ10sXG4gICAgJ0JFSVRFVElEVkVEVEFLJzogWydiZWl0ZXRpZFZlZHRhaycsICdTdHJpbmcnXSxcbiAgICAnQkVLSlNBTVNFVCc6IFsnYmVyZ2FydEtqZW1pc2tTYW1tZW5zZXRuaW5nJywgJ1N0cmluZyddLFxuICAgICdCRUtPUk5TVFInOiBbJ2JlcmdhcnRLb3Juc3TDuHJyZWxzZScsICdTdHJpbmcnXSxcbiAgICAnQkVMSUdHJzogWydvbWdpdmVsc2V0eXBlVHJhc8Opc2Vrc2pvbicsICdJbnRlZ2VyJ10sXG4gICAgJ0JFTElHR0VOSEVUJzogWydiZWxpZ2dlbmhldCcsICdTdHJpbmcnXSxcbiAgICAnQkVMWVNOSU5HJzogWydiZWx5c25pbmcnLCAnU3RyaW5nJ10sXG4gICAgJ0JFUkVHTkVUJzogWydiZXJlZ25pbmdzRGF0bycsICdEYXRlJ10sXG4gICAgJ0JFUkVHTkVUw4VSJzogWydiZXJlZ25ldMOFcicsICdTdHJpbmcnXSxcbiAgICAnQkVSR0ZBUkdFJzogWydiZXJnYXJ0RmFyZ2UnLCAnU3RyaW5nJ10sXG4gICAgJ0JFUkdHUkVOU0VUWVBFJzogWydiZXJnZ3J1bm5HcmVuc2V0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnQkVTS19FTEVNRU5UJzogWydiZXNrcml2ZWxzZUVsZW1lbnQnLCAnU3RyaW5nJ10sXG4gICAgJ0JFU0tSSVYnOiBbJ3RpbHRha3NiZXNrcml2ZWxzZScsICdTdHJpbmcnXSxcbiAgICAnQkVTS1JJVkVMU0UnOiBbJ2Jlc2tyaXZlbHNlJywgJ1N0cmluZyddLFxuICAgICdCRVNURU1NRUxTRU9NUk5BVk4nOiBbJ2Jlc3RlbW1lbHNlT21yw6VkZU5hdm4nLCAnU3RyaW5nJ10sXG4gICAgJ0JFU1RSVUtUVVInOiBbJ2JlcmdhcnRTdHJ1a3R1cicsICdTdHJpbmcnXSxcbiAgICAnQkVTWU1CT0xUWSc6IFsnYmVyZ2FydFN5bWJvbCcsICdJbnRlZ2VyJ10sXG4gICAgJ0JFVEVLU1RVUic6IFsnYmVyZ2FydFRla3N0dXInLCAnU3RyaW5nJ10sXG4gICAgJ0JFVEpFTklOR1NHUkFEJzogWydiZXRqZW5pbmdzZ3JhZCcsICdTdHJpbmcnXSxcbiAgICAnQklMREUtQklULVBJWEVMJzogWydiaXRzUGVyUGl4ZWwnLCAnSW50ZWdlciddLFxuICAgICdCSUxERS1GSUwnOiBbJ2JpbGRlRmlsJywgJ1N0cmluZyddLFxuICAgICdQTEFOUMOFU0tSSUZUVFlQRSc6IFsncGxhbnDDpXNrcmlmdHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0JJTERFS0FURUdPUkknOiBbJ2JpbGRla2F0ZWdvcmknLCAnSW50ZWdlciddLFxuICAgICdCSUxERU3DhUxFU1RPS0snOiBbJ2JpbGRlbcOlbGVzdG9raycsICdJbnRlZ2VyJ10sXG4gICAgJ0JJTERFTlVNTUVSJzogWydiaWxkZW51bW1lcicsICdJbnRlZ2VyJ10sXG4gICAgJ0JJTERFLVNZUyc6IFsnYmlsZGVTeXN0ZW0nLCAnSW50ZWdlciddLFxuICAgICdCSUxERS1UWVBFJzogWydiaWxkZVR5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ0JJTERFLVVOREVSVFlQRSc6IFsnYmlsZGVVbmRlcnR5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ0JJU1BFTlVNTUVSJzogWydiaXNwZW51bW1lcicsICdJbnRlZ2VyJ10sXG4gICAgJ0JLTEFTU0lGSUsnOiBbJ2JlcmdncnVubktsYXNzaWZpa2Fzam9uJywgJ0ludGVnZXInXSxcbiAgICAnQkxPS0snOiBbJ3N0ZWluT2dCbG9raycsICdTdHJpbmcnXSxcbiAgICAnQkxPS0tBUkVBTCc6IFsnYmxva2thcmVhbCcsICdSZWFsJ10sXG4gICAgJ0JNQU5ERUwnOiBbJ2JtQW5kZWwnLCAnSW50ZWdlciddLFxuICAgICdCTUFOVEFMTCc6IFsnYm1BbnRhbGwnLCAnSW50ZWdlciddLFxuICAgICdCTUFSU1RJRCc6IFsnYm3DhXJzdGlkJywgJ0ludGVnZXInXSxcbiAgICAnQk1BUlQnOiBbJ2JtQXJ0JywgJ1N0cmluZyddLFxuICAgICdCTUVOSEVUJzogWydibUVuaGV0JywgJ0ludGVnZXInXSxcbiAgICAnQk1GVU5LJzogWydibU9tcsOlZGVmdW5rc2pvbicsICdJbnRlZ2VyJ10sXG4gICAgJ0JNRlVOS1ZBTCc6IFsnYm1GdW5rc2pvbnNrdmFsaXRldCcsICdJbnRlZ2VyJ10sXG4gICAgJ0JNS0lMRFRZUCc6IFsnYm1LaWxkZXR5cGUnLCAnSW50ZWdlciddLFxuICAgICdCTUtJTERWVVJEJzogWydibUtpbGRldnVyZGVyaW5nJywgJ0ludGVnZXInXSxcbiAgICAnQk1OQVRZUCc6IFsnYm1OYXR1cnR5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ0JNTkFUWVBNQVJJTic6IFsnYm1OYXR1cnR5cGVNYXJpbicsICdTdHJpbmcnXSxcbiAgICAnQk1OQVRZUE1BUklOVVRGJzogWydibU5hdHVydHlwZU1hcmluVXRmb3JtaW5nJywgJ1N0cmluZyddLFxuICAgICdCTU5BVFlQVVRGJzogWydibU5hdHVydHlwZVV0Zm9ybWluZycsICdTdHJpbmcnXSxcbiAgICAnQk1SRUdEQVRPJzogWydibVJlZ2lzdHJlcmluZ3NkYXRvJywgJ0RhdGUnXSxcbiAgICAnQk1UUlVFVEtBVCc6IFsnYm1UcnVldGhldHNrYXRlZ29yaScsICdTdHJpbmcnXSxcbiAgICAnQk1WRVJESSc6IFsnYm1WZXJkaScsICdTdHJpbmcnXSxcbiAgICAnQk1WSUxUVkVLVCc6IFsnYm1WaWx0dmVrdCcsICdJbnRlZ2VyJ10sXG4gICAgJ0JOUic6IFsnYnJ1a3NudW1tZXInLCAnSW50ZWdlciddLFxuICAgICdCT0tTVCc6IFsnYm9rc3RhdicsICdTdHJpbmcnXSxcbiAgICAnQk9MVFRZUEUnOiBbJ2JvbHRUeXBlJywgJ0ludGVnZXInXSxcbiAgICAnQk9SRURBR0VSJzogWydhbnRhbGxCb3JlZGFnZXInLCAnSW50ZWdlciddLFxuICAgICdCT1JFREFUTyc6IFsnYm9yZWRhdG8nLCAnRGF0ZSddLFxuICAgICdCT1JFRFlQJzogWydib3JlZHlwJywgJ1JlYWwnXSxcbiAgICAnQk9SRUZJUk1BJzogWydib3JlZmlybWEnLCAnU3RyaW5nJ10sXG4gICAgJ0JPUkVJTk5SRVROJzogWydib3JlaW5ucmV0bmluZ3NuYXZuJywgJ1N0cmluZyddLFxuICAgICdCT1JFU0xVVFQnOiBbJ2JvcmVzbHV0dCcsICdEYXRlJ10sXG4gICAgJ0JPUkVTVEFSVCc6IFsnYm9yZXN0YXJ0JywgJ0RhdGUnXSxcbiAgICAnQk9SRVRZUEUnOiBbJ2JvcmluZ1R5cGUnLCAnSW50ZWdlciddLFxuICAgICdCT1JIRUxOSU5HJzogWydnZmJvcmVoSGVsbmluZycsICdJbnRlZ2VyJ10sXG4gICAgJ0JPUkhVTExOUic6IFsnYm9yaHVsbE51bW1lcicsICdTdHJpbmcnXSxcbiAgICAnQk9STEVOR0RFJzogWydnZmJvcmVoTGVuZ2RlJywgJ1JlYWwnXSxcbiAgICAnQk9SUkVUTklORyc6IFsnZ2Zib3JlaFJldG5pbmcnLCAnSW50ZWdlciddLFxuICAgICdCT1RfT0tfSU5UJzogWydib3Rhbmlza8OYa29sb2dpc2tJbnRlcmVzc2UnLCAnU3RyaW5nJ10sXG4gICAgJ0JSQU5TSkUnOiBbJ2JyYW5zamUnLCAnU3RyaW5nJ10sXG4gICAgJ0JSRURERSc6IFsndHJhc8OpYnJlZGRlJywgJ0ludGVnZXInXSxcbiAgICAnQlJFTk5WSURERSc6IFsnYnJlbm52aWRkZScsICdSZWFsJ10sXG4gICAgJ0JSRU5TRUxUQU5LTkVER1InOiBbJ2JyZW5zZWx0YW5rTmVkZ3JhdmQnLCAnSW50ZWdlciddLFxuICAgICdCUkVUWVBFJzogWydicmV0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnQlJVRERMRU5HREUnOiBbJ2JydWRkbGVuZ2RlJywgJ1JlYWwnXSxcbiAgICAnQlJVRUlFUic6IFsnYnJ1ZWllcicsICdTdHJpbmcnXSxcbiAgICAnQlJVS19HUkFEJzogWydrdWx0dXJsYW5kc2thcEJydWtHcmFkJywgJ1N0cmluZyddLFxuICAgICdCUlVLT05TVFJUWVBFJzogWydicnVrb25zdHJ1a3Nqb25zdHlwZScsICdTdHJpbmcnXSxcbiAgICAnQlJVS1NBUkVBTCc6IFsnYnJ1a3NhcmVhbCcsICdSZWFsJ10sXG4gICAgJ0JSVUtTQVJFQUxBTk5FVCc6IFsnYnJ1a3NhcmVhbFRpbEFubmV0JywgJ1JlYWwnXSxcbiAgICAnQlJVS1NBUkVBTEJPTElHJzogWydicnVrc2FyZWFsVGlsQm9saWcnLCAnUmVhbCddLFxuICAgICdCUlVLU0FSRUFMVE9UQUxUJzogWydicnVrc2FyZWFsVG90YWx0JywgJ1JlYWwnXSxcbiAgICAnQlJVS1NFTkhFVFNUWVBFJzogWydicnVrc2VuaGV0c3R5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ0JSVUtTRlJFS1ZFTlMnOiBbJ2ZyaWx1ZnRzb21yw6VkZUJydWtzZnJla3ZlbnMnLCAnSW50ZWdlciddLFxuICAgICdCUlVLU05BVk4nOiBbJ2JydWtzbmF2bicsICdTdHJpbmcnXSxcbiAgICAnQlJVTUFURVJJQUwnOiBbJ2JydW1hdGVyaWFsJywgJ1N0cmluZyddLFxuICAgICdCUlVPVkVSQlJVJzogWydicnVPdmVyQnJ1JywgJ1N0cmluZyddLFxuICAgICdCUlVUUkFGSUtLVFlQRSc6IFsnYnJ1dHJhZmlra3R5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ0JSVcOFUE5JTkcnOiBbJ2JydcOlcG5pbmdzbcOldGUnLCAnU3RyaW5nJ10sXG4gICAgJ0JSw5hOTl9SRUdOUic6IFsnYnLDuG5uUmVnTnInLCAnSW50ZWdlciddLFxuICAgICdCUsOYTk5fUkVTVUxUQVQnOiBbJ2Jyw7hubnJlc3VsdGF0JywgJ1N0cmluZyddLFxuICAgICdCUsOYTk5LTEFTU0UnOiBbJ3BldHJvbGV1bXNicsO4bm5rbGFzc2UnLCAnU3RyaW5nJ10sXG4gICAgJ0JSw5hOTlRZUEUnOiBbJ3BldHJvbGV1bXNicsO4bm50eXBlJywgJ1N0cmluZyddLFxuICAgICdCUsOYWVRFQVJFQUxUSUxHQU5HJzogWydicsO4eXRlYXJlYWx0aWxnYW5nJywgJ0ludGVnZXInXSxcbiAgICAnQlLDmFlURUFSRUFMVFlQRSc6IFsnYnLDuHl0ZWFyZWFsdHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0JSw5hZVEVCUkVEREUnOiBbJ2Jyw7h5dGVicmVkZGUnLCAnSW50ZWdlciddLFxuICAgICdCUsOYWVRFUFJJT1JJVEVUJzogWydicsO4eXRlcHJpb3JpdGV0JywgJ1N0cmluZyddLFxuICAgICdCUsOYWVRFUkVTVFJJS1NKT04nOiBbJ2Jyw7h5dGVyZXN0cmlrc2pvbicsICdTdHJpbmcnXSxcbiAgICAnQlLDmFlURVNJREUnOiBbJ2Jyw7h5dGVzaWRlJywgJ1N0cmluZyddLFxuICAgICdCUsOYWVRFVFlQRSc6IFsnYnLDuHl0ZXR5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ0JVTk5UWVAnOiBbJ2J1bm50eXBlJywgJ1N0cmluZyddLFxuICAgICdCVU5OVFlQRSc6IFsnYnVubnR5cGUnLCAnSW50ZWdlciddLFxuICAgICdCWURFTFNOQVZOJzogWydieWRlbHNuYXZuJywgJ1N0cmluZyddLFxuICAgICdCWURFTFNOVU1NRVInOiBbJ2J5ZGVsc251bW1lcicsICdJbnRlZ2VyJ10sXG4gICAgJ0JZR0dIw5hZREVJTUVURVInOiBbJ2J5Z2dow7h5ZGVJTWV0ZXInLCAnSW50ZWdlciddLFxuICAgICdCWUdHTlInOiBbJ2J5Z25pbmdzbnVtbWVyJywgJ0ludGVnZXInXSxcbiAgICAnQllHR1NUQVQnOiBbJ2J5Z25pbmdzc3RhdHVzJywgJ1N0cmluZyddLFxuICAgICdCWUdHVFlQX05CUic6IFsnYnlnbmluZ3N0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnQllHR1ZFUksnOiBbJ2J5Z2d2ZXJrYmVzdGVtbWVsc2UnLCAnSW50ZWdlciddLFxuICAgICdCWUdOX0VORFJfS09ERSc6IFsnYnlnbmluZ3NlbmRyaW5nc2tvZGUnLCAnU3RyaW5nJ10sXG4gICAgJ0JZR05fRU5EUl9Mw5hQRU5SJzogWydlbmRyaW5nc2zDuHBlbnVtbWVyJywgJ0ludGVnZXInXSxcbiAgICAnQllHTl9ISVNUX0RBVE8nOiBbJ2J5Z25pbmdzaGlzdG9yaWtrRGF0bycsICdEYXRlJ10sXG4gICAgJ0JZR05fUkVGX1RZUEUnOiBbJ2J5Z25pbmdSZWZlcmFuc2V0eXBlJywgJ1N0cmluZyddLFxuICAgICdCWUdOX1NBS1NOUic6IFsnYnlnblNha3NucicsICdTdHJpbmcnXSxcbiAgICAnQllHTklOR1NGVU5LU0pPTic6IFsnYnlnbmluZ3NmdW5rc2pvbicsICdJbnRlZ2VyJ10sXG4gICAgJ0LDhlJFRVZORUJFTkVWTkVMU0UnOiBbJ2LDpnJlZXZuZWJlbmV2bmVsc2UnLCAnU3RyaW5nJ10sXG4gICAgJ0LDmFlFX0ZPUk0nOiBbJ2LDuHllZm9ybScsICdJbnRlZ2VyJ10sXG4gICAgJ0LDhU5ETEFHVEZSRU1USUwnOiBbJ2LDpW5kbGFndEZyZW1UaWwnLCAnRGF0ZSddLFxuICAgICdDTEVJRVInOiBbJ0NMX0VpZXInLCAnU3RyaW5nJ10sXG4gICAgJ0QnOiBbJ2R5YmRlJywgJ0ludGVnZXInXSxcbiAgICAnREFfQU5ORVQnOiBbJ2xhbmRicnVrc3JlZ0FyZWFsQW5uZXQnLCAnSW50ZWdlciddLFxuICAgICdEQV9KT1JEX0QnOiBbJ2xhbmRicnVrc3JlZ0FyZWFsSm9yZElEcmlmdCcsICdSZWFsJ10sXG4gICAgJ0RBX0pPUkRfRSc6IFsnbGFuZGJydWtzcmVnQXJlYWxKb3JkYnJ1aycsICdJbnRlZ2VyJ10sXG4gICAgJ0RBX1NLT0cnOiBbJ2xhbmRicnVrc3JlZ0FyZWFsU2tvZycsICdJbnRlZ2VyJ10sXG4gICAgJ0RBTUZPUk3DhUwnOiBbJ2RhbUZvcm3DpWwnLCAnU3RyaW5nJ10sXG4gICAgJ0RBTUZVTktTSk9OJzogWydkYW1GdW5rc2pvbicsICdJbnRlZ2VyJ10sXG4gICAgJ0RBTUxFTkdERSc6IFsnZGFtTGVuZ2RlJywgJ1JlYWwnXSxcbiAgICAnREFNVFlQRSc6IFsnZGFtVHlwZScsICdTdHJpbmcnXSxcbiAgICAnREFUQUZBTkdTVERBVE8nOiBbJ2RhdGFmYW5nc3RkYXRvJywgJ0RhdGUnXSxcbiAgICAnREFUQVVUVEFLU0RBVE8nOiBbJ2RhdGF1dHRha3NkYXRvJywgJ0RhdGUnXSxcbiAgICAnREFURVJNRVRPRCc6IFsnZGF0ZXJpbmdNZXRvZGUnLCAnSW50ZWdlciddLFxuICAgICdEQVRVTSc6IFsnZGF0dW0nLCAnU3RyaW5nJ10sXG4gICAgJ0RFRk9STUFTSk9ORkFTRSc6IFsnZGVmb3JtYXNqb25GYXNlJywgJ0ludGVnZXInXSxcbiAgICAnREVLS0VOQVZOJzogWydkZWtrZUVuaGV0TmF2bicsICdTdHJpbmcnXSxcbiAgICAnREVLS0VUWVBFJzogWydkZWtrZXR5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ0RFS05JTkdTTlVNTUVSJzogWydkZWtuaW5nc251bW1lcicsICdTdHJpbmcnXSxcbiAgICAnREVMX0JSRUQnOiBbJ3Bvc2lzam9uQnJlZGRlJywgJ0ludGVnZXInXSxcbiAgICAnREVMX0RZQkQnOiBbJ3Bvc2lzam9uRHliZGUnLCAnSW50ZWdlciddLFxuICAgICdERUxPTVLDhURFTkFWTic6IFsnZGVsb21yw6VkZW5hdm4nLCAnU3RyaW5nJ10sXG4gICAgJ0RFTE9NUsOFREVOVU1NRVInOiBbJ2RlbG9tcsOlZGVudW1tZXInLCAnU3RyaW5nJ10sXG4gICAgJ0RFTFNUUkVLTklOR1NOVU1NRVInOiBbJ2RlbHN0cmVrbmluZ3NudW1tZXInLCAnU3RyaW5nJ10sXG4gICAgJ0RFUE9OSVNUQVRVUyc6IFsnZGVwb25pc3RhdHVzJywgJ0ludGVnZXInXSxcbiAgICAnREVQT05JVFlQRSc6IFsnZGVwb25pdHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0RFU0lORkFOTEFWSEVMRUsnOiBbJ2Rlc2luZkFubGVnZ0F2aEVsZWt0cmlzaXRldCcsICdTdHJpbmcnXSxcbiAgICAnRElHSVRBTElTRVJJTkdTTcOFTEVTVE9LSyc6IFsnZGlnaXRhbGlzZXJpbmdzbcOlbGVzdG9raycsICdJbnRlZ2VyJ10sXG4gICAgJ0RJTS1CUkVEREUnOiBbJ3Rla3N0VGVnbkJyZWRkZScsICdSZWFsJ10sXG4gICAgJ0RJTS1Iw5hZREUnOiBbJ3Rla3N0VGVnbkjDuHlkZScsICdSZWFsJ10sXG4gICAgJ0RJU1RLT0RFJzogWydyZWluYmVpdGVkaXN0cmlrdElEJywgJ1N0cmluZyddLFxuICAgICdES19NQU5ERUwnOiBbJ2R5cmtuaW5nc3BvdGVuc2lhbE1hbmRlbCcsICdJbnRlZ2VyJ10sXG4gICAgJ0RLX01BTkRFTF9BJzogWyduZWRrbGFzc2lmaXNlcmluZ01hbmRlbCcsICdJbnRlZ2VyJ10sXG4gICAgJ0RLX05FREJPUic6IFsnbmVkYsO4cnNiYXNlcnQnLCAnSW50ZWdlciddLFxuICAgICdES19ORURCT1JfQSc6IFsnbmVka2xhc3NpZmlzZXJpbmdOZWRiw7hyJywgJ0ludGVnZXInXSxcbiAgICAnREtfVkFOTic6IFsndmFubmluZ3NiYXNlcnQnLCAnSW50ZWdlciddLFxuICAgICdES19WQU5OX0EnOiBbJ25lZGtsYXNzaWZpc2VyaW5nVmFubmluZycsICdJbnRlZ2VyJ10sXG4gICAgJ0RPS1VNRU5UQVNKT05TVFlQRSc6IFsnZG9rdW1lbnRhc2pvblR5cGUnLCAnSW50ZWdlciddLFxuICAgICdELVJFRi1JTlQnOiBbJ3ZlcnRpa2FsUmVmZXJhbnNlSW50ZXJuYXNqb25hbER5YmRlJywgJ0ludGVnZXInXSxcbiAgICAnRFJJRlRGSE9MRCc6IFsnZHJpZnRGb3Job2xkJywgJ0ludGVnZXInXSxcbiAgICAnRFJJRlRNRVRPRCc6IFsnZHJpZnRNZXRvZGUnLCAnSW50ZWdlciddLFxuICAgICdEUlNFTlRFUic6IFsnam9yZHJlZ2lzdGVyRHJpZnRzc2VudGVyJywgJ0ludGVnZXInXSxcbiAgICAnRFlCREUnOiBbJ2R5YmRlJywgJ1JlYWwnXSxcbiAgICAnRFlCREVfTUFYJzogWydtYXhpbXVtc2R5YmRlJywgJ1JlYWwnXSxcbiAgICAnRFlCREVfTUlOJzogWydtaW5pbXVtc2R5YmRlJywgJ1JlYWwnXSxcbiAgICAnRFlCREVGSkVMTCc6IFsnZHliZGVUaWxGamVsbCcsICdSZWFsJ10sXG4gICAgJ0RZQkRFS1ZJS0tMRUlSRSc6IFsnZHliZGVUaWxLdmlra2xlaXJlJywgJ1JlYWwnXSxcbiAgICAnRFlCREVNw4VMRU1FVE9ERSc6IFsnZHliZW3DpWxlbWV0b2RlJywgJ0ludGVnZXInXSxcbiAgICAnRFlCREUtUkVGJzogWydkeWJkZVJlZmVyYW5zZScsICdTdHJpbmcnXSxcbiAgICAnRFlCREVUWVBFJzogWydkeWJkZXR5cGUnLCAnSW50ZWdlciddLFxuICAgICdEWVBNSURERUwnOiBbJ2R5cE1pZGRlbCcsICdJbnRlZ2VyJ10sXG4gICAgJ0RZUFNUw5hSU1RNw4VMVCc6IFsnZHlwU3TDuHJzdE3DpWx0JywgJ0ludGVnZXInXSxcbiAgICAnU0VSSUVOVU1NRVInOiBbJ3NlcmllbnVtbWVyJywgJ1N0cmluZyddLFxuICAgICdEWVJLSU5HJzogWydqb3JkcmVnaXN0ZXJEeXJraW5nc2pvcmQnLCAnU3RyaW5nJ10sXG4gICAgJ0VJRVInOiBbJ2dlb2RhdGFlaWVyJywgJ1N0cmluZyddLFxuICAgICdFSUVSRk9SSE9MRCc6IFsnZWllcmZvcmhvbGQnLCAnU3RyaW5nJ10sXG4gICAgJ0VJRVJGT1JNJzogWydlaWVyZm9ybVR5cGUnLCAnSW50ZWdlciddLFxuICAgICdFS09PUkQtSCc6IFsnam9yZHJlZ2lzdGVyS29vcmRpbmF0SMO4eWRlJywgJ0ludGVnZXInXSxcbiAgICAnRUtPT1JELU4nOiBbJ2pvcmRyZWdpc3Rlcktvb3JkaW5hdE5vcmQnLCAnSW50ZWdlciddLFxuICAgICdFS09PUkQtw5gnOiBbJ2pvcmRyZWdpc3Rlcktvb3JkaW5hdMOYc3QnLCAnSW50ZWdlciddLFxuICAgICdFTkRSRVRfVElEJzogWyd0aWRzcHVua3RFbmRyaW5nJywgJ0RhdGUnXSxcbiAgICAnRU5EUkVUX1RZUEUnOiBbJ3R5cGVFbmRyaW5nJywgJ1N0cmluZyddLFxuICAgICdFTkRSSU5HU0dSQUQnOiBbJ2VuZHJpbmdzZ3JhZCcsICdTdHJpbmcnXSxcbiAgICAnRU5FUkdJS0lMREUnOiBbJ2VuZXJnaWtpbGRlJywgJ1N0cmluZyddLFxuICAgICdFTkhFVCc6IFsnZW5oZXQnLCAnUmVhbCddLFxuICAgICdFTkhFVC1EJzogWydlbmhldER5YmRlJywgJ1JlYWwnXSxcbiAgICAnRU5IRVQtSCc6IFsnZW5oZXRIw7h5ZGUnLCAnUmVhbCddLFxuICAgICdFUk9TSk9OR1MnOiBbJ2Vyb3Nqb25zcmlzaWtvR3Jhc2Rla2tlJywgJ0ludGVnZXInXSxcbiAgICAnRVJPU0pPTkhQJzogWydlcm9zam9uc3Jpc2lrb0jDuHN0cGzDuHlpbmcnLCAnSW50ZWdlciddLFxuICAgICdFVEFCTEVSSU5HU0RBVE8nOiBbJ2V0YWJsZXJpbmdzZGF0bycsICdEYXRlJ10sXG4gICAgJ0VUQUJMRVJUJzogWydmYXN0bWVya2VFdGFibGVyaW5nc2RhdG8nLCAnRGF0ZSddLFxuICAgICdFVEFTSkVOVU1NRVInOiBbJ2V0YXNqZW51bW1lcicsICdJbnRlZ2VyJ10sXG4gICAgJ0VUQVNKRVBMQU4nOiBbJ2V0YXNqZXBsYW4nLCAnU3RyaW5nJ10sXG4gICAgJ0VUQVNKRVRBTEwnOiBbJ2V0YXNqZXRhbGwnLCAnU3RyaW5nJ10sXG4gICAgJ0VUQVQnOiBbJ2V0YXQnLCAnU3RyaW5nJ10sXG4gICAgJ0ZfVFlQRSc6IFsnZmlza2VUeXBlJywgJ0ludGVnZXInXSxcbiAgICAnRkFHT01Sw4VEJzogWydsZWRuaW5nc2ZhZ29tcsOlZGUnLCAnSW50ZWdlciddLFxuICAgICdGQUxMSMOYWURFJzogWydmYWxsSMO4eWRlJywgJ1JlYWwnXSxcbiAgICAnRkFPX0tPREUnOiBbJ2Zhb0tvZGUnLCAnU3RyaW5nJ10sXG4gICAgJ0ZBUlTDmFlfSUQnOiBbJ2ZhcnTDuHlJZGVudGlmaWthc2pvbicsICdTdHJpbmcnXSxcbiAgICAnRkFTQURFJzogWydmYXNhZGUnLCAnSW50ZWdlciddLFxuICAgICdGQk5BVk4nOiBbJ2Zpc2tlYmVkcmlmdHNuYXZuJywgJ1N0cmluZyddLFxuICAgICdGQk5SJzogWydmaXNrZWJydWtzbnVtbWVyJywgJ0ludGVnZXInXSxcbiAgICAnRkJOUl9GWUxLJzogWydmaXNrZWJydWtzbnVtbWVyRnlsa2UnLCAnU3RyaW5nJ10sXG4gICAgJ0ZFTFROQVZOJzogWydmZWx0YmV0ZWduZWxzZScsICdTdHJpbmcnXSxcbiAgICAnRkVMVFJFR0lTVFJFUlRBVic6IFsnZmVsdGVnaXN0cmVydEF2JywgJ1N0cmluZyddLFxuICAgICdGSUdGX0lEJzogWydmaWd1ckbDuHJTa2lmdGVJZGVudCcsICdJbnRlZ2VyJ10sXG4gICAgJ0ZJTE0nOiBbJ2ZpbG0nLCAnU3RyaW5nJ10sXG4gICAgJ0ZJUk1BJzogWydmaXJtYW5hdm4nLCAnU3RyaW5nJ10sXG4gICAgJ0ZJU0tfS09ERSc6IFsnYXJ0c2tvZGUnLCAnSW50ZWdlciddLFxuICAgICdGSVNLRV9CRURSX0FOREVMJzogWydmaXNrZWJlZHJpZnRzYW5kZWwnLCAnSW50ZWdlciddLFxuICAgICdGSVNLRV9CRURSX0VJRVInOiBbJ2Zpc2tlYmVkcmlmdHNlaWVyJywgJ1N0cmluZyddLFxuICAgICdGSVNLRV9CRURSX09NUic6IFsnZmlza2ViZWRyaWZ0c29tcsOlZGUnLCAnSW50ZWdlciddLFxuICAgICdGSVNLRV9CRURSX1BST0QnOiBbJ2Zpc2tlYmVkcmlmdHNwcm9kdWt0JywgJ0ludGVnZXInXSxcbiAgICAnRklTS0VfQkVEUl9TRVJWSUNFJzogWydmaXNrZWJlZHJpZnRzZXJ2aWNlJywgJ0ludGVnZXInXSxcbiAgICAnRklTS0VfS0FQX0VOSCc6IFsnZmlza2VrYXBhc2l0ZXRFbmhldCcsICdJbnRlZ2VyJ10sXG4gICAgJ0ZJU0tFX0tBUEFTSVRFVCc6IFsnZmlza2VrYXBhc2l0ZXQnLCAnSW50ZWdlciddLFxuICAgICdGSVNLRV9UWVBFJzogWydmaXNrZXR5cGUnLCAnSW50ZWdlciddLFxuICAgICdGSVNLRVJJX0JSVUtfVFlQRSc6IFsnZmlza2VyaWJydWtzdHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0ZJU0tFUklfUkVTU19UWVBFJzogWydmaXNrZXJpcmVzc3Vyc09tcsOlZGV0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnRklTS0VSSVJFRFNLQVBfR0VOX0FLVElWJzogWydmaXNrZXJpcmVkc2thcEdlbkFrdGl2JywgJ0ludGVnZXInXSxcbiAgICAnRklTS0VSSVJFRFNLQVBfR0VOX1BBU1NJVic6IFsnZmlza2VyaXJlZHNrYXBHZW5QYXNzaXYnLCAnSW50ZWdlciddLFxuICAgICdGSVNLRVJJUkVEU0tBUF9TUEVTX0FLVElWJzogWydmaXNrZXJpcmVkc2thcFNwZXNBa3RpdicsICdJbnRlZ2VyJ10sXG4gICAgJ0ZJU0tFUklSRURTS0FQX1NQRVNfUEFTU0lWJzogWydmaXNrZXJpcmVkc2thcFNwZXNQYXNzaXYnLCAnSW50ZWdlciddLFxuICAgICdGSkVMTCc6IFsnZmplbGxibG90bmluZ2VyJywgJ0ludGVnZXInXSxcbiAgICAnRkpPUkRJRCc6IFsnZmpvcmRpZGVudGlmaWthc2pvbicsICdTdHJpbmcnXSxcbiAgICAnRkxPREJPTEdFSE9ZREUnOiBbJ2Zsb2Rib2xnZWhveWRlJywgJ0ludGVnZXInXSxcbiAgICAnRkxPTUxBVlBVTktUJzogWydmbG9tTGF2UHVua3QnLCAnUmVhbCddLFxuICAgICdGTFlGSVJNQSc6IFsnZmx5ZmlybWEnLCAnU3RyaW5nJ10sXG4gICAgJ0ZMWUjDmFlERSc6IFsnZmx5aMO4eWRlJywgJ0ludGVnZXInXSxcbiAgICAnRkxZUkVTVFInOiBbJ2ZseVJlc3RyaWtzam9uJywgJ0ludGVnZXInXSxcbiAgICAnRk1BREtPTVNUJzogWydmYXN0bWVya2VBZGtvbXN0JywgJ1N0cmluZyddLFxuICAgICdGTURJTSc6IFsnZmFzdG1lcmtlRGlhbWV0ZXInLCAnSW50ZWdlciddLFxuICAgICdGTUhSRUYnOiBbJ2Zhc3RtZXJrZUjDuHlkZXJlZicsICdTdHJpbmcnXSxcbiAgICAnRk1JRERBVE8nOiBbJ2Zhc3RtZXJrZUlkRGF0bycsICdEYXRlJ10sXG4gICAgJ0ZNSURHTUwnOiBbJ2Zhc3RtZXJrZUlkR2FtbWVsJywgJ1N0cmluZyddLFxuICAgICdGTUlOU1QnOiBbJ2Zhc3RtZXJrZUluc3RpdHVzam9uJywgJ1N0cmluZyddLFxuICAgICdGTUtPTU0nOiBbJ2Zhc3RtZXJrZUtvbW11bmUnLCAnSW50ZWdlciddLFxuICAgICdGTU1FUksnOiBbJ2Zhc3RtZXJrZU1lcmtuYWRlcicsICdTdHJpbmcnXSxcbiAgICAnRk1OQVZOJzogWydmYXN0bWVya2VOYXZuJywgJ1N0cmluZyddLFxuICAgICdGTU5VTU1FUic6IFsnZmFzdG1lcmtlTnVtbWVyJywgJ1N0cmluZyddLFxuICAgICdGTVJFRkJFUic6IFsnZmFzdG1lcmtlUmVmR3J1bm5yaXNCZXJlZ25pbmcnLCAnU3RyaW5nJ10sXG4gICAgJ0ZNUkVGSEJFUic6IFsnZmFzdG1lcmtlUmVmSMO4eWRlQmVyZWduaW5nJywgJ1N0cmluZyddLFxuICAgICdGTVJFU1RSJzogWydmYXN0bWVya2VSZXN0cmlrc2pvbicsICdTdHJpbmcnXSxcbiAgICAnRk1TUkVGJzogWydmYXN0bWVya2VTZW50cnVtUmVmJywgJ1N0cmluZyddLFxuICAgICdGTlInOiBbJ2Zlc3RlbnVtbWVyJywgJ0ludGVnZXInXSxcbiAgICAnRk9OVEVORV9UWVBFJzogWydmb250ZW5ldHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0ZPUkVLTkFWTic6IFsnbmF2blJhc3RvZmZvYmonLCAnU3RyaW5nJ10sXG4gICAgJ0ZPUkVLT01fSUQnOiBbJ2lkZW50UmFzdG9mZm9iaicsICdJbnRlZ2VyJ10sXG4gICAgJ0ZPUkhPTERBTkRSRUhVUyc6IFsnZm9yaG9sZEFuZHJlSHVzJywgJ1N0cmluZyddLFxuICAgICdGT1JIw4VORFNUQUxMJzogWydmb3Jow6VuZHN0YWxsJywgJ0ludGVnZXInXSxcbiAgICAnRk9STEVOR0VUX0RBVE8nOiBbJ2ZvcmxlbmdldERhdG8nLCAnRGF0ZSddLFxuICAgICdGT1JNQVNKT04nOiBbJ2Zvcm1hc2pvblRvdGFsRHlwJywgJ1N0cmluZyddLFxuICAgICdGT1JNRUxGTEFURSc6IFsna3ZGb3JtRmxhdGV0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnRk9STUVMTElOJzogWydrdkZvcm1MaW5qZXR5cGUnLCAnSW50ZWdlciddLFxuICAgICdGT1JNRUxQS1QnOiBbJ2t2Rm9ybVB1bmt0dHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0ZPUk3DhUxTRUtTSk9OJzogWydmb3Jtw6VsU2Vrc2pvbktvZGUnLCAnU3RyaW5nJ10sXG4gICAgJ0ZPUlVSX0FSRUFMJzogWydmb3J1cmVuc2V0QXJlYWwnLCAnSW50ZWdlciddLFxuICAgICdGT1JVUl9HUlVOTlRZUEUnOiBbJ2ZvcnVyZW5zZXRHcnVublR5cGUnLCAnSW50ZWdlciddLFxuICAgICdGT1JVUl9IT1ZFREdSVVBQRSc6IFsnZm9ydXJlbnNuaW5nSG92ZWRncnVwcGUnLCAnSW50ZWdlciddLFxuICAgICdGT1JWX01ZTkQnOiBbJ2ZvcnZhbHRuaW5nTXluZGlnaGV0JywgJ1N0cmluZyddLFxuICAgICdGT1JWX1BMQU4nOiBbJ2ZvcnZhbHRuaW5nUGxhbicsICdJbnRlZ2VyJ10sXG4gICAgJ0ZPU1NJTFRZUEUnOiBbJ2Zvc3NpbE5hdm4nLCAnU3RyaW5nJ10sXG4gICAgJ0ZPVE9EQVRPJzogWydmb3RvZGF0bycsICdEYXRlJ10sXG4gICAgJ0ZPVE9HUkFGJzogWydmb3RvZ3JhZicsICdTdHJpbmcnXSxcbiAgICAnRk9UUlVURVRZUEUnOiBbJ2ZvdHJ1dGV0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnRlJBU1BPUk5PREVLSUxPTUVURVInOiBbJ2ZyYVNwb3Jub2RlS2lsb21ldGVyJywgJ1JlYWwnXSxcbiAgICAnRlJBU1BPUk5PREVURUtTVCc6IFsnZnJhU3Bvcm5vZGVUZWtzdCcsICdTdHJpbmcnXSxcbiAgICAnRlJBU1BPUk5PREVUWVBFJzogWydmcmFTcG9ybm9kZVR5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ0YtUkVGLUlOVCc6IFsnZnJpc2VpbGluZ1JlZmVyYW5zZUludGVybmFzam9uYWwnLCAnSW50ZWdlciddLFxuICAgICdGUkVHJzogWydqb3JkcmVnaXN0ZXJGcmVnJywgJ0ludGVnZXInXSxcbiAgICAnRlJJRFJJRlRTVElMU1lOJzogWydmcmlsdWZ0c2xpdnNvbXLDpWRlRHJpZnRzdGlsc3luJywgJ0ludGVnZXInXSxcbiAgICAnRlJJRUdORVRIRVQnOiBbJ2ZyaWx1ZnRzbGl2c29tcsOlZGVFZ25ldGhldCcsICdJbnRlZ2VyJ10sXG4gICAgJ0ZSSVBMQU5TVCc6IFsnZnJpbHVmdHNsaXZzb21yw6VkZVBsYW5TdGF0dXMnLCAnSW50ZWdlciddLFxuICAgICdGUklTRUlMSMOYWURFJzogWydmcmlzZWlsaW5nc2jDuHlkZScsICdSZWFsJ10sXG4gICAgJ0ZSSVNFSUwtUkVGJzogWydmcmlsc2VpbGluZ1JlZmVyYW5zZScsICdTdHJpbmcnXSxcbiAgICAnRlJJU0lLUklORyc6IFsnZnJpbHVmdHNsaXZTaWtyaW5nJywgJ0ludGVnZXInXSxcbiAgICAnRlJJU1BFUlInOiBbJ2ZyaXNwZXJyaW5nJywgJ0ludGVnZXInXSxcbiAgICAnRlJJU1RNQVRSSUtLRUxGw5hSSU5HU0tSQVYnOiBbJ2ZyaXN0TWF0cmlra2VsZsO4cmluZ3NrcmF2JywgJ0RhdGUnXSxcbiAgICAnRlJJU1RPUFBNw4VMSU5HJzogWydmcmlzdE9wcG3DpWxpbmcnLCAnRGF0ZSddLFxuICAgICdGUklUSUxSRVRURUxFR0dJTkcnOiBbJ2ZyaWx1ZnRzbGl2c29tcsOlZGVUaWxyZXR0ZWxlZ2dpbmcnLCAnSW50ZWdlciddLFxuICAgICdGUklUWVBFJzogWydmcmlsdWZ0c2xpdnNvbXLDpWRlVHlwZScsICdTdHJpbmcnXSxcbiAgICAnRlJJVkVSREknOiBbJ2ZyaWx1ZnRzbGl2c29tcsOlZGVWZXJkaScsICdTdHJpbmcnXSxcbiAgICAnRi1TVFJFTkcnOiBbJ2Zvcm1hdGVydFN0cmVuZycsICdTdHJpbmcnXSxcbiAgICAnRlVOREFNRU5URVJJTkcnOiBbJ2Z1bmRhbWVudGVyaW5nJywgJ0ludGVnZXInXSxcbiAgICAnRllERUxURU1BJzogWydmeWxrZXNkZWx0ZW1hJywgJ0ludGVnZXInXSxcbiAgICAnRllMS0VTTlInOiBbJ2Z5bGtlc251bW1lcicsICdJbnRlZ2VyJ10sXG4gICAgJ0ZZUkxJU1RFS0FSQUtURVInOiBbJ2Z5cmxpc3RlS2FyYWt0ZXInLCAnU3RyaW5nJ10sXG4gICAgJ0ZZUkxJU1RFTlVNTUVSJzogWydmeXJsaXN0ZW51bW1lcicsICdTdHJpbmcnXSxcbiAgICAnRllTRU5IRVQnOiBbJ2Z5c2lza0VuaGV0JywgJ0ludGVnZXInXSxcbiAgICAnRllTSVNLTUlMSsOYJzogWydmeXNpc2tNaWxqw7gnLCAnSW50ZWdlciddLFxuICAgICdGWVNQQVJBTSc6IFsnZnlzaXNrUGFyYW1ldGVyJywgJ0ludGVnZXInXSxcbiAgICAnRllTU1RSJzogWydmeXNpc2tTdG9ycmVsc2UnLCAnUmVhbCddLFxuICAgICdGw5hMR0VSX1RFUlJFTkdERVQnOiBbJ2bDuGxnZXJUZXJyZW5nZGV0YWxqJywgJ1N0cmluZyddLFxuICAgICdGw5hSU1RFREFUQUZBTkdTVERBVE8nOiBbJ2bDuHJzdGVEYXRhZmFuZ3N0ZGF0bycsICdEYXRlJ10sXG4gICAgJ0bDmFJTVEVESUdJVEFMSVNFUklOR1NEQVRPJzogWydmw7hyc3RlRGlnaXRhbGlzZXJpbmdzZGF0bycsICdEYXRlJ10sXG4gICAgJ0dBUkRJRE5SJzogWydsYW5kYnJ1a3NyZWdQcm9kdXNlbnRJZCcsICdJbnRlZ2VyJ10sXG4gICAgJ0dBVEVOQVZOJzogWydnYXRlbmF2bicsICdTdHJpbmcnXSxcbiAgICAnR0FURU5SJzogWydnYXRlbnVtbWVyJywgJ0ludGVnZXInXSxcbiAgICAnR0VOUkVTVFInOiBbJ2dlbmVyZWxscmVzdHJpa3Nqb24nLCAnSW50ZWdlciddLFxuICAgICdHRU9BTERFUic6IFsnZ2VvbEFsZGVyJywgJ0ludGVnZXInXSxcbiAgICAnR0VPQUxERVJfRlJBJzogWydnZW9sTWFrc0FsZGVyJywgJ0ludGVnZXInXSxcbiAgICAnR0VPQUxERVJfVElMJzogWydnZW9sTWluQWxkZXInLCAnSW50ZWdlciddLFxuICAgICdHRU9CRVNLJzogWydnZW9sQmVza3JpdmVsc2UnLCAnU3RyaW5nJ10sXG4gICAgJ0dFTy1EQVRVTSc6IFsnZ2VvRGF0dW1JbnRlcm5hc2pvbmFsJywgJ0ludGVnZXInXSxcbiAgICAnR0VPRkVMVE5SJzogWydnZW9sb2dGZWx0bnVtbWVyJywgJ1N0cmluZyddLFxuICAgICdHRU9GT1JNQVNKJzogWydnZW9sRm9ybWFzam9uTmF2bicsICdTdHJpbmcnXSxcbiAgICAnR0VPR1JVUFBFJzogWydnZW9sR3J1cHBlTmF2bicsICdTdHJpbmcnXSxcbiAgICAnR0VPSE9WRVJESSc6IFsnZ2VvbEhvcmlzb250YWx2ZXJkaScsICdJbnRlZ2VyJ10sXG4gICAgJ0dFT0tBUlROUic6IFsnZ2VvbEthcnRudW1tZXInLCAnSW50ZWdlciddLFxuICAgICdHRU9LT09SRCc6IFsnZ2VvS29vcmRpbmF0dmVyZGlFbmhldCcsICdJbnRlZ2VyJ10sXG4gICAgJ0dFT0xPS05SJzogWydnZW9sTG9rYWxpdGV0bnVtbWVyJywgJ1JlYWwnXSxcbiAgICAnR0VPLVBST0onOiBbJ2dlb1Byb2pla3Nqb24nLCAnSW50ZWdlciddLFxuICAgICdHRU9Qw4VWSVNOSU5HVFlQRSc6IFsnZ2VvbFBhdmlzbmluZ3R5cGUnLCAnSW50ZWdlciddLFxuICAgICdHRU9TSVRFTk8nOiBbJ2dlb3NpdGVOdW1tZXInLCAnSW50ZWdlciddLFxuICAgICdHRU8tU09ORSc6IFsnZ2VvU29uZVByb2pla3Nqb24nLCAnSW50ZWdlciddLFxuICAgICdHRU9WRVJESVZVUkQnOiBbJ2dlb2xWZXJkaXZ1cmRlcmluZycsICdJbnRlZ2VyJ10sXG4gICAgJ0dFT1ZFVkVSREknOiBbJ2dlb2xWZXJ0aWthbHZlcmRpJywgJ0ludGVnZXInXSxcbiAgICAnR0ZBTk9NQUxJJzogWydnZW9mQW5vbWFsaScsICdJbnRlZ2VyJ10sXG4gICAgJ0dGRFlQU1RSJzogWydnZW9mRHlwJywgJ1JlYWwnXSxcbiAgICAnR0ZEWVBUWVBFJzogWydnZW9mRHlwdHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0dGRkFMTEJSRUdNRVQnOiBbJ2dlb2ZGYWxsQmVyZWduTWV0b2RlJywgJ0ludGVnZXInXSxcbiAgICAnR0ZGQUxMU1RSJzogWydnZW9mRmFsbHN0b3JyZWxzZScsICdJbnRlZ2VyJ10sXG4gICAgJ0dGRkxBVEUnOiBbJ2dlb2ZGbGF0ZScsICdJbnRlZ2VyJ10sXG4gICAgJ0dGTF9JTkZPJzogWydnZW9mTGluamVJbmZvJywgJ0ludGVnZXInXSxcbiAgICAnR0ZMSU5KRSc6IFsnZ2VvZlRvbGtMaW5qZXR5cGUnLCAnSW50ZWdlciddLFxuICAgICdHRk1FVE9ERSc6IFsnZ2VvZk1ldG9kZScsICdJbnRlZ2VyJ10sXG4gICAgJ0dGUF9JTkZPJzogWydnZW9mUHVua3RJbmZvJywgJ0ludGVnZXInXSxcbiAgICAnR0ZTVFJPSyc6IFsnZ2VvZlN0cm9rcmV0bmluZycsICdJbnRlZ2VyJ10sXG4gICAgJ0dGVE9MSyc6IFsnZ2VvZlRvbGtNZXRvZGUnLCAnSW50ZWdlciddLFxuICAgICdHRlVUTExFTic6IFsnZ2VvZkxlbmdkZVV0bGVnZycsICdJbnRlZ2VyJ10sXG4gICAgJ0dGVVRMUkVUTic6IFsnZ2VvZlJldG5pbmdVdGxlZ2cnLCAnSW50ZWdlciddLFxuICAgICdHRlVUTFRZUEUnOiBbJ2dlb2ZUeXBlVXRsZWdnJywgJ0ludGVnZXInXSxcbiAgICAnR0pFTk5PTUbDmFJJTkdTRlJJU1QnOiBbJ2dqZW5ub21mw7hyaW5nc2ZyaXN0JywgJ0RhdGUnXSxcbiAgICAnR0pFTlRBS1NJTlRFUlZBTCc6IFsnZ2plbnRha3NJbnRlcnZhbCcsICdJbnRlZ2VyJ10sXG4gICAgJ0dKRVJERVRZUEUnOiBbJ3Npa3JpbmdHamVyZGV0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnR0tFS1NUUkFLVCc6IFsnZ2Vva0Vrc3RyYWt0JywgJ0ludGVnZXInXSxcbiAgICAnR0tFTkhFVCc6IFsnZ2Vva0VuaGV0JywgJ0ludGVnZXInXSxcbiAgICAnR0tGUkFEWVAnOiBbJ2dlb2tGcmFEeXAnLCAnSW50ZWdlciddLFxuICAgICdHS0ZSQUtTSk9OJzogWydnZW9rRnJha3Nqb24nLCAnSW50ZWdlciddLFxuICAgICdHS0hPUklTT05UJzogWydnZW9rSG9yaXNvbnQnLCAnSW50ZWdlciddLFxuICAgICdHS0hPVk1FRElVTSc6IFsnZ2Vva0hvdmVkbWVkaXVtJywgJ0ludGVnZXInXSxcbiAgICAnR0tNRURJVU0nOiBbJ2dlb2tNZWRpdW0nLCAnSW50ZWdlciddLFxuICAgICdHS1JFVFNOQVZOJzogWydncnVubmtyZXRzbmF2bicsICdTdHJpbmcnXSxcbiAgICAnR0tUSUxEWVAnOiBbJ2dlb2tUaWxEeXAnLCAnSW50ZWdlciddLFxuICAgICdHS1ZBUklBQkVMJzogWydnZW9rVmFyaWFiZWwnLCAnU3RyaW5nJ10sXG4gICAgJ0dOUic6IFsnZ8OlcmRzbnVtbWVyJywgJ0ludGVnZXInXSxcbiAgICAnR1JfVFlQRSc6IFsnZ3JlbnNldHlwZVNqw7gnLCAnSW50ZWdlciddLFxuICAgICdHUkFWRVJUJzogWydncmF2ZXJ0VGVrc3QnLCAnU3RyaW5nJ10sXG4gICAgJ0dSREFOTkVMU0UnOiBbJ2dyb3R0ZURhbm5lbHNlJywgJ0ludGVnZXInXSxcbiAgICAnR1JESU1TSk9ORCc6IFsnZ3JvdHRlRGltRGlhbWV0ZXInLCAnSW50ZWdlciddLFxuICAgICdHUkRJTVNKT05IJzogWydncm90dGVEaW1Ib3lyZScsICdJbnRlZ2VyJ10sXG4gICAgJ0dSRElNU0pPTk8nOiBbJ2dyb3R0ZURpbU92ZXInLCAnSW50ZWdlciddLFxuICAgICdHUkRJTVNKT05VJzogWydncm90dGVEaW1VbmRlcicsICdJbnRlZ2VyJ10sXG4gICAgJ0dSRElNU0pPTlYnOiBbJ2dyb3R0ZURpbVZlbnN0cmUnLCAnSW50ZWdlciddLFxuICAgICdHUkVOU0VNRVJLRU5FRFNBVFRJJzogWydncmVuc2VtZXJrZU5lZHNhc3R0SScsICdTdHJpbmcnXSxcbiAgICAnR1JFTlNFUFVOS1ROVU1NRVInOiBbJ2dyZW5zZXB1bmt0bnVtbWVyJywgJ1N0cmluZyddLFxuICAgICdHUkVOU0VQVU5LVFRZUEUnOiBbJ2dyZW5zZXB1bmt0dHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0dSRU5TRVZFRFRBSyc6IFsnZ3JlbnNlVmVkdGFrJywgJ1N0cmluZyddLFxuICAgICdHUkZPUk1FTE0nOiBbJ2dyb3R0ZUZvcm1FbGVtZW50JywgJ0ludGVnZXInXSxcbiAgICAnR1JHQU5HRk9STSc6IFsnZ3JvdHRlR2FGb3JtJywgJ0ludGVnZXInXSxcbiAgICAnR1JHQU5HVFlQRSc6IFsnZ3JvdHRlR2FUeXBlJywgJ1N0cmluZyddLFxuICAgICdHUkhPWURFJzogWydncm90dGVIb3lkZScsICdJbnRlZ2VyJ10sXG4gICAgJ0dSTElOVFlQRSc6IFsnZ3JvdHRlTGluamV0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnR1JPVExFR0VNRSc6IFsnZ3JvdHRlTGVnZW1lJywgJ1N0cmluZyddLFxuICAgICdHUk9UTk9ZQUtUJzogWydncm90dGVOb3lha3RpZ2hldCcsICdTdHJpbmcnXSxcbiAgICAnR1JPVFRFTEFTVCc6IFsnZ3JvdHRlTGFzdCcsICdJbnRlZ2VyJ10sXG4gICAgJ0dST1RURU5BVk4nOiBbJ2dyb3R0ZU5hdm4nLCAnU3RyaW5nJ10sXG4gICAgJ0dST1RURVBMQU4nOiBbJ2dyb3R0ZVBsYW4nLCAnU3RyaW5nJ10sXG4gICAgJ0dST1RUTEVOS0UnOiBbJ2dyb3R0ZUxlbmtlJywgJ0ludGVnZXInXSxcbiAgICAnR1JQS1RUWVBFJzogWydncm90dGVQa3RUeXBlJywgJ0ludGVnZXInXSxcbiAgICAnR1JQVU5LVE5SJzogWydncm90dGVQa3ROdW1tZXInLCAnU3RyaW5nJ10sXG4gICAgJ0dSVU5OQk9SSU5HUkVGJzogWydncnVubkJvcmluZ1JlZmVyYW5zZScsICdTdHJpbmcnXSxcbiAgICAnR1JVTk5GSE9MRCc6IFsnbG9zbUdydW5uZm9yaG9sZCcsICdJbnRlZ2VyJ10sXG4gICAgJ0dSVU5OR0FTUyc6IFsnZ3J1bm5HYXNzJywgJ0ludGVnZXInXSxcbiAgICAnR1JVTk5LUkVUUyc6IFsnZ3J1bm5rcmV0c251bW1lcicsICdJbnRlZ2VyJ10sXG4gICAgJ0dSVU5OTElOSkVOQVZOJzogWydncnVubmxpbmplcHVua3RuYXZuJywgJ1N0cmluZyddLFxuICAgICdHUlVOTkxJTkpFTlVNTUVSJzogWydncnVubmxpbmplcHVua3RudW1tZXInLCAnU3RyaW5nJ10sXG4gICAgJ0dSVU5OUklTU1JFRkVSQU5TRVNQT1InOiBbJ2dydW5ucmlzc3JlZmVyYW5zZVNwb3InLCAnU3RyaW5nJ10sXG4gICAgJ0dSVU5OVkFOTic6IFsnZ3J1bm52YW5uUG90ZW5zaWFsZScsICdJbnRlZ2VyJ10sXG4gICAgJ0dSVU5OVkVSREknOiBbJ2dydW5uVmVyZGknLCAnUmVhbCddLFxuICAgICdHUlZBUlNFTCc6IFsnZ3JvdHRlVmFyc2VsJywgJ0ludGVnZXInXSxcbiAgICAnR1ZBS1RfUFJPUyc6IFsnZ2VvVmVybkFrdGl2UHJvc2VzcycsICdTdHJpbmcnXSxcbiAgICAnR1ZBUkVBTCc6IFsnZ2VvVmVybkFyZWFsJywgJ1N0cmluZyddLFxuICAgICdHVkRMSUtFSE9MRCc6IFsnZ2VvVmVyblZlZGxpa2Vob2xkJywgJ1N0cmluZyddLFxuICAgICdHVkVSTkVfSUQnOiBbJ2dlb1Zlcm5PYmpla3RJZCcsICdJbnRlZ2VyJ10sXG4gICAgJ0dWRVJORVRZUEUnOiBbJ2dlb1Zlcm5UZW1hdHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0dWRVJOSFRZUEUnOiBbJ2dlb1Zlcm5Ib3ZlZHR5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ0dWRVJOS1JUX0EnOiBbJ2dlb1Zlcm5BS3JpdGVyaWUnLCAnU3RyaW5nJ10sXG4gICAgJ0dWRVJOS1JUX0InOiBbJ2dlb1Zlcm5CS3JpdGVyaWUnLCAnU3RyaW5nJ10sXG4gICAgJ0dWRVJOS1JUX0MnOiBbJ2dlb1Zlcm5DS3JpdGVyaWUnLCAnU3RyaW5nJ10sXG4gICAgJ0dWRVJOVkVSREknOiBbJ2dlb1Zlcm5WZXJkaScsICdJbnRlZ2VyJ10sXG4gICAgJ0dWR1JFTlNFVFknOiBbJ2dlb1Zlcm5HcmVuc2V0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnR1ZISU5OSExEJzogWydnZW9WZXJuSG92SW5uaG9sZCcsICdTdHJpbmcnXSxcbiAgICAnR1ZJTk5HUkVQJzogWydnZW9WZXJuSW5uZ3JlcCcsICdTdHJpbmcnXSxcbiAgICAnR1ZMSVRUUlRVUic6IFsnZ2VvVmVybkxpdHRlcmF0dXInLCAnU3RyaW5nJ10sXG4gICAgJ0dWT0ZGTlRMR0onOiBbJ2dlb1Zlcm5PZmZlbnRsaWdnam9yaW5nJywgJ1N0cmluZyddLFxuICAgICdHVk9NUl9OQVZOJzogWydnZW9WZXJuT21yTmF2bicsICdTdHJpbmcnXSxcbiAgICAnR1ZQUk9BTERFUic6IFsnZ2VvVmVyblByb3Nlc3NhbGRlcicsICdJbnRlZ2VyJ10sXG4gICAgJ0dWU0FLU1RBVFVTJzogWydnZW9WZXJuU2FrU3RhdHVzJywgJ0ludGVnZXInXSxcbiAgICAnR1ZTVEFUVVMnOiBbJ2dlb1Zlcm5UeXBlJywgJ0ludGVnZXInXSxcbiAgICAnR1ZTWVNURU0nOiBbJ2dlb1Zlcm5TeXN0ZW0nLCAnU3RyaW5nJ10sXG4gICAgJ0dWVElOTkhMRCc6IFsnZ2VvVmVyblRpbGxlZ2dJbm5ob2xkJywgJ1N0cmluZyddLFxuICAgICdHVlZLVF9QUk9TJzogWydnZW9WZXJuVmlrdGlnUHJvc2VzcycsICdTdHJpbmcnXSxcbiAgICAnR1lMRElHRlJBJzogWydneWxkaWdGcmEnLCAnRGF0ZSddLFxuICAgICdHWUxESUdUSUwnOiBbJ2d5bGRpZ1RpbCcsICdEYXRlJ10sXG4gICAgJ0gnOiBbJ2jDuHlkZScsICdJbnRlZ2VyJ10sXG4gICAgJ0hfRVVSRUY4OSc6IFsnaMO4eWRlT3ZlckV1cmVmODknLCAnUmVhbCddLFxuICAgICdIX0tBVF9MQU5EU0snOiBbJ2hvdmVka2F0ZWdvcmlMYW5kc2thcCcsICdTdHJpbmcnXSxcbiAgICAnSEFSX0hFSVMnOiBbJ2hhckhlaXMnLCAnU3RyaW5nJ10sXG4gICAgJ0hBU1RJR0hFVFNFTkhFVCc6IFsnaGFzdGlnaGV0c2VuaGV0JywgJ1N0cmluZyddLFxuICAgICdIQVZORV9EX0FETSc6IFsnaGF2bmVkaXN0cmlrdGFkbWluaXN0cmFzam9uJywgJ0ludGVnZXInXSxcbiAgICAnSEFWTkVfSUQnOiBbJ2hhdm5laWRlbnRpZmlrYXNqb24nLCAnSW50ZWdlciddLFxuICAgICdIQVZORUFWU05JVFROVU1NRVInOiBbJ2hhdm5lYXZzbml0dG51bW1lcicsICdJbnRlZ2VyJ10sXG4gICAgJ0hBVk5FQVZTTklUVFNUQVRVUyc6IFsnaGF2bmVhdnNuaXR0c3RhdHVzJywgJ1N0cmluZyddLFxuICAgICdIQVZORUFWU05JVFRUWVBFJzogWydoYXZuZWF2c25pdHR0eXBlJywgJ1N0cmluZyddLFxuICAgICdIQVZORVRFUk1JTkFMSVNQU05VTU1FUic6IFsnaGF2bmV0ZXJtaW5hbElTUFNudW1tZXInLCAnSW50ZWdlciddLFxuICAgICdIQVZORVRFUk1JTkFMTlVNTUVSJzogWydoYXZuZXRlcm1pbmFsbnVtbWVyJywgJ0ludGVnZXInXSxcbiAgICAnSEFWTkVURVJNSU5BTFNUQVRVUyc6IFsnaGF2bmV0ZXJtaW5hbHN0YXR1cycsICdTdHJpbmcnXSxcbiAgICAnSEFWTkVURVJNSU5BTFRZUEUnOiBbJ2hhdm5ldGVybWluYWx0eXBlJywgJ1N0cmluZyddLFxuICAgICdIQkVSR0tPREUnOiBbJ2hvdmVkQmVyZ0tvZGUnLCAnSW50ZWdlciddLFxuICAgICdIRUxMSU5HJzogWydoZWxsaW5nJywgJ0ludGVnZXInXSxcbiAgICAnSEVOREVMU0UnOiBbJ3RyYXPDqW5vZGVIZW5kZWxzZXN0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnSEVOU1lOU09ORU5BVk4nOiBbJ2hlbnN5blNvbmVuYXZuJywgJ1N0cmluZyddLFxuICAgICdIRkxPTSc6IFsndmFubnN0YW5kUmVnSMO4eWVzdFJlZ2lzdHJlcnRlJywgJ1JlYWwnXSxcbiAgICAnSElOREVSRkxBVEVfVFlQRSc6IFsnaGluZGVyRmxhdGVUeXBlJywgJ0ludGVnZXInXSxcbiAgICAnSElOREVSRkxBVEVQRU5FVFJFUklOR1NUWVBFJzogWydoaW5kZXJmbGF0ZXBlbmV0cmVyaW5nc3R5cGUnLCAnSW50ZWdlciddLFxuICAgICdISkVMUEVMSU5KRVRZUEUnOiBbJ2hqZWxwZWxpbmpldHlwZScsICdTdHJpbmcnXSxcbiAgICAnSEpFTU1FTFNHUlVOTkxBRyc6IFsnaGplbW1lbHNncnVubmxhZycsICdTdHJpbmcnXSxcbiAgICAnSEpVTFRSWUtLJzogWydoanVsdHJ5a2snLCAnU3RyaW5nJ10sXG4gICAgJ0gtTcOFTEVNRVRPREUnOiBbJ23DpWxlbWV0b2RlSMO4eWRlJywgJ0ludGVnZXInXSxcbiAgICAnSC1Ow5hZQUtUSUdIRVQnOiBbJ27DuHlha3RpZ2hldEjDuHlkZScsICdJbnRlZ2VyJ10sXG4gICAgJ0hPQic6IFsnaMO4eWRlT3ZlckJha2tlbicsICdSZWFsJ10sXG4gICAgJ0hPTEROSU5HU0tMQVNTRSc6IFsnaG9sZG5pbmdza2xhc3NlJywgJ0ludGVnZXInXSxcbiAgICAnSE9SX0LDhlJFS09OU1RSJzogWydob3Jpc29udGFsQsOmcmVrb25zdHInLCAnSW50ZWdlciddLFxuICAgICdIT1ZFRFBBUlNFTEwnOiBbJ2hvdmVkUGFyc2VsbCcsICdJbnRlZ2VyJ10sXG4gICAgJ0hPVkVEVEVJRyc6IFsnaG92ZWR0ZWlnJywgJ1N0cmluZyddLFxuICAgICdIUkVGJzogWydow7h5ZGVyZWZlcmFuc2UnLCAnU3RyaW5nJ10sXG4gICAgJ0gtUkVGLUlOVCc6IFsnaMO4eWRlUmVmZXJhbnNlSW50ZXJuYXNqb25hbCcsICdJbnRlZ2VyJ10sXG4gICAgJ0hSVic6IFsndmFubnN0YW5kSMO4eWVzdGVSZWd1bGVydCcsICdSZWFsJ10sXG4gICAgJ0hVU0hPTERCRUxBU1ROSU5HJzogWydodXNob2xkQmVsYXN0bmluZycsICdJbnRlZ2VyJ10sXG4gICAgJ0hVU0zDmFBFTlInOiBbJ2h1c0zDuHBlbnInLCAnSW50ZWdlciddLFxuICAgICdIVVNOUic6IFsnaHVzTnInLCAnSW50ZWdlciddLFxuICAgICdIVkFOTic6IFsndmFubnN0YW5kSMO4eWVzdFJlZ2lzdHJlcnQnLCAnUmVhbCddLFxuICAgICdIWVRURV9JRCc6IFsnaHl0dGVJZCcsICdJbnRlZ2VyJ10sXG4gICAgJ0hZVFRFRUlFUic6IFsnaHl0dGVlaWVyJywgJ0ludGVnZXInXSxcbiAgICAnSMOYWURFJzogWydow7h5ZGUnLCAnUmVhbCddLFxuICAgICdIw5hZREVfVElMX05BVic6IFsnaMO4eWRlVGlsTmF2ZXQnLCAnSW50ZWdlciddLFxuICAgICdIw5hZREUtUkVGJzogWydow7h5ZGUtUmVmZXJhbnNlJywgJ1N0cmluZyddLFxuICAgICdIw5hZREVSRUZFUkFOU0VTUE9SJzogWydow7h5ZGVyZWZlcmFuc2VTcG9yJywgJ1N0cmluZyddLFxuICAgICdIw5hZREUtVFlQRSc6IFsnaMO4eWRlVHlwZScsICdTdHJpbmcnXSxcbiAgICAnSUQnOiBbJ2lkZW50aWZpa2Fzam9uJywgJ1N0cmluZyddLFxuICAgICdJS1JBRlQnOiBbJ2lrcmFmdHRyZWRlbHNlc2RhdG8nLCAnRGF0ZSddLFxuICAgICdJTU9UT1BQTUVSS0VUWVBFJzogWydpbW9Ub3BwbWVya2V0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnSU1QJzogWydpbXBlZGltZW50cHJvc2VudFNrb2cnLCAnSW50ZWdlciddLFxuICAgICdJTkRFS1NNSU4nOiBbJ2luZGVrc01pbmVyYWwnLCAnU3RyaW5nJ10sXG4gICAgJ0lORElLQVRPUic6IFsnaW5kaWthdG9yRmFzdG1lcmtlbnVtbWVyJywgJ1N0cmluZyddLFxuICAgICdJTkRVU1RSSUJFTEFTVE5JTkcnOiBbJ2luZHVzdHJpQmVsYXN0bmluZycsICdJbnRlZ2VyJ10sXG4gICAgJ0lORklMVCc6IFsnaW5maWx0cmFzam9uRXZuZScsICdJbnRlZ2VyJ10sXG4gICAgJ0lORk9STUFTSk9OJzogWydpbmZvcm1hc2pvbicsICdTdHJpbmcnXSxcbiAgICAnRkFHT01Sw4VERUdSVVBQRSc6IFsnZmFnb21yw6VkZWdydXBwZScsICdTdHJpbmcnXSxcbiAgICAnRkFHT01Sw4VERV9GVUxMVF9OQVZOJzogWydmYWdvbXLDpWRldHMgZnVsbGUgbmF2bicsICdTdHJpbmcnXSxcbiAgICAnSU5PTl9BVlMnOiBbJ2lubmdyZXBzZnJpU29uZUF2c3RhbmQnLCAnUmVhbCddLFxuICAgICdJTk9OU09ORSc6IFsnaW5uZ3JlcHNmcmllTmF0dXJvbXLDpWRlcklOb3JnZVNvbmUnLCAnU3RyaW5nJ10sXG4gICAgJ0lOUlRfRlVOS1NKT04nOiBbJ2lubnJldG5pbmdzZnVua3Nqb24nLCAnU3RyaW5nJ10sXG4gICAgJ0lOUlRfSE9WRURUWVBFJzogWydpbm5yZXRuaW5nc2hvdmVkdHlwZScsICdTdHJpbmcnXSxcbiAgICAnSU5SVF9NQVRSJzogWydpbm5yZXRuaW5nc21hdGVyaWFsdHlwZScsICdTdHJpbmcnXSxcbiAgICAnSU5SVF9OQVZOJzogWydpbm5yZXRuaW5nc25hdm4nLCAnU3RyaW5nJ10sXG4gICAgJ0lOUlRfVFlQRSc6IFsnaW5ucmV0bmluZ3N0eXBlJywgJ1N0cmluZyddLFxuICAgICdJTlNUX0VGRkVLVCc6IFsnaW5zdGFsbGVydEVmZmVrdCcsICdJbnRlZ2VyJ10sXG4gICAgJ0lOU1RBTExBU0pPTlNCw5hZRUtBVEVHT1JJJzogWydpbnN0YWxsYXNqb25zYsO4eWVrYXRlZ29yaScsICdJbnRlZ2VyJ10sXG4gICAgJ0lOU1RBTExFUlRfw4VSJzogWydpbnN0YWxsZXJ0w4VyJywgJ0RhdGUnXSxcbiAgICAnSU5UX1NUQVQnOiBbJ2ludGVybmFzam9uYWxTdGF0dXMnLCAnSW50ZWdlciddLFxuICAgICdKX0xSRUcnOiBbJ2pvcmRyZWdpc3RlckxyZWcnLCAnU3RyaW5nJ10sXG4gICAgJ0pFUk5CQU5FRUlFUic6IFsnamVybmJhbmVlaWVyJywgJ1N0cmluZyddLFxuICAgICdKRVJOQkFORVRZUEUnOiBbJ2plcm5iYW5ldHlwZScsICdTdHJpbmcnXSxcbiAgICAnSk9SRCc6IFsnam9yZGtsYXNzaWZpa2Fzam9uJywgJ0ludGVnZXInXSxcbiAgICAnSk9SREFSQic6IFsnYW5iZWZhbHRKb3JkYXJiZWlkaW5nJywgJ0ludGVnZXInXSxcbiAgICAnSk9SREFSVCc6IFsnbG9zbWFzc2V0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnSlJFR0FSRUFMJzogWydqb3JkcmVnaXN0ZXJBcmVhbCcsICdSZWFsJ10sXG4gICAgJ0pSRUdFS09ERSc6IFsnam9yZHJlZ2lzdGVyU3RhdHVzRWllbmRvbScsICdJbnRlZ2VyJ10sXG4gICAgJ0pSRklHTlInOiBbJ2pvcmRyZWdpc3RlckZpZ3VybnVtbWVyJywgJ0ludGVnZXInXSxcbiAgICAnSlNSX0FSRUFMJzogWydqb3Jkc2tpZnRlQXJlYWx0aWxzdGFuZCcsICdJbnRlZ2VyJ10sXG4gICAgJ0pTVlNBSyc6IFsnam9yZHNraWZ0ZXJldHRlblNha3NudW1tZXInLCAnU3RyaW5nJ10sXG4gICAgJ0pYQVJFQUwnOiBbJ2FubmV0YXJlYWwnLCAnSW50ZWdlciddLFxuICAgICdLQUJFTFRZUEUnOiBbJ2thYmVsdHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0tBSV9EWUJERSc6IFsna2FpRHliZGUnLCAnUmVhbCddLFxuICAgICdLQUlfVFlQRSc6IFsna2FpVHlwZUluZm9ybWFzam9uJywgJ0ludGVnZXInXSxcbiAgICAnS0FMSUJSRVJJTkdTUkFQUE9SVCc6IFsna2FsaWJyZXJpbmdzcmFwcG9ydCcsICdTdHJpbmcnXSxcbiAgICAnS0FNRVJBVFlQRSc6IFsna2FtZXJhdHlwZScsICdTdHJpbmcnXSxcbiAgICAnS0FQQVNJVEVUTEFOR0VLSsOYUkVUw5hZJzogWydrYXBhc2l0ZXRMYW5nZWtqw7hyZXTDuHknLCAnSW50ZWdlciddLFxuICAgICdLQVBBU0lURVRQRVJTT05CSUxFUic6IFsna2FwYXNpdGV0UGVyc29uYmlsZXInLCAnSW50ZWdlciddLFxuICAgICdLQVBBU0lURVRQRVJTT05FS1ZJVkFMRU5URVInOiBbJ2thcGFzaXRldFBlcnNvbmVrdml2YWxlbnRlcicsICdJbnRlZ2VyJ10sXG4gICAgJ0tBUkRJTkFMTUVSS0VUWVBFJzogWydrYXJkaW5hbG1lcmtldHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0tBUlRJRCc6IFsna2FydGJsYWRpbmRla3MnLCAnU3RyaW5nJ10sXG4gICAgJ0tBUlRMRUdHSU5HU0VUQVBQRSc6IFsna2FydGxlZ2dpbmdzZXRhcHBlJywgJ1N0cmluZyddLFxuICAgICdLQVJUUkVHJzogWydrYXJ0cmVnaXN0cmVyaW5nJywgJ0ludGVnZXInXSxcbiAgICAnS0FSVFNJR05BVFVSJzogWydrYXJ0c2lnbmF0dXInLCAnU3RyaW5nJ10sXG4gICAgJ0tBUlRUWVBFJzogWydrYXJ0dHlwZScsICdTdHJpbmcnXSxcbiAgICAnS0JJU1BFTlInOiBbJ2Jpc3BlZMO4bW1lbnVtbWVyJywgJ0ludGVnZXInXSxcbiAgICAnS0lMREVQUklWQVRWQU5ORic6IFsna2lsZGVQcml2YXRWYW5uZm9yc3luaW5nJywgJ0ludGVnZXInXSxcbiAgICAnS0pFTExFUic6IFsna2plbGxlcicsICdJbnRlZ2VyJ10sXG4gICAgJ0tKRVJORU9NUsOFREVTVEFUVVMnOiBbJ2tqZXJuZW9tcsOlZGVzdGF0dXMnLCAnU3RyaW5nJ10sXG4gICAgJ0tKw5hLS0VOVElMR0FORyc6IFsna2rDuGtrZW50aWxnYW5nJywgJ0ludGVnZXInXSxcbiAgICAnS0xBU1NJRklTRVJJTkcnOiBbJ2t1bHR1cmxhbmRza2FwS2xhc3NpZmlzZXJpbmcnLCAnU3RyaW5nJ10sXG4gICAgJ0tMT1JfRsOYUl9GT1JCUlVLJzogWydrbG9yS29udGFrdHRpZEbDuHJGb3JicnVrJywgJ0ludGVnZXInXSxcbiAgICAnS0xPUk9fTUFLUyc6IFsna2xvcm9meWxsTWFrc2ltdW0nLCAnSW50ZWdlciddLFxuICAgICdLTE9UUEFSJzogWydrbG90b2lkZVBhcmFtZXRlcicsICdSZWFsJ10sXG4gICAgJ0tMT1RSQUQxJzogWydrbG90b2lkZVJhZGl1cyAxJywgJ1JlYWwnXSxcbiAgICAnS0xPVFJBRDInOiBbJ2tsb3RvaWRlUmFkaXVzIDInLCAnUmVhbCddLFxuICAgICdSVVRFVkFOU0tFTElHSEVUU0dSQUQnOiBbJ3J1dGV2YW5za2VsaWdoZXRzZ3JhZCcsICdTdHJpbmcnXSxcbiAgICAnUldZX0LDhlJFRVZORV9CRU4nOiBbJ2LDpnJlZXZuZWJlbmV2bmVsc2UnLCAnU3RyaW5nJ10sXG4gICAgJ1JXWV9UWVBFJzogWydydWxsZWJhbmVUeXBlJywgJ1N0cmluZyddLFxuICAgICdSV1lNRVJLJzogWydydWxsZWJhbmVvcHBtZXJraW5nJywgJ0ludGVnZXInXSxcbiAgICAnUllEREVCUkVEREUnOiBbJ3J5ZGRlYnJlZGRlJywgJ0ludGVnZXInXSxcbiAgICAnUsOYUl9FTkRFX1BLVCc6IFsnbGVkbmluZ3NlbmRlcHVua3QnLCAnU3RyaW5nJ10sXG4gICAgJ1LDmFJfU1RBUlRfUEtUJzogWydsZWRuaW5nc3N0YXJ0cHVua3QnLCAnU3RyaW5nJ10sXG4gICAgJ1LDmFJMRUROSU5HU1RZUEUnOiBbJ3LDuHJsZWRuaW5nc3R5cGUnLCAnSW50ZWdlciddLFxuICAgICdTQUtfQVZTTFVUVCc6IFsnc2FrQXZzbHV0dGV0JywgJ1N0cmluZyddLFxuICAgICdTQUtTTlInOiBbJ3Nha3NudW1tZXInLCAnSW50ZWdlciddLFxuICAgICdTQUtTT01GJzogWydzYWtzb21mYW5nJywgJ0ludGVnZXInXSxcbiAgICAnU0FLU1RZUEUnOiBbJ3Nha3N0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnU0FMSU5JVEVUJzogWydzYWxpbml0ZXQnLCAnSW50ZWdlciddLFxuICAgICdTQVRfS09NX0lEJzogWydzYXRlbGxpdHRrb21tdW5pa2Fzam9uc0lkJywgJ1N0cmluZyddLFxuICAgICdTQ0FOTkVST1BQTMOYU05JTkcnOiBbJ3NjYW5uZXJvcHBsw7hzbmluZycsICdSZWFsJ10sXG4gICAgJ1NFRERZQkRFTUUnOiBbJ3NlZER5YmRlTWV0ZXInLCAnUmVhbCddLFxuICAgICdTRUREWUJERU1TJzogWydzZWREeWJkZU1pbGxpc2VrdW5kJywgJ1JlYWwnXSxcbiAgICAnU0VES09STlNUUic6IFsnc2VkS29ybnN0b3JyZWxzZScsICdJbnRlZ2VyJ10sXG4gICAgJ1NFRE1FS1RNRSc6IFsnc2VkTWVrdGlnaGV0TWV0ZXInLCAnUmVhbCddLFxuICAgICdTRURNRUtUTVMnOiBbJ3NlZE1la3RpZ2hldE1pbGxpc2VrdW5kJywgJ1JlYWwnXSxcbiAgICAnU0VGUkFLX0ZVTktfS09ERSc6IFsnc2VmcmFrRnVua3Nqb25zS29kZScsICdJbnRlZ2VyJ10sXG4gICAgJ1NFRlJBS19GVU5LX1NUQVQnOiBbJ3NlZnJha0Z1bmtzam9uc3N0YXR1cycsICdTdHJpbmcnXSxcbiAgICAnS01fQU5UQUxMJzogWydrdWx0dXJtaW5uZUFudGFsbCcsICdJbnRlZ2VyJ10sXG4gICAgJ0tNX0JFVEVHTic6IFsna3VsdHVybWlubmVCZXRlZ25lbHNlJywgJ1N0cmluZyddLFxuICAgICdLTV9EQVQnOiBbJ2t1bHR1cm1pbm5lRGF0ZXJpbmcnLCAnU3RyaW5nJ10sXG4gICAgJ0tNX0RBVEtWQUwnOiBbJ2t1bHR1cm1pbm5lRGF0ZXJpbmdLdmFsaXRldCcsICdTdHJpbmcnXSxcbiAgICAnS01fRlVOS19Ow4UnOiBbJ2t1bHR1cm1pbm5lTsOldsOmcmVuZGVGdW5rc2pvbicsICdTdHJpbmcnXSxcbiAgICAnS01fRlVOS19PUCc6IFsna3VsdHVybWlubmVPcHByaW5uZWxpZ0Z1bmtzam9uJywgJ1N0cmluZyddLFxuICAgICdLTV9IT1ZFREdSVVBQRSc6IFsna3VsdHVybWlubmVIb3ZlZGdydXBwZScsICdTdHJpbmcnXSxcbiAgICAnS01fS0FURUdPUkknOiBbJ2t1bHR1cm1pbm5lS2F0ZWdvcmknLCAnU3RyaW5nJ10sXG4gICAgJ0tNX01BVCc6IFsna3VsdHVybWlubmVIb3ZlZE1hdGVyaWFsZScsICdTdHJpbmcnXSxcbiAgICAnS01fU1lOTElHJzogWydrdWx0dXJtaW5uZVN5bmxpZycsICdTdHJpbmcnXSxcbiAgICAnS01fVkVSTkVWRVJESSc6IFsna3VsdHVybWlubmVWZXJuZXZlcmRpJywgJ1N0cmluZyddLFxuICAgICdLT0REUklGVCc6IFsnbGFuZGJydWtzcmVnQmVkcmlmdHNrb2RlJywgJ0ludGVnZXInXSxcbiAgICAnS09NX0tBTExTSUdOQUwnOiBbJ2tvbUthbGxTaWduYWwnLCAnU3RyaW5nJ10sXG4gICAgJ0tPTV9LQU5BTCc6IFsna29tS2FuYWwnLCAnU3RyaW5nJ10sXG4gICAgJ0tPTU0nOiBbJ2tvbW11bmVudW1tZXInLCAnSW50ZWdlciddLFxuICAgICdLT01NX0FMVF9BUkVBTCc6IFsna29tbUFsdGVybmF0aXZ0QXJlYWwnLCAnUmVhbCddLFxuICAgICdLT01NX0FMVF9BUkVBTDInOiBbJ2tvbW1BbHRlcm5hdGl2dEFyZWFsMicsICdSZWFsJ10sXG4gICAgJ0tPTU1FTlRBUic6IFsna29tbWVudGFyJywgJ1N0cmluZyddLFxuICAgICdLT01NRU5UQVJfVFlQRSc6IFsna29tbWVudGFyVHlwZScsICdTdHJpbmcnXSxcbiAgICAnS09NTVNFSyc6IFsna29tbXVuZVNla3VuZMOmcicsICdJbnRlZ2VyJ10sXG4gICAgJ0tPTVBPTkVOVCc6IFsna29tcG9uZW50JywgJ1N0cmluZyddLFxuICAgICdLT05TVEExJzogWydrb25zdGFudEExJywgJ1JlYWwnXSxcbiAgICAnS09OU1RBMic6IFsna29uc3RhbnRBMicsICdSZWFsJ10sXG4gICAgJ0tPTlNUQjEnOiBbJ2tvbnN0YW50QjEnLCAnUmVhbCddLFxuICAgICdLT05TVEIyJzogWydrb25zdGFudEIyJywgJ1JlYWwnXSxcbiAgICAnS09OU1RDMSc6IFsna29uc3RhbnRDMScsICdSZWFsJ10sXG4gICAgJ0tPTlNUQzInOiBbJ2tvbnN0YW50QzInLCAnUmVhbCddLFxuICAgICdLT05UQUtUUEVSU09OJzogWydrb250YWt0cGVyc29uJywgJ1N0cmluZyddLFxuICAgICdLT09SREtWQUxLT0RFJzogWydrb29yZGluYXRrdmFsaXRldEtvZGUnLCAnU3RyaW5nJ10sXG4gICAgJ0tPUElEQVRPJzogWydrb3BpZGF0bycsICdEYXRlJ10sXG4gICAgJ0tPUExfQlJVJzogWydrb3BsaW5nQnJ1a3NvbXLDpWRlJywgJ1N0cmluZyddLFxuICAgICdLT1BMX0tBVCc6IFsna29wbGluZ3NrYXRlZ29yaScsICdJbnRlZ2VyJ10sXG4gICAgJ0tPUExfTkFWJzogWydrb3BsaW5nc25hdm4nLCAnU3RyaW5nJ10sXG4gICAgJ0tPUExfVFlQJzogWydrb3BsaW5nc3R5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ0tPUlROQVZOJzogWydrb3J0bmF2bicsICdTdHJpbmcnXSxcbiAgICAnS09TVEhPTERBUlQnOiBbJ2tvc3Rob2xkQXJ0JywgJ1N0cmluZyddLFxuICAgICdLT1NUSE9MRFNSw4VEVFlQRSc6IFsna29zdGhvbGRzcsOlZFR5cGUnLCAnSW50ZWdlciddLFxuICAgICdLUCc6IFsna251dGVQdW5rdCcsICdJbnRlZ2VyJ10sXG4gICAgJ0tQQU5HSVRUSEVOU1lOJzogWydhbmdpdHRIZW5zeW4nLCAnSW50ZWdlciddLFxuICAgICdLUEFSRUFMRk9STcOFTCc6IFsnYXJlYWxmb3Jtw6VsJywgJ0ludGVnZXInXSxcbiAgICAnS1BCw4VORExFR0dJTkcnOiBbJ2LDpW5kbGVnZ2luZycsICdJbnRlZ2VyJ10sXG4gICAgJ0tQREVUQUxKRVJJTkcnOiBbJ2RldGFsamVyaW5nJywgJ0ludGVnZXInXSxcbiAgICAnS1BGQVJFJzogWydmYXJlJywgJ0ludGVnZXInXSxcbiAgICAnS1BHSkVOTk9NRsOYUklORyc6IFsnZ2plbm5vbWbDuHJpbmcnLCAnSW50ZWdlciddLFxuICAgICdLUElORlJBU1RSVUtUVVInOiBbJ2luZnJhc3RydWt0dXInLCAnSW50ZWdlciddLFxuICAgICdLUElORlJBU1RSVUtUVVJMSU5KRSc6IFsnaW5mcmFzdHJ1a3R1ckxpbmplJywgJ0ludGVnZXInXSxcbiAgICAnS1BKVVJMSU5KRSc6IFsnanVyaWRpc2tsaW5qZScsICdJbnRlZ2VyJ10sXG4gICAgJ0tQUkVTVEVOQVZOJzogWydwcmVzdGVnamVsZG5hdm4nLCAnU3RyaW5nJ10sXG4gICAgJ0tQUkVTVEVOUic6IFsncHJlc3RlZ2plbGRudW1tZXInLCAnSW50ZWdlciddLFxuICAgICdLUFJPU1RJTkFWTic6IFsncHJvc3RpbmF2bicsICdTdHJpbmcnXSxcbiAgICAnS1BST1NUSU5SJzogWydwcm9zdGludW1tZXInLCAnSW50ZWdlciddLFxuICAgICdLUFNJS1JJTkcnOiBbJ3Npa3JpbmcnLCAnSW50ZWdlciddLFxuICAgICdLUFNUw5hZJzogWydzdMO4eScsICdJbnRlZ2VyJ10sXG4gICAgJ0tSQUZUVkVSS1RZUCc6IFsna3JhZnR2ZXJrdHlwZScsICdTdHJpbmcnXSxcbiAgICAnS1JFVFNOQVZOJzogWydrcmV0c25hdm4nLCAnU3RyaW5nJ10sXG4gICAgJ0tSRVRTTlVNTUVSJzogWydrcmV0c251bW1lcicsICdTdHJpbmcnXSxcbiAgICAnS1JFVFNUWVBFS09ERSc6IFsna3JldHN0eXBla29kZScsICdTdHJpbmcnXSxcbiAgICAnS1JFVFNUWVBFTkFWTic6IFsna3JldHN0eXBlbmF2bicsICdTdHJpbmcnXSxcbiAgICAnS1VMVF9ISVNUX0lOVCc6IFsna3VsdHVyaGlzdG9yaXNrSW50ZXJlc3NlJywgJ1N0cmluZyddLFxuICAgICdLVklLS0xFSVJFU1ZVUkQnOiBbJ3N0YWJpbGl0ZXRWdXJkZXJpbmdLdmlra2xlaXJlJywgJ0ludGVnZXInXSxcbiAgICAnS1lTVEtPTlNUUlVLU0pPTlNUWVBFJzogWydreXN0a29uc3RydWtzam9uc3R5cGUnLCAnSW50ZWdlciddLFxuICAgICdLWVNUUkVGJzogWydreXN0cmVmZXJhbnNlJywgJ1N0cmluZyddLFxuICAgICdLWVNUVFlQJzogWydreXN0dHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0tZU1RWRVJLU0RJU1RSSUtUJzogWydreXN0dmVya3NkaXN0cmlrdCcsICdJbnRlZ2VyJ10sXG4gICAgJ0xBR1JFVF9EQVRPJzogWydsYWdyZXREYXRvJywgJ0RhdGUnXSxcbiAgICAnTEFORDEnOiBbJ2bDuHJzdGVMYW5kJywgJ1N0cmluZyddLFxuICAgICdMQU5EMic6IFsnYW5uZXRMYW5kJywgJ1N0cmluZyddLFxuICAgICdMQU5ERU1FUktFS0FURUdPUkknOiBbJ2xhbmRlYmVya2VrYXRlZ29yaScsICdJbnRlZ2VyJ10sXG4gICAgJ0xBTkRLT0RFJzogWydsYW5ka29kZScsICdTdHJpbmcnXSxcbiAgICAnTEFURVJBTE1FUktFVFlQRSc6IFsnbGF0ZXJhbG1lcmtldHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0xERUwnOiBbJ2xhbmRzZGVsb21yw6VkZScsICdJbnRlZ2VyJ10sXG4gICAgJ0xFRE5fQlJVJzogWydsZWRuaW5nYnJ1a3NvbXLDpWRlJywgJ1N0cmluZyddLFxuICAgICdMRUROX05BVic6IFsnbGVkbmluZ3NuYXZuJywgJ1N0cmluZyddLFxuICAgICdMRUROX1RZUCc6IFsnbGVkbmluZ3N0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnTEVETklOR1NFSUVSJzogWydsZWRuaW5nc2VpZXInLCAnU3RyaW5nJ10sXG4gICAgJ0xFS0VSRUtSVFlQRSc6IFsnbGVrZVJla3JlYXNqb25zdHlwZScsICdTdHJpbmcnXSxcbiAgICAnTEVOR0RFJzogWydsZW5nZGUnLCAnUmVhbCddLFxuICAgICdMRU5HREVFTkhFVCc6IFsnbGVuZ2RlZW5oZXQnLCAnU3RyaW5nJ10sXG4gICAgJ0xFTkdERU9WRVJMQVBQJzogWydsZW5nZGVvdmVybGFwcCcsICdJbnRlZ2VyJ10sXG4gICAgJ0xFTkdERVNFS1RPUkxJTkpFMSc6IFsnbGVuZ2RlU2VrdG9ybGluamUxJywgJ1JlYWwnXSxcbiAgICAnTEVOR0RFU0VLVE9STElOSkUyJzogWydsZW5nZGVTZWt0b3JsaW5qZTInLCAnUmVhbCddLFxuICAgICdMRVRFX0FSRUFMJzogWydsZXRlYXJlYWwnLCAnUmVhbCddLFxuICAgICdMSF9CRVJFRFNLQVAnOiBbJ2x1ZnRoYXZuQmVyZWRza2Fwc2tvZGUnLCAnSW50ZWdlciddLFxuICAgICdMSEFSRUFMJzogWydsdWZ0aGF2bkFyZWFsZXInLCAnSW50ZWdlciddLFxuICAgICdMSERJU1RUWVBFJzogWydsdWZ0aGF2bmRpc3RhbnNldHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0xIRUxFVic6IFsnbHVmdGhhdm5lbGV2YXNqb24nLCAnUmVhbCddLFxuICAgICdMSEZERVQnOiBbJ2x1ZnRoYXZuRm9yc3ZhcnNPYmpla3REZXRhbGonLCAnSW50ZWdlciddLFxuICAgICdMSEZNX1RZUEUnOiBbJ2x1ZnRoYXZuRmFzdG1lcmtldHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0xISU5TVF9UWVBFJzogWydsdWZ0aGF2bkluc3RydW1lbnRlcmluZ1R5cGUnLCAnSW50ZWdlciddLFxuICAgICdMSExZU19PUFBIw5hZRF9ORURGRUxUJzogWydsdWZ0aGF2bkx5c09wcGjDuHlkTmVkZmVsdCcsICdTdHJpbmcnXSxcbiAgICAnTEhMWVNGQVJHRSc6IFsnbHVmdGhhdm5seXNGYXJnZScsICdJbnRlZ2VyJ10sXG4gICAgJ0xITFlTUkVUTic6IFsnbHVmaGF2bkx5c3JldG5pbmcnLCAnSW50ZWdlciddLFxuICAgICdMSExZU1RZUEUnOiBbJ2x1ZnRoYXZubHlzdHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0xIU0tJTFRLQVRFR09SSSc6IFsnbHVmdGhhdm5za2lsdGthdGFnb3JpJywgJ0ludGVnZXInXSxcbiAgICAnTEhTS0lMVExZUyc6IFsnbHVmdGhhdm5za2lsdGx5cycsICdTdHJpbmcnXSxcbiAgICAnTEhTS0lMVFRZUEUnOiBbJ2x1ZnRoYXZuc2tpbHR0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnTElORUFNRU5UVFlQRSc6IFsnbGluZWFtZW50VHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0xJTksnOiBbJ2xpbmsnLCAnU3RyaW5nJ10sXG4gICAgJ0xKT1JES0wnOiBbJ2xva2FsSm9yZHJlc3N1cnMnLCAnSW50ZWdlciddLFxuICAgICdMSk9SREtMX0EnOiBbJ25lZGtsYXNzaWZpc2VyaW5nTG9rYWxKb3JkcmVzc3VycycsICdJbnRlZ2VyJ10sXG4gICAgJ0xPS19OQVZOJzogWydsb2thbGl0ZXRzbmF2bicsICdTdHJpbmcnXSxcbiAgICAnTE9LX05SJzogWydsb2thbGl0ZXRzbnVtbWVyJywgJ0ludGVnZXInXSxcbiAgICAnTE9TTElHSEVUJzogWydsb3NsaWdoZXRHcmFkJywgJ0ludGVnZXInXSxcbiAgICAnTE9TTUtPUk5TVFInOiBbJ2xvc21Lb3Juc3RvcnJlbHNlJywgJ0ludGVnZXInXSxcbiAgICAnTE9TTU9WRVJGTEFURVRZUEUnOiBbJ2xvc21PdmVyZmxhdGVUeXBlJywgJ0ludGVnZXInXSxcbiAgICAnTE9WRElTUCc6IFsnZGlzcGVuc2Fzam9uVHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0xPVlJFRkJFU0tSSVZFTFNFJzogWydsb3ZyZWZlcmFuc2VCZXNrcml2ZWxzZScsICdTdHJpbmcnXSxcbiAgICAnTE9WUkVGRVJBTlNFJzogWydsb3ZyZWZlcmFuc2VUeXBlJywgJ0ludGVnZXInXSxcbiAgICAnTFJfQUtUSVYnOiBbJ2xhbmRicnVrc3JlZ0FrdGl2JywgJ0ludGVnZXInXSxcbiAgICAnTFJfVFlQRSc6IFsnbGFuZGJydWtzcmVnVHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0xSVic6IFsndmFubnN0YW5kTGF2ZXN0UmVndWxlcnQnLCAnUmVhbCddLFxuICAgICdMVUZUSEFWTkhJTkRFUlRSRUdSVVBQRSc6IFsnbHVmdGhhdm5oaW5kZXJUcmVncnVwcGUnLCAnU3RyaW5nJ10sXG4gICAgJ0xWQU5OJzogWyd2YW5uc3RhbmRMYXZlc3RSZWdpc3RyZXJ0JywgJ1JlYWwnXSxcbiAgICAnTFlTSMOYWURFJzogWydseXNow7h5ZGUnLCAnUmVhbCddLFxuICAgICdMw5hQRU5SJzogWydicnVrc2VuaGV0TMO4cGVucicsICdJbnRlZ2VyJ10sXG4gICAgJ01BR0FTSU5OUic6IFsnbWFnYXNpbk5yJywgJ0ludGVnZXInXSxcbiAgICAnTUFLU0jDmFlERSc6IFsnbWFrc2jDuHlkZScsICdSZWFsJ10sXG4gICAgJ01BS1NJTUFMUkVLS0VWSURERSc6IFsnbWFrc2ltYWxSZWtrZXZpZGRlJywgJ1JlYWwnXSxcbiAgICAnTUFLU1NOw5hIw5hZREUnOiBbJ21ha3NTbsO4aMO4eWRlJywgJ0ludGVnZXInXSxcbiAgICAnTUFOR0VMTUFUUklLS0VMRsOYUklOR1NLUkFWJzogWydtYW5nZWxNYXRyaWtrZWxmw7hyaW5nc2tyYXYnLCAnU3RyaW5nJ10sXG4gICAgJ01BUktJRCc6IFsnam9yZHJlZ2lzdGVyTWFya3NsYWdLb2JsaW5nJywgJ0ludGVnZXInXSxcbiAgICAnTUFSS1NMQUdBVkdSVFlQRSc6IFsnbWFya3NsYWdBdmdyZW5zaW5nVHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ01BU1NFRU5IRVQnOiBbJ21hc3NlZW5oZXQnLCAnU3RyaW5nJ10sXG4gICAgJ01BVEVSSUFMRSc6IFsnbWF0ZXJpYWxlQm9sdCcsICdJbnRlZ2VyJ10sXG4gICAgJ01BVEVSSUFMRV9ZVFRFUlYnOiBbJ21hdGVyaWFsZVl0dGVydmVnZycsICdJbnRlZ2VyJ10sXG4gICAgJ01BVFJfS09ERSc6IFsnbWF0ZXJpZWxsa29kZScsICdTdHJpbmcnXSxcbiAgICAnTUFUUklLS0VMS09NTVVORSc6IFsnbWF0cmlra2Vsa29tbXVuZScsICdJbnRlZ2VyJ10sXG4gICAgJ01BVFJUWVBFJzogWydtYXRlcmlhbFR5cGUnLCAnSW50ZWdlciddLFxuICAgICdNQVRSVU5UWVBFJzogWydtYXRlcmlhbFVuZGVydHlwZScsICdTdHJpbmcnXSxcbiAgICAnTUFYX0VMRU1FTlRfUEtUJzogWydtYWtzQW50YWxsUHVua3RHZW9tZXRyaXR5cGUxJywgJ0ludGVnZXInXSxcbiAgICAnTUFYX09CSkVLVF9QS1QnOiBbJ21ha3NBbnRhbGxQdW5rdEdlb21ldHJpdHlwZTInLCAnSW50ZWdlciddLFxuICAgICdNQVhfUkVGX09CSkVLVCc6IFsnbWFrc0FudGFsbEdlb21ldHJpUmVmZXJhbnNlJywgJ0ludGVnZXInXSxcbiAgICAnTUFYLUFWVklLJzogWydtYWtzaW1hbHRBdnZpaycsICdJbnRlZ2VyJ10sXG4gICAgJ01BWC1OJzogWydtYWtzaW11bU5vcmQnLCAnSW50ZWdlciddLFxuICAgICdNQVgtw5gnOiBbJ21ha3NpbXVtw5hzdCcsICdJbnRlZ2VyJ10sXG4gICAgJ01FRElVTSc6IFsnbWVkaXVtJywgJ1N0cmluZyddLFxuICAgICdNRUtUNTAnOiBbJ21la3RpZ2hldEZlbXRpUHJvc2VudCcsICdSZWFsJ10sXG4gICAgJ01FUktFRk9STSc6IFsnbWVya2Vmb3JtJywgJ0ludGVnZXInXSxcbiAgICAnTUVSS0VMSVNURU5VTU1FUic6IFsnbWVya2VsaXN0ZW51bW1lcicsICdJbnRlZ2VyJ10sXG4gICAgJ01FUktFTcOYTlNURVInOiBbJ21lcmtlbcO4bnN0ZXInLCAnSW50ZWdlciddLFxuICAgICdNRVRBREFUQUxJTksnOiBbJ21ldGFkYXRhbGluaycsICdTdHJpbmcnXSxcbiAgICAnTUVUQUxJTlRZUCc6IFsnbWV0YW1vcmZMaW5qZXR5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ01FVEFNT0dSQUQnOiBbJ21ldGFtb3JmR3JhZCcsICdJbnRlZ2VyJ10sXG4gICAgJ01FVEVSLUZSQSc6IFsndmVnbGVua2VNZXRlckZyYScsICdJbnRlZ2VyJ10sXG4gICAgJ01FVEVSLVRJTCc6IFsndmVnbGVua2VNZXRlclRpbCcsICdJbnRlZ2VyJ10sXG4gICAgJ01HRU5IRVRCRVNLUklWJzogWydtZ0VuaGV0QmVza3JpdmVsc2UnLCAnU3RyaW5nJ10sXG4gICAgJ01HRU5IRVRPUFBMT1NOJzogWydtZ0VuaGV0T3BwbG9zbmluZycsICdJbnRlZ2VyJ10sXG4gICAgJ01HSU5TVFJVTUVOVCc6IFsnbWdJbnN0cnVtZW50JywgJ1N0cmluZyddLFxuICAgICdNR0xJTkpFTlInOiBbJ21nTGluamVudW1tZXInLCAnU3RyaW5nJ10sXG4gICAgJ01HUE9TTlInOiBbJ21nUG9zaXNqb25udW1tZXInLCAnSW50ZWdlciddLFxuICAgICdNR1RPS1ROUic6IFsnbWdUb2t0bnVtbWVyJywgJ1N0cmluZyddLFxuICAgICdNSUxJVMOGUsOYVkVMU0VUWVBFJzogWydtaWxpdMOmcsO4dmVsc2V0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnTUlMSk9USUwnOiBbJ21pbGrDuHRpbHRhaycsICdJbnRlZ2VyJ10sXG4gICAgJ01JTkjDmFlERSc6IFsnbWluaMO4eWRlJywgJ1JlYWwnXSxcbiAgICAnTUlOLU4nOiBbJ21pbmltdW1Ob3JkJywgJ0ludGVnZXInXSxcbiAgICAnTUlOLcOYJzogWydtaW5pbXVtw5hzdCcsICdJbnRlZ2VyJ10sXG4gICAgJ01ZTkRJR0hFVCc6IFsndmVkdGFrc215bmRpZ2hldCcsICdTdHJpbmcnXSxcbiAgICAnTVlSJzogWydteXJrbGFzc2lmaWthc2pvbicsICdJbnRlZ2VyJ10sXG4gICAgJ03DhUxFTUVUT0RFJzogWydtw6VsZW1ldG9kZScsICdJbnRlZ2VyJ10sXG4gICAgJ03DhUxFU1RPS0snOiBbJ23DpWxlc3Rva2snLCAnSW50ZWdlciddLFxuICAgICdNw4VMVEFMTCc6IFsnbcOlbHRhbGwnLCAnUmVhbCddLFxuICAgICdOQVNKT05BTFRPUFBNRVJLRVRZUEUnOiBbJ25hc2pvbmFsVG9wcG1lcmtldHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ05BU0pWSUtUSUcnOiBbJ3Jhc3RvZmZWaWt0aWdoZXRPbWZhbmcnLCAnU3RyaW5nJ10sXG4gICAgJ05BVklHQVNKT05TSU5TVEFMTEFTSk9OU0VJRVInOiBbJ25hdmlnYXNqb25zaW5zdGFsbGFzam9uc2VpZXInLCAnU3RyaW5nJ10sXG4gICAgJ05BVkxZU19LQVJBS1RFUic6IFsnbmF2aWdhc2pvbnNseXNrYXJha3RlcicsICdJbnRlZ2VyJ10sXG4gICAgJ05BVkxZU1RZUEUnOiBbJ25hdmx5c1R5cGUnLCAnSW50ZWdlciddLFxuICAgICdOQVZOJzogWyduYXZuJywgJ1N0cmluZyddLFxuICAgICdOQVZOVFlQRSc6IFsnbmF2bmV0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnTkVEU0VOS0VUS0FOVFNURUlOJzogWyduZWRzZW5rZXRLYW50c3RlaW4nLCAnU3RyaW5nJ10sXG4gICAgJ05FRFNURU5HVF9EQVRPJzogWyduZWRzdGVuZ3REYXRvJywgJ0RhdGUnXSxcbiAgICAnTkVUVF9OSVYnOiBbJ2xlZG5pbmdzbmV0dE5pdsOlJywgJ1N0cmluZyddLFxuICAgICdORVZORVInOiBbJ25ldm5lcicsICdSZWFsJ10sXG4gICAgJ05PTUlORUxMUkVLS0VWSURERSc6IFsnbm9taW5lbGxSZWtrZXZpZGRlJywgJ1JlYWwnXSxcbiAgICAnTk9SRCc6IFsnbm9yZCcsICdJbnRlZ2VyJ10sXG4gICAgJ05ZTUFUUklLVUxFUlQnOiBbJ255bWF0cmlrdWxlcnQnLCAnU3RyaW5nJ10sXG4gICAgJ07DhlJJTkdTR1JVUFBFJzogWyduw6ZyaW5nc2dydXBwZScsICdTdHJpbmcnXSxcbiAgICAnTsOYWUFLVElHSEVUJzogWyduw7h5YWt0aWdoZXQnLCAnSW50ZWdlciddLFxuICAgICdOw5hZQUtUSUdIRVRTS0xBU1NFJzogWyduw7h5YWt0aWdoZXRza2xhc3NlJywgJ0ludGVnZXInXSxcbiAgICAnTsOFVsOGUkVOREVfQVJFQUwnOiBbJ27DpXbDpnJlbmRlQXJlYWwnLCAnUmVhbCddLFxuICAgICdPQkpUWVBFJzogWydvYmpla3R0eXBlbmF2bicsICdTdHJpbmcnXSxcbiAgICAnT0JTRVJWRVJURkxPTSc6IFsnb2JzZXJ2ZXJ0RmxvbScsICdSZWFsJ10sXG4gICAgJ09CU0xJTklEJzogWydvYnNMaW5JZCcsICdTdHJpbmcnXSxcbiAgICAnT01LUkVUU0lOTlNKw5gnOiBbJ29ta3JldHNJbm5zasO4JywgJ0ludGVnZXInXSxcbiAgICAnT01SS09ERSc6IFsncmVpbmJlaXRlb21yw6VkZUlEJywgJ1N0cmluZyddLFxuICAgICdPTVJOQVZOJzogWydvbXLDpWRlbmF2bicsICdTdHJpbmcnXSxcbiAgICAnT01SVFlQRSc6IFsnZHVtcGVmZWx0dHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ09NUsOFREVJRCc6IFsnb21yw6VkZWlkJywgJ0ludGVnZXInXSxcbiAgICAnT01UVklTVEVUJzogWydvbXR2aXN0ZXQnLCAnU3RyaW5nJ10sXG4gICAgJ09QQVJFQUxBVkdSVFlQRSc6IFsnb3BlcmF0aXZBcmVhbGF2Z3JlbnNuaW5ndHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ09QRVJBVMOYUic6IFsncGV0cm9sZXVtc29wZXJhdMO4cicsICdTdHJpbmcnXSxcbiAgICAnT1BMQVJFQUwnOiBbJ2FyZWFsYnJ1aycsICdJbnRlZ2VyJ10sXG4gICAgJ09QTEFSRUFMVVREWVAnOiBbJ2FyZWFsYnJ1a3N1dGR5cGluZycsICdTdHJpbmcnXSxcbiAgICAnT1BMUkVTVFInOiBbJ2FyZWFsYnJ1a3NyZXN0cmlrc2pvbmVyJywgJ0ludGVnZXInXSxcbiAgICAnT1BMUkVUTkwnOiBbJ2FyZWFsYnJ1a3NyZXRuaW5nc2xpbmplcicsICdJbnRlZ2VyJ10sXG4gICAgJ09QUEFSQkVJRElORyc6IFsnb3BwYXJiZWlkaW5nJywgJ0ludGVnZXInXSxcbiAgICAnT1BQREFURVJJTkdTREFUTyc6IFsnb3BwZGF0ZXJpbmdzZGF0bycsICdEYXRlJ10sXG4gICAgJ09QUERSQUdTR0lWRVInOiBbJ29wcGRyYWdzZ2l2ZXInLCAnU3RyaW5nJ10sXG4gICAgJ09QUEdJVFRBUkVBTCc6IFsnb3BwZ2l0dEFyZWFsJywgJ1JlYWwnXSxcbiAgICAnT1BQSEFWJzogWydvcHBoYXYnLCAnU3RyaW5nJ10sXG4gICAgJ09QUE3DhUxJTkdJS0tFRlVMTEbDmFJUJzogWydvcHBtw6VsaW5nSWtrZUZ1bGxmw7hydCcsICdTdHJpbmcnXSxcbiAgICAnT1BQTcOFTFRLT1RFJzogWydvcHBtw6VsdEtvdGUnLCAnUmVhbCddLFxuICAgICdPUFBNw4VMVMOFUic6IFsnb3BwbcOlbHTDhXInLCAnSW50ZWdlciddLFxuICAgICdPUFBSRVRURVRfQUFSJzogWydvcHByZXR0ZXTDhXInLCAnRGF0ZSddLFxuICAgICdPUFBSSU5ORUxJR0JJTERFRk9STUFUJzogWydiaWxkZVR5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ09QUFJJTk5FTElHQklMREVTWVMnOiBbJ0JpbGRlU3lzdGVtJywgJ0ludGVnZXInXSxcbiAgICAnT1BQUklOTkVMSUdTT1NJQUxUTUlMSsOYJzogWydvcHByaW5uZWxpZ1Nvc2lhbHRNaWxqw7gnLCAnSW50ZWdlciddLFxuICAgICdPUFBSSU5ORUxTRSc6IFsnb3BwcmlubmVsc2UnLCAnU3RyaW5nJ10sXG4gICAgJ09QUFNUQVJUU8OFUic6IFsnb3Bwc3RhcnRzw6VyJywgJ0RhdGUnXSxcbiAgICAnT1BQVEFLU01FVE9ERSc6IFsnb3BwdGFrc21ldG9kZScsICdJbnRlZ2VyJ10sXG4gICAgJ09QUFZBUk1JTkcnOiBbJ29wcHZhcm1pbmcnLCAnU3RyaW5nJ10sXG4gICAgJ09SR0FOSVNLJzogWydvcmdhbmlza0FuZGVsJywgJ0ludGVnZXInXSxcbiAgICAnT1JHTlInOiBbJ29yZ2Fuc2lzYXNqb25zbnVtbWVyJywgJ0ludGVnZXInXSxcbiAgICAnT1JJRU5URVJJTkdTREFUQSc6IFsnb3JpZW50ZXJpbmdzZGF0YScsICdTdHJpbmcnXSxcbiAgICAnT1JJRU5URVJJTkdTTUVUT0RFJzogWydvcmllbnRlcmluZ3NtZXRvZGUnLCAnSW50ZWdlciddLFxuICAgICdPUklHSU5BTERBVEFWRVJUJzogWydvcmlnaW5hbERhdGF2ZXJ0JywgJ1N0cmluZyddLFxuICAgICdPUklHTy1OJzogWydvcmlnb05vcmQnLCAnSW50ZWdlciddLFxuICAgICdPUklHTy3DmCc6IFsnb3JpZ2/DmHN0JywgJ0ludGVnZXInXSxcbiAgICAnT1ZFUkdSVVBQRSc6IFsnb3ZlcmdydXBwZU5hdm4nLCAnU3RyaW5nJ10sXG4gICAgJ1BCVElMVEFLJzogWyd0aWx0YWtzdHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ1BFVExJVE9LT0RFJzogWydwZXRyb2ZMaXRvbG9naScsICdTdHJpbmcnXSxcbiAgICAnUEVUTUVUQUtPREUnOiBbJ3BldHJvZk1ldGFtb3Jmb3NlJywgJ1N0cmluZyddLFxuICAgICdQRVRST0xFVU1fS09PUkRfU1RBVFVTJzogWydwZXRyb2xldW1Lb29yZGluYXRzdGF0dXMnLCAnU3RyaW5nJ10sXG4gICAgJ1BFVFJPTEVVTUxFRE5JTkdGVU5LU0pPTic6IFsncGV0cm9sZXVtc2xlZG5pbmdzZnVua3Nqb24nLCAnU3RyaW5nJ10sXG4gICAgJ1BFVFJPTEVVTUxFRE5JTkdUWVBFJzogWydwZXRyb2xldW1zbGVkbmluZ3N0eXBlJywgJ1N0cmluZyddLFxuICAgICdQRVRST0xFVU1TQU5ERUwnOiBbJ3BldHJvbGV1bXNhbmRlbCcsICdSZWFsJ10sXG4gICAgJ1BFVFJPTEVVTVNEQVRBS0lMREUnOiBbJ3BldHJvbGV1bXNkYXRha2lsZGUnLCAnU3RyaW5nJ10sXG4gICAgJ1BFVFJPTEVVTVNGRUxUTkFWTic6IFsncGV0cm9sZXVtc2ZlbHRuYXZuJywgJ1N0cmluZyddLFxuICAgICdQRVRST0xFVU1TRkVMVFRZUEUnOiBbJ3BldHJvbGV1bXNmZWx0dHlwZScsICdTdHJpbmcnXSxcbiAgICAnUEVUUk9MRVVNU1BBUlRORVJFJzogWydwZXRyb2xldW1zcGFydG5lcmUnLCAnU3RyaW5nJ10sXG4gICAgJ1BFVFNUUkFUS09ERSc6IFsncGV0cm9mU3RyYXRpZ3JhZmknLCAnU3RyaW5nJ10sXG4gICAgJ1BJTEFSS0FURUdPUkknOiBbJ3BpbGFya2F0ZWdvcmknLCAnSW50ZWdlciddLFxuICAgICdQSVhFTC1TVMOYUlInOiBbJ3BpeGVsc3TDuHJyZWxzZScsICdSZWFsJ10sXG4gICAgJ1BMQU5CRVNUJzogWydwbGFuYmVzdGVtbWVsc2UnLCAnSW50ZWdlciddLFxuICAgICdQTEFORVJJTkcnOiBbJ3BsYW5lcmluZ3NncmFkJywgJ0ludGVnZXInXSxcbiAgICAnUExBTklEJzogWydwbGFuaWRlbnRpZmlrYXNqb24nLCAnU3RyaW5nJ10sXG4gICAgJ1BMQU5OQVZOJzogWydwbGFubmF2bicsICdTdHJpbmcnXSxcbiAgICAnRk9SU0xBR1NTVElMTEVSVFlQRSc6IFsnZm9yc2xhZ3NzdGlsbGVyVHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ1BMQU5TVEFUJzogWydwbGFuc3RhdHVzJywgJ0ludGVnZXInXSxcbiAgICAnUExBTlRZUEUnOiBbJ3BsYW50eXBlJywgJ0ludGVnZXInXSxcbiAgICAnUExBU1MnOiBbJ3BsYXNzZXJpbmdza29kZScsICdJbnRlZ2VyJ10sXG4gICAgJ1BMRk1FUksnOiBbJ29wcHN0aWxsaW5ncGxhdHRmb3JtbWVya2luZycsICdJbnRlZ2VyJ10sXG4gICAgJ1BMT0dTSklLVFRFS1NUVVInOiBbJ3Bsb2dzamlrdFRla3N0dXInLCAnSW50ZWdlciddLFxuICAgICdQT0JTJzogWydvYnNlcnZhc2pvbnN0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnUE9MSVRJRElTVFJJS1RJRCc6IFsncG9saXRpZGlzdHJpa3RJZCcsICdJbnRlZ2VyJ10sXG4gICAgJ1BPU19LVkFMJzogWydwb3Npc2pvbkt2YWxpdGV0JywgJ0ludGVnZXInXSxcbiAgICAnUE9TX1RZUEUnOiBbJ3Bvc2lzam9uVHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0JJVFNfUFJfUElYRUwnOiBbJ2JpdHNQclBpeGVsJywgJ0ludGVnZXInXSxcbiAgICAnUE9TVE5BVk4nOiBbJ3Bvc3RzdGVkc25hdm4nLCAnU3RyaW5nJ10sXG4gICAgJ1BPU1ROUic6IFsncG9zdG51bW1lcicsICdJbnRlZ2VyJ10sXG4gICAgJ1BSRVBBUkVSSU5HJzogWydsw7h5cGVwcmVwYXJlcmluZycsICdTdHJpbmcnXSxcbiAgICAnUFJJTcOGUlNUUkVLTklOR1NOVU1NRVInOiBbJ3ByaW3DpnJzdHJla25pbmdzbnVtbWVyJywgJ0ludGVnZXInXSxcbiAgICAnUFJJT01SJzogWydwcmlvcml0ZXRvbXLDpWRlJywgJ1N0cmluZyddLFxuICAgICdQUklPUklURVQnOiBbJ2t1bHR1cmxhbmRza2FwUHJpb3JpdGV0JywgJ1N0cmluZyddLFxuICAgICdQUklWQVRfS0xPQUtLUic6IFsncHJpdmF0S2xvYWtrUmVuc2luZycsICdJbnRlZ2VyJ10sXG4gICAgJ1BST0RVS1QnOiBbJ3Byb2R1a3QnLCAnU3RyaW5nJ10sXG4gICAgJ1BST0RVS1RfRlVMTFRfTkFWTic6IFsncHJvZHVrdEZ1bGxzdGVuZGlnTmF2bicsICdTdHJpbmcnXSxcbiAgICAnUFJPRFVLVEdSVVBQRSc6IFsncHJvZHVrdGdydXBwZScsICdTdHJpbmcnXSxcbiAgICAnUFJPRFVTRU5UJzogWydnZW9kYXRhcHJvZHVzZW50JywgJ1N0cmluZyddLFxuICAgICdQUk9KRUsnOiBbJ3Byb2pla3Nqb24nLCAnU3RyaW5nJ10sXG4gICAgJ1BST1NFTFYnOiBbJ3Byb3NlbnRFbHYnLCAnUmVhbCddLFxuICAgICdQUk9TRVNTX0hJU1RPUklFJzogWydwcm9zZXNzaGlzdG9yaWUnLCAnU3RyaW5nJ10sXG4gICAgJ1BST1NIQVYnOiBbJ3Byb3NlbnRIYXYnLCAnUmVhbCddLFxuICAgICdQUk9TSU5OU0rDmCc6IFsncHJvc2VudElubnNqw7gnLCAnUmVhbCddLFxuICAgICdQUk9TSkVLVE5BVk4nOiBbJ3Byb3NqZWt0bmF2bicsICdTdHJpbmcnXSxcbiAgICAnUFJPU0pFS1RTVEFSVCc6IFsncHJvc2pla3RzdGFydMOlcicsICdJbnRlZ2VyJ10sXG4gICAgJ1BST1NMQU5EJzogWydwcm9zZW50TGFuZCcsICdSZWFsJ10sXG4gICAgJ1BST1NUSU5VTU1FUic6IFsncHJvc3RpbnVtbWVyJywgJ0ludGVnZXInXSxcbiAgICAnUFJPVkVNQVRSJzogWydwcm92ZU1hdGVyaWFsJywgJ1N0cmluZyddLFxuICAgICdQVFlQRSc6IFsncHVua3RUeXBlJywgJ1N0cmluZyddLFxuICAgICdQVUtLVkVSS1RZUEUnOiBbJ3B1a2t2ZXJrdHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ1BVTVBFUl9Ow5hEU1RSJzogWydwdW1wZXJOw7hkc3Ryw7htJywgJ1N0cmluZyddLFxuICAgICdQVU1QRVNfVkFOTkVUJzogWydwdW1wZXJWYW5uZXQnLCAnU3RyaW5nJ10sXG4gICAgJ1BVTktUQkVTS1InOiBbJ3B1bmt0QmVza3JpdmVsc2UnLCAnU3RyaW5nJ10sXG4gICAgJ1BVTktURkVTVEUnOiBbJ3B1bmt0ZmVzdGUnLCAnU3RyaW5nJ10sXG4gICAgJ1DDhVZJUktOSU5HU0dSQUQnOiBbJ3DDpXZpcmtuaW5nc2dyYWQnLCAnSW50ZWdlciddLFxuICAgICdSX0ZOUic6IFsnZm9yZWtvbXN0TnVtbWVyJywgJ0ludGVnZXInXSxcbiAgICAnUl9MTlInOiBbJ2xva2FsTnVtbWVyJywgJ0ludGVnZXInXSxcbiAgICAnUl9PTlInOiBbJ29tck51bW1lcicsICdJbnRlZ2VyJ10sXG4gICAgJ1JfUE5SJzogWydwcm92ZU51bW1lcicsICdJbnRlZ2VyJ10sXG4gICAgJ1JfUkVTRVJWRVInOiBbJ3Jhc3RvZmZSZXNlcnZlcicsICdJbnRlZ2VyJ10sXG4gICAgJ1JBQ09ORlJFS1ZFTlNCw4VORCc6IFsncmFjb25GcmVrdmVuc2LDpW5kJywgJ1N0cmluZyddLFxuICAgICdSQUNPTktBUkFLVEVSJzogWydyYWNvbmthcmFrdGVyJywgJ1N0cmluZyddLFxuICAgICdSQUNPTk1PUlNFVEVHTic6IFsncmFjb25tb3JzZXRlZ24nLCAnU3RyaW5nJ10sXG4gICAgJ1JBQ09OUkVTUE9OU0lOVEVSVkFMTCc6IFsncmFjb25yZXNwb25zaW50ZXJ2YWxsJywgJ1N0cmluZyddLFxuICAgICdSQUNPTlRZUEUnOiBbJ3JhY29udHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ1JBREFSX0ZZUl9UWVBFJzogWydyYWRhcmZ5cnR5cGUnLCAnSW50ZWdlciddLFxuICAgICdSQURBUlJFRkxFS1RPUic6IFsncmFkYXJSZWZsZWt0b3InLCAnU3RyaW5nJ10sXG4gICAgJ1JBREFSU1RBU0pPTlNUWVBFJzogWydyYWRhcnN0YXNqb25zdHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ1JBRElPX0ZZUl9UWVBFJzogWydyYWRpb2Z5cnR5cGUnLCAnSW50ZWdlciddLFxuICAgICdSQURJT0FLVElWJzogWydyYWRpb2FrdGl2aXRldE5pdmEnLCAnSW50ZWdlciddLFxuICAgICdSQURJT0ZZUk1PRFVMQVNKT04nOiBbJ3JhZGlvZnlybW9kdWxhc2pvbicsICdTdHJpbmcnXSxcbiAgICAnUkFESVVTJzogWydyYWRpdXMnLCAnUmVhbCddLFxuICAgICdSQURSSVNLT01SJzogWyduYXR1cmxSYWRpb2FrdGl2U3RyYWxpbmcnLCAnSW50ZWdlciddLFxuICAgICdSQVBQT1JURVJJTkdTw4VSJzogWydyYXBwb3J0ZXJpbmdzw6VyJywgJ0RhdGUnXSxcbiAgICAnUkVGRVJBTlNFJzogWydyZWZlcmFuc2UnLCAnU3RyaW5nJ10sXG4gICAgJ1JFRkVSQU5TRU5VTU1FUic6IFsncmVmZXJhbnNlbnVtbWVyJywgJ1N0cmluZyddLFxuICAgICdSRUdGT1JNJzogWydyZWd1bGVyaW5nc2Zvcm3DpWwnLCAnSW50ZWdlciddLFxuICAgICdSRUdGT1JNVVREWVAnOiBbJ3JlZ3VsZXJpbmdzZm9ybcOlbHN1dGR5cGluZycsICdTdHJpbmcnXSxcbiAgICAnUkVHSVNUUkVSSU5HS1JFVFNOUic6IFsncmVnaXN0cmVyaW5nS3JldHNucicsICdJbnRlZ2VyJ10sXG4gICAgJ1JFR0lTVFJFUlRfREFUTyc6IFsncmVnaXN0cmVydERhdG8nLCAnRGF0ZSddLFxuICAgICdSRUdNRVRPRCc6IFsncmVnaXN0cmVyaW5nc21ldG9kZScsICdJbnRlZ2VyJ10sXG4gICAgJ1JFR1VMRVJUSMOYWURFJzogWydyZWd1bGVydEjDuHlkZScsICdSZWFsJ10sXG4gICAgJ1JFSU5EUklGVEFOTFRZUCc6IFsncmVpbmRyaWZ0c2FubGVnZ3N0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnUkVJTkRSSUZUS09OTkFWTic6IFsncmVpbmRyaWZ0S29udmVuc2pvbnNvbXLDpWRlbmF2bicsICdTdHJpbmcnXSxcbiAgICAnUkVLS0VWSURERUdSw5hOTic6IFsncmVra2V2aWRkZUdyw7hubicsICdSZWFsJ10sXG4gICAgJ1JFS0tFVklEREVHVUwnOiBbJ3Jla2tldmlkZGVHdWwnLCAnUmVhbCddLFxuICAgICdSRUtLRVZJRERFSFZJVCc6IFsncmVra2V2aWRkZUh2aXQnLCAnUmVhbCddLFxuICAgICdSRUtLRVZJRERFUsOYRCc6IFsncmVra2V2aWRkZVLDuGQnLCAnUmVhbCddLFxuICAgICdSRU5IRVQnOiBbJ3JldG5pbmdzZW5oZXQnLCAnSW50ZWdlciddLFxuICAgICdSRU5PVkFTSk9OJzogWydyZW5vdmFzam9uJywgJ0ludGVnZXInXSxcbiAgICAnUkVTSVBJRU5UVFlQRSc6IFsncmVzaXBpZW50dHlwZScsICdTdHJpbmcnXSxcbiAgICAnUkVTVFJfT01SJzogWydyZXN0cmlrc2pvbnNvbXLDpWRlJywgJ1N0cmluZyddLFxuICAgICdSRVNUUklLU0pPTlNUWVBFJzogWydyZXN0cmlrc2pvbnN0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnUkVUX1NZUyc6IFsncmV0bmluZ3NyZWZlcmFuc2UnLCAnSW50ZWdlciddLFxuICAgICdSRVROJzogWydyZXRuaW5nc3ZlcmRpJywgJ1JlYWwnXSxcbiAgICAnUkVUTklOR1NFS1RPUkxJTkpFMSc6IFsncmV0bmluZ1Nla3RvcmxpbmplMScsICdSZWFsJ10sXG4gICAgJ1JFVE5JTkdTRUtUT1JMSU5KRTInOiBbJ3JldG5pbmdTZWt0b3JsaW5qZTInLCAnUmVhbCddLFxuICAgICdSSVNJS09WVVJERVJJTkcnOiBbJ3Jpc2lrb3Z1cmRlcmluZycsICdTdHJpbmcnXSxcbiAgICAnUktCJzogWydya2InLCAnUmVhbCddLFxuICAgICdSS0JfVEQnOiBbJ3JrYlRvdGFsdER5cCcsICdSZWFsJ10sXG4gICAgJ1JPVEFTSk9OJzogWydyb3Rhc2pvbicsICdJbnRlZ2VyJ10sXG4gICAgJ1JQQU5HSVRUSEVOU1lOJzogWydhbmdpdHRoZW5zeW4nLCAnSW50ZWdlciddLFxuICAgICdSUEFSRUFMRk9STcOFTCc6IFsnYXJlYWxmb3Jtw6VsJywgJ0ludGVnZXInXSxcbiAgICAnUlBCw4VORExFR0dJTkcnOiBbJ2LDpW5kbGVnZ2luZycsICdJbnRlZ2VyJ10sXG4gICAgJ1JQREVUQUxKRVJJTkcnOiBbJ2RldGFsamVyaW5nJywgJ0ludGVnZXInXSxcbiAgICAnUlBGQVJFJzogWydmYXJlJywgJ0ludGVnZXInXSxcbiAgICAnUlBHSkVOTk9NRsOYUklORyc6IFsnZ2plbm5vbWbDuHJpbmcnLCAnSW50ZWdlciddLFxuICAgICdSUElORlJBU1RSVUtUVVInOiBbJ2luZnJhc3RydWt0dXInLCAnSW50ZWdlciddLFxuICAgICdSUEpVUkxJTkpFJzogWydqdXJpZGlza2xpbmplJywgJ0ludGVnZXInXSxcbiAgICAnUlBKVVJQVU5LVCc6IFsnanVyaWRpc2twdW5rdCcsICdJbnRlZ2VyJ10sXG4gICAgJ1JQUMOFU0tSSUZUVFlQRSc6IFsncMOlc2tyaWZ0VHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ1JQU0lLUklORyc6IFsnc2lrcmluZycsICdJbnRlZ2VyJ10sXG4gICAgJ1JQU1TDmFknOiBbJ3N0w7h5JywgJ0ludGVnZXInXSxcbiAgICAnUlNMX0pSRUcnOiBbJ3JlZmVyYW5zZXN5c3RlbUZvckxhbmRza2FwSm9yZGJydWtzcmVnaW9uZXInLCAnU3RyaW5nJ10sXG4gICAgJ1JTTF9SRUcnOiBbJ3JlZmVyYW5zZXN5c3RlbUZvckxhbmRza2FwUmVnaW9uZXInLCAnU3RyaW5nJ10sXG4gICAgJ1JTTF9VUkVHJzogWydyZWZlcmFuc2VzeXN0ZW1Gb3JMYW5kc2thcFVSZWcnLCAnU3RyaW5nJ10sXG4gICAgJ1JUQUxMSMOYWSc6IFsncmVpbnRhbGxIw7h5ZXN0ZScsICdJbnRlZ2VyJ10sXG4gICAgJ1JUQUxMVkVEVEFLJzogWydyZWludGFsbFZlZHRhaycsICdTdHJpbmcnXSxcbiAgICAnUlVMTEVCQU5FRElTVEFOU0VUWVBFJzogWydydWxsZWJhbmVkaXN0YW5zZXR5cGUnLCAnSW50ZWdlciddLFxuICAgICdSVUxMRUJBTkVSRVROSU5HJzogWydydWxsZWJhbmVyZXRuaW5nJywgJ0ludGVnZXInXSxcbiAgICAnUlVURUJSRURERSc6IFsncnV0ZWJyZWRkZScsICdJbnRlZ2VyJ10sXG4gICAgJ1JVVEVGw5hMR0VSJzogWydydXRlRsO4bGdlcicsICdTdHJpbmcnXSxcbiAgICAnUlVURU1FUktJTkcnOiBbJ3J1dGVNZXJraW5nJywgJ1N0cmluZyddLFxuICAgICdSVVRFTkVUVFlQRSc6IFsncnV0ZW5ldHR5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ1JVVEVOUic6IFsncnV0ZW51bW1lcicsICdTdHJpbmcnXSxcbiAgICAnU0VGUkFLX1RJTFRBSyc6IFsnc2VmcmFrVGlsdGFrJywgJ0ludGVnZXInXSxcbiAgICAnU0VGUkFLQlJFRERFJzogWydzZWZyYWticmVkZGUnLCAnSW50ZWdlciddLFxuICAgICdTRUZSQUtLT01NVU5FJzogWydzZWZyYWtLb21tdW5lJywgJ0ludGVnZXInXSxcbiAgICAnU0VGUkFLTEVOR0RFJzogWydzZWZyYWtsZW5nZGUnLCAnSW50ZWdlciddLFxuICAgICdTRUlMX0JSRURERSc6IFsnc2VpbGluZ3NicmVkZGUnLCAnUmVhbCddLFxuICAgICdTRUlMX0RZQkRFJzogWydzZWlsaW5nc2R5YmRlJywgJ1JlYWwnXSxcbiAgICAnU0VLU0pPTkVSVCc6IFsnc2Vrc2pvbmVydCcsICdTdHJpbmcnXSxcbiAgICAnU0VLVE9SVEVLU1QnOiBbJ3Nla3RvcnRla3N0JywgJ1N0cmluZyddLFxuICAgICdTRUtVTkTDhlJTVFJFS05JTkdTTlVNTUVSJzogWydzZWt1bmTDpnJzdHJla25pbmdzbnVtbWVyJywgJ0ludGVnZXInXSxcbiAgICAnU0VOVFJVTVNTT05FTkFWTic6IFsnc2VudHJ1bXNzb25lbmF2bicsICdTdHJpbmcnXSxcbiAgICAnU0VOVFJVTVNTT05FTlVNTUVSJzogWydzZW50cnVtc3NvbmVudW1tZXInLCAnSW50ZWdlciddLFxuICAgICdTRVBUSUtUQU5LJzogWydzZXB0aWt0YW5rJywgJ1N0cmluZyddLFxuICAgICdTRVJJRUtPREUxJzogWydzZXJpZTEnLCAnU3RyaW5nJ10sXG4gICAgJ1NFUklFS09ERTInOiBbJ3NlcmllMicsICdTdHJpbmcnXSxcbiAgICAnU0VSSUVLT0RFMyc6IFsnc2VyaWUzJywgJ1N0cmluZyddLFxuICAgICdTRVJWTUVSSyc6IFsnc2Vydml0dXR0TWVya25hZCcsICdTdHJpbmcnXSxcbiAgICAnU0VSVlRZUEUnOiBbJ3NlcnZpdHV0dFR5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ1NFU09NUic6IFsncmVpbmRyaWZ0U2Vzb25nb21yw6VkZScsICdJbnRlZ2VyJ10sXG4gICAgJ1NGT1RSVVRFVFlQRSc6IFsnc3Blc2lhbEZvdHJ1dGV0eXBlJywgJ1N0cmluZyddLFxuICAgICdTSURFT1ZFUkxBUFAnOiBbJ3NpZGVvdmVybGFwcCcsICdJbnRlZ2VyJ10sXG4gICAgJ1NJR05BTEdSVVBQRSc6IFsnc2lnbmFsZ3J1cHBlJywgJ1N0cmluZyddLFxuICAgICdTSUdOQUxOUic6IFsnc2lnbmFsbnVtbWVyJywgJ1N0cmluZyddLFxuICAgICdTSUdOQUxQRVJJT0RFJzogWydzaWduYWxwZXJpb2RlJywgJ1N0cmluZyddLFxuICAgICdTSUdOQUxTRUtWRU5TJzogWydzaWduYWxzZWt2ZW5zJywgJ1N0cmluZyddLFxuICAgICdTSUdOSCc6IFsnc2lnbmFsSMO4eWRlJywgJ1JlYWwnXSxcbiAgICAnU0lHTkhSRUYnOiBbJ3NpZ25hbEjDuHlkZVJlZicsICdTdHJpbmcnXSxcbiAgICAnU0lHTlRZUEUnOiBbJ3NpZ25hbFR5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ1NJS0tFUsOFUic6IFsnbGVkbmluZ3NhbGRlclJlZmVyYW5zZScsICdJbnRlZ2VyJ10sXG4gICAgJ1NJS1RFRFlQJzogWydzaWt0ZUR5cCcsICdJbnRlZ2VyJ10sXG4gICAgJ1NJU1RfVlVSREVSVF9BQVInOiBbJ3Npc3RWdXJkZXJ0w4VyJywgJ0RhdGUnXSxcbiAgICAnU0lTVEJFRkFSVCc6IFsnc2lzdGVCZWZhcmluZ3NkYXRvJywgJ0ludGVnZXInXSxcbiAgICAnU0rDmF9SRVNUUklLU0pPTic6IFsnc2rDuHJlc3RyaWtzam9uJywgJ0ludGVnZXInXSxcbiAgICAnU0rDmF9TSUdGUlEnOiBbJ3Nqw7hzaWduYWxmcmVrdmVucycsICdJbnRlZ2VyJ10sXG4gICAgJ1NKw5hfU1RBVFVTJzogWydzasO4c3RhdHVzJywgJ0ludGVnZXInXSxcbiAgICAnU0rDmF9UUkFGSUtLJzogWydzasO4dHJhZmlraycsICdJbnRlZ2VyJ10sXG4gICAgJ1NKw5hNRVJLRUZBUkdFJzogWydzasO4bWVya2VmYXJnZScsICdJbnRlZ2VyJ10sXG4gICAgJ1NKw5hNRVJLRVNZU1RFTSc6IFsnc2rDuG1lcmtlc3lzdGVtJywgJ0ludGVnZXInXSxcbiAgICAnU0tBTF9BVkdSX0JZR04nOiBbJ3NrYWxBdmdyZW5zZUJ5Z25pbmcnLCAnU3RyaW5nJ10sXG4gICAgJ1NLQUxBRU5IRVQnOiBbJ3NrYWxhZW5oZXQnLCAnU3RyaW5nJ10sXG4gICAgJ1NLSUxUR1JVUFBFJzogWydza2lsdGdydXBwZScsICdTdHJpbmcnXSxcbiAgICAnU0tJTMOYWVBFVFlQRSc6IFsnc2tpbMO4eXBldHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ1NLSkVSTUlOR0ZVTksnOiBbJ3NramVybWluZ3NmdW5rc2pvbicsICdTdHJpbmcnXSxcbiAgICAnU0tPRyc6IFsnam9yZHJlZ2lzdGVyU2tvZ3R5cGUnLCAnSW50ZWdlciddLFxuICAgICdTS09HUkVJUyc6IFsnam9yZHJlZ2lzdGVyU2tvZ3JlaXNuaW5nc21hcmsnLCAnSW50ZWdlciddLFxuICAgICdTS09MRUtSRVRTVFlQRSc6IFsnc2tvbGVrcmV0c25hdm4nLCAnU3RyaW5nJ10sXG4gICAgJ1NLUkVEQUxERVJCRVNUJzogWydza3JlZEFsZGVyQmVzdGVtbWVsc2UnLCAnU3RyaW5nJ10sXG4gICAgJ1NLUkVEQkVTS1JJVkVMU0UnOiBbJ3NrcmVkQmVza3JpdmVsc2UnLCAnU3RyaW5nJ10sXG4gICAgJ1NLUkVEQlJFRERFJzogWydza3JlZEJyZWRkZScsICdJbnRlZ2VyJ10sXG4gICAgJ1NLUkVERVZBS1VFUklORyc6IFsnc2tyZWRFdmFrdWVyaW5nJywgJ0ludGVnZXInXSxcbiAgICAnU0tSRURGQUxMSMOYWURFJzogWydza3JlZEZhbGxob3lkZScsICdJbnRlZ2VyJ10sXG4gICAgJ1NLUkVERkFSRUdSX0tMJzogWydza3JlZEZhcmVncmFkS2xhc3NlJywgJ1N0cmluZyddLFxuICAgICdTS1JFREZBUkVHUkFEU0NPUkUnOiBbJ3NrcmVkRmFyZWdyYWRTY29yZScsICdJbnRlZ2VyJ10sXG4gICAgJ1NLUkVERkFSRVZVUkQnOiBbJ3Nub1N0ZWluU2tyZWRmYXJlVnVyZGVyaW5nJywgJ0ludGVnZXInXSxcbiAgICAnU0tSRURLT05TU0NPUkUnOiBbJ3NrcmVkU2thZEtvbnNla3ZlbnNTY29yZScsICdJbnRlZ2VyJ10sXG4gICAgJ1NLUkVES1ZBTEtBUlRMRUdHSU5HJzogWydza3JlZEt2YWxLYXJ0bGVnZ2luZycsICdJbnRlZ2VyJ10sXG4gICAgJ1NLUkVETEVOR0RFJzogWydza3JlZExlbmdkZScsICdJbnRlZ2VyJ10sXG4gICAgJ1NLUkVETUFMRU1FVE9ERSc6IFsnc2tyZWRNYWxlbWV0b2RlJywgJ0ludGVnZXInXSxcbiAgICAnU0tSRURPQlNHVUlEJzogWydza3JlZE9ic2VydmFzam9uR1VJRCcsICdJbnRlZ2VyJ10sXG4gICAgJ1NLUkVET01LT01ORSc6IFsnc2tyZWRBbnRhbGxPbWtvbW5lJywgJ0ludGVnZXInXSxcbiAgICAnU0tSRURPTVJJRCc6IFsnc2tyZWRPbXJJRCcsICdJbnRlZ2VyJ10sXG4gICAgJ1NLUkVET01STkFWTic6IFsnc2tyZWRPbXJOYXZuJywgJ1N0cmluZyddLFxuICAgICdTS1JFRFJFRE5JTkcnOiBbJ3NrcmVkUmVkbmluZycsICdJbnRlZ2VyJ10sXG4gICAgJ1NLUkVEUklTSUtPX0tMJzogWydza3JlZFJpc2lrb0t2aWtrbGVpcmVLbGFzc2UnLCAnSW50ZWdlciddLFxuICAgICdTS1JFRFNLQURFQU5ORU4nOiBbJ3NrcmVkU2thZGVBbm5lbicsICdJbnRlZ2VyJ10sXG4gICAgJ1NLUkVEU0tBREVPQkpFS1RFUic6IFsnc2tyZWRTa2FkZU9iamVrdGVyJywgJ0ludGVnZXInXSxcbiAgICAnU0tSRURTS0FERVNBTUZFUkRTRUwnOiBbJ3NrcmVkU2thZGVTYW1mZXJkc2VsJywgJ0ludGVnZXInXSxcbiAgICAnU0tSRURTS0FERVRZUEUnOiBbJ3NrcmVkU2thZFR5cGUnLCAnSW50ZWdlciddLFxuICAgICdTS1JFRFNLQURLT05TX0tMJzogWydza3JlZFNrYWRlS29uc2VrdmVuc0tsYXNzZScsICdJbnRlZ2VyJ10sXG4gICAgJ1NLUkVEU1RBVFNBTk4nOiBbJ3NrcmVkU3RhdGlzdGlra1Nhbm5zeW5saWdoZXQnLCAnU3RyaW5nJ10sXG4gICAgJ1NLUkVEVElESEVOREVMU0UnOiBbJ3NrcmVkVGlkc3B1bmt0SGVuZGVsc2UnLCAnU3RyaW5nJ10sXG4gICAgJ1NLUkVEVElEVVNJS0tFUkgnOiBbJ3NrcmVkVGlkVXNpa2tlcmhldCcsICdTdHJpbmcnXSxcbiAgICAnU0tSRURUWVBFJzogWydza3JlZHR5cGUnLCAnSW50ZWdlciddLFxuICAgICdTS1JFRFVUTE9NUkhFTE5JTkcnOiBbJ3NrcmVkVXRsb3NuaW5nT21ySGVsbmluZycsICdJbnRlZ2VyJ10sXG4gICAgJ1NLUkVEVVRMT1BPTVJUWVBFJzogWydza3JlZFV0bG9wT21yVHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ1NLUkVEVVRMT1NOSU5HT01SVFlQRSc6IFsnc2tyZWRVdGxvc25pbmdPbXJUeXBlJywgJ0ludGVnZXInXSxcbiAgICAnU0tSRURWT0xVTSc6IFsnc2tyZWRWb2x1bScsICdTdHJpbmcnXSxcbiAgICAnU0tSRVRTTkFWTic6IFsnc2tvbGVrcmV0c25hdm4nLCAnU3RyaW5nJ10sXG4gICAgJ1NLUkVUU05SJzogWydza29sZWtyZXRzbnVtbWVyJywgJ0ludGVnZXInXSxcbiAgICAnU0tSSUZUS09ERSc6IFsncHJlc2VudGFzam9uc2tvZGUnLCAnSW50ZWdlciddLFxuICAgICdTS1lMRCc6IFsnc2t5bGQnLCAnUmVhbCddLFxuICAgICdTS1lWR1JJTkRMJzogWydza3l2ZWdyZW5zZUlubmRlbGluZycsICdJbnRlZ2VyJ10sXG4gICAgJ1NMVVNFVFlQJzogWydzbHVzZVR5cGUnLCAnSW50ZWdlciddLFxuICAgICdTTcOFQsOFVEhBVk5GQVNJTElURVQnOiBbJ3Ntw6Viw6V0aGF2bmZhc2lsaXRldCcsICdJbnRlZ2VyJ10sXG4gICAgJ1NOQVZOJzogWydzdGVkc25hdm4nLCAnU3RyaW5nJ10sXG4gICAgJ1NOREFUTyc6IFsnc3RhdHVzZGF0bycsICdEYXRlJ10sXG4gICAgJ1NOSVRUX0jDmCc6IFsnc25pdHRow7h5ZGUnLCAnSW50ZWdlciddLFxuICAgICdTTktJTERFJzogWydzdGVkc25hdm5raWxkZScsICdTdHJpbmcnXSxcbiAgICAnU05Mw5hQRU5SJzogWydhcmtpdmzDuHBlbnVtbWVyJywgJ0ludGVnZXInXSxcbiAgICAnU05NRVJLJzogWydzdGVkc25hdm5tZXJrbmFkJywgJ1N0cmluZyddLFxuICAgICdTTk1ZTkQnOiBbJ3N0ZWRzbmF2blZlZHRha3NteW5kaWdoZXQnLCAnU3RyaW5nJ10sXG4gICAgJ1NOUic6IFsnc2Vrc2pvbnNudW1tZXInLCAnSW50ZWdlciddLFxuICAgICdTTlJFR0RBVE8nOiBbJ3N0ZWRzbmF2blJlZ2lzdHJlcmluZ3NkYXRvJywgJ0RhdGUnXSxcbiAgICAnU05TQUtTTlInOiBbJ2Fya2l2c2Frc251bW1lcicsICdJbnRlZ2VyJ10sXG4gICAgJ1NOU0tSU1RBVCc6IFsnc3RlZHNuYXZuU2tyaXZlbcOldGVzdGF0dXMnLCAnU3RyaW5nJ10sXG4gICAgJ1NOU1BSw4VLJzogWydzcHLDpWsnLCAnU3RyaW5nJ10sXG4gICAgJ1NOVFlTVEFUJzogWydzdGVkc25hdm5UeXBlc3RhdHVzJywgJ1N0cmluZyddLFxuICAgICdTTsOYU0NPT1RFUkzDmFlQRVRZUEUnOiBbJ3Nuw7hzY29vdGVybMO4eXBlVHlwZScsICdTdHJpbmcnXSxcbiAgICAnU09HTk5VTU1FUic6IFsnc29nbm51bW1lcicsICdJbnRlZ2VyJ10sXG4gICAgJ1NPTkVOQVVUJzogWydzb25lTmF1dGlzaycsICdJbnRlZ2VyJ10sXG4gICAgJ1NPTkVUWVBFJzogWydzb25ldHlwZScsICdTdHJpbmcnXSxcbiAgICAnU09TSUVMRU1FTlQnOiBbJ3Nvc2lFbGVtZW50bmF2bicsICdTdHJpbmcnXSxcbiAgICAnU09TSS1OSVbDhSc6IFsnc29zaUtvbXBsZWtzaXRldE5pdsOlJywgJ0ludGVnZXInXSxcbiAgICAnU09TSS1WRVJTSk9OJzogWydzb3NpVmVyc2pvbicsICdTdHJpbmcnXSxcbiAgICAnU1BfQUJPTlRSRSc6IFsnc2tvZ2JycGxhbktsYXNzQWt0dWVsdFRyZXNsYWcnLCAnSW50ZWdlciddLFxuICAgICdTUF9BR0pCT04nOiBbJ3Nrb2dicnBsYW5LbGFzc0FrdFNuaXR0Qm9uJywgJ0ludGVnZXInXSxcbiAgICAnU1BfQUxERVInOiBbJ3Nrb2dicnBsYW5CZXNrcml2QmVzdGFuZEFsZGVyJywgJ0ludGVnZXInXSxcbiAgICAnU1BfQU5ERVJFRyc6IFsnc2tvZ2JycGxhblRyZXNsYWdBbnRUcmVEYWFFUmVnJywgJ0ludGVnZXInXSxcbiAgICAnU1BfQU5ERlJFRyc6IFsnc2tvZ2JycGxhblRyZXNsYWdBbnRUcmVEYWFGUmVnJywgJ0ludGVnZXInXSxcbiAgICAnU1BfQVZPTFBSREEnOiBbJ3Nrb2dicnBsYW5HcnVubmxhZ1ZvbHVtRGFhRmVsdCcsICdSZWFsJ10sXG4gICAgJ1NQX0FWT0xUT1QnOiBbJ3Nrb2dicnBsYW5HcnVubmxhZ1ZvbHVtQmVzdEZlbHQnLCAnSW50ZWdlciddLFxuICAgICdTUF9CQVJFQUwnOiBbJ3Nrb2dicnBsYW5CZXNrcml2QmVzdGFuZERhYScsICdSZWFsJ10sXG4gICAgJ1NQX0JFUlRZUEUnOiBbJ3Nrb2dicnBsYW5HcnVubmxhZ0JlclR5cGUnLCAnSW50ZWdlciddLFxuICAgICdTUF9CRVNUREVMTlInOiBbJ3Nrb2dicnBsYW5CZXN0YW5kRGVsTnInLCAnSW50ZWdlciddLFxuICAgICdTUF9CRVNUTlInOiBbJ3Nrb2dicnBsYW5CZXN0YW5kTnInLCAnSW50ZWdlciddLFxuICAgICdTUF9CRVZORSc6IFsnc2tvZ2JycGxhblRlcnJlbmdCw6ZyZWV2bmVCZXN0YW5kJywgJ0ludGVnZXInXSxcbiAgICAnU1BfQk1JRERJQU0nOiBbJ3Nrb2dicnBsYW5CZXNrcml2QmVzdFNuaXR0RGlhbScsICdJbnRlZ2VyJ10sXG4gICAgJ1NQX0JNSURHUkZMJzogWydza29nYnJwbGFuQmVza3JpdkJlc3RhbmRTbml0dE0yJywgJ0ludGVnZXInXSxcbiAgICAnU1BfQk1JREhPJzogWydza29nYnJwbGFuQmVza3JpdkJlc3RhbmRTbml0dEgnLCAnUmVhbCddLFxuICAgICdTUF9CUkFUVCc6IFsnc2tvZ2JycGxhblRlcnJlbmdCZXN0YW5kQnJhdHRoZXQnLCAnSW50ZWdlciddLFxuICAgICdTUF9CVElMVlBSREEnOiBbJ3Nrb2dicnBsYW5UaWx2ZWtzdEJlcmVnbkRhYScsICdSZWFsJ10sXG4gICAgJ1NQX0JUSUxWUFJPUyc6IFsnc2tvZ2JycGxhblRpbHZla3N0QmVyZWduUHJvc2VudCcsICdSZWFsJ10sXG4gICAgJ1NQX0JWT0xQUkRBJzogWydza29nYnJwbGFuVGlsdmVrc3RCZXJlZ25NMycsICdSZWFsJ10sXG4gICAgJ1NQX0RFTkRSJzogWydza29nYnJwbGFuQWRtRGF0b0VuZHJpbmcnLCAnRGF0ZSddLFxuICAgICdTUF9EUkVHJzogWydza29nYnJwbGFuQWRtRGF0b0V0YWJsZXJpbmcnLCAnRGF0ZSddLFxuICAgICdTUF9FTEVNVFlQRSc6IFsnc2tvZ2JycGxhbkZsZXJLb2RlckVsZW1lbnR0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnU1BfRkFSQU5EJzogWydza29nYnJwbGFuRmxlcktvZGVyQXJlYWxQcm9zZW50JywgJ0ludGVnZXInXSxcbiAgICAnU1BfRkFSRUFMJzogWydza29nYnJwbGFuRmxlcktvZGVyQXJlYWxEYWEnLCAnSW50ZWdlciddLFxuICAgICdTUF9GUkFORCc6IFsnc2tvZ2JycGxhbkZsZXJLb2RlclNwZXNCZWhQcm9zJywgJ0ludGVnZXInXSxcbiAgICAnU1BfRlJBUkVBTCc6IFsnc2tvZ2JycGxhbkZsZXJLb2RlclNwZXNCZWhEYWEnLCAnSW50ZWdlciddLFxuICAgICdTUF9HUkVORCc6IFsnc2tvZ2JycGxhblRlaWdHcmVuZCcsICdJbnRlZ2VyJ10sXG4gICAgJ1NQX0dSRkwnOiBbJ3Nrb2dicnBsYW5UZXR0aGV0R3J1bm5mbGF0ZXN1bScsICdJbnRlZ2VyJ10sXG4gICAgJ1NQX0hCQVInOiBbJ3Nrb2dicnBsYW5CZXNrcml2QmFySMO4eWRlaGtsMicsICdJbnRlZ2VyJ10sXG4gICAgJ1NQX0hLTCc6IFsnc2tvZ2JycGxhbkJlc2tyaXZIb2dzdGtsYXNzZScsICdJbnRlZ2VyJ10sXG4gICAgJ1NQX0hMQVVWJzogWydza29nYnJwbGFuQmVza3JpdkxhdXZIw7h5ZGVoa2wyJywgJ0ludGVnZXInXSxcbiAgICAnU1BfSE9WRURHUic6IFsnc2tvZ2JycGxhbkdydW5ubGFnSG92ZWRncnVwcGUnLCAnSW50ZWdlciddLFxuICAgICdTUF9IT1lERSc6IFsnc2tvZ2JycGxhblRldHRoZXRNSMO4eWRlJywgJ0ludGVnZXInXSxcbiAgICAnU1BfSU1QQU5ERUwnOiBbJ3Nrb2dicnBsYW5LbGFzc0ltcFByb3NlbnQnLCAnSW50ZWdlciddLFxuICAgICdTUF9JTVBUWVBFJzogWydza29nYnJwbGFuS2xhc3NJbXBUeXBlJywgJ0ludGVnZXInXSxcbiAgICAnU1BfTElMRU4nOiBbJ3Nrb2dicnBsYW5UZXJyZW5nTGlMZW5nZGUnLCAnSW50ZWdlciddLFxuICAgICdTUF9NSU5UUlNQJzogWydza29nYnJwbGFuVGVycmVuZ01pblRyYW5zcFV0c3QnLCAnSW50ZWdlciddLFxuICAgICdTUF9QQk9OVFJFJzogWydza29nYnJwbGFuS2xhc3NQb3RUcmVzbGFnJywgJ0ludGVnZXInXSxcbiAgICAnU1BfUEdKQk9OJzogWydza29nYnJwbGFuS2xhc3NQb3RTbml0dEJvbicsICdJbnRlZ2VyJ10sXG4gICAgJ1NQX1BSSU8nOiBbJ3Nrb2dicnBsYW5UaWx0YWtQcm9yaXRldCcsICdJbnRlZ2VyJ10sXG4gICAgJ1NQX1JFRyc6IFsnc2tvZ2JycGxhbkdydW5ubGFnUmVnaW9uJywgJ0ludGVnZXInXSxcbiAgICAnU1BfU0pJS1QnOiBbJ3Nrb2dicnBsYW5CZXNrcml2U2ppa3RuaW5nJywgJ0ludGVnZXInXSxcbiAgICAnU1BfU0tPR1RZUCc6IFsnc2tvZ2JycGxhbkJlc2tyaXZTa29ndHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ1NQX1NVTk5IJzogWydza29nYnJwbGFuQmVza3JpdlN1bm5oZXQnLCAnSW50ZWdlciddLFxuICAgICdTUF9TVlBST1MnOiBbJ3Nrb2dicnBsYW5HcnVubmxhZ1N2aW5uUHJvc2VudCcsICdJbnRlZ2VyJ10sXG4gICAgJ1NQX1RBS1NUVFlQRSc6IFsnc2tvZ2JycGxhbkdydW5ubGFnVGFrc3R0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnU1BfVEFSQU5EJzogWydza29nYnJwbGFuVGlsdGFrUHJvc2VudCcsICdJbnRlZ2VyJ10sXG4gICAgJ1NQX1RBUkVBTCc6IFsnc2tvZ2JycGxhblRpbHRha0FyZWFsJywgJ1JlYWwnXSxcbiAgICAnU1BfVEVJR05SJzogWydza29nYnJwbGFuVGVpZ05yJywgJ0ludGVnZXInXSxcbiAgICAnU1BfVEVSSkVWTic6IFsnc2tvZ2JycGxhblRlcnJlbmdKZXZuaGV0JywgJ0ludGVnZXInXSxcbiAgICAnU1BfVElMVCc6IFsnc2tvZ2JycGxhblRpbHRha0Jlc3RhbmQnLCAnSW50ZWdlciddLFxuICAgICdTUF9USUxWS09SJzogWydza29nYnJwbGFuR3J1bm5sYWdUaWx2ZWtzdGtvcnInLCAnSW50ZWdlciddLFxuICAgICdTUF9UTkFWTic6IFsnc2tvZ2JycGxhblRlaWdOYXZuJywgJ1N0cmluZyddLFxuICAgICdTUF9UT1RWT0wnOiBbJ3Nrb2dicnBsYW5UaWx2ZWtzdFZvbHVtQmVzdGFuZCcsICdJbnRlZ2VyJ10sXG4gICAgJ1NQX1RSRUVSRUcnOiBbJ3Nrb2dicnBsYW5CZXNrcml2VHJlRVJlZ3VsZXJpbmcnLCAnSW50ZWdlciddLFxuICAgICdTUF9UUkVGUkVHJzogWydza29nYnJwbGFuQmVza3JpdlRyZUZSZWd1bGVyaW5nJywgJ0ludGVnZXInXSxcbiAgICAnU1BfVFJFU0xBRyc6IFsnc2tvZ2JycGxhblRyZXNsYWcnLCAnSW50ZWdlciddLFxuICAgICdTUF9UUkVTTEhPJzogWydza29nYnJwbGFuVHJlc2xhZ0jDuHlkZScsICdJbnRlZ2VyJ10sXG4gICAgJ1NQX1ZPTEFORCc6IFsnc2tvZ2JycGxhblRyZXNsYWdQcm9zZW50JywgJ0ludGVnZXInXSxcbiAgICAnU1BfVk9MS09SUic6IFsnc2tvZ2JycGxhblRyZXNsYWdLb3JyVm9sdW1VQmFyaycsICdJbnRlZ2VyJ10sXG4gICAgJ1NQX1ZPTFNBTEcnOiBbJ3Nrb2dicnBsYW5UcmVzbGFnU2FsZ3N2b2x1bVVCYXJrJywgJ0ludGVnZXInXSxcbiAgICAnU1BfVk9MVUtPUlInOiBbJ3Nrb2dicnBsYW5UcmVzbGFnVWtvcnJWb2x1bVVCYXJrJywgJ0ludGVnZXInXSxcbiAgICAnU1BfQUFSJzogWydza29nYnJwbGFuVGlsdGFrw4VyJywgJ0ludGVnZXInXSxcbiAgICAnU1BFUlJJTkcnOiBbJ3NwZXJyaW5nJywgJ1N0cmluZyddLFxuICAgICdTUEVTX1NLSUzDmFlQRVRZUEUnOiBbJ3NwZXNpYWxTa2lsw7h5cGV0eXBlJywgJ1N0cmluZyddLFxuICAgICdTUEVTSUFMTUVSS0VUWVBFJzogWydzcGVzaWFsbWVya2V0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnU1BFU0lBTFNZS0tFTFJVVEVUWVBFJzogWydzcGVzaWFsc3lra2VscnV0ZXR5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ1NQT1JfSEFTVElHSEVUJzogWydzcG9yaGFzdGlnaGV0JywgJ0ludGVnZXInXSxcbiAgICAnU1BPUkFOVEFMTCc6IFsnc3BvcmFudGFsbCcsICdTdHJpbmcnXSxcbiAgICAnU1BPUkFWR1JFTklOR1NOUic6IFsnc3BvcmF2Z3JlbmluZ3NudW1tZXInLCAnU3RyaW5nJ10sXG4gICAgJ1NQT1JBVkdSRU5JTkdTUFVOS1ROUic6IFsnc3BvcmF2Z3JlbmluZ3NwdW5rdG51bW1lcicsICdTdHJpbmcnXSxcbiAgICAnU1BPUkFWR1JFTklOR1NQVU5LVFRZUEUnOiBbJ3Nwb3JhdmdyZW5pbmdzcHVua3R0eXBlJywgJ1N0cmluZyddLFxuICAgICdTUE9SQVZHUkVOSU5HU1RZUEUnOiBbJ3Nwb3JhdmdyZW5pbmdzdHlwZScsICdTdHJpbmcnXSxcbiAgICAnU1BPUktNJzogWydzcG9yS2lsb21ldGVyJywgJ1JlYWwnXSxcbiAgICAnU1BPUk5VTU1FUic6IFsnc3Bvcm51bW1lcicsICdTdHJpbmcnXSxcbiAgICAnU1BPUlBVTktUTlVNTUVSJzogWydzcG9ycHVua3RudW1tZXInLCAnU3RyaW5nJ10sXG4gICAgJ1NQT1JQVU5LVFRZUEUnOiBbJ3Nwb3JwdW5rdHR5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ1NQT1JUWVBFJzogWydzcG9ydHlwZScsICdTdHJpbmcnXSxcbiAgICAnU1NSLUlEJzogWydzc3JJZCcsICdJbnRlZ2VyJ10sXG4gICAgJ1NTUi1PQkpJRCc6IFsnb2JqSWQnLCAnSW50ZWdlciddLFxuICAgICdTVEFOREFSREVOSEVUJzogWydzdGFuZGFyZGVuaGV0JywgJ1N0cmluZyddLFxuICAgICdTVEFTSk9OU0ZPUk3DhUwnOiBbJ3N0YXNqb25zZm9ybcOlbCcsICdTdHJpbmcnXSxcbiAgICAnU1RBU0pPTlNOUic6IFsnc3Rhc2pvbnNudW1tZXInLCAnSW50ZWdlciddLFxuICAgICdTVEFTSk9OU1BBUkFNRVRFUic6IFsnc3Rhc2pvbnNwYXJhbWV0ZXInLCAnSW50ZWdlciddLFxuICAgICdTVEFTSk9OU1RZUEUnOiBbJ3N0YXNqb25zdHlwZScsICdTdHJpbmcnXSxcbiAgICAnU1RBU0pPTlRZUCc6IFsnc3Rhc2pvbnN0eXBlJywgJ1N0cmluZyddLFxuICAgICdTVEFUJzogWyd0eXBlU3RhdHVzJywgJ0ludGVnZXInXSxcbiAgICAnU1RBVFVTJzogWydzdGF0dXMnLCAnU3RyaW5nJ10sXG4gICAgJ1NURUQnOiBbJ3N0ZWQnLCAnU3RyaW5nJ10sXG4gICAgJ1NURURfVkVSSUYnOiBbJ3N0ZWRmZXN0aW5nVmVyaWZpc2VydCcsICdTdHJpbmcnXSxcbiAgICAnU1RFTkdFU0RBVE8nOiBbJ3N0ZW5nZXNEYXRvJywgJ0RhdGUnXSxcbiAgICAnU1RPUkJVRSc6IFsnc3RvcmJ1ZScsICdJbnRlZ2VyJ10sXG4gICAgJ1NUUkVLTklOR1NOVU1NRVInOiBbJ3N0cmVrbmluZ3NudW1tZXInLCAnSW50ZWdlciddLFxuICAgICdTVFJFTkcnOiBbJ2dlbmVyZWxsVGVrc3RzdHJlbmcnLCAnU3RyaW5nJ10sXG4gICAgJ1NUUklQRU5VTU1FUic6IFsnc3RyaXBlbnVtbWVyJywgJ1N0cmluZyddLFxuICAgICdTVFJVS1RVUk9WRVJCSUtLRVQnOiBbJ3N0cnVrdHVyT3ZlcmJpa2tldCcsICdTdHJpbmcnXSxcbiAgICAnU1RSVUtUVVJQVU5LVFRZUEUnOiBbJ3N0cnVrdHVyUHVua3R0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnU1RSw5hNSEFTVCc6IFsnc3Ryw7htaGFzdGlnaGV0JywgJ1JlYWwnXSxcbiAgICAnU1RSw5hNUkVUTic6IFsnc3Ryw7htcmV0bmluZycsICdJbnRlZ2VyJ10sXG4gICAgJ1NUw5hZRU5IRVQnOiBbJ3N0w7h5ZW5oZXQnLCAnU3RyaW5nJ10sXG4gICAgJ1NUw5hZSU5URVJWQUxMJzogWydzdMO4eWludGVydmFsbCcsICdJbnRlZ2VyJ10sXG4gICAgJ1NUw5hZS0lMREUnOiBbJ3N0w7h5a2lsZGUnLCAnU3RyaW5nJ10sXG4gICAgJ1NUw5hZS0lMREVJREVOVElGSUtBU0pPTic6IFsnU3TDuHlraWxkZWlkZW50aWZpa2Fzam9uJywgJ1N0cmluZyddLFxuICAgICdTVMOYWUtJTERFTkFWTic6IFsnc3TDuHlraWxkZW5hdm4nLCAnU3RyaW5nJ10sXG4gICAgJ1NUw5hZTUVUT0RFJzogWydzdMO4eW1ldG9kZScsICdTdHJpbmcnXSxcbiAgICAnU1TDmFlOSVbDhSc6IFsnc3TDuHluaXbDpScsICdJbnRlZ2VyJ10sXG4gICAgJ1NUw5hZU09ORUtBVEVHT1JJJzogWydzdMO4eXNvbmVrYXRlZ29yaScsICdTdHJpbmcnXSxcbiAgICAnU1VNX0FMVF9BUkVBTCc6IFsnc3VtQWx0ZXJuYXRpdnRBcmVhbCcsICdSZWFsJ10sXG4gICAgJ1NVTV9BTFRfQVJFQUwyJzogWydzdW1BbHRlcm5hdGl2dEFyZWFsMicsICdSZWFsJ10sXG4gICAgJ1NVTV9BTlRBTExCT0VOSCc6IFsnc3VtQW50YWxsQm9lbmhldGVyJywgJ0ludGVnZXInXSxcbiAgICAnU1VNX0JSVUtTQVJUT1QnOiBbJ3N1bUJydWtzYXJlYWxUb3RhbHQnLCAnUmVhbCddLFxuICAgICdTVU1fQlJVS1NUSUxBTk4nOiBbJ3N1bUJydWtzYXJlYWxUaWxBbm5ldCcsICdSZWFsJ10sXG4gICAgJ1NVTV9CUlVLU1RJTEJPTCc6IFsnc3VtQnJ1a3NhcmVhbFRpbEJvbGlnJywgJ1JlYWwnXSxcbiAgICAnU1lLS0VMUlVURVRZUEUnOiBbJ3N5a2tlbHJ1dGV0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnU1lOQkFSSEVUJzogWydzeW5iYXJoZXQnLCAnSW50ZWdlciddLFxuICAgICdTWVNLT0RFJzogWydyZWZlcmFuc2VzeXN0ZW1Lb2RlJywgJ0ludGVnZXInXSxcbiAgICAnVEFLRk9STSc6IFsndGFrZm9ybScsICdJbnRlZ2VyJ10sXG4gICAgJ1RBS1NLSkVHRyc6IFsndGFrc2tqZWdnJywgJ0ludGVnZXInXSxcbiAgICAnVEFLVEVLS0lORyc6IFsndGFrdGVra2luZycsICdJbnRlZ2VyJ10sXG4gICAgJ1RESU0tQlJFRERFJzogWyd0ZWtzdFRlZ25icmVkZGUnLCAnUmVhbCddLFxuICAgICdURElNLUjDmFlERSc6IFsndGVrc3RUZWduaMO4eWRlJywgJ1JlYWwnXSxcbiAgICAnVEVHTkZPUktMJzogWyd0ZWduZm9ya2xhcmluZycsICdTdHJpbmcnXSxcbiAgICAnVEVHTlNFVFQnOiBbJ3RlZ25zZXR0JywgJ1N0cmluZyddLFxuICAgICdURUlHRV9JRCc6IFsndGVpZ0V0dGVyU2tpZnRlSWRlbnQnLCAnSW50ZWdlciddLFxuICAgICdURUlHRl9JRCc6IFsndGVpZ0bDuHJTa2l0ZmVJZGVudCcsICdJbnRlZ2VyJ10sXG4gICAgJ1RFSUdGTEVSRU1BVFJTQU1NRUVJRVInOiBbJ3RlaWdGbGVyZU1hdHJTYW1tZUVpZXInLCAnU3RyaW5nJ10sXG4gICAgJ1RFSUdNRURGTEVSRU1BVFJFTkhFVEVSJzogWyd0ZWlnTWVkRmxlcmVNYXRyaWtrZWxlbmhldGVyJywgJ1N0cmluZyddLFxuICAgICdURUlHTlInOiBbJ2pvcmRyZWdpc3RlckVpZW5kb21UZWlnTnVtbWVyJywgJ0ludGVnZXInXSxcbiAgICAnVEVLU1RVUktPREUxJzogWyd0ZWtzdHVya29kZScsICdTdHJpbmcnXSxcbiAgICAnVEVLU1RVUktPREUyJzogWyd0ZWtzdHVya29kZTInLCAnU3RyaW5nJ10sXG4gICAgJ1RFS1NUVVJLT0RFMyc6IFsndGVrc3R1cmtvZGUzJywgJ1N0cmluZyddLFxuICAgICdURUxFRkFYTlInOiBbJ3RlbGVmYXhudW1tZXInLCAnSW50ZWdlciddLFxuICAgICdURUxFRk9OTlInOiBbJ3RlbGVmb25udW1tZXInLCAnSW50ZWdlciddLFxuICAgICdURUxMRVInOiBbJ3RlbGxlcicsICdSZWFsJ10sXG4gICAgJ1RFTUFKVVNUJzogWydnZW9sVGVtYWp1c3RlcmluZycsICdJbnRlZ2VyJ10sXG4gICAgJ1RFTUFLVkFMJzogWyd0ZW1hS3ZhbGl0ZXQnLCAnU3RyaW5nJ10sXG4gICAgJ1RFUlNLRUxGVU5LU0pPTic6IFsndGVyc2tlbEZ1bmtzam9uJywgJ1N0cmluZyddLFxuICAgICdURVJTS0VMVFlQJzogWyd0ZXJza2VsVHlwZScsICdTdHJpbmcnXSxcbiAgICAnVEVUVFNURUROQVZOJzogWyd0ZXR0c3RlZG5hdm4nLCAnU3RyaW5nJ10sXG4gICAgJ1RJRE9QUEhPTERWQU5OJzogWyd0aWRPcHBob2xkVmFubicsICdJbnRlZ2VyJ10sXG4gICAgJ1RJRFJFRic6IFsndGlkcmVmZXJhbnNlJywgJ1N0cmluZyddLFxuICAgICdUSURTQU5HSVZFTFNFJzogWyd0aWRzYW5naXZlbHNlJywgJ0ludGVnZXInXSxcbiAgICAnVElEU0VOSEVUJzogWyd0aWRzZW5oZXQnLCAnU3RyaW5nJ10sXG4gICAgJ1RJRFNMVVRUJzogWydwZXJpb2RlU2x1dHQnLCAnRGF0ZSddLFxuICAgICdUSURTUFVOS1QnOiBbJ3RpZHNwdW5rdCcsICdEYXRlJ10sXG4gICAgJ1RJRFNUQVJUJzogWydwZXJpb2RlU3RhcnQnLCAnRGF0ZSddLFxuICAgICdUSUxERUxUX0FSRUFMJzogWyd0aWxkZWx0QXJlYWwnLCAnUmVhbCddLFxuICAgICdUSUxERUxUX0RBVE8nOiBbJ3RpbGxkZWx0RGF0bycsICdEYXRlJ10sXG4gICAgJ1RJTEdKRU5HRUxJR0hFVFNWVVJERVJJTkcnOiBbJ3RpbGdqZW5nZWxpZ2hldHN2dXJkZXJpbmcnLCAnU3RyaW5nJ10sXG4gICAgJ1RJTExFR0cnOiBbJ2ZsYXRldGlsbGVnZycsICdJbnRlZ2VyJ10sXG4gICAgJ1RJTExFR0dTQVJFQUwnOiBbJ3RpbGxlZ2dzYXJlYWwnLCAnSW50ZWdlciddLFxuICAgICdUSUxTUE9STk9ERUtJTE9NRVRFUic6IFsndGlsU3Bvcm5vZGVLaWxvbWV0ZXInLCAnUmVhbCddLFxuICAgICdUSUxTUE9STk9ERVRFS1NUJzogWyd0aWxTcG9ybm9kZVRla3N0JywgJ1N0cmluZyddLFxuICAgICdUSUxTUE9STk9ERVRZUEUnOiBbJ3RpbFNwb3Jub2RlVHlwZScsICdTdHJpbmcnXSxcbiAgICAnVElMU1lTJzogWyd0aWxLb29yZGluYXRzeXN0ZW0nLCAnSW50ZWdlciddLFxuICAgICdUSUxUQUtOUic6IFsndGlsdGFrc251bW1lcicsICdJbnRlZ2VyJ10sXG4gICAgJ1RJTkdMWVNUJzogWyd0aW5nbHlzdCcsICdTdHJpbmcnXSxcbiAgICAnVElQUFZPTFVNJzogWydkZXBvbml0aXBwVm9sdW0nLCAnSW50ZWdlciddLFxuICAgICdUT0tUSUQnOiBbJ3Rva3RJZCcsICdTdHJpbmcnXSxcbiAgICAnVE9UX1BST0QnOiBbJ3RvdGFsUHJvZHVrc2pvbicsICdJbnRlZ2VyJ10sXG4gICAgJ1RPVEFMQVJFQUxLTTInOiBbJ3RvdGFsYXJlYWxLbTInLCAnUmVhbCddLFxuICAgICdUT1RBTEJFTEFTVE5JTkcnOiBbJ3RvdGFsQmVsYXN0bmluZycsICdJbnRlZ2VyJ10sXG4gICAgJ1RSQUZJS0tCRUxBU1ROSU5HJzogWyd0cmFmaWtrYmVsYXN0bmluZycsICdJbnRlZ2VyJ10sXG4gICAgJ1RSQUZJS0tGQVJFJzogWyd0cmFmaWtrZmFyZScsICdTdHJpbmcnXSxcbiAgICAnVFJFX0RfTklWw4UnOiBbJ3RyZUROaXbDpScsICdJbnRlZ2VyJ10sXG4gICAgJ1RSRV9UWVAnOiBbJ3RyZVR5cGUnLCAnSW50ZWdlciddLFxuICAgICdUUk5PUkQnOiBbJ3Rla3N0UmVmZXJhbnNlUHVua3ROb3JkJywgJ0ludGVnZXInXSxcbiAgICAnVFLDmFNUJzogWyd0ZWtzdFJlZmVyYW5zZVB1bmt0w5hzdCcsICdJbnRlZ2VyJ10sXG4gICAgJ1RTS09HJzogWyd0aWxsZWdnc29wcGx5c25pbmdlclNrb2cnLCAnSW50ZWdlciddLFxuICAgICdUU0tZVic6IFsndGVrc3RGb3Jza3l2bmluZycsICdSZWFsJ10sXG4gICAgJ1RTVEVEJzogWyd0ZXR0c3RlZG51bW1lcicsICdJbnRlZ2VyJ10sXG4gICAgJ1RWSVNUJzogWyd0dmlzdCcsICdTdHJpbmcnXSxcbiAgICAnVFdZTUVSSyc6IFsndGFrc2ViYW5lb3BwbWVya2luZycsICdJbnRlZ2VyJ10sXG4gICAgJ1RZUEVfQlInOiBbJ3RyYXNlYnJlZGRldHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ1RZUEVfVkFOTkZPUl9BTkwnOiBbJ3R5cGVWYW5uZm9yc3luaW5nc2FubGVnZycsICdJbnRlZ2VyJ10sXG4gICAgJ1RZUEVEVU1QRU9NUsOFREUnOiBbJ3R5cGVEdW1wZW9tcsOlZGUnLCAnSW50ZWdlciddLFxuICAgICdUWVBFSU5OU0rDmCc6IFsndHlwZUlubnNqw7gnLCAnSW50ZWdlciddLFxuICAgICdUWVBFU0FNRkxJTkpFJzogWydzYW1mZXJkc2Vsc2xpbmplVHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ1RZUEVTQU1GUFVOS1QnOiBbJ3NhbWZlcmRzZWxzcHVua3QnLCAnSW50ZWdlciddLFxuICAgICdVQl9BTkxfVFlQJzogWyd1dG1hcmtiZWl0ZUFubGVnZ3N0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnVUJfRFlSRVNMJzogWyd1dG1hcmtiZWl0ZUR5cmVzbGFnJywgJ1N0cmluZyddLFxuICAgICdVRlVMTFNURU5ESUdBUkVBTCc6IFsndWZ1bGxzdGVuZGlnQXJlYWwnLCAnU3RyaW5nJ10sXG4gICAgJ1VOREVSQllHTklOR0tPTlNUUic6IFsndW5kZXJieWduaW5nS29uc3RyJywgJ0ludGVnZXInXSxcbiAgICAnVU5ERVJHUlVOTic6IFsndW5kZXJncnVubicsICdTdHJpbmcnXSxcbiAgICAnVU5ERVJMQUcnOiBbJ2Zhc3RtZXJrZVVuZGVybGFnJywgJ0ludGVnZXInXSxcbiAgICAnVU5ERVJMQUdTVFlQRSc6IFsndW5kZXJsYWdzdHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ1VOREVSU0FNTUVORsOYWU5JTkdTS0FMQkVTVMOFJzogWyd1bmRlclNhbW1lbmbDuHluaW5nU2thbEJlc3TDpScsICdTdHJpbmcnXSxcbiAgICAnVU5ERVJTQU1NRU5Gw5hZTklOR1NLQUxVVEfDhSc6IFsndW5kZXJTYW1tZW5mw7h5bmluZ1NrYWxVdGfDpScsICdTdHJpbmcnXSxcbiAgICAnVU5ERVJTT0tFTFNFTlInOiBbJ3VuZGVyc29rZWxzZU51bW1lcicsICdJbnRlZ2VyJ10sXG4gICAgJ1VOREVSVFlQRSc6IFsndW5kZXJ0eXBlVmVyc2pvbicsICdTdHJpbmcnXSxcbiAgICAnVU5SJzogWyd1bmRlck5yJywgJ0ludGVnZXInXSxcbiAgICAnVVJFR0pPUkRTQU1FSUUnOiBbJ3VyZWdpc3RyZXJ0Sm9yZHNhbWVpZScsICdTdHJpbmcnXSxcbiAgICAnVVRFQVJFQUwnOiBbJ3V0ZW9wcGhvbGRzYXJlYWwnLCAnSW50ZWdlciddLFxuICAgICdVVEfDhVJfREFUTyc6IFsndXRnw6VyRGF0bycsICdEYXRlJ10sXG4gICAgJ1VUR8OFVFQnOiBbJ3V0Z8OldHQnLCAnU3RyaW5nJ10sXG4gICAgJ1VUTlRBTEwnOiBbJ3V0bnl0dGluZ3N0YWxsJywgJ1JlYWwnXSxcbiAgICAnVVROVFlQJzogWyd1dG55dHRpbmdzdHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ1VUTllUVEJBUl9LQVAnOiBbJ3V0bnl0dGJhck1hZ2FzaW5rYXBhc2l0ZXQnLCAnUmVhbCddLFxuICAgICdVVFNMSVBQVFlQRSc6IFsndXRzbGlwcHR5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ1VUVl9USUxMX05SJzogWyd0aWxsYXRlbHNlc251bW1lcicsICdTdHJpbmcnXSxcbiAgICAnVVRWX1RJTExfVFlQRSc6IFsndXR2aW5uaW5nc3RpbGxhdGVsc2VzdHlwZScsICdTdHJpbmcnXSxcbiAgICAnVVRWQUxHU0FLJzogWyd1dHZhbGdzc2Frc251bW1lcicsICdJbnRlZ2VyJ10sXG4gICAgJ1VUVkFMR1NNRVQnOiBbJ3V0dmFsZ01ldG9kZScsICdTdHJpbmcnXSxcbiAgICAnVVVGQVNJTElURVQnOiBbJ3VuaXZlcnNlbGx1dGZvcm1pbmdGYXNpbGl0ZXQnLCAnU3RyaW5nJ10sXG4gICAgJ1ZBTFVUQUVOSEVUJzogWyd2YWx1dGFlbmhldCcsICdTdHJpbmcnXSxcbiAgICAnVkFOTkJSJzogWyd2YW5uYnJlZGRlJywgJ0ludGVnZXInXSxcbiAgICAnVkFOTkZPUlNZTklORyc6IFsndmFubmZvcnN5bmluZycsICdJbnRlZ2VyJ10sXG4gICAgJ1ZBTk5Gw5hSSU5HTUlETEVSRSc6IFsndmFubmbDuHJpbmdNaWRsZXJlJywgJ0ludGVnZXInXSxcbiAgICAnVkFOTkbDmFJJTkdNSU5TVEUnOiBbJ3Zhbm5mw7hyaW5nTWluc3RlJywgJ0ludGVnZXInXSxcbiAgICAnVkFOTkbDmFJJTkdTVMOYUlNUJzogWyd2YW5uZsO4cmluZ1N0w7hyc3QnLCAnSW50ZWdlciddLFxuICAgICdWQU5OTEFHUic6IFsndmFubmxhZ3JpbmdzZXZuZScsICdJbnRlZ2VyJ10sXG4gICAgJ1ZBU1NEUkFHTkFWTic6IFsndmFzc2RyYWdzbmF2bicsICdTdHJpbmcnXSxcbiAgICAnVkFTU0RSQUdTTlInOiBbJ3Zhc3NkcmFnc251bW1lcicsICdTdHJpbmcnXSxcbiAgICAnVkFUTkxOUic6IFsndmF0bkzDuHBlbnVtbWVyJywgJ0ludGVnZXInXSxcbiAgICAnVi1ERUxUQS1NQVgnOiBbJ3ZlcnRpa2FsdERlbHRhTWFrc2ltdW0nLCAnSW50ZWdlciddLFxuICAgICdWLURFTFRBLU1JTic6IFsndmVydGlrYWx0RGVsdGFNaW5pbXVtJywgJ0ludGVnZXInXSxcbiAgICAnVkVETElLRUgnOiBbJ3ZlZGxpa2Vob2xkc2Fuc3ZhcmxpZycsICdTdHJpbmcnXSxcbiAgICAnVkVEVEFLJzogWyd2ZWR0YWtzdHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ1ZFRFRBS1NEQVRPJzogWyd2ZWR0YWtzZGF0bycsICdEYXRlJ10sXG4gICAgJ1ZFR0tBVEVHT1JJJzogWyd2ZWdrYXRlZ29yaScsICdTdHJpbmcnXSxcbiAgICAnVkVHTlVNTUVSJzogWyd2ZWdudW1tZXInLCAnSW50ZWdlciddLFxuICAgICdWRUdPVkVSVkVHJzogWyd2ZWdPdmVyVmVnJywgJ1N0cmluZyddLFxuICAgICdWRUdSRUtLVkVSS1RZUEUnOiBbJ3ZlZ3Jla2t2ZXJrVHlwZScsICdTdHJpbmcnXSxcbiAgICAnVkVHU1BFUlJJTkdUWVBFJzogWyd2ZWdzcGVycmluZ3R5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ1ZFR1NUQVRVUyc6IFsndmVnc3RhdHVzJywgJ1N0cmluZyddLFxuICAgICdWRVJESSc6IFsndmVyZGknLCAnSW50ZWdlciddLFxuICAgICdWRVJESTEnOiBbJ3ZlcmRpJywgJ1N0cmluZyddLFxuICAgICdWRVJESTInOiBbJ3RpbFZlcmRpJywgJ1N0cmluZyddLFxuICAgICdWRVJESUFOTkEnOiBbJ3ZlcmRpQW5uZW5VdG55dHRlbHNlR3J1bm4nLCAnUmVhbCddLFxuICAgICdWRVJESUJFSVRFJzogWyd2ZXJkaUJlaXRlcmV0dCcsICdSZWFsJ10sXG4gICAgJ1ZFUkRJR1JVTk4nOiBbJ3ZlcmRpR3J1bm4nLCAnUmVhbCddLFxuICAgICdWRVJESUpBS1QnOiBbJ3ZlcmRpSmFrdHJldHQnLCAnUmVhbCddLFxuICAgICdWRVJESVNLT0cnOiBbJ3ZlcmRpU2tvZ1Byb2R1a3Nqb24nLCAnUmVhbCddLFxuICAgICdWRVJJRklTRVJJTkdTREFUTyc6IFsndmVyaWZpc2VyaW5nc2RhdG8nLCAnRGF0ZSddLFxuICAgICdWRVJOX0ZPUk1BTCc6IFsndmVybmVGb3Jtw6VsJywgJ1N0cmluZyddLFxuICAgICdWRVJOX0xPVic6IFsndmVybmVsb3YnLCAnU3RyaW5nJ10sXG4gICAgJ1ZFUk5fTU9UJzogWyd2ZXJuc2tvZ1R5cGUnLCAnSW50ZWdlciddLFxuICAgICdWRVJOX1BBUkEnOiBbJ3Zlcm5lcGFyYWdyYWYnLCAnU3RyaW5nJ10sXG4gICAgJ1ZFUk5FREFUTyc6IFsndmVybmVkYXRvJywgJ0RhdGUnXSxcbiAgICAnVkVSTkVGT1JNJzogWyd2ZXJuZWZvcm0nLCAnU3RyaW5nJ10sXG4gICAgJ1ZFUk5FUExBTic6IFsndmVybmVwbGFuJywgJ0ludGVnZXInXSxcbiAgICAnVkVSTlRFTUEnOiBbJ3Zlcm5lVGVtYScsICdJbnRlZ2VyJ10sXG4gICAgJ1ZFUk5UWVBFJzogWyd2ZXJuZXR5cGUnLCAnU3RyaW5nJ10sXG4gICAgJ1ZFUlNKT04nOiBbJ3ZlcnNqb24nLCAnU3RyaW5nJ10sXG4gICAgJ1ZFUlRfQsOGUkVLT05TVFInOiBbJ3ZlcnRpa2FsQsOmcmVrb25zdHJ1a3Nqb24nLCAnSW50ZWdlciddLFxuICAgICdWRVJUTklWJzogWyd2ZXJ0aWthbG5pdsOlJywgJ0ludGVnZXInXSxcbiAgICAnVkZMQVRFJzogWydkZWx0ZWlnS2xhc3NpZmlzZXJpbmcnLCAnSW50ZWdlciddLFxuICAgICdWRlJBREFUTyc6IFsndmVnbGVua2VGcmFEYXRvJywgJ0RhdGUnXSxcbiAgICAnVklLVElHJzogWyd2aWt0aWdoZXQnLCAnSW50ZWdlciddLFxuICAgICdWSU5EUkVUTic6IFsndmluZHJldG5pbmcnLCAnSW50ZWdlciddLFxuICAgICdWSU5LRUxFTkhFVCc6IFsndmlua2VsZW5oZXQnLCAnU3RyaW5nJ10sXG4gICAgJ1ZJUktTT01IRVQnOiBbJ3R5cGVSYXN0b2ZmVmlya3NvbWhldCcsICdJbnRlZ2VyJ10sXG4gICAgJ1ZJU1VFTExUWURFTElHSEVUJzogWyd2aXN1ZWxsVHlkZWxpZ2hldCcsICdJbnRlZ2VyJ10sXG4gICAgJ1ZLSk9SRkxUJzogWydmZWx0b3ZlcnNpa3QnLCAnU3RyaW5nJ10sXG4gICAgJ1ZLUkVUU05BVk4nOiBbJ3ZhbGdrcmV0c25hdm4nLCAnU3RyaW5nJ10sXG4gICAgJ1ZLUkVUU05SJzogWyd2YWxna3JldHNudW1tZXInLCAnSW50ZWdlciddLFxuICAgICdWTEVOS0VJRCc6IFsndmVnbGVua2VJZGVudGlmaWthc2pvbicsICdJbnRlZ2VyJ10sXG4gICAgJ1ZPTFVNX00zJzogWydyYXN0b2ZmVm9sdW0nLCAnSW50ZWdlciddLFxuICAgICdWT0xVTUVOSEVUJzogWyd2b2x1bWVuaGV0JywgJ1N0cmluZyddLFxuICAgICdWT0xVTUlOTlNKw5gnOiBbJ3ZvbHVtSW5uc2rDuCcsICdJbnRlZ2VyJ10sXG4gICAgJ1ZSQUtUWVAnOiBbJ3ZyYWt0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnVlRJTERBVE8nOiBbJ3ZlZ2xlbmtlVGlsRGF0bycsICdEYXRlJ10sXG4gICAgJ1ZVUkRFUklORyc6IFsndnVyZGVyaW5nJywgJ1N0cmluZyddLFxuICAgICdWVVJERVJUREFUTyc6IFsndnVyZGVydERhdG8nLCAnRGF0ZSddLFxuICAgICdWw4ZTS0VUWVBFJzogWydwZXRyb2xldW1zdsOmc2tldHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ1dSQktPREUnOiBbJ1dSQmdydXBwZScsICdTdHJpbmcnXSxcbiAgICAnWVRURVJWRUdHJzogWyd5dHRlcnZlZ2cnLCAnSW50ZWdlciddLFxuICAgICfDmFNUJzogWyfDuHN0JywgJ0ludGVnZXInXSxcbiAgICAnw4VQTkVTREFUTyc6IFsnw6VwbmVzRGF0bycsICdEYXRlJ10sXG4gICAgJ8OFUic6IFsnw6Vyc3RhbGwnLCAnSW50ZWdlciddLFxuICAgICfDhVJTVElEQlJVSyc6IFsnw6Vyc3RpZGJydWsnLCAnU3RyaW5nJ10sXG4gICAgJ1ZFRFRBS0VOREVMSUdQTEFOREFUTyc6IFsndmVkdGFrRW5kZWxpZ1BsYW5EYXRvJywgJ0RhdGUnXSxcbiAgICAnS1VOTkdKw5hSSU5HU0RBVE8nOiBbJ2t1bm5nasO4cmluZ3NkYXRvJywgJ0RhdGUnXSxcbiAgICAnS1BCRVNURU1NRUxTRUhKRU1NRUwnOiBbJ2twQmVzdGVtbWVsc2VIamVtbWVsJywgJ0ludGVnZXInXSxcbiAgICAnUlBCRVNURU1NRUxTRUhKRU1NRUwnOiBbJ3JwQmVzdGVtbWVsc2VIamVtbWVsJywgJ0ludGVnZXInXSxcbiAgICAnQ0NEQlJJS0tFTEVOR0RFJzogWydjY2RCcmlra2VsZW5nZGUnLCAnSW50ZWdlciddLFxuICAgICdDQ0RCUklLS0VTSURFJzogWydjY2RCcmlra2VzaWRlJywgJ0ludGVnZXInXSxcbiAgICAnQklMREVPUFBMw5hTTklORyc6IFsnYmlsZGVvcHBsw7hzbmluZycsICdSZWFsJ10sXG4gICAgJ0JJTERFRklMRk9STUFUJzogWydiaWxkZWZpbGZvcm1hdCcsICdJbnRlZ2VyJ10sXG4gICAgJ1NUQVRMSUdOUic6IFsnc3RhdGxpZ251bW1lcicsICdJbnRlZ2VyJ10sXG4gICAgJ0FFUk9UUklBTkdVTEVSSU5HJzogWydhZXJvdHJpYW5ndWxlcmluZycsICdJbnRlZ2VyJ10sXG4gICAgJ1BST1NKRUtUUkFQUE9SVExJTksnOiBbJ3Byb3NqZWt0cmFwcG9ydGxpbmsnLCAnU3RyaW5nJ10sXG4gICAgJ0JJTERFRklMSVInOiBbJ2JpbGRlZmlsSXInLCAnU3RyaW5nJ10sXG4gICAgJ0JJTERFRklMUEFOJzogWydiaWxkZWZpbFBhbicsICdTdHJpbmcnXSxcbiAgICAnQklMREVGSUxSR0InOiBbJ2JpbGRlZmlsUkdCJywgJ1N0cmluZyddLFxuICAgICdCSUxERUZJTE1VTFRJJzogWydiaWxkZWZpbE11bHRpJywgJ1N0cmluZyddLFxuICAgICdPUlRPRk9UT1RZUEUnOiBbJ29ydG9mb3RvdHlwZScsICdJbnRlZ2VyJ10sXG4gICAgJ0tBTUVSQUzDmFBFTlVNTUVSJzogWydsw7hwZW51bW1lcicsICdJbnRlZ2VyJ10sXG4gICAgJ1BST0RVS1NKT05TUkFQUE9SVExJTksnOiBbJ3Byb2R1a3Nqb25zcmFwcG9ydGxpbmsnLCAnU3RyaW5nJ10sXG4gICAgJ1BST0RVS1RTUEVTSUZJS0FTSk9OU0xJTksnOiBbJ3Byb2R1a3RzcGVzaWZpa2Fzam9uc2xpbmsnLCAnU3RyaW5nJ10sXG4gICAgJ1NBS1PDhVInOiBbJ3Nha3PDpXInLCAnSW50ZWdlciddLFxuICAgICdTRUtWRU5TTlVNTUVSJzogWydzZWt2ZW5zbnVtbWVyJywgJ0ludGVnZXInXSxcbiAgICAnVVROVEFMTF9NSU4nOiBbJ3V0bnl0dGluZ3N0YWxsX21pbmltdW0nLCAnUmVhbCddLFxuICAgICdHWUxESUdUSUxEQVRPJzogWydneWxkaWdUaWxEYXRvJywgJ0RhdGUnXSxcbiAgICAnUElYRUxTVMOYUlJFTFNFJzogWydwaXhlbHN0w7hycmVsc2UnLCAnUmVhbCddLFxuICAgICdIRU5ERUxTRVNEQVRPJzogWydIZW5kZWxzZXNkYXRvJywgJ0RhdGUnXSxcbiAgICAnTlBQTEFOQkVTVEVNTUVMU0VUWVBFJzogWydwbGFuYmVzdGVtbWVsc2V0eXBlJywgJ0ludGVnZXInXSxcbiAgICAnTlBQTEFOVEVNQSc6IFsncGxhblRlbWEnLCAnSW50ZWdlciddLFxuICAgICdGQUdPTVLDhURFX0xJTksnOiBbJ2xpbmsgdGlsIGZhZ29tcsOlZGUnLCAnU3RyaW5nJ10sXG4gICAgJ1BST0RVS1RfTElOSyc6IFsncHJvZHVrdExpbmsnLCAnU3RyaW5nJ10sXG5cbiAgICAnQURSRVNTRUJSVUtTRU5IRVQnOiBbJ2FkcmVzc2VCcnVrc2VuaGV0JywgQXJyYXkoMyldLFxuICAgICdBRFJFU1NFS09NTUVOVEFSJzogWydhZHJlc3NlS29tbWVudGFyJywgQXJyYXkoNSldLFxuICAgICdBRFJFU1NFUkVGRVJBTlNFJzogWydhZHJlc3NlUmVmZXJhbnNlJywgQXJyYXkoMildLFxuICAgICdBRFJFU1NFVElMTEVHRyc6IFsnYWRyZXNzZVRpbGxlZ2cnLCBBcnJheSgzKV0sXG4gICAgJ0FJRCc6IFsnZ2F0ZWFkcmVzc2VJZCcsIEFycmF5KDMpXSxcbiAgICAnQUpPVVJGw5hSSU5HJzogWydham91cmbDuHJpbmcnLCBBcnJheSgyKV0sXG4gICAgJ0FLVkFfS09OU19JTkZPJzogWydha3ZhS29uc2Vzam9uc2luZm9ybWFzam9uJywgQXJyYXkoNyldLFxuICAgICdBS1ZBX1BSw5hWRV9JTkZPJzogWydha3ZhUHLDuHZldGFraW5mb3JtYXNqb24nLCBBcnJheSg5KV0sXG4gICAgJ0FOREVMJzogWydhbmRlbCcsIEFycmF5KDIpXSxcbiAgICAnQVJFQUxGT1JERUxJTkcnOiBbJ2FyZWFsZm9yZGVsaW5nJywgQXJyYXkoNSldLFxuICAgICdCRUxBU1ROSU5HQk9GNSc6IFsnYmVsYXN0bmluZ0JPRjUnLCBBcnJheSg0KV0sXG4gICAgJ0JFTEFTVE5JTkdGT1NGT1InOiBbJ2JlbGFzdG5pbmdGb3Nmb3InLCBBcnJheSg0KV0sXG4gICAgJ0JFUkVHTkVUQVJFQUwnOiBbJ2JlcmVnbmV0QXJlYWwnLCBBcnJheSgyKV0sXG4gICAgJ0JJTERFSU5GT1JNQVNKT04nOiBbJ2JpbGRlaW5mb3JtYXNqb24nLCBBcnJheSgzKV0sXG4gICAgJ0JNQVJUT0JTJzogWydibUFydHNvYnNlcnZhc2pvbicsIEFycmF5KDQpXSxcbiAgICAnQk1BUlRSRUcnOiBbJ2JtQXJ0c3JlZ2lzdHJlcmluZycsIEFycmF5KDgpXSxcbiAgICAnQk1LSUxERSc6IFsnYm1LaWxkZScsIEFycmF5KDIpXSxcbiAgICAnQk1OQVRZUFRJTExFR0cnOiBbJ2JtTmF0dXJ0eXBlVGlsbGVnZycsIEFycmF5KDIpXSxcbiAgICAnQlJVS1NFTkhFVCc6IFsnYnJ1a3NlbmhldCcsIEFycmF5KDEwKV0sXG4gICAgJ0JZREVMSUQnOiBbJ2J5ZGVsSWQnLCBBcnJheSgyKV0sXG4gICAgJ0JZR0dfS09NTUVOVEFSRVInOiBbJ2J5Z25pbmdLb21tZW50YXInLCBBcnJheSg1KV0sXG4gICAgJ0JZR05fU1RBVF9ISVNUJzogWydieWduaW5nc3N0YXR1c0hpc3RvcmlraycsIEFycmF5KDMpXSxcbiAgICAnQllHTklOR19USUxMRUdHJzogWydieWduaW5nVGlsbGVnZycsIEFycmF5KDE1KV0sXG4gICAgJ0JZR05JTkdTUkVGJzogWydieWduaW5nc3JlZmVyYW5zZScsIEFycmF5KDIpXSxcbiAgICAnREVMT01Sw6VERUlEJzogWydkZWxvbXLDpWRlSWQnLCBBcnJheSgyKV0sXG4gICAgJ0RQT1RfR1JBUyc6IFsnZHlya2luZ3BvdGVuc2phbEdyYXMnLCBBcnJheSg0KV0sXG4gICAgJ0RQT1RfS09STic6IFsnZHlya2luZ3BvdGVuc2phbEtvcm4nLCBBcnJheSg0KV0sXG4gICAgJ0RQT1RfUE9URVQnOiBbJ2R5cmtpbmdwb3RlbnNqYWxQb3RldCcsIEFycmF5KDQpXSxcbiAgICAnRUtPT1JEJzogWydqb3JkcmVnaXN0ZXJFaWVuZG9tc3RlaWdrb29yZGluYXQnLCBBcnJheSgzKV0sXG4gICAgJ0VORFJJTkdTRkxBR0cnOiBbJ2VuZHJpbmdzZmxhZ2cnLCBBcnJheSgyKV0sXG4gICAgJ0VORFJJTkdTVlVSREVSSU5HJzogWydlbmRyaW5nc3Z1cmRlcmluZycsIEFycmF5KDIpXSxcbiAgICAnRVRBU0pFJzogWydldGFzamUnLCBBcnJheSg4KV0sXG4gICAgJ0VUQVNKRURBVEEnOiBbJ2V0YXNqZWRhdGEnLCBBcnJheSg2KV0sXG4gICAgJ0ZFTFRSRUdJU1RSRVJUJzogWydmZWx0cmVnaXN0cmVydCcsIEFycmF5KDMpXSxcbiAgICAnRklSTUFfRUlFUic6IFsnZmlybWFlaWVyJywgQXJyYXkoNyldLFxuICAgICdGSVNLRV9CRURSX0lEJzogWydmaXNrZWJlZHJpZnRzaWRlbnRpZmlrYXNqb24nLCBBcnJheSg2KV0sXG4gICAgJ0ZJU0tFX0JFRFJfSU5GTyc6IFsnZmlza2ViZWRyaWZ0c2luZm9ybWFzam9uJywgQXJyYXkoMildLFxuICAgICdGSVNLRV9CRURSX01BUktFRCc6IFsnZmlza2ViZWRyaWZ0c21hcmtlZCcsIEFycmF5KDIpXSxcbiAgICAnRklTS0VfQkVEUl9USkVORVNURSc6IFsnZmlza2ViZWRyaWZ0c3RqZW5lc3RlJywgQXJyYXkoMyldLFxuICAgICdGSVNLRVJJX1JFRFNLQVAnOiBbJ2Zpc2tlcmlyZWRza2FwJywgQXJyYXkoNCldLFxuICAgICdGSVNLRVJJX1JFU1NfQVJUJzogWydmaXNrZXJpcmVzc3Vyc29tcsODYWRlQXJ0JywgQXJyYXkoNildLFxuICAgICdGSVNLRVJJX1JFU1NVUlMnOiBbJ2Zpc2tlcmlyZXNzdXJzJywgQXJyYXkoMildLFxuICAgICdGTURBVE8nOiBbJ2Zhc3RtZXJrZURhdG8nLCBBcnJheSgyKV0sXG4gICAgJ0ZNSUROWSc6IFsnZmFzdG1lcmtlSWROeScsIEFycmF5KDQpXSxcbiAgICAnRk1TSUdOJzogWydmYXN0bWVya2VTaWduYWwnLCBBcnJheSgyKV0sXG4gICAgJ0ZNU1RBVFVTJzogWydmYXN0bWVya2VTdGF0dXMnLCBBcnJheSgyKV0sXG4gICAgJ0ZNVFlQRSc6IFsnZmFzdG1lcmtlVHlwZScsIEFycmF5KDUpXSxcbiAgICAnRk9SVVJfR1JVTk5fRUlFTkRPTSc6IFsnZm9ydXJlbnNldEdydW5uRWllbmRvbScsIEFycmF5KDIpXSxcbiAgICAnR1JFTlNFX01FTExPTSc6IFsnZ3JlbnNlTWVsbG9tTmFzam9uZXJTasODJywgQXJyYXkoMildLFxuICAgICdHUlVOTktSRVRTSUQnOiBbJ2dydW5ua3JldHNJZCcsIEFycmF5KDIpXSxcbiAgICAnSEFWTkVfRF9JTkZPJzogWydoYXZuZWRpc3RyaWt0SW5mb3JtYXNqb24nLCBBcnJheSgyKV0sXG4gICAgJ0hPVkVETcOlTFJVQlJJS0snOiBbJ2hvdmVkbcOlbFJ1YnJpa2snLCBBcnJheSgyKV0sXG4gICAgJ0hPVkVETlInOiBbJ2xhbmRicnVrc3JlZ0hvdmVkTlInLCBBcnJheSgxKV0sXG4gICAgJ0hZVFRFSU5GT1JNQVNKT04nOiBbJ2h5dHRlaW5mb3JtYXNqb24nLCBBcnJheSgzKV0sXG4gICAgJ0pPUkRUWVBFJzogWydqb3JkdHlwZScsIEFycmF5KDYpXSxcbiAgICAnSlJFR01BUksnOiBbJ2pvcmRyZWdpc3Rlck1hcmtzbGFnJywgQXJyYXkoMTApXSxcbiAgICAnSlJFR1RFSUcnOiBbJ2pvcmRyZWdpc3RlckVpZW5kb21zdGVpZycsIEFycmF5KDQpXSxcbiAgICAnS0FJX0lORk8nOiBbJ2thaUluZm9ybWFzam9uJywgQXJyYXkoMyldLFxuICAgICdLQU1FUkFJTkZPUk1BU0pPTic6IFsna2FtZXJhaW5mb3JtYXNqb24nLCBBcnJheSg5KV0sXG4gICAgJ0tNX0RBVF9JTkZPJzogWydrdWx0dXJtaW5uZURhdGVyaW5nSW5mbycsIEFycmF5KDIpXSxcbiAgICAnS01fREFURVJJTkcnOiBbJ2t1bHR1cm1pbm5lRGF0ZXJpbmdHcnVwcGUnLCBBcnJheSgyKV0sXG4gICAgJ0tPTU1VTkFMS1JFVFMnOiBbJ2tvbW11bmFsS3JldHMnLCBBcnJheSg0KV0sXG4gICAgJ0tPUElEQVRBJzogWydrb3BpZGF0YScsIEFycmF5KDMpXSxcbiAgICAnS09QTElORyc6IFsna29wbGluZ3NlZ2Vuc2thcGVyJywgQXJyYXkoOCldLFxuICAgICdLVVJTTElOSkVfSU5GTyc6IFsna3Vyc2xpbmplaW5mb3JtYXNqb24nLCBBcnJheSg0KV0sXG4gICAgJ0tWQUxJVEVUJzogWydrdmFsaXRldCcsIEFycmF5KDYpXSxcbiAgICAnTEVETklORyc6IFsnbGVkbmluZ3NlZ2Vuc2thcGVyJywgQXJyYXkoOCldLFxuICAgICdMRUdHRcOlUic6IFsnbGVnZ2XDhXInLCBBcnJheSgyKV0sXG4gICAgJ0xHSUQnOiBbJ2xhbmRicnVrc3JlZ0dydW5uZWllbmRvbU5yJywgQXJyYXkoOCldLFxuICAgICdNQVRSSUtLRUxBRFJFU1NFSUQnOiBbJ21hdHJpa2tlbGFkcmVzc2VJZCcsIEFycmF5KDIpXSxcbiAgICAnTUFUUklLS0VMTlVNTUVSJzogWydtYXRyaWtrZWxudW1tZXInLCBBcnJheSg1KV0sXG4gICAgJ09WRVJMQVBQJzogWydvdmVybGFwcCcsIEFycmF5KDIpXSxcbiAgICAnUE9TVCc6IFsncG9zdGFkbWluaXN0cmF0aXZlT21yw6VkZXInLCBBcnJheSgyKV0sXG4gICAgJ1JFR0lTVFJFUklOR1NWRVJTSk9OJzogWydyZWdpc3RyZXJpbmdzdmVyc2pvbicsIEFycmF5KDIpXSxcbiAgICAnUkVTSVBJRU5UJzogWydyZXNpcGllbnQnLCBBcnJheSg1KV0sXG4gICAgJ1JFVE5JTkcnOiBbJ3JldG5pbmdzdmVrdG9yJywgQXJyYXkoMyldLFxuICAgICdSw5hSX0RJTUVOU0pPTic6IFsnbGVkbmluZ3NkaW1lbnNqb24nLCBBcnJheSgyKV0sXG4gICAgJ1NBSyc6IFsnc2Frc2luZm9ybWFzam9uJywgQXJyYXkoNCldLFxuICAgICdTRUZSQUtfSUQnOiBbJ3NlZnJha0lkJywgQXJyYXkoMyldLFxuICAgICdTRUZSQUtGVU5LU0pPTic6IFsnc2VmcmFrRnVua3Nqb24nLCBBcnJheSgyKV0sXG4gICAgJ1NFTlRSVU1TU09ORUlEJzogWydzZW50cnVtc3NvbmVJZCcsIEFycmF5KDIpXSxcbiAgICAnU0VSVic6IFsnc2Vydml0dXR0Z3J1cHBlJywgQXJyYXkoMyldLFxuICAgICdTS1JFVFNJRCc6IFsnc2tvbGVrcmV0c0lEJywgQXJyYXkoMildLFxuICAgICdTUF9BRE0nOiBbJ3Nrb2dicnBsYW5BZG1EYXRhR3J1cHBlJywgQXJyYXkoMildLFxuICAgICdTUF9BS0xBU1MnOiBbJ3Nrb2dicnBsYW5LbGFzc0dydXBwZScsIEFycmF5KDYpXSxcbiAgICAnU1BfQkVTVEFORCc6IFsnc2tvZ2JycGxhbkJlc3RhbmRHcnVwcGUnLCBBcnJheSgyKV0sXG4gICAgJ1NQX0JTS1JJVic6IFsnc2tvZ2JycGxhbkJlc2tyaXZCZXN0YW5kR3J1cHBlJywgQXJyYXkoMTMpXSxcbiAgICAnU1BfRkxCUkVMRU0nOiBbJ3Nrb2dicnBsYW5GbGVyS29kZXJHcnVwcGUnLCBBcnJheSg1KV0sXG4gICAgJ1NQX0dSTFZPTCc6IFsnc2tvZ2JycGxhbkdydW5ubGFnVm9sQmVyJywgQXJyYXkoOCldLFxuICAgICdTUF9URUlHJzogWydza29nYnJwbGFuVGVpZ0dydXBwZScsIEFycmF5KDQpXSxcbiAgICAnU1BfVEVSS0xBU1MnOiBbJ3Nrb2dicnBsYW5UZXJyZW5nR3J1cHBlJywgQXJyYXkoNSldLFxuICAgICdTUF9URVRUSE9ZRCc6IFsnc2tvZ2JycGxhblRldHRoZXRHcnVwcGUnLCBBcnJheSgyKV0sXG4gICAgJ1NQX1RJTFRBSyc6IFsnc2tvZ2JycGxhblRpbHRha0dydXBwZScsIEFycmF5KDUpXSxcbiAgICAnU1BfVElMVlZPTCc6IFsnc2tvZ2JycGxhblRpbHZla3N0R3J1cHBlJywgQXJyYXkoNCldLFxuICAgICdTUF9UUkVTTCc6IFsnc2tvZ2JycGxhblRyZXNsYWdHcnVwcGUnLCBBcnJheSg4KV0sXG4gICAgJ1RFVFRTVEVESUQnOiBbJ3RldHRzdGVkSWQnLCBBcnJheSgyKV0sXG4gICAgJ1VOSVZFUlNFTExVVEZPUk1JTkcnOiBbJ3VuaXZlcnNlbGxVdGZvcm1pbmcnLCBBcnJheSgzKV0sXG4gICAgJ1VUTllUVCc6IFsndXRueXR0aW5nJywgQXJyYXkoMildLFxuICAgICdVVFNMSVBQJzogWyd1dHNsaXBwJywgbmV3IEFycmF5KDMpXSxcbiAgICAnVVRWX1RJTExfUEFSVCc6IFsndXR2aW5uaW5nc3RpbGxhdGVsc2VzcGFydG5lcicsIEFycmF5KDIpXSxcbiAgICAnVkVSTic6IFsndmVybicsIEFycmF5KDQpXSxcbiAgICAnVktSRVRTJzogWyd2YWxna3JldHNJZCcsIEFycmF5KDIpXSxcbiAgICAnVk5SJzogWyd2ZWdpZGVudCcsIEFycmF5KDMpXSxcbiAgICAnVlBBJzogWyd2ZWdwYXJzZWxsJywgQXJyYXkoMyldXG59O1xuXG5zb3NpdHlwZXNbJ0FEUkVTU0VCUlVLU0VOSEVUJ11bMV1bMV0gPSBbJ2V0YXNqZW51bW1lcicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0FEUkVTU0VCUlVLU0VOSEVUJ11bMV1bMl0gPSBbJ2V0YXNqZXBsYW4nLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0FEUkVTU0VCUlVLU0VOSEVUJ11bMV1bMF0gPSBbJ2JydWtzZW5oZXRMw7hwZW5yJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snQURSRVNTRUtPTU1FTlRBUiddWzFdWzBdID0gWydldGF0JywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydBRFJFU1NFS09NTUVOVEFSJ11bMV1bMl0gPSBbJ2tvbW1lbnRhcicsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snQURSRVNTRUtPTU1FTlRBUiddWzFdWzFdID0gWydrb21tZW50YXJUeXBlJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydBRFJFU1NFS09NTUVOVEFSJ11bMV1bNF0gPSBbJ2xhZ3JldERhdG8nLCAnRGF0ZSddO1xuc29zaXR5cGVzWydBRFJFU1NFS09NTUVOVEFSJ11bMV1bM10gPSBbJ3Nha3NudW1tZXInLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydBRFJFU1NFUkVGRVJBTlNFJ11bMV1bMV0gPSBbJ2FkcmVzc2VSZWZlcmFuc2Vrb2RlJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydBRFJFU1NFUkVGRVJBTlNFJ11bMV1bMF0gPSBbJ3JlZmVyYW5zZScsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snQURSRVNTRVRJTExFR0cnXVsxXVsxXSA9IFsnYWRyZXNzZUtvbW1lbnRhcicsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snQURSRVNTRVRJTExFR0cnXVsxXVsyXSA9IFsnYWRyZXNzZVJlZmVyYW5zZScsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snQURSRVNTRVRJTExFR0cnXVsxXVswXSA9IFsna2FydGJsYWRpbmRla3MnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0FJRCddWzFdWzJdID0gWydib2tzdGF2JywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydBSUQnXVsxXVswXSA9IFsnZ2F0ZW51bW1lcicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0FJRCddWzFdWzFdID0gWydodXNudW1tZXInLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydBSk9VUkbDmFJJTkcnXVsxXVsxXSA9IFsnYWpvdXJmw7hydEF2JywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydBSk9VUkbDmFJJTkcnXVsxXVswXSA9IFsnYWpvdXJmw7hydERhdG8nLCAnRGF0ZSddO1xuc29zaXR5cGVzWydBS1ZBX0tPTlNfSU5GTyddWzFdWzFdID0gWydha3ZhS29uc2Vzam9uc251bW1lcicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0FLVkFfS09OU19JTkZPJ11bMV1bNF0gPSBbJ2tvbnNlc2pvbnNzdGF0dXMnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0FLVkFfS09OU19JTkZPJ11bMV1bNl0gPSBbJ2tvbnNlc2pvbnN0eXBlJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydBS1ZBX0tPTlNfSU5GTyddWzFdWzVdID0gWydrb25zZXNqb25zZm9ybcOlbCcsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snQUtWQV9LT05TX0lORk8nXVsxXVswXSA9IFsnZmlza2VicnVrc251bW1lckZ5bGtlJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydBS1ZBX0tPTlNfSU5GTyddWzFdWzJdID0gWydsb2thbGl0ZXRzbmF2bicsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snQUtWQV9LT05TX0lORk8nXVsxXVszXSA9IFsnbG9rYWxpdGV0c251bW1lcicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0FLVkFfUFLDmFZFX0lORk8nXVsxXVs3XSA9IFsnYWt2YVRlbXBlcmF0dXInLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydBS1ZBX1BSw5hWRV9JTkZPJ11bMV1bMV0gPSBbJ2FsZ2Vrb25zZW50cmFzam9uJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snQUtWQV9QUsOYVkVfSU5GTyddWzFdWzBdID0gWydhbGdldHlwZScsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snQUtWQV9QUsOYVkVfSU5GTyddWzFdWzVdID0gWydrbG9yb2Z5bGxNYWtzaW11bScsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0FLVkFfUFLDmFZFX0lORk8nXVsxXVs4XSA9IFsnc2FsaW5pdGV0JywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snQUtWQV9QUsOYVkVfSU5GTyddWzFdWzZdID0gWydzaWt0ZUR5cCcsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0FLVkFfUFLDmFZFX0lORk8nXVsxXVsyXSA9IFsnc3Ryw7htcmV0bmluZycsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0FLVkFfUFLDmFZFX0lORk8nXVsxXVs0XSA9IFsndmluZHJldG5pbmcnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydBTkRFTCddWzFdWzFdID0gWyduZXZuZXInLCAnUmVhbCddO1xuc29zaXR5cGVzWydBTkRFTCddWzFdWzBdID0gWyd0ZWxsZXInLCAnUmVhbCddO1xuc29zaXR5cGVzWydBUkVBTEZPUkRFTElORyddWzFdWzRdID0gWydwcm9zZW50RWx2JywgJ1JlYWwnXTtcbnNvc2l0eXBlc1snQVJFQUxGT1JERUxJTkcnXVsxXVsyXSA9IFsncHJvc2VudEhhdicsICdSZWFsJ107XG5zb3NpdHlwZXNbJ0FSRUFMRk9SREVMSU5HJ11bMV1bM10gPSBbJ3Byb3NlbnRJbm5zasO4JywgJ1JlYWwnXTtcbnNvc2l0eXBlc1snQVJFQUxGT1JERUxJTkcnXVsxXVsxXSA9IFsncHJvc2VudExhbmQnLCAnUmVhbCddO1xuc29zaXR5cGVzWydBUkVBTEZPUkRFTElORyddWzFdWzBdID0gWyd0b3RhbGFyZWFsS20yJywgJ1JlYWwnXTtcbnNvc2l0eXBlc1snQkVMQVNUTklOR0JPRjUnXVsxXVsyXSA9IFsnYW5kcmVraWxkZXJCZWxhc3RuaW5nJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snQkVMQVNUTklOR0JPRjUnXVsxXVswXSA9IFsnaHVzaG9sZEJlbGFzdG5pbmcnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydCRUxBU1ROSU5HQk9GNSddWzFdWzFdID0gWydpbmR1c3RyaUJlbGFzdG5pbmcnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydCRUxBU1ROSU5HQk9GNSddWzFdWzNdID0gWyd0b3RhbGJlbGFzdG5pbmcnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydCRUxBU1ROSU5HRk9TRk9SJ11bMV1bMl0gPSBbJ2FuZHJla2lsZGVyQmVsYXN0bmluZycsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0JFTEFTVE5JTkdGT1NGT1InXVsxXVswXSA9IFsnaHVzaG9sZEJlbGFzdG5pbmcnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydCRUxBU1ROSU5HRk9TRk9SJ11bMV1bMV0gPSBbJ2luZHVzdHJpQmVsYXN0bmluZycsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0JFTEFTVE5JTkdGT1NGT1InXVsxXVszXSA9IFsndG90YWxiZWxhc3RuaW5nJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snQkVSRUdORVRBUkVBTCddWzFdWzBdID0gWydhcmVhbCcsICdSZWFsJ107XG5zb3NpdHlwZXNbJ0JFUkVHTkVUQVJFQUwnXVsxXVsxXSA9IFsnYXJlYWxtZXJrbmFkJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydCSUxERUlORk9STUFTSk9OJ11bMV1bMV0gPSBbJ2JyZW5udmlkZGUnLCAnUmVhbCddO1xuc29zaXR5cGVzWydCSUxERUlORk9STUFTSk9OJ11bMV1bMl0gPSBbJ2ZvdG9ncmFmJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydCSUxERUlORk9STUFTSk9OJ11bMV1bMF0gPSBbJ2thbWVyYXR5cGUnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0JNQVJUT0JTJ11bMV1bMV0gPSBbJ2JtQW50YWxsJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snQk1BUlRPQlMnXVsxXVswXSA9IFsnYm1BcnQnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0JNQVJUT0JTJ11bMV1bMl0gPSBbJ2JtRW5oZXQnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydCTUFSVE9CUyddWzFdWzNdID0gWydibVJlZ2lzdHJlcmluZ3NkYXRvJywgJ0RhdGUnXTtcbnNvc2l0eXBlc1snQk1BUlRSRUcnXVsxXVs2XSA9IFsnYm3DhXJzdGlkJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snQk1BUlRSRUcnXVsxXVswXSA9IFsnYm1BcnQnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0JNQVJUUkVHJ11bMV1bMl0gPSBbJ2JtT21yw6VkZWZ1bmtzam9uJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snQk1BUlRSRUcnXVsxXVs1XSA9IFsnYm1GdW5rc2pvbnNrdmFsaXRldCcsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0JNQVJUUkVHJ11bMV1bN10gPSBbJ2JtS2lsZGUnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0JNQVJUUkVHJ11bMV1bMV0gPSBbJ2JtUmVnaXN0cmVyaW5nc2RhdG8nLCAnRGF0ZSddO1xuc29zaXR5cGVzWydCTUFSVFJFRyddWzFdWzNdID0gWydibVRydWV0aGV0c2thdGVnb3JpJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydCTUFSVFJFRyddWzFdWzRdID0gWydibVZpbHR2ZWt0JywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snQk1LSUxERSddWzFdWzFdID0gWydibUtpbGRldHlwZScsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0JNS0lMREUnXVsxXVswXSA9IFsnYm1LaWxkZXZ1cmRlcmluZycsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0JNTkFUWVBUSUxMRUdHJ11bMV1bMV0gPSBbJ2JtQW5kZWwnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydCTU5BVFlQVElMTEVHRyddWzFdWzBdID0gWydibU5hdHVydHlwZScsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snQlJVS1NFTkhFVCddWzFdWzddID0gWydhbnRhbGxCYWQnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydCUlVLU0VOSEVUJ11bMV1bNl0gPSBbJ2FudGFsbFJvbScsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0JSVUtTRU5IRVQnXVsxXVs4XSA9IFsnYW50YWxsV0MnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydCUlVLU0VOSEVUJ11bMV1bNV0gPSBbJ2JydWtzYXJlYWwnLCAnUmVhbCddO1xuc29zaXR5cGVzWydCUlVLU0VOSEVUJ11bMV1bNF0gPSBbJ2JydWtzZW5oZXRzdHlwZScsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snQlJVS1NFTkhFVCddWzFdWzJdID0gWydldGFzamVudW1tZXInLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydCUlVLU0VOSEVUJ11bMV1bMV0gPSBbJ2V0YXNqZXBsYW4nLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0JSVUtTRU5IRVQnXVsxXVs5XSA9IFsna2rDuGtrZW5UaWxnYW5nJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snQlJVS1NFTkhFVCddWzFdWzNdID0gWydicnVrc2VuaGV0TMO4cGVucicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0JSVUtTRU5IRVQnXVsxXVswXSA9IFsnbWF0cmlra2VsbnVtbWVyJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydCWURFTElEJ11bMV1bMF0gPSBbJ2J5ZGVsc25hdm4nLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0JZREVMSUQnXVsxXVsxXSA9IFsnYnlkZWxzbnVtbWVyJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snQllHR19LT01NRU5UQVJFUiddWzFdWzNdID0gWydieWduU2Frc25yJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydCWUdHX0tPTU1FTlRBUkVSJ11bMV1bMF0gPSBbJ2V0YXQnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0JZR0dfS09NTUVOVEFSRVInXVsxXVsyXSA9IFsna29tbWVudGFyJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydCWUdHX0tPTU1FTlRBUkVSJ11bMV1bMV0gPSBbJ2tvbW1lbnRhclR5cGUnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0JZR0dfS09NTUVOVEFSRVInXVsxXVs0XSA9IFsnbGFncmV0RGF0bycsICdEYXRlJ107XG5zb3NpdHlwZXNbJ0JZR05fU1RBVF9ISVNUJ11bMV1bMF0gPSBbJ2J5Z25pbmdzc3RhdHVzJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydCWUdOX1NUQVRfSElTVCddWzFdWzFdID0gWydieWduaW5nc2hpc3Rvcmlra0RhdG8nLCAnRGF0ZSddO1xuc29zaXR5cGVzWydCWUdOX1NUQVRfSElTVCddWzFdWzJdID0gWydyZWdpc3RyZXJ0RGF0bycsICdEYXRlJ107XG5zb3NpdHlwZXNbJ0JZR05JTkdfVElMTEVHRyddWzFdWzBdID0gWydhbHRlcm5hdGl2dEFyZWFsQnlnbmluZycsICdSZWFsJ107XG5zb3NpdHlwZXNbJ0JZR05JTkdfVElMTEVHRyddWzFdWzFdID0gWydhbnRhbGxFdGFzamVyJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snQllHTklOR19USUxMRUdHJ11bMV1bMl0gPSBbJ2FudGFsbFLDuGtsw7hwJywgJ1JlYWwnXTtcbnNvc2l0eXBlc1snQllHTklOR19USUxMRUdHJ11bMV1bM10gPSBbJ2JyZW5zZWx0YW5rTmVkZ3JhdmQnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydCWUdOSU5HX1RJTExFR0cnXVsxXVsxNF0gPSBbJ2J5Z25pbmdLb21tZW50YXInLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0JZR05JTkdfVElMTEVHRyddWzFdWzEzXSA9IFsnYnlnbmluZ3NyZWZlcmFuc2UnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0JZR05JTkdfVElMTEVHRyddWzFdWzldID0gWydmdW5kYW1lbnRlcmluZycsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0JZR05JTkdfVElMTEVHRyddWzFdWzEyXSA9IFsnaG9yaXNvbnRhbELDpnJla29uc3RyJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snQllHTklOR19USUxMRUdHJ11bMV1bNV0gPSBbJ2thcnRibGFkaW5kZWtzJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydCWUdOSU5HX1RJTExFR0cnXVsxXVs2XSA9IFsna2lsZGVQcml2YXRWYW5uZm9yc3luaW5nJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snQllHTklOR19USUxMRUdHJ11bMV1bMTBdID0gWydtYXRlcmlhbGVJWXR0ZXJ2ZWdnJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snQllHTklOR19USUxMRUdHJ11bMV1bN10gPSBbJ3ByaXZhdEtsb2Fra1JlbnNpbmcnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydCWUdOSU5HX1RJTExFR0cnXVsxXVs4XSA9IFsncmVub3Zhc2pvbicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0JZR05JTkdfVElMTEVHRyddWzFdWzRdID0gWydzZXB0aWt0YW5rJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydCWUdOSU5HX1RJTExFR0cnXVsxXVsxMV0gPSBbJ3ZlcnRpa2FsQsOmcmVrb25zdHInLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydCWUdOSU5HU1JFRiddWzFdWzFdID0gWydieWduaW5nUmVmZXJhbnNldHlwZScsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snQllHTklOR1NSRUYnXVsxXVswXSA9IFsncmVmZXJhbnNlJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydERUxPTVLDpURFSUQnXVsxXVswXSA9IFsnZGVsb21yw6VkZW5hdm4nLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0RFTE9NUsOlREVJRCddWzFdWzFdID0gWydkZWxvbXLDpWRlbnVtbWVyJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydEUE9UX0dSQVMnXVsxXVsyXSA9IFsnbmVkYsO4cnNiYXNlcnQnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydEUE9UX0dSQVMnXVsxXVszXSA9IFsnbmVka2xhc3NpZmlzZXJpbmdOZWRiw7hyJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snRFBPVF9HUkFTJ11bMV1bMF0gPSBbJ3Zhbm5pbmdzYmFzZXJ0JywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snRFBPVF9HUkFTJ11bMV1bMV0gPSBbJ25lZGtsYXNzaWZpc2VyaW5nVmFubmluZycsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0RQT1RfS09STiddWzFdWzJdID0gWyduZWRiw7hyc2Jhc2VydCcsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0RQT1RfS09STiddWzFdWzNdID0gWyduZWRrbGFzc2lmaXNlcmluZ05lZGLDuHInLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydEUE9UX0tPUk4nXVsxXVswXSA9IFsndmFubmluZ3NiYXNlcnQnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydEUE9UX0tPUk4nXVsxXVsxXSA9IFsnbmVka2xhc3NpZmlzZXJpbmdWYW5uaW5nJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snRFBPVF9QT1RFVCddWzFdWzJdID0gWyduZWRiw7hyc2Jhc2VydCcsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0RQT1RfUE9URVQnXVsxXVszXSA9IFsnbmVka2xhc3NpZmlzZXJpbmdOZWRiw7hyJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snRFBPVF9QT1RFVCddWzFdWzBdID0gWyd2YW5uaW5nc2Jhc2VydCcsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0RQT1RfUE9URVQnXVsxXVsxXSA9IFsnbmVka2xhc3NpZmlzZXJpbmdWYW5uaW5nJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snRUtPT1JEJ11bMV1bMl0gPSBbJ2pvcmRyZWdpc3Rlcktvb3JkaW5hdEjDuHlkZScsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0VLT09SRCddWzFdWzBdID0gWydqb3JkcmVnaXN0ZXJLb29yZGluYXROb3JkJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snRUtPT1JEJ11bMV1bMV0gPSBbJ2pvcmRyZWdpc3Rlcktvb3JkaW5hdMOYc3QnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydFTkRSSU5HU0ZMQUdHJ11bMV1bMV0gPSBbJ3RpZHNwdW5rdEVuZHJpbmcnLCAnRGF0ZSddO1xuc29zaXR5cGVzWydFTkRSSU5HU0ZMQUdHJ11bMV1bMF0gPSBbJ3R5cGVFbmRyaW5nJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydFTkRSSU5HU1ZVUkRFUklORyddWzFdWzBdID0gWydlbmRyaW5nc2dyYWQnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0VORFJJTkdTVlVSREVSSU5HJ11bMV1bMV0gPSBbJ3Z1cmRlcnREYXRvJywgJ0RhdGUnXTtcbnNvc2l0eXBlc1snRVRBU0pFJ11bMV1bMl0gPSBbJ2FudGFsbEJvZW5oZXRlcicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0VUQVNKRSddWzFdWzRdID0gWydicnVrc2FyZWFsVGlsQW5uZXQnLCAnUmVhbCddO1xuc29zaXR5cGVzWydFVEFTSkUnXVsxXVszXSA9IFsnYnJ1a3NhcmVhbFRpbEJvbGlnJywgJ1JlYWwnXTtcbnNvc2l0eXBlc1snRVRBU0pFJ11bMV1bNV0gPSBbJ2JydWtzYXJlYWxUb3RhbHQnLCAnUmVhbCddO1xuc29zaXR5cGVzWydFVEFTSkUnXVsxXVsxXSA9IFsnZXRhc2plbnVtbWVyJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snRVRBU0pFJ11bMV1bMF0gPSBbJ2V0YXNqZXBsYW4nLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0VUQVNKRSddWzFdWzZdID0gWydrb21tQWx0ZXJuYXRpdnRBcmVhbCcsICdSZWFsJ107XG5zb3NpdHlwZXNbJ0VUQVNKRSddWzFdWzddID0gWydrb21tQWx0ZXJuYXRpdnRBcmVhbDInLCAnUmVhbCddO1xuc29zaXR5cGVzWydFVEFTSkVEQVRBJ11bMV1bNF0gPSBbJ3N1bUFsdGVybmF0aXZ0QXJlYWwnLCAnUmVhbCddO1xuc29zaXR5cGVzWydFVEFTSkVEQVRBJ11bMV1bNV0gPSBbJ3N1bUFsdGVybmF0aXZ0QXJlYWwyJywgJ1JlYWwnXTtcbnNvc2l0eXBlc1snRVRBU0pFREFUQSddWzFdWzBdID0gWydzdW1BbnRhbGxCb2VuaGV0ZXInLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydFVEFTSkVEQVRBJ11bMV1bM10gPSBbJ3N1bUJydWtzYXJlYWxUb3RhbHQnLCAnUmVhbCddO1xuc29zaXR5cGVzWydFVEFTSkVEQVRBJ11bMV1bMl0gPSBbJ3N1bUJydWtzYXJlYWxUaWxBbm5ldCcsICdSZWFsJ107XG5zb3NpdHlwZXNbJ0VUQVNKRURBVEEnXVsxXVsxXSA9IFsnc3VtQnJ1a3NhcmVhbFRpbEJvbGlnJywgJ1JlYWwnXTtcbnNvc2l0eXBlc1snRkVMVFJFR0lTVFJFUlQnXVsxXVsyXSA9IFsnYWpvdXJmw7hyaW5nJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydGRUxUUkVHSVNUUkVSVCddWzFdWzFdID0gWydkYXRhZmFuZ3N0ZGF0bycsICdEYXRlJ107XG5zb3NpdHlwZXNbJ0ZFTFRSRUdJU1RSRVJUJ11bMV1bMF0gPSBbJ2ZlbHRyZWdpc3RyZXJ0QXYnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0ZJUk1BX0VJRVInXVsxXVsyXSA9IFsnYWRyZXNzZScsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snRklSTUFfRUlFUiddWzFdWzBdID0gWydmaXJtYW5hdm4nLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0ZJUk1BX0VJRVInXVsxXVsxXSA9IFsnYmVkcmlmdHNlaWVyJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydGSVJNQV9FSUVSJ11bMV1bNl0gPSBbJ2tvbnRha3RwZXJzb24nLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0ZJUk1BX0VJRVInXVsxXVszXSA9IFsncG9zdG51bW1lcicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0ZJUk1BX0VJRVInXVsxXVs1XSA9IFsndGVsZWZheG51bW1lcicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0ZJUk1BX0VJRVInXVsxXVs0XSA9IFsndGVsZWZvbm51bW1lcicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0ZJU0tFX0JFRFJfSUQnXVsxXVs0XSA9IFsnYW50YWxsQW5zYXR0ZScsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0ZJU0tFX0JFRFJfSUQnXVsxXVs1XSA9IFsnYW50YWxsw4Vyc3ZlcmsnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydGSVNLRV9CRURSX0lEJ11bMV1bMF0gPSBbJ2Zpc2tlYmVkcmlmdHNuYXZuJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydGSVNLRV9CRURSX0lEJ11bMV1bMl0gPSBbJ2Zpc2tlYnJ1a3NudW1tZXInLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydGSVNLRV9CRURSX0lEJ11bMV1bMV0gPSBbJ2Zpc2tlYnJ1a3NudW1tZXJGeWxrZScsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snRklTS0VfQkVEUl9JRCddWzFdWzNdID0gWydmaXJtYWVpZXInLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0ZJU0tFX0JFRFJfSU5GTyddWzFdWzFdID0gWydhcnRza29kZScsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0ZJU0tFX0JFRFJfSU5GTyddWzFdWzBdID0gWydmaXNrZXR5cGUnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydGSVNLRV9CRURSX01BUktFRCddWzFdWzBdID0gWydmaXNrZWJlZHJpZnRzYW5kZWwnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydGSVNLRV9CRURSX01BUktFRCddWzFdWzFdID0gWydmaXNrZWJlZHJpZnRzb21yw6VkZScsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0ZJU0tFX0JFRFJfVEpFTkVTVEUnXVsxXVsyXSA9IFsnZmlza2ViZWRyaWZ0c2VydmljZScsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0ZJU0tFX0JFRFJfVEpFTkVTVEUnXVsxXVsxXSA9IFsnZmlza2VrYXBhc2l0ZXRFbmhldCcsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0ZJU0tFX0JFRFJfVEpFTkVTVEUnXVsxXVswXSA9IFsnZmlza2VrYXBhc2l0ZXQnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydGSVNLRVJJX1JFRFNLQVAnXVsxXVswXSA9IFsnZmlza2VyaXJlZHNrYXBHZW5Ba3RpdicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0ZJU0tFUklfUkVEU0tBUCddWzFdWzFdID0gWydmaXNrZXJpcmVkc2thcEdlblBhc3NpdicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0ZJU0tFUklfUkVEU0tBUCddWzFdWzJdID0gWydmaXNrZXJpcmVkc2thcFNwZXNBa3RpdicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0ZJU0tFUklfUkVEU0tBUCddWzFdWzNdID0gWydmaXNrZXJpcmVkc2thcFNwZXNQYXNzaXYnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydGSVNLRVJJX1JFU1NfQVJUJ11bMV1bM10gPSBbJ2VuZ2Vsc2tBcnRzbmF2bicsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snRklTS0VSSV9SRVNTX0FSVCddWzFdWzJdID0gWyd2aXRlbnNrYXBlbGlnQXJ0c25hdm4nLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0ZJU0tFUklfUkVTU19BUlQnXVsxXVsxXSA9IFsnbm9yc2tBcnRzbmF2bicsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snRklTS0VSSV9SRVNTX0FSVCddWzFdWzBdID0gWyd0YWtzb25vbWlza0tvZGUnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydGSVNLRVJJX1JFU1NfQVJUJ11bMV1bNF0gPSBbJ2Zhb0tvZGUnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0ZJU0tFUklfUkVTU19BUlQnXVsxXVs1XSA9IFsnYXJ0c2tvZGUnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydGSVNLRVJJX1JFU1NVUlMnXVsxXVswXSA9IFsnZmlza2VyaXJlc3N1cnNvbXLDpWRlQXJ0JywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydGSVNLRVJJX1JFU1NVUlMnXVsxXVsxXSA9IFsncGVyaW9kZScsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snRk1EQVRPJ11bMV1bMV0gPSBbJ2JlcmVnbmluZ3NEYXRvJywgJ0RhdGUnXTtcbnNvc2l0eXBlc1snRk1EQVRPJ11bMV1bMF0gPSBbJ2Zhc3RtZXJrZUV0YWJsZXJpbmdzZGF0bycsICdEYXRlJ107XG5zb3NpdHlwZXNbJ0ZNSUROWSddWzFdWzFdID0gWydmYXN0bWVya2VJbnN0aXR1c2pvbicsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snRk1JRE5ZJ11bMV1bMF0gPSBbJ2Zhc3RtZXJrZUtvbW11bmUnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydGTUlETlknXVsxXVsyXSA9IFsnZmFzdG1lcmtlTnVtbWVyJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydGTUlETlknXVsxXVszXSA9IFsnaW5kaWthdG9yRmFzdG1lcmtlbnVtbWVyJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydGTVNJR04nXVsxXVsxXSA9IFsnc2lnbmFsSMO4eWRlJywgJ1JlYWwnXTtcbnNvc2l0eXBlc1snRk1TSUdOJ11bMV1bMF0gPSBbJ3NpZ25hbFR5cGUnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0ZNU1RBVFVTJ11bMV1bMV0gPSBbJ3R5cGVTdGF0dXMnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydGTVNUQVRVUyddWzFdWzBdID0gWyd2ZXJpZmlzZXJpbmdzZGF0bycsICdEYXRlJ107XG5zb3NpdHlwZXNbJ0ZNVFlQRSddWzFdWzBdID0gWydib2x0VHlwZScsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0ZNVFlQRSddWzFdWzNdID0gWydmYXN0bWVya2VEaWFtZXRlcicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0ZNVFlQRSddWzFdWzRdID0gWydncmF2ZXJ0VGVrc3QnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0ZNVFlQRSddWzFdWzFdID0gWydtYXRlcmlhbGVCb2x0JywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snRk1UWVBFJ11bMV1bMl0gPSBbJ2Zhc3RtZXJrZVVuZGVybGFnJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snRk9SVVJfR1JVTk5fRUlFTkRPTSddWzFdWzFdID0gWydhcmVhbGJydWtSZXN0cmlrc2pvbicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0ZPUlVSX0dSVU5OX0VJRU5ET00nXVsxXVswXSA9IFsnbWF0cmlra2VsbnVtbWVyJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydHUkVOU0VfTUVMTE9NJ11bMV1bMF0gPSBbJ2bDuHJzdGVMYW5kJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydHUkVOU0VfTUVMTE9NJ11bMV1bMV0gPSBbJ2FubmV0TGFuZCcsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snR1JVTk5LUkVUU0lEJ11bMV1bMV0gPSBbJ2dydW5ua3JldHNuYXZuJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydHUlVOTktSRVRTSUQnXVsxXVswXSA9IFsnZ3J1bm5rcmV0c251bW1lcicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0hBVk5FX0RfSU5GTyddWzFdWzFdID0gWydoYXZuZWRpc3RyaWt0QWRtaW5pc3RyYXNqb24nLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydIQVZORV9EX0lORk8nXVsxXVswXSA9IFsna29tbXVuZScsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0hPVkVETcOlTFJVQlJJS0snXVsxXVsxXSA9IFsnYnJlZGRlJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snSE9WRURNw6VMUlVCUklLSyddWzFdWzBdID0gWydsZW5nZGUnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydIT1ZFRE5SJ11bMV1bMV0gPSBbJyBrb21tdW5lbnVtbWVyJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snSE9WRUROUiddWzFdWzBdID0gWydtYXRyaWtrZWxudW1tZXInLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0hZVFRFSU5GT1JNQVNKT04nXVsxXVsxXSA9IFsnYmV0amVuaW5nc2dyYWQnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0hZVFRFSU5GT1JNQVNKT04nXVsxXVswXSA9IFsnaHl0dGVJZCcsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0hZVFRFSU5GT1JNQVNKT04nXVsxXVsyXSA9IFsnaHl0dGVlaWVyJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snSk9SRFRZUEUnXVsxXVswXSA9IFsnc2VyaWUxJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydKT1JEVFlQRSddWzFdWzJdID0gWydzZXJpZTInLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0pPUkRUWVBFJ11bMV1bNF0gPSBbJ3NlcmllMycsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snSk9SRFRZUEUnXVsxXVsxXSA9IFsndGVrc3R1cjEnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0pPUkRUWVBFJ11bMV1bM10gPSBbJ3Rla3N0dXIyJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydKT1JEVFlQRSddWzFdWzVdID0gWyd0ZWtzdHVyMycsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snSlJFR01BUksnXVsxXVsxXSA9IFsncG90ZW5zaWVsbFNrb2dib25pdGV0T21rb2RldCcsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0pSRUdNQVJLJ11bMV1bMF0gPSBbJ2FyZWFsdGlsc3RhbmQnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydKUkVHTUFSSyddWzFdWzddID0gWydqb3JkcmVnaXN0ZXJEeXJraW5nc2pvcmQnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0pSRUdNQVJLJ11bMV1bNl0gPSBbJ2pvcmRyZWdpc3RlckZyZWcnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydKUkVHTUFSSyddWzFdWzVdID0gWydqb3JkcmVnaXN0ZXJMcmVnJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydKUkVHTUFSSyddWzFdWzNdID0gWydqb3Jka2xhc3NpZmlrYXNqb24nLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydKUkVHTUFSSyddWzFdWzRdID0gWydteXJrbGFzc2lmaWthc2pvbicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0pSRUdNQVJLJ11bMV1bOF0gPSBbJ2pvcmRyZWdpc3RlclNrb2d0eXBlJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snSlJFR01BUksnXVsxXVs5XSA9IFsnam9yZHJlZ2lzdGVyU2tvZ3JlaXNuaW5nc21hcmsnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydKUkVHTUFSSyddWzFdWzJdID0gWyd0aWxsZWdnc29wcGx5c25pbmdlclNrb2cnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydKUkVHVEVJRyddWzFdWzJdID0gWydqb3JkcmVnaXN0ZXJEcmlmdHNzZW50ZXInLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydKUkVHVEVJRyddWzFdWzNdID0gWydqb3JkcmVnaXN0ZXJTdGF0dXNFaWVuZG9tJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snSlJFR1RFSUcnXVsxXVswXSA9IFsnbWF0cmlra2VsbnVtbWVyJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydKUkVHVEVJRyddWzFdWzFdID0gWydqb3JkcmVnaXN0ZXJFaWVuZG9tVGVpZ051bW1lcicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0tBSV9JTkZPJ11bMV1bMV0gPSBbJ2thaUR5YmRlJywgJ1JlYWwnXTtcbnNvc2l0eXBlc1snS0FJX0lORk8nXVsxXVswXSA9IFsna2FpVHlwZScsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0tBSV9JTkZPJ11bMV1bMl0gPSBbJ2tvbW11bmVudW1tZXInLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydLQU1FUkFJTkZPUk1BU0pPTiddWzFdWzRdID0gWydiaWxkZWthdGVnb3JpJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snS0FNRVJBSU5GT1JNQVNKT04nXVsxXVszXSA9IFsnYnJlbm52aWRkZScsICdSZWFsJ107XG5zb3NpdHlwZXNbJ0tBTUVSQUlORk9STUFTSk9OJ11bMV1bN10gPSBbJ2ZpbG0nLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0tBTUVSQUlORk9STUFTSk9OJ11bMV1bOF0gPSBbJ2thbGlicmVyaW5nc3JhcHBvcnQnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0tBTUVSQUlORk9STUFTSk9OJ11bMV1bMV0gPSBbJ2thbWVyYXR5cGUnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0tBTUVSQUlORk9STUFTSk9OJ11bMV1bMF0gPSBbJ29wcHRha3NtZXRvZGUnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydLTV9EQVRfSU5GTyddWzFdWzBdID0gWydzZWZyYWtUaWx0YWsnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydLTV9EQVRfSU5GTyddWzFdWzFdID0gWyd0aWRzYW5naXZlbHNlJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snS01fREFURVJJTkcnXVsxXVswXSA9IFsna3VsdHVybWlubmVEYXRlcmluZycsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snS01fREFURVJJTkcnXVsxXVsxXSA9IFsna3VsdHVybWlubmVEYXRlcmluZ0t2YWxpdGV0JywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydLT01NVU5BTEtSRVRTJ11bMV1bM10gPSBbJ2tyZXRzbmF2bicsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snS09NTVVOQUxLUkVUUyddWzFdWzJdID0gWydrcmV0c251bW1lcicsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snS09NTVVOQUxLUkVUUyddWzFdWzBdID0gWydrcmV0c3R5cGVrb2RlJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydLT01NVU5BTEtSRVRTJ11bMV1bMV0gPSBbJ2tyZXRzdHlwZW5hdm4nLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0tPUElEQVRBJ11bMV1bMl0gPSBbJ2tvcGlkYXRvJywgJ0RhdGUnXTtcbnNvc2l0eXBlc1snS09QSURBVEEnXVsxXVswXSA9IFsnb21yw6VkZUlkJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snS09QSURBVEEnXVsxXVsxXSA9IFsnb3JpZ2luYWxEYXRhdmVydCcsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snS09QTElORyddWzFdWzFdID0gWydmYWdvbXLDpWRlJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snS09QTElORyddWzFdWzRdID0gWydicnVrc29tcsOlZGUnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0tPUExJTkcnXVsxXVsyXSA9IFsna29wbGluZ3NrYXRlZ29yaScsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0tPUExJTkcnXVsxXVswXSA9IFsna29wbGluZ3NuYXZuJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydLT1BMSU5HJ11bMV1bM10gPSBbJ2tvcGxpbmdzdHlwZScsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snS09QTElORyddWzFdWzddID0gWydiaWxkZWxpbmsnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0tPUExJTkcnXVsxXVs1XSA9IFsnbWF0ZXJpZWxsa29kZScsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snS09QTElORyddWzFdWzZdID0gWyd2ZXJkaScsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0tVUlNMSU5KRV9JTkZPJ11bMV1bMF0gPSBbJ2ZhcnTDuHlJZGVudGlmaWthc2pvbicsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snS1VSU0xJTkpFX0lORk8nXVsxXVsxXSA9IFsnc2F0ZWxsaXR0a29tbXVuaWthc2pvbnNJZCcsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snS1VSU0xJTkpFX0lORk8nXVsxXVszXSA9IFsnc3Bvcmhhc3RpZ2hldCcsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0tVUlNMSU5KRV9JTkZPJ11bMV1bMl0gPSBbJ3RpZHNwdW5rdCcsICdEYXRlJ107XG5zb3NpdHlwZXNbJ0tWQUxJVEVUJ11bMV1bM10gPSBbJ23DpWxlbWV0b2RlSMO4eWRlJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snS1ZBTElURVQnXVsxXVs0XSA9IFsnbsO4eWFrdGlnaGV0SMO4eWRlJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snS1ZBTElURVQnXVsxXVs1XSA9IFsnbWFrc2ltYWx0QXZ2aWsnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydLVkFMSVRFVCddWzFdWzBdID0gWydtw6VsZW1ldG9kZScsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0tWQUxJVEVUJ11bMV1bMV0gPSBbJ27DuHlha3RpZ2hldCcsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0tWQUxJVEVUJ11bMV1bMl0gPSBbJ3N5bmJhcmhldCcsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0xFRE5JTkcnXVsxXVsxXSA9IFsnZmFnb21yw6VkZScsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ0xFRE5JTkcnXVsxXVszXSA9IFsnYnJ1a3NvbXLDpWRlJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydMRUROSU5HJ11bMV1bMF0gPSBbJ2xlZG5pbmdzbmF2bicsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snTEVETklORyddWzFdWzJdID0gWydsZWRuaW5nc3R5cGUnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydMRUROSU5HJ11bMV1bN10gPSBbJ2xlZ2dlw6VyJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydMRUROSU5HJ11bMV1bNl0gPSBbJ2xlbmdkZScsICdSZWFsJ107XG5zb3NpdHlwZXNbJ0xFRE5JTkcnXVsxXVs1XSA9IFsnbWF0ZXJpZWxsa29kZScsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snTEVETklORyddWzFdWzRdID0gWyduZXR0bml2w6UnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ0xFR0dFw6VSJ11bMV1bMF0gPSBbJ2FsZGVyUmVmZXJhbnNlJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snTEVHR0XDpVInXVsxXVsxXSA9IFsnw6Vyc3RhbGwnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydMR0lEJ11bMV1bN10gPSBbJ2xhbmRicnVrc3JlZ0FrdGl2JywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snTEdJRCddWzFdWzZdID0gWydsYW5kYnJ1a3NyZWdUeXBlJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snTEdJRCddWzFdWzBdID0gWydtYXRyaWtrZWxudW1tZXInLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ01BVFJJS0tFTEFEUkVTU0VJRCddWzFdWzBdID0gWydtYXRyaWtrZWxudW1tZXInLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ01BVFJJS0tFTEFEUkVTU0VJRCddWzFdWzFdID0gWyd1bmRlcm5yJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snTUFUUklLS0VMTlVNTUVSJ11bMV1bMl0gPSBbJ2JydWtzbnVtbWVyJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snTUFUUklLS0VMTlVNTUVSJ11bMV1bM10gPSBbJ2Zlc3RlbnVtbWVyJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snTUFUUklLS0VMTlVNTUVSJ11bMV1bMV0gPSBbJ2fDpXJkc251bW1lcicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ01BVFJJS0tFTE5VTU1FUiddWzFdWzBdID0gWydtYXRyaWtrZWxrb21tdW5lJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snTUFUUklLS0VMTlVNTUVSJ11bMV1bNF0gPSBbJ3Nla3Nqb25zbnVtbWVyJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snT1ZFUkxBUFAnXVsxXVswXSA9IFsnbGVuZ2Rlb3ZlcmxhcHAnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydPVkVSTEFQUCddWzFdWzFdID0gWydzaWRlb3ZlcmxhcHAnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydQT1NUJ11bMV1bMV0gPSBbJ3Bvc3RzdGVkc25hdm4nLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ1BPU1QnXVsxXVswXSA9IFsncG9zdG51bW1lcicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1JFR0lTVFJFUklOR1NWRVJTSk9OJ11bMV1bMF0gPSBbJ3Byb2R1a3QnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ1JFR0lTVFJFUklOR1NWRVJTSk9OJ11bMV1bMV0gPSBbJ3ZlcnNqb24nLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ1JFU0lQSUVOVCddWzFdWzJdID0gWydmam9yZElkJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydSRVNJUElFTlQnXVsxXVswXSA9IFsncmVzaXBpZW50bmF2bicsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snUkVTSVBJRU5UJ11bMV1bNF0gPSBbJ3Jlc2lwaWVudHR5cGUnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ1JFU0lQSUVOVCddWzFdWzFdID0gWyd2YXNzZHJhZ3NudW1tZXInLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ1JFU0lQSUVOVCddWzFdWzNdID0gWyd2YXRuTMO4cGVudW1tZXInLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydSRVROSU5HJ11bMV1bMV0gPSBbJ3JldG5pbmdzZW5oZXQnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydSRVROSU5HJ11bMV1bMl0gPSBbJ3JldG5pbmdzcmVmZXJhbnNlJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snUkVUTklORyddWzFdWzBdID0gWydyZXRuaW5nc3ZlcmRpJywgJ1JlYWwnXTtcbnNvc2l0eXBlc1snUsOYUl9ESU1FTlNKT04nXVsxXVsxXSA9IFsnbGVuZ2RlZW5oZXQnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ1LDmFJfRElNRU5TSk9OJ11bMV1bMF0gPSBbJ23DpWx0YWxsJywgJ1JlYWwnXTtcbnNvc2l0eXBlc1snU0FLJ11bMV1bM10gPSBbJ3ZlZHRha3NteW5kaWdoZXQnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ1NBSyddWzFdWzBdID0gWydzYWtzbnVtbWVyJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snU0FLJ11bMV1bMl0gPSBbJ3V0dmFsZ3NzYWtzbnVtbWVyJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snU0FLJ11bMV1bMV0gPSBbJ3ZlZHRha3NkYXRvJywgJ0RhdGUnXTtcbnNvc2l0eXBlc1snU0VGUkFLX0lEJ11bMV1bMl0gPSBbJ2h1c0zDuHBlbnInLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydTRUZSQUtfSUQnXVsxXVsxXSA9IFsncmVnaXN0cmVyaW5nS3JldHNucicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1NFRlJBS19JRCddWzFdWzBdID0gWydTRUZSQUtrb21tdW5lJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snU0VGUkFLRlVOS1NKT04nXVsxXVswXSA9IFsnc2VmcmFrRnVua3Nqb25za29kZScsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1NFRlJBS0ZVTktTSk9OJ11bMV1bMV0gPSBbJ3NlZnJha0Z1bmtzam9uc3N0YXR1cycsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snU0VOVFJVTVNTT05FSUQnXVsxXVsxXSA9IFsnc2VudHJ1bXNzb25lbmF2bicsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snU0VOVFJVTVNTT05FSUQnXVsxXVswXSA9IFsnc2VudHJ1bXNzb25lbnVtbWVyJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snU0VSViddWzFdWzJdID0gWydpbmZvcm1hc2pvbicsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snU0VSViddWzFdWzBdID0gWydtYXRyaWtrZWxudW1tZXInLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ1NFUlYnXVsxXVsxXSA9IFsnc2Vydml0dXR0VHlwZScsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snU0tSRVRTSUQnXVsxXVsxXSA9IFsnc2tvbGVrcmV0c25hdm4nLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ1NLUkVUU0lEJ11bMV1bMF0gPSBbJ3Nrb2xla3JldHNudW1tZXInLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydTUF9BRE0nXVsxXVswXSA9IFsnc2tvZ2JycGxhbkFkbURhdG9FbmRyaW5nJywgJ0RhdGUnXTtcbnNvc2l0eXBlc1snU1BfQURNJ11bMV1bMV0gPSBbJ3Nrb2dicnBsYW5BZG1EYXRvRXRhYmxlcmluZycsICdEYXRlJ107XG5zb3NpdHlwZXNbJ1NQX0FLTEFTUyddWzFdWzBdID0gWydza29nYnJwbGFuS2xhc3NBa3R1ZWx0VHJlc2xhZycsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1NQX0FLTEFTUyddWzFdWzFdID0gWydza29nYnJwbGFuS2xhc3NBa3RTbml0dEJvbicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1NQX0FLTEFTUyddWzFdWzNdID0gWydza29nYnJwbGFuS2xhc3NJbXBQcm9zZW50JywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snU1BfQUtMQVNTJ11bMV1bMl0gPSBbJ3Nrb2dicnBsYW5LbGFzc0ltcFR5cGUnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydTUF9BS0xBU1MnXVsxXVs0XSA9IFsnc2tvZ2JycGxhbktsYXNzUG90VHJlc2xhZycsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1NQX0FLTEFTUyddWzFdWzVdID0gWydza29nYnJwbGFuS2xhc3NQb3RTbml0dEJvbicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1NQX0JFU1RBTkQnXVsxXVsxXSA9IFsnc2tvZ2JycGxhbkJlc3RhbmREZWxOcicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1NQX0JFU1RBTkQnXVsxXVswXSA9IFsnc2tvZ2JycGxhbkJlc3RhbmROcicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1NQX0JTS1JJViddWzFdWzJdID0gWydza29nYnJwbGFuQmVza3JpdkJlc3RhbmRBbGRlcicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1NQX0JTS1JJViddWzFdWzNdID0gWydza29nYnJwbGFuQmVza3JpdkJlc3RhbmREYWEnLCAnUmVhbCddO1xuc29zaXR5cGVzWydTUF9CU0tSSVYnXVsxXVs2XSA9IFsnc2tvZ2JycGxhbkJlc2tyaXZCZXN0U25pdHREaWFtJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snU1BfQlNLUklWJ11bMV1bNF0gPSBbJ3Nrb2dicnBsYW5CZXNrcml2QmVzdGFuZFNuaXR0TTInLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydTUF9CU0tSSVYnXVsxXVs1XSA9IFsnc2tvZ2JycGxhbkJlc2tyaXZCZXN0YW5kU25pdHRIJywgJ1JlYWwnXTtcbnNvc2l0eXBlc1snU1BfQlNLUklWJ11bMV1bN10gPSBbJ3Nrb2dicnBsYW5CZXNrcml2QmFySMO4eWRlaGtsMicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1NQX0JTS1JJViddWzFdWzBdID0gWydza29nYnJwbGFuQmVza3JpdkhvZ3N0a2xhc3NlJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snU1BfQlNLUklWJ11bMV1bOF0gPSBbJ3Nrb2dicnBsYW5CZXNrcml2TGF1dkjDuHlkZWhrbDInLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydTUF9CU0tSSVYnXVsxXVs5XSA9IFsnc2tvZ2JycGxhbkJlc2tyaXZTamlrdG5pbmcnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydTUF9CU0tSSVYnXVsxXVsxXSA9IFsnc2tvZ2JycGxhbkJlc2tyaXZTa29ndHlwZScsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1NQX0JTS1JJViddWzFdWzEwXSA9IFsnc2tvZ2JycGxhbkJlc2tyaXZTdW5uaGV0JywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snU1BfQlNLUklWJ11bMV1bMTFdID0gWydza29nYnJwbGFuQmVza3JpdlRyZUVSZWd1bGVyaW5nJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snU1BfQlNLUklWJ11bMV1bMTJdID0gWydza29nYnJwbGFuQmVza3JpdlRyZUZSZWd1bGVyaW5nJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snU1BfRkxCUkVMRU0nXVsxXVswXSA9IFsnc2tvZ2JycGxhbkZsZXJLb2RlckVsZW1lbnR0eXBlJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snU1BfRkxCUkVMRU0nXVsxXVsxXSA9IFsnc2tvZ2JycGxhbkZsZXJLb2RlckFyZWFsUHJvc2VudCcsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1NQX0ZMQlJFTEVNJ11bMV1bMl0gPSBbJ3Nrb2dicnBsYW5GbGVyS29kZXJBcmVhbERhYScsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1NQX0ZMQlJFTEVNJ11bMV1bM10gPSBbJ3Nrb2dicnBsYW5GbGVyS29kZXJTcGVzQmVoUHJvcycsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1NQX0ZMQlJFTEVNJ11bMV1bNF0gPSBbJ3Nrb2dicnBsYW5GbGVyS29kZXJTcGVzQmVoRGFhJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snU1BfR1JMVk9MJ11bMV1bM10gPSBbJ3Nrb2dicnBsYW5HcnVubmxhZ1ZvbHVtRGFhRmVsdCcsICdSZWFsJ107XG5zb3NpdHlwZXNbJ1NQX0dSTFZPTCddWzFdWzRdID0gWydza29nYnJwbGFuR3J1bm5sYWdWb2x1bUJlc3RGZWx0JywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snU1BfR1JMVk9MJ11bMV1bMF0gPSBbJ3Nrb2dicnBsYW5HcnVubmxhZ0JlclR5cGUnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydTUF9HUkxWT0wnXVsxXVsyXSA9IFsnc2tvZ2JycGxhbkdydW5ubGFnSG92ZWRncnVwcGUnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydTUF9HUkxWT0wnXVsxXVs2XSA9IFsnc2tvZ2JycGxhbkdydW5ubGFnUmVnaW9uJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snU1BfR1JMVk9MJ11bMV1bNV0gPSBbJ3Nrb2dicnBsYW5HcnVubmxhZ1N2aW5uUHJvc2VudCcsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1NQX0dSTFZPTCddWzFdWzFdID0gWydza29nYnJwbGFuR3J1bm5sYWdUYWtzdHR5cGUnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydTUF9HUkxWT0wnXVsxXVs3XSA9IFsnc2tvZ2JycGxhbkdydW5ubGFnVGlsdmVrc3Rrb3JyJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snU1BfVEVJRyddWzFdWzNdID0gWydtYXRyaWtrZWxudW1tZXInLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ1NQX1RFSUcnXVsxXVsyXSA9IFsnc2tvZ2JycGxhblRlaWdHcmVuZCcsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1NQX1RFSUcnXVsxXVswXSA9IFsnc2tvZ2JycGxhblRlaWdOcicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1NQX1RFSUcnXVsxXVsxXSA9IFsnc2tvZ2JycGxhblRlaWdOYXZuJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydTUF9URVJLTEFTUyddWzFdWzBdID0gWydza29nYnJwbGFuVGVycmVuZ0LDpnJlZXZuZUJlc3RhbmQnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydTUF9URVJLTEFTUyddWzFdWzFdID0gWydza29nYnJwbGFuVGVycmVuZ0Jlc3RhbmRCcmF0dGhldCcsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1NQX1RFUktMQVNTJ11bMV1bMl0gPSBbJ3Nrb2dicnBsYW5UZXJyZW5nTGlMZW5nZGUnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydTUF9URVJLTEFTUyddWzFdWzNdID0gWydza29nYnJwbGFuVGVycmVuZ01pblRyYW5zcFV0c3QnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydTUF9URVJLTEFTUyddWzFdWzRdID0gWydza29nYnJwbGFuVGVycmVuZ0pldm5oZXQnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydTUF9URVRUSE9ZRCddWzFdWzBdID0gWydza29nYnJwbGFuVGV0dGhldEdydW5uZmxhdGVzdW0nLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydTUF9URVRUSE9ZRCddWzFdWzFdID0gWydza29nYnJwbGFuVGV0dGhldE1Iw7h5ZGUnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydTUF9USUxUQUsnXVsxXVszXSA9IFsnc2tvZ2JycGxhblRpbHRha1Byb3JpdGV0JywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snU1BfVElMVEFLJ11bMV1bMV0gPSBbJ3Nrb2dicnBsYW5UaWx0YWtQcm9zZW50JywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snU1BfVElMVEFLJ11bMV1bNF0gPSBbJ3Nrb2dicnBsYW5UaWx0YWtBcmVhbCcsICdSZWFsJ107XG5zb3NpdHlwZXNbJ1NQX1RJTFRBSyddWzFdWzBdID0gWydza29nYnJwbGFuVGlsdGFrQmVzdGFuZCcsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1NQX1RJTFRBSyddWzFdWzJdID0gWydza29nYnJwbGFuVGlsdGFrw4VyJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snU1BfVElMVlZPTCddWzFdWzBdID0gWydza29nYnJwbGFuVGlsdmVrc3RCZXJlZ25EYWEnLCAnUmVhbCddO1xuc29zaXR5cGVzWydTUF9USUxWVk9MJ11bMV1bMV0gPSBbJ3Nrb2dicnBsYW5UaWx2ZWtzdEJlcmVnblByb3NlbnQnLCAnUmVhbCddO1xuc29zaXR5cGVzWydTUF9USUxWVk9MJ11bMV1bMl0gPSBbJ3Nrb2dicnBsYW5UaWx2ZWtzdEJlcmVnbk0zJywgJ1JlYWwnXTtcbnNvc2l0eXBlc1snU1BfVElMVlZPTCddWzFdWzNdID0gWydza29nYnJwbGFuVGlsdmVrc3RWb2x1bUJlc3RhbmQnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydTUF9UUkVTTCddWzFdWzRdID0gWydza29nYnJwbGFuVHJlc2xhZ0FudFRyZURhYUVSZWcnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydTUF9UUkVTTCddWzFdWzNdID0gWydza29nYnJwbGFuVHJlc2xhZ0FudFRyZURhYUZSZWcnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydTUF9UUkVTTCddWzFdWzBdID0gWydza29nYnJwbGFuVHJlc2xhZycsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1NQX1RSRVNMJ11bMV1bMV0gPSBbJ3Nrb2dicnBsYW5UcmVzbGFnSMO4eWRlJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snU1BfVFJFU0wnXVsxXVsyXSA9IFsnc2tvZ2JycGxhblRyZXNsYWdQcm9zZW50JywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snU1BfVFJFU0wnXVsxXVs1XSA9IFsnc2tvZ2JycGxhblRyZXNsYWdLb3JyVm9sdW1VQmFyaycsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1NQX1RSRVNMJ11bMV1bN10gPSBbJ3Nrb2dicnBsYW5UcmVzbGFnU2FsZ3N2b2x1bVVCYXJrJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snU1BfVFJFU0wnXVsxXVs2XSA9IFsnc2tvZ2JycGxhblRyZXNsYWdVa29yclZvbHVtVUJhcmsnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydURVRUU1RFRElEJ11bMV1bMV0gPSBbJ3RldHRzdGVkbmF2bicsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snVEVUVFNURURJRCddWzFdWzBdID0gWyd0ZXR0c3RlZG51bW1lcicsICdJbnRlZ2VyJ107XG5zb3NpdHlwZXNbJ1VOSVZFUlNFTExVVEZPUk1JTkcnXVsxXVsyXSA9IFsnaW5mb3JtYXNqb24nLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ1VOSVZFUlNFTExVVEZPUk1JTkcnXVsxXVswXSA9IFsndGlsZ2plbmdlbGlnaGV0c3Z1cmRlcmluZycsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snVU5JVkVSU0VMTFVURk9STUlORyddWzFdWzFdID0gWyd1bml2ZXJzZWxsdXRmb3JtaW5nRmFzaWxpdGV0JywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydVVE5ZVFQnXVsxXVsxXSA9IFsndXRueXR0aW5nc3RhbGwnLCAnUmVhbCddO1xuc29zaXR5cGVzWydVVE5ZVFQnXVsxXVswXSA9IFsndXRueXR0aW5nc3R5cGUnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydVVFNMSVBQJ11bMV1bMF0gPSBbJ2tvbXBvbmVudCcsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snVVRTTElQUCddWzFdWzFdID0gWydtYXNzZXN0w7hycmVsc2UnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ1VUU0xJUFAnXVsxXVsyXSA9IFsndXRzbGlwcFR5cGUnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ1VUVl9USUxMX1BBUlQnXVsxXVsxXSA9IFsncGV0cm9sZXVtc2FuZGVsJywgJ1JlYWwnXTtcbnNvc2l0eXBlc1snVVRWX1RJTExfUEFSVCddWzFdWzBdID0gWydwZXRyb2xldW1zcGFydG5lcmUnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ1ZFUk4nXVsxXVswXSA9IFsndmVybmVsb3YnLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ1ZFUk4nXVsxXVsxXSA9IFsndmVybmVwYXJhZ3JhZicsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snVkVSTiddWzFdWzNdID0gWyd2ZXJuZWRhdG8nLCAnRGF0ZSddO1xuc29zaXR5cGVzWydWRVJOJ11bMV1bMl0gPSBbJ3Zlcm5ldHlwZScsICdTdHJpbmcnXTtcbnNvc2l0eXBlc1snVktSRVRTJ11bMV1bMV0gPSBbJ3ZhbGdrcmV0c25hdm4nLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ1ZLUkVUUyddWzFdWzBdID0gWyd2YWxna3JldHNudW1tZXInLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydWTlInXVsxXVswXSA9IFsndmVna2F0ZWdvcmknLCAnU3RyaW5nJ107XG5zb3NpdHlwZXNbJ1ZOUiddWzFdWzJdID0gWyd2ZWdudW1tZXInLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydWTlInXVsxXVsxXSA9IFsndmVnc3RhdHVzJywgJ1N0cmluZyddO1xuc29zaXR5cGVzWydWUEEnXVsxXVswXSA9IFsnaG92ZWRQYXJzZWxsJywgJ0ludGVnZXInXTtcbnNvc2l0eXBlc1snVlBBJ11bMV1bMV0gPSBbJ3ZlZ2xlbmtlTWV0ZXJGcmEnLCAnSW50ZWdlciddO1xuc29zaXR5cGVzWydWUEEnXVsxXVsyXSA9IFsndmVnbGVua2VNZXRlclRpbCcsICdJbnRlZ2VyJ107XG5cbm1vZHVsZS5leHBvcnRzID0gc29zaXR5cGVzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdHlwZXMgPSByZXF1aXJlKCcuL2RhdGF0eXBlcycpO1xuXG5mdW5jdGlvbiBnZXRMb25nbmFtZShrZXkpIHsgLy8gbm90IHRlc3RlZFxuICAgIGlmICh0eXBlcyAmJiB0eXBlc1trZXldKSB7XG4gICAgICAgIHZhciB0eXBlID0gdHlwZXNba2V5XTtcbiAgICAgICAgcmV0dXJuICEhdHlwZSAmJiB0eXBlWzBdIHx8IGtleTsgLy9hbWJpZ3VpdHkgYWhveSFcbiAgICB9XG4gICAgcmV0dXJuIGtleTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRMb25nbmFtZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdlb3N5c01hcCA9IHtcbiAgICAyOiB7J3NyaWQnOiAnRVBTRzo0MzI2JywgZGVmOiAnK3Byb2o9bG9uZ2xhdCArZWxscHM9V0dTODQgK2RhdHVtPVdHUzg0ICtub19kZWZzICd9XG59O1xuXG52YXIga29vcmRzeXNNYXAgPSB7XG4gICAgMTogeydzcmlkJzogJ0VQU0c6MjczOTEnLCAnZGVmJzogJytwcm9qPXRtZXJjICtsYXRfMD01OCArbG9uXzA9LTQuNjY2NjY2NjY2NjY2NjY3ICtrPTEgK3hfMD0wICt5XzA9MCArYT02Mzc3NDkyLjAxOCArYj02MzU2MTczLjUwODcxMjY5NiArdG93Z3M4ND0yNzguMyw5Myw0NzQuNSw3Ljg4OSwwLjA1LC02LjYxLDYuMjEgK3BtPW9zbG8gK3VuaXRzPW0gK25vX2RlZnMnfSxcbiAgICAyOiB7J3NyaWQnOiAnRVBTRzoyNzM5MicsICdkZWYnOiAnK3Byb2o9dG1lcmMgK2xhdF8wPTU4ICtsb25fMD0tMi4zMzMzMzMzMzMzMzMzMzMgK2s9MSAreF8wPTAgK3lfMD0wICthPTYzNzc0OTIuMDE4ICtiPTYzNTYxNzMuNTA4NzEyNjk2ICt0b3dnczg0PTI3OC4zLDkzLDQ3NC41LDcuODg5LDAuMDUsLTYuNjEsNi4yMSArcG09b3NsbyArdW5pdHM9bSArbm9fZGVmcyd9LFxuICAgIDM6IHsnc3JpZCc6ICdFUFNHOjI3MzkzJywgJ2RlZic6ICcrcHJvaj10bWVyYyArbGF0XzA9NTggK2xvbl8wPTAgK2s9MSAreF8wPTAgK3lfMD0wICthPTYzNzc0OTIuMDE4ICtiPTYzNTYxNzMuNTA4NzEyNjk2ICt0b3dnczg0PTI3OC4zLDkzLDQ3NC41LDcuODg5LDAuMDUsLTYuNjEsNi4yMSArcG09b3NsbyArdW5pdHM9bSArbm9fZGVmcyd9LFxuICAgIDQ6IHsnc3JpZCc6ICdFUFNHOjI3Mzk0JywgJ2RlZic6ICcrcHJvaj10bWVyYyArbGF0XzA9NTggK2xvbl8wPTIuNSAraz0xICt4XzA9MCAreV8wPTAgK2E9NjM3NzQ5Mi4wMTggK2I9NjM1NjE3My41MDg3MTI2OTYgK3Rvd2dzODQ9Mjc4LjMsOTMsNDc0LjUsNy44ODksMC4wNSwtNi42MSw2LjIxICtwbT1vc2xvICt1bml0cz1tICtub19kZWZzJ30sXG4gICAgNTogeydzcmlkJzogJ0VQU0c6MjczOTUnLCAnZGVmJzogJytwcm9qPXRtZXJjICtsYXRfMD01OCArbG9uXzA9Ni4xNjY2NjY2NjY2NjY2NjcgK2s9MSAreF8wPTAgK3lfMD0wICthPTYzNzc0OTIuMDE4ICtiPTYzNTYxNzMuNTA4NzEyNjk2ICt0b3dnczg0PTI3OC4zLDkzLDQ3NC41LDcuODg5LDAuMDUsLTYuNjEsNi4yMSArcG09b3NsbyArdW5pdHM9bSArbm9fZGVmcyd9LFxuICAgIDY6IHsnc3JpZCc6ICdFUFNHOjI3Mzk2JywgJ2RlZic6ICcrcHJvaj10bWVyYyArbGF0XzA9NTggK2xvbl8wPTEwLjE2NjY2NjY2NjY2NjY3ICtrPTEgK3hfMD0wICt5XzA9MCArYT02Mzc3NDkyLjAxOCArYj02MzU2MTczLjUwODcxMjY5NiArdG93Z3M4ND0yNzguMyw5Myw0NzQuNSw3Ljg4OSwwLjA1LC02LjYxLDYuMjEgK3BtPW9zbG8gK3VuaXRzPW0gK25vX2RlZnMnfSxcbiAgICA3OiB7J3NyaWQnOiAnRVBTRzoyNzM5NycsICdkZWYnOiAnK3Byb2o9dG1lcmMgK2xhdF8wPTU4ICtsb25fMD0xNC4xNjY2NjY2NjY2NjY2NyAraz0xICt4XzA9MCAreV8wPTAgK2E9NjM3NzQ5Mi4wMTggK2I9NjM1NjE3My41MDg3MTI2OTYgK3Rvd2dzODQ9Mjc4LjMsOTMsNDc0LjUsNy44ODksMC4wNSwtNi42MSw2LjIxICtwbT1vc2xvICt1bml0cz1tICtub19kZWZzJ30sXG4gICAgODogeydzcmlkJzogJ0VQU0c6MjczOTgnLCAnZGVmJzogJytwcm9qPXRtZXJjICtsYXRfMD01OCArbG9uXzA9MTguMzMzMzMzMzMzMzMzMzMgK2s9MSAreF8wPTAgK3lfMD0wICthPTYzNzc0OTIuMDE4ICtiPTYzNTYxNzMuNTA4NzEyNjk2ICt0b3dnczg0PTI3OC4zLDkzLDQ3NC41LDcuODg5LDAuMDUsLTYuNjEsNi4yMSArcG09b3NsbyArdW5pdHM9bSArbm9fZGVmcyd9LFxuICAgIDk6IHsnc3JpZCc6ICdFUFNHOjQyNzMnLCAnZGVmJzogJytwcm9qPWxvbmdsYXQgK2E9NjM3NzQ5Mi4wMTggK2I9NjM1NjE3My41MDg3MTI2OTYgK3Rvd2dzODQ9Mjc4LjMsOTMsNDc0LjUsNy44ODksMC4wNSwtNi42MSw2LjIxICtub19kZWZzJ30sXG4gICAgMjE6IHsnc3JpZCc6ICdFUFNHOjMyNjMxJywgJ2RlZic6ICcrcHJvaj11dG0gK3pvbmU9MzEgK2VsbHBzPVdHUzg0ICtkYXR1bT1XR1M4NCArdW5pdHM9bSArbm9fZGVmcyd9LFxuICAgIDIyOiB7J3NyaWQnOiAnRVBTRzozMjYzMicsICdkZWYnOiAnK3Byb2o9dXRtICt6b25lPTMyICtlbGxwcz1XR1M4NCArZGF0dW09V0dTODQgK3VuaXRzPW0gK25vX2RlZnMnfSxcbiAgICAyMzogeydzcmlkJzogJ0VQU0c6MzI2MzMnLCAnZGVmJzogJytwcm9qPXV0bSArem9uZT0zMyArZWxscHM9V0dTODQgK2RhdHVtPVdHUzg0ICt1bml0cz1tICtub19kZWZzJ30sXG4gICAgMjQ6IHsnc3JpZCc6ICdFUFNHOjMyNjM0JywgJ2RlZic6ICcrcHJvaj11dG0gK3pvbmU9MzQgK2VsbHBzPVdHUzg0ICtkYXR1bT1XR1M4NCArdW5pdHM9bSArbm9fZGVmcyd9LFxuICAgIDI1OiB7J3NyaWQnOiAnRVBTRzozMjYzNScsICdkZWYnOiAnK3Byb2o9dXRtICt6b25lPTM1ICtlbGxwcz1XR1M4NCArZGF0dW09V0dTODQgK3VuaXRzPW0gK25vX2RlZnMnfSxcbiAgICAyNjogeydzcmlkJzogJ0VQU0c6MzI2MzYnLCAnZGVmJzogJytwcm9qPXV0bSArem9uZT0zNSArZWxscHM9V0dTODQgK2RhdHVtPVdHUzg0ICt1bml0cz1tICtub19kZWZzJ30sXG4gICAgMzE6IHsnc3JpZCc6ICdFUFNHOjIzMDMxJywgZGVmOiAnK3Byb2o9dXRtICt6b25lPTMxICtlbGxwcz1pbnRsICt1bml0cz1tICtub19kZWZzJ30sXG4gICAgMzI6IHsnc3JpZCc6ICdFUFNHOjIzMDMyJywgZGVmOiAnK3Byb2o9dXRtICt6b25lPTMyICtlbGxwcz1pbnRsICt1bml0cz1tICtub19kZWZzJ30sXG4gICAgMzM6IHsnc3JpZCc6ICdFUFNHOjIzMDMzJywgZGVmOiAnK3Byb2o9dXRtICt6b25lPTMzICtlbGxwcz1pbnRsICt1bml0cz1tICtub19kZWZzJ30sXG4gICAgMzQ6IHsnc3JpZCc6ICdFUFNHOjIzMDM0JywgZGVmOiAnK3Byb2o9dXRtICt6b25lPTM0ICtlbGxwcz1pbnRsICt1bml0cz1tICtub19kZWZzJ30sXG4gICAgMzU6IHsnc3JpZCc6ICdFUFNHOjIzMDM1JywgZGVmOiAnK3Byb2o9dXRtICt6b25lPTM1ICtlbGxwcz1pbnRsICt1bml0cz1tICtub19kZWZzJ30sXG4gICAgMzY6IHsnc3JpZCc6ICdFUFNHOjIzMDM2JywgZGVmOiAnK3Byb2o9dXRtICt6b25lPTM2ICtlbGxwcz1pbnRsICt1bml0cz1tICtub19kZWZzJ30sXG4gICAgNTA6IHsnc3JpZCc6ICdFUFNHOjQyMzAnLCBkZWY6ICcrcHJvaj1sb25nbGF0ICtlbGxwcz1pbnRsICtub19kZWZzJ30sXG4gICAgNzI6IHsnc3JpZCc6ICdFUFNHOjQzMjInLCBkZWY6ICcrcHJvaj1sb25nbGF0ICtlbGxwcz1XR1M3MiArbm9fZGVmcyAnfSxcbiAgICA4NDogeydzcmlkJzogJ0VQU0c6NDMyNicsIGRlZjogJytwcm9qPWxvbmdsYXQgK2VsbHBzPVdHUzg0ICtkYXR1bT1XR1M4NCArbm9fZGVmcyAnfSxcbiAgICA4NzogeydzcmlkJzogJ0VQU0c6NDIzMScsICdkZWYnOiAnK3Byb2o9bG9uZ2xhdCArZWxscHM9aW50bCArbm9fZGVmcyAnfVxuXG4gICAgLy80MSBMb2thbG5ldHQsIHVzcGVzLlxuICAgIC8vNDIgTG9rYWxuZXR0LCB1c3Blcy5cbiAgICAvLzUxIE5HTy01NkEgKE3DuHJlKSBOR08xOTQ4IEdhdXNzLUtyw7xnZXJcbiAgICAvLzUyIE5HTy01NkIgKE3DuHJlKSBOR08xOTQ4IEdhdXNzLUtyw7xnZXJcbiAgICAvLzUzIE5HTy02NEEgKE3DuHJlKSBOR08xOTQ4IEdhdXNzLUtyw7xnZXJcbiAgICAvLzU0IE5HTy02NEIgKE3DuHJlKSBOR08xOTQ4IEdhdXNzLUtyw7xnZXJcbiAgICAvLzk5IEVnZW5kZWZpbmVydCAqXG4gICAgLy8xMDEgTG9rYWxuZXR0LCBPc2xvXG4gICAgLy8xMDIgTG9rYWxuZXR0LCBCw6ZydW1cbiAgICAvLzEwMyBMb2thbG5ldHQsIEFza2VyXG4gICAgLy8xMDQgTG9rYWxuZXR0LCBMaWxsZWhhbW1lclxuICAgIC8vMTA1IExva2FsbmV0dCxEcmFtbWVuXG4gICAgLy8xMDYgTG9rYWxuZXR0LCBCZXJnZW4gLyBBc2vDuHlcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdlb3N5c01hcDogZ2Vvc3lzTWFwLFxuICAgIGtvb3Jkc3lzTWFwOiBrb29yZHN5c01hcFxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyIHBhcnNlVHJlZSA9IHJlcXVpcmUoJy4vcGFyc2VUcmVlJyk7XG52YXIgZ2V0TG9uZ25hbWUgPSByZXF1aXJlKCcuL2dldExvbmduYW1lJyk7XG52YXIgZGF0YXR5cGVzID0gcmVxdWlyZSgnLi9kYXRhdHlwZXMnKTtcbnZhciBzZXREYXRhVHlwZSA9IHJlcXVpcmUoJy4vc2V0RGF0YVR5cGUnKTtcblxuXG5mdW5jdGlvbiBwYXJzZVN1YmRpY3QobGluZXMpIHtcbiAgICByZXR1cm4gXy5yZWR1Y2UocGFyc2VUcmVlKGxpbmVzLCAzKSwgZnVuY3Rpb24gKHN1YmRpY3QsIHZhbHVlLCBrZXkpIHtcbiAgICAgICAgc3ViZGljdFtnZXRMb25nbmFtZShrZXkpXSA9IHNldERhdGFUeXBlKGtleSwgdmFsdWVbMF0pO1xuICAgICAgICByZXR1cm4gc3ViZGljdDtcbiAgICB9LCB7fSk7XG59XG5cblxudmFyIHBhcnNlRnJvbUxldmVsMiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgcmV0dXJuIF8ucmVkdWNlKHBhcnNlVHJlZShkYXRhLCAyKSwgZnVuY3Rpb24gKGRpY3QsIGxpbmVzLCBrZXkpIHtcbiAgICAgICAgaWYgKGxpbmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGxpbmVzWzBdWzBdID09PSAnLicpIHtcbiAgICAgICAgICAgICAgICBkaWN0W2dldExvbmduYW1lKGtleSldID0gcGFyc2VTdWJkaWN0KGxpbmVzKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobGluZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIGRpY3RbZ2V0TG9uZ25hbWUoa2V5KV0gPSBfLm1hcChsaW5lcywgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZXREYXRhVHlwZShrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGljdFtnZXRMb25nbmFtZShrZXkpXSA9IHNldERhdGFUeXBlKGtleSwgbGluZXNbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaWN0O1xuICAgIH0sIHt9KTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlRnJvbUxldmVsMjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5cbmZ1bmN0aW9uIGlzRW1wdHkobGluZSkge1xuICAgIHJldHVybiBsaW5lID09PSAnJztcbn1cblxuZnVuY3Rpb24gaXNQYXJlbnQobGluZSwgcGFyZW50TGV2ZWwpIHtcbiAgICByZXR1cm4gKGNvdW50U3RhcnRpbmdEb3RzKGxpbmUpID09PSBwYXJlbnRMZXZlbCk7XG59XG5cbmZ1bmN0aW9uIGNsZWFudXBMaW5lKGxpbmUpIHtcbiAgICBpZiAobGluZS5pbmRleE9mKCchJykgIT09IC0xKSB7XG4gICAgICAgIGxpbmUgPSBsaW5lLnN1YnN0cmluZygwLCBsaW5lLmluZGV4T2YoJyEnKSk7XG4gICAgfVxuICAgIHJldHVybiBsaW5lLnJlcGxhY2UoL1xccyskLywgJycpO1xufVxuXG5mdW5jdGlvbiBnZXRLZXlGcm9tTGluZShsaW5lKSB7XG4gICAgaWYgKGxpbmUuaW5kZXhPZignOicpICE9PSAtMSkge1xuICAgICAgICByZXR1cm4gXy5maXJzdChsaW5lLnNwbGl0KCc6JykpLnRyaW0oKTtcbiAgICB9XG4gICAgcmV0dXJuIF8uZmlyc3QobGluZS5zcGxpdCgnICcpKS50cmltKCk7XG59XG5cbmZ1bmN0aW9uIGdldE51bURvdHMobnVtKSB7XG4gICAgcmV0dXJuIG5ldyBBcnJheShudW0gKyAxKS5qb2luKCcuJyk7XG59XG5cbmZ1bmN0aW9uIGdldEtleShsaW5lLCBwYXJlbnRMZXZlbCkge1xuICAgIHJldHVybiBjbGVhbnVwTGluZShcbiAgICAgICAgZ2V0S2V5RnJvbUxpbmUoXG4gICAgICAgICAgICBsaW5lLnJlcGxhY2UoZ2V0TnVtRG90cyhwYXJlbnRMZXZlbCksICcnKVxuICAgICAgICApXG4gICAgKTtcbn1cblxuZnVuY3Rpb24gY291bnRTdGFydGluZ0RvdHMoc3RyKSB7XG4gICAgdmFyIGRpZmZlcnMgPSBfLmZpbmQoc3RyLCBmdW5jdGlvbiAoY2hhcmFjdGVyKSB7cmV0dXJuIChjaGFyYWN0ZXIgIT09ICcuJyk7IH0pO1xuICAgIGlmIChkaWZmZXJzKSB7XG4gICAgICAgIHN0ciA9IHN0ci5zdWJzdHIoMCwgXy5pbmRleE9mKHN0ciwgZGlmZmVycykpO1xuICAgIH1cbiAgICBpZiAoXy5ldmVyeShzdHIsIGZ1bmN0aW9uIChjaGFyYWN0ZXIpIHsgcmV0dXJuIChjaGFyYWN0ZXIgPT09ICcuJyk7IH0pKSB7XG4gICAgICAgIHJldHVybiBzdHIubGVuZ3RoO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbn1cblxuZnVuY3Rpb24gZ2V0VmFsdWVzKGxpbmUpIHtcbiAgICByZXR1cm4gXy5yZXN0KGxpbmUuc3BsaXQoJyAnKSkuam9pbignICcpLnRyaW0oKTtcbn1cblxuZnVuY3Rpb24gcHVzaE9yQ3JlYXRlKGRpY3QsIHZhbCkge1xuICAgIGlmICghXy5pc0FycmF5KGRpY3Qub2JqZWN0c1tkaWN0LmtleV0pKSB7XG4gICAgICAgIGRpY3Qub2JqZWN0c1tkaWN0LmtleV0gPSBbXTtcbiAgICB9XG4gICAgZGljdC5vYmplY3RzW2RpY3Qua2V5XS5wdXNoKHZhbCk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVHJlZShkYXRhLCBwYXJlbnRMZXZlbCkge1xuICAgIHJldHVybiBfLnJlZHVjZShfLnJlamVjdChkYXRhLCBpc0VtcHR5KSwgZnVuY3Rpb24gKHJlcywgbGluZSkge1xuICAgICAgICBsaW5lID0gY2xlYW51cExpbmUobGluZSk7XG4gICAgICAgIGlmIChpc1BhcmVudChsaW5lLCBwYXJlbnRMZXZlbCkpIHtcbiAgICAgICAgICAgIHJlcy5rZXkgPSBnZXRLZXkobGluZSwgcGFyZW50TGV2ZWwpO1xuICAgICAgICAgICAgbGluZSA9IGdldFZhbHVlcyhsaW5lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzRW1wdHkobGluZSkpIHtcbiAgICAgICAgICAgIHB1c2hPckNyZWF0ZShyZXMsIGxpbmUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfSwge29iamVjdHM6IHt9fSkub2JqZWN0cztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZVRyZWU7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIHJvdW5kKG51bWJlciwgbnVtRGVjaW1hbHMpIHtcbiAgICB2YXIgcG93ID0gTWF0aC5wb3coMTAsIG51bURlY2ltYWxzKTtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChudW1iZXIgKiBwb3cpIC8gcG93O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJvdW5kO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG52YXIgZGF0YXR5cGVzID0gcmVxdWlyZSgnLi9kYXRhdHlwZXMnKTtcblxuZnVuY3Rpb24gc2V0RGF0YVR5cGUoa2V5LCB2YWx1ZSkge1xuXG4gICAgaWYgKCFkYXRhdHlwZXMpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIHZhciB0eXBlID0gXy5pc0FycmF5KGtleSkgPyBrZXkgOiBkYXRhdHlwZXNba2V5XTtcbiAgICBpZiAodHlwZSkge1xuICAgICAgICBpZiAoIV8uaXNPYmplY3QodHlwZVswXSkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlWzFdID09PSAnSW50ZWdlcicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQodmFsdWUsIDEwKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZVsxXSA9PT0gJ1JlYWwnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlWzFdID09PSAnRGF0ZScpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoID09PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KHZhbHVlLnN1YnN0cmluZygwLCA0KSwgMTApLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQodmFsdWUuc3Vic3RyaW5nKDQsIDYpLCAxMCkgLSAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQodmFsdWUuc3Vic3RyaW5nKDYsIDgpLCAxMClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMTQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQodmFsdWUuc3Vic3RyaW5nKDAsIDQpLCAxMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUludCh2YWx1ZS5zdWJzdHJpbmcoNCwgNiksIDEwKSAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUludCh2YWx1ZS5zdWJzdHJpbmcoNiwgOCksIDEwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KHZhbHVlLnN1YnN0cmluZyg4LCAxMCksIDEwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KHZhbHVlLnN1YnN0cmluZygxMCwgMTIpLCAxMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZUludCh2YWx1ZS5zdWJzdHJpbmcoMTIsIDE0KSwgMTApXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzU3RyaW5nKHR5cGVbMV0pKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlWzBdID09PSAnXCInIHx8IHZhbHVlWzBdID09PSAnXFwnJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuc3Vic3RyaW5nKDEsIHZhbHVlLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldERhdGFUeXBlO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG52YXIgc2V0RGF0YVR5cGUgPSByZXF1aXJlKCcuL3NldERhdGFUeXBlJyk7XG52YXIgZGF0YXR5cGVzID0gcmVxdWlyZSgnLi9kYXRhdHlwZXMnKTtcblxuZnVuY3Rpb24gcGFyc2VTcGVjaWFsKGtleSwgc3ViZmllbGRzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF8uaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhOyAvLyBleHRlbmRlZCBzdWJmaWVsZHNcbiAgICAgICAgfVxuICAgICAgICBpZiAoXy5pc1N0cmluZyhkYXRhKSkge1xuICAgICAgICAgICAgcmV0dXJuIF8ucmVkdWNlKGRhdGEubWF0Y2goL1wiW15cIl0qXCJ8J1teJ10qJ3xcXFMrL2cpLCBmdW5jdGlvbiAocmVzLCBjaHVuaywgaSkge1xuICAgICAgICAgICAgICAgIHJlc1tzdWJmaWVsZHNbaV1bMF1dID0gc2V0RGF0YVR5cGUoc3ViZmllbGRzW2ldLCBjaHVuayk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgIH0sIHt9KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbnZhciBzcGVjaWFsQXR0cmlidXRlcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCEhZGF0YXR5cGVzKSB7XG4gICAgICAgIHJldHVybiBfLnJlZHVjZShkYXRhdHlwZXMsIGZ1bmN0aW9uIChhdHRycywgdHlwZSwga2V5KSB7XG4gICAgICAgICAgICBpZiAoXy5pc09iamVjdCh0eXBlWzFdKSkgeyAvLyB0cnVlIGZvciBjb21wbGV4IGRhdGF0eXBlc1xuICAgICAgICAgICAgICAgIGF0dHJzW3R5cGVbMF1dID0ge25hbWU6IHR5cGVbMF0sIGNyZWF0ZUZ1bmN0aW9uOiBwYXJzZVNwZWNpYWwoa2V5LCB0eXBlWzFdKX07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXR0cnM7XG4gICAgICAgIH0sIHt9KTtcbiAgICB9XG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNwZWNpYWxBdHRyaWJ1dGVzO1xuIl19
