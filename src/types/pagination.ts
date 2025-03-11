export type pagination = {
  totalData: number;
  limit: number;
  currentPage: number;
  totalPage: number;
};

export type pageAble<Type> = {
  response: Array<Type>;
  pagination: pagination;
};
