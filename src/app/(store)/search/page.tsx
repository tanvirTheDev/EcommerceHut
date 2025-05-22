type searchParams = {
  query: string;
};
const SearchPage = async ({ searchParams }: { searchParams: searchParams }) => {
  const { query } = searchParams;
  return <div>{query}</div>;
};

export default SearchPage;
