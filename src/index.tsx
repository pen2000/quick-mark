import { List, getPreferenceValues } from "@raycast/api";
import EmptyView from "./components/emptyView";
import fs from "fs";
import path from "path";
import { useEffect, useState } from "react";
import { Preferences, Filter, BookmarkFile, BookmarkInfo } from "./types";
import ListItem from "./components/listItem";

type State = {
  filter: Filter;
  isLoading: boolean;
  searchText: string;
  files: BookmarkFile[];
  visibleFiles: BookmarkFile[];
  reload: boolean;
  tags: string[];
};

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const { directory } = preferences;

  const [state, setState] = useState<State>({
    filter: Filter.All,
    isLoading: true,
    searchText: "",
    files: [],
    visibleFiles: [],
    reload: false,
    tags: [],
  });

  // 初回時の描画
  useEffect(() => {
    setState((previous) => ({ ...previous, reload: true }));
  }, []);

  // reload指定時の描画
  useEffect(() => {
    const files = convertFiles();
    const allTags = files.map((file) => file.bookmarkInfo.tags).flat();
    const tags = [...new Set(allTags)];
    setState((previous) => ({
      ...previous,
      files: files,
      visibleFiles: files,
      reload: false,
      isLoading: false,
      tags: tags,
    }));
  }, [state.reload]);

  // searchTextが空の場合は全てを表示
  const filterBySearchText = (bookmarkInfo: BookmarkInfo) => {
    if (state.searchText === "") {
      return true;
    } else {
      return bookmarkInfo.name.includes(state.searchText) || bookmarkInfo.description.includes(state.searchText);
    }
  };

  // ファイルをオブジェクトに変換
  const convertFiles = () => {
    try {
      const files = fs.readdirSync(directory);
      return files
        .filter((file) => path.extname(file) === ".json")
        .map((file) => {
          const filePath = path.join(directory, file);
          const fileContent = fs.readFileSync(filePath, "utf-8");
          return {
            fileName: file,
            filePath: filePath,
            bookmarkInfo: JSON.parse(fileContent) as BookmarkInfo,
          };
        });
    } catch (err) {
      console.error("Failed to parse JSON", err);
      return [];
    }
  };

  const filterFiles = () => {
    if (state.filter === Filter.All) {
      return state.files
        .filter((file) => file.bookmarkInfo.status === Filter.All)
        .filter((file) => filterBySearchText(file.bookmarkInfo));
    } else if (state.filter === Filter.Archived) {
      return state.files
        .filter((file) => file.bookmarkInfo.status === Filter.Archived)
        .filter((file) => filterBySearchText(file.bookmarkInfo));
    } else {
      return state.files
        .filter((file) => file.bookmarkInfo.tags.some((tag) => tag === state.filter))
        .filter((file) => filterBySearchText(file.bookmarkInfo));
    }
  };

  const handleReload = () => {
    setState((previous) => ({ ...previous, reload: true }));
  };

  return (
    <List
      navigationTitle="QuickMark"
      isLoading={state.isLoading}
      searchText={state.searchText}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Select tag"
          value={state.filter}
          onChange={(newValue) =>
            setState((previous) => ({
              ...previous,
              filter: newValue as Filter,
            }))
          }
        >
          <List.Dropdown.Section>
            <List.Dropdown.Item title="ALL" value={Filter.All} />
            <List.Dropdown.Item title="ARCHIVED" value={Filter.Archived} />
          </List.Dropdown.Section>
          {state.tags.map((tag) => {
            return <List.Dropdown.Item title={tag} value={tag} key={tag} />;
          })}
        </List.Dropdown>
      }
      filtering={false}
      onSearchTextChange={(newValue) => {
        setState((previous) => ({ ...previous, searchText: newValue }));
      }}
    >
      {filterFiles().length === 0 ? (
        <EmptyView onReload={handleReload} />
      ) : (
        filterFiles().map((file) => ListItem(file, handleReload))
      )}
    </List>
  );
}
