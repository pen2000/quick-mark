import { Action, Alert, confirmAlert, Icon, showToast, Toast } from "@raycast/api";
import { BookmarkFile, Filter } from "../types";
import fs from "fs";

export default function ArchiveAction(props: { file: BookmarkFile; onReload: () => void }) {
  const options: Alert.Options = {
    icon: Icon.Tray,
    title: "Do you want to archive it?",
    message: "Items that have been archived can be viewed by selecting the 'ARCHIVED' filter.",
    primaryAction: {
      title: "Archive",
      style: Alert.ActionStyle.Destructive,
      onAction: () => {
        const bookmarkInfo = props.file.bookmarkInfo;
        bookmarkInfo.status = Filter.Archived;
        const jsonString = JSON.stringify(bookmarkInfo, null, 2);
        fs.writeFile(props.file.filePath, jsonString, "utf8", (err) => {
          if (err) {
            showToast({
              style: Toast.Style.Failure,
              title: "An error occurred",
              message: err.message,
            });
          } else {
            showToast({
              style: Toast.Style.Success,
              title: "Successfully",
              message: props.file.fileName,
            });
            props.onReload();
          }
        });
      },
    },
    dismissAction: {
      title: "Cancel",
      style: Alert.ActionStyle.Cancel,
    },
  };
  const archiveAction = async () => {
    await confirmAlert(options);
  };

  return <Action title="Archive" icon={{ source: Icon.Tray }} onAction={() => archiveAction()} />;
}
