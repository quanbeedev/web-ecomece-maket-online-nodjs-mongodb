const ItemsetCollection = require('./itemSetCollection');
const AssociationRule   = require('./associationRule');
const Itemset           = require('./itemSet');
const Bit               = require('./bit');

'use strict';

module.exports = class AprioriMining {
    static doApriori(db, supportThreshold) {
        let I = db.getUniqueItems();
        let L = new ItemsetCollection(); // Resultant large itemsets mục kết quả
        let Li = new ItemsetCollection(); // Tập phổ biến mỗi vòng lặp
        let Ci = new ItemsetCollection(); // tập hợp các item đưuọc cắt tỉa theo vòng lặp Pruned itemset in each iteration

        // First iteration (1-item itemsets)
        for (var i = 0; i < I.length; i += 1) {
            Ci.push(Itemset.from([I[i]]));
        }

        // Next iterations
        let k = 2;
        while (Ci.length != 0) {
            // Set Li from Ci (pruning)
            Li.clear();
            for (var index in Ci) {
                let itemset = Ci[index];
                itemset.Support = db.findSupport(itemset);
                if (itemset.Support >= supportThreshold) {
                    Li.push(itemset);
                    L.push(itemset);
                }
            }

            // Set Ci for next iteration (find supersets of Li)
            Ci.clear();
            let subsets = Bit.findSubsets(Li.getUniqueItems(), k); // Get k-item subsets
            subsets.forEach(set => Ci.push(set));
            k += 1;
        }

        return L;
    }

    static mine(db, L, confidenceThreshold) {
        let allRules = [];
    
        for (var i in L) {
            let itemset = L[i];
            let subsets = Bit.findSubsets(itemset, 0); // Get all subsets

            for (var j in subsets) {
                let subset = subsets[j];
                let confidence = (db.findSupport(itemset) / db.findSupport(subset)) * 100.0;

                if (confidence >= confidenceThreshold) {
                    let rule = new AssociationRule();
                    subset.forEach(i => rule.X.push(i));
                    itemset.removeItemset(subset).forEach(i => rule.Y.push(i));
                    rule.Support = db.findSupport(itemset);
                    rule.Confidence = confidence;

                    if (rule.X.length > 0 && rule.Y.length > 0) {
                        allRules.push(rule);
                    }
                }
            }
        }
     

        return allRules;
    }
}
