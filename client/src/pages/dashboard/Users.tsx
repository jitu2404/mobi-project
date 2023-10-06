import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  IconButton,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { routingVariants } from "../../utils/animation";
import { Add, Edit, Visibility } from "@mui/icons-material";

const Users = () => {
  const [pageNum, setPageNum] = useState(1);
  const navigate = useNavigate();
  const [users, setUsers] = useState<PaginatedUsers | null>(null);
  const [user, setUser] = useState<User>({} as User);
  const getData = async () => {
    const res = await axios.get("/api/user/all/?page=" + pageNum);
    const data = res.data;
    setUsers(data.users);
  };
  const getUser = async () => {
    const res = await axios.get("/api/user");
    const data = res.data;
    setUser(data);
  };
  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getData();
  }, [pageNum]);

  const handlePageChange = (_e: ChangeEvent<unknown>, pageNumber: number) => {
    setPageNum(pageNumber);
  };
  if (user?.role !== "superadmin")
    return (
      <Typography variant="h3" padding={5}>
        You are not authorized to view this page
      </Typography>
    );
  return (
    <motion.section {...routingVariants} className="p-5 grow">
      <Typography variant="h2" marginY={5}>
        Users Management
      </Typography>
      <Stack gap={2} direction={"row"}>
        {["superadmin"].includes(String(user?.role)) && (
          <Button
            onClick={() => navigate("/dashboard/signup-admin")}
            endIcon={<Add />}
            sx={{ marginBottom: 5 }}
            variant="outlined"
          >
            Add Admin
          </Button>
        )}
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Role</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.docs.map(
              (userByID, index) =>
                userByID.role !== "superadmin" && (
                  <TableRow
                    key={`${userByID.fullName}-${index}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">{userByID.fullName}</TableCell>
                    <TableCell align="left">{userByID.email}</TableCell>
                    <TableCell align="left">
                      {userByID.role === "superadmin" && "Super Admin"}
                      {userByID.role === "admin" && "Admin"}
                      {userByID.role === "user" && "User"}
                    </TableCell>
                    <TableCell align="left">
                      <Stack direction={"row"} gap={2}>
                        <Tooltip title="View Profile">
                          <IconButton
                            onClick={() =>
                              navigate("/dashboard/profile/" + userByID._id)
                            }
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit Permissions">
                          <IconButton
                            onClick={() =>
                              navigate(
                                "/dashboard/users/permissions/" + userByID._id
                              )
                            }
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
        <Stack
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row",
          }}
          padding={5}
        >
          <Pagination
            count={users?.totalPages}
            page={pageNum}
            onChange={handlePageChange}
          />
        </Stack>
      </TableContainer>
    </motion.section>
  );
};

export default Users;
