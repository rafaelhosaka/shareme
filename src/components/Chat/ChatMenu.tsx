import MenuList from "../MenuList/MenuList";
import MenuItem from "../MenuList/MenuItem";
import { NavLink } from "react-router-dom";

const ChatMenu = () => {
  return (
    <div className="left-content">
      <MenuList title="Chat">
        <MenuItem>
          <NavLink to={"all"}>All friends</NavLink>
        </MenuItem>
      </MenuList>
    </div>
  );
};

export default ChatMenu;
