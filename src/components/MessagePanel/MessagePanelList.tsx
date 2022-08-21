import { useEffect, useState } from "react";
import { useChat } from "../../context/chatContext";
import MessagePanel from "./MessagePanel";
import css from "./MessagePanel.module.scss";

export interface Panel {
  minimized: boolean;
  userId: string;
  userName: string;
  imageUrl: string | undefined;
}

function MessagePanelList() {
  const { panels: ids, close, minimize, maximize } = useChat();
  const [panels, setPanels] = useState<Panel[]>([]);

  useEffect(() => {
    setPanels(ids);
  }, [ids]);

  const handleMinimize = (userId: string, imageUrl: string | undefined) => {
    if (minimize) {
      minimize(userId, imageUrl);
    }
  };

  const handleClose = (userId: string) => {
    if (close) {
      close(userId);
    }
  };

  return (
    <div className={css["message-panel-list__container"]}>
      {panels.map((panel) => (
        <MessagePanel
          key={panel.userId}
          minimized={panel.minimized}
          chattingUserId={panel.userId}
          onMinimized={handleMinimize}
          onClose={handleClose}
        />
      ))}
      <div className={css["minimized-panels__container"]}>
        {panels.map(
          (panel) =>
            panel.minimized && (
              <div key={panel.userId} className={css["minimized-panel"]}>
                <div className={css["minimized-user-name"]}>
                  <div className={"tooltip-text left"}>{panel.userName}</div>
                </div>
                <img
                  onClick={() => {
                    if (maximize) maximize(panel.userId);
                  }}
                  className={css["minimized-user-image"]}
                  src={panel.imageUrl}
                />
              </div>
            )
        )}
      </div>
    </div>
  );
}

export default MessagePanelList;
