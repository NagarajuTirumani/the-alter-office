import { useState } from "react";
import AgencyTabs from "./AgencyTabs";
import POCForm from "./POCForm";

export default function POCSection({ pocs, onAdd, onRemove, onChange, errors }) {
  const [activePOC, setActivePOC] = useState(0);

  function handleAdd() {
    onAdd();
    setActivePOC(pocs.length); // switch to the newly added tab
  }

  function handleRemove(index) {
    onRemove(index);
    setActivePOC(Math.max(0, index - 1));
  }

  const tabItems = pocs.map((poc, i) => ({ id: poc.id, label: "POC " + (i + 1) }));

  return (
    <div>
      <AgencyTabs
        items={tabItems}
        activeIndex={activePOC}
        onSelect={setActivePOC}
        onRemove={handleRemove}
        onAdd={handleAdd}
        addLabel="+ ADD POC"
      />
      <POCForm
        poc={pocs[activePOC]}
        pocIndex={activePOC}
        onChange={onChange}
        errors={errors}
      />
    </div>
  );
}