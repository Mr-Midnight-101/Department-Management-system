/* eslint-disable no-unused-vars */
import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "data",
    headerName: "data",
    width: 150,
    editable: true,
  },
  {
    field: "count",
    headerName: "count",
    type: "number",
    width: 110,
    editable: true,
  },
];

export default function DataGridDemo() {
  const [loading, setLoading] = useState();
  const [rows, setRows] = useState([]);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get("/api/count");
      const output = response.data.data;
      const statsArray = Object.entries(output).map(([key, value], index) => ({
        id: index + 1,
        data: key,
        count: value,
      }));
      setRows(statsArray);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDocuments();
  });

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
