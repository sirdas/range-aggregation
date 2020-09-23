import { RangeList } from "./index";
/* eslint-disable no-console */

describe("creating new range", () => {
    beforeAll(() => {
        console.error = jest.fn();
    });
    it("succeeds when end is greater than start", () => {
        console.log = jest.fn();
        const rl: RangeList = new RangeList();
        rl.add([1, 2]);
        expect(console.error).toHaveBeenCalledTimes(0);
        rl.print();
        expect(console.log).toHaveBeenCalledWith("[1, 2)");
    });
    it("fails when end equals start", () => {
        const rl: RangeList = new RangeList();
        rl.add([1, 1]);
        expect(console.error).toHaveBeenCalledWith(new Error("Invalid Range"));
    });
    it("fails when end is less than start", () => {
        const rl: RangeList = new RangeList();
        rl.add([1, 0]);
        expect(console.error).toHaveBeenCalledWith(new Error("Invalid Range"));
    });
});

describe("adding new range", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });
    it("doesn't overlap", () => {
        const rl: RangeList = new RangeList();
        rl.add([1, 2]);
        rl.add([3, 4]);
        rl.print();
        expect(console.log).toHaveBeenCalledWith("[1, 2) [3, 4)");
    });
    it("overlaps to the left", () => {
        const rl: RangeList = new RangeList();
        rl.add([1, 3]);
        rl.add([-2, 2]);
        rl.print();
        expect(console.log).toHaveBeenCalledWith("[-2, 3)");
    });
    it("overlaps to the right", () => {
        const rl: RangeList = new RangeList();
        rl.add([1, 3]);
        rl.add([2, 6]);
        rl.print();
        expect(console.log).toHaveBeenCalledWith("[1, 6)");
    });
    it("envelops one range", () => {
        const rl: RangeList = new RangeList();
        rl.add([1, 2]);
        rl.add([0, 4]);
        rl.print();
        expect(console.log).toHaveBeenCalledWith("[0, 4)");
    });
    it("envelops multiple ranges", () => {
        const rl: RangeList = new RangeList();
        rl.add([1, 2]);
        rl.add([3, 4]);
        rl.add([7, 8]);
        rl.add([-1, 10]);
        rl.print();
        expect(console.log).toHaveBeenCalledWith("[-1, 10)");
    });
    it("combines two ranges", () => {
        const rl: RangeList = new RangeList();
        rl.add([1, 3]);
        rl.add([6, 7]);
        rl.add([3, 7]);
        rl.print();
        expect(console.log).toHaveBeenCalledWith("[1, 7)");
    });
    it("combines multiple ranges", () => {
        const rl: RangeList = new RangeList();
        rl.add([1, 2]);
        rl.add([3, 5]);
        rl.add([-4, -3]);
        rl.add([-3, 4]);
        rl.print();
        expect(console.log).toHaveBeenCalledWith("[-4, 5)");
    });
    it("is useless", () => {
        const rl: RangeList = new RangeList();
        rl.add([0, 20]);
        rl.add([10, 12]);
        rl.print();
        expect(console.log).toHaveBeenCalledWith("[0, 20)");
    });
});

describe("deleting range", () => {
    beforeAll(() => {
        console.log = jest.fn();
    });
    it("doesn't overlap", () => {
        const rl: RangeList = new RangeList();
        rl.add([1, 2]);
        rl.remove([3, 4]);
        rl.print();
        expect(console.log).toHaveBeenCalledWith("[1, 2)");
    });
    it("overlaps to the left", () => {
        const rl: RangeList = new RangeList();
        rl.add([1, 3]);
        rl.remove([-2, 2]);
        rl.print();
        expect(console.log).toHaveBeenCalledWith("[2, 3)");
    });
    it("overlaps to the right", () => {
        const rl: RangeList = new RangeList();
        rl.add([1, 3]);
        rl.remove([2, 6]);
        rl.print();
        expect(console.log).toHaveBeenCalledWith("[1, 2)");
    });
    it("envelops one range", () => {
        const rl: RangeList = new RangeList();
        rl.add([1, 2]);
        rl.remove([0, 4]);
        rl.print();
        expect(console.log).toHaveBeenCalledWith("");
    });
    it("envelops multiple ranges", () => {
        const rl: RangeList = new RangeList();
        rl.add([1, 2]);
        rl.add([3, 4]);
        rl.add([7, 8]);
        rl.remove([-1, 10]);
        rl.print();
        expect(console.log).toHaveBeenCalledWith("");
    });
    it("overlaps two ranges", () => {
        const rl: RangeList = new RangeList();
        rl.add([1, 3]);
        rl.add([6, 8]);
        rl.remove([2, 7]);
        rl.print();
        expect(console.log).toHaveBeenCalledWith("[1, 2) [7, 8)");
    });
    it("overlaps multiple ranges", () => {
        const rl: RangeList = new RangeList();
        rl.add([1, 2]);
        rl.add([3, 5]);
        rl.add([-6, -3]);
        rl.remove([-4, 4]);
        rl.print();
        expect(console.log).toHaveBeenCalledWith("[-6, -4) [4, 5)");
    });
    it("overlaps middle of range", () => {
        const rl: RangeList = new RangeList();
        rl.add([0, 20]);
        rl.remove([10, 12]);
        rl.print();
        expect(console.log).toHaveBeenCalledWith("[0, 10) [12, 20)");
    });
});

test("example run", () => {
    console.log = jest.fn();
    const rl = new RangeList();

    rl.add([1, 5]);
    rl.print();
    // Should display: [1, 5)
    expect(console.log).toHaveBeenCalledWith("[1, 5)");

    rl.add([10, 20]);
    rl.print();
    // Should display: [1, 5) [10, 20)
    expect(console.log).toHaveBeenCalledWith("[1, 5) [10, 20)");

    rl.add([20, 20]);
    rl.print();
    // Should display: [1, 5) [10, 20)
    expect(console.log).toHaveBeenCalledWith("[1, 5) [10, 20)");

    rl.add([20, 21]);
    rl.print();
    // Should display: [1, 5) [10, 21)
    expect(console.log).toHaveBeenCalledWith("[1, 5) [10, 21)");

    rl.add([2, 4]);
    rl.print();
    // Should display: [1, 5) [10, 21)
    expect(console.log).toHaveBeenCalledWith("[1, 5) [10, 21)");

    rl.add([3, 8]);
    rl.print();
    // Should display: [1, 8) [10, 21)
    expect(console.log).toHaveBeenCalledWith("[1, 8) [10, 21)");

    rl.remove([10, 10]);
    rl.print();
    // Should display: [1, 8) [10, 21)
    expect(console.log).toHaveBeenCalledWith("[1, 8) [10, 21)");

    rl.remove([10, 11]);
    rl.print();
    // Should display: [1, 8) [11, 21)
    expect(console.log).toHaveBeenCalledWith("[1, 8) [11, 21)");

    rl.remove([15, 17]);
    rl.print();
    // Should display: [1, 8) [11, 15) [17, 21)
    expect(console.log).toHaveBeenCalledWith("[1, 8) [11, 15) [17, 21)");

    rl.remove([3, 19]);
    rl.print();
    // Should display: [1, 3) [19, 21)
    expect(console.log).toHaveBeenCalledWith("[1, 3) [19, 21)");
});
