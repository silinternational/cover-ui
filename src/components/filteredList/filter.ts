export default class Filter {

    constructor(filterValue) {
        this.filterValue = filterValue
    }

    /**
     *
     *
     * @param {Function} func
     * @memberof Filter
     */
    setFilterFunc(func) {
        this.func = func
    }

    /**
     * 
     * @description function to filter items, applying this filter
     * @param {Array} items
     * @returns {Array} 
     */
    filter(items) {
        if (!this.func) {
            return items
        }
        return items.filter(i => this.func(i))
    }

}