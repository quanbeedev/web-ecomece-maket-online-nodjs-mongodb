const Itemset = require('./itemSet');

'use strict';

module.exports = class ItemsetCollection extends Array {
    constructor() {
        super();
    }

    getUniqueItems() {
        let uniqueItems = new Itemset();
        
        for (var index in this) {
            let itemset = this[index];  //itemset[index]
            for (var i = 0; i < itemset.length; i += 1) {
                if (!uniqueItems.includes(itemset[i])) {
                    uniqueItems.push(itemset[i]);
                    // console.log({ uniqueItems });
                }
            }
        }

        return uniqueItems;
    }

    findSupport(itemset) {
        let matchCount = 0;
        for (var index in this) {
            let is = this[index];
            if (is.includesItemset(itemset)) {
                matchCount += 1;
            }
        }

        let support = (matchCount / this.length) * 100.0;
        // console.log({ support });
        // console.log({ matchCount });
        
        return support;
    }

    clear() {
        this.length = 0;
    }

    toString() {
        return this.join('\n');
    }
}
