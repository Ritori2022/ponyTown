"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../lib");
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const liveEndPoint_1 = require("../../server/liveEndPoint");
const adminInterfaces_1 = require("../../common/adminInterfaces");
const constants_1 = require("../../common/constants");
const utils_1 = require("../../common/utils");
describe('liveEndPoint', () => {
    let clock;
    let model;
    let encode;
    let beforeDelete;
    let afterDelete;
    let afterAssign;
    let liveEndPoint;
    function stubFind(items) {
        return (0, sinon_1.stub)(model, 'find').returns({
            sort: (0, sinon_1.stub)().withArgs((0, sinon_1.match)({ updatedAt: 1 })).returns({
                limit: (0, sinon_1.stub)().withArgs(adminInterfaces_1.ITEM_LIMIT + 1).returns({
                    lean: (0, sinon_1.stub)().returns({
                        exec: () => Promise.resolve(items)
                    })
                })
            })
        });
    }
    beforeEach(() => {
        clock = (0, sinon_1.useFakeTimers)();
        model = {
            findByIdAndUpdate() { },
            findById() { },
            find() { },
        };
        encode = (0, sinon_1.stub)();
        beforeDelete = (0, sinon_1.stub)();
        afterDelete = (0, sinon_1.stub)();
        afterAssign = (0, sinon_1.stub)();
        liveEndPoint = (0, liveEndPoint_1.createLiveEndPoint)({
            model, fields: ['_id', 'name', 'desc'], encode, beforeDelete, afterDelete, afterAssign
        });
    });
    afterEach(() => {
        clock.restore();
        liveEndPoint.destroy();
    });
    it('clears removed items after 10 minutes', () => {
        const item = { _id: 'foo', remove: (0, sinon_1.stub)() };
        (0, sinon_1.stub)(model, 'findById').withArgs('foo').returns({ exec: () => Promise.resolve(item) });
        clock.setSystemTime(10000);
        stubFind([]);
        return liveEndPoint.removeItem('foo')
            .then(() => clock.tick(1 * constants_1.MINUTE + 100))
            .then(() => liveEndPoint.getAll())
            .then(result => (0, chai_1.expect)(result.deletes).eql(['foo']));
    });
    describe('get()', () => {
        it('finds item by id', () => {
            const item = {};
            (0, sinon_1.stub)(model, 'findById').withArgs('foo').returns({
                lean: (0, sinon_1.stub)().returns({
                    exec: (0, sinon_1.stub)().resolves(item)
                })
            });
            return liveEndPoint.get('foo')
                .then(result => (0, chai_1.expect)(result).equal(item));
        });
    });
    describe('getAll()', () => {
        it('returns encoded items', () => {
            stubFind([{ _id: 'aaa' }, { _id: 'bbb' }]);
            encode.returns('encoded');
            return liveEndPoint.getAll()
                .then(result => (0, chai_1.expect)(result).eql({
                base: {},
                deletes: [],
                updates: 'encoded',
                more: false,
            }));
        });
        it('passes 0 timestamp to find method by default', () => {
            const find = stubFind([{ _id: 'aaa' }, { _id: 'bbb' }]);
            return liveEndPoint.getAll()
                .then(() => sinon_1.assert.calledWithMatch(find, { updatedAt: { $gt: new Date(0) } }, '_id name desc'));
        });
        it('passes given timestamp to find method', () => {
            const timestamp = '2017-09-09T16:39:54.199Z';
            const find = stubFind([{ _id: 'aaa' }, { _id: 'bbb' }]);
            return liveEndPoint.getAll(timestamp)
                .then(() => sinon_1.assert.calledWithMatch(find, { updatedAt: { $gt: new Date(timestamp) } }, '_id name desc'));
        });
        describe('if items exceed limit', () => {
            describe('if last 2 items have different updatedAt', () => {
                beforeEach(() => {
                    const items = (0, utils_1.times)(adminInterfaces_1.ITEM_LIMIT + 1, i => ({ _id: `foo_${i}`, updatedAt: new Date(i) }));
                    stubFind(items);
                });
                it('removes last item', () => {
                    return liveEndPoint.getAll()
                        .then(() => (0, chai_1.expect)(encode.args[0][0].length).equal(adminInterfaces_1.ITEM_LIMIT));
                });
                it('returns more flag', () => {
                    return liveEndPoint.getAll()
                        .then(({ more }) => (0, chai_1.expect)(more).true);
                });
            });
            describe('if last 2 items have the same updatedAt', () => {
                let items;
                let restItems;
                let find;
                beforeEach(() => {
                    items = (0, utils_1.times)(adminInterfaces_1.ITEM_LIMIT, i => ({ _id: `foo_${i}`, updatedAt: new Date(i) }));
                    items.push({ _id: 'bar', updatedAt: items[items.length - 1].updatedAt });
                    restItems = [{ _id: 'bar1' }, { _id: 'bar2' }];
                    find = stubFind(items).onSecondCall().returns({
                        lean: (0, sinon_1.stub)().returns({
                            exec: (0, sinon_1.stub)().resolves(restItems)
                        })
                    });
                });
                it('fetches additional items if last items have the same date', () => {
                    return liveEndPoint.getAll()
                        .then(() => (0, chai_1.expect)(encode.args[0][0].length).equal(adminInterfaces_1.ITEM_LIMIT + 1 + 2));
                });
                it('filters out duplicate items', () => {
                    restItems.push(items[items.length - 1]);
                    return liveEndPoint.getAll()
                        .then(() => (0, chai_1.expect)(encode.args[0][0].length).equal(adminInterfaces_1.ITEM_LIMIT + 1 + 2));
                });
                it('fetches more items using timestamp of last element', () => {
                    const timestamp = items[items.length - 1].updatedAt;
                    return liveEndPoint.getAll()
                        .then(() => sinon_1.assert.calledWithMatch(find, { updatedAt: timestamp }, '_id name desc'));
                });
                it('returns more flag', () => {
                    return liveEndPoint.getAll()
                        .then(({ more }) => (0, chai_1.expect)(more).true);
                });
            });
        });
    });
    describe('removeItem()', () => {
        describe('if item exists', () => {
            let item;
            beforeEach(() => {
                item = { _id: 'foo', remove: (0, sinon_1.stub)() };
                (0, sinon_1.stub)(model, 'findById').withArgs('foo').returns({ exec: (0, sinon_1.stub)().resolves(item) });
            });
            it('removes item', () => {
                return liveEndPoint.removeItem('foo')
                    .then(() => sinon_1.assert.calledOnce(item.remove));
            });
            it('calls beforeDelete hook', () => {
                return liveEndPoint.removeItem('foo')
                    .then(() => sinon_1.assert.calledWith(beforeDelete, item));
            });
            it('calls afterDelete hook', () => {
                return liveEndPoint.removeItem('foo')
                    .then(() => sinon_1.assert.calledWith(afterDelete, item));
            });
            it('adds item ID to removed items', () => {
                clock.setSystemTime(10000);
                stubFind([]);
                return liveEndPoint.removeItem('foo')
                    .then(() => liveEndPoint.getAll())
                    .then(result => (0, chai_1.expect)(result.deletes).eql(['foo']));
            });
        });
        describe('if item does not exist', () => {
            let item;
            beforeEach(() => {
                item = { remove: (0, sinon_1.stub)() };
                (0, sinon_1.stub)(model, 'findById').withArgs('bar').returns({ exec: (0, sinon_1.stub)().resolves(null) });
            });
            it('does nothing if item does not exist', () => {
                return liveEndPoint.removeItem('bar')
                    .then(() => sinon_1.assert.notCalled(item.remove));
            });
            it('does not call onDelete hook', () => {
                return liveEndPoint.removeItem('bar')
                    .then(() => sinon_1.assert.notCalled(beforeDelete));
            });
            it('does not call hook', () => {
                return liveEndPoint.removeItem('bar')
                    .then(() => sinon_1.assert.notCalled(afterDelete));
            });
        });
    });
    describe('assignAccount()', () => {
        const item = { account: 'origacc' };
        beforeEach(() => {
            (0, sinon_1.stub)(model, 'findById').withArgs('foo', 'account')
                .returns({ lean: (0, sinon_1.stub)().returns({ exec: (0, sinon_1.stub)().resolves(item) }) });
        });
        it('assigns account to item', () => {
            const exec = (0, sinon_1.stub)();
            const findByIdAndUpdate = (0, sinon_1.stub)(model, 'findByIdAndUpdate').returns({ exec });
            return liveEndPoint.assignAccount('foo', 'bar')
                .then(() => {
                sinon_1.assert.calledWithMatch(findByIdAndUpdate, 'foo', { account: 'bar' });
                sinon_1.assert.calledOnce(exec);
            });
        });
        it('calls afterAssign hook', () => {
            (0, sinon_1.stub)(model, 'findByIdAndUpdate').returns({ exec: (0, sinon_1.stub)() });
            return liveEndPoint.assignAccount('foo', 'bar')
                .then(() => sinon_1.assert.calledWith(afterAssign, 'origacc', 'bar'));
        });
    });
});
//# sourceMappingURL=liveEndPoint.spec.js.map