import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { getColorTokens } from "../theme/theme";
import { AutoAwesomeIcon } from "../utils/icons";

const GridWrapper = ({ columns, rows, isDatafetched }) => {
  //autosize of column
  const autosizeOptions = {
    includeOutliers: true,
  };
  const apiRef = useGridApiRef();
  //theme setup
  const theme = useTheme();
  const colors = getColorTokens(theme.palette.mode);
  return (
    <>
      <Box
        maxHeight="60vh"
        maxWidth="98vw"
        width="100%"
        m="24px 0"
        sx={{
          "& .MuiDataGrid-filler": {
            background: `${colors.primary[900]} !important`,
          },
          "& .MuiDataGrid-root": {
            border: "none",
            background: `${colors.primary[900]} !important`,
            color: `${colors.text[100]} !important`,
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: `${colors.clay[100]} !important`,
          },
          "& .MuiDataGrid-row": {
            background: `${colors.primary[900]} !important`,
            "&.Mui-selected": {
              backgroundColor: `${colors.pink[100]} !important`,
              "&:hover": {
                backgroundColor: `${colors.ArtyClick[100]} !important`,
              },
            },
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            fontSize: "0.9rem",
          },
          "& .MuiDataGrid-columnHeader": {
            borderBottom: "none",
            background: `${colors.primary[900]} !important`,
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: `${colors.grey[100]} !important`,
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: `${colors.primary[900]} !important`,
          },
          "& .MuiDataGrid-cell:hover": {
            cursor: "pointer",
          },
          mr: { xl: 0 },
        }}
      >
        <DataGrid
          sx={{
            maxHeight: "60vh",
            maxWidth: "100vw",
            width: "100%",
          }}
          rowBufferPx={10}
          loading={!isDatafetched}
          slotProps={{
            loadingOverlay: {
              variant: "skeleton",
              noRowsVariant: "skeleton",
            },
          }}
          apiRef={apiRef}
          autosizeOptions={autosizeOptions}
          disableColumnResize
          disableColumnSelector
          columns={columns}
          rows={rows}
        />
      </Box>
      <Box display="flex" justifyContent="flex-end" m="4px  0">
        <IconButton
          onClick={() => apiRef.current?.autosizeColumns(autosizeOptions)}
          sx={{
            gap: 1,
            display: "flex",
            alignItems: "center",
            borderRadius: 1,
            background: colors.primary[900],
            backgroundPosition: "center",
            color: colors.text[100],
            "&:hover": {
              background: colors.gradient[100],
            },
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
            Re-size Column
          </Typography>
        </IconButton>
      </Box>
    </>
  );
};

export default GridWrapper;
