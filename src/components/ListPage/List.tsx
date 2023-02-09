import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import axios from "axios";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InfoIcon from '@mui/icons-material/Info';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import { useDispatch, useSelector } from "react-redux";
import { IAppState } from "../../store/app";
interface Data {
  address: string;
  agent_name: string;
  completion_date: string;
  created_at: string;
  district: string;
  launch_date: string;
  mrt: string;
  photo_url: string;
  property_type: string;
  title: string;
  agent_id: number;
  district_id: number;
  id: number;
  max_bed: number;
  max_price: number;
  min_bed: number;
  min_price: number;
  number_of_available: number;
  number_of_units: number;
  price: number;
  mrt_id: number;
  max_area: number | null;
  max_bath: number | null;
  min_area: number | null;
  property_type_id: number | null;
  tenure_id: number | null;
  min_bath: number | null;
  action: string;
}

type Order = 'asc' | 'desc';

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'id',
  },
  {
    id: 'title',
    numeric: false,
    disablePadding: false,
    label: 'title',
  },
  {
    id: 'address',
    numeric: false,
    disablePadding: false,
    label: 'address',
  },
  {
    id: 'min_price',
    numeric: false,
    disablePadding: false,
    label: 'min_price',
  },
  {
    id: 'max_price',
    numeric: false,
    disablePadding: false,
    label: 'max_price',
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: false,
    label: 'action',
  },
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function EnhancedTable() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('id');
  const [items, setItems] = useState([]);
  const [totals, setTotals] = useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [open, setOpen] = React.useState(false);
  const [detail, setDetail] = useState([]);

  const dispatch = useDispatch();

  const text = useSelector(
    ({ app }: { app: IAppState }) => app.payload.text,
  );

  const minPrice = useSelector(
    ({ app }: { app: IAppState }) => app.payload.minPrice,
  );

  const maxPrice = useSelector(
    ({ app }: { app: IAppState }) => app.payload.maxPrice,
  );

  const setText = (text: string) => {
    dispatch({
      type: 'setText',
      payload: {
          text: text,
          minPrice: minPrice,
          maxPrice: maxPrice,
      },
    })
  }

  const setMinPrice = (minPrice: string) => {
    dispatch({
      type: 'setMinPrice',
      payload: {
          text: text,
          minPrice: minPrice,
          maxPrice: maxPrice,
      },
    })
  }

  const setMaxPrice = (maxPrice: string) => {
    dispatch({
      type: 'setMaxPrice',
      payload: {
          text: text,
          minPrice: minPrice,
          maxPrice: maxPrice,
      },
    })
  }

  const filter = {
    q: text,
    _start: page * rowsPerPage,
    // _end: (page + 1) * rowsPerPage,
    _sort: orderBy,
    _order: order ? order.toLocaleUpperCase() : '',
    min_price: minPrice,
    max_price: maxPrice,
  }

  const fetchData = async () => {
    await axios.get("https://api.gohomey.com/projects", { params: filter })
      .then(
        (result: any) => {
          const data = result.data.projects;
          setTotals(result.data.projects.length)
          data.length = rowsPerPage;
          setItems(data);
        },
        (error) => {
          setItems([]);
          setTotals(0)
        }
      )
  }

  const fetchDataDetail = async (id: number) => {
    await axios.get("https://api.gohomey.com/projects/" + id)
      .then(
        (result: any) => {
          if (result && result.data && typeof result.data === "object") {
            let dataDetail: any = []
            Object.keys(result.data).map((item, index) => {
              dataDetail = [...dataDetail, {
                key: item,
                value: Object.values(result.data)[index]
              }]
            })
            setDetail(dataDetail);
          }
        },
      )
  }

  useEffect(() => {
    fetchData()
  }, [order, orderBy, page, rowsPerPage])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const goDetail = (id: number) => {
    fetchDataDetail(id)
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="xl" >
      <Box sx={{ width: '100%', p: 2 }}>
        <Paper sx={{ width: '100%', p: 2 }}>
          <TextField label="Search" variant="standard" value={text}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setText(event?.target?.value) }} />
          <TextField label="Min Price" variant="standard" value={minPrice} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setMinPrice(event?.target?.value) }} />
          <TextField label="Max Price" variant="standard" value={maxPrice} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setMaxPrice(event?.target?.value) }} />
          <Button variant="contained" onClick={() => fetchData()}>Search</Button>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size='medium'
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {
                  items.map((row: any) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        <TableCell align="left">{row.id}</TableCell>
                        <TableCell align="left">{row.title}</TableCell>
                        <TableCell align="left">{row.address}</TableCell>
                        <TableCell align="left">{row.min_price}</TableCell>
                        <TableCell align="left">{row.max_price}</TableCell>
                        <TableCell align="left">
                          <Button onClick={() => goDetail(+row.id)}><InfoIcon /></Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[20, 50, 100]}
            component="div"
            count={totals}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Detail
        </DialogTitle>
        <DialogContent>
          <List>
            {detail.map((itemDetail: any) => (
              <ListSubheader key={itemDetail.key}>{`${itemDetail.key}: ${itemDetail.value}`}</ListSubheader>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Container>
  );
}