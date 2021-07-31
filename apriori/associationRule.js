const Itemset           = require('./itemSet');
const Bit               = require('./bit');
const ItemsetCollection = require('./itemSetCollection');

'use strict';

module.exports = class AssociationRule {
    constructor() {
        this.X = new Itemset();
        this.Y = new Itemset();
        this.Support = 0.0;
        this.Confidence = 0.0;
    }

    toString() {
        return this.X.toStringNoSupport() + ' => ' + this.Y.toStringNoSupport() +
            ' (Support: ' + this.Support.toFixed(2) + '%, ' +
            ' Confidence: ' + this.Confidence.toFixed(2) + '%)';
    }
}
