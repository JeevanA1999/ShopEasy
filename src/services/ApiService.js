export class ApiService {
  static async fetchProducts(page = 1, limit = 20, search = '', category = '') {
    try {
      let url = `https://catalog-management-system-dev-ak3ogf6zeauc.a.run.app/cms/products?page=${page}&limit=${limit}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      // Texpected format
      return this.transformApiResponse(data, page, limit, search, category);
    } catch (error) {
      console.warn('API Error, using mock data:', error);
      return this.getMockData(page, limit, search, category);
    }
  }

  static transformApiResponse(apiData, page, limit, search, category) {
    // actual API products to our expected format
    const transformedProducts = apiData.products?.map(product => ({
      id: product.id || product.gtin,
      name: product.name,
      price: product.mrp?.mrp || Math.floor(Math.random() * 500) + 10,
      category: product.main_category || 'General',
      description: product.description || product.derived_description || `High-quality ${product.name} with excellent features.`,
      image: product.images?.front || `https://picsum.photos/400/400?random=${product.gtin}`,
      stock: Math.floor(Math.random() * 100) + 1,
      brand: product.brand || product.company_detail?.brand || 'Generic Brand',
      rating: (Math.random() * 5).toFixed(1),
      features: [
        'High Quality Materials',
        'Durable Construction',
        'Easy to Use',
        'Value for Money'
      ],
      gtin: product.gtin,
      sellingUnit: product.sellingUnit || 'nos',
      isLocalProduct: product.isLocalProduct === 'Yes'
    })) || [];

    return {
      products: transformedProducts,
      total: parseInt(apiData.totalResults) || transformedProducts.length,
      page: parseInt(apiData.currentPage) || page,
      totalPages: parseInt(apiData.totalPages) || Math.ceil(transformedProducts.length / limit),
      currentPageResults: parseInt(apiData.currentPageResults) || transformedProducts.length
    };
  }

  static getMockData(page = 1, limit = 20, search = '', category = '') {
   
    const mockProducts = this.generateEnhancedMockProducts(200);
    let filteredProducts = [...mockProducts];
    
    if (search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category === category
      );
    }
    
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);
    
    return {
      products: paginatedProducts,
      total: filteredProducts.length,
      page,
      totalPages: Math.ceil(filteredProducts.length / limit),
      currentPageResults: paginatedProducts.length
    };
  }

  static generateEnhancedMockProducts(count = 200) {
    const categories = [
      'HOUSE HOLD NEEDS', 
      'CLEANING & HOUSEHOLD', 
      'ELECTRONICS', 
      'FOOD & BEVERAGES', 
      'PERSONAL CARE',
      'HOME & KITCHEN',
      'SPORTS & FITNESS',
      'BOOKS & STATIONERY'
    ];
    
    const householdProducts = [
      'KOLORR ROYAL PEDAL BIN LARGE', 'RTN DLX BUCKET 18L', 'RTN ROYAL TUB NO:1', 
      'RTN BASIN NO:16', 'RN SUPER SAVER BUCKET 25LTR', 'Plastic Storage Container',
      'Laundry Basket', 'Dustbin with Lid', 'Water Bottle', 'Food Container'
    ];
    
    const electronicProducts = [
      'Wireless Bluetooth Headphones', 'Smart Watch Fitness Tracker', 'LED Desk Lamp',
      'Power Bank 10000mAh', 'Bluetooth Speaker', 'USB Cable', 'Phone Stand',
      'Wireless Charger', 'Tablet Holder', 'Cable Organizer'
    ];
    
    const foodProducts = [
      'Organic Rice 5KG', 'Premium Tea Leaves', 'Fresh Coffee Beans', 'Cooking Oil 1L',
      'Basmati Rice', 'Wheat Flour', 'Sugar 1KG', 'Salt 1KG', 'Spice Mix', 'Honey 500g'
    ];
    
    const personalCareProducts = [
      'Premium Face Wash', 'Moisturizing Lotion', 'Shampoo 400ml', 'Body Soap',
      'Toothbrush Set', 'Hand Sanitizer', 'Face Cream', 'Body Lotion', 'Hair Oil', 'Sunscreen'
    ];
    
    const allProducts = [...householdProducts, ...electronicProducts, ...foodProducts, ...personalCareProducts];
    
    return Array.from({ length: count }, (_, index) => {
      const categoryIndex = index % categories.length;
      const category = categories[categoryIndex];
      
      let productName;
      switch (category) {
        case 'HOUSE HOLD NEEDS':
        case 'CLEANING & HOUSEHOLD':
          productName = householdProducts[index % householdProducts.length];
          break;
        case 'ELECTRONICS':
          productName = electronicProducts[index % electronicProducts.length];
          break;
        case 'FOOD & BEVERAGES':
          productName = foodProducts[index % foodProducts.length];
          break;
        case 'PERSONAL CARE':
          productName = personalCareProducts[index % personalCareProducts.length];
          break;
        default:
          productName = allProducts[index % allProducts.length];
      }
      
      return {
        id: `mock-${index + 1}`,
        name: `${productName} ${Math.floor(index / allProducts.length) + 1}`,
        price: Math.floor(Math.random() * 500) + 10,
        category: category,
        description: `High-quality ${productName.toLowerCase()} with excellent features and premium quality. Perfect for daily use with long-lasting durability.`,
        image: `https://picsum.photos/400/400?random=${index + 1}`,
        stock: Math.floor(Math.random() * 100) + 1,
        brand: `Brand ${Math.floor(index / 10) + 1}`,
        rating: (Math.random() * 5).toFixed(1),
        features: [
          'High Quality Materials',
          'Long Lasting',
          'Easy to Use',
          'Excellent Value',
          'Eco-Friendly'
        ],
        gtin: `82541${String(index).padStart(7, '0')}`,
        sellingUnit: 'nos',
        isLocalProduct: Math.random() > 0.3
      };
    });
  }
}