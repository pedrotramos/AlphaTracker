import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { Menu, MenuItem, ProSidebar } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";

const Item = ({ title, to, icon, selected, setSelected, setIsCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => {
        setSelected(title);
        setIsCollapsed(true);
      }}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar": {
          position: "fixed !important",
          top: "0 !important",
          left: 0,
          height: "100vh",
        },
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: `${colors.blueAccent[500]} !important`,
        },
        "& .pro-menu-item.active": {
          color: `${colors.blueAccent[600]} !important`,
        },
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        zIndex: 1000,
      }}
    >
      <ProSidebar collapsed={isCollapsed} width="250px">
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          {!isCollapsed ? (
            <Box m="10px 15px 20px 15px" color={colors.grey[100]}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <GpsFixedIcon />
                <h1>AlphaTracker™</h1>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            </Box>
          ) : (
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: "5px 0 15px 0",
                color: colors.grey[100],
              }}
            ></MenuItem>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Live Performance"
              to="/"
              icon={<SensorsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setIsCollapsed={setIsCollapsed}
            />
            <Item
              title="Stocks Information"
              to="/stocks"
              icon={<CurrencyExchangeIcon />}
              selected={selected}
              setSelected={setSelected}
              setIsCollapsed={setIsCollapsed}
            />
            <Item
              title="AUM"
              to="/aum"
              icon={<SavingsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              setIsCollapsed={setIsCollapsed}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
