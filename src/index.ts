interface IntegerRange {
    start: number;
    endExclusive: number;
}
export class RangeList {
    private ranges: IntegerRange[] = [];

    /**
     * Creates an IntegerRange object, throws an error if it is not a valid range
     * @param rangeTuple - Tuple of two integers that specify
     * the start and end (exclusive) of a range.
     */
    private static createRangeFromTuple(rangeTuple: [number, number]): IntegerRange {
        const range: IntegerRange = {
            start: rangeTuple[0],
            endExclusive: rangeTuple[1],
        };
        if (range.start >= range.endExclusive) {
            throw new Error("Invalid Range");
        }
        return range;
    }

    /**
     * Adds a range to the list and aggregates the ranges
     * @param rangeTuple - Tuple of two integers that specify
     * the start and end (exclusive) of a range.
     */
    public add(rangeTuple: [number, number]): void {
        let newRange: IntegerRange;
        try {
            newRange = RangeList.createRangeFromTuple(rangeTuple);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            return;
        }

        let deleteIndex = 0; // index to splice from
        let overlappingRangeCount = 0; // number of ranges to delete

        // find the index to start checking from
        let firstOverlappingCandidateIndex = this.ranges.findIndex((r) => r.start >= newRange.start) - 1;
        if (firstOverlappingCandidateIndex === -2) {
            firstOverlappingCandidateIndex = this.ranges.length - 1;
        }

        // if index is -1, this block will be skipped. e.g. adding [1, 6) to [1, 3)
        if (firstOverlappingCandidateIndex >= 0) {
            const firstOverlappingCandidate = this.ranges[firstOverlappingCandidateIndex];
            // if the start of the new range is equal to the candidate's end, it is considered an overlap
            if (firstOverlappingCandidate.endExclusive >= newRange.start) {
                // there is an overlap, adjust new range to include overlap
                newRange.start = firstOverlappingCandidate.start;
                // will delete ranges starting from this range
                deleteIndex = firstOverlappingCandidateIndex;
            } else {
                // the next range might be overlapping
                deleteIndex = firstOverlappingCandidateIndex + 1;
            }
        }

        let lastOverlappingCandidateIndex = this.ranges.findIndex((r) => r.start > newRange.endExclusive) - 1;
        if (lastOverlappingCandidateIndex === -2) {
            lastOverlappingCandidateIndex = this.ranges.length - 1;
        }
        if (lastOverlappingCandidateIndex >= 0) {
            const lastOverlappingCandidate = this.ranges[lastOverlappingCandidateIndex];
            if (lastOverlappingCandidate.endExclusive > newRange.endExclusive) {
                newRange.endExclusive = lastOverlappingCandidate.endExclusive;
            }
            // count back to find how many ranges are overlapping
            overlappingRangeCount = lastOverlappingCandidateIndex - deleteIndex + 1;
        }
        this.ranges.splice(deleteIndex, overlappingRangeCount);
        this.ranges.push(newRange);
        this.ranges.sort((a, b) => a.start - b.start);
    }

    /**
     * Removes a range from the list and aggregates the ranges
     * @param rangeTuple - Tuple of two integers that specify
     * the start and end (exclusive) of a range.
     */
    public remove(rangeTuple: [number, number]): void {
        let deleteRange: IntegerRange;
        try {
            deleteRange = RangeList.createRangeFromTuple(rangeTuple);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            return;
        }

        // there can be up to 2 ranges to add, a remainder of a deleted range on either side
        let leftRemainderRange: IntegerRange | undefined;
        let rightRemainderRange: IntegerRange | undefined;

        // the following is similar to the add method in logic
        let deleteIndex = 0;
        let overlappingRangeCount = 0;

        let firstOverlappingCandidateIndex = this.ranges.findIndex((r) => r.start >= deleteRange.start) - 1;
        if (firstOverlappingCandidateIndex === -2) {
            firstOverlappingCandidateIndex = this.ranges.length - 1;
        }

        if (firstOverlappingCandidateIndex >= 0) {
            const firstOverlappingCandidate = this.ranges[firstOverlappingCandidateIndex];
            // the end is exclusive so it needs to be greater than the start to overlap (unlike the add method)
            if (firstOverlappingCandidate.endExclusive > deleteRange.start) {
                // a portion of the overlapping range remains, so save it
                leftRemainderRange = {
                    start: firstOverlappingCandidate.start,
                    endExclusive: deleteRange.start,
                };
                deleteIndex = firstOverlappingCandidateIndex;
            } else {
                deleteIndex = firstOverlappingCandidateIndex + 1;
            }
        }

        let lastOverlappingCandidateIndex = this.ranges.findIndex((r) => r.start > deleteRange.endExclusive) - 1;
        if (lastOverlappingCandidateIndex === -2) {
            lastOverlappingCandidateIndex = this.ranges.length - 1;
        }
        if (lastOverlappingCandidateIndex >= 0) {
            const lastOverlappingCandidate = this.ranges[lastOverlappingCandidateIndex];
            if (lastOverlappingCandidate.endExclusive > deleteRange.endExclusive) {
                rightRemainderRange = {
                    start: deleteRange.endExclusive,
                    endExclusive: lastOverlappingCandidate.endExclusive,
                };
            }
            overlappingRangeCount = lastOverlappingCandidateIndex - deleteIndex + 1;
        }
        this.ranges.splice(deleteIndex, overlappingRangeCount);
        if (leftRemainderRange) {
            this.ranges.push(leftRemainderRange);
        }
        if (rightRemainderRange) {
            this.ranges.push(rightRemainderRange);
        }
        this.ranges.sort((a, b) => a.start - b.start);
    }

    /**
     * Prints out the range list
     */
    public print(): void {
        let outputString = "";
        for (const [index, range] of this.ranges.entries()) {
            outputString += `[${range.start}, ${range.endExclusive})`;
            if (index !== this.ranges.length - 1) {
                // except for the last item in the list, add space
                outputString += " ";
            }
        }
        // eslint-disable-next-line no-console
        console.log(outputString);
    }
}
