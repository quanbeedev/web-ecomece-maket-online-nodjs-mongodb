'use strict';

module.exports = class Itemset extends Array {
    constructor() {
        super();
        this.Support = 0.0;
    }
   
    includesItemset(itemset) { 
        // console.log({trong : itemset});
        for (var i = 0; i < itemset.length; i += 1) {
            var item = itemset[i];
            if (!this.includes(item)) {
                return false;
            }
        }
        return true;
    }

    removeItemset(itemset) {
        var removed = new Itemset();
        for (var i = 0; i < this.length; i += 1) {
            var item = this[i];
            if (!itemset.includes(item)) {
                removed.push(item);
            }
        }
        return removed;
    }

    toStringNoSupport() {
        return '{' + this.join(', ') + '}';
    }

    toString() {
        return '{' + this.join(', ') + '} (support: ' + this.Support + '%)';
    }
}
/**
 * ket qua phan tich buoc nay nham d
 * 
 */