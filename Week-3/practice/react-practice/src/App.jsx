import Card from "./components/Card";
import Header from "./components/Header";
import SearchField from "./components/SearchField";

import members from "./data/members.json" with { type: "json" };
import { useSearch } from "./hooks/useSearch";

function App() {
  const { search, filteredData, handleSearchChange, handleSearchClick } = useSearch(members);

  return (
    <>
      <Header />
      <SearchField
        search={search}
        handleSearchChange={handleSearchChange}
        handleSearchClick={handleSearchClick}
      />
      <section style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {filteredData.map((member) => (
          <Card key={member.id} {...member} />
        ))}
      </section>
    </>
  );
}

export default App;
