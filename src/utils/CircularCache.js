class CircularCache {
    constructor(maxSize) {
        this.ary = Array(maxSize + 1).fill(null);
        this.begin = 0;
        this.end = 0;
        this.cur = null;
    }

    getSize() {
        const n = this.ary.length;
        return (this.end - this.begin + n) % n;
    }

    push(item) {
        let n = this.ary.length;
        // if the cache is empty
        if (null === this.cur) {
            this.cur = this.begin;
            this.ary[this.cur] = item;
            return;
        }
        // abandon all elements after cur
        this.end = (this.cur + 1) % n;
        if (this.getSize() >= n - 1) {
            this.begin = (this.begin + 1) % n;
        }
        this.cur = (this.cur + 1) % n;
        this.ary[this.cur] = item;
        this.end = (this.cur + 1) % n;
    }

    hasNext() {
        let n = this.ary.length;
        if (null === this.cur) {
            return false;
        }
        let curLen = (this.cur + 1 - this.begin + n) % n;
        if (curLen <= this.getSize() - 1) {
            return true;
        }
        return false;
    }

    moveNext() {
        let n = this.ary.length;
        if (this.hasNext()) {
            this.cur = (this.cur + 1) % n;
            return this.ary[this.cur];
        }
        return null;
    }

    hasPrev() {
        let n = this.ary.length;
        if (null === this.cur) {
            return false;
        }
        let curLen = (this.cur + 1 - this.begin + n) % n;
        if (curLen >= 2) {
            return true;
        }
        return false;
    }

    movePrev() {
        let n = this.ary.length;
        if (this.hasPrev()) {
            this.cur = (this.cur - 1 + n) % n;
            return this.ary[this.cur];
        }
        return null;
    }
}

export { CircularCache }
