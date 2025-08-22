import React, { useState, useEffect, useCallback } from 'react';
import {
  DataGrid,
  GridToolbar,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import {
  Box,
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
  Alert,
  Snackbar,
  Avatar, Chip,
} from '@mui/material';
import { Search, Visibility, Add } from '@mui/icons-material';
import { ApiService } from '../services/ApiService';
import { StorageHelper } from '../services/StorageHelper';
import { useAuth } from '../contexts/AuthContext';
import { Header } from './Header';
import { ConnectionStatus } from './ConnectionStatus';
import { LoadingSpinner } from './LoadingSpinner';

export const Dashboard = ({ onProductClick, onCartClick, cartItemsCount }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortModel, setSortModel] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
  const [totalRows, setTotalRows] = useState(0);
  const [categories, setCategories] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { addToCart } = useAuth();

  // Load  filters
  useEffect(() => {
    const savedFilters = StorageHelper.getItem('dashboardFilters');
    const savedPagination = StorageHelper.getItem('dashboardPagination');

    if (savedFilters) {
      setSearchTerm(savedFilters.searchTerm || '');
      setCategoryFilter(savedFilters.categoryFilter || '');
      setSortModel(savedFilters.sortModel || []);
    }
    if (savedPagination) {
      setPaginationModel(savedPagination);
    }
  }, []);

  // Persist filters
  useEffect(() => {
    StorageHelper.setItem('dashboardFilters', { searchTerm, categoryFilter, sortModel });
  }, [searchTerm, categoryFilter, sortModel]);

  useEffect(() => {
    StorageHelper.setItem('dashboardPagination', paginationModel);
  }, [paginationModel]);

  // Load products
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const apiPage = paginationModel.page + 1;
      const response = await ApiService.fetchProducts(
        apiPage,
        paginationModel.pageSize,
        searchTerm,
        categoryFilter
      );
      
      let productData = response.products || [];
      
      // Check  offline mode
      const usingMockData = productData.some(p => p.id && p.id.toString().startsWith('mock-'));
      setIsOffline(usingMockData);
      
      // Apply  sorting
      if (sortModel.length > 0) {
        const sortField = sortModel[0].field;
        const sortDir = sortModel[0].sort;
        productData.sort((a, b) => {
          let aVal = a[sortField];
          let bVal = b[sortField];
          
      
          if (sortField === 'price' || sortField === 'stock') {
            aVal = Number(aVal) || 0;
            bVal = Number(bVal) || 0;
          }
          
          if (sortDir === 'asc') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
      }
      
      setProducts(productData);
      setTotalRows(response.total || 0);
      
      const uniqueCategories = [...new Set(productData.map(p => p.category))];
      setCategories(uniqueCategories);
      
    } catch (err) {
      setError('Failed to load products. Please check your connection.');
      setIsOffline(true);
      console.error('Load products error:', err);
    } finally {
      setLoading(false);
    }
  }, [paginationModel, searchTerm, categoryFilter, sortModel]);

  useEffect(() => {
    const timeoutId = setTimeout(loadProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [loadProducts]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setSnackbar({
      open: true,
      message: `${product.name} added to cart`,
      severity: 'success'
    });
  };

  const handleRetryConnection = () => {
    loadProducts();
  };

  const columns = [
    {
      field: 'image',
      headerName: '',
      width: 100,
      renderCell: (params) => (
        <Avatar
          src={params.value}
          alt={params.row.name}
          variant="rounded"
          sx={{ width: 60, height: 60, cursor: 'pointer' }}
          onClick={() => onProductClick(params.row)}
        />
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: 'name',
      headerName: 'Product Name',
      flex: 1,
      minWidth: 300,
      renderCell: (params) => (
        <Box sx={{ cursor: 'pointer' }} onClick={() => onProductClick(params.row)}>
          <Typography variant="body1" fontWeight="medium">
            {params.value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {params.row.brand}
            {params.row.isLocalProduct && (
              <Chip 
                label="Local" 
                size="small" 
                variant="outlined" 
                sx={{ ml: 1, height: 20 }}
              />
            )}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 180,
      renderCell: (params) => (
        <Chip label={params.value} variant="outlined" size="small" />
      ),
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      type: 'number',
      renderCell: (params) => (
        <Typography variant="h6" color="primary" fontWeight="bold">
          ₹{params.value?.toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'stock',
      headerName: 'Stock',
      width: 100,
      type: 'number',
      renderCell: (params) => (
        <Chip
          label={`${params.value} left`}
          color={params.value > 20 ? 'success' : params.value > 5 ? 'warning' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2">⭐ {params.value}</Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'View / Add',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Visibility />}
          label="View Details"
          onClick={() => onProductClick(params.row)}
        />,
        <GridActionsCellItem
          icon={<Add />}
          label="Add to Cart"
          onClick={() => handleAddToCart(params.row)}
        />,
      ],
    },
  ];

  return (
    <Box>
      <Header 
        onCartClick={onCartClick} 
        cartItemsCount={cartItemsCount}
        isOffline={isOffline}
        onRetryConnection={handleRetryConnection}
      />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <ConnectionStatus isOffline={isOffline} onRetry={handleRetryConnection} />
        
       
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Search Products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body1" color="primary" fontWeight="medium">
                📦 {totalRows} products found
              </Typography>
              {isOffline && (
                <Typography variant="body2" color="warning.main">
                  Showing cached results
                </Typography>
              )}
            </Grid>
          </Grid>
        </Paper>

       
        {error && (
          <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

    
        <Paper elevation={3}>
          <DataGrid
            rows={products}
            columns={columns}
            loading={loading}
            paginationMode="server"
            rowCount={totalRows}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 20, 50, 100]}
            sortingMode="client"
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: { showQuickFilter: false },
            }}
            sx={{
              height: 700,
              '& .MuiDataGrid-cell': {
                display: 'flex',
                alignItems: 'center',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          />
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
export default Dashboard;