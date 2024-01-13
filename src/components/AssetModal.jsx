import { Box, Modal, Skeleton, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AssetPerformanceChart from "./AssetPerformanceChart";
import FactorRadioChart from "./FactorRadioChart";
import InputBar from "./InputBar";

const url = process.env.REACT_APP_API_URL;
const port = process.env.REACT_APP_API_PORT;
const username = process.env.REACT_APP_API_AUTH_USERNAME;
const password = process.env.REACT_APP_API_AUTH_PASSWORD;

async function getAssetData(endpoint, ticker_code) {
  var credentials = btoa(username + ":" + password);
  var auth = { Authorization: `Basic ${credentials}` };
  var data = await fetch(
    url + ":" + port + endpoint + "?ticker_code=" + ticker_code,
    {
      headers: auth,
    }
  ).then((res) => res.json());
  return data;
}

const style = {
  width: {
    xs: "90%",
  },
  height: {
    xs: "90%",
  },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "grid",
  gridTemplateColumns: "1fr",
  gridTemplateRows: "40px 1fr",
};

const AssetModal = (props) => {
  const [queried, setQueried] = useState(props["queried"]);
  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState(undefined);
  const [factorData, setFactorData] = useState(undefined);
  const handleTabChange = async (_, newTabIndex) => {
    setTabIndex(newTabIndex);
  };
  const closeModal = () => {
    setQueried(false);
    setData(undefined);
    props["handleClose"]();
  };
  useEffect(() => {
    const fetchData = async (ticker, exchange) => {
      setData(undefined);
      var resp = await getAssetData(
        "/ticker-info",
        exchange === "B3" ? `${ticker}.SA` : ticker
      );
      if (resp === null) {
        setData(false);
      } else {
        setData(resp);
      }
      setQueried(true);
    };
    if (!queried && props["open"]) {
      if (typeof props["assetProps"] !== "undefined") {
        fetchData(
          props["assetProps"]["ticker"],
          props["assetProps"]["exchange"]
        );
      }
    }
  }, [props, queried]);
  return (
    <div>
      <Modal
        open={props["open"]}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          ml: {
            sm: "80px",
          },
        }}
      >
        {typeof props["assetProps"] === "undefined" ? (
          <Box sx={style}>
            <Skeleton
              animation="wave"
              variant="rectangle"
              sx={{ flexGrow: 1 }}
            />
          </Box>
        ) : (
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h2"
              component="h2"
              gridRow={1}
              gridColumn={1}
            >
              {props["assetProps"]["ticker"]}
            </Typography>
            <Box
              mt="25px"
              gridRow={2}
              gridColumn={1}
              display="grid"
              gridTemplateColumns="repeat(12, 1fr)"
              gridTemplateRows="50px 1fr"
              overflow="hidden"
              textOverflow="clip"
            >
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                aria-label="Scrollable tabs"
                TabIndicatorProps={{
                  sx: { backgroundColor: props["colors"].blueAccent[600] },
                }}
                sx={{
                  gridColumn: "span 12",
                  gridRow: "span 1",
                  maxWidth: "100%",
                  height: "100%",
                  placeSelf: "center",
                  "& button": { color: props["colors"].grey[100] },
                  "& button:hover": {
                    color: props["colors"].blueAccent[500],
                  },
                  "& button:active": {
                    color: props["colors"].blueAccent[600],
                  },
                  "& button.Mui-selected": {
                    color: props["colors"].blueAccent[500],
                    fontWeight: "bold",
                  },
                }}
              >
                <Tab label="Overview" tabIndex={0} />
                <Tab label="Performance History" tabIndex={1} />
                <Tab label="Factor Scores" tabIndex={2} />
              </Tabs>

              {tabIndex === 0 && (
                <Box
                  gridColumn="span 12"
                  gridRow="100%"
                  display="grid"
                  gridTemplateColumns={{
                    xs: "1fr",
                    md: "1fr 1fr",
                  }}
                  gridTemplateRows={{
                    xs: "1fr 1fr",
                    md: "1fr",
                  }}
                  columnGap={{ xs: 0, md: "30px" }}
                  rowGap={{ xs: "30px", md: 0 }}
                  overflow="hidden"
                  textOverflow="clip"
                >
                  <Box
                    gridColumn="span 1"
                    gridRow="span 1"
                    display="grid"
                    gridTemplateRows="36px 1fr"
                    mt="15px"
                    sx={{ overflowY: "hidden" }}
                  >
                    <Typography variant="h3" sx={{ gridRow: 1, gridColumn: 1 }}>
                      Comapany Description:
                    </Typography>
                    {typeof data === "undefined" || data === false ? (
                      <Box width="100%" mt="5px" gridRow={2} gridColumn={1}>
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                      </Box>
                    ) : (
                      <Box
                        width="100%"
                        mt="5px"
                        sx={{ overflowY: "auto" }}
                        gridRow={2}
                        gridColumn={1}
                      >
                        <Typography
                          paragraph
                          fontSize="14px"
                          sx={{ overflowY: "auto" }}
                        >
                          {typeof data !== "undefined"
                            ? data["longBusinessSummary"]
                            : "No description available for this ticker..."}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Box
                    gridColumn="span 1"
                    gridRow="span 1"
                    display="flex"
                    flexWrap="wrap"
                    mt="15px"
                    sx={{ overflowY: "auto" }}
                  >
                    <Typography variant="h3" sx={{ gridRow: 1, gridColumn: 1 }}>
                      Key Market Data:
                    </Typography>
                    {typeof data === "undefined" || data === false ? (
                      <Box
                        width="100%"
                        mt="20px"
                        sx={{ overflowY: "auto" }}
                        display="flex"
                        flexWrap="wrap"
                        justifyContent="space-between"
                      >
                        <Skeleton
                          animation="wave"
                          sx={{
                            width: {
                              xs: "45%",
                              md: "40%",
                              lg: "31%",
                            },
                            height: "55px",
                          }}
                        />
                        <Skeleton
                          animation="wave"
                          sx={{
                            width: {
                              xs: "45%",
                              md: "40%",
                              lg: "31%",
                            },
                            height: "55px",
                          }}
                        />
                        <Skeleton
                          animation="wave"
                          sx={{
                            width: {
                              xs: "45%",
                              md: "40%",
                              lg: "31%",
                            },
                            height: "55px",
                          }}
                        />
                        <Skeleton
                          animation="wave"
                          sx={{
                            width: {
                              xs: "45%",
                              md: "40%",
                              lg: "31%",
                            },
                            height: "55px",
                          }}
                        />
                        <Skeleton
                          animation="wave"
                          sx={{
                            width: {
                              xs: "45%",
                              md: "40%",
                              lg: "31%",
                            },
                            height: "55px",
                          }}
                        />
                        <Skeleton
                          animation="wave"
                          sx={{
                            width: {
                              xs: "45%",
                              md: "40%",
                              lg: "31%",
                            },
                            height: "55px",
                          }}
                        />
                      </Box>
                    ) : (
                      <Box
                        width="100%"
                        mt="20px"
                        sx={{ overflowY: "auto" }}
                        display="flex"
                        flexWrap="wrap"
                        justifyContent="space-between"
                        height="fit-content"
                      >
                        <Box
                          width={{
                            xs: "45%",
                            md: "40%",
                            lg: "31%",
                          }}
                          display="flex"
                          justifyContent="space-between"
                          padding="15px"
                          borderTop={`${props["colors"].primary[600]} solid`}
                          borderBottom={`${props["colors"].primary[600]} solid`}
                        >
                          <Typography variant="h6">Price:</Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color={
                              props["theme"].palette.mode === "dark"
                                ? props["colors"].blueAccent[300]
                                : props["colors"].blueAccent[400]
                            }
                          >
                            {typeof data["currentPrice"] === "undefined"
                              ? "N/A"
                              : data["currentPrice"].toFixed(2)}{" "}
                            {typeof data["currency"] === "undefined"
                              ? "$"
                              : data["currency"]}
                          </Typography>
                        </Box>
                        <Box
                          width={{
                            xs: "45%",
                            md: "40%",
                            lg: "31%",
                          }}
                          display="flex"
                          justifyContent="space-between"
                          padding="15px"
                          borderTop={`${props["colors"].primary[600]} solid`}
                          borderBottom={`${props["colors"].primary[600]} solid`}
                        >
                          <Typography variant="h6">Return:</Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color={
                              props["theme"].palette.mode === "dark"
                                ? props["colors"].blueAccent[300]
                                : props["colors"].blueAccent[400]
                            }
                          >
                            {typeof data["currentPrice"] /
                              data["previousClose"] ===
                            "undefined"
                              ? "N/A"
                              : (
                                  (data["currentPrice"] /
                                    data["previousClose"] -
                                    1) *
                                  100
                                ).toFixed(2)}
                            {"%"}
                          </Typography>
                        </Box>
                        <Box
                          width={{
                            xs: "45%",
                            md: "40%",
                            lg: "31%",
                          }}
                          display="flex"
                          justifyContent="space-between"
                          padding="15px"
                          borderTop={{
                            xs: undefined,
                            lg: `${props["colors"].primary[600]} solid`,
                          }}
                          borderBottom={`${props["colors"].primary[600]} solid`}
                        >
                          <Typography variant="h6">Mkt. Beta:</Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color={
                              props["theme"].palette.mode === "dark"
                                ? props["colors"].blueAccent[300]
                                : props["colors"].blueAccent[400]
                            }
                          >
                            {typeof data["beta"] === "undefined"
                              ? "N/A"
                              : data["beta"].toFixed(2)}
                          </Typography>
                        </Box>
                        <Box
                          width={{
                            xs: "45%",
                            md: "40%",
                            lg: "31%",
                          }}
                          display="flex"
                          justifyContent="space-between"
                          padding="15px"
                          borderBottom={`${props["colors"].primary[600]} solid`}
                        >
                          <Typography variant="h6">ADTV:</Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color={
                              props["theme"].palette.mode === "dark"
                                ? props["colors"].blueAccent[300]
                                : props["colors"].blueAccent[400]
                            }
                          >
                            {typeof data["fiftyDayAverage"] *
                              data["averageVolume"] ===
                            "undefined"
                              ? "N/A"
                              : (
                                  (data["fiftyDayAverage"] *
                                    data["averageVolume"]) /
                                  1000
                                ).toLocaleString(undefined, {
                                  maximumFractionDigits: 2,
                                  minimumFractionDigits: 2,
                                })}
                          </Typography>
                        </Box>
                        <Box
                          width={{
                            xs: "45%",
                            md: "40%",
                            lg: "31%",
                          }}
                          display="flex"
                          justifyContent="space-between"
                          padding="15px"
                          borderBottom={`${props["colors"].primary[600]} solid`}
                        >
                          <Typography variant="h6">Mkt. Cap:</Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color={
                              props["theme"].palette.mode === "dark"
                                ? props["colors"].blueAccent[300]
                                : props["colors"].blueAccent[400]
                            }
                          >
                            {typeof data["marketCap"] === "undefined"
                              ? "N/A"
                              : (data["marketCap"] / 1000).toLocaleString(
                                  undefined,
                                  {
                                    maximumFractionDigits: 0,
                                    minimumFractionDigits: 0,
                                  }
                                )}
                          </Typography>
                        </Box>
                        <Box
                          width={{
                            xs: "45%",
                            md: "40%",
                            lg: "31%",
                          }}
                          display="flex"
                          justifyContent="space-between"
                          padding="15px"
                          borderBottom={`${props["colors"].primary[600]} solid`}
                        >
                          <Typography variant="h6">EV:</Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color={
                              props["theme"].palette.mode === "dark"
                                ? props["colors"].blueAccent[300]
                                : props["colors"].blueAccent[400]
                            }
                          >
                            {typeof data["enterpriseValue"] === "undefined"
                              ? "N/A"
                              : data["industry"] === "Banks - Regional"
                              ? "N/A"
                              : (data["enterpriseValue"] / 1000).toLocaleString(
                                  undefined,
                                  {
                                    maximumFractionDigits: 0,
                                    minimumFractionDigits: 0,
                                  }
                                )}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    <Typography variant="h3" mt="40px">
                      Other Key Statistics:
                    </Typography>
                    {typeof data === "undefined" ? (
                      <Box
                        width="100%"
                        mt="20px"
                        sx={{ overflowY: "auto" }}
                        display="flex"
                        flexWrap="wrap"
                        justifyContent="space-between"
                      >
                        <Skeleton
                          animation="wave"
                          sx={{
                            width: {
                              xs: "45%",
                              md: "40%",
                              lg: "31%",
                            },
                            height: "55px",
                          }}
                        />
                        <Skeleton
                          animation="wave"
                          sx={{
                            width: {
                              xs: "45%",
                              md: "40%",
                              lg: "31%",
                            },
                            height: "55px",
                          }}
                        />
                        <Skeleton
                          animation="wave"
                          sx={{
                            width: {
                              xs: "45%",
                              md: "40%",
                              lg: "31%",
                            },
                            height: "55px",
                          }}
                        />
                        <Skeleton
                          animation="wave"
                          sx={{
                            width: {
                              xs: "45%",
                              md: "40%",
                              lg: "31%",
                            },
                            height: "55px",
                          }}
                        />
                        <Skeleton
                          animation="wave"
                          sx={{
                            width: {
                              xs: "45%",
                              md: "40%",
                              lg: "31%",
                            },
                            height: "55px",
                          }}
                        />
                        <Skeleton
                          animation="wave"
                          sx={{
                            width: {
                              xs: "45%",
                              md: "40%",
                              lg: "31%",
                            },
                            height: "55px",
                          }}
                        />
                      </Box>
                    ) : (
                      <Box
                        width="100%"
                        mt="20px"
                        sx={{ overflowY: "auto" }}
                        display="flex"
                        flexWrap="wrap"
                        justifyContent="space-between"
                        height="fit-content"
                      >
                        <Box
                          width={{
                            xs: "45%",
                            md: "40%",
                            lg: "31%",
                          }}
                          display="flex"
                          justifyContent="space-between"
                          padding="15px"
                          borderTop={`${props["colors"].primary[600]} solid`}
                          borderBottom={`${props["colors"].primary[600]} solid`}
                        >
                          <Typography variant="h6">ROA:</Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color={
                              props["theme"].palette.mode === "dark"
                                ? props["colors"].blueAccent[300]
                                : props["colors"].blueAccent[400]
                            }
                          >
                            {typeof data["returnOnAssets"] === "undefined"
                              ? "N/A"
                              : data["returnOnAssets"].toFixed(2)}
                          </Typography>
                        </Box>
                        <Box
                          width={{
                            xs: "45%",
                            md: "40%",
                            lg: "31%",
                          }}
                          display="flex"
                          justifyContent="space-between"
                          padding="15px"
                          borderTop={`${props["colors"].primary[600]} solid`}
                          borderBottom={`${props["colors"].primary[600]} solid`}
                        >
                          <Typography variant="h6">ROE:</Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color={
                              props["theme"].palette.mode === "dark"
                                ? props["colors"].blueAccent[300]
                                : props["colors"].blueAccent[400]
                            }
                          >
                            {typeof data["returnOnEquity"] === "undefined"
                              ? "N/A"
                              : data["returnOnEquity"].toFixed(2)}
                          </Typography>
                        </Box>
                        <Box
                          width={{
                            xs: "45%",
                            md: "40%",
                            lg: "31%",
                          }}
                          display="flex"
                          justifyContent="space-between"
                          padding="15px"
                          borderTop={{
                            xs: undefined,
                            lg: `${props["colors"].primary[600]} solid`,
                          }}
                          borderBottom={`${props["colors"].primary[600]} solid`}
                        >
                          <Typography variant="h6">PE Ratio:</Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color={
                              props["theme"].palette.mode === "dark"
                                ? props["colors"].blueAccent[300]
                                : props["colors"].blueAccent[400]
                            }
                          >
                            {typeof data["trailingPE"] === "undefined"
                              ? "N/A"
                              : data["trailingPE"].toFixed(2)}
                          </Typography>
                        </Box>
                        <Box
                          width={{
                            xs: "45%",
                            md: "40%",
                            lg: "31%",
                          }}
                          display="flex"
                          justifyContent="space-between"
                          padding="15px"
                          borderBottom={`${props["colors"].primary[600]} solid`}
                        >
                          <Typography variant="h6">Price/Book:</Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color={
                              props["theme"].palette.mode === "dark"
                                ? props["colors"].blueAccent[300]
                                : props["colors"].blueAccent[400]
                            }
                          >
                            {typeof data["priceToBook"] === "undefined"
                              ? "N/A"
                              : data["priceToBook"].toFixed(2)}
                          </Typography>
                        </Box>
                        <Box
                          width={{
                            xs: "45%",
                            md: "40%",
                            lg: "31%",
                          }}
                          display="flex"
                          justifyContent="space-between"
                          padding="15px"
                          borderBottom={`${props["colors"].primary[600]} solid`}
                        >
                          <Typography variant="h6">EV/EBITDA:</Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color={
                              props["theme"].palette.mode === "dark"
                                ? props["colors"].blueAccent[300]
                                : props["colors"].blueAccent[400]
                            }
                          >
                            {typeof data["enterpriseToEbitda"] === "undefined"
                              ? "N/A"
                              : data["enterpriseToEbitda"].toFixed(2)}
                          </Typography>
                        </Box>
                        <Box
                          width={{
                            xs: "45%",
                            md: "40%",
                            lg: "31%",
                          }}
                          display="flex"
                          justifyContent="space-between"
                          padding="15px"
                          borderBottom={`${props["colors"].primary[600]} solid`}
                        >
                          <Typography variant="h6">EPS:</Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color={
                              props["theme"].palette.mode === "dark"
                                ? props["colors"].blueAccent[300]
                                : props["colors"].blueAccent[400]
                            }
                          >
                            {typeof data["trailingEps"] === "undefined"
                              ? "N/A"
                              : data["trailingEps"].toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
              {tabIndex === 1 && (
                <Box
                  gridColumn="span 12"
                  gridRow="100%"
                  display="flex"
                  overflow="hidden"
                  textOverflow="clip"
                  mt="10px"
                >
                  <AssetPerformanceChart
                    ticker_code={props["assetProps"]["ticker"]}
                    equity_id={props["assetProps"]["id"]}
                    queried={false}
                  />
                </Box>
              )}
              {tabIndex === 2 && (
                <Box
                  gridColumn="span 12"
                  gridRow="100%"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  overflow="hidden"
                  textOverflow="clip"
                  mt="20px"
                >
                  <Box
                    height="100%"
                    width={{ xs: "100%", md: "auto" }}
                    display={{ xs: "flex", md: "block" }}
                    flexDirection={{ xs: "column", md: "undefined" }}
                    // alignItems={{ xs: "center", md: "undefined" }}
                  >
                    <InputBar
                      defaultAsset={props["assetProps"]["ticker"]}
                      onValueChange={setFactorData}
                    />
                    <Box height="calc(100% - 60px)">
                      <FactorRadioChart data={factorData} />
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Modal>
    </div>
  );
};

export default AssetModal;
