import { ActionPanel, List, Icon } from "@raycast/api";
import CreateAction from "./createAction";

export default function EmptyView(props: { onReload: () => void }) {
  return (
    <List.EmptyView
      icon={{ source: Icon.MagnifyingGlass }}
      title="Not found"
      actions={
        <ActionPanel>
          <CreateAction onReload={props.onReload} />
        </ActionPanel>
      }
    />
  );
}
