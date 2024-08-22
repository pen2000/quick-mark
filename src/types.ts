interface Preferences {
  directory: string;
  issueRepository: string;
  prRepository: string;
  owner: string;
}

interface BookmarkInfo {
  name: string;
  description: string;
  url: string;
  tags: string[];
  status: string;
}

interface BookmarkInput {
  name: string;
  description: string;
  url: string;
  tagStrings: string;
  status: string;
}

interface BookmarkFile {
  fileName: string;
  filePath: string;
  bookmarkInfo: BookmarkInfo;
}

enum Filter {
  All = "all",
  Archived = "archived",
}

export { Filter };
export type { Preferences, BookmarkInfo, BookmarkInput, BookmarkFile };
