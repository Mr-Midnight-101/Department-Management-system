import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome"; // Make sure this path is correct
import { getColorTokens } from "../theme/theme";

const GridWrapper = ({ columns, rows, isDatafetched }) => {
  const apiRef = useGridApiRef();
  const theme = useTheme();
  const colors = getColorTokens(theme.palette.mode);

  const handleResizeColumns = () => {
    if (apiRef.current?.autosizeColumns) {
      apiRef.current.autosizeColumns({
        includeHeaders: true,
        includeOutliers: true,
      });
    } else {
      console.warn(
        "autosizeColumns is not available in this DataGrid version."
      );
    }
  };
  const flexibleColumns = columns.map((col) => ({
    ...col,
    minWidth:
      col?.headerName == "S.No."
        ? 60
        : col?.headerName == "Actions"
        ? 160
        : 100,
    headerAlign: "center",
  }));

  return (
    <>
      <Box height="60vh" width="100%" m="24px 0">
        <DataGrid
          apiRef={apiRef}
          rows={rows}
          columns={flexibleColumns}
          loading={!isDatafetched}
          disableColumnSelector
          disableRowSelectionOnClick
          disableColumnResize
          sx={{
            width: "100%",
            height: "100%",
          }}
        />
      </Box>

      <Box display="flex" justifyContent="flex-end" m="4px 0">
        <IconButton
          onClick={handleResizeColumns}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderRadius: 1,
            px: 2,
            color: colors.text[100],
            background: colors.gradient[100],
          }}
        >
          <AutoAwesomeIcon />
          <Typography
            variant="h5"
            sx={{
              lineHeight: 1,
              fontWeight: { xs: 200, sm: 400 },
              color: colors.text[100],
            }}
          >
            Resize
          </Typography>
        </IconButton>
      </Box>
    </>
  );
};

export default GridWrapper;
