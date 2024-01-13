import {
  Box,
  Skeleton,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../global/Header";
import { useState, useEffect } from "react";
import AssetModal from "../../components/AssetModal";

const url = process.env.REACT_APP_API_URL;
const port = process.env.REACT_APP_API_PORT;
const username = process.env.REACT_APP_API_AUTH_USERNAME;
const password = process.env.REACT_APP_API_AUTH_PASSWORD;

async function getFundFamilyNames() {
  var credentials = btoa(username + ":" + password);
  var auth = { Authorization: `Basic ${credentials}` };
  var data = await fetch(url + ":" + port + "/fund-family-names", {
    headers: auth,
  }).then((res) => res.json());
  return data;
}

async function getAssets(fund_name) {
  var credentials = btoa(username + ":" + password);
  var auth = { Authorization: `Basic ${credentials}` };
  var data = await fetch(
    url + ":" + port + "/assets?family_name=" + fund_name,
    {
      headers: auth,
    }
  ).then((res) => res.json());
  return data;
}

function genTabs(fundNames) {
  var tabs = [];
  fundNames.forEach((name, idx) => {
    tabs.push(<Tab label={name} tabIndex={idx} key={`tab${idx}`} />);
  });
  return tabs;
}

const StocksPerformance = () => {
  const mobile = useMediaQuery("(max-width: 600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tabIndex, setTabIndex] = useState(0);
  const [queried, setQueried] = useState(false);
  const [assetData, setAssetData] = useState([]);
  const [fundNames, setFundNames] = useState(undefined);
  const [openModal, setOpenModal] = useState(false);
  const [assetProps, setAssetProps] = useState(undefined);
  const handleOpenModal = (params) => {
    setOpenModal(true);
    setAssetProps(params.row);
  };
  const handleCloseModal = () => {
    setQueried(false);
    setOpenModal(false);
  };
  const handleTabChange = async (_, newTabIndex) => {
    setTabIndex(newTabIndex);
    const data = await getAssets(fundNames[newTabIndex]);
    setAssetData(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      const fNames = await getFundFamilyNames();
      setFundNames(fNames);
      const aData = await getAssets(fNames[tabIndex]);
      setAssetData(aData);
    };
    fetchData();
    const interval = setInterval(() => fetchData(), 150000); // Fetch every 2.5 min
    return () => {
      clearInterval(interval);
    };
  }, [tabIndex]);

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "ticker",
      headerName: "Ticker",
      cellClassName: "name-column--cell",
      headerAlign: "center",
      align: "center",
      hideable: false,
      flex: 1,
    },
    {
      field: "exchange",
      headerName: "Exchange",
      cellClassName: "name-column--cell",
      headerAlign: "center",
      align: "center",
      hideable: false,
      flex: 1,
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex: 1,
      hideable: true,
      valueFormatter: (params) => {
        return `R$ ${params.value.toFixed(2)} `;
      },
    },
    {
      field: "return",
      headerName: "Return",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex: 1,
      valueFormatter: (params) => {
        const valueFormatted = Number(params.value * 100).toFixed(2);
        return `${valueFormatted} %`;
      },
    },
    {
      field: "position",
      headerName: "Position",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "weight",
      headerName: "Weight",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex: 1,
      valueFormatter: (params) => {
        const valueFormatted = Number(params.value * 100).toFixed(2);
        return `${valueFormatted} %`;
      },
    },
    {
      field: "contribution",
      headerName: "Contribution",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex: 1,
      valueFormatter: (params) => {
        const valueFormatted = Number(params.value * 100).toFixed(2);
        return `${valueFormatted} %`;
      },
    },
  ];

  return (
    <Box m="20px" ml="100px">
      <Header
        title="STOCKS INFORMATION"
        subtitle="View the Information of Individual Stocks"
      />
      <Box m="40px auto 15px auto" sx={{ width: "100%", height: "100%" }}>
        {typeof fundNames === "undefined" ? (
          <Box
            margin="0 auto"
            display="flex"
            justifyContent="center"
            width={{
              xs: "100%",
              sm: "75%",
              md: "50%",
            }}
          >
            <Skeleton width="75%" height="48px" />
          </Box>
        ) : (
          <Box
            margin="0 auto"
            display="flex"
            justifyContent="center"
            width={{
              xs: "100%",
              sm: "75%",
              md: "50%",
            }}
          >
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              aria-label="scrollable auto tabs example"
              TabIndicatorProps={{
                sx: { backgroundColor: colors.blueAccent[600] },
              }}
              sx={{
                "& button": { color: colors.grey[100] },
                "& button:hover": { color: colors.blueAccent[500] },
                "& button:active": { color: colors.blueAccent[600] },
                "& button.Mui-selected": {
                  color: colors.blueAccent[500],
                  fontWeight: "bold",
                },
              }}
            >
              {genTabs(fundNames)}
            </Tabs>
          </Box>
        )}
        <Box
          m="10px auto 0 auto"
          height="70vh"
          width={{
            xs: "100%",
            sm: "87.5%",
            md: "75%",
          }}
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color:
                theme.palette.mode === "dark"
                  ? colors.blueAccent[300]
                  : colors.blueAccent[400],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? colors.blueAccent[700]
                  : colors.blueAccent[300],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? colors.blueAccent[700]
                  : colors.blueAccent[300],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
            "& MuiButton-text": {
              color: `${colors.greenAccent[500]} !important`,
            },
          }}
        >
          {mobile ? (
            <DataGrid
              rows={assetData}
              columns={columns}
              columnVisibilityModel={{
                id: false,
                exchange: false,
                price: false,
                return: false,
                weight: false,
              }}
              onRowClick={handleOpenModal}
            />
          ) : (
            <DataGrid
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    id: false,
                  },
                },
              }}
              rows={assetData}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                panel: {
                  sx: {
                    "& .Mui-checked": {
                      color: `${colors.blueAccent[500]} !important`,
                    },
                    "& .Mui-disabled": {
                      color: `${colors.primary[700]} !important`,
                    },
                    "& .Mui-checked+.MuiSwitch-track": {
                      bgcolor: `${colors.blueAccent[200]} !important`,
                    },
                  },
                },
              }}
              onRowClick={handleOpenModal}
            />
          )}
          <AssetModal
            open={openModal}
            handleClose={handleCloseModal}
            assetProps={assetProps}
            colors={colors}
            theme={theme}
            queryCount={queried}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default StocksPerformance;
