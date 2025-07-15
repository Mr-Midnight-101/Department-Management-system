import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import GlassEffect from "../../components/GlassEffect";
import { getColorTokens } from "../../theme/theme";

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const colors = getColorTokens(useTheme().palette.mode);
  useEffect(() => {
    axios
      .get("/api//v1/recentactivity")
      .then((res) => setActivities(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <GlassEffect>
      <Typography variant="h6" gutterBottom color={colors.text[100]}>
        Recent Activity
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: colors.text[100] }}>Date</TableCell>
            <TableCell sx={{ color: colors.text[100] }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activities.map((act, i) => (
            <TableRow key={i}>
              <TableCell sx={{ color: colors.text[100] }}>
                {new Date(act.date).toLocaleDateString()}
              </TableCell>
              <TableCell sx={{ color: "#ccc" }}>{act.message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </GlassEffect>
  );
};

export default RecentActivity;
