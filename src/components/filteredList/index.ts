import FilteredList from './FilteredList.svelte'
import Filter from './filter'

FilteredList.Filter = Filter

/**
 *
 * @param {Array} filters
 * @param {Filter} filter
 * @param {Object} newValue
 * @returns {Array}
 */
FilteredList.updateFilterValue = (filters, filter, newValue) => {
  const i = filters.indexOf(filter)
  filter.filterValue = newValue
  filters[i] = filter
  return filters
}

export default FilteredList
