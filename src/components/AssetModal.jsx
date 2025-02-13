import { Box, Modal, Skeleton, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AssetPerformanceChart from "./AssetPerformanceChart";
import FactorRadioChart from "./FactorRadioChart";
import { faker } from "@faker-js/faker";

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
  const handleTabChange = async (_, newTabIndex) => {
    setTabIndex(newTabIndex);
  };
  const closeModal = () => {
    setQueried(false);
    props["handleClose"]();
  };
  useEffect(() => {
    const fetchData = async (ticker, exchange) => {
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
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum. Curabitur pretium tincidunt lacus.
                        Nulla gravida orci a odio. Nullam varius, turpis et
                        commodo pharetra, est eros bibendum elit, nec luctus
                        magna felis sollicitudin mauris. Integer in mauris eu
                        nibh euismod gravida. Duis ac tellus et risus vulputate
                        vehicula. Donec lobortis risus a elit. Etiam tempor. Ut
                        ullamcorper, ligula eu tempor congue, eros est euismod
                        turpis, id tincidunt sapien risus a quam. Maecenas
                        fermentum consequat mi. Donec fermentum. Pellentesque
                        malesuada nulla a mi. Duis sapien sem, aliquet nec,
                        commodo eget, consequat quis, neque. Aliquam faucibus,
                        elit ut dictum aliquet, felis nisl adipiscing sapien,
                        sed malesuada diam lacus eget erat. Cras mollis
                        scelerisque nunc. Nullam arcu. Aliquam consequat.
                        Curabitur augue lorem, dapibus quis, laoreet et, pretium
                        ac, nisi. Aenean magna nisl, mollis quis, molestie eu,
                        feugiat in, orci. In hac habitasse platea dictumst.
                      </Typography>
                    </Box>
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
                          R${" "}
                          {faker.number
                            .float({ min: 1, max: 100, precision: 0.01 })
                            .toFixed(2)}
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
                          {faker.number.float({ min: -5, max: 5 }).toFixed(2)}
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
                          {faker.number
                            .float({ min: 0.5, max: 1.5, precision: 0.01 })
                            .toFixed(2)}
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
                          {faker.number
                            .float({ min: 1000, max: 1000000, precision: 0.01 })
                            .toLocaleString(undefined, {
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
                          {faker.number
                            .int({ min: 1000000, max: 1000000000 })
                            .toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                              minimumFractionDigits: 0,
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
                          {faker.number
                            .int({ min: 1000000, max: 1000000000 })
                            .toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                              minimumFractionDigits: 0,
                            })}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h3" mt="40px">
                      Other Key Statistics:
                    </Typography>
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
                          {faker.number
                            .float({ min: -10, max: 10, precision: 0.01 })
                            .toFixed(2)}
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
                          {faker.number
                            .float({ min: -10, max: 10, precision: 0.01 })
                            .toFixed(2)}
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
                          {faker.number
                            .float({ min: 5, max: 30, precision: 0.01 })
                            .toFixed(2)}
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
                          {faker.number
                            .float({ min: 0.5, max: 5, precision: 0.01 })
                            .toFixed(2)}
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
                          {faker.number
                            .float({ min: 5, max: 20, precision: 0.01 })
                            .toFixed(2)}
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
                          {faker.number
                            .float({ min: 0.5, max: 5, precision: 0.01 })
                            .toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
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
                    width={{ xs: "100%", md: "100%" }}
                    display={{ xs: "flex", md: "block" }}
                    flexDirection={{ xs: "column", md: "undefined" }}
                    // alignItems={{ xs: "center", md: "undefined" }}
                  >
                    <Box height="calc(100% - 60px)">
                      <FactorRadioChart
                        data={{
                          ticker: props["assetProps"]["ticker"],
                          quality: faker.number.float({
                            min: 0,
                            max: 10,
                            precision: 0.01,
                          }),
                          momentum: faker.number.float({
                            min: 0,
                            max: 10,
                            precision: 0.01,
                          }),
                          size: faker.number.float({
                            min: 0,
                            max: 10,
                            precision: 0.01,
                          }),
                          value: faker.number.float({
                            min: 0,
                            max: 10,
                            precision: 0.01,
                          }),
                          volatility: faker.number.float({
                            min: 0,
                            max: 10,
                            precision: 0.01,
                          }),
                        }}
                      />
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
