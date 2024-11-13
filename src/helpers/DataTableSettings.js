export default class DataTableSettings {
    static paginationPerPage = 10;
    static paginationRowsPerPageOptions = [10, 25, 50, 100];

    static filterItems = (items, searchParam, filterText) => {
        return items.filter((item) => {
            return Object.keys(item).some((key) =>
                item[key] !== null && searchParam.includes(key)
                    ? item[key]
                        .toString()
                        .toLowerCase()
                        .includes(filterText.toLowerCase())
                    : false
            );
        });
    };
}