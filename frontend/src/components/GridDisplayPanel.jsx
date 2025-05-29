/* eslint-disable no-unused-vars */
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { DataGrid } from "@mui/x-data-grid";

const GridDisplayPanel = ({
  tableColumns,
  tableRows,
  themeColors,
  openRegisterDialog,
  tableHeading,
  addButtonLabel,
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        m: {
          xs: 2,
          md: 2,
        },
        mr: {
          xs: 12,
          md: 12,
          lg: 12,
          xl: 2,
        },
      }}
    >
      <Box
        // bgcolor={colors.grey[100]}

        display="flex"
        justifyContent="space-between"
        sx={{
          gap: {
            xs: 1,
            sm: 0,
          },
          my: 2,
          mr: 0,

          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "1.6rem",
              sm: "2rem",
            },
          }}
        >
          {tableHeading}
        </Typography>
        <IconButton
          onClick={() => openRegisterDialog(true)}
          sx={{
            gap: 1,
            display: "flex",
            alignItems: "center",
            borderRadius: 1,
            background: themeColors.grey[800],
          }}
        >
          <PersonAddIcon />
          <Typography
            variant="h5"
            sx={{
              lineHeight: 1,
              fontWeight: {
                xs: 200,
                sm: 400,
              },
            }}
          >
            {addButtonLabel}
          </Typography>
        </IconButton>
      </Box>

      {/* //* Datagrid for backend */}

      <Box
        height="70vh"
        maxWidth="100%"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeader": {
            borderBottom: "none",
            background: themeColors.black[700],
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: themeColors.grey[800],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            background: themeColors.black[800],
          },
          "& .MuiDataGrid-cell:hover": {
            color: themeColors.red[500],
            cursor: "pointer",
          },
          mr: {
            xl: 0,
          },
        }}
      >
        {/* DataGrid showing student rows */}
        <DataGrid
          disableColumnResize
          disableColumnSelector
          columns={tableColumns}
          rows={tableRows}
        />
      </Box>
    </Box>
  );
};

export default GridDisplayPanel;
