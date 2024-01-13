import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { Skeleton } from "@mui/material";

const url = process.env.REACT_APP_API_URL;
const port = process.env.REACT_APP_API_PORT;
const username = process.env.REACT_APP_API_AUTH_USERNAME;
const password = process.env.REACT_APP_API_AUTH_PASSWORD;

async function getScoreOptions() {
  var credentials = btoa(username + ":" + password);
  var auth = { Authorization: `Basic ${credentials}` };
  var data = await fetch(url + ":" + port + "/score-options", {
    headers: auth,
  }).then((res) => res.json());
  return data;
}

async function getScores(assets) {
  var credentials = btoa(username + ":" + password);
  var auth = { Authorization: `Basic ${credentials}` };
  var data = await fetch(url + ":" + port + "/scores?assets=" + assets, {
    headers: auth,
  }).then((res) => res.json());
  return data;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(opt, personName, theme) {
  return {
    backgroundColor:
      personName.indexOf(opt) === -1
        ? theme.palette.neutral.neutral
        : theme.palette.neutral.dark,
  };
}

export default function InputBar(props) {
  const theme = useTheme();
  const [assetOptions, setAssetOptions] = useState([]);
  const [personName, setPersonName] = useState([props["defaultAsset"]]);
  const handleChange = async (event) => {
    const {
      target: { value },
    } = event;
    props["onValueChange"](undefined);
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    var factorScores = await getScores(value);
    props["onValueChange"](factorScores);
  };

  useEffect(() => {
    const fetchOptions = async () => {
      if (assetOptions.length === 0) {
        var factorScores = await getScores(personName);
        props["onValueChange"](factorScores);
        var scoreOptions = await getScoreOptions();
        setAssetOptions(scoreOptions);
      }
    };
    fetchOptions();
  }, [personName, props, assetOptions.length]);

  return (
    <FormControl
      sx={{
        "& .MuiFormLabel-root": {
          color: theme.palette.neutral.main,
        },
        "& .MuiFormLabel-root.Mui-focused": {
          color: theme.palette.secondary.main,
        },
        m: 1,
        marginLeft: "auto",
        marginRight: "auto",
        width: {
          xs: "90%",
          sm: "75%",
          md: "450px",
        },
      }}
      color="secondary"
    >
      <InputLabel>Assets</InputLabel>
      {assetOptions.length === 0 ? (
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Assets" />}
          MenuProps={MenuProps}
          sx={{
            "& MuiFormLabel-root": {
              color: theme.palette.primary,
            },
          }}
        >
          <MenuItem
            value={props["defaultAsset"]}
            style={getStyles(props["defaultAsset"], personName, theme)}
          >
            {props["defaultAsset"]}
          </MenuItem>
          <MenuItem disabled value={null}>
            <Skeleton animation="wave" width="100%" height="30px" />
          </MenuItem>
          <MenuItem disabled value={null}>
            <Skeleton animation="wave" width="100%" height="30px" />
          </MenuItem>
          <MenuItem disabled value={null}>
            <Skeleton animation="wave" width="100%" height="30px" />
          </MenuItem>
        </Select>
      ) : (
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Assets" />}
          MenuProps={MenuProps}
          sx={{
            "& MuiFormLabel-root": {
              color: theme.palette.primary,
            },
          }}
        >
          {assetOptions.map((opt) => (
            <MenuItem
              key={opt}
              value={opt}
              style={getStyles(opt, personName, theme)}
            >
              {opt}
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  );
}
