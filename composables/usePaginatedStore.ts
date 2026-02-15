import { reactive, computed } from "vue";

export function usePaginatedStore<T>(perPage = 10) {
  const data = reactive<PaginatedData<T>>({
    rows: [],
    pagination: {
      total: 0,
      lastPage: null,
      perPage,
      prevPage: null,
      currentPage: 1,
      nextPage: null,
    },
  });

  function resetData() {
    data.rows = [];
    data.pagination = {
      total: 0,
      lastPage: null,
      perPage,
      prevPage: null,
      currentPage: 1,
      nextPage: null,
    };
  }

  function putData(rows: T[], pagination: Pagination) {
    const totalPage = pagination.lastPage || 1;
    const currentPage = pagination.currentPage;
    const existingPages = (data.rows ?? []) as unknown as T[][];
    const newPages: T[][] = [];

    for (let i = 0; i < totalPage; i++) {
      const page = i + 1;
      newPages[i] = page === currentPage ? rows : existingPages[i] || [];
    }

    data.rows = newPages as unknown as typeof data.rows;
    data.pagination = pagination;
  }

  function updatePagination(page: number) {
    const { lastPage } = data.pagination;
    data.pagination = {
      ...data.pagination,
      currentPage: page,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: lastPage && page < lastPage ? page + 1 : null,
    };
  }

  function addItem(item: T) {
    const perPage = data.pagination.perPage;
    const rows = data.rows.map(page => [...page]); // shallow copy pages
    const id = (item as any).id;

    let totalData = data.pagination.total;
    let existed = false;

    // De-dup: remove existing item with the same id (if any)
    if (id !== undefined) {
      for (let i = 0; i < rows.length; i++) {
        const index = (rows[i] as any[]).findIndex((row: any) => row.id === id);
        if (index !== -1) {
          rows[i].splice(index, 1);
          existed = true;
          break;
        }
      }
    }

    if (!existed) {
      totalData += 1;
    }

    const lastPage = Math.max(1, Math.ceil(totalData / perPage));

    if (rows.length === 0) rows.push([]);
    rows[0].unshift(item as any);

    // Shift items if needed to respect perPage
    for (let i = 0; i < rows.length; i++) {
      while (rows[i].length > perPage) {
        const nextItem = rows[i].pop();
        if (!rows[i + 1]) rows[i + 1] = [];
        rows[i + 1].unshift(nextItem as any);
      }
    }

    data.rows = rows;
    data.pagination = {
      ...data.pagination,
      total: totalData,
      lastPage,
      currentPage: 1,
      prevPage: null,
      nextPage: lastPage > 1 ? 2 : null,
    };
  }

  function editItem(item: Partial<T> & { id: any }) {
    const found = getItem({ id: item.id });
    if (found) {
      const { pageIndex, itemIndex } = found;
      const currentItem = data.rows[pageIndex][itemIndex];
      const updatedItem = { ...currentItem, ...item };

      data.rows[pageIndex][itemIndex] = updatedItem;
      data.rows = [...data.rows];

      return updatedItem;
    }
  }

  function deleteItem(item: { id: any }) {
    const perPage = data.pagination.perPage;
    let total = data.pagination.total - 1;
    let lastPage = Math.ceil(total / perPage);
    const rows = [...data.rows];

    for (let i = 0; i < rows.length; i++) {
      const index = rows[i].findIndex((e: any) => e.id === item.id);
      if (index !== -1) {
        rows[i].splice(index, 1);
        break;
      }
    }

    if (rows.length > lastPage) rows.splice(lastPage);
    data.rows = rows;
    data.pagination = {
      ...data.pagination,
      total,
      lastPage,
    };
  }

  function getItem(item: { id: any }) {
    for (let pageIndex = 0; pageIndex < data.rows.length; pageIndex++) {
      const foundItem = data.rows[pageIndex].find((e: any) => e.id === item.id);
      if (foundItem) {
        return {
          item: foundItem,
          pageIndex,
          itemIndex: data.rows[pageIndex].indexOf(foundItem),
        };
      }
    }
    return null;
  }

  const hasMore = computed(() => {
    const { currentPage, lastPage } = data.pagination;
    return lastPage ? currentPage < lastPage : false;
  });

  return {
    data,
    resetData,
    putData,
    updatePagination,
    addItem,
    editItem,
    deleteItem,
    getItem,
    hasMore,
  };
}
